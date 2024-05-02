import styled from "@emotion/styled";
import {Drawer} from "@mui/material";

export const StyledNavigationDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== "drawerWidth"
})<{ drawerWidth: number }>`
  ${({ drawerWidth }) => ({
    width: drawerWidth,
    "& .MuiDrawer-paper": {
      width: `${drawerWidth}px`,
      boxSizing: "border-box"
    }
  })}
`;

export const StyledNavigationDrawerContentContainer = styled.div`
  height: 100%;
`;

export const StyledDraggableSection = styled.div`
    width: 5px;
    cursor: ew-resize;
    padding: 4px 0 0;
    border-top: 1px solid #ddd;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    opacity: 0.2;
    background-color: black,
`;
