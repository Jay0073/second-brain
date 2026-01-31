"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[color:var(--color-muted-foreground)]">
          © {new Date().getFullYear()} Second Brain
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-[color:var(--color-muted-foreground)] hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-[color:var(--color-muted-foreground)] hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className="text-[color:var(--color-muted-foreground)] hover:text-foreground"
          >
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}

