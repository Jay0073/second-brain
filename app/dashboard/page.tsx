"use client";

import * as React from "react";
import { Filter, Search, LayoutGrid, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { NoteCard } from "@/components/features/note-card";
import { BrainGraph3D } from "@/components/features/brain-graph";
import { FilterModal } from "@/components/modals/filter-modal";
import { useUiStore } from "@/lib/store/uiStore";
import { useBrain } from "@/hooks/useBrain";
import { useAuth } from "@/components/auth-provider";
import type { BrainNote } from "@/hooks/useBrain";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function DashboardPage() {
  const openAddNote = useUiStore((s) => s.openAddNote);
  const openFilter = useUiStore((s) => s.openFilter);
  const openLogin = useUiStore((s) => s.openLogin);
  const {
    notes,
    isLoading,
    searchQuery,
    activeFilters,
    handleSearch,
    handleApplyFilters,
    handleResetFilters,
  } = useBrain();
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = React.useState<"grid" | "graph">("grid");

  React.useEffect(() => {
    if (!loading && !user) {
      openLogin();
    }
  }, [user, loading, openLogin]);

  const hasActiveFilters =
    activeFilters.types.length > 0 ||
    activeFilters.tags.length > 0 ||
    activeFilters.sort !== "date";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-[color:var(--color-muted-foreground)]">
            Dashboard
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Good {new Date().getHours() < 12 ? "morning" : "evening"}.
          </h1>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search notes…"
              className="pl-10"
            />
          </div>
          <Button
            variant="secondary"
            className="justify-center"
            onClick={openFilter}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] text-accent-foreground">
                {activeFilters.types.length +
                  activeFilters.tags.length +
                  (activeFilters.sort !== "date" ? 1 : 0)}
              </span>
            )}
          </Button>
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
                viewMode === "grid"
                  ? "bg-surface-solid text-foreground shadow-sm"
                  : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
              )}
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("graph")}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
                viewMode === "graph"
                  ? "bg-surface-solid text-foreground shadow-sm"
                  : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
              )}
              aria-pressed={viewMode === "graph"}
            >
              <Network className="h-4 w-4" />
              Graph
            </button>
          </div>
          <Button onClick={openAddNote}>New Note</Button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <DashboardSkeleton />
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <div className="text-base font-semibold tracking-tight">
              No thoughts found.
            </div>
            <div className="mt-2 max-w-md text-sm text-[color:var(--color-muted-foreground)]">
              Try adjusting your search, or start fresh by creating a new note.
            </div>
            <Button className="mt-5" onClick={openAddNote}>
              Create your first note
            </Button>
          </div>
        ) : viewMode === "graph" ? (
          <div className="h-[600px] w-full">
            <BrainGraph3D notes={notes} />
          </div>
        ) : (
          <div
            className="masonry-grid"
            style={{
              columnCount: 3,
              columnGap: "1rem",
              maxWidth: "100%",
            }}
          >
            {notes.map((n) => (
              <div key={n.id} style={{ breakInside: "avoid", marginBottom: "1rem" }}>
                <NoteCard note={n} />
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterModal
        activeFilters={activeFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        hasSearchQuery={searchQuery.trim().length > 0}
      />
    </div>
  );
}

