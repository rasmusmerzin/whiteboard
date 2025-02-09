import { createContext, useReducer } from "react";

export type Document = {
  notes: Note[];
};

export type Note = {
  z: number;
  id: string;
  position: { x: number; y: number };
  content: string;
};

export type DocumentDispatch = (action: DocumentAction) => void;

export type DocumentAction =
  | {
      id: string;
      type: "addNote";
      position: { x: number; y: number };
    }
  | {
      type: "removeNote";
      id: string;
    }
  | {
      type: "moveNote";
      id: string;
      position: { x: number; y: number };
    }
  | {
      type: "updateNote";
      id: string;
      content: string;
    }
  | {
      type: "popNote";
      id: string;
    }
  | {
      type: "cloneNote";
      id: string;
      cloneId: string;
    };

export const Document = createContext<Document>(null!);
export const DocumentDispatch = createContext<DocumentDispatch>(null!);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [document, dispatch] = useReducer(documentReducer, {
    notes: [
      { z: 1, id: "1", position: { x: 0, y: 0 }, content: "Hello, world!" },
      {
        z: 2,
        id: "2",
        position: { x: 100, y: 100 },
        content: "Goodbye, world!",
      },
    ],
  });
  return (
    <Document.Provider value={document}>
      <DocumentDispatch.Provider value={dispatch}>
        {children}
      </DocumentDispatch.Provider>
    </Document.Provider>
  );
}

function documentReducer(state: Document, action: DocumentAction): Document {
  let noteIndex: number;
  switch (action.type) {
    case "addNote":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            z: state.notes.length + 1,
            id: action.id,
            position: action.position,
            content: "",
          },
        ],
      };
    case "removeNote":
      noteIndex = state.notes.findIndex((note) => note.id === action.id);
      if (noteIndex === -1) return state;
      const [deletedNote] = state.notes.splice(noteIndex, 1);
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.z > deletedNote.z ? { ...note, z: note.z - 1 } : note
        ),
      };
    case "moveNote":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.id ? { ...note, position: action.position } : note
        ),
      };
    case "updateNote":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.id ? { ...note, content: action.content } : note
        ),
      };
    case "popNote":
      noteIndex = state.notes.findIndex((note) => note.id === action.id);
      if (noteIndex === -1) return state;
      const { z } = state.notes[noteIndex];
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.z > z
            ? { ...note, z: note.z - 1 }
            : note.z === z
              ? { ...note, z: state.notes.length }
              : note
        ),
      };
    case "cloneNote":
      const note = state.notes.find((note) => note.id === action.id);
      if (!note) return state;
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            ...note,
            id: action.cloneId,
            position: { x: note.position.x + 10, y: note.position.y + 10 },
          },
        ],
      };
  }
}
