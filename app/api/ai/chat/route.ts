import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = (await req.json()) as { message?: string };

    // 1. Search for relevant notes (The "Recall" phase) — uses RLS
    const embedding = await generateEmbedding(message ?? "");

    const { data: notes } = await supabase.rpc("match_notes", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5,
    });

    // 2. Construct the Context Block
    const contextText = notes
      ?.map(
        (note: { created_at?: string; title?: string; summary?: string }) =>
          `[${note.created_at}] ${note.title}: ${note.summary}`
      )
      .join("\n\n");

    // 3. Ask Gemini (The "Synthesis" phase)
    const model = genAI.getGenerativeModel({ model: "models/gemma-3-4b-it" });

    const userName = session.user.user_metadata?.full_name?.split(" ")[0];

    const prompt = `
      You are ${userName ? userName + "'s" : "the user's"} Second Brain. 
      Answer their question based ONLY on the context provided below.
      
      tone & Style:
      - Addressed the user directly as "you".
      - Be conversational and warm.
      - If the answer isn't in the context, say "I don't recall that right now." but be nice.
      - Use the context to formulate a response that feels like a memory recall.
      
      ---
      Context from Memory:
      ${contextText ?? ""}
      ---
      
      ${userName ? userName + "'s" : "User"} Question: ${message ?? ""}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ answer: response, sources: notes });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to chat" }, { status: 500 });
  }
}
