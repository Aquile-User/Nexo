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
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al iniciar sesión" };
    }
  },

  logout() {
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
