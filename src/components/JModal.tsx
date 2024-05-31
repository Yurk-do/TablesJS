import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
} from '@mui/material';
import React, { ReactNode } from 'react';
import Draggable from 'react-draggable';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { FormulaPickerInput } from './FormulaPickerInput';

type PropsType = {
  data: ReactNode;
  startCoords?: { x: number; y: number };
  onClose: (e: object, reason: string) => void;
};

type PaperComponentProps = {
  defaultPosition?: { x: number; y: number };
} & PaperProps;

const StyledPaper = styled(Paper)`
  margin: 32px 0 0 0 !important;
`;

const StyledDialog = styled(Dialog)<{ startCoords?: { x: number; y: number } }>`
  //position: relative;
  bottom: auto;
  right: auto;

  .MuiDialog-container {
    // top: ${({ startCoords }) => startCoords?.y}px;
    // left: ${({ startCoords }) => startCoords?.x}px;
    // bottom: auto;
    // right: auto;
    height: auto;
    //position: fixed;
    //min-width: 600px;
    //width: max-content;
    //display: block;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
`;

const PaperComponent = ({ defaultPosition, ...props }: PaperComponentProps) => (
  <Draggable
    defaultPosition={defaultPosition}
    handle="#draggable-dialog-title"
    cancel={'[class*="MuiDialogContent-root"]'}
  >
    <StyledPaper {...props} />
  </Draggable>
);

export const JModal = ({ data, onClose, startCoords }: PropsType) => (
  <StyledDialog
    startCoords={startCoords}
    hideBackdrop
    onClose={onClose}
    open
    PaperProps={{ defaultPosition: { x: startCoords?.x, y: startCoords?.y } }}
    PaperComponent={PaperComponent}
    aria-labelledby="draggable-dialog-title"
  >
    <StyledDialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
      <Box>Add Invoice</Box>
      <CloseIcon onClick={(event) => onClose(event, 'close')} />
    </StyledDialogTitle>
    <DialogContent>
      <FormulaPickerInput label="Range" />
    </DialogContent>
  </StyledDialog>
);
