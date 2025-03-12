const Rol = require("../models/rol");

exports.obtenerRol = async (req, res) => {
  const { id } = req.params;
  // Busca un rol por su id

  try {

    if (id) {
      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({ error: "No se encontro ningun rol" });
      }

      return res.json(rol);
    }

    const roles = await Rol.findAll();
    return res.json(roles);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener roles" });
  }

};

exports.crearRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    // Validación
    if (!nombre || !descripcion) {
      return res.status(400).json({ error: "Faltan datos necesarios (nombre, descripcion)" });
    }

    const nuevoRol = await Rol.create({ nombre, descripcion });
    return res.status(201).json({ mensaje: "Rol creado exitosamente", rol: nuevoRol });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear rol" });
  }
};

exports.actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    await rol.update({ nombre, descripcion });
    return res.json({ mensaje: "Rol actualizado exitosamente", rol });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar rol" });
  }
};

exports.eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    await rol.destroy();
    return res.json({ mensaje: "Rol eliminado exitosamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar rol" });
  }
};