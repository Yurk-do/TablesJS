import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {DrawerProvider} from "./components/NavigationDrawer/Layout.context";
import "jsuites/dist/jsuites.css";
import "jspreadsheet/dist/jspreadsheet.css";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <DrawerProvider>
          <HomePage/>
        </DrawerProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
