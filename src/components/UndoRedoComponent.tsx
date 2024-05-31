import { Box } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { jspreadsheet } from '@jspreadsheet/react';
import RedoIcon from '@mui/icons-material/Redo';
import React from 'react';
import { StyledIconWrapper } from '../pages/StyledHomePage';

type PropsType = {
  undoDisable: boolean;
};

export const UndoRedoComponent = ({ undoDisable }: PropsType) => (
  <Box display="flex" gap="10px">
    <StyledIconWrapper>
      <UndoIcon
        onClick={() => {
          !undoDisable && jspreadsheet.history.undo();
        }}
        {...(undoDisable ? { color: 'disabled' } : {})}
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
);
