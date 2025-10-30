using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.BP.CM
{
    public class MarcasBP
    {
        private readonly MarcasDA _marcasDA;

        public MarcasBP(MarcasDA marcasDA)
        {
            _marcasDA = marcasDA;
        }

        /// <summary>
        /// Lista todas las marcas
        /// </summary>
        public async Task<List<dynamic>> Listar()
        {
            try
            {
                return await _marcasDA.Listar();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al listar marcas: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene una marca por su ID
        /// </summary>
        public async Task<MarcasBE?> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID de la marca debe ser mayor a 0");

                return await _marcasDA.ObtenerPorId(id);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Crea una nueva marca
        /// </summary>
        public async Task<int> Crear(MarcasBE marca)
        {
            try
            {
                if (marca == null)
                    throw new ArgumentException("Los datos de la marca son requeridos");
                if (marca.Empr_Id <= 0)
                    throw new ArgumentException("El ID de empresa es obligatorio");
                if (string.IsNullOrWhiteSpace(marca.Marc_Consecutivo))
                    throw new ArgumentException("El consecutivo de la marca es obligatorio");
                if (string.IsNullOrWhiteSpace(marca.Marc_Pais))
                    throw new ArgumentException("El país de la marca es obligatorio");                

                return await _marcasDA.Crear(marca);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al crear marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza una marca existente
        /// </summary>
        public async Task<bool> Actualizar(MarcasBE marca)
        {
            try
            {
                // Validaciones
                if (marca == null)
                    throw new ArgumentException("Los datos de la marca son requeridos");

                if (marca.Marc_Id <= 0)
                    throw new ArgumentException("El ID de la marca es obligatorio");

                if (marca.Empr_Id <= 0)
                    throw new ArgumentException("El ID de empresa es obligatorio");

                if (string.IsNullOrWhiteSpace(marca.Marc_Consecutivo))
                    throw new ArgumentException("El consecutivo de la marca es obligatorio");

                if (string.IsNullOrWhiteSpace(marca.Marc_Pais))
                    throw new ArgumentException("El país de la marca es obligatorio");

                // Verificar que la marca existe
                var marcaExistente = await _marcasDA.ObtenerPorId(marca.Marc_Id);
                if (marcaExistente == null)
                    throw new ArgumentException("La marca no existe en el sistema");

                marca.Marc_ModificadoFecha = DateTime.Now;

                return await _marcasDA.Actualizar(marca);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al actualizar marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Elimina una marca (baja lógica - estatus = 0)
        /// </summary>
        public async Task<bool> Eliminar(int id, string? modificadoPor = null)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID de la marca debe ser mayor a 0");

                // Verificar que la marca existe
                var marca = await _marcasDA.ObtenerPorId(id);
                if (marca == null)
                    throw new ArgumentException("La marca no existe en el sistema");

                if (!marca.Marc_Estatus)
                    throw new ArgumentException("La marca ya está eliminada");

                return await _marcasDA.Eliminar(id, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al eliminar marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Activa una marca (estatus = 1)
        /// </summary>
        public async Task<bool> Activar(int id, string? modificadoPor = null)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID de la marca debe ser mayor a 0");

                // Verificar que la marca existe
                var marca = await _marcasDA.ObtenerPorId(id);
                if (marca == null)
                    throw new ArgumentException("La marca no existe en el sistema");

                if (marca.Marc_Estatus)
                    throw new ArgumentException("La marca ya está activa");

                return await _marcasDA.Activar(id, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al activar marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Lista marcas con filtros personalizados
        /// </summary>
        public async Task<List<dynamic>> ListarConFiltros(MarcasBE filtros)
        {
            try
            {
                if (filtros == null)
                    filtros = new MarcasBE();

                // Valores por defecto
                if (!filtros.Accion.HasValue)
                    filtros.Accion = 1;

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al listar marcas con filtros: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene marcas por empresas validando permisos del usuario
        /// </summary>
        public async Task<List<dynamic>> ObtenerPorEmpresasConPermisos(int usuarioId)
        {
            try
            {
                if (usuarioId <= 0)
                    throw new ArgumentException("El ID del usuario debe ser mayor a 0");

                return await _marcasDA.ObtenerPorEmpresasConPermisos(usuarioId);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener marcas por permisos: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene marcas filtradas por empresa
        /// </summary>
        public async Task<List<dynamic>> ObtenerPorEmpresa(int empresaId)
        {
            try
            {
                if (empresaId <= 0)
                    throw new ArgumentException("El ID de empresa debe ser mayor a 0");

                var filtros = new MarcasBE
                {
                    Accion = 1,
                    Empr_Id = empresaId,
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = true
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener marcas por empresa: {ex.Message}");
            }
        }

        /// <summary>
        /// Busca marcas por nombre
        /// </summary>
        public async Task<List<dynamic>> BuscarPorNombre(string nombre)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nombre))
                    throw new ArgumentException("El nombre de búsqueda es requerido");

                var filtros = new MarcasBE
                {
                    Accion = 1,
                    Marc_Marca = nombre,
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = true
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al buscar marcas por nombre: {ex.Message}");
            }
        }

        /// <summary>
        /// Busca marcas por número de registro
        /// </summary>
        public async Task<List<dynamic>> BuscarPorRegistro(string registro)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registro))
                    throw new ArgumentException("El número de registro es requerido");

                var filtros = new MarcasBE
                {
                    Accion = 1,
                    Marc_Registro = registro,
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = true
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al buscar marcas por registro: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene marcas activas solamente
        /// </summary>
        public async Task<List<dynamic>> ObtenerActivas()
        {
            try
            {
                var filtros = new MarcasBE
                {
                    Accion = 0, // Listado básico
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = true
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener marcas activas: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene marcas inactivas solamente
        /// </summary>
        public async Task<List<dynamic>> ObtenerInactivas()
        {
            try
            {
                var filtros = new MarcasBE
                {
                    Accion = 1,
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = false
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener marcas inactivas: {ex.Message}");
            }
        }
    }
}