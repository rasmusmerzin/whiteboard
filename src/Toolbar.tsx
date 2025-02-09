import { useContext } from "react";
import styles from "./Toolbar.module.css";
import { animatePosition } from "./animate";
import { useViewStore } from "./viewStore";
import { DocumentDispatch } from "./Document";

export function Toolbar() {
  const position = useViewStore((state) => state.position);
  const setPosition = useViewStore((state) => state.setPosition);
  const dispatch = useContext(DocumentDispatch);
  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => {
          dispatch({
            type: "addNote",
            position: { x: -position.x, y: -position.y },
          });
        }}
      >
        add
      </button>
      <button
        disabled={position.x === 0 && position.y === 0}
        onClick={() =>
          animatePosition(position, { x: 0, y: 0 }, 100, setPosition)
        }
      >
        recenter
      </button>
    </div>
  );
}
