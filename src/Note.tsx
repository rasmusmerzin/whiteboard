import { useContext, useCallback, useEffect, useState, useRef } from "react";
import styles from "./Note.module.css";
import { type Note, DocumentDispatch } from "./Document";
import { throttle } from "./throttle";
import { ContextMenuCallback } from "./ContextMenu";
import { drag } from "./drag";
import { useViewStore } from "./viewStore";
import { uid } from "./uid";

export function Note({ note }: { note: Note }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selected = useViewStore((state) => state.selected);
  const setSelected = useViewStore((state) => state.setSelected);
  const animatePosition = useViewStore((state) => state.animatePosition);
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
  const contextMenuCallback = useContext(ContextMenuCallback);
  useEffect(() => {
    setPosition(note.position);
  }, [note.position]);
  useEffect(() => {
    setContent(note.content);
  }, [note.content]);
  useEffect(() => {
    if (note.id === selected && textarea.current) textarea.current.focus();
  }, [note.id, selected]);
  const startDrag = drag(position, (position) => {
    setPosition(position);
    dispatchPosition(position);
  });
  return (
    <textarea
      ref={textarea}
      spellCheck={false}
      onMouseDown={startDrag}
      onChange={(event) => {
        setContent(event.target.value);
        dispatchContent(event.target.value);
      }}
      onContextMenu={(event) => {
        const viewPosition = useViewStore.getState().position;
        contextMenuCallback([
          {
            icon: "filter_center_focus",
            label: "Focus",
            action: () => animatePosition({ x: -position.x, y: -position.y }),
            disabled:
              viewPosition.x === -position.x && viewPosition.y === -position.y,
          },
          {
            icon: "content_copy",
            label: "Clone",
            action: () => {
              const cloneId = uid();
              dispatch({ type: "cloneNote", id: note.id, cloneId });
              setTimeout(() => setSelected(cloneId));
            },
          },
          {
            icon: "delete",
            label: "Delete",
            action: () => {
              dispatch({ type: "removeNote", id: note.id });
              setSelected("");
            },
          },
        ])(event);
      }}
      onFocus={() => {
        dispatch({ type: "popNote", id: note.id });
        setSelected(note.id);
      }}
      onBlur={() => setSelected("")}
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
      }}
      value={content}
    ></textarea>
  );
}
