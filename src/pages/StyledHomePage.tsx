import styled from "@emotion/styled";
import { AppBar, Drawer, Tabs, Toolbar } from "@mui/material";

const headerHeight=  48;

export const StyledHomePage = styled.div`
`;

export const StyledAppBar = styled(AppBar)`
  background-color: #DEECF9;
  color: black;
`;

export const StyledHeaderToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
      min-height: ${headerHeight}px;
    }
`;

export const StyledTabs = styled(Tabs)`
  background-color: #DEECF9;
  color: black;
`;

export const StyledLogo = styled.div`
`;

export const StyledDrawer = styled(Drawer)`
  & > .MuiDrawer-paperAnchorDockedRight {
    border: none;
    top: ${headerHeight}px;
  }
`;

export const StyledTablesContainer = styled.div<{ width: string }>`
  margin: 0;
  width: ${({ width }) => width};
`;


export const StyledRightPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  
  & > h2 {
    margin: 0;
  }
`;

export const StyledIconWrapper = styled.span`
  cursor: pointer;
`;

export const StyledToolbar = styled.div`
  display: flex;
  justify-content: space-between;  
  padding: 10px;
  align-items: center;
`;


export const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledModalTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

export const StyledChaptersContainer = styled.div<{drawerOpen: boolean}>`
  max-height: calc(100vh - 282px);
 
    scrollbar-color: #9d9d9d transparent;
    scrollbar-width: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        margin-top: 5px;
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar:horizontal {
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #9d9d9d;
        border: transparent;
        border-radius: 20px;
    }

    &:hover {
        scrollbar-color: #9d9d9d transparent;
        scrollbar-width: auto;
    }
`;

export const StyledCommonCounter = styled.div`
  display: flex;
  color: black;
    line-height: 24px;
    padding: 6px 8px;
  
  & > p {
    margin: 0;
  }
`;

export const StyledContentHeaderWrapper = styled.div`
  margin-top: ${headerHeight}px;  
`;

export const StyledModalContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: white;
    border: 2px solid #000;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px
`