import api from "./api";

const authService = {
  async login(email, password) {
    try {
      console.log('Iniciando solicitud de login...');
      const response = await api.post("/usuarios/login", {
        email,
        password,
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data && response.data.token) {
        // Guardar los datos completos del usuario y el token
        const userData = {
          token: response.data.token,
          user: response.data.user || response.data.usuario,
          timestamp: new Date().getTime()
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.token);
        
        return userData;
      } else {
        throw new Error('Respuesta inválida del servidor: token no encontrado');
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Forzar recarga para limpiar el estado
    window.location.href = '/login';
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      // Verificar si el token existe
      if (!user.token) {
        this.logout();
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      this.logout();
      return null;
    }
  },
};

export const getCurrentUserProfile = async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
      throw new Error('No hay usuario autenticado');
    }

    const response = await api.get("/usuarios/perfil", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

export default authService;
