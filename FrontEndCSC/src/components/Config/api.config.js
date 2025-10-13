class ApiConfig {
  // URL base de la API
  static BASE_URL = "http://localhost:5283";

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
    PERMISOS: "/api/Permisos",
    PERMISO_POR_ID: (id) => `/api/Permisos/${id}`,
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
