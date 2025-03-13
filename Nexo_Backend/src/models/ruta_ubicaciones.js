const {DataTypes} = require("sequelize");
const sequelize = require("../config/database.js");

const RutaUbicacion = sequelize.define(
  "RutaUbicacion",
  {
    ruta_ubicacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ruta_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ubicacion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    }
  },
  {
    tableName: "rutas_ubicaciones",
    timestamps: false,
  }
);

module.exports = RutaUbicacion;