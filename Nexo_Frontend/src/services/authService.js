import api from "./api";

const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al iniciar sesión" };
    }
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const getCurrentUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/usuarios/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default authService;
