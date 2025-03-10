require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database'); // Importar la conexión

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Probar conexión con MySQL
sequelize.authenticate()
    .then(() => console.log('✅ Conectado a la base de datos correctamente'))
    .catch(err => console.error('❌ Error al conectar la base de datos:', err));

// Sincronizar modelos con la base de datos (Crea las tablas si no existen)
sequelize.sync()
    .then(() => console.log('🔄 Modelos sincronizados con la base de datos'))
    .catch(err => console.error('❌ Error al sincronizar modelos:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
