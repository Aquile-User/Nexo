import React, { useState } from 'react';
import SuccessNotification from '../components/notifications/SuccessNotification';
import ErrorNotification from '../components/notifications/ErrorNotification';

function Ubicacion() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: ''
  });

  const handleAction = async () => {
    try {
      // ... action logic ...
      setNotification({
        open: true,
        message: 'Acción completada exitosamente',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error al completar la acción',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      {/* ... existing JSX ... */}
      <SuccessNotification
        open={notification.type === 'success' && notification.open}
        message={notification.message}
        onClose={handleCloseNotification}
      />
      <ErrorNotification
        open={notification.type === 'error' && notification.open}
        message={notification.message}
        onClose={handleCloseNotification}
      />
    </>
  );
}