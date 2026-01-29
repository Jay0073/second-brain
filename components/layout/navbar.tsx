"use client";

import Link from "next/link";
import { BrainCircuit, LogIn, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/lib/store/uiStore";

export function Navbar({ className }: { className?: string }) {
  const openLogin = useUiStore((s) => s.openLogin);
  const openAddNote = useUiStore((s) => s.openAddNote);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-[color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-surface"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              Second Brain
            </div>
            <div className="text-xs text-[color:var(--color-muted)]">
              Infrastructure for thought
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-3 py-2 text-sm text-[color:var(--color-muted-foreground)] transition hover:bg-surface hover:text-foreground sm:inline-flex"
          >
            Dashboard
          </Link>
          <ThemeToggle />
          <Button
            variant="secondary"
            size="sm"
            onClick={openAddNote}
            className="hidden md:inline-flex"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
          <Button variant="primary" size="sm" onClick={openLogin}>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
}

