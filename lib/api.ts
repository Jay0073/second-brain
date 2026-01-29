import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchUniqueTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc("get_unique_tags");
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch unique tags:", error);
    return [];
  }
}
