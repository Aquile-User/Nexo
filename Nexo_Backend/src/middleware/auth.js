const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No se proporcionó un token de autenticación" });
    }

    // Extraer el token (eliminar 'Bearer ' del inicio)
    const token = authHeader.split(" ")[1];

    // Verificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_secreto_jwt"
    );

    // Añadir la información del usuario decodificada a la request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
