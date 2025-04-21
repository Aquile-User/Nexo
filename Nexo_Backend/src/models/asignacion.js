const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Asignacion = sequelize.define(
  "Asignacion",
  {
    asignacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tipo_asignacion: {
      type: DataTypes.ENUM("evaluacion", "ruta"),
      allowNull: false,
    },
    evaluacion_id: {
      type: DataTypes.BIGINT,
    },
    ruta_id: {
      type: DataTypes.BIGINT,
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "asignaciones",
    timestamps: false,
  }
);

// Las asociaciones se definen en models/index.js
module.exports = Asignacion;
