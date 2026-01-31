import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { text?: string };
    const text = (body.text ?? "").trim();

    if (!text) {
      return NextResponse.json({ answer: "" });
    }

    const model = genAI.getGenerativeModel({ model: "models/gemma-3-4b-it" });

    const prompt = `
      You are a helpful writing assistant.
      Rephrase the following text to be clearer and more concise, while preserving the original meaning and tone.
      Do not add any conversational filler like "Here is the rewritten text". Just give me the text.

      Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ answer: response });
  } catch (error) {
    console.error("Rewrite error:", error);
    return NextResponse.json({ error: "Failed to rewrite" }, { status: 500 });
  }
}

