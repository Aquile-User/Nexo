const express = require("express");
const router = express.Router();
const asignacionController = require("../controllers/asignacion.controllers");

router.get("/:id?", asignacionController.obtenerAsignaciones);
router.post("/", asignacionController.crearAsignacion);
router.put("/:id", asignacionController.actualizarAsignacion);
router.delete("/:id", asignacionController.eliminarAsignacion);

module.exports = router;

