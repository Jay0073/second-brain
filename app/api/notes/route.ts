import { createClient } from "@supabase/supabase-js";
import { generateEmbedding, generateSummaryAndTags } from "@/lib/ai";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { content, type = "note" } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Parallelize the AI work for speed
    const [embedding, aiResponse] = await Promise.all([
      generateEmbedding(content),
      generateSummaryAndTags(content)
    ]);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("notes")
      .insert({
        content,
        type,
        title: aiResponse.title,
        summary: aiResponse.summary,
        tags: aiResponse.tags,
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
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}

