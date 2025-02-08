import { Board } from "./Board";
import { ContextMenuProvider } from "./ContextMenu";
import { DocumentProvider } from "./Document";

export function App() {
  return (
    <ContextMenuProvider>
      <DocumentProvider>
        <Board />
      </DocumentProvider>
    </ContextMenuProvider>
  );
}
