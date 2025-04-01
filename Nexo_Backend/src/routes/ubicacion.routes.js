const express = require("express");
const router = express.Router();
const ubicacionController = require("../controllers/ubicacion.controllers");

// Rutas CRUD básicas
router.get("/:id?", ubicacionController.obtenerUbicaciones);
router.post("/", ubicacionController.crearUbicacion);
router.put("/:id", ubicacionController.actualizarUbicacion);
router.delete("/:id", ubicacionController.eliminarUbicacion);

// Ruta específica para geocodificación
router.post("/geocodificar", ubicacionController.geocodificarDireccion);

module.exports = router;
