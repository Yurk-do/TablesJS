import { Card, CardHeader, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import styled from '@emotion/styled';

type PropsType = {
  id: number;
  date: string;
};

const StyledCard = styled(Card)`
  &.MuiCard-root {
    border-radius: 12px;
    box-shadow: none;
    border: 1px solid #8484ab;
  }
  & .MuiCardHeader-content > span {
    text-align: start;
  }

  & .MuiCardHeader-content > .MuiCardHeader-title {
    font-size: 18px;
  }

  & .MuiCardHeader-content > .MuiCardHeader-subheader {
    color: #027472;
  }
`;

export const VersionComponent = ({ id, date }: PropsType) => (
  <StyledCard>
    <CardHeader
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title={`Version ${id}`}
      subheader={date}
    />
  </StyledCard>
);
