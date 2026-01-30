"use client";

import * as React from "react";
import Link from "next/link";
import { BrainCircuit, LogIn, LogOut, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/lib/store/uiStore";
import { useAuth } from "@/components/auth-provider";

export function Navbar({ className }: { className?: string }) {
  const openLogin = useUiStore((s) => s.openLogin);
  const openAddNote = useUiStore((s) => s.openAddNote);
  const { user, loading, signOut } = useAuth();
  const [avatarOpen, setAvatarOpen] = React.useState(false);

  const initials = user?.user_metadata?.full_name
    ? String(user.user_metadata.full_name)
        .split(/\s+/)
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email
      ? String(user.email).slice(0, 2).toUpperCase()
      : "?";

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
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface" />
          ) : user ? (
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAvatarOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition hover:opacity-90"
                title={user.email ?? "Signed in"}
                aria-label="Account menu"
                aria-expanded={avatarOpen}
              >
                {user.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external avatar URL
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium">{initials}</span>
                )}
              </button>
              {avatarOpen ? (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    aria-hidden
                    onClick={() => setAvatarOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-border bg-surface-solid py-2 shadow-[var(--shadow-elevated)]">
                    <div className="border-b border-border px-3 py-2 text-xs text-[color:var(--color-muted-foreground)]">
                      {user.email}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={openLogin}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
