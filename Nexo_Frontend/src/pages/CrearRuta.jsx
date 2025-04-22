import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Container
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SideBar from '../components/SideBar';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to update map center when coordinates change
function MapCenter({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function CrearRuta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    origenNombre: '',
    origenDireccion: '',
    origenLatitud: '-12.0464',
    origenLongitud: '-77.0428',
    destinoNombre: '',
    destinoDireccion: '',
    destinoLatitud: '-12.0464',
    destinoLongitud: '-77.0428',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.origenNombre || !formData.destinoNombre) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos de la ruta:', formData);
      
      // Redireccionar al dashboard después de crear la ruta
      navigate('/dashboard');
    } catch (error) {
      setError('Error al crear la ruta. Por favor intente nuevamente.');
    }
  };

  const mapCenter = [-12.0464, -77.0428]; // Lima, Peru

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Crear Nueva Ruta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Información de la Ruta
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nombre de la Ruta"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Paper>

                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Punto de Origen
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nombre del Origen"
                    name="origenNombre"
                    value={formData.origenNombre}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Dirección de Origen"
                    name="origenDireccion"
                    value={formData.origenDireccion}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Latitud"
                        name="origenLatitud"
                        value={formData.origenLatitud}
                        onChange={handleChange}
                        type="number"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Longitud"
                        name="origenLongitud"
                        value={formData.origenLongitud}
                        onChange={handleChange}
                        type="number"
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Punto de Destino
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nombre del Destino"
                    name="destinoNombre"
                    value={formData.destinoNombre}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Dirección de Destino"
                    name="destinoDireccion"
                    value={formData.destinoDireccion}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Latitud"
                        name="destinoLatitud"
                        value={formData.destinoLatitud}
                        onChange={handleChange}
                        type="number"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Longitud"
                        name="destinoLongitud"
                        value={formData.destinoLongitud}
                        onChange={handleChange}
                        type="number"
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                  >
                    Crear Ruta
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    size="large"
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vista Previa del Mapa
                  </Typography>
                  <Box sx={{ height: '600px', width: '100%' }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapCenter center={mapCenter} />
                      <Marker
                        position={[
                          parseFloat(formData.origenLatitud),
                          parseFloat(formData.origenLongitud)
                        ]}
                      />
                      <Marker
                        position={[
                          parseFloat(formData.destinoLatitud),
                          parseFloat(formData.destinoLongitud)
                        ]}
                      />
                    </MapContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </Box>
  );
}

export default CrearRuta; 