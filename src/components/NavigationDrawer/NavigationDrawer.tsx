import {FC, ReactNode, useEffect, useRef, useState} from "react";

import { useLayout } from "./useLayout";

import {
  StyledDraggableSection,
  StyledNavigationDrawer,
  StyledNavigationDrawerContentContainer,
} from "./NavigationDrawer.consts";

export type PropsType = {
  navigationDrawerContent: ReactNode;
  resizable?: boolean;
};


export const NavigationDrawer: FC<PropsType> = ({
  navigationDrawerContent,
  resizable
}) => {
  const { openedDrawer, drawerWidth, changeDrawerWidth } =
    useLayout();

  const [isResizing, setIsResizing] = useState(false);

  const modalProps = {
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  };

  const { current: handleMouseUp } = useRef(() => {
    setIsResizing(false);
  });

  const { current: handleMouseDown } = useRef(() => {
    setIsResizing(true);
  });

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing) {
      return;
    }

    const offsetRight = document.body.clientWidth - event.clientX;

    const minWidth = 300;
    const maxWidth = 1000;
    if (offsetRight > minWidth && offsetRight < maxWidth) {
      changeDrawerWidth(offsetRight);
    }
  };

  useEffect(() => {
    if (resizable) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  });

  return (
    <StyledNavigationDrawer
      {...modalProps}
      drawerWidth={drawerWidth}
      variant={"persistent"}
      anchor={"right"}
      open={openedDrawer}
    >
      {resizable && <StyledDraggableSection onMouseDown={handleMouseDown}/>}
      <StyledNavigationDrawerContentContainer>
        {navigationDrawerContent}
      </StyledNavigationDrawerContentContainer>
    </StyledNavigationDrawer>
  );
};
