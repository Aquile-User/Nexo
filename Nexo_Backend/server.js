const express = require('express');
const sequelize = require('./src/config/database');
const app = require('./app');


// Sincronizamos los modelos con la base de datos
sequelize.sync()
  .then(() => console.log('🔄 Modelos sincronizados con la base de datos'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
