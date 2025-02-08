import { createContext, useReducer } from "react";
import { uid } from "./uid";

export type Document = {
  notes: Note[];
};

export type Note = {
  id: string;
  position: { x: number; y: number };
  content: string;
};

export type DocumentDispatch = (action: DocumentAction) => void;

export type DocumentAction =
  | {
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
    };

export const Document = createContext<Document>(null!);
export const DocumentDispatch = createContext<DocumentDispatch>(null!);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [document, dispatch] = useReducer(documentReducer, {
    notes: [
      { id: "1", position: { x: 0, y: 0 }, content: "Hello, world!" },
      { id: "2", position: { x: 100, y: 100 }, content: "Goodbye, world!" },
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
  switch (action.type) {
    case "addNote":
      return {
        ...state,
        notes: [
          ...state.notes,
          { id: uid(), position: action.position, content: "" },
        ],
      };
    case "removeNote":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.id),
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
      const noteIndex = state.notes.findIndex((note) => note.id === action.id);
      if (noteIndex === -1) return state;
      state.notes.push(...state.notes.splice(noteIndex, 1));
      return { ...state, notes: Array.from(state.notes) };
    case "cloneNote":
      const note = state.notes.find((note) => note.id === action.id);
      if (!note) return state;
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            ...note,
            id: uid(),
            position: { x: note.position.x + 10, y: note.position.y + 10 },
          },
        ],
      };
  }
}
