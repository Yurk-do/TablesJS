import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import { StyledCommonCounter, StyledToolbar } from '../pages/StyledHomePage';
import { UndoRedoComponent } from './UndoRedoComponent';

type PropsType = {
  counter: string;
  undoDisable: boolean;
  rightPart?: ReactNode;
};

export const TablesContainerHeader = ({
  counter,
  undoDisable,
  rightPart,
}: PropsType) => (
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
);
