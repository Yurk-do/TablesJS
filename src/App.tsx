import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import './App.css';
import { Button, createTheme, IconButton, ThemeProvider } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { DrawerProvider } from './components/NavigationDrawer/Layout.context';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';
import { initDB } from './db/db';
import { useServiceWorker } from './hooks/useServiceWorker';

const theme = createTheme();

const App = () => {
  useEffect(() => {
    initDB();
  }, []);

  const { waitingWorker, showReload, reloadPage } = useServiceWorker();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = () => {
    setOpen(true);
    setMessage('update available');
  };

  const closeToast = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (showReload && waitingWorker) {
      showToast();
    } else closeToast();
  }, [waitingWorker, showReload, reloadPage]);

  const action = (
    <>
      <Button color="secondary" size="small" onClick={reloadPage}>
        Update
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeToast}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <DrawerProvider>
          <HomePage />
          <Snackbar
            open={open}
            autoHideDuration={20000}
            onClose={closeToast}
            message={message}
            action={action}
          />
        </DrawerProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
