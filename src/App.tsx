import React, { useEffect } from 'react';
import './App.css';
import { createTheme, Modal, ThemeProvider } from '@mui/material';
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

  const [modalOpen, setModalOpen] = React.useState(false);

  let update: any;

  const serviceWorkerRegistration = navigator.serviceWorker.getRegistration();
  serviceWorkerRegistration?.then((registration) => {
    if (registration) {
      registration.onupdatefound = () => {
        setModalOpen(true);
      };
      update = registration.update;
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <DrawerProvider>
          <HomePage />
          <Modal
            open={modalOpen && update}
            onClose={() => setModalOpen(false)}
          >
            <>
              <div>
                You should update your app
              </div>
              <button type="submit" onClick={() => update?.()}>
                Update
              </button>
            </>
          </Modal>
        </DrawerProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
