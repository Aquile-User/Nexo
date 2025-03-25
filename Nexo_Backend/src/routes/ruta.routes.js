const express = require("express");
const router = express.Router();
const rutasController = require("../controllers/ruta.controllers");

router.post('', rutasController.crearRuta);// Crear ruta
router.get("/id?", rutasController.listarRutas); // Listar rutas
router.put('/:id', rutasController.modificarRuta); // Modificar ruta
router.delete('/:id', rutasController.eliminarRuta); // Eliminar ruta
router.get('/:id/ubicaciones', rutasController.gestionarUbicaciones);// Acceder a la gestión de ubicaciones de una ruta

module.exports = router;
