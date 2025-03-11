const usuarioRoutes = require("./src/routes/usuario.routes");
const express = require('express');

const app = express();

// Middlewares
app.use(express.json()); // Necesario para manejar request.body

// Rutas
app.use("/usuarios", usuarioRoutes);

module.exports = app; // Exportar la instancia de Express
