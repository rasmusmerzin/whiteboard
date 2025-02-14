import { create } from "zustand";
import { animatePosition } from "./animate";

export interface ViewStore {
  position: { x: number; y: number };
  selected: string;
  setPosition: (position: { x: number; y: number }) => void;
  setSelected: (selected: string) => void;
  animatePosition: (position: { x: number; y: number }) => void;
}

export const useViewStore = create<ViewStore>((set, get) => ({
  position: { x: 0, y: 0 },
  selected: "",
  setPosition: (position) => set({ position }),
  setSelected: (selected) => set({ selected }),
  animatePosition: (position) =>
    animatePosition(get().position, position, 100, (position) =>
      set({ position }),
    ),
}));
