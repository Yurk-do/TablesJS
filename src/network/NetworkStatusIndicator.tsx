import * as React from 'react';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useNavigatorOnLine } from './useNetworkStatus';

export const NetworkStatusIndicator = () => {
  const isOnline = useNavigatorOnLine();

  return isOnline ? (
    <WifiIcon color="primary" />
  ) : (
    <WifiOffIcon color="warning" />
  );
};
