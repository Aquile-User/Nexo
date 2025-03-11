const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

// Obtener usuarios, ya sea todos o uno específico por ID
exports.obtenerUsuarios = async (req, res) => {
  const { id } = req.params;  // Obtenemos el ID de los parámetros de la URL

  try {
    // Si el ID está presente, buscamos un usuario específico
    if (id) {
      const usuario = await Usuario.findByPk(id);  // findByPk busca por la clave primaria (id)
      
      // Si no se encuentra el usuario con ese ID, respondemos con un error
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Si encontramos el usuario, lo devolvemos
      return res.json(usuario);
    }

    // Si no se proporciona un ID, devolvemos todos los usuarios
    const usuarios = await Usuario.findAll();
    return res.json(usuarios);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Hubo un error al obtener los usuarios' });
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
    const { nombre, correo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Actualiza solo los campos proporcionados en la solicitud
    await usuario.update({ nombre, correo });

    res.json({ mensaje: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Cambiar estado del usuario
exports.estadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // `estado` indica si está activo o no

    const usuario = await Usuario.findByPk(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Actualiza solo el estado del usuario
    await usuario.update({ estado });

    const mensaje = `Usuario ${estado === "habilitado" ? "habilitado" : "deshabilitado"} correctamente`;

    res.json({ mensaje, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar estado del usuario" });
  }
};

