using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.DA.CU;

namespace WebServiceBackEnd.BP.CU
{
    public class PermisoBP
    {
        private readonly PermisoDA _permisoDA;

        public PermisoBP(PermisoDA permisoDA)
        {
            _permisoDA = permisoDA;
        }

        /// <summary>
        /// Obtiene todos los permisos del sistema con información completa
        /// </summary>
        public async Task<List<dynamic>> Listar()
        {
            return await _permisoDA.Listar();
        }

        /// <summary>
        /// Obtiene un permiso específico por su ID
        /// </summary>
        public async Task<dynamic?> ObtenerPorId(int id)
        {
            if (id <= 0)
            {
                throw new Exception("El ID del permiso debe ser mayor a cero");
            }

            return await _permisoDA.ObtenerPorId(id);
        }

        /// <summary>
        /// Crea un nuevo permiso en el sistema
        /// Incluye validaciones de negocio
        /// </summary>
        public async Task<int> Crear(PermisoBE permiso)
        {
            // Validaciones de negocio
            if (string.IsNullOrWhiteSpace(permiso.Perm_Nombre))
            {
                throw new Exception("El nombre del permiso es requerido");
            }

            if (string.IsNullOrWhiteSpace(permiso.Perm_Actividad))
            {
                throw new Exception("La actividad del permiso es requerida");
            }

            // Validación de longitud
            if (permiso.Perm_Nombre.Length > 150)
            {
                throw new Exception("El nombre del permiso no puede exceder 150 caracteres");
            }

            if (permiso.Perm_Actividad.Length > 150)
            {
                throw new Exception("La actividad del permiso no puede exceder 150 caracteres");
            }

            if (!string.IsNullOrEmpty(permiso.Perm_Descripcion) && permiso.Perm_Descripcion.Length > 500)
            {
                throw new Exception("La descripción del permiso no puede exceder 500 caracteres");
            }

            return await _permisoDA.Crear(permiso);
        }

        /// <summary>
        /// Actualiza un permiso existente
        /// </summary>
        public async Task<bool> Actualizar(PermisoBE permiso)
        {
            // Validaciones de negocio
            if (permiso.Perm_Id <= 0)
            {
                throw new Exception("El ID del permiso es inválido");
            }

            if (string.IsNullOrWhiteSpace(permiso.Perm_Nombre))
            {
                throw new Exception("El nombre del permiso es requerido");
            }

            if (string.IsNullOrWhiteSpace(permiso.Perm_Actividad))
            {
                throw new Exception("La actividad del permiso es requerida");
            }


            return await _permisoDA.Actualizar(permiso);
        }

        /// <summary>
        /// Elimina un permiso del sistema (baja lógica)
        /// </summary>
        public async Task<bool> Eliminar(int id)
        {
            if (id <= 0)
            {
                throw new Exception("El ID del permiso debe ser mayor a cero");
            }

            return await _permisoDA.Eliminar(id);
        }

        /// <summary>
        /// Lista permisos con filtros personalizados
        /// </summary>
        public async Task<List<dynamic>> ListarConFiltros(PermisoBE filtros)
        {
            if (filtros == null)
            {
                throw new Exception("Los filtros son requeridos");
            }

            filtros.Accion ??= 1;

            return await _permisoDA.ListarConFiltros(filtros);
        }
    }
}
