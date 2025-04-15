const usuarioRoutes = require("./src/routes/usuario.routes");
const rolesRoutes = require("./src/routes/roles.routes");
const rutasRoutes = require("./src/routes/ruta.routes");
const evaluacionRoutes = require("./src/routes/evaluacion.routes");
const asignacionRoutes = require("./src/routes/asignacion.routes");
const ubicacionRoutes = require("./src/routes/ubicacion.routes");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(bodyParser.json()); // Necesario para manejar request.body
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true,
  })
); // Habilita CORS para todas las rutas

// Rutas
// Rutas para usuarios
app.use("/api/usuarios", usuarioRoutes);

// Rutas para roles
app.use("/api/roles", rolesRoutes);

// Rutas para rutas
app.use("/api/rutas", rutasRoutes);

// Rutas para evaluaciones
app.use("/api/evaluaciones", evaluacionRoutes);

// Rutas para asignaciones
app.use("/api/asignaciones", asignacionRoutes);

// Rutas para ubicaciones
app.use("/api/ubicaciones", ubicacionRoutes);

module.exports = app; // Exportar la instancia de Express
