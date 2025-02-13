import styles from "./App.module.css";
import { Board } from "./Board";
import { ContextMenuProvider } from "./ContextMenu";
import { NoteList } from "./NoteList";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <ContextMenuProvider>
      <div className={styles.app}>
        <Toolbar />
        <Board />
        <NoteList />
      </div>
    </ContextMenuProvider>
  );
}
