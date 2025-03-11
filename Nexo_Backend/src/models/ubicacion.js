const { DataTypes } = require("sequelize");
const sequelize = require("./src/config/database.js");

const Ubicacion = sequelize.define(
  "Ubicacion",
  {
    ubicacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    coordenada: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    municipio: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING(500),
    },
    fecha_programada: {
      type: DataTypes.DATE,
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
  },
  {
    tableName: "ubicaciones",
    timestamps: false,
  }
);

module.exports = Ubicacion;
