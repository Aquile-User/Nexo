const Asignacion = require("../models/asignacion");
const Usuario = require("../models/usuario");
const Evaluacion = require("../models/evaluacion");
const Ruta = require("../models/ruta");

exports.obtenerAsignaciones = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const asignacion = await Asignacion.findByPk(id, {
        include: [
          {
            model: Usuario,
            attributes: ["nombre", "apellido", "email"],
          },
          {
            model: Evaluacion,
            attributes: ["fecha_programada", "tipo", "estado"],
          },
          {
            model: Ruta,
            attributes: ["nombre", "descripcion"],
          },
        ],
      });

      if (!asignacion) {
        return res.status(404).json({ error: "Asignación no encontrada" });
      }
      return res.json(asignacion);
    }

    const asignaciones = await Asignacion.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Evaluacion,
          attributes: ["fecha_programada", "tipo", "estado"],
        },
        {
          model: Ruta,
          attributes: ["nombre", "descripcion"],
        },
      ],
    });

    return res.json(asignaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener asignaciones" });
  }
};

exports.crearAsignacion = async (req, res) => {
  const { usuario_id, tipo_asignacion, evaluacion_id, ruta_id } = req.body;

  try {
    // Validar que se proporcione el tipo de asignación correcto
    if (!tipo_asignacion || !["evaluacion", "ruta"].includes(tipo_asignacion)) {
      return res.status(400).json({
        error: "El tipo de asignación debe ser 'evaluacion' o 'ruta'",
      });
    }

    // Validar que se proporcione el ID correspondiente según el tipo
    if (tipo_asignacion === "evaluacion" && !evaluacion_id) {
      return res.status(400).json({
        error: "Para asignación de tipo 'evaluacion' se requiere evaluacion_id",
      });
    }

    if (tipo_asignacion === "ruta" && !ruta_id) {
      return res.status(400).json({
        error: "Para asignación de tipo 'ruta' se requiere ruta_id",
      });
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que la evaluación existe si es asignación de evaluación
    if (evaluacion_id) {
      const evaluacion = await Evaluacion.findByPk(evaluacion_id);
      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
    }

    // Verificar que la ruta existe si es asignación de ruta
    if (ruta_id) {
      const ruta = await Ruta.findByPk(ruta_id);
      if (!ruta) {
        return res.status(404).json({ error: "Ruta no encontrada" });
      }
    }

    const asignacion = await Asignacion.create({
      usuario_id,
      tipo_asignacion,
      evaluacion_id,
      ruta_id,
    });

    const asignacionCreada = await Asignacion.findByPk(
      asignacion.asignacion_id,
      {
        include: [
          {
            model: Usuario,
            attributes: ["nombre", "apellido", "email"],
          },
          {
            model: Evaluacion,
            attributes: ["fecha_programada", "tipo", "estado"],
          },
          {
            model: Ruta,
            attributes: ["nombre", "descripcion"],
          },
        ],
      }
    );

    res.status(201).json({
      mensaje: "Asignación creada exitosamente",
      asignacion: asignacionCreada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear asignación" });
  }
};

exports.actualizarAsignacion = async (req, res) => {
  const { id } = req.params;
  const { usuario_id, tipo_asignacion, evaluacion_id, ruta_id } = req.body;

  try {
    const asignacion = await Asignacion.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }

    // Validar que se proporcione el tipo de asignación correcto
    if (tipo_asignacion && !["evaluacion", "ruta"].includes(tipo_asignacion)) {
      return res.status(400).json({
        error: "El tipo de asignación debe ser 'evaluacion' o 'ruta'",
      });
    }

    // Verificar que el usuario existe si se actualiza
    if (usuario_id) {
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
    }

    // Verificar que la evaluación existe si se actualiza
    if (evaluacion_id) {
      const evaluacion = await Evaluacion.findByPk(evaluacion_id);
      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
    }

    // Verificar que la ruta existe si se actualiza
    if (ruta_id) {
      const ruta = await Ruta.findByPk(ruta_id);
      if (!ruta) {
        return res.status(404).json({ error: "Ruta no encontrada" });
      }
    }

    await asignacion.update({
      usuario_id,
      tipo_asignacion,
      evaluacion_id,
      ruta_id,
    });

    const asignacionActualizada = await Asignacion.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Evaluacion,
          attributes: ["fecha_programada", "tipo", "estado"],
        },
        {
          model: Ruta,
          attributes: ["nombre", "descripcion"],
        },
      ],
    });

    res.json({
      mensaje: "Asignación actualizada exitosamente",
      asignacion: asignacionActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar asignación" });
  }
};

exports.eliminarAsignacion = async (req, res) => {
  const { id } = req.params;

  try {
    const asignacion = await Asignacion.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }

    await asignacion.destroy();
    res.json({ mensaje: "Asignación eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar asignación" });
  }
};
