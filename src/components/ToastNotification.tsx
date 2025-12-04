'use client';

import React from 'react';
import useToastStore from '@/stores/useToastStore';
import { Snackbar, Alert } from '@mui/material';

const ToastNotification: React.FC = () => {
  const { open, message, severity, hideToast } = useToastStore();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideToast();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
