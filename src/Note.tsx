import { useState } from "react";
import styles from "./Note.module.css";

export function Note() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
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
    <>
      <textarea
        spellCheck={false}
        onMouseDown={startDrag}
        className={styles.note}
        style={{
          left: position.x,
          top: position.y,
        }}
      ></textarea>
    </>
  );
}
