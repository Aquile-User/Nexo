const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controllers");
const authMiddleware = require("../middleware/auth");
const Rol = require("../models/rol");

// Public routes
router.post("/login", usuarioController.login);
router.post("/", usuarioController.crearUsuario); // Movida aquí para permitir la creación del primer usuario

// Ruta temporal para crear rol (eliminar en producción)
router.post("/crear-rol", async (req, res) => {
  try {
    const rol = await Rol.create({
      rol_id: 1,
      nombre: "Administrador",
      descripcion: "Rol con todos los permisos"
    });
    res.json({ mensaje: "Rol creado exitosamente", rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear rol" });
  }
});

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get("/", usuarioController.obtenerUsuarios); // GET /usuarios (all users)
router.get("/perfil", usuarioController.getProfile); // GET /usuarios/perfil
router.get("/:id", usuarioController.obtenerUsuario); // GET /usuarios/:id (single user)
router.put("/:id", usuarioController.actualizarUsuario); // PUT /usuarios/:id
router.patch("/:id", usuarioController.estadoUsuario); // PATCH /usuarios/:id

module.exports = router;
