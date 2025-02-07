import { useContext, useCallback, useEffect, useState } from "react";
import styles from "./Note.module.css";
import { type Note, DocumentDispatch } from "./Document";
import { throttle } from "./throttle";

export function Note({ note }: { note: Note }) {
  const dispatch = useContext(DocumentDispatch);
  const [position, setPosition] = useState(note.position);
  const [content, setContent] = useState(note.content);
  const dispatchPosition = useCallback(
    throttle((position: { x: number; y: number }) => {
      dispatch({ type: "moveNote", id: note.id, position });
    }, 200),
    [note.id, dispatch]
  );
  const dispatchContent = useCallback(
    throttle((content: string) => {
      dispatch({ type: "updateNote", id: note.id, content });
    }, 200),
    [note.id, dispatch]
  );
  useEffect(() => {
    setPosition(note.position);
  }, [note.position]);
  useEffect(() => {
    setContent(note.content);
  }, [note.content]);
  function startDrag(event: React.MouseEvent) {
    if (event.button) return;
    dispatch({ type: "popNote", id: note.id });
    event.stopPropagation();
    const { clientX, clientY } = event;
    function drag(event: MouseEvent) {
      const p = {
        x: position.x + event.clientX - clientX,
        y: position.y + event.clientY - clientY,
      };
      setPosition(p);
      dispatchPosition(p);
    }
    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }
  return (
    <textarea
      spellCheck={false}
      onMouseDown={startDrag}
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
      }}
      value={content}
      onChange={(event) => {
        setContent(event.target.value);
        dispatchContent(event.target.value);
      }}
    ></textarea>
  );
}
