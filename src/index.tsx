import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      console.log('Successfully registered service worker', registration);
      // registration.onupdatefound = () => {
      //   console.log('New content is available; please refresh.');
      // };
    })
    .catch((err) => {
      console.log('Service Worker Failed to Register', err);
    });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
