import { useContext, useCallback, useEffect, useState } from "react";
import styles from "./Note.module.css";
import { type Note, DocumentDispatch } from "./Document";
import { throttle } from "./throttle";
import { ContextMenuCallback } from "./ContextMenu";
import { drag } from "./drag";
import { useViewStore } from "./viewStore";

export function Note({
  note,
  moveTo,
}: {
  note: Note;
  moveTo: (x: number, y: number) => void;
}) {
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
  const dispatchPop = useCallback(() => {
    dispatch({ type: "popNote", id: note.id });
  }, [note.id, dispatch]);
  const contextMenuCallback = useContext(ContextMenuCallback);
  useEffect(() => {
    setPosition(note.position);
  }, [note.position]);
  useEffect(() => {
    setContent(note.content);
  }, [note.content]);
  const startDrag = drag(position, (position) => {
    setPosition(position);
    dispatchPosition(position);
  });
  return (
    <textarea
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
            action: () => moveTo(-position.x, -position.y),
            disabled:
              viewPosition.x === -position.x && viewPosition.y === -position.y,
          },
          {
            icon: "content_copy",
            label: "Clone",
            action: () => dispatch({ type: "cloneNote", id: note.id }),
          },
          {
            icon: "delete",
            label: "Delete",
            action: () => dispatch({ type: "removeNote", id: note.id }),
          },
        ])(event);
      }}
      onFocus={dispatchPop}
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
      }}
      value={content}
    ></textarea>
  );
}
