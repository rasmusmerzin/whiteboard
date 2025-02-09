import { create } from "zustand";

export interface ViewStore {
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}));
