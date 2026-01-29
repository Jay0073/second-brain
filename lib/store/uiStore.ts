import { create } from "zustand";

type UiState = {
  loginOpen: boolean;
  addNoteOpen: boolean;
  filterOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openAddNote: () => void;
  closeAddNote: () => void;
  openFilter: () => void;
  closeFilter: () => void;
  closeAll: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  loginOpen: false,
  addNoteOpen: false,
  filterOpen: false,
  openLogin: () => set({ loginOpen: true }),
  closeLogin: () => set({ loginOpen: false }),
  openAddNote: () => set({ addNoteOpen: true }),
  closeAddNote: () => set({ addNoteOpen: false }),
  openFilter: () => set({ filterOpen: true }),
  closeFilter: () => set({ filterOpen: false }),
  closeAll: () => set({ loginOpen: false, addNoteOpen: false, filterOpen: false }),
}));

