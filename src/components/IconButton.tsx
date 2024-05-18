import React from "react";
import styled from "@emotion/styled";

export const StyledIconButton = styled.span<{ active: boolean }>`
  cursor: pointer;
  & > svg {
    color: ${({ active}) => active ? '#9c27b0' : '#1976d2' }  
  }  
`;

type PropsType = {
  icon: any;
  onClick: () => void;
  active: boolean;
};

export const IconButton = ({ onClick, icon, active = false }: PropsType) => (
  <StyledIconButton onClick={onClick} active={active}>
    {icon}
  </StyledIconButton>
);
