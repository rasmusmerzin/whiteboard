import styles from "./App.module.css";
import { Board } from "./Board";
import { ContextMenuProvider } from "./ContextMenu";
import { DocumentProvider } from "./Document";
import { NoteList } from "./NoteList";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <ContextMenuProvider>
      <DocumentProvider>
        <div className={styles.app}>
          <Toolbar />
          <Board />
          <NoteList />
        </div>
      </DocumentProvider>
    </ContextMenuProvider>
  );
}
