import { Note } from "./Note";
import styles from "./Board.module.css";
import { useState, useContext, useRef, useCallback } from "react";
import { Document, DocumentDispatch } from "./Document";
import { ContextMenuCallback } from "./ContextMenu";
import { drag } from "./drag";
import { animatePosition } from "./animate";

export function Board() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const anchor = useRef<HTMLDivElement>(null);
  const data = useContext(Document);
  const dispatch = useContext(DocumentDispatch);
  const contextmenu = useContext(ContextMenuCallback)([
    {
      icon: "add",
      label: "Add note",
      action(event) {
        const rect = anchor.current!.getBoundingClientRect();
        dispatch({
          type: "addNote",
          position: {
            x: event.clientX - rect.left - position.x,
            y: event.clientY - rect.top - position.y,
          },
        });
      },
    },
    {
      icon: "recenter",
      label: "Move to origin",
      disabled: position.x === 0 && position.y === 0,
      action: () => animatePosition(position, { x: 0, y: 0 }, 100, setPosition),
    },
  ]);
  const moveTo = useCallback(
    (x: number, y: number) =>
      animatePosition(position, { x, y }, 100, setPosition),
    [position, setPosition]
  );
  const startDrag = drag(position, setPosition);
  return (
    <div className={styles.frame}>
      <div
        className={styles.board}
        onMouseDown={startDrag}
        onContextMenu={contextmenu}
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
            {data.notes.map((note) => (
              <Note key={note.id} note={note} moveTo={moveTo} />
            ))}
          </div>
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
}
