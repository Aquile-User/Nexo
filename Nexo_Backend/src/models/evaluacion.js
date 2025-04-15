const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Ubicacion = require("./ubicacion");

const Evaluacion = sequelize.define(
  "Evaluacion",
  {
    evaluacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ubicacion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fecha_programada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_realizada: {
      type: DataTypes.DATE,
    },
    resultado: {
      type: DataTypes.TEXT,
    },
    comentarios: {
      type: DataTypes.TEXT,
    },
    tipo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "completada",
        "en progreso",
        "cancelada"
      ),
      defaultValue: "pendiente",
    },
    motivo_no_evaluacion: {
      type: DataTypes.STRING(500),
    },
  },
  {
    tableName: "evaluaciones",
    timestamps: false,
  }
);

Evaluacion.belongsTo(Ubicacion, {
  foreignKey: "ubicacion_id",
  as: "ubicacion",
});

module.exports = Evaluacion;
