import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Setup clients
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function migrateEmbeddings() {
  // 2. Fetch all notes that need updating (can filter by date if needed)
  const { data: notes, error: fetchError } = await supabase
    .from('notes')
    .select('id, content');

  if (fetchError) throw fetchError;
  console.log(`Found ${notes.length} notes to migrate...`);

  for (const note of notes) {
    try {
      // 3. Generate new embedding with 768 dimensions to match your DB schema
      const result = await model.embedContent({
        content: { role: "user", parts: [{ text: note.content }] },
        outputDimensionality: 768, // Crucial for pgvector(768) compatibility
      } as any);

      const newEmbedding = result.embedding.values;

      // 4. Update the note in Supabase
      const { error: updateError } = await supabase
        .from('notes')
        .update({ embedding: newEmbedding })
        .eq('id', note.id);

      if (updateError) throw updateError;
      console.log(`✅ Updated ID: ${note.id}`);
      
    } catch (err) {
      console.error(`❌ Failed ID: ${note.id}`, err);
    }
  }
  console.log("Migration complete!");
}

migrateEmbeddings();
