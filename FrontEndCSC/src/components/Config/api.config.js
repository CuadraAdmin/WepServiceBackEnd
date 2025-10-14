class ApiConfig {
  // URL base de la API
  static BASE_URL = "https://localhost:7096";

  // Endpoints
  static ENDPOINTSUSUARIOS = {
    // Usuarios
    LOGIN: "/api/Usuarios/Login",
    USUARIOS: "/api/Usuarios",
    USUARIO_POR_ID: (id) => `/api/Usuarios/${id}`,
  };

  // Perfiles
  static ENDPOINTSPERFILES = {
    PERFILES: "/api/Perfiles",
    PERFIL_POR_ID: (id) => `/api/Perfiles/${id}`,
  };

  // Permisos
  static ENDPOINTSPERMISOS = {
    LISTAR: "/api/Permisos/listar",
    FILTRAR: "/api/Permisos/filtrar",
    OBTENER: (id) => `/api/Permisos/obtener/${id}`,
    CREAR: "/api/Permisos/crear",
    ACTUALIZAR: (id) => `/api/Permisos/actualizar/${id}`,
    ELIMINAR: (id) => `/api/Permisos/eliminar/${id}`,
  };

  static ENDPOINTSMARCA = {
    MARCAS: "/api/Marca",
  };

  static getUrl(endpoint) {
    return `${this.BASE_URL}${endpoint}`;
  }

  static getHeaders(token = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }
}

export default ApiConfig;
