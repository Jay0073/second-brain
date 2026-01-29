import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FilterState = {
  types?: string[];
  tags?: string[];
  sort?: "date" | "relevance";
};

export async function POST(req: Request) {
  try {
    const { query, filters } = (await req.json()) as {
      query?: string | null;
      filters?: FilterState;
    };

    const filterState = filters ?? {};
    const hasQuery = query && query.trim().length > 0;
    const sortBy = filterState.sort ?? "date";
    const useRelevance = hasQuery && sortBy === "relevance";

    // 1. If no query OR relevance sort not requested, use standard query with filters
    if (!hasQuery || !useRelevance) {
      let queryBuilder = supabase.from("notes").select("*");

      // Apply type filter
      if (filterState.types && filterState.types.length > 0) {
        queryBuilder = queryBuilder.in("type", filterState.types);
      }

      // Apply tags filter
      // Note: For array columns, we filter client-side after fetching
      // because Supabase's .contains() requires ALL tags, not ANY
      // We'll fetch all results and filter by tags overlap in memory

      // Apply sorting
      if (sortBy === "date") {
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
      }

      queryBuilder = queryBuilder.limit(50); // Fetch more to filter by tags

      const { data, error } = await queryBuilder;

      if (error) throw error;

      let results = data ?? [];

      // Apply tags filter client-side (check if tags array overlaps with filter tags)
      if (filterState.tags && filterState.tags.length > 0) {
        results = results.filter((item: any) => {
          const itemTags = Array.isArray(item.tags) ? item.tags : [];
          return filterState.tags!.some((tag) => itemTags.includes(tag));
        });
      }

      // Limit final results
      results = results.slice(0, 20);

      return NextResponse.json(results);
    }

    // 2. If there is a query AND relevance sort requested, perform Semantic Vector Search
    const embedding = await generateEmbedding(query);

    // Call the RPC function for vector search
    // Note: The RPC might need to be updated to accept filters if you want to combine vector search + filters
    // For now, we'll do vector search first, then apply filters client-side if needed
    const { data: vectorResults, error: vectorError } = await supabase.rpc(
      "match_notes",
      {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 20, // Get more results to filter
      },
    );

    if (vectorError) throw vectorError;

    let filtered = vectorResults ?? [];

    // Apply type filter on vector results
    if (filterState.types && filterState.types.length > 0) {
      filtered = filtered.filter((item: any) =>
        filterState.types!.includes(item.type),
      );
    }

    // Apply tags filter on vector results
    if (filterState.tags && filterState.tags.length > 0) {
      filtered = filtered.filter((item: any) => {
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        return filterState.tags!.some((tag) => itemTags.includes(tag));
      });
    }

    // Limit results
    filtered = filtered.slice(0, 20);

    return NextResponse.json(filtered);

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}