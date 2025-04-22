import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    console.log("Enviando petición a:", config.url);
    console.log("Método:", config.method.toUpperCase());
    console.log("Datos de la petición:", config.data);

    const user = authService.getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("Token incluido en la petición");
    }
    return config;
  },
  (error) => {
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida de:", response.config.url);
    console.log("Estado de la respuesta:", response.status);
    console.log("Datos de la respuesta:", response.data);
    return response;
  },
  (error) => {
    console.error("Error en la respuesta:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      mensaje: error.message,
    });

    if (error.response?.status === 401) {
      console.log("Error de autenticación, cerrando sesión...");
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
