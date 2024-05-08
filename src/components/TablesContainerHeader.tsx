import { StyledCommonCounter, StyledToolbar } from "../pages/StyledHomePage";
import { Box } from "@mui/material";
import { UndoRedoComponent } from "./UndoRedoComponent";
import React, {ReactNode} from "react";

type PropsType = {
  counter: string;
  undoDisable: boolean;
  rightPart?: ReactNode;
};

export const TablesContainerHeader = ({ counter, undoDisable, rightPart }: PropsType ) => {
  return (
    <StyledToolbar>
      <Box display="flex" gap="30px" alignItems="center">
        <StyledCommonCounter>
          <p>TOTAL:</p>
          <p>{counter}</p>
        </StyledCommonCounter>
        <UndoRedoComponent undoDisable={undoDisable} />
      </Box>
      {rightPart}
    </StyledToolbar>
  )
};
