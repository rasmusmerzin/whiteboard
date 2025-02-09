import styles from "./NoteList.module.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { type Note, Document, DocumentDispatch } from "./Document";
import { useViewStore } from "./viewStore";

export function NoteList() {
  const document = useContext(Document);
  const dispatch = useContext(DocumentDispatch);
  const container = useRef<HTMLDivElement>(null);
  const [divider, setDivider] = useState<number | null>(null);
  const onDrag = useCallback(
    (event: React.DragEvent) => {
      if (!container.current) return;
      const rect = container.current.getBoundingClientRect();
      setTimeout(
        () =>
          setDivider(
            Math.round(
              Math.min(Math.max(0, event.clientY - rect.top), rect.height) / 32,
            ),
          ),
        10,
      );
    },
    [container.current, setDivider],
  );
  const onDragEnd = useCallback(
    (note: Note) => {
      if (divider == null) return;
      const noteIndex = document.notes.findIndex((n) => n.id === note.id);
      const index = divider > noteIndex ? divider - 1 : divider;
      dispatch({
        type: "reorderNote",
        id: note.id,
        index,
      });
      setTimeout(() => setDivider(null), 10);
    },
    [divider, setDivider],
  );
  return (
    <div className={styles.frame}>
      <div ref={container} className={styles.container}>
        {document.notes.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          />
        ))}
        {divider != null && (
          <div className={styles.divider} style={{ top: divider * 32 }} />
        )}
      </div>
    </div>
  );
}

function NoteListItem({
  note,
  onDrag,
  onDragEnd,
}: {
  note: Note;
  onDrag: (event: React.DragEvent) => void;
  onDragEnd: (note: Note) => void;
}) {
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
      draggable
      ref={button}
      className={
        styles.button + (selected === note.id ? ` ${styles.selected}` : "")
      }
      onMouseDown={() => {
        setPosition({ x: -note.position.x, y: -note.position.y });
        setTimeout(() => setSelected(note.id));
      }}
      onDrag={onDrag}
      onDragEnd={() => onDragEnd(note)}
    >
      {note.content ? <span>{note.content}</span> : <i>Empty note</i>}
    </button>
  );
}
