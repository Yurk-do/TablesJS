import { Box, Tab, Tabs, FormControlLabel, Switch } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from '@emotion/styled';
import { ContentHeaderTabPanel } from './ContentHeaderTabPanel';

type PropsType = {
  formulasVisibilityHandler: () => void;
  showFormulas: boolean;
};

const StyledTabs = styled(Tabs)`
  & .MuiTabs-indicator {
    display: none;
  }
`;

const StyledTab = styled(Tab)`
  color: #027472;
  cursor: pointer;
  width: 100%;
  padding: 10px;
  margin: 0;
  border: none;
  width: max-content;

  &:hover {
    background-color: transparent;
  }

  &.Mui-selected {
    color: #027472;
    background-color: #deecf9;
  }

  &:focus {
    color: #027472;
    background-color: #deecf9;
  }
`;

export const ContentHeader = ({
  formulasVisibilityHandler,
  showFormulas,
}: PropsType) => {
  const [value, setValue] = useState(0);
  const [invisiblePanel, setInvisiblePanel] = useState<number | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const changeVisibility = useCallback(
    (index: number) => {
      setInvisiblePanel(
        value === index && invisiblePanel !== index ? index : null
      );
    },
    [value, invisiblePanel]
  );

  const tabsData = useMemo(
    () =>
      [
        {
          name: 'Departments',
          icon: <MenuIcon />,
        },
        {
          name: 'Visibility',
          icon: <VisibilityIcon />,
        },
      ].map((item, index) => (
        <StyledTab
          key={item.name}
          label={
            <Box
              display="flex"
              gap="8px"
              alignItems="center"
              onClick={() => changeVisibility(index)}
            >
              {item.icon}
              {item.name}
            </Box>
          }
        />
      )),
    [changeVisibility]
  );

  const departmentsList = useMemo(
    () =>
      [
        'Pre-production',
        'Cast',
        'Salaries',
        'Equipment',
        'Art Dept.',
        'Studio',
        'Location',
        'Data',
      ].map((item, index, arr) => (
        <React.Fragment key={item}>
          <Box>{item}</Box>
          {index !== arr.length - 1 && (
            <Box
              sx={{
                width: '1px',
                margin: 'auto 6px',
                height: '25px',
                backgroundColor: 'black',
              }}
            />
          )}
        </React.Fragment>
      )),
    []
  );

  const visibilityItemsList = useMemo(
    () =>
      [
        'International',
        'Taxes',
        'Overtime',
        '%MU',
        'RK column.',
        'Position text',
        'Show formulas',
      ].map((item, index, arr) => (
        <FormControlLabel
          key={item}
          label={item}
          control={
            index === arr.length - 1 ? (
              <Switch
                checked={showFormulas}
                onChange={formulasVisibilityHandler}
              />
            ) : (
              <Switch />
            )
          }
        />
      )),
    [showFormulas]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabsData}
        </StyledTabs>
      </Box>
      <Box>
        <ContentHeaderTabPanel
          value={value}
          index={0}
          isInvisible={invisiblePanel === 0}
        >
          <Box
            display="flex"
            gap="10px"
            height="44px"
            alignItems="center"
            margin="0 10px"
          >
            {departmentsList}
          </Box>
        </ContentHeaderTabPanel>
        <ContentHeaderTabPanel
          value={value}
          index={1}
          isInvisible={invisiblePanel === 1}
        >
          <Box
            display="flex"
            gap="10px"
            height="44px"
            alignItems="center"
            margin="0 10px"
          >
            {visibilityItemsList}
          </Box>
        </ContentHeaderTabPanel>
      </Box>
    </Box>
  );
};
