import React, { useEffect } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { DrawerProvider } from './components/NavigationDrawer/Layout.context';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';
import { initDB } from './db/db';

const theme = createTheme();

const App = () => {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <DrawerProvider>
          <HomePage />
        </DrawerProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
