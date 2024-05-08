import { StyledHeaderToolbar, StyledLogo, StyledTabs } from "../pages/StyledHomePage";
import { Box, Tab } from "@mui/material";
import React, { ReactNode } from "react";

type PropsType = {
  icons?: ReactNode;
};

export const MainHeader = ({ icons }: PropsType ) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <StyledHeaderToolbar>
      <StyledLogo>
        SCoPE X
      </StyledLogo>
      <StyledTabs value={value} onChange={handleChange} centered>
        <Tab label="Key Parameters" />
        <Tab label="Summary" />
        <Tab label="Calculations" />
        <Tab label="Cover Letter" />
      </StyledTabs>
      <Box display="flex" gap="12px">
        {icons}
      </Box>
    </StyledHeaderToolbar>
  )
};
