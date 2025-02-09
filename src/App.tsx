import styles from "./App.module.css";
import { Board } from "./Board";
import { ContextMenuProvider } from "./ContextMenu";
import { DocumentProvider } from "./Document";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <ContextMenuProvider>
      <DocumentProvider>
        <div className={styles.app}>
          <Toolbar />
          <Board />
        </div>
      </DocumentProvider>
    </ContextMenuProvider>
  );
}
