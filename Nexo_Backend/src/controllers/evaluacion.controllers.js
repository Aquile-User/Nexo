const Evaluacion = require("../models/evaluacion");
const Ubicacion = require("../models/ubicacion");
const Asignacion = require("../models/asignacion");
const Usuario = require("../models/usuario");

exports.obtenerEvaluaciones = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const evaluacion = await Evaluacion.findByPk(id, {
        include: [
          {
            model: Ubicacion,
            attributes: [
              "nombre",
              "direccion",
              "coordenada",
              "provincia",
              "municipio",
              "sector",
              "estado",
            ],
          },
          {
            model: Asignacion,
            include: [{
              model: Usuario,
              attributes: ["nombre", "apellido", "email"],
            }],
          },
        ],
      });

      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
      return res.json(evaluacion);
    }

    const evaluaciones = await Evaluacion.findAll({
      include: [
        {
          model: Ubicacion,
          attributes: [
            "nombre",
            "direccion",
            "coordenada",
            "provincia",
            "municipio",
            "sector",
            "estado",
          ],
        },
        {
          model: Asignacion,
          include: [{
            model: Usuario,
            attributes: ["nombre", "apellido", "email"],
          }],
        },
      ],
    });

    return res.json(evaluaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener evaluaciones" });
  }
};

exports.crearEvaluacion = async (req, res) => {
  const { ubicacion_id, fecha_programada, tipo, comentarios } = req.body;

  try {
    if (!ubicacion_id || !fecha_programada || !tipo) {
      return res.status(400).json({
        error: "Faltan datos necesarios (ubicacion_id, fecha_programada, tipo)",
      });
    }

    const evaluacion = await Evaluacion.create({
      ubicacion_id,
      fecha_programada,
      tipo,
      comentarios,
      estado: "pendiente",
    });

    const evaluacionCreada = await Evaluacion.findByPk(evaluacion.evaluacion_id, {
      include: [
        {
          model: Ubicacion,
          attributes: [
            "nombre",
            "direccion",
            "coordenada",
            "provincia",
            "municipio",
            "sector",
            "estado",
          ],
        },
      ],
    });

    res.status(201).json({
      mensaje: "Evaluación creada exitosamente",
      evaluacion: evaluacionCreada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear evaluación" });
  }
};

exports.actualizarEvaluacion = async (req, res) => {
  const { id } = req.params;
  const { fecha_programada, resultado, comentarios, estado, fecha_realizada } =
    req.body;

  try {
    const evaluacion = await Evaluacion.findByPk(id);
    if (!evaluacion) {
      return res.status(404).json({ error: "Evaluación no encontrada" });
    }

    // Si se actualiza el estado a "completada", se establece la fecha_realizada
    if (estado === "completada") {
      await evaluacion.update({
        fecha_programada,
        resultado,
        comentarios,
        estado,
        fecha_realizada: new Date(),
      });
    } else {
      await evaluacion.update({
        fecha_programada,
        resultado,
        comentarios,
        estado,
      });
    }

    const evaluacionActualizada = await Evaluacion.findByPk(id, {
      include: [
        {
          model: Ubicacion,
          attributes: ["nombre", "direccion", "coordenada", "provincia", "municipio", "sector", "estado"],
        },
        {
          model: Asignacion,
          include: [{
            model: Usuario,
            attributes: ["nombre", "apellido", "email"],
          }],
        },
      ],
    });

    res.json({
      mensaje: "Evaluación actualizada exitosamente",
      evaluacion: evaluacionActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar evaluación" });
  }
};

exports.eliminarEvaluacion = async (req, res) => {
  const { id } = req.params;

  try {
    const evaluacion = await Evaluacion.findByPk(id);
    if (!evaluacion) {
      return res.status(404).json({ error: "Evaluación no encontrada" });
    }

    await evaluacion.destroy();
    res.json({ mensaje: "Evaluación eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar evaluación" });
  }
};

exports.cancelarEvaluacion = async (req, res) => {
  const { id } = req.params;
  const { motivo_no_evaluacion } = req.body;

  try {
    const evaluacion = await Evaluacion.findByPk(id);
    if (!evaluacion) {
      return res.status(404).json({ error: "Evaluación no encontrada" });
    }

    if (!motivo_no_evaluacion) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un motivo para la cancelación" });
    }

    await evaluacion.update({
      estado: "cancelada",
      motivo_no_evaluacion,
    });

    const evaluacionCancelada = await Evaluacion.findByPk(id, {
      include: [
        {
          model: Ubicacion,
          attributes: ["nombre", "direccion", "coordenada", "provincia", "municipio", "sector", "estado"],
        },
        {
          model: Asignacion,
          include: [{
            model: Usuario,
            attributes: ["nombre", "apellido", "email"],
          }],
        },
      ],
    });

    res.json({
      mensaje: "Evaluación cancelada exitosamente",
      evaluacion: evaluacionCancelada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cancelar evaluación" });
  }
};
