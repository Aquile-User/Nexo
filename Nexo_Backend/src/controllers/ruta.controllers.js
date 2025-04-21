const Ruta = require("../models/ruta");
const Ubicacion = require("../models/ubicacion");
const RutaUbicacion = require("../models/ruta_ubicaciones");

exports.listarRutas = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const ruta = await Ruta.findByPk(id, {
        include: [
          {
            model: Ubicacion,
            through: {
              model: RutaUbicacion,
              attributes: [], // No necesitamos los campos de la tabla intermedia
            },
            attributes: [
              "ubicacion_id",
              "nombre",
              "direccion",
              "coordenada",
              "provincia",
              "municipio",
              "sector",
              "estado",
              "fecha_programada",
            ],
          },
        ],
      });

      if (!ruta) return res.status(404).json({ error: "Ruta no encontrada" });
      return res.json(ruta);
    }
    const rutas = await Ruta.findAll({
      include: [
        {
          model: Ubicacion,
          through: {
            model: RutaUbicacion,
            attributes: [], // No necesitamos los campos de la tabla intermedia
          },
          attributes: [
            "ubicacion_id",
            "nombre",
            "direccion",
            "coordenada",
            "provincia",
            "municipio",
            "sector",
            "estado",
            "fecha_programada",
          ],
        },
      ],
    });
    return res.json(rutas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar rutas" });
  }
};

exports.crearRuta = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    if (!nombre || !descripcion) {
      return res
        .status(400)
        .json({ error: "Faltan datos necesarios (nombre, descripcion)" });
    }
    const ruta = await Ruta.create({ nombre, descripcion });
    res.status(201).json({ mensaje: "Ruta creada exitosamente", ruta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear ruta" });
  }
};

exports.modificarRuta = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const Ruta = await Ruta.findByPk(id);
    if (!Ruta) return res.status(404).json({ error: "Ruta no encontrada" });
    await Ruta.update({ nombre, descripcion });
    res.json({ mensaje: "Ruta actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar ruta" });
  }
};

exports.eliminarRuta = async (req, res) => {
  const { id } = req.params;
  try {
    const Ruta = await Ruta.findByPk(id);
    if (!Ruta) return res.status(404).json({ error: "Ruta no encontrada" });
    await Ruta.destroy();

    res.json({ mensaje: "Ruta eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar ruta" });
  }
};

exports.gestionarUbicaciones = async (req, res) => {
  const { id } = req.params;
  const { ubicaciones } = req.body;

  try {
    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({ error: "Ruta no encontrada" });
    }

    // Si se proporcionan ubicaciones, actualizamos la lista
    if (ubicaciones) {
      // Primero eliminamos todas las asociaciones existentes
      await RutaUbicacion.destroy({
        where: { ruta_id: id },
      });

      // Luego creamos las nuevas asociaciones
      const asociaciones = ubicaciones.map((ubicacionId) => ({
        ruta_id: id,
        ubicacion_id: ubicacionId,
      }));

      await RutaUbicacion.bulkCreate(asociaciones);
    }

    // Obtenemos la ruta con sus ubicaciones actualizadas
    const rutaActualizada = await Ruta.findByPk(id, {
      include: [
        {
          model: Ubicacion,
          through: {
            model: RutaUbicacion,
            attributes: [],
          },
          attributes: [
            "ubicacion_id",
            "nombre",
            "direccion",
            "coordenada",
            "provincia",
            "municipio",
            "sector",
            "estado",
            "fecha_programada",
          ],
        },
      ],
    });

    return res.json(rutaActualizada);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al gestionar ubicaciones de la ruta" });
  }
};
