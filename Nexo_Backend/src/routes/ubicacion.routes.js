const express = require("express");
const router = express.Router();
const ubicacionController = require("../controllers/ubicacion.controllers");

// Rutas de búsqueda y filtrado
router.get("/", ubicacionController.obtenerUbicaciones);
router.get("/tipos", ubicacionController.obtenerTiposUbicacion);
router.get("/coordenadas", ubicacionController.buscarPorCoordenadas);
router.get("/:id", ubicacionController.obtenerUbicaciones);

// Rutas CRUD
router.post("/", ubicacionController.crearUbicacion);
router.put("/:id", ubicacionController.actualizarUbicacion);
router.delete("/:id", ubicacionController.eliminarUbicacion);

// Utilidades
router.post("/geocodificar", ubicacionController.geocodificarDireccion);

module.exports = router;
