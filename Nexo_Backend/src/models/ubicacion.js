const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Ubicacion = sequelize.define(
  "Ubicacion",
  {
    ubicacion_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    tipo_ubicacion: {
      type: DataTypes.ENUM('comercial', 'residencial', 'industrial', 'otro'),
      allowNull: false,
      defaultValue: 'comercial'
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    coordenada: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    municipio: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    sector: {
      type: DataTypes.STRING(500),
    },
    referencia: {
      type: DataTypes.TEXT,
    },
    telefono: {
      type: DataTypes.STRING(20),
      validate: {
        is: /^\+?[1-9]\d{1,14}$/
      }
    },
    email_contacto: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true
      }
    },
    horario_atencion: {
      type: DataTypes.STRING(500),
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "ubicaciones",
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    hooks: {
      beforeCreate: (ubicacion) => {
        if (!ubicacion.codigo) {
          ubicacion.codigo = `UB${Date.now()}`;
        }
      }
    }
  }
);

// Método para validar si la ubicación puede ser eliminada
Ubicacion.prototype.puedeSerEliminada = async function() {
  const evaluaciones = await this.getEvaluaciones();
  return evaluaciones.length === 0;
};

module.exports = Ubicacion;
