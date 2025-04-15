const express = require("express");
const router = express.Router();
const evaluacionController = require("../controllers/evaluacion.controllers");

router.get("/:id?", evaluacionController.obtenerEvaluaciones);
router.post("/", evaluacionController.crearEvaluacion);
router.put("/:id", evaluacionController.actualizarEvaluacion);
router.delete("/:id", evaluacionController.eliminarEvaluacion);
router.patch("/:id", evaluacionController.cancelarEvaluacion);

module.exports = router;
