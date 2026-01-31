import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Generate Embeddings (The mathematical representation of the note)
export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// 2. Generate Summary & Tags (The intelligent synthesis)
export async function generateSummaryAndTags(content: string, userName?: string | null) {
  const model = genAI.getGenerativeModel({ model: "models/gemma-3-4b-it" });

  const prompt = `
    You are ${userName ? userName + "'s" : "the user's"} Second Brain. 
    Analyze the following note content written by ${userName || "the user"}.

     Your goal is to ensure no detail is lost.
    1. Write a summary in the FIRST PERSON ACTIVE VOICE (e.g., "I went to...", "I read...", "I thought about..."). 
       - Assume the user wrote the note, so "I" refers to the user.
       - Keep the summary simple and preserve the original intent.
    2. Extract 2-3 relevant hashtags (keywords).
    
    Return ONLY a JSON object:
    {
      "summary": "the detailed first-person summary",
      "tags": ["tag1", "tag2", "tag3"],
      "title": "A short generated title if one wasn't provided"
    }
    
    Note Content:
    "${content.substring(0, 5000)}" 
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean up markdown code blocks if Gemini adds them
  const jsonString = text.replace(/```json|```/g, "").trim();

  return JSON.parse(jsonString);
}