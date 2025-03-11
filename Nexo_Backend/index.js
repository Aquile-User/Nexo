const sequelize = require('./src/config/database');
require('./server');

// Verifica la conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos correctamente'))
  .catch(err => console.error('❌ Error al conectar la base de datos:', err));

module.exports = sequelize;
