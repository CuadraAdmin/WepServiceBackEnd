using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BP.CM;

namespace WebServiceBackEnd.Controllers.CM
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MarcaClasesController : ControllerBase
    {
        private readonly MarcaClaseBP _marcaClaseBP;

        public MarcaClasesController(IConfiguration configuration)
        {
            _marcaClaseBP = new MarcaClaseBP(configuration);
        }

        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var clases = await _marcaClaseBP.Listar();
                return Ok(clases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet("obtenerPorId/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var clase = await _marcaClaseBP.ObtenerPorId(id);
                if (clase == null)
                    return NotFound(new { mensaje = "Clase no encontrada" });

                return Ok(clase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet("obtenerPorClave/{clave}")]
        public async Task<IActionResult> ObtenerPorClave(string clave)
        {
            try
            {
                var clase = await _marcaClaseBP.ObtenerPorClave(clave);
                if (clase == null)
                    return NotFound(new { mensaje = "Clase no encontrada" });

                return Ok(clase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpPost("filtros")]
        public async Task<IActionResult> ListarConFiltros([FromBody] MarcaClaseBE filtros)
        {
            try
            {
                var clases = await _marcaClaseBP.ListarConFiltros(filtros);
                return Ok(clases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}