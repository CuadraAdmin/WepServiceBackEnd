import { useState, useEffect } from "react";

/**
 * Hook personalizado para manejar la autenticacion
 * Gestiona automáticamente localStorage y la persistencia de sesion
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clave para localStorage
  const SESSION_KEY = "userSession";

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = () => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);

      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);

        if (parsedSession.token && parsedSession.usuario) {
          console.log(" Sesión recuperada");
          setUserData(parsedSession);
          setIsAuthenticated(true);
        } else {
          console.warn(" Sesión inválida");
          clearSession();
        }
      }
    } catch (error) {
      console.error(" Error al cargar sesión:", error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = (data) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      setUserData(data);
      setIsAuthenticated(true);
      console.log("Sesión guardada");
      return true;
    } catch (error) {
      console.error("Error al guardar sesión:", error);
      return false;
    }
  };

  //  Limpiar sesión
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      setUserData(null);
      setIsAuthenticated(false);
      console.log(" Sesión limpiada");
    } catch (error) {
      console.error(" Error al limpiar sesión:", error);
    }
  };

  const updateUserData = (newData) => {
    if (userData) {
      const updatedData = { ...userData, ...newData };
      saveSession(updatedData);
    }
  };

  const isTokenExpired = () => {
    if (!userData?.token) return true;

    try {
      const payload = JSON.parse(atob(userData.token.split(".")[1]));
      const expirationTime = payload.exp * 1000;

      return Date.now() >= expirationTime;
    } catch (error) {
      console.error(" Error al verificar token:", error);
      return true;
    }
  };

  return {
    // Estados
    isAuthenticated,
    userData,
    isLoading,

    login: saveSession,
    logout: clearSession,
    updateUserData,
    isTokenExpired,

    token: userData?.token,
    user: userData?.usuario,
  };
};
