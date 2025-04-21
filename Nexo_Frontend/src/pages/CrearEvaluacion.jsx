import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Container } from '@mui/material';
import api from '../services/api';
import TopBar from '../components/TopBar'; // Add this import
import SideBar from '../components/SideBar'; // Add this import

function CrearEvaluacion() {  // Changed component name
  const [formData, setFormData] = useState({
    ubicacion_id: '',
    fecha_programada: '',
    hora_programada: '', // Add new field for time
    tipo: '',
    comentarios: ''
  });

  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const response = await api.get('/ubicaciones');
        console.log('Ubicaciones recibidas:', response.data.ubicaciones); // Log the ubicaciones array
        if (Array.isArray(response.data.ubicaciones)) {
          setUbicaciones(response.data.ubicaciones);
        } else {
          console.error('Se esperaba un array pero se recibió:', response.data);
          setUbicaciones([]);
        }
      } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        setUbicaciones([]);
      }
    };

    fetchUbicaciones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine date and time before sending to API
      const fechaCompleta = formData.fecha_programada && formData.hora_programada
        ? `${formData.fecha_programada}T${formData.hora_programada}:00` // Added :00 for seconds
        : formData.fecha_programada;
  
      const dataToSend = {
        ...formData,
        fecha_programada: fechaCompleta,
      };
      
      delete dataToSend.hora_programada;
  
      const response = await api.post('/evaluaciones', dataToSend);
      
      if (response.status === 201) {
        alert('Evaluación creada exitosamente');
        // Reset form after successful submission
        setFormData({
          ubicacion_id: '',
          fecha_programada: '',
          hora_programada: '',
          tipo: '',
          comentarios: ''
        });
      } else {
        throw new Error('Error al crear la evaluación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al crear la evaluación');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Container maxWidth="lg" sx={{ 
          py: 4, 
          mt: 10,  // Aumenté el margen superior
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 128px)'  // Ajusté la altura
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',  // Cambié de 'stretch' a 'center'
          }}>
            <Paper elevation={3} sx={{ 
              padding: 4, 
              width: '100%',
              maxWidth: { xs: '100%', md: '550px' },
              maxHeight: { xs: '100%', md: '700px' },
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
                Crear Evaluacion
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField 
                  label="Ubicación ID" 
                  name="ubicacion_id" 
                  value={formData.ubicacion_id} 
                  onChange={handleChange} 
                  required 
                  fullWidth
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField 
                    label="Fecha Programada" 
                    name="fecha_programada" 
                    type="date" 
                    value={formData.fecha_programada} 
                    onChange={handleChange} 
                    required 
                    InputLabelProps={{ shrink: true }} 
                    fullWidth
                    variant="outlined"
                  />
                  <TextField 
                    label="Hora Programada" 
                    name="hora_programada" 
                    type="time" 
                    value={formData.hora_programada} 
                    onChange={handleChange} 
                    required 
                    InputLabelProps={{ shrink: true }} 
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <TextField 
                  label="Tipo" 
                  name="tipo" 
                  value={formData.tipo} 
                  onChange={handleChange} 
                  required 
                  fullWidth
                  variant="outlined"
                />
                <TextField 
                  label="Comentarios" 
                  name="comentarios" 
                  value={formData.comentarios} 
                  onChange={handleChange} 
                  multiline 
                  rows={4} 
                  fullWidth
                  variant="outlined"
                />
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
                  Crear Evaluación
                </Button>
              </Box>
            </Paper>
  
            <Paper elevation={3} sx={{ 
              padding: 4, 
              width: '100%',
              maxWidth: { xs: '100%', md: '550px' },
              maxHeight: { xs: '100%', md: '700px' },
              backgroundColor: 'white',
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
                variant="h5" 
                sx={{ 
                  marginBottom: 3,
                  color: 'var(--primary-color)',
                  fontWeight: 'bold',
                  borderBottom: '2px solid var(--primary-color)',
                  paddingBottom: 2
                }}
              >
                Ubicaciones Disponibles
              </Typography>
              <List sx={{ 
                flexGrow: 1,
                overflow: 'auto',
                minHeight: 0,
                borderRadius: 1,
                '& .MuiListItem-root': {
                  padding: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                    transform: 'scale(1.01)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }
                }
              }}>
                {ubicaciones.map((ubicacion) => (
                  <ListItem 
                    key={ubicacion.id || ubicacion.ubicacion_id}
                    sx={{
                      borderBottom: '1px solid var(--border-color)',
                      '&:last-child': { borderBottom: 'none' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText 
                      primary={ubicacion.nombre} 
                      secondary={`ID: ${ubicacion.id || ubicacion.ubicacion_id}`}
                      primaryTypographyProps={{ 
                        fontWeight: 'medium',
                        color: 'var(--text-primary)'
                      }}
                      secondaryTypographyProps={{
                        color: 'var(--text-secondary)'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default CrearEvaluacion;  // Changed export name