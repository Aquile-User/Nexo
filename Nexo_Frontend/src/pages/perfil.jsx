import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedUserIcon,
  SupervisorAccount as RolIcon
} from '@mui/icons-material';
import { getCurrentUserProfile } from '../services/authService';
import '../styles/perfil.css';

const Perfil = ({ sidebarOpen }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await getCurrentUserProfile();
        setUsuario(data);
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">No se encontró información del usuario</Typography>
      </Box>
    );
  }

  const getInitials = (nombre) => {
    return nombre.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`perfil-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {getInitials(usuario.nombre)}
          </div>
          <div className="perfil-info-header">
            <h1 className="perfil-nombre">{usuario.nombre}</h1>
            <span className="perfil-rol">
              <RolIcon />
              {usuario.rolUsuario?.nombre || 'Sin rol asignado'}
            </span>
          </div>
        </div>

        <div className="perfil-detalles">
          <div className="detalle-item">
            <span className="detalle-label">
              <EmailIcon sx={{ fontSize: 20, marginRight: 1 }} />
              Correo Electrónico
            </span>
            <span className="detalle-valor">{usuario.correo}</span>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">
              <BadgeIcon sx={{ fontSize: 20, marginRight: 1 }} />
              ID de Usuario
            </span>
            <span className="detalle-valor">{usuario.usuario_id}</span>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">
              <CalendarIcon sx={{ fontSize: 20, marginRight: 1 }} />
              Fecha de Registro
            </span>
            <span className="detalle-valor">{formatDate(usuario.fecha_registro)}</span>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">
              <VerifiedUserIcon sx={{ fontSize: 20, marginRight: 1 }} />
              Estado
            </span>
            <span className={`estado-badge estado-${usuario.estado}`}>
              {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;