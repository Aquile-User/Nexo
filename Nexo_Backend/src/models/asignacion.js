const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asignacion = sequelize.define('Asignacion', {
  asignacion_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  tipo_asignacion: {
    type: DataTypes.ENUM('evaluacion', 'ruta'),
    allowNull: false
  },
  evaluacion_id: {
    type: DataTypes.BIGINT,
  },
  ruta_id: {
    type: DataTypes.BIGINT
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'asignaciones',
  timestamps: false
});

Asignacion.associate = (models) => {
  Asignacion.belongsTo(models.Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
  });
  Asignacion.belongsTo(models.Evaluacion, {
    foreignKey: 'evaluacion_id',
    as: 'evaluacion'
  });
  Asignacion.belongsTo(models.Ruta, {
    foreignKey: 'ruta_id',
    as: 'ruta'
  });
};

module.exports = Asignacion;
