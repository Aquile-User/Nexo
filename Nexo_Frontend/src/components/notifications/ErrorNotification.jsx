import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorNotification = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ 
        '& .MuiSnackbar-root': {
          top: '80px !important' // Same value as SuccessNotification
        }
      }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorNotification;