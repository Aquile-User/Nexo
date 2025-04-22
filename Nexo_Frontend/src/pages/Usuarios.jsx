import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Typography, Paper, CircularProgress, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';
import '../styles/evaluaciones.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/usuarios');
      console.log('Datos recibidos:', response.data);

      if (Array.isArray(response.data)) {
        const usuariosFormateados = response.data.map((usuario) => {
          if (!usuario) return null;

          return {
            id: usuario.usuario_id,
            usuario_id: usuario.usuario_id,
            nombre: usuario.nombre || '-',
            correo: usuario.correo || '-',
            rol: usuario.rolUsuario?.nombre || '-',
            estado: usuario.estado || 'deshabilitado',
            fecha_registro: usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString('es-ES') : '-'
          };
        }).filter(Boolean); // Eliminar elementos nulos

        console.log('Usuarios formateados:', usuariosFormateados);
        setUsuarios(usuariosFormateados);
      } else {
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.response?.data?.error || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios, refreshKey]);

  useEffect(() => {
    if (location.state?.refresh) {
      console.log('Refrescando lista de usuarios...');
      setRefreshKey(prev => prev + 1);
      // Limpiar el estado después de procesar el refresco
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refresh, location.state?.timestamp, navigate]);

  const columns = [
    {
      field: 'usuario_id',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => (
        <Typography sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params?.row?.usuario_id || '-'}
        </Typography>
      )
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 200,
      renderCell: (params) => (
        <Typography>{params?.row?.nombre || '-'}</Typography>
      )
    },
    {
      field: 'correo',
      headerName: 'Correo',
      width: 250,
      renderCell: (params) => (
        <Typography>{params?.row?.correo || '-'}</Typography>
      )
    },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => (
        <Typography>{params?.row?.rol || '-'}</Typography>
      )
    },
    {
      field: 'fecha_registro',
      headerName: 'Fecha Registro',
      width: 150,
      renderCell: (params) => (
        <Typography>{params?.row?.fecha_registro || '-'}</Typography>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const value = params?.row?.estado || 'deshabilitado';
        return (
          <Chip
            label={value === 'habilitado' ? 'Activo' : 'Inactivo'}
            color={value === 'habilitado' ? 'success' : 'error'}
            variant="outlined"
          />
        );
      }
    }
  ];

  const handleRowDoubleClick = (params) => {
    if (params?.row?.usuario_id) {
      console.log(`Navegando a editar usuario con ID: ${params.row.usuario_id}`);
      navigate(`/editar-usuario/${params.row.usuario_id}`);
    } else {
      console.error('Error: No se pudo identificar el ID del usuario');
      setError('Error al seleccionar el usuario. ID no disponible.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} className="evaluaciones-container">
      <Box className="page-title-container">
        <Typography
          variant="h4"
          component="h1"
          className="page-title"
          sx={{ textAlign: 'center', width: '100%', color: 'var(--primary-color)', marginBottom: 0 }}
        >
          Gestión de Usuarios
        </Typography>
        <IconButton
          aria-label="add user"
          onClick={() => navigate('/crear-usuario')}
          sx={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.8)',
            },
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box className="datagrid-container">
        <DataGrid
          rows={usuarios}
          columns={columns}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center'
            }
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            }
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id || row.usuario_id || Math.random().toString()}
          className="evaluaciones-grid"
          onRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Paper>
  );
}

export default Usuarios;