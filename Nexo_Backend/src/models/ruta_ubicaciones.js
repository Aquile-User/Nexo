const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const RutaUbicacion = sequelize.define(
  "RutaUbicacion",
  {
    ruta_ubicacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    ruta_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Rutas',
        key: 'ruta_id'
      }
    },
    ubicacion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Ubicaciones',
        key: 'ubicacion_id'
      }
    }
  },
  {
    tableName: 'ruta_ubicaciones' // Add this to specify the correct table name
  }
);

module.exports = RutaUbicacion;