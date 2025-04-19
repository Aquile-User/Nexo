import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InicioSesion from './pages/inicioSesion';
import Evaluaciones from './pages/evaluaciones';
import './App.css';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('user');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/" element={<Navigate to="/evaluaciones" replace />} />
        <Route
          path="/evaluaciones"
          element={
            <ProtectedRoute>
              <Evaluaciones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
