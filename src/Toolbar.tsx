import { useContext, useMemo } from "react";
import styles from "./Toolbar.module.css";
import { useViewStore } from "./viewStore";
import { Document, DocumentDispatch } from "./Document";
import { uid } from "./uid";

export function Toolbar() {
  const selected = useViewStore((state) => state.selected);
  const setSelected = useViewStore((state) => state.setSelected);
  const viewPosition = useViewStore((state) => state.position);
  const animatePosition = useViewStore((state) => state.animatePosition);
  const document = useContext(Document);
  const dispatch = useContext(DocumentDispatch);
  const note = useMemo(
    () => document.notes.find((note) => note.id === selected),
    [document.notes, selected]
  );
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={() => {
          const id = uid();
          dispatch({
            id,
            type: "addNote",
            position: { x: -viewPosition.x, y: -viewPosition.y },
          });
          setTimeout(() => setSelected(id));
        }}
      >
        add
      </button>
      <button
        className={styles.button}
        disabled={viewPosition.x === 0 && viewPosition.y === 0}
        onClick={() => animatePosition({ x: 0, y: 0 })}
      >
        recenter
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
            filter_center_focus
          </button>
          <button
            className={styles.button}
            onMouseDown={() => {
              const cloneId = uid();
              dispatch({ type: "cloneNote", id: note.id, cloneId });
              setTimeout(() => setSelected(cloneId));
            }}
          >
            content_copy
          </button>
          <button
            className={styles.button}
            onMouseDown={() => dispatch({ type: "removeNote", id: note.id })}
          >
            delete
          </button>
        </>
      )}
    </div>
  );
}
