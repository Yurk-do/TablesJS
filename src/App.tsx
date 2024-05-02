import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {DrawerProvider} from "./components/NavigationDrawer/Layout.context";

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
