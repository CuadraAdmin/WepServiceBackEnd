using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BP;

namespace WebServiceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmpresasController : ControllerBase
    {
        private readonly EmpresaBP _empresaBP;

        public EmpresasController(EmpresaBP empresaBP)
        {
            _empresaBP = empresaBP;
        }

        /// <summary>
        /// Lista todas las empresas
        /// </summary>
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var empresas = await _empresaBP.Listar();
                return Ok(empresas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene una empresa por su ID
        /// </summary>
        [HttpGet("obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var empresa = await _empresaBP.ObtenerPorId(id);

                if (empresa == null)
                {
                    return NotFound(new { mensaje = "Empresa no encontrada" });
                }

                return Ok(empresa);
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
        /// Crea una nueva empresa
        /// </summary>
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] EmpresaBE empresa)
        { 
            try
            { 
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _empresaBP.Crear(empresa);
                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { id },
                    new { id, mensaje = "Empresa creada exitosamente" });
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
        /// Actualiza una empresa existente
        /// </summary>
        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] EmpresaBE empresa)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id != empresa.Empr_Id)
                    return BadRequest(new { mensaje = "El ID en la URL no coincide con el ID de la empresa" });

                var resultado = await _empresaBP.Actualizar(empresa);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Empresa no encontrada" });
                }

                return Ok(new { mensaje = "Empresa actualizada exitosamente" });
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
        /// Lista empresas con filtros personalizados
        /// </summary>
        [HttpPost("filtrar")]
        public async Task<IActionResult> ListarConFiltros([FromBody] EmpresaBE filtros)
        {
            try
            {
                var empresas = await _empresaBP.ListarConFiltros(filtros);
                return Ok(empresas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene empresas a las que el usuario tiene acceso según sus permisos
        /// </summary>
        [HttpGet("obtenerPorPermiso/{usuarioId}")]
        public async Task<IActionResult> ObtenerEmpresasPorPermiso(int usuarioId)
        {
            try
            {
                var empresas = await _empresaBP.ObtenerEmpresasPorPermiso(usuarioId);
                return Ok(empresas);
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
        /// Obtiene solo las empresas activas
        /// </summary>
        [HttpGet("activas")]
        public async Task<IActionResult> ObtenerActivas()
        {
            try
            {
                var empresas = await _empresaBP.ObtenerActivas();
                return Ok(empresas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Búsqueda avanzada con múltiples filtros
        /// </summary>
        [HttpGet("buscarAvanzado")]
        public async Task<IActionResult> BuscarAvanzado([FromQuery] int? empresaId = null,[FromQuery] string? clave = null,[FromQuery] string? nombre = null,[FromQuery] bool? estatus = null,[FromQuery] bool filtrarEstatus = false)
        {
            try
            {
                var filtros = new EmpresaBE
                {
                    Accion = 1,
                    Empr_Id = empresaId ?? 0,
                    Empr_Clave = clave,
                    Empr_Nombre = nombre,
                    Empr_Estatus = estatus ?? false,
                    Empr_FiltroEstatus = filtrarEstatus
                };
                var empresas = await _empresaBP.ListarConFiltros(filtros);
                return Ok(empresas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
    }
}