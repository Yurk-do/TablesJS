import { Box, Tab } from '@mui/material';
import React, { ReactNode } from 'react';
import {
  StyledHeaderToolbar,
  StyledLogo,
  StyledTabs,
} from '../pages/StyledHomePage';
import { NetworkStatusIndicator } from '../network/NetworkStatusIndicator';

type PropsType = {
  icons?: ReactNode;
};

export const MainHeader = ({ icons }: PropsType) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <StyledHeaderToolbar>
      <Box display="flex" alignItems="center">
        <StyledLogo>SCoPE X</StyledLogo>
        <StyledTabs value={value} onChange={handleChange} centered>
          <Tab label="Key Parameters" />
          <Tab label="Summary" />
          <Tab label="Calculations" />
          <Tab label="Cover Letter" />
        </StyledTabs>
        <Box display="flex" gap="12px">
          {icons}
        </Box>
      </Box>
      <Box>
        <NetworkStatusIndicator />
      </Box>
    </StyledHeaderToolbar>
  );
};
