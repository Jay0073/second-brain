"use client";

import * as React from "react";
import type { FilterState } from "@/components/modals/filter-modal";

export type BrainNote = {
  id: string;
  title: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
};

type UseBrainState = {
  notes: BrainNote[];
  isLoading: boolean;
  searchQuery: string;
  activeFilters: FilterState;
  handleSearch: (query: string) => void;
  handleApplyFilters: (filters: FilterState) => void;
  handleResetFilters: () => void;
};

const defaultFilters: FilterState = {
  types: [],
  tags: [],
  sort: "date",
};

export function useBrain(): UseBrainState {
  const [notes, setNotes] = React.useState<BrainNote[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            query: searchQuery.trim() === "" ? null : searchQuery.trim(),
            filters: activeFilters,
          }),
        });

        if (!res.ok) {
          if (!cancelled) setNotes([]);
          return;
        }

        const raw = (await res.json()) as any[];
        if (cancelled) return;

        const mapped: BrainNote[] = (raw ?? []).map((item) => {
          const tags =
            Array.isArray(item.tags) && item.tags.length > 0
              ? item.tags
              : typeof item.tags === "string"
              ? item.tags
                  .split(",")
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [];

          return {
            id: String(item.id),
            title: item.title ?? "Untitled",
            summary: item.summary ?? item.content ?? "",
            tags,
            created_at:
              typeof item.created_at === "string"
                ? item.created_at
                : new Date().toISOString(),
          };
        });

        setNotes(mapped);
      } catch {
        if (!cancelled) setNotes([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery, activeFilters]);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleApplyFilters = React.useCallback((filters: FilterState) => {
    setActiveFilters(filters);
  }, []);

  const handleResetFilters = React.useCallback(() => {
    setActiveFilters(defaultFilters);
  }, []);

  return {
    notes,
    isLoading,
    searchQuery,
    activeFilters,
    handleSearch,
    handleApplyFilters,
    handleResetFilters,
  };
}

