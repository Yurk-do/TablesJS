import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {DrawerProvider} from "./components/NavigationDrawer/Layout.context";
import "jsuites/dist/jsuites.css";
import "jspreadsheet/dist/jspreadsheet.css";

function App() {
  return (
    <div className="App">
      <DrawerProvider>
        <HomePage/>
      </DrawerProvider>
    </div>
  );
}

export default App;
