import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SuccessNotification = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ 
        '& .MuiSnackbar-root': {
          top: '80px !important' // Adjust this value based on your TopBar height
        }
      }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessNotification;