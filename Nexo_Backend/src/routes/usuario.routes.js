const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controllers");
const authMiddleware = require("../middleware/auth");

// Public routes
router.post("/login", usuarioController.login);

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get("/", usuarioController.obtenerUsuarios); // GET /usuarios (all users)
router.get("/perfil", usuarioController.getProfile); // GET /usuarios/perfil
router.get("/:id", usuarioController.obtenerUsuario); // GET /usuarios/:id (single user)
router.post("/", usuarioController.crearUsuario); // POST /usuarios
router.put("/:id", usuarioController.actualizarUsuario); // PUT /usuarios/:id
router.patch("/:id", usuarioController.estadoUsuario); // PATCH /usuarios/:id

module.exports = router;
