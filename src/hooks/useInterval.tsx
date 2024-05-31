import { useEffect } from 'react';

export const useInterval = (
  handler: () => void,
  time = 10000,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    const saveInterval = setInterval(() => {
      handler();
    }, time);
    return () => clearInterval(saveInterval);
  }, [...dependencies]);
};
