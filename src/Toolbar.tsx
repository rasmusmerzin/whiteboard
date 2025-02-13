import { useMemo } from "react";
import styles from "./Toolbar.module.css";
import { useViewStore } from "./viewStore";
import { uid } from "./uid";
import { useBoardStore } from "./boardStore";

export function Toolbar() {
  const selected = useViewStore((state) => state.selected);
  const setSelected = useViewStore((state) => state.setSelected);
  const viewPosition = useViewStore((state) => state.position);
  const animatePosition = useViewStore((state) => state.animatePosition);
  const notes = useBoardStore((state) => state.notes);
  const addNote = useBoardStore((state) => state.addNote);
  const cloneNote = useBoardStore((state) => state.cloneNote);
  const removeNote = useBoardStore((state) => state.removeNote);
  const note = useMemo(
    () => notes.find((note) => note.id === selected),
    [notes, selected]
  );
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={() => {
          const id = uid();
          addNote(id, { x: -viewPosition.x, y: -viewPosition.y });
          setTimeout(() => setSelected(id));
        }}
      >
        <span>add</span>
      </button>
      <button
        className={styles.button}
        disabled={viewPosition.x === 0 && viewPosition.y === 0}
        onClick={() => animatePosition({ x: 0, y: 0 })}
      >
        <span>recenter</span>
      </button>
      {note && (
        <>
          <div className={styles.divider}></div>
          <button
            className={styles.button}
            disabled={
              viewPosition.x === -note.position.x &&
              viewPosition.y === -note.position.y
            }
            onMouseDown={() => {
              animatePosition({ x: -note.position.x, y: -note.position.y });
              setTimeout(() => setSelected(note.id));
            }}
          >
            <span>filter_center_focus</span>
          </button>
          <button
            className={styles.button}
            onMouseDown={() => {
              const cloneId = uid();
              cloneNote(note.id, cloneId);
              setTimeout(() => setSelected(cloneId));
            }}
          >
            <span>content_copy</span>
          </button>
          <button
            className={styles.button}
            onMouseDown={() => removeNote(note.id)}
          >
            <span>delete</span>
          </button>
        </>
      )}
    </div>
  );
}
