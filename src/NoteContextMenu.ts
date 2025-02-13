import { useContext } from "react";
import { ContextMenuCallback } from "./ContextMenu";
import { useViewStore } from "./ViewStore";
import { Note, useBoardStore } from "./BoardStore";
import { uid } from "./uid";

export function useNoteContextMenu(note: Note) {
  const { position } = note;
  const contextMenuCallback = useContext(ContextMenuCallback);
  const animatePosition = useViewStore((state) => state.animatePosition);
  const removeNote = useBoardStore((state) => state.removeNote);
  const cloneNote = useBoardStore((state) => state.cloneNote);
  const setSelected = useViewStore((state) => state.setSelected);
  return function onContextMenu(event: React.MouseEvent) {
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
          cloneNote(note.id, cloneId);
          setTimeout(() => setSelected(cloneId));
        },
      },
      {
        icon: "delete",
        label: "Delete",
        action: () => {
          removeNote(note.id);
          setSelected("");
        },
      },
    ])(event);
  };
}
