import { createContext, useCallback, useState } from "react";
import styles from "./ContextMenu.module.css";

export type ContextMenu = ContextMenuAction[];

export type ContextMenuAction = {
  label: string;
  action?: (event: React.MouseEvent) => void;
  disabled?: boolean;
};

export type ContextMenuCallback = (
  menu: ContextMenu
) => (event: React.MouseEvent) => void;

export const ContextMenuCallback = createContext<ContextMenuCallback>(null!);

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menu, setMenu] = useState<ContextMenu | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const callback = useCallback(
    (menu: ContextMenu) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setMenu(menu);
      setPosition({ x: event.clientX, y: event.clientY });
    },
    [setMenu, setPosition]
  );
  return (
    <ContextMenuCallback.Provider value={callback}>
      {children}
      {menu && (
        <>
          <div
            className={styles.overlay}
            onMouseDown={() => setMenu(null)}
          ></div>
          <div
            className={styles.contextmenu}
            style={{ left: position.x, top: position.y }}
            onContextMenu={(event) => event.preventDefault()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {menu.map(({ label, action, disabled }, index) => (
              <button
                key={index}
                onClick={(event) => {
                  if (action) action(event);
                  setMenu(null);
                }}
                disabled={disabled}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </ContextMenuCallback.Provider>
  );
}
