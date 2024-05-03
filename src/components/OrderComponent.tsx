import {Card, CardHeader, IconButton} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import styled from "@emotion/styled";

type PropsType = {
  name: string;
  cost: string;
  date: string;
  onSelectOrder?: () => void
};

const StyledCard = styled(Card)`
    &.MuiCard-root {
        border-radius: 12px;
        box-shadow: none;
        border: 1px solid #8484AB;
    }   
    & .MuiCardHeader-content > span {
        text-align: start;
    }   
    
    & .MuiCardHeader-content > .MuiCardHeader-title {
        font-size: 18px;
    }    
`;

const StyledTitle = styled.div`
  display: flex;
  gap: 10px;
    
  & span {
    font-size: 16px;
  }
`;

const StyledName = styled.div`
  flex-shrink: 1;
`;

const StyledCost = styled.div`
  flex-shrink: 0;
`;

export const OrderComponent = ({ name, date, cost, onSelectOrder }: PropsType) => {
  return (
    <StyledCard onClick={onSelectOrder}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon/>
          </IconButton>
        }
        title={
        <StyledTitle>
          <StyledName>{name}</StyledName>
          <StyledCost>{cost}</StyledCost>
        </StyledTitle>
        }
        subheader={date}
      />
    </StyledCard>
  );
};
