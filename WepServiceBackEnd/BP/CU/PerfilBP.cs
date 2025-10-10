using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.DA.CU;

namespace WebServiceBackEnd.BP.CU
{
    public class PerfilBP
    {
        private readonly PerfilDA _perfilDA;

        public PerfilBP(PerfilDA perfilDA)
        {
            _perfilDA = perfilDA;
        }

        public async Task<List<PerfilBE>> ObtenerTodosPerfiles()
        {
            try
            {
                return await _perfilDA.Listar();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener perfiles: {ex.Message}");
            }
        }
        public async Task<PerfilBE?> ObtenerPerfilPorId(int id)
        {
            if (id <= 0)
                throw new ArgumentException("El ID del perfil debe ser mayor a cero");

            try
            {
                return await _perfilDA.ObtenerPorId(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error  al obtener perfil: {ex.Message}");
            }
        }

        public async Task<List<PermisoBE>> ObtenerPermisosPorPerfil(int perfilId)
        {
            if (perfilId <= 0)
                throw new ArgumentException("El ID del perfil debe ser mayor a cero");

            try
            {
                return await _perfilDA.ObtenerPermisosPorPerfil(perfilId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener permisos: {ex.Message}");
            }
        }

        public async Task<int> CrearPerfil(PerfilBE perfil)
        {
            ValidarPerfil(perfil);

            try
            {
                return await _perfilDA.Crear(perfil);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear perfil: {ex.Message}");
            }
        }

        public async Task<bool> ActualizarPerfil(PerfilBE perfil)
        {
            if (perfil.Perf_Id <= 0)
                throw new ArgumentException("El ID del perfil debe ser mayor a cero");

            ValidarPerfil(perfil);

            try
            {
                return await _perfilDA.Actualizar(perfil);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar perfil: {ex.Message}");
            }
        }

        public async Task<bool> EliminarPerfil(int id)
        {
            if (id <= 0)
                throw new ArgumentException("El ID del perfil debe ser mayor a cero");

            try
            {
                return await _perfilDA.Eliminar(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar perfil: {ex.Message}");
            }
        }

        public async Task<bool> AsignarPermisoAPerfil(int perfilId, int permisoId, string creadoPor)
        {
            ValidarIdsYUsuario(perfilId, permisoId, creadoPor);

            try
            {
                return await _perfilDA.AsignarPermisoAPerfil(perfilId, permisoId, creadoPor);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al asignar permiso: {ex.Message}");
            }
        }

        public async Task<bool> RemoverPermisoAPerfil(int perfilId, int permisoId)
        {
            if (perfilId <= 0 || permisoId <= 0)
                throw new ArgumentException("Los IDs del perfil y permiso deben ser mayores a cero");

            try
            {
                return await _perfilDA.RemoverPermisoAPerfil(perfilId, permisoId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al remover permiso: {ex.Message}");
            }
        }

        private void ValidarPerfil(PerfilBE perfil)
        {
            if (perfil == null)
                throw new ArgumentNullException(nameof(perfil));

            if (string.IsNullOrWhiteSpace(perfil.Perf_Nombre))
                throw new ArgumentException("El nombre del perfil es requerido");

        }

        private void ValidarIdsYUsuario(int perfilId, int permisoId, string creadoPor)
        {
            if (perfilId <= 0 || permisoId <= 0)
                throw new ArgumentException("Los IDs del perfil y permiso deben ser mayores a cero");

            if (string.IsNullOrWhiteSpace(creadoPor))
                throw new ArgumentException("El usuario que crea la asignación es requerido");
        }

        public async Task<List<dynamic>> ListarConFiltros(PerfilBE filtros)
        {
            try
            {
                return await _perfilDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {

                throw new Exception($"Error al obtener perfiles: {ex.Message}");
            }
        }
    }
}
