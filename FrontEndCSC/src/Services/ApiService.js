import ApiConfig from "../components/Config/api.config";

/**
 * Servicio centralizado para peticiones a la API
 * Verifica automáticamente la expiración del token antes de cada petición
 */
class ApiService {
  /**
   * Verificar si el token está expirado
   */
  static isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      const EXPIRATION_MARGIN = 30000;

      return currentTime >= expirationTime - EXPIRATION_MARGIN;
    } catch (error) {
      return true;
    }
  }

  /**
   * Realizar petición fetch con verificación de token
   */
  static async fetchWithAuth(url, options = {}, token = null) {
    if (token && this.isTokenExpired(token)) {
      localStorage.removeItem("userSession");

      window.location.reload();

      throw new Error("Token expirado. Por favor, inicia sesión nuevamente.");
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        localStorage.removeItem("userSession");

        window.location.reload();

        throw new Error(
          "Sesión no válida. Por favor, inicia sesión nuevamente."
        );
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET con verificación de token
   */
  static async get(endpoint, token = null) {
    const url = ApiConfig.getUrl(endpoint);
    const headers = ApiConfig.getHeaders(token);

    return this.fetchWithAuth(
      url,
      {
        method: "GET",
        headers,
      },
      token
    );
  }

  /**
   * POST con verificación de token
   */
  static async post(endpoint, body, token = null) {
    const url = ApiConfig.getUrl(endpoint);
    const headers = ApiConfig.getHeaders(token);

    return this.fetchWithAuth(
      url,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
      token
    );
  }

  /**
   * PUT con verificación de token
   */
  static async put(endpoint, body, token = null) {
    const url = ApiConfig.getUrl(endpoint);
    const headers = ApiConfig.getHeaders(token);

    return this.fetchWithAuth(
      url,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      },
      token
    );
  }

  /**
   * DELETE con verificación de token
   */
  static async delete(endpoint, token = null) {
    const url = ApiConfig.getUrl(endpoint);
    const headers = ApiConfig.getHeaders(token);

    return this.fetchWithAuth(
      url,
      {
        method: "DELETE",
        headers,
      },
      token
    );
  }

  /**
   * PATCH con verificación de token
   */
  static async patch(endpoint, body, token = null) {
    const url = ApiConfig.getUrl(endpoint);
    const headers = ApiConfig.getHeaders(token);

    return this.fetchWithAuth(
      url,
      {
        method: "PATCH",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  }
}

export default ApiService;
