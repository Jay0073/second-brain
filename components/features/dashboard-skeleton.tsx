"use client";

import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]",
        className,
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-border bg-surface p-5"
        >
          <SkeletonBlock className="h-5 w-2/3" />
          <div className="mt-3 space-y-2">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
          <div className="mt-4 flex gap-2">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-14 rounded-full" />
          </div>
          <SkeletonBlock className="mt-5 h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

