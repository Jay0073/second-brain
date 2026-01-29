import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. Generate Embeddings (The mathematical representation of the note)
export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// 2. Generate Summary & Tags (The intelligent synthesis)
export async function generateSummaryAndTags(content: string) {
  const model = genAI.getGenerativeModel({ model: "models/gemma-3-4b-it" });
  
  const prompt = `
    Analyze the following note content.
    1. Create a concise 1-sentence summary.
    2. Extract 3-5 relevant hashtags (keywords).
    
    Return ONLY a JSON object:
    {
      "summary": "The summary text...",
      "tags": ["tag1", "tag2", "tag3"],
      "title": "A short generated title if one wasn't provided"
    }
    
    Note Content:
    "${content.substring(0, 1000)}" 
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Clean up markdown code blocks if Gemini adds them
  const jsonString = text.replace(/```json|```/g, "").trim();
  
  return JSON.parse(jsonString);
}