const Ubicacion = require("../models/ubicacion");
const Evaluacion = require("../models/evaluacion");
const { Op } = require("sequelize");
const axios = require("axios");

const obtenerDatosGeocodificacion = async (direccion) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direccion
    )}&limit=1&addressdetails=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "NexoApp/1.0",
      },
      timeout: 5000
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No se encontraron resultados para la dirección proporcionada");
    }

    const result = response.data[0];
    const address = result.address || {};

    return {
      coordenada: `POINT(${result.lon} ${result.lat})`,
      provincia: address.state || address.county || address.region || '',
      municipio: address.city || address.town || address.municipality || '',
      sector: address.suburb || address.neighbourhood || '',
      codigo_postal: address.postcode || '',
      direccion_formateada: result.display_name,
    };
  } catch (error) {
    console.error("Error en geocodificación:", error);
    throw new Error(`Error al geocodificar: ${error.message}`);
  }
};

// Al inicio del archivo, después de los requires
const TIPOS_UBICACION_PERMITIDOS = ['comercial', 'residencial', 'industrial', 'otro'];
const REGEX_TELEFONO = /^\+1809\d{7}$/;

exports.crearUbicacion = async (req, res) => {
  const { nombre, direccion, tipo_ubicacion, telefono, email_contacto, horario_atencion, referencia } = req.body;

  try {
    // Validaciones básicas
    if (!TIPOS_UBICACION_PERMITIDOS.includes(tipo_ubicacion)) {
      return res.status(400).json({
        error: "Tipo de ubicación no válido"
      });
    }

    if (telefono && !REGEX_TELEFONO.test(telefono)) {
      return res.status(400).json({
        error: "Formato de teléfono inválido. Debe ser +1809XXXXXXX"
      });
    }

    // Verificar si ya existe una ubicación con el mismo nombre
    const ubicacionExistente = await Ubicacion.findOne({ where: { nombre } });
    if (ubicacionExistente) {
      return res.status(400).json({
        error: "Ya existe una ubicación con este nombre"
      });
    }

    const datosGeocodificacion = await obtenerDatosGeocodificacion(direccion);

    const ubicacion = await Ubicacion.create({
      nombre,
      tipo_ubicacion,
      direccion: datosGeocodificacion.direccion_formateada,
      coordenada: datosGeocodificacion.coordenada,
      provincia: datosGeocodificacion.provincia,
      municipio: datosGeocodificacion.municipio,
      sector: datosGeocodificacion.sector,
      codigo_postal: datosGeocodificacion.codigo_postal,
      telefono,
      email_contacto,
      horario_atencion,
      referencia
    });

    res.status(201).json({
      mensaje: "Ubicación creada exitosamente",
      ubicacion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear ubicación",
      detalles: error.message
    });
  }
};

exports.obtenerUbicaciones = async (req, res) => {
  try {
    const { 
      id, 
      provincia, 
      municipio, 
      tipo, 
      activo,
      busqueda,
      page = 1,
      limit = 10
    } = req.query;

    if (id) {
      const ubicacion = await Ubicacion.findByPk(id, {
        include: [{
          model: Evaluacion,
          attributes: ['evaluacion_id', 'fecha_programada', 'estado']
        }]
      });
      
      if (!ubicacion) {
        return res.status(404).json({ error: "Ubicación no encontrada" });
      }
      return res.json(ubicacion);
    }

    const where = {};
    
    if (provincia) where.provincia = provincia;
    if (municipio) where.municipio = municipio;
    if (tipo) where.tipo_ubicacion = tipo;
    if (activo !== undefined) where.activo = activo;
    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { direccion: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Ubicacion.findAndCountAll({
      where,
      limit,
      offset,
      order: [['nombre', 'ASC']],
    });

    return res.json({
      total: count,
      paginas: Math.ceil(count / limit),
      pagina_actual: page,
      ubicaciones: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ubicaciones" });
  }
};

exports.actualizarUbicacion = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    direccion, 
    tipo_ubicacion, 
    telefono, 
    email_contacto, 
    horario_atencion, 
    referencia,
    activo 
  } = req.body;

  try {
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    let datosActualizacion = {
      nombre,
      tipo_ubicacion,
      telefono,
      email_contacto,
      horario_atencion,
      referencia,
      activo
    };

    if (direccion) {
      const datosGeocodificacion = await obtenerDatosGeocodificacion(direccion);
      datosActualizacion = {
        ...datosActualizacion,
        direccion: datosGeocodificacion.direccion_formateada,
        coordenada: datosGeocodificacion.coordenada,
        provincia: datosGeocodificacion.provincia,
        municipio: datosGeocodificacion.municipio,
        sector: datosGeocodificacion.sector,
        codigo_postal: datosGeocodificacion.codigo_postal
      };
    }

    await ubicacion.update(datosActualizacion);

    res.json({
      mensaje: "Ubicación actualizada exitosamente",
      ubicacion: await Ubicacion.findByPk(id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar ubicación",
      detalles: error.message
    });
  }
};

exports.eliminarUbicacion = async (req, res) => {
  const { id } = req.params;

  try {
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    const puedeEliminar = await ubicacion.puedeSerEliminada();
    if (!puedeEliminar) {
      return res.status(400).json({ 
        error: "No se puede eliminar la ubicación porque tiene evaluaciones asociadas" 
      });
    }

    await ubicacion.destroy();
    res.json({ mensaje: "Ubicación eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar ubicación" });
  }
};

exports.buscarPorCoordenadas = async (req, res) => {
  const { lat, lon, radio = 5 } = req.query; // radio en kilómetros

  try {
    const ubicaciones = await Ubicacion.findAll({
      where: sequelize.literal(`
        ST_Distance_Sphere(
          coordenada,
          POINT(${parseFloat(lon)}, ${parseFloat(lat)})
        ) <= ${radio * 1000}
      `),
      order: [[sequelize.literal(`
        ST_Distance_Sphere(
          coordenada,
          POINT(${parseFloat(lon)}, ${parseFloat(lat)})
        )
      `), 'ASC']]
    });

    res.json(ubicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error al buscar ubicaciones por coordenadas" 
    });
  }
};

exports.geocodificarDireccion = async (req, res) => {
  const { direccion } = req.body;

  try {
    if (!direccion) {
      return res.status(400).json({
        error: "Se requiere una dirección para geocodificar",
      });
    }

    const datosGeocodificacion = await obtenerDatosGeocodificacion(direccion);
    res.json(datosGeocodificacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al geocodificar la dirección",
      detalles: error.message,
    });
  }
};

// Agregar al final del archivo
exports.obtenerTiposUbicacion = async (req, res) => {
  res.json({
    tipos: TIPOS_UBICACION_PERMITIDOS
  });
};
