"use client";

import * as React from "react";
import type { FilterState } from "@/components/modals/filter-modal";

export type BrainNote = {
  id: string;
  title: string;
  summary: string | null;
  tags: string[] | null;
  file_url?: string | null;
  file_name?: string | null;
  created_at: string;
  embedding: number[] | null;
};

type UseBrainState = {
  notes: BrainNote[];
  isLoading: boolean;
  searchQuery: string;
  activeFilters: FilterState;
  handleSearch: (query: string) => void;
  handleApplyFilters: (filters: FilterState) => void;
  handleResetFilters: () => void;
  refreshNotes: () => void;
};

const defaultFilters: FilterState = {
  types: [],
  tags: [],
  sort: "date",
};

export function useBrain(): UseBrainState {
  const [notes, setNotes] = React.useState<BrainNote[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] =
    React.useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchNotes = React.useCallback(async () => {
    setIsLoading(true);
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
        setNotes([]);
        return;
      }

      const raw = (await res.json()) as any[];
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

        console.log("API note item:", item);

        return {
          id: String(item.id),
          title: item.title ?? "Untitled",
          summary: item.summary ?? item.content ?? "",
          tags,
          file_url: item.file_url,
          file_name: item.file_name,
          created_at:
            typeof item.created_at === "string"
              ? item.created_at
              : new Date().toISOString(),
          embedding: Array.isArray(item.embedding)
            ? item.embedding
            : typeof item.embedding === "string"
              ? JSON.parse(item.embedding)
              : null,
        };
      });

      setNotes(mapped);
    } catch {
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeFilters]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchNotes]);

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
    refreshNotes: fetchNotes,
  };
}
