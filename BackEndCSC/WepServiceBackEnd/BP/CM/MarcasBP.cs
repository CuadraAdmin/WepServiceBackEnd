using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;
using WebServiceBackEnd.Services;

namespace WebServiceBackEnd.BP.CM
{
    public class MarcasBP
    {
        private readonly MarcasDA _marcasDA;
        private readonly BlobStorageService _blobStorageService;

        public MarcasBP(MarcasDA marcasDA, BlobStorageService blobStorageService)
        {
            _marcasDA = marcasDA;
            _blobStorageService = blobStorageService;
        }

        /// <summary>
        /// Lista todas las marcas con sus imágenes de diseño
        /// </summary>
        public async Task<List<dynamic>> Listar()
        {
            try
            {
                var marcas = await _marcasDA.Listar();

                foreach (dynamic marca in marcas)
                {
                    var marcaDict = marca as IDictionary<string, object>;
                    if (marcaDict != null && marcaDict.ContainsKey("Marc_Id"))
                    {
                        int marcaId = Convert.ToInt32(marcaDict["Marc_Id"]);
                        var imagenUrl = await _blobStorageService.ObtenerImagenDisenoAsync(marcaId);
                        marcaDict["Marc_Diseno"] = imagenUrl;
                    }
                }

                return marcas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar marcas: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene una marca por su ID con su imagen de diseño
        /// </summary>
        public async Task<MarcasBE?> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID de la marca debe ser mayor a 0");

                var marca = await _marcasDA.ObtenerPorId(id);

                if (marca != null)
                {
                    marca.Marc_Diseno = await _blobStorageService.ObtenerImagenDisenoAsync(id);
                }

                return marca;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener marca: {ex.Message}");
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

                return await _marcasDA.Crear(marca);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza una marca existente
        /// </summary>
        public async Task<bool> Actualizar(MarcasBE marca)
        {
            try
            {
                if (marca == null)
                    throw new ArgumentException("Los datos de la marca son requeridos");

                if (marca.Marc_Id <= 0)
                    throw new ArgumentException("El ID de la marca es obligatorio");

                if (marca.Empr_Id <= 0)
                    throw new ArgumentException("El ID de empresa es obligatorio");


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
                throw new Exception($"Error al actualizar marca: {ex.Message}");
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
                throw new Exception($"Error al eliminar marca: {ex.Message}");
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
                throw new Exception($"Error  al activar marca: {ex.Message}");
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

                if (!filtros.Accion.HasValue)
                    filtros.Accion = 1;

                var marcas = await _marcasDA.ListarConFiltros(filtros);

                foreach (dynamic marca in marcas)
                {
                    var marcaDict = marca as IDictionary<string, object>;
                    if (marcaDict != null && marcaDict.ContainsKey("Marc_Id"))
                    {
                        int marcaId = Convert.ToInt32(marcaDict["Marc_Id"]);
                        var imagenUrl = await _blobStorageService.ObtenerImagenDisenoAsync(marcaId);
                        marcaDict["Marc_Diseno"] = imagenUrl;
                    }
                }

                return marcas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar marcas con filtros: {ex.Message}");
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

                var marcas = await _marcasDA.ObtenerPorEmpresasConPermisos(usuarioId);

                foreach (dynamic marca in marcas)
                {
                    var marcaDict = marca as IDictionary<string, object>;
                    if (marcaDict != null && marcaDict.ContainsKey("Marc_Id"))
                    {
                        int marcaId = Convert.ToInt32(marcaDict["Marc_Id"]);
                        var imagenUrl = await _blobStorageService.ObtenerImagenDisenoAsync(marcaId);
                        marcaDict["Marc_Diseno"] = imagenUrl;
                    }
                }

                return marcas;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener marcas por permisos: {ex.Message}");
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
                throw new Exception($"Error al obtener marcas por empresa: {ex.Message}");
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
                throw new Exception($"Error al buscar marcas por nombre: {ex.Message}");
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
                throw new Exception($"Error al buscar marcas por registro: {ex.Message}");
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
                    Accion = 0,
                    Marc_FiltroEstatus = true,
                    Marc_Estatus = true
                };

                return await _marcasDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error  al obtener marcas activas: {ex.Message}");
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
                throw new Exception($"Error al obtener marcas inactivas: {ex.Message}");
            }
        }

        public async Task<(int TotalInsertados, int TotalErrores, List<dynamic> Resultados)> CrearMasivo(List<MarcasBE> marcas)
        {
            try
            {
                if (marcas == null || !marcas.Any())
                    throw new ArgumentException("La lista de marcas no puede estar vacía");

                if (marcas.Count > 1000)
                    throw new ArgumentException("No se pueden insertar más de 1000 marcas a la vez");

                return await _marcasDA.CrearMasivo(marcas);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear marcas masivamente: {ex.Message}");
            }
        }
    }
}