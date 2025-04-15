const Ubicacion = require("../models/ubicacion");
const axios = require("axios");

// Función auxiliar para obtener datos de geocodificación
const obtenerDatosGeocodificacion = async (direccion) => {
  try {
    // Usar Nominatim (OpenStreetMap) que es gratuito
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direccion
    )}&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "NexoApp/1.0",
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const address = result.address || {};

      // Debug: Imprimir la estructura completa de la respuesta
      console.log(
        "Respuesta completa de la API:",
        JSON.stringify(result, null, 2)
      );
      console.log(
        "Estructura completa de address:",
        JSON.stringify(address, null, 2)
      );

      // Extraer los componentes de la dirección de manera segura
      let provincia = "";
      if (address.state) provincia = address.state;
      else if (address.county) provincia = address.county;
      else if (address.region) provincia = address.region;
      else if (address["ISO3166-2"])
        provincia = address["ISO3166-2"].split("-")[1];

      const municipio =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        "";

      const sector =
        address.suburb ||
        address.neighbourhood ||
        address.district ||
        address.hamlet ||
        "";

      // Si no se encontró la dirección formateada, usar la dirección original
      const direccionFormateada = result.display_name || direccion;

      // Asegurarnos de que tenemos las coordenadas y formatearlas correctamente
      if (!result.lat || !result.lon) {
        throw new Error(
          "No se pudieron obtener las coordenadas para la dirección"
        );
      }

      // Formatear las coordenadas como un punto MySQL
      const coordenada = `POINT(${result.lon} ${result.lat})`;

      return {
        coordenada,
        provincia,
        municipio,
        sector,
        direccion_formateada: direccionFormateada,
      };
    }

    throw new Error(
      "No se encontraron resultados para la dirección proporcionada"
    );
  } catch (error) {
    console.error("Error en geocodificación:", error);
    throw error;
  }
};

exports.crearUbicacion = async (req, res) => {
  const { nombre, direccion } = req.body;

  try {
    if (!nombre || !direccion) {
      return res.status(400).json({
        error: "Faltan datos necesarios (nombre, direccion)",
      });
    }

    // Obtener datos de geocodificación
    const datosGeocodificacion = await obtenerDatosGeocodificacion(direccion);

    // Verificar que tenemos todos los datos necesarios
    if (!datosGeocodificacion.coordenada) {
      throw new Error(
        "No se pudieron obtener las coordenadas para la dirección"
      );
    }

    const ubicacion = await Ubicacion.create({
      nombre,
      direccion: datosGeocodificacion.direccion_formateada,
      coordenada: datosGeocodificacion.coordenada,
      provincia: datosGeocodificacion.provincia,
      municipio: datosGeocodificacion.municipio,
      sector: datosGeocodificacion.sector,
    });

    res.status(201).json({
      mensaje: "Ubicación creada exitosamente",
      ubicacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear ubicación",
      detalles: error.message,
    });
  }
};

exports.obtenerUbicaciones = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const ubicacion = await Ubicacion.findByPk(id);
      if (!ubicacion) {
        return res.status(404).json({ error: "Ubicación no encontrada" });
      }
      return res.json(ubicacion);
    }

    const ubicaciones = await Ubicacion.findAll();
    return res.json(ubicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ubicaciones" });
  }
};

exports.actualizarUbicacion = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion } = req.body;

  try {
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    let datosActualizacion = { nombre };

    // Si se actualiza la dirección, obtener nuevos datos de geocodificación
    if (direccion) {
      const datosGeocodificacion = await obtenerDatosGeocodificacion(direccion);
      datosActualizacion = {
        ...datosActualizacion,
        direccion: datosGeocodificacion.direccion_formateada,
        coordenada: datosGeocodificacion.coordenada,
        provincia: datosGeocodificacion.provincia,
        municipio: datosGeocodificacion.municipio,
        sector: datosGeocodificacion.sector,
      };
    }

    await ubicacion.update(datosActualizacion);

    res.json({
      mensaje: "Ubicación actualizada exitosamente",
      ubicacion: await Ubicacion.findByPk(id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar ubicación",
      detalles: error.message,
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

    await ubicacion.destroy();
    res.json({ mensaje: "Ubicación eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar ubicación" });
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
