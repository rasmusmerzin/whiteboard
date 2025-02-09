import styles from "./NoteList.module.css";
import { useContext, useEffect, useRef } from "react";
import { type Note, Document } from "./Document";
import { useViewStore } from "./viewStore";

export function NoteList() {
  const document = useContext(Document);
  return (
    <div className={styles.list}>
      {document.notes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </div>
  );
}

function NoteListItem({ note }: { note: Note }) {
  const button = useRef<HTMLButtonElement>(null);
  const selected = useViewStore((state) => state.selected);
  const setSelected = useViewStore((state) => state.setSelected);
  const setPosition = useViewStore((state) => state.setPosition);
  useEffect(() => {
    if (selected === note.id && button.current)
      button.current.scrollIntoView({ block: "center" });
  }, [selected, note.id]);
  return (
    <button
      ref={button}
      className={
        styles.button + (selected === note.id ? ` ${styles.selected}` : "")
      }
      onMouseDown={() => {
        setPosition({ x: -note.position.x, y: -note.position.y });
        setTimeout(() => setSelected(note.id));
      }}
    >
      {note.content ? <span>{note.content}</span> : <i>Empty note</i>}
    </button>
  );
}
