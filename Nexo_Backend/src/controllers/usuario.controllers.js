const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password_hash, rol_id } = req.body;

    // Validación
    if (!nombre || !correo || !password_hash || !rol_id) {
      return res
        .status(400)
        .json({ error: "Faltan datos necesarios (nombre, correo, password, rol)" });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_Cifrada = await bcrypt.hash(password_hash, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password_hash: password_Cifrada,
      rol_id,
      estado: "habilitado",
    });
    res
      .status(201)
      .json({ mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, estado } = req.body; // `estado` indica si está activo o no

    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Actualiza solo los campos proporcionados en la solicitud
    await usuario.update({ nombre, correo, estado });

    res.json({ mensaje: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar (deshabilitar) usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Deshabilitar usuario (en lugar de eliminar)
    await usuario.update({ estado: "deshabilitado" });
    res.json({ mensaje: "Usuario deshabilitado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al deshabilitar usuario" });
  }
};
