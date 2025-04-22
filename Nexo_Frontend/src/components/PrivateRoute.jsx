import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verificar si existe un usuario en localStorage
  const userStr = localStorage.getItem('user');
  
  // Si no hay usuario, redirigir al login
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizar el componente hijo
  return children;
};

export default PrivateRoute; 