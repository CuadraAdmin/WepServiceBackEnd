using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BP.CM;
using WebServiceBackEnd.Services;

namespace WebServiceBackEnd.Controllers.CM
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MarcasController : ControllerBase
    {
        private readonly MarcasBP _marcasBP;
        private readonly BlobStorageService _blobStorageService;

        public MarcasController(MarcasBP marcasBP, BlobStorageService blobStorageService)
        {
            _marcasBP = marcasBP;
            _blobStorageService = blobStorageService;
        }

        /// <summary>
        /// Lista todas las marcas
        /// </summary>
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var marcas = await _marcasBP.Listar();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene una marca por su ID
        /// </summary>
        [HttpGet("obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var marca = await _marcasBP.ObtenerPorId(id);

                if (marca == null)
                {
                    return NotFound(new { mensaje = "Marca no encontrada" });
                }

                return Ok(marca);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Crea una nueva marca
        /// </summary>
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] MarcasBE marca)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _marcasBP.Crear(marca);
                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { id },
                    new { id, mensaje = "Marca creada exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Actualiza una marca existente
        /// </summary>
        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] MarcasBE marca)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id != marca.Marc_Id)
                    return BadRequest(new { mensaje = "El ID en la URL no coincide con el ID de la marca" });

                var marcaAnterior = await _marcasBP.ObtenerPorId(id);
                if (marcaAnterior == null)
                    return NotFound(new { mensaje = "Marca no encontrada" });

                string nombreAnterior = marcaAnterior.Marc_Marca;

                var resultado = await _marcasBP.Actualizar(marca);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Marca no encontrada" });
                }

                if (nombreAnterior != marca.Marc_Marca)
                {
                    await _blobStorageService.RenombrarCarpetaMarcaAsync(id, nombreAnterior);
                }

                return Ok(new { mensaje = "Marca actualizada exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Elimina una marca (baja lógica)
        /// </summary>
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var usuario = User.Identity?.Name ?? "Sistema";
                var resultado = await _marcasBP.Eliminar(id, usuario);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Marca no encontrada" });
                }

                return Ok(new { mensaje = "Marca eliminada exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Activa una marca
        /// </summary>
        [HttpPatch("activar/{id}")]
        public async Task<IActionResult> Activar(int id)
        {
            try
            {
                var usuario = User.Identity?.Name ?? "Sistema";
                var resultado = await _marcasBP.Activar(id, usuario);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Marca no encontrada" });
                }

                return Ok(new { mensaje = "Marca activada exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Lista marcas con filtros personalizados
        /// </summary>
        [HttpPost("filtrar")]
        public async Task<IActionResult> ListarConFiltros([FromBody] MarcasBE filtros)
        {
            try
            {
                var marcas = await _marcasBP.ListarConFiltros(filtros);
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene marcas filtradas por permisos del usuario
        /// </summary>
        [HttpGet("obtenerPorPermisos/{usuarioId}")]
        public async Task<IActionResult> ObtenerPorEmpresasConPermisos(int usuarioId)
        {
            try
            {
                var marcas = await _marcasBP.ObtenerPorEmpresasConPermisos(usuarioId);
                return Ok(marcas);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene marcas de una empresa específica
        /// </summary>
        [HttpGet("obtenerPorEmpresa/{empresaId}")]
        public async Task<IActionResult> ObtenerPorEmpresa(int empresaId)
        {
            try
            {
                var marcas = await _marcasBP.ObtenerPorEmpresa(empresaId);
                return Ok(marcas);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Busca marcas por nombre
        /// </summary>
        [HttpGet("buscarPorNombre")]
        public async Task<IActionResult> BuscarPorNombre([FromQuery] string nombre)
        {
            try
            {
                var marcas = await _marcasBP.BuscarPorNombre(nombre);
                return Ok(marcas);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Busca marcas por número de registro
        /// </summary>
        [HttpGet("buscarPorRegistro")]
        public async Task<IActionResult> BuscarPorRegistro([FromQuery] string registro)
        {
            try
            {
                var marcas = await _marcasBP.BuscarPorRegistro(registro);
                return Ok(marcas);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene solo las marcas activas
        /// </summary>
        [HttpGet("activas")]
        public async Task<IActionResult> ObtenerActivas()
        {
            try
            {
                var marcas = await _marcasBP.ObtenerActivas();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene solo las marcas inactivas
        /// </summary>
        [HttpGet("inactivas")]
        public async Task<IActionResult> ObtenerInactivas()
        {
            try
            {
                var marcas = await _marcasBP.ObtenerInactivas();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Endpoint de búsqueda avanzada con múltiples filtros
        /// </summary>
        [HttpGet("buscarAvanzado")]
        public async Task<IActionResult> BuscarAvanzado(
            [FromQuery] int? empresaId = null,
            [FromQuery] string? nombre = null,
            [FromQuery] string? registro = null,
            [FromQuery] string? titular = null,
            [FromQuery] bool? estatus = null,
            [FromQuery] bool filtrarEstatus = false)
        {
            try
            {
                var filtros = new MarcasBE
                {
                    Accion = 1,
                    Empr_Id = empresaId ?? 0,
                    Marc_Marca = nombre,
                    Marc_Registro = registro,
                    Marc_Titular = titular,
                    Marc_Estatus = estatus ?? false,
                    Marc_FiltroEstatus = filtrarEstatus
                };

                var marcas = await _marcasBP.ListarConFiltros(filtros);
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Crea múltiples marcas de forma masiva
        /// </summary>
        [HttpPost("crear-masivo")]
        public async Task<IActionResult> CrearMasivo([FromBody] List<MarcasBE> marcas)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var (totalInsertados, totalErrores, resultados) = await _marcasBP.CrearMasivo(marcas);

                return Ok(new
                {
                    mensaje = $"Proceso completado. Insertados: {totalInsertados}, Errores: {totalErrores}",
                    totalInsertados,
                    totalErrores,
                    detalles = resultados
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
    }
}