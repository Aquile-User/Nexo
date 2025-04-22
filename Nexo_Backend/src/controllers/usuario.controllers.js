const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const Rol = require("../models/rol");

// Obtener usuarios, ya sea todos o uno específico por ID
exports.obtenerUsuarios = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(
      "Iniciando obtención de usuarios...",
      id ? `para ID: ${id}` : "para todos"
    );

    // Si el ID está presente, buscamos un usuario específico
    if (id) {
      const usuario = await Usuario.findByPk(id, {
        include: {
          model: Rol,
          as: "rolUsuario",
          attributes: ["nombre", "rol_id"],
        },
      });

      // Si no se encuentra el usuario con ese ID, respondemos con un error
      if (!usuario) {
        console.log(`Usuario con ID: ${id} no encontrado`);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log("Usuario encontrado con ID:", id);
      return res.json(usuario);
    }

    // Si no se proporciona un ID, devolvemos todos los usuarios
    const usuarios = await Usuario.findAll({
      include: {
        model: Rol,
        as: "rolUsuario",
        attributes: ["nombre", "rol_id"],
      },
      logging: (sql, timing) => {
        console.log("SQL Query:", sql);
        console.log("Query Timing:", timing, "ms");
      },
    });

    console.log("Usuarios encontrados:", usuarios.length);

    // Verificar la estructura de los datos (similar a evaluaciones)
    if (usuarios.length > 0) {
      console.log("Primer usuario:", {
        id: usuarios[0].usuario_id,
        nombre: usuarios[0].nombre,
        correo: usuarios[0].correo,
        rol: usuarios[0].rolUsuario?.nombre || "Sin rol",
        estado: usuarios[0].estado,
      });
    }

    return res.json(usuarios);
  } catch (error) {
    console.error("Error detallado:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      message: "Hubo un error al obtener los usuarios",
      detalles: error.message,
    });
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password_hash, rol_id } = req.body;

    // Validación
    if (!nombre || !correo || !password_hash || !rol_id) {
      return res.status(400).json({
        error: "Faltan datos necesarios (nombre, correo, password, rol)",
      });
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

// Actualizar usuario - enfoque mejorado similar a evaluaciones
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Iniciando actualización de usuario con ID: ${id}`);
    console.log("Datos recibidos:", req.body);

    // Find user to update (similar approach to evaluaciones)
    const usuario = await Usuario.findByPk(id, {
      include: {
        model: Rol,
        as: "rolUsuario",
        attributes: ["nombre"],
      },
    });

    if (!usuario) {
      console.log(`Usuario con ID ${id} no encontrado`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validaciones específicas según los datos
    const { nombre, correo, rol_id, estado } = req.body;

    if (!nombre || !correo) {
      return res.status(400).json({
        error: "Nombre y correo son campos obligatorios",
      });
    }

    if (rol_id) {
      const rolExiste = await Rol.findByPk(rol_id);
      if (!rolExiste) {
        return res.status(400).json({ error: "El rol especificado no existe" });
      }
    }

    if (estado && !["habilitado", "deshabilitado"].includes(estado)) {
      return res.status(400).json({
        error: "Estado no válido. Use 'habilitado' o 'deshabilitado'",
      });
    }

    // Update all fields at once (just like in evaluaciones controller)
    const updated = await usuario.update(req.body);

    // Get the fully updated user with relationships
    const usuarioActualizado = await Usuario.findByPk(id, {
      include: {
        model: Rol,
        as: "rolUsuario",
        attributes: ["nombre"],
      },
    });

    console.log("Usuario actualizado correctamente:", {
      id: usuarioActualizado.usuario_id,
      nombre: usuarioActualizado.nombre,
      correo: usuarioActualizado.correo,
      rol: usuarioActualizado.rolUsuario?.nombre || "Sin rol",
      estado: usuarioActualizado.estado,
    });

    return res.json({
      mensaje: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error detallado:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return res.status(500).json({
      error: "Error al actualizar usuario",
      detalles: error.message,
    });
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

    const mensaje = `Usuario ${
      estado === "habilitado" ? "habilitado" : "deshabilitado"
    } correctamente`;

    res.json({ mensaje, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar estado del usuario" });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { correo: email },
      include: {
        model: Rol,
        as: "rolUsuario",
        attributes: ["nombre"],
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar estado del usuario
    if (usuario.estado !== "habilitado") {
      return res.status(401).json({ error: "Usuario deshabilitado" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.usuario_id,
        email: usuario.correo,
        rol: usuario.rolUsuario.nombre,
      },
      process.env.JWT_SECRET || "tu_secreto_jwt",
      { expiresIn: "24h" }
    );

    // Devolver respuesta
    res.json({
      token,
      user: {
        id: usuario.usuario_id,
        email: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rolUsuario.nombre,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.usuario_id; // Intentar ambos campos

    const usuario = await Usuario.findOne({
      where: { usuario_id: userId },
      include: [
        {
          model: Rol,
          as: "rolUsuario",
          attributes: ["nombre"],
        },
      ],
      attributes: { exclude: ["password_hash"] },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

exports.obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      include: {
        model: Rol,
        as: "rolUsuario",
        attributes: ["nombre"],
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};
