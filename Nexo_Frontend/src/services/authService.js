import api from "./api";

const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        password,
      });

      console.log("Respuesta completa del login:", response);
      console.log("Datos del usuario:", response.data);

      if (response.data.token) {
        // Guardar los datos del usuario que vienen en la respuesta
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("Usuario guardado en localStorage:", response.data);
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
    const userStr = localStorage.getItem("user");
    console.log("Usuario recuperado de localStorage:", userStr);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log("Usuario parseado:", user);
    return user;
  },
};

export default authService;
