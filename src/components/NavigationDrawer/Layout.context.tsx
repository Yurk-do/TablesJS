import { createContext, ReactNode, useState } from "react";

export interface IDrawerContext {
  openedDrawer: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  drawerWidth: number;
  changeDrawerWidth: (width: number) => void;
}

export const initialDrawerWidth = 300;

export const DrawerContext = createContext<IDrawerContext | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openedDrawer, setOpenedDrawer] = useState(false);

  const openDrawer = () => setOpenedDrawer(true);
  const closeDrawer = () => setOpenedDrawer(false);

  const [drawerWidth, setDrawerWidth] = useState(initialDrawerWidth);

  const changeDrawerWidth = (width: number) => setDrawerWidth(width);

  return (
    <DrawerContext.Provider
      value={{
        openedDrawer,
        openDrawer,
        closeDrawer,
        drawerWidth,
        changeDrawerWidth,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
