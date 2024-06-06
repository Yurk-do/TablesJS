import { useState, useCallback, useEffect } from 'react';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

const SW_URL = './sw.js';

export const useServiceWorker = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState<boolean>(false);

  const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    console.log('onSWUpdate', registration);
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  }, []);

  const reloadPage = useCallback(() => {
    console.log('reload');
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  }, [waitingWorker]);

  useEffect(() => {
    serviceWorkerRegistration.register(SW_URL, {
      onUpdate: onSWUpdate,
    });
  }, [onSWUpdate]);
  return { showReload, waitingWorker, reloadPage };
};
