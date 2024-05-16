import {Box} from "@mui/material";
import {StyledIconWrapper} from "../pages/StyledHomePage";
import UndoIcon from "@mui/icons-material/Undo";
import {jspreadsheet} from "@jspreadsheet/react";
import RedoIcon from "@mui/icons-material/Redo";
import React from "react";

type PropsType = {
  undoDisable: boolean,
};

export const UndoRedoComponent = ({ undoDisable }: PropsType) => {
  return (
    <Box display="flex" gap="10px">
      <StyledIconWrapper>
        <UndoIcon
          onClick={
          () => {
            !undoDisable && jspreadsheet.history.undo();
          }}
          {...(undoDisable ? {'color': 'disabled'} : {})}
        />
      </StyledIconWrapper>
      <StyledIconWrapper>
        <RedoIcon
          onClick={() => {
            jspreadsheet.history.redo();
          }}
        />
      </StyledIconWrapper>
    </Box>
  )
}