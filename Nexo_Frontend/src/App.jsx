import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Evaluaciones from './pages/evaluaciones';
import InicioSesion from './pages/inicioSesion';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<InicioSesion />} />
        <Route
          path="/*"
          element={
            <Box className="app-container">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <Box className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                <TopBar />
                <Box className="content-wrapper">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/evaluaciones" replace />} />
                    <Route path="/evaluaciones" element={<Evaluaciones />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
