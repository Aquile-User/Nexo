require("dotenv").config();
const { Sequelize } = require("sequelize");

// Configurar la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => {
      console.log("\nSQL Query:", msg);
    },
    dialectOptions: {
      // Configuración adicional para MySQL
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Verificar la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos establecida correctamente.");
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });

module.exports = sequelize;
