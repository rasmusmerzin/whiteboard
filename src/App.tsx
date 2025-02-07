import { Board } from "./Board";
import { DocumentProvider } from "./Document";

export function App() {
  return (
    <DocumentProvider>
      <Board />
    </DocumentProvider>
  );
}
