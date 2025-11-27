/**
 * Convierte las claves de un objeto de camelCase a PascalCase
 * Ejemplo: marcNoti_Id -> MarcNoti_Id
 */
export const toPascalCase = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => toPascalCase(item));
  }

  if (typeof obj === "object" && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      // Capitalizar la primera letra
      const newKey = key.charAt(0).toUpperCase() + key.slice(1);
      acc[newKey] = toPascalCase(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};

/**
 * Convierte las claves de un objeto de PascalCase a camelCase
 * Ejemplo: MarcNoti_Id -> marcNoti_Id
 */
export const toCamelCase = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  if (typeof obj === "object" && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      // Convertir primera letra a minúscula
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      acc[newKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};
