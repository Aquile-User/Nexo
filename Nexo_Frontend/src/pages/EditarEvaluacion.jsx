import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, MenuItem, Container } from '@mui/material';
import api from '../services/api';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import SuccessNotification from '../components/notifications/SuccessNotification';
import ErrorNotification from '../components/notifications/ErrorNotification';

function EditarEvaluacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ubicacion_id: '',
    fecha_programada: '',
    hora_programada: '',
    tipo: '',
    comentarios: '',
    resultado: '',
    estado: 'pendiente',
    motivo_no_evaluacion: '',
    fecha_realizada: ''
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: ''
  });

  // Resetear el formulario cuando cambia el ID
  useEffect(() => {
    setFormData({
      ubicacion_id: '',
      fecha_programada: '',
      hora_programada: '',
      tipo: '',
      comentarios: '',
      resultado: '',
      estado: 'pendiente',
      motivo_no_evaluacion: '',
      fecha_realizada: ''
    });
  }, [id]);

  useEffect(() => {
    const fetchEvaluacion = async () => {
      try {
        console.log(`Obteniendo evaluación con ID: ${id}`);
        const response = await api.get(`/evaluaciones/${id}`);
        const evaluacion = response.data;

        console.log('Datos de evaluación recibidos:', evaluacion); // Debug log

        if (!evaluacion || typeof evaluacion !== 'object') {
          console.error('Datos de evaluación inválidos:', evaluacion);
          setNotification({
            open: true,
            message: 'Error: Datos de evaluación no válidos',
            type: 'error'
          });
          return;
        }

        // Verificar que el ID coincida con el solicitado
        if (evaluacion.evaluacion_id !== parseInt(id)) {
          console.error(`Error: ID de evaluación no coincide. Esperado: ${id}, Recibido: ${evaluacion.evaluacion_id}`);
          setNotification({
            open: true,
            message: `Error: La evaluación recibida (ID: ${evaluacion.evaluacion_id}) no coincide con la solicitada (ID: ${id})`,
            type: 'error'
          });
          return;
        }

        // Parse date and time if they exist
        const fechaProgramada = evaluacion.fecha_programada ? evaluacion.fecha_programada.split('T')[0] : '';
        const horaProgramada = evaluacion.fecha_programada ? evaluacion.fecha_programada.split('T')[1].substring(0, 5) : '';

        const newFormData = {
          ubicacion_id: evaluacion.ubicacion_id || '',
          fecha_programada: fechaProgramada,
          hora_programada: horaProgramada,
          tipo: evaluacion.tipo || '',
          comentarios: evaluacion.comentarios || '',
          resultado: evaluacion.resultado || '',
          estado: evaluacion.estado || 'pendiente',
          motivo_no_evaluacion: evaluacion.motivo_no_evaluacion || '',
          fecha_realizada: evaluacion.fecha_realizada ? evaluacion.fecha_realizada : ''
        };

        console.log(`Datos asignados al formulario para evaluación ${id}:`, newFormData); // Debug log mejorado
        setFormData(newFormData);
      } catch (error) {
        console.error('Error al obtener evaluación:', error);
        setNotification({
          open: true,
          message: 'Error al cargar la evaluación: ' + (error.response?.data?.error || error.message),
          type: 'error'
        });
      }
    };

    if (id) {
      fetchEvaluacion(); // Ejecutar la función para cargar los datos
    }
  }, [id]); // Añadimos id como dependencia para que se actualice cuando cambie

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If state changes to completed, set current date/time
    if (name === 'estado' && value === 'completada') {
      const now = new Date();
      const fecha = now.toISOString().split('T')[0];
      const hora = now.toTimeString().substring(0, 5);

      setFormData(prev => ({
        ...prev,
        [name]: value,
        fecha_realizada: `${fecha}T${hora}:00`
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fechaCompleta = formData.fecha_programada && formData.hora_programada
        ? `${formData.fecha_programada}T${formData.hora_programada}:00`
        : formData.fecha_programada;

      const dataToSend = {
        ...formData,
        fecha_programada: fechaCompleta,
      };

      delete dataToSend.hora_programada;

      const response = await api.put(`/evaluaciones/${id}`, dataToSend);

      setNotification({
        open: true,
        message: response.data.mensaje || 'Evaluación actualizada exitosamente',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/evaluaciones');
      }, 1500);
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.error || 'Error al actualizar evaluación',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <TopBar />
          <Container maxWidth="lg" sx={{
            py: 4,
            mt: 6, // Changed from mt: 8 to mt: 6 to move it up more
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
                  Editar Evaluación
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Existing fields from CrearEvaluacion */}
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

                  {/* New fields */}
                  <TextField
                    label="Estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    select
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="en_progreso">En progreso</MenuItem>
                    <MenuItem value="completada">Completada</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </TextField>

                  {formData.estado === 'cancelada' && (
                    <TextField
                      label="Motivo de cancelación"
                      name="motivo_no_evaluacion"
                      value={formData.motivo_no_evaluacion}
                      onChange={handleChange}
                      required
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  )}

                  {formData.estado === 'completada' && (
                    <>
                      <TextField
                        label="Fecha realizada"
                        name="fecha_realizada"
                        value={formData.fecha_realizada.split('T')[0]}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        label="Resultado"
                        name="resultado"
                        value={formData.resultado}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        required
                      />
                    </>
                  )}
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
                    {formData.estado === 'completada' ? 'Marcar como completada' : 'Actualizar evaluación'}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>

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

export default EditarEvaluacion;