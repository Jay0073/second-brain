import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

type FilterState = {
  types?: string[];
  tags?: string[];
  sort?: "date" | "relevance";
};

type NoteRow = { tags?: string[]; type?: string; created_at?: string; [key: string]: unknown };

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, filters } = (await req.json()) as {
      query?: string | null;
      filters?: FilterState;
    };

    const filterState = filters ?? {};
    const hasQuery = query && query.trim().length > 0;
    const sortBy = filterState.sort ?? "date";

    const typeFilter = (filterState.types && filterState.types.length > 0) 
    ? filterState.types[0].toLowerCase() 
    : null;

    // ---------------------------------------------------------
    // SCENARIO 1: NO SEARCH QUERY (Just browsing/filtering)
    // ---------------------------------------------------------
    if (!hasQuery) {
      let queryBuilder = supabase.from("notes").select("*");

      // 1. Filter by Type (SQL level is faster)
      if (filterState.types && filterState.types.length > 0) {
        const normalizedTypes = filterState.types.map((t) => t.toLowerCase());
        queryBuilder = queryBuilder.in("type", normalizedTypes);
      }

      // 2. Sort by Date (Default for browsing)
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
      queryBuilder = queryBuilder.limit(50);

      const { data, error } = await queryBuilder;
      if (error) throw error;

      let results = data ?? [];

      // 3. Filter by Tags (Client-side for flexibility)
      if (filterState.tags && filterState.tags.length > 0) {
        results = (results as NoteRow[]).filter((item) => {
          const itemTags = Array.isArray(item.tags) ? item.tags : [];
          return filterState.tags!.some((tag) => itemTags.includes(tag));
        });
      }

      return NextResponse.json(results.slice(0, 20));
    }

    // ---------------------------------------------------------
    // SCENARIO 2: HAS SEARCH QUERY (Always use Vector Search)
    // ---------------------------------------------------------
    const embedding = await generateEmbedding(query);

    const { data: vectorResults, error: vectorError } = await supabase.rpc(
      "match_notes",
      {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 20, // Fetch more to allow for filtering
        filter_type: typeFilter,
      }
    );

    if (vectorError) throw vectorError;

    let filtered = vectorResults ?? [];

    // 1. Apply Type Filter
    if (filterState.types && filterState.types.length > 0) {
      const normalizedTypes = filterState.types.map((t) => t.toLowerCase());
      filtered = (filtered as NoteRow[]).filter((item) =>
        normalizedTypes.includes((item.type || "note").toLowerCase())
      );
    }

    // 2. Apply Tags Filter
    if (filterState.tags && filterState.tags.length > 0) {
      filtered = (filtered as NoteRow[]).filter((item) => {
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        return filterState.tags!.some((tag) => itemTags.includes(tag));
      });
    }

    // 3. Handle Sorting
    // Vector search returns by 'relevance' (similarity) by default.
    // If user specifically asked for 'Date', we re-sort the RELEVANT results by date.
    if (sortBy === "date") {
      (filtered as NoteRow[]).sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    }

    return NextResponse.json(filtered.slice(0, 20));

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}