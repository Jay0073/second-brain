import { NextResponse } from "next/server";
import { fetchUniqueTags } from "@/lib/api";

export async function GET() {
  try {
    const tags = await fetchUniqueTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Tags API error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
