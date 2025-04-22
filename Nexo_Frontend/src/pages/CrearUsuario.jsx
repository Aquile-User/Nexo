import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Container, MenuItem } from '@mui/material';
import api from '../services/api';
import SuccessNotification from '../components/notifications/SuccessNotification';
import ErrorNotification from '../components/notifications/ErrorNotification';

function CrearUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password_hash: '',
    rol_id: '',
    estado: 'habilitado'
  });

  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: ''
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Error al obtener roles:', error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/usuarios', formData);

      if (response.status === 201) {
        setNotification({
          open: true,
          message: 'Usuario creado exitosamente',
          type: 'success'
        });

        setFormData({
          nombre: '',
          correo: '',
          password_hash: '',
          rol_id: '',
          estado: 'habilitado'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error al crear el usuario',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Container maxWidth="lg" sx={{
        py: 4,
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Paper elevation={3} sx={{
            padding: 4,
            width: '100%',
            maxWidth: { xs: '100%', md: '550px' },
            background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-4px)'
            }
          }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                marginBottom: 4,
                textAlign: 'center',
                color: 'var(--primary-color)',
                fontWeight: 'bold',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: 2
              }}
            >
              Crear Usuario
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Contraseña"
                name="password_hash"
                type="password"
                value={formData.password_hash}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                select
                label="Rol"
                name="rol_id"
                value={formData.rol_id}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.rol_id} value={rol.rol_id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              >
                <MenuItem value="habilitado">Activo</MenuItem>
                <MenuItem value="deshabilitado">Inactivo</MenuItem>
              </TextField>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginTop: 2,
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'var(--primary-color)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                Crear Usuario
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
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

export default CrearUsuario;