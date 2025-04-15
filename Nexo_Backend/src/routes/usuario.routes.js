const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controllers");

// Rutas para usuarios
router.post("/login", usuarioController.login);
router.get("/:id?", usuarioController.obtenerUsuarios); // Agregamos un parámetro opcional ':id?'
router.post("/", usuarioController.crearUsuario); // POST /usuarios
router.put("/:id", usuarioController.actualizarUsuario); // PUT /usuarios/:id
router.patch("/:id", usuarioController.estadoUsuario); // PATCH  /usuarios/:id

module.exports = router;
