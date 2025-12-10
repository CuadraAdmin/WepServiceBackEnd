using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BP;

namespace WebServiceBackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaisController : ControllerBase
    {
        private readonly PaisBP _paisBP;

        public PaisController(IConfiguration configuration)
        {
            _paisBP = new PaisBP(configuration);
        }

        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var paises = await _paisBP.Listar();
                return Ok(paises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al listar países: {ex.Message}" });
            }
        }

        [HttpGet("obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var pais = await _paisBP.ObtenerPorId(id);
                if (pais == null)
                    return NotFound(new { mensaje = "País no encontrado" });

                return Ok(pais);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener país: {ex.Message}" });
            }
        }

        [HttpGet("obtenerPorNombre/{nombre}")]
        public async Task<IActionResult> ObtenerPorNombre(string nombre)
        {
            try
            {
                var pais = await _paisBP.ObtenerPorNombre(nombre);
                if (pais == null)
                    return NotFound(new { mensaje = "País no encontrado" });

                return Ok(pais);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener país: {ex.Message}" });
            }
        }

        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] PaisBE pais)
        {
            try
            {
                var usuarioClaim = User.FindFirst("usuario")?.Value;
                pais.Pais_CreadoPor = usuarioClaim ?? "Sistema";
                pais.Pais_Estatus = true;

                var paisId = await _paisBP.Crear(pais);
                return Ok(new { id = paisId, mensaje = "País creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al crear país: {ex.Message}" });
            }
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PaisBE pais)
        {
            try
            {
                var usuarioClaim = User.FindFirst("usuario")?.Value;
                pais.Pais_Id = id;
                pais.Pais_ModificadoPor = usuarioClaim ?? "Sistema";

                await _paisBP.Actualizar(pais);
                return Ok(new { mensaje = "País actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al actualizar país: {ex.Message}" });
            }
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var usuarioClaim = User.FindFirst("usuario")?.Value;
                await _paisBP.Eliminar(id, usuarioClaim ?? "Sistema");
                return Ok(new { mensaje = "País desactivado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al desactivar país: {ex.Message}" });
            }
        }

        [HttpPatch("activar/{id}")]
        public async Task<IActionResult> Activar(int id)
        {
            try
            {
                var usuarioClaim = User.FindFirst("usuario")?.Value;
                await _paisBP.Activar(id, usuarioClaim ?? "Sistema");
                return Ok(new { mensaje = "País activado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al activar país: {ex.Message}" });
            }
        }

        [HttpPost("listarConFiltros")]
        public async Task<IActionResult> ListarConFiltros([FromBody] PaisBE filtros)
        {
            try
            {
                var paises = await _paisBP.ListarConFiltros(filtros);
                return Ok(paises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al listar países: {ex.Message}" });
            }
        }
    }
}