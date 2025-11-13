import BASEURL from "./BASEURL";

class ApiConfig {
  static BASE_URL = BASEURL.getBaseUrl();

  // Endpoints de Usuarios
  static ENDPOINTSUSUARIOS = {
    LOGIN: "/api/Usuarios/Login",
    LISTAR: "/api/Usuarios/Listar",
    OBTENER: (id) => `/api/Usuarios/Obtener/${id}`,
    CREAR: "/api/Usuarios/Agregar",
    ACTUALIZAR: (id) => `/api/Usuarios/actualizar/${id}`,
    ELIMINAR: (id) => `/api/Usuarios/eliminar/${id}`,
    ACTIVAR: (id) => `/api/Usuarios/activar/${id}`,
    CAMBIAR_CONTRASENA: (id) => `/api/Usuarios/cambiar-contrasena/${id}`,
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
    ACTIVAR: (id) => `/api/Perfiles/activar/${id}`,
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
    ACTIVAR: (id) => `/api/Permisos/activar/${id}`,
  };

  // Endpoints de Marcas
  static ENDPOINTSMARCA = {
    MARCAS: "/api/Marcas",
    ARCHIVOS: "/api/MarcasArchivos",
  };

  // Endpoints de Empresas
  static ENDPOINTSEMPRESAS = {
    EMPRESAS: "/api/Empresas",
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

  /**
   * Headers para multipart/form-data (sin Content-Type)
   * El navegador lo establece automáticamente con el boundary correcto
   */
  static getMultipartHeaders(token = null) {
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }
}

export default ApiConfig;
