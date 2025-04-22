const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Rol = require("./rol");

const Usuario = sequelize.define(
  "Usuario",
  {
    usuario_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("habilitado", "deshabilitado"),
      defaultValue: "habilitado",
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

// Definir la relación con el rol
Usuario.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

module.exports = Usuario;
