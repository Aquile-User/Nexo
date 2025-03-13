const Ruta = require('./ruta');
const Ubicacion = require('./ubicacion');
const RutaUbicacion = require('./ruta_ubicaciones');

// Relación entre Ruta y RutaUbicacion
Ruta.belongsToMany(Ubicacion, {
  through: RutaUbicacion,
  foreignKey: 'ruta_id',
  otherKey: 'ubicacion_id',
});

// Relación entre Ubicacion y RutaUbicacion
Ubicacion.belongsToMany(Ruta, {
  through: RutaUbicacion,
  foreignKey: 'ubicacion_id',
  otherKey: 'ruta_id',
});

module.exports = {
  Ruta,
  Ubicacion,
  RutaUbicacion,
};
