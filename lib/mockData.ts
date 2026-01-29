export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO
};

export const mockNotes: Note[] = [
  {
    id: "note_1",
    title: "Parallax as a thinking tool",
    content:
      "Motion can be a UI affordance for hierarchy. Parallax should be subtle, purposeful, and never block reading.",
    tags: ["design", "motion", "ux"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "note_2",
    title: "Capture → Organize → Synthesize",
    content:
      "If you reduce friction at capture, you increase throughput. Tagging and synthesis should feel like assistance, not ceremony.",
    tags: ["workflow", "systems", "ai"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "note_3",
    title: "Evergreen notes",
    content:
      "Write notes that can be re-used. Prefer claims, links, and examples over raw excerpts.",
    tags: ["notes", "writing"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "note_4",
    title: "Search-first dashboards",
    content:
      "The dashboard is an interface for retrieval. Search and filters should be central; creation should be one click away.",
    tags: ["product", "ux"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: "note_5",
    title: "Tag generation stub",
    content:
      "We’ll later call an AI endpoint to propose tags. For now, the stub returns a predictable response for UX wiring.",
    tags: ["ai", "backend", "stub"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

