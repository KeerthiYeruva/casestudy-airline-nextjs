import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import ConnectionStatusChip from './ConnectionStatusChip';

interface PageHeaderProps {
  title: string;
  isConnected: boolean;
  description?: string;
  icon?: ReactNode;
  selectedFlightNumber?: string;
}

export default function PageHeader({
  title,
  isConnected,
  description,
  icon,
  selectedFlightNumber,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: description ? 0.5 : 0, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h4">
            {title}
          </Typography>
        </Box>
        <ConnectionStatusChip isConnected={isConnected} sx={{ ml: 'auto' }} />
        {selectedFlightNumber && (
          <Chip
            label={selectedFlightNumber}
            color="primary"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
        )}
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
}