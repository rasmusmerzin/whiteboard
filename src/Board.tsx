import { Note } from "./Note";
import styles from "./Board.module.css";
import { useState, useContext } from "react";
import { Document } from "./Document";

export function Board() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const data = useContext(Document);
  function startDrag(event: React.MouseEvent) {
    if (event.button) return;
    event.stopPropagation();
    const { clientX, clientY } = event;
    function drag(event: MouseEvent) {
      setPosition({
        x: position.x + event.clientX - clientX,
        y: position.y + event.clientY - clientY,
      });
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }
  return (
    <div className={styles.frame}>
      <div className={styles.board} onMouseDown={startDrag}>
        <div
          className={styles.background}
          style={{
            left: position.x % 24,
            top: position.y % 24,
          }}
        ></div>
        <div className={styles.anchor}>
          <div
            className={styles.origin}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {data.notes.map((note) => (
              <Note key={note.id} note={note} />
            ))}
          </div>
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
}
