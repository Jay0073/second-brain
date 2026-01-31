"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export function Modal({
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
  const lenis = useLenis();

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);

    // Scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalStyle;
      lenis?.start();
    };
  }, [open, onOpenChange, lenis]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto flex min-h-dvh w-full items-center justify-center px-4 py-10 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "relative w-full max-w-md rounded-3xl border border-border bg-surface-solid shadow-[var(--shadow-elevated)] pointer-events-auto",
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
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
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>
          <div className="px-6 pb-6 pt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

