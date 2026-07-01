import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Chip, { type ChipProps } from '@mui/material/Chip';

interface ConnectionStatusChipProps extends Omit<ChipProps, 'color' | 'icon' | 'label'> {
  isConnected: boolean;
}

export default function ConnectionStatusChip({ isConnected, size = 'small', ...props }: ConnectionStatusChipProps) {
  return (
    <Chip
      icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
      label={isConnected ? 'Live Updates' : 'Offline'}
      color={isConnected ? 'success' : 'default'}
      size={size}
      {...props}
    />
  );
}