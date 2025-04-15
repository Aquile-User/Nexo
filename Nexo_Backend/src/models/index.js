const Ruta = require('./ruta');
const Evaluacion = require('./evaluacion');
const Ubicacion = require('./ubicacion');
const Asignacion = require('./asignacion');
const Usuario = require('./usuario');
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

// Relación Evaluacion - Ubicacion
Evaluacion.belongsTo(Ubicacion, {
  foreignKey: "ubicacion_id",
  as: "ubicacion",
});

// Relación Evaluacion - Asignacion
Evaluacion.hasMany(Asignacion, {
  foreignKey: 'evaluacion_id',
  as: 'asignaciones'
});

Asignacion.belongsTo(Evaluacion, {
  foreignKey: 'evaluacion_id',
  as: 'evaluacion'
});

// Relación Asignacion - Usuario
Asignacion.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

module.exports = {
  Ruta,
  Evaluacion,
  Ubicacion,
  Asignacion,
  Usuario,
  RutaUbicacion
};
