import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  AssignmentInd as AssignmentIndIcon,
  Route as RouteIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import '../styles/Dashboard.css';
import SideBar from '../components/SideBar';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    programadas: 0,
    enProgreso: 0,
    completadas: 0
  });
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mapCenter] = useState([18.4861, -69.9312]); // Santo Domingo, República Dominicana
  const [mapZoom] = useState(9); // Adjusted zoom level for better country visibility
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [evaluacionesRes, ubicacionesRes] = await Promise.all([
        api.get('/api/evaluaciones'),
        api.get('/api/ubicaciones')
      ]);

      // Calcular estadísticas
      const evaluaciones = Array.isArray(evaluacionesRes.data) ? evaluacionesRes.data : [];
      console.log('Evaluaciones recibidas:', evaluaciones);
      
      const stats = evaluaciones.reduce((acc, ev) => ({
        programadas: acc.programadas + (ev.estado === 'pendiente' ? 1 : 0),
        enProgreso: acc.enProgreso + (ev.estado === 'en_progreso' ? 1 : 0),
        completadas: acc.completadas + (ev.estado === 'completada' ? 1 : 0)
      }), { programadas: 0, enProgreso: 0, completadas: 0 });

      console.log('Estadísticas calculadas:', stats);
      setStats(stats);
      
      console.log('Ubicaciones recibidas:', ubicacionesRes.data);
      setUbicaciones(Array.isArray(ubicacionesRes.data) ? ubicacionesRes.data : []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del dashboard. Por favor, intenta de nuevo más tarde.');
      setStats({ programadas: 0, enProgreso: 0, completadas: 0 });
      setUbicaciones([]);
    }
  };

  const QuickAccessCard = ({ title, icon, onClick }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Dashboard
        </Typography>
        
        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'primary.light',
                color: 'white',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>Visitas Programadas</Typography>
              <Typography variant="h3">{stats.programadas}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'warning.light',
                color: 'white',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>En Progreso</Typography>
              <Typography variant="h3">{stats.enProgreso}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'success.light',
                color: 'white',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>Completadas</Typography>
              <Typography variant="h3">{stats.completadas}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Accesos Rápidos */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            textAlign: 'center',
            fontWeight: 'medium',
            color: 'text.primary'
          }}
        >
          Accesos Rápidos
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickAccessCard
              title="Crear Ruta"
              icon={<RouteIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
              onClick={() => navigate('/crear-ruta')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickAccessCard
              title="Asignar Evaluador"
              icon={<AssignmentIndIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
              onClick={() => navigate('/asignar-evaluador')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickAccessCard
              title="Nueva Evaluación"
              icon={<AddIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
              onClick={() => navigate('/crear-evaluacion')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickAccessCard
              title="Ver Evaluaciones"
              icon={<AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
              onClick={() => navigate('/evaluaciones')}
            />
          </Grid>
        </Grid>

        {/* Mapa de Evaluaciones */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            height: '500px',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            px: 1
          }}>
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                fontWeight: 'medium',
                color: 'text.primary'
              }}
            >
              Mapa de Evaluaciones
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/crear-ruta')}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Crear Nueva Ruta
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <MapContainer
              center={[18.4861, -69.9312]}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {ubicaciones && ubicaciones.map((ubicacion) => (
                <Marker
                  key={ubicacion.id}
                  position={[ubicacion.latitud, ubicacion.longitud]}
                >
                  <Popup>
                    <div>
                      <h3>{ubicacion.nombre}</h3>
                      <p>{ubicacion.direccion}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 