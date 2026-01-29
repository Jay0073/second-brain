"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrainNote } from "@/hooks/useBrain";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function NoteCard({ note }: { note: BrainNote }) {
  const tags = Array.isArray(note.tags) ? note.tags : [];

  return (
    <div
      className={cn(
        "group rounded-3xl border border-border bg-surface p-5 shadow-sm backdrop-blur-xl transition",
        "hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[var(--shadow-elevated)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight">
            {note.title}
          </div>
          <div className="mt-2 line-clamp-2 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
            {note.summary}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-[color-mix(in_oklab,var(--surface-solid)_55%,transparent)] px-3 py-1 text-xs text-[color:var(--color-muted-foreground)]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
        <Calendar className="h-4 w-4" />
        {formatDate(note.created_at)}
      </div>
    </div>
  );
}

