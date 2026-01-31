"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close sheet"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-y-0 right-0 w-full max-w-md">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "h-full w-full border-l border-border bg-surface-solid shadow-[var(--shadow-elevated)]",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-6">
            <div className="min-w-0">
              <div className="text-lg font-semibold tracking-tight">{title}</div>
              {description ? (
                <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                  {description}
                </div>
              ) : null}
            </div>
            <button
              className="rounded-full p-2 text-[color:var(--color-muted-foreground)] hover:bg-surface"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
          <div className="h-[calc(100%-73px)] overflow-auto px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

