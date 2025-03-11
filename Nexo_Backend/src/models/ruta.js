const { DataTypes } = require("sequelize");
const sequelize = require("./src/config/database.js");

const Ruta = sequelize.define(
  "Ruta",
  {
    ruta_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "rutas",
    timestamps: false,
  }
);

module.exports = Ruta;
