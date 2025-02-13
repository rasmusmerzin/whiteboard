import styles from "./Board.module.css";
import { Note } from "./Note";
import { useContext, useRef } from "react";
import { ContextMenuCallback } from "./ContextMenu";
import { drag } from "./drag";
import { useViewStore } from "./viewStore";
import { uid } from "./uid";
import { useBoardStore } from "./boardStore";

export function Board() {
  const anchor = useRef<HTMLDivElement>(null);
  const position = useViewStore((state) => state.position);
  const setPosition = useViewStore((state) => state.setPosition);
  const setSelected = useViewStore((state) => state.setSelected);
  const animatePosition = useViewStore((state) => state.animatePosition);
  const notes = useBoardStore((state) => state.notes);
  const addNote = useBoardStore((state) => state.addNote);
  const onContextMenu = useContext(ContextMenuCallback)([
    {
      icon: "add",
      label: "Add note",
      action(event) {
        const rect = anchor.current!.getBoundingClientRect();
        const id = uid();
        addNote(id, {
          x: event.clientX - rect.left - position.x,
          y: event.clientY - rect.top - position.y,
        });
        setTimeout(() => setSelected(id));
      },
    },
    {
      icon: "recenter",
      label: "Move to origin",
      disabled: position.x === 0 && position.y === 0,
      action: () => animatePosition({ x: 0, y: 0 }),
    },
  ]);
  const startDrag = drag(position, setPosition);
  return (
    <div className={styles.frame}>
      <div
        className={styles.board}
        onMouseDown={startDrag}
        onContextMenu={onContextMenu}
      >
        <div
          className={styles.background}
          style={{
            left: position.x % 24,
            top: position.y % 24,
          }}
        ></div>
        <div className={styles.anchor} ref={anchor}>
          <div
            className={styles.origin}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {notes.map((note) => (
              <Note key={note.id} note={note} />
            ))}
          </div>
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
}
