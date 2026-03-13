using WebServiceBackEnd.BP.CG;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CG;
namespace WebServiceBackEnd.Controllers.CG
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AreasController : ControllerBase
    {
        private readonly AreaBP _AreaBP;

        public AreasController(IConfiguration configuration)
        {
            _AreaBP = new AreaBP(configuration);
        }

        [HttpGet("listar/{Accion}")]
        public async Task<IActionResult> Listar(int Accion)
        {
            try
            {
                var resultado = await _AreaBP.Listar(Accion);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud." + ex);
            }
        }

        [HttpGet("obtenerPorId/{areaId}")]
        public async Task<IActionResult> ObtenerPorId(int areaId)
        {
            try
            {
                var resultado = await _AreaBP.ObtenerPorId(areaId);
                if (resultado == null)
                    return NotFound("Área no encontrada");
                return Ok(resultado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud." + ex);
            }
        }

        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] AreaBE Area)
        {
            try
            {
                var resultado = await _AreaBP.Crear(Area);
                return Ok(new { mensaje = $"Area Creada Satisfactoriamente {resultado}", issuccessful = true});
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud." + ex);
            }
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] AreaBE Area)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                if (id != Area.Area_Id)
                    return BadRequest(new { mensaje = "El Id en la URL no coincide con el Área" });

                var areaAnterior = await _AreaBP.ObtenerPorId(id);
                if (areaAnterior == null)
                    return NotFound("Área no encontrado");

                Area.Area_ModificadoFecha = DateTime.Now;

                var resultado = await _AreaBP.Actualizar(Area);

                
                if (!resultado)
                    return NotFound("Area no encontrado");
                return Ok("Area actualizado satisfactoriamente");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
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
                var usuario = User.Identity?.Name ?? "Sistemas";

                var resultado = await _AreaBP.Eliminar(id, usuario);
                if (!resultado)
                    return NotFound("Área no encontrada");

                return Ok("Área eliminada satisfactoriamente");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
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
                var usuario = User.Identity?.Name ?? "Sistemas";
                var resultado = await _AreaBP.Activar(id, usuario);
                if (!resultado)
                    return NotFound("Área no encontrada");

                return Ok("Área activada satisfactoriamente");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
        [HttpPost("filtrar")]
        public async Task<IActionResult> Filtrar([FromBody] AreaBE filtro)
        {
            try
            {
                var resultado = await _AreaBP.ListarConFiltros(filtro);
                return Ok(resultado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
    }
}
