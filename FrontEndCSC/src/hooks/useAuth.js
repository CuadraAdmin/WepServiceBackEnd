import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook personalizado para manejar la autenticacion
 * Gestiona automáticamente localStorage y la persistencia de sesion
 * Verifica automáticamente la expiración del token y cierra sesión si es necesario
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const warningShown = useRef(false);

  const SESSION_KEY = "userSession";

  const CHECK_INTERVAL = 1000;
  const WARNING_TIME = 50000;
  const EXPIRATION_MARGIN = 0;

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !userData?.token) {
      return;
    }

    const timeRemaining = getTokenTimeRemainingMs();

    if (timeRemaining <= 0) {
      handleTokenExpiration();
      return;
    }

    if (timeRemaining <= WARNING_TIME && !warningShown.current) {
      showExpirationWarning();
      warningShown.current = true;
    }

    const intervalId = setInterval(() => {
      const timeRemaining = getTokenTimeRemainingMs();

      if (
        timeRemaining <= WARNING_TIME &&
        timeRemaining > 0 &&
        !warningShown.current
      ) {
        showExpirationWarning();
        warningShown.current = true;
      }

      if (timeRemaining <= 0) {
        handleTokenExpiration();
      }
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
      warningShown.current = false;
    };
  }, [isAuthenticated, userData]);

  /**
   * Cargar sesión desde localStorage
   */
  const loadSession = () => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);

      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);

        if (parsedSession.token && parsedSession.usuario) {
          const payload = JSON.parse(atob(parsedSession.token.split(".")[1]));
          const expirationTime = payload.exp * 1000;
          //console.log(
          //  "Tiempo de expiración del token:",
          //  new Date(expirationTime)
          //);
          if (Date.now() >= expirationTime) {
            clearSession();
          } else {
            setUserData(parsedSession);
            setIsAuthenticated(true);
            warningShown.current = false;
          }
        } else {
          clearSession();
        }
      }
    } catch (error) {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guardar sesión en localStorage
   */
  const saveSession = (data) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      setUserData(data);
      setIsAuthenticated(true);
      warningShown.current = false;
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Limpiar sesión
   */
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      setUserData(null);
      setIsAuthenticated(false);
      warningShown.current = false;
    } catch (error) {}
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUserData = (newData) => {
    if (userData) {
      const updatedData = { ...userData, ...newData };
      saveSession(updatedData);
    }
  };

  /**
   * Obtener tiempo restante del token en milisegundos
   */
  const getTokenTimeRemainingMs = useCallback(() => {
    if (!userData?.token) return 0;

    try {
      const payload = JSON.parse(atob(userData.token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expirationTime - currentTime;

      return Math.max(0, timeRemaining);
    } catch (error) {
      return 0;
    }
  }, [userData?.token]);

  /**
   * Verificar si el token ha expirado
   */
  const isTokenExpired = useCallback(() => {
    if (!userData?.token) return true;

    try {
      const payload = JSON.parse(atob(userData.token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      return currentTime >= expirationTime - EXPIRATION_MARGIN;
    } catch (error) {
      return true;
    }
  }, [userData?.token]);

  /**
   * Mostrar notificación moderna con Tailwind
   */
  const showNotification = (
    message,
    title = " Sesión Expirada",
    autoClose = true
  ) => {
    const existingNotification = document.getElementById(
      "session-notification"
    );
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.id = "session-notification";
    notification.className =
      "fixed top-4 right-4 z-[9999] animate-[slideIn_0.3s_ease-out]";

    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `;
      document.head.appendChild(style);
    }
    //notificacion
    notification.innerHTML = `
      <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl shadow-2xl p-5 max-w-md backdrop-blur-sm">
        <div class="flex items-start gap-4">
          <!-- Icono -->
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          
          <!-- Contenido -->
          <div class="flex-1">
            <h3 class="text-yellow-900 font-bold text-base mb-1">${title}</h3>
            <p class="text-yellow-800 text-sm leading-relaxed">${message}</p>
          </div>
          
          <!-- Botón cerrar -->
          <button 
            onclick="this.closest('#session-notification').style.animation='slideOut 0.3s ease-in'; setTimeout(() => this.closest('#session-notification').remove(), 300)" 
            class="flex-shrink-0 text-yellow-600 hover:text-yellow-900 transition-colors focus:outline-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        ${
          autoClose
            ? `
        <!-- Barra de progreso -->
        <div class="mt-3 h-1 bg-yellow-200 rounded-full overflow-hidden">
          <div class="h-full bg-yellow-500 rounded-full animate-[progress_15s_linear]"></div>
        </div>
        `
            : ""
        }
      </div>
    `;

    document.body.appendChild(notification);

    if (autoClose) {
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.style.animation = "slideOut 0.3s ease-in";
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, 15000);
    }
  };

  /**
   * Mostrar advertencia de que la sesión está por expirar
   */
  const showExpirationWarning = () => {
    showNotification(
      "Tu sesión expirará en 40 segundos. Guarda tu trabajo para evitar pérdida de datos.",
      " Advertencia de Sesión",
      true
    );
  };

  /**
   * Manejar expiración del token
   * Cierra la sesión y muestra mensaje al usuario
   */
  const handleTokenExpiration = useCallback(() => {
    clearSession();

    if (typeof window !== "undefined") {
      showNotification(
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.",
        "Sesión Expirada",
        false
      );
    }
  }, []);

  /**
   * Obtener tiempo restante del token en minutos
   */
  const getTokenTimeRemaining = useCallback(() => {
    if (!userData?.token) return 0;

    try {
      const payload = JSON.parse(atob(userData.token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeRemaining = expirationTime - currentTime;

      return Math.max(0, Math.floor(timeRemaining / 60000));
    } catch (error) {
      return 0;
    }
  }, [userData?.token]);

  return {
    // Estados
    isAuthenticated,
    userData,
    isLoading,

    // Métodos principales
    login: saveSession,
    logout: clearSession,
    updateUserData,

    // Verificación de token
    isTokenExpired,
    handleTokenExpiration,
    getTokenTimeRemaining,

    // Accesos rápidos
    token: userData?.token,
    user: userData?.usuario,
  };
};
