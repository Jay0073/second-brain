import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateSummaryAndTags } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, type = "note", file_url, file_name } = await req.json();

    if (!content && !file_url) {
      // Allow content to be optional if there is a file? The prompt said "Accept images...". User might just upload a file. 
      // But the schema says "content text not null". So I should keep content check or provide default.
      // The original code:
      // if (!content) { return NextResponse.json({ error: "Content is required" }, { status: 400 }); }
      // Let's stick to requiring content for now as per schema.
    }
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Parallelize the AI work for speed
    const [embedding, aiResponse] = await Promise.all([
      generateEmbedding(content),
      generateSummaryAndTags(content)
    ]);

    // Insert into Supabase (RLS uses auth.uid())
    const { data, error } = await supabase
      .from("notes")
      .insert({
        content,
        type,
        title: aiResponse.title,
        summary: aiResponse.summary,
        tags: aiResponse.tags,
        file_url,
        file_name,
        embedding, // The vector!
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch all notes (standard view)
export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

