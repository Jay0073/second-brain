import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: Request) {
  await sleep(1000);
  const body = (await req.json().catch(() => ({}))) as { text?: string };

  const text = (body.text ?? "").trim();
  const summary =
    text.length > 0
      ? `Mock summary: ${text.slice(0, 120)}${text.length > 120 ? "…" : ""}`
      : "Mock summary: (no text provided)";

  return NextResponse.json({
    summary,
    tags: ["ai", "synthesis", "second-brain"],
  });
}

