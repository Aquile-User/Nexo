require("dotenv").config();
const sequelize = require("./src/config/database");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verificar la conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos correctamente");

    // Sincronizar los modelos
    await sequelize.sync();
    console.log("🔄 Modelos sincronizados con la base de datos");

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();

module.exports = sequelize;
