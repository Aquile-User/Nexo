const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
      references: {
        model: "ubicaciones",
        key: "ubicacion_id",
      },
    },
    fecha_programada: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    fecha_realizada: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "completada",
        "en_progreso",
        "cancelada"
      ),
      defaultValue: "pendiente",
      allowNull: false,
    },
    motivo_no_evaluacion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "evaluaciones",
    timestamps: false,
    indexes: [
      {
        fields: ["ubicacion_id"],
      },
      {
        fields: ["estado"],
      },
      {
        fields: ["fecha_programada"],
      },
    ],
  }
);

module.exports = Evaluacion;
