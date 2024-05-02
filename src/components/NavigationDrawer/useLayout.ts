import { useContext } from "react";

import { DrawerContext } from "./Layout.context";

export function useLayout() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawers must be used within a DrawerProvider");
  }
  return context;
}
