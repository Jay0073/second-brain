"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/lib/store/uiStore";

export type FilterState = {
  types: string[];
  tags: string[];
  sort: "date" | "relevance";
};

// Add a type for tag objects
type TagObj = { tag: string; count: number };

type FilterModalProps = {
  activeFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  hasSearchQuery: boolean;
};

export function FilterModal({
  activeFilters,
  onApply,
  onReset,
  hasSearchQuery,
}: FilterModalProps) {
  const open = useUiStore((s) => s.filterOpen);
  const close = useUiStore((s) => s.closeFilter);

  const [localFilters, setLocalFilters] = React.useState<FilterState>(activeFilters);
  const [availableTags, setAvailableTags] = React.useState<TagObj[]>([]);
  const [loadingTags, setLoadingTags] = React.useState(true);

  React.useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setLoadingTags(true);
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) return;
        const data = (await res.json()) as { tags?: TagObj[] };
        if (!cancelled) {
          const rawTags = Array.isArray(data.tags) ? data.tags : [];
          // User requested: "only show tags which are not unique or whose tagObj.count > 1"
          // Assuming the API returns objects { tag: string, count: number }
          // We filter for count > 1
          const filtered = rawTags.filter(t => t.count > 1);
          setAvailableTags(filtered);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingTags(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const toggleType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const toggleTag = (tag: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    close();
  };

  const handleReset = () => {
    const reset: FilterState = { types: [], tags: [], sort: "date" };
    setLocalFilters(reset);
    onReset();
    close();
  };

  // Inline skeleton block for tag loading
  function TagSkeleton() {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-16 rounded-full bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => (o ? null : close())}
      title="Filter & Sort"
      description="Refine your notes by type, tags, and sorting."
    >
      <div className="space-y-6">
        {/* Section 1: Type */}
        <div>
          <div className="mb-3 text-sm font-medium">Type</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Note", value: "note" },
              { label: "Link", value: "link" },
              { label: "Insight", value: "insight" },
            ].map((type) => (
              <button
                id={`filter-type-${type.value}`}
                key={type.value}
                type="button"
                onClick={() => toggleType(type.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  localFilters.types.includes(type.value)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:bg-[color-mix(in_oklab,var(--surface)_85%,var(--foreground)_2%)]",
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Tags */}
        <div>
          <div className="mb-3 text-sm font-medium">Tags</div>
          {loadingTags ? (
            <TagSkeleton />
          ) : availableTags.length === 0 ? (
            <div className="text-xs text-[color:var(--color-muted-foreground)]">
              No tags available.
            </div>
          ) : (
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
              {availableTags.map((tagObj) => (
                <button
                  id={`filter-tag-${tagObj.tag}`}
                  key={tagObj.tag}
                  type="button"
                  onClick={() => toggleTag(tagObj.tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    localFilters.tags.includes(tagObj.tag)
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground hover:bg-[color-mix(in_oklab,var(--surface)_85%,var(--foreground)_2%)]",
                  )}
                >
                  {tagObj.tag}
                  {/* <span className="ml-1 text-[10px] text-muted-foreground">({tagObj.count})</span> */}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Sort By */}
        <div>
          <div className="mb-3 text-sm font-medium">Sort By</div>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="sort"
                checked={localFilters.sort === "date"}
                onChange={() => setLocalFilters((prev) => ({ ...prev, sort: "date" }))}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm">Date (Newest First)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="sort"
                checked={localFilters.sort === "relevance"}
                onChange={() =>
                  setLocalFilters((prev) => ({ ...prev, sort: "relevance" }))
                }
                disabled={!hasSearchQuery}
                className="h-4 w-4 accent-accent disabled:opacity-40"
              />
              <span
                className={cn(
                  "text-sm",
                  !hasSearchQuery && "text-[color:var(--color-muted-foreground)]",
                )}
              >
                Relevance
                {!hasSearchQuery && " (requires search query)"}
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </div>
    </Modal>
  );
}
