"use client";

import * as React from "react";
import { Wand2 } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/lib/store/uiStore";

export function AddNoteSheet() {
  const open = useUiStore((s) => s.addNoteOpen);
  const close = useUiStore((s) => s.closeAddNote);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [type, setType] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [generating, setGenerating] = React.useState(false);

  const saveNote = (title: string, content: string, type: string, tags: string[]) => {
    fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, type, tags }),
    });
  };

  const reset = () => {
    setTitle("");
    setContent("");
    setType("");
    setTags([]);
    setGenerating(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          close();
          reset();
        }
      }}
      title="New note"
      description="Draft a thought, then let AI suggest tags."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="text-sm font-medium">Title</div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A clear, specific title…"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Content</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note…"
            className="min-h-44 w-full resize-y rounded-3xl border border-border bg-surface-solid p-4 text-sm outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Type</div>
          <div className="flex items-center space-x-4">
            <label htmlFor="note" className="cursor-pointer">
              <input
                type="radio"
                id="note"
                value="note"
                checked={type === "note"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Note
            </label>
            <label htmlFor="link" className="cursor-pointer">
              <input
                type="radio"
                id="link"
                value="link"
                checked={type === "link"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Link
            </label>
            <label htmlFor="insight" className="cursor-pointer">
              <input
                type="radio"
                id="insight"
                value="insight"
                checked={type === "insight"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Insight
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.length ? (
            tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-[color:var(--color-muted-foreground)]"
              >
                {t}
              </span>
            ))
          ) : (
            <div className="text-sm text-[color:var(--color-muted)]">
              No tags yet.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                setGenerating(true);
                try {
                  const res = await fetch("/api/ai/summarize", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ text: content || title }),
                  });
                  const data = (await res.json()) as { tags?: string[] };
                  setTags(data.tags ?? ["ai", "draft"]);
                } finally {
                  setGenerating(false);
                }
              }}
              disabled={generating}
            >
              <Wand2 className="h-4 w-4" />
              {generating ? "Generating…" : "Generate Tags"}
            </Button>
            <Button
              onClick={() => {
                saveNote(title, content, type, tags);
                close();
                reset();
              }}
              disabled={!title.trim() && !content.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
