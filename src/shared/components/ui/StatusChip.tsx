import Chip, { type ChipProps } from '@mui/material/Chip';
import type { Flight } from '../../../domain/flights/types';

type FlightStatus = Flight['status'];

interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: FlightStatus;
}

const statusColor: Record<FlightStatus, ChipProps['color']> = {
  'On Time': 'success',
  Boarding: 'warning',
  Delayed: 'warning',
  Departed: 'info',
  Arrived: 'success',
  Cancelled: 'error',
};

export default function StatusChip({ status, size = 'small', variant = 'filled', ...props }: StatusChipProps) {
  return (
    <Chip
      label={status}
      size={size}
      variant={variant}
      color={statusColor[status]}
      {...props}
    />
  );
}