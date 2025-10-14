import { useState, useEffect } from "react";
import ApiConfig from "../components/Config/api.config";

/**
 * Hook personalizado para gestionar y validar permisos del usuario
 */
export const usePermissions = (token, userId) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token && userId) {
      loadPermissions();
    }
  }, [token, userId]);

  const loadPermissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        ApiConfig.getUrl(ApiConfig.ENDPOINTSUSUARIOS.PERMISOS(userId)),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
        console.log("Permisos cargados:", data);
      } else {
        throw new Error("Error al cargar permisos");
      }
    } catch (err) {
      console.error("Error al cargar permisos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica si el usuario tiene un permiso específico por nombre
   * @param {string} permissionName - Nombre del permiso
   * @returns {boolean}
   */
  const hasPermission = (permissionName) => {
    if (!permissionName || !permissions.length) return false;

    return permissions.some(
      (perm) =>
        perm.perm_Nombre?.toLowerCase() === permissionName.toLowerCase() &&
        perm.perm_Estatus === true
    );
  };

  /**
   * Verifica si el usuario tiene CUALQUIERA de los permisos especificados
   * @param {string[]} permissionNames - Array de nombres de permisos
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionNames) => {
    if (!Array.isArray(permissionNames) || !permissionNames.length)
      return false;

    return permissionNames.some((permName) => hasPermission(permName));
  };

  /**
   * Verifica si el usuario tiene TODOS los permisos especificados
   * @param {string[]} permissionNames - Array de nombres de permisos
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionNames) => {
    if (!Array.isArray(permissionNames) || !permissionNames.length)
      return false;

    return permissionNames.every((permName) => hasPermission(permName));
  };

  /**
   * Obtiene un permiso específico por nombre
   * @param {string} permissionName - Nombre del permiso
   * @returns {object|null}
   */
  const getPermission = (permissionName) => {
    return (
      permissions.find(
        (perm) =>
          perm.perm_Nombre?.toLowerCase() === permissionName.toLowerCase()
      ) || null
    );
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermission,
    reloadPermissions: loadPermissions,
  };
};
