import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Evaluaciones from './pages/evaluaciones';
import InicioSesion from './pages/inicioSesion';
import Perfil from './pages/perfil';
import './App.css';
import CrearEvaluacion from './pages/CrearEvaluacion'; // Changed import name
import EditarEvaluacion from './pages/EditarEvaluacion';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Componente para las rutas protegidas que incluyen Sidebar y TopBar
  const ProtectedLayout = () => {
    // Verificar si el usuario está autenticado
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return <Navigate to="/login" replace />;
    }

    return (
      <Box className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          <TopBar />
          <Box className="content-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Navigate to="/evaluaciones" replace />} />
              <Route path="/evaluaciones" element={<Evaluaciones />} />
              <Route path="/perfil" element={<Perfil sidebarOpen={sidebarOpen} />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/*" element={<ProtectedLayout />} />
        <Route path="/crear-evaluacion" element={<CrearEvaluacion />} /> {/* Updated path and component name */}
        // Add to your routes:
        <Route path="/editar-evaluacion/:id" element={<EditarEvaluacion />} />
      </Routes>
    </Router>
  );
}

export default App;
