import { create } from "zustand";

export interface BoardStore {
  notes: Note[];
  addNote: (id: string, position: { x: number; y: number }) => void;
  removeNote: (id: string) => void;
  moveNote: (id: string, position: { x: number; y: number }) => void;
  updateNote: (id: string, content: string) => void;
  popNote: (id: string) => void;
  cloneNote: (id: string, cloneId: string) => void;
  reorderNote: (id: string, index: number) => void;
}

export interface Note {
  z: number;
  id: string;
  position: { x: number; y: number };
  content: string;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  notes: [
    {
      z: 1,
      id: "1",
      position: { x: 0, y: 0 },
      content: "Hello, world!",
    },
    {
      z: 2,
      id: "2",
      position: { x: 100, y: 100 },
      content: "Goodbye, world!",
    },
  ],
  addNote: (id, position) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          z: state.notes.length + 1,
          id,
          position,
          content: "",
        },
      ],
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
  moveNote: (id, position) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, position } : note
      ),
    })),
  updateNote: (id, content) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, content } : note
      ),
    })),
  popNote: (id) => {
    const { notes } = get();
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return;
    const { z } = notes[noteIndex];
    set({
      notes: notes.map((note) =>
        note.z > z
          ? { ...note, z: note.z - 1 }
          : note.z === z
            ? { ...note, z: notes.length }
            : note
      ),
    });
  },
  cloneNote: (id, cloneId) => {
    const { notes } = get();
    const note = notes.find((note) => note.id === id);
    if (!note) return;
    set({
      notes: [
        ...notes,
        {
          ...note,
          z: notes.length + 1,
          id: cloneId,
          position: { x: note.position.x + 10, y: note.position.y + 10 },
        },
      ],
    });
  },
  reorderNote: (id, index) => {
    const { notes } = get();
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return;
    const [note] = notes.splice(noteIndex, 1);
    notes.splice(index, 0, note);
    set({ notes });
  },
}));
