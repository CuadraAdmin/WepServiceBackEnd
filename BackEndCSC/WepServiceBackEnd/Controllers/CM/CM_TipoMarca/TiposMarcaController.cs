using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CM.CM_TipoMarca;
using WebServiceBackEnd.BP.CM.CM_TipoMarca;

namespace WebServiceBackEnd.Controllers.CM.CM_TipoMarca
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TiposMarcaController : ControllerBase
    {
        private readonly TipoMarcaBP _tipoMarcaBP;

        public TiposMarcaController(TipoMarcaBP tipoMarcaBP)
        {
            _tipoMarcaBP = tipoMarcaBP;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var tiposMarca = await _tipoMarcaBP.Listar();
                return Ok(tiposMarca);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("Obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var tipoMarca = await _tipoMarcaBP.ObtenerPorId(id);

                if (tipoMarca == null)
                {
                    return NotFound(new { mensaje = "Tipo de marca no encontrado" });
                }

                return Ok(tipoMarca);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("Agregar")]
        public async Task<IActionResult> Crear([FromBody] TipoMarcaBE tipoMarca)
        {
            try
            {
                var id = await _tipoMarcaBP.Crear(tipoMarca);
                return CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id, mensaje = "Tipo de marca creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] TipoMarcaBE tipoMarca)
        {
            try
            {
                tipoMarca.TipoMar_Id = id;
                var resultado = await _tipoMarcaBP.Actualizar(tipoMarca);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Tipo de marca no encontrado" });
                }

                return Ok(new { mensaje = "Tipo de marca actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var resultado = await _tipoMarcaBP.Eliminar(id);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Tipo de marca no encontrado" });
                }

                return Ok(new { mensaje = "Tipo de marca eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPatch("activar/{id}")]
        public async Task<IActionResult> Activar(int id)
        {
            try
            {
                var resultado = await _tipoMarcaBP.Activar(id);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Tipo de marca no encontrado" });
                }

                return Ok(new { mensaje = "Tipo de marca activado exitosamente" });
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

        [HttpPost("ListarConFiltros")]
        public async Task<IActionResult> ListarConFiltros([FromBody] TipoMarcaBE filtros)
        {
            try
            {
                var tiposMarca = await _tipoMarcaBP.ListarConFiltros(filtros);
                return Ok(tiposMarca);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
    }
}
