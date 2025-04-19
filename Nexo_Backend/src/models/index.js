const Ruta = require("./ruta");
const Evaluacion = require("./evaluacion");
const Ubicacion = require("./ubicacion");
const Asignacion = require("./asignacion");
const Usuario = require("./usuario");
const RutaUbicacion = require("./ruta_ubicaciones");
const Rol = require("./rol");

// Relación entre Usuario y Rol (cambiando el alias para evitar duplicados)
Usuario.belongsTo(Rol, {
  foreignKey: "rol_id",
  as: "rolUsuario",
});

Rol.hasMany(Usuario, {
  foreignKey: "rol_id",
  as: "usuarios",
});

// Relación entre Evaluacion y Ubicacion
Evaluacion.belongsTo(Ubicacion, {
  foreignKey: "ubicacion_id",
  as: "ubicacion",
});

Ubicacion.hasMany(Evaluacion, {
  foreignKey: "ubicacion_id",
  as: "evaluaciones",
});

// Relaciones de Asignacion
Asignacion.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Asignacion.belongsTo(Evaluacion, {
  foreignKey: "evaluacion_id",
  as: "evaluacion",
});

Asignacion.belongsTo(Ruta, {
  foreignKey: "ruta_id",
  as: "ruta",
});

Usuario.hasMany(Asignacion, {
  foreignKey: "usuario_id",
  as: "asignaciones",
});

Evaluacion.hasMany(Asignacion, {
  foreignKey: "evaluacion_id",
  as: "asignaciones",
});

Ruta.hasMany(Asignacion, {
  foreignKey: "ruta_id",
  as: "asignaciones",
});

// Relación entre Ruta y Ubicacion (muchos a muchos)
Ruta.belongsToMany(Ubicacion, {
  through: RutaUbicacion,
  foreignKey: "ruta_id",
  otherKey: "ubicacion_id",
  as: "ubicacionesRuta",
});

Ubicacion.belongsToMany(Ruta, {
  through: RutaUbicacion,
  foreignKey: "ubicacion_id",
  otherKey: "ruta_id",
  as: "rutasUbicacion",
});

module.exports = {
  Ruta,
  Evaluacion,
  Ubicacion,
  Asignacion,
  Usuario,
  RutaUbicacion,
  Rol,
};
