const usuarioRoutes = require("./src/routes/usuario.routes");
const rolesRoutes = require("./src/routes/roles.routes");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(bodyParser.json()); // Necesario para manejar request.body
app.use(cors()); // Habilita CORS para todas las rutas

// Rutas
app.use("/usuarios", usuarioRoutes);

app.use("/roles", rolesRoutes);

module.exports = app; // Exportar la instancia de Express
