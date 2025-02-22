import { useCallback, useEffect, useState, useRef, useContext } from "react";
import styles from "./Note.module.css";
import { throttle } from "./throttle";
import { drag } from "./drag";
import { useViewStore } from "./ViewStore";
import { useBoardStore, type Note } from "./BoardStore";
import { useNoteContextMenu } from "./NoteContextMenu";
import { BoardRef } from "./Board";

export function Note({ note }: { note: Note }) {
  const board = useContext(BoardRef);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selected = useViewStore((state) => state.selected);
  const setSelected = useViewStore((state) => state.setSelected);
  const moveNote = useBoardStore((state) => state.moveNote);
  const updateNote = useBoardStore((state) => state.updateNote);
  const popNote = useBoardStore((state) => state.popNote);
  const onContextMenu = useNoteContextMenu(note);
  const [position, setPosition] = useState(note.position);
  const [content, setContent] = useState(note.content);
  const dispatchPosition = useCallback(
    throttle(
      (position: { x: number; y: number }) => moveNote(note.id, position),
      200,
    ),
    [note.id, moveNote],
  );
  const dispatchContent = useCallback(
    throttle((content: string) => updateNote(note.id, content), 200),
    [note.id, updateNote],
  );
  useEffect(() => {
    setPosition(note.position);
  }, [note.position]);
  useEffect(() => {
    setContent(note.content);
  }, [note.content]);
  useEffect(() => {
    if (note.id === selected && textarea.current) {
      const { setPosition } = useViewStore.getState();
      const textareaRect = textarea.current.getBoundingClientRect();
      const boardRect = board.current!.getBoundingClientRect();
      if (
        textareaRect.bottom <= boardRect.top ||
        textareaRect.right <= boardRect.left ||
        textareaRect.top >= boardRect.bottom ||
        textareaRect.left >= boardRect.right
      )
        setPosition({ x: -note.position.x, y: -note.position.y });
      setTimeout(() => textarea.current?.focus());
    }
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
      onContextMenu={onContextMenu}
      onFocus={() => {
        popNote(note.id);
        setSelected(note.id);
      }}
      onBlur={() => setSelected("")}
      className={styles.note}
      style={{
        zIndex: note.z,
        left: position.x,
        top: position.y,
      }}
      value={content}
    ></textarea>
  );
}
