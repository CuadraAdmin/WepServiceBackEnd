class ApiConfig {
  // URL base de la API
  static BASE_URL =
    "https://gestormarcas-cqdtaeawc5g4fdg4.canadacentral-01.azurewebsites.net";

  // Endpoints de Usuarios
  static ENDPOINTSUSUARIOS = {
    LOGIN: "/api/Usuarios/Login",
    LISTAR: "/api/Usuarios/Listar",
    OBTENER: (id) => `/api/Usuarios/Obtener/${id}`,
    CREAR: "/api/Usuarios/Agregar",
    ACTUALIZAR: (id) => `/api/Usuarios/actualizar/${id}`,
    ELIMINAR: (id) => `/api/Usuarios/eliminar/${id}`,
    PERFILES: (id) => `/api/Usuarios/obtener/${id}/perfilesUsuario`,
    PERMISOS: (id) => `/api/Usuarios/obtener/${id}/permisos`,
    ASIGNAR_PERFIL: (usuarioId, perfilId) =>
      `/api/Usuarios/asignar/${usuarioId}/perfiles/${perfilId}`,
    QUITAR_PERFIL: (usuarioId, perfilId) =>
      `/api/Usuarios/quitar/${usuarioId}/perfiles/${perfilId}`,
    FILTROS: "/api/Usuarios/ListarConFiltros",
  };

  // Endpoints de Perfiles
  static ENDPOINTSPERFILES = {
    LISTAR: "/api/Perfiles/listar",
    OBTENER: (id) => `/api/Perfiles/obtener/${id}`,
    CREAR: "/api/Perfiles/crear",
    ACTUALIZAR: (id) => `/api/Perfiles/actualizar/${id}`,
    ELIMINAR: (id) => `/api/Perfiles/eliminar/${id}`,
    PERMISOS: (id) => `/api/Perfiles/obtener/${id}/permisosPerfil`,
    ASIGNAR_PERMISO: (perfilId, permisoId) =>
      `/api/Perfiles/asignar/${perfilId}/permisos/${permisoId}`,
    QUITAR_PERMISO: (perfilId, permisoId) =>
      `/api/Perfiles/quitar/${perfilId}/permisos/${permisoId}`,
    FILTROS: "/api/Perfiles/filtro",
  };

  // Endpoints de Permisos
  static ENDPOINTSPERMISOS = {
    LISTAR: "/api/Permisos/listar",
    FILTRAR: "/api/Permisos/filtrar",
    OBTENER: (id) => `/api/Permisos/obtener/${id}`,
    CREAR: "/api/Permisos/crear",
    ACTUALIZAR: (id) => `/api/Permisos/actualizar/${id}`,
    ELIMINAR: (id) => `/api/Permisos/eliminar/${id}`,
  };

  // Endpoints de Marcas
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
