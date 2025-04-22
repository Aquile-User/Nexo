import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import api from '../services/api';
import SuccessNotification from '../components/notifications/SuccessNotification';
import ErrorNotification from '../components/notifications/ErrorNotification';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('[EditarUsuario] Inicialización del componente con ID:', id);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol_id: '',
    estado: 'habilitado'
  });

  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: ''
  });
  const [openConfirm, setOpenConfirm] = useState(false);

  // Resetear el formulario cuando cambia el ID
  useEffect(() => {
    console.log('[EditarUsuario] ID cambiado, reseteando formulario:', id);
    setFormData({
      nombre: '',
      correo: '',
      rol_id: '',
      estado: 'habilitado'
    });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[EditarUsuario] Iniciando carga de datos para usuario ID:', id);

        const rolesResponse = await api.get('/roles');
        console.log('[EditarUsuario] Roles obtenidos:', rolesResponse.data);

        if (Array.isArray(rolesResponse.data)) {
          setRoles(rolesResponse.data);
        }

        console.log('[EditarUsuario] Obteniendo datos del usuario...');
        const usuarioResponse = await api.get(`/usuarios/${id}`);
        const usuario = usuarioResponse.data;
        console.log('[EditarUsuario] Datos del usuario recibidos:', usuario);

        // Validación de datos recibidos
        if (!usuario || typeof usuario !== 'object') {
          console.error('[EditarUsuario] Datos de usuario inválidos:', usuario);
          setNotification({
            open: true,
            message: 'Error: Datos de usuario no válidos',
            type: 'error'
          });
          return;
        }

        // Verificar que el ID coincida con el solicitado
        if (usuario.id !== parseInt(id) && usuario.usuario_id !== parseInt(id)) {
          console.error(`[EditarUsuario] Error: ID de usuario no coincide. Esperado: ${id}, Recibido: ${usuario.usuario_id || usuario.id}`);
          setNotification({
            open: true,
            message: `Error: El usuario recibido (ID: ${usuario.usuario_id || usuario.id}) no coincide con el solicitado (ID: ${id})`,
            type: 'error'
          });
          return;
        }

        const nuevoFormData = {
          nombre: usuario.nombre || '',
          correo: usuario.correo || '',
          rol_id: usuario.rol_id || '',
          estado: usuario.estado || 'habilitado'
        };
        console.log(`[EditarUsuario] Estableciendo formData para usuario ${id}:`, nuevoFormData);
        setFormData(nuevoFormData);
      } catch (error) {
        console.error('[EditarUsuario] Error al cargar datos:', error);
        console.error('[EditarUsuario] Detalles completos del error:', {
          mensaje: error.message,
          respuesta: error.response?.data,
          estado: error.response?.status
        });
        setNotification({
          open: true,
          message: error.response?.data?.error || error.message || 'Error al cargar los datos del usuario',
          type: 'error'
        });
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('[EditarUsuario] Campo modificado:', { name, value });
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log('[EditarUsuario] Nuevo estado del formulario:', newData);
      return newData;
    });
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    console.log('[EditarUsuario] Abriendo diálogo de confirmación');
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    console.log('[EditarUsuario] Cerrando diálogo de confirmación');
    setOpenConfirm(false);
  };

  // Función para preparar los datos antes de enviar
  const prepareDataToSend = () => {
    // Copia profunda para evitar modificar el estado original
    const dataToSend = JSON.parse(JSON.stringify(formData));

    // Asegurar que rol_id sea un número
    if (dataToSend.rol_id) {
      dataToSend.rol_id = Number(dataToSend.rol_id);
    }

    console.log('[EditarUsuario] Datos preparados para enviar:', dataToSend);
    return dataToSend;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log('[EditarUsuario] Iniciando envío del formulario');

    try {
      if (!formData.nombre || !formData.correo || !formData.rol_id) {
        throw new Error('Todos los campos son obligatorios');
      }

      const dataToSend = prepareDataToSend();

      console.log('[EditarUsuario] Enviando solicitud de actualización...');
      console.log('[EditarUsuario] URL de la petición:', `/usuarios/${id}`);
      console.log('[EditarUsuario] Datos a enviar:', dataToSend);

      const response = await api.put(`/usuarios/${id}`, dataToSend);

      console.log('[EditarUsuario] Respuesta recibida:', response.data);

      if (response.data) {
        console.log('[EditarUsuario] Actualización exitosa, redirigiendo...');
        setNotification({
          open: true,
          message: response.data.mensaje || 'Usuario actualizado exitosamente',
          type: 'success'
        });

        handleCloseConfirm();

        setTimeout(() => {
          navigate('/usuarios');
        }, 2000);
      }
    } catch (error) {
      console.error('[EditarUsuario] Error durante la actualización:', error);
      console.error('[EditarUsuario] Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data
      });
      setNotification({
        open: true,
        message: error.response?.data?.error || error.message || 'Error al actualizar el usuario',
        type: 'error'
      });
      handleCloseConfirm();
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <TopBar />
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
                  Editar Usuario
                </Typography>
                <Box component="form" onSubmit={handleOpenConfirm} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                    Actualizar Usuario
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Desea continuar con la actualización?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción actualizará la información del usuario. ¿Está seguro de continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button onClick={handleSubmit} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
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

export default EditarUsuario;