const usuarioRoutes = require("./src/routes/usuario.routes");
const rolesRoutes = require("./src/routes/roles.routes");
const rutasRoutes = require("./src/routes/ruta.routes");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(bodyParser.json()); // Necesario para manejar request.body
app.use(cors()); // Habilita CORS para todas las rutas

// Rutas
  // Rutas para usuarios
  app.use("/api/usuarios", usuarioRoutes);

  // Rutas para roles
  app.use("/api/roles", rolesRoutes);

  // Rutas para rutas (Nota: el método debería ser app.use en lugar de app.get)
  app.use("/api/rutas", rutasRoutes);



module.exports = app; // Exportar la instancia de Express
