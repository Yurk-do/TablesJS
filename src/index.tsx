import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('./sw.js')
//     .then((registration) => {
//        setInterval(() => {
//         registration.update();
//         console.log('Checked for update...');
//       }, 1000 * 60 * 1);
//       registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
//       registration.onupdatefound = () => {
//         console.log('Update is found');
//       };
//     })
//     .catch((err) => {
//       console.log('Service Worker Failed to Register', err);
//     });
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
