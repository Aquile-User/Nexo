const { DataTypes } = require("sequelize");
const sequelize = require("./src/config/database.js");

const Rol = sequelize.define(
  "Rol",
  {
    rol_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Rol;
