import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Typography, Paper, CircularProgress } from '@mui/material';
import api from '../services/api';
import '../styles/evaluaciones.css';

function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/evaluaciones');

      if (Array.isArray(response.data)) {
        const evaluacionesFormateadas = response.data.map((evaluacion) => {
          if (!evaluacion) return null;

          return {
            id: evaluacion.evaluacion_id || '',
            evaluacion_id: evaluacion.evaluacion_id || '',
            fecha_programada: evaluacion.fecha_programada || null,
            fecha_realizada: evaluacion.fecha_realizada || null,
            estado: evaluacion.estado || 'pendiente',
            tipo: evaluacion.tipo || '',
            resultado: evaluacion.resultado || '',
            motivo_no_evaluacion: evaluacion.motivo_no_evaluacion || '',
            comentarios: evaluacion.comentarios || '',
            ubicacion: evaluacion.ubicacion?.nombre || ''
          };
        }).filter(Boolean);

        setEvaluaciones(evaluacionesFormateadas);
      } else {
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cargar las evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const columns = [
    {
      field: 'evaluacion_id',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => (
        <Typography>{params?.row?.evaluacion_id || '-'}</Typography>
      )
    },
    {
      field: 'fecha_programada',
      headerName: 'Fecha Programada',
      width: 180,
      renderCell: (params) => (
        <Typography>{formatDate(params?.row?.fecha_programada)}</Typography>
      )
    },
    {
      field: 'fecha_realizada',
      headerName: 'Fecha Realizada',
      width: 180,
      renderCell: (params) => (
        <Typography>{formatDate(params?.row?.fecha_realizada)}</Typography>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const value = params?.row?.estado || 'pendiente';
        return (
          <Chip
            label={value}
            color={
              value === 'completada' ? 'success' :
                value === 'pendiente' ? 'warning' :
                  value === 'cancelada' ? 'error' : 'default'
            }
            variant="outlined"
          />
        );
      }
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 150,
      renderCell: (params) => (
        <Typography>{params?.row?.tipo || '-'}</Typography>
      )
    },
    {
      field: 'resultado',
      headerName: 'Resultado',
      width: 150,
      renderCell: (params) => (
        <Typography>{params?.row?.resultado || '-'}</Typography>
      )
    },
    {
      field: 'motivo_no_evaluacion',
      headerName: 'Motivo',
      width: 200,
      renderCell: (params) => (
        <Typography>{params?.row?.motivo_no_evaluacion || '-'}</Typography>
      )
    },
    {
      field: 'comentarios',
      headerName: 'Comentarios',
      width: 250,
      renderCell: (params) => (
        <Typography>{params?.row?.comentarios || '-'}</Typography>
      )
    },
    {
      field: 'ubicacion',
      headerName: 'Ubicación',
      width: 200,
      renderCell: (params) => (
        <Typography>{params?.row?.ubicacion || '-'}</Typography>
      )
    }
  ];

  if (loading) {
    return (
      <Box className="page-wrapper">
        <Box className="content-wrapper">
          <Paper elevation={3} className="evaluaciones-container">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="page-wrapper">
      <Box className="content-wrapper">
        <Paper elevation={3} className="evaluaciones-container">
          <Typography variant="h4" component="h1" gutterBottom className="page-title">
            Gestión de Evaluaciones
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box className="datagrid-container">
            <DataGrid
              rows={evaluaciones}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                }
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              loading={loading}
              getRowId={(row) => row.id}
              className="evaluaciones-grid"
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Evaluaciones;