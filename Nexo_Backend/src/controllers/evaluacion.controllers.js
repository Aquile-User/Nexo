const Evaluacion = require("../models/evaluacion");
const Ubicacion = require("../models/ubicacion");
const Asignacion = require("../models/asignacion");
const Usuario = require("../models/usuario");

exports.obtenerEvaluaciones = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(
      "Iniciando obtención de evaluaciones...",
      id ? `para ID: ${id}` : "para todas"
    );

    // Si se proporciona un ID, buscar solo esa evaluación específica
    if (id) {
      const evaluacion = await Evaluacion.findByPk(id, {
        include: [
          {
            model: Ubicacion,
            as: "ubicacion",
            attributes: [
              "nombre",
              "direccion",
              "provincia",
              "municipio",
              "sector",
            ],
          },
        ],
      });

      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }

      console.log("Evaluación encontrada con ID:", id);
      return res.json(evaluacion);
    }

    // Si no hay ID, buscar todas las evaluaciones
    const evaluaciones = await Evaluacion.findAll({
      include: [
        {
          model: Ubicacion,
          as: "ubicacion",
          attributes: [
            "nombre",
            "direccion",
            "provincia",
            "municipio",
            "sector",
          ],
        },
      ],
      logging: (sql, timing) => {
        console.log("SQL Query:", sql);
        console.log("Query Timing:", timing, "ms");
      },
    });

    console.log("Evaluaciones encontradas:", evaluaciones.length);
    console.log(
      "Primera evaluación (si existe):",
      evaluaciones[0]
        ? JSON.stringify(evaluaciones[0], null, 2)
        : "No hay evaluaciones"
    );

    // Verificar la estructura de los datos
    evaluaciones.forEach((evaluacion, index) => {
      console.log(`\nEvaluación ${index + 1}:`);
      console.log("ID:", evaluacion.evaluacion_id);
      console.log("Estado:", evaluacion.estado);
      console.log(
        "Ubicación:",
        evaluacion.ubicacion
          ? evaluacion.ubicacion.nombre
          : "No tiene ubicación"
      );
      console.log("Fecha programada:", evaluacion.fecha_programada);
      console.log("Fecha realizada:", evaluacion.fecha_realizada);
      console.log("Tipo:", evaluacion.tipo);
      console.log("Resultado:", evaluacion.resultado);
      console.log("Motivo:", evaluacion.motivo_no_evaluacion);
      console.log("Comentarios:", evaluacion.comentarios);
    });

    return res.json(evaluaciones);
  } catch (error) {
    console.error("Error detallado:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      error: "Error al obtener evaluaciones",
      detalles: error.message,
    });
  }
};

exports.crearEvaluacion = async (req, res) => {
  const { ubicacion_id, fecha_programada, tipo, comentarios } = req.body;

  try {
    // Validaciones básicas
    if (!ubicacion_id || !fecha_programada || !tipo) {
      return res.status(400).json({
        error: "Faltan datos necesarios (ubicacion_id, fecha_programada, tipo)",
      });
    }

    // Verificar que la ubicación existe
    const ubicacion = await Ubicacion.findByPk(ubicacion_id);
    if (!ubicacion) {
      return res.status(404).json({
        error: `No se encontró la ubicación con ID ${ubicacion_id}`,
      });
    }

    const evaluacion = await Evaluacion.create({
      ubicacion_id,
      fecha_programada,
      tipo,
      comentarios,
      estado: "pendiente",
    });

    const evaluacionCreada = await Evaluacion.findByPk(
      evaluacion.evaluacion_id,
      {
        include: [
          {
            model: Ubicacion,
            as: "ubicacion",
            attributes: [
              "nombre",
              "direccion",
              "coordenada",
              "provincia",
              "municipio",
              "sector",
            ],
          },
        ],
      }
    );

    res.status(201).json({
      mensaje: "Evaluación creada exitosamente",
      evaluacion: evaluacionCreada,
    });
  } catch (error) {
    console.error("Error al crear evaluación:", error);
    res.status(500).json({
      error: "Error al crear evaluación",
      detalles: error.message,
    });
  }
};

exports.actualizarEvaluacion = async (req, res) => {
  const { id } = req.params;
  const { estado, motivo_no_evaluacion, resultado } = req.body;

  try {
    // Validate required fields based on estado
    if (estado === "cancelada" && !motivo_no_evaluacion) {
      return res.status(400).json({
        error:
          'Motivo de cancelación es requerido cuando el estado es "cancelada"',
      });
    }

    if (estado === "completada" && !resultado) {
      return res.status(400).json({
        error: 'Resultado es requerido cuando el estado es "completada"',
      });
    }

    // Find evaluation to update
    const evaluacion = await Evaluacion.findByPk(id, {
      include: [
        {
          model: Ubicacion,
          as: "ubicacion",
          attributes: [
            "nombre",
            "direccion",
            "provincia",
            "municipio",
            "sector",
          ],
        },
      ],
    });

    if (!evaluacion) {
      return res.status(404).json({ error: "Evaluación no encontrada" });
    }

    // Update evaluation
    const updated = await evaluacion.update(req.body);

    return res.json({
      mensaje: "Evaluación actualizada exitosamente",
      evaluacion: updated,
    });
  } catch (error) {
    console.error("Error al actualizar evaluación:", error);
    return res.status(500).json({
      error: "Error al actualizar evaluación",
      detalles: error.message,
    });
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
          as: "ubicacion",
          attributes: [
            "nombre",
            "direccion",
            "coordenada",
            "provincia",
            "municipio",
            "sector",
          ],
        },
        {
          model: Asignacion,
          as: "asignaciones",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["nombre", "apellido", "email"],
            },
          ],
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
