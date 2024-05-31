import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

type PropsType = {
  children?: ReactNode;
  index: number;
  value: number;
  isInvisible: boolean;
};

const StyledContentHeaderTabPanel = styled.div`
  height: 44px;
  background-color: #deecf9;
`;

export const ContentHeaderTabPanel = ({
  children,
  value,
  index,
  isInvisible,
  ...other
}: PropsType) => (
  <StyledContentHeaderTabPanel
    role="tabpanel"
    hidden={value !== index || isInvisible}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {children}
  </StyledContentHeaderTabPanel>
);
