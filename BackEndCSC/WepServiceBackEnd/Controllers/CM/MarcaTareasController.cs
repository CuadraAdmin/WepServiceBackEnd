using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BP.CM;

namespace WebServiceBackEnd.Controllers.CM
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MarcaTareasController : ControllerBase
    {
        private readonly MarcaTareasBP _marcaTareasBP;

        public MarcaTareasController(IConfiguration configuration)
        {
            _marcaTareasBP = new MarcaTareasBP(configuration);
        }

        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var tareas = await _marcaTareasBP.Listar();
                return Ok(tareas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("listar/activosPorMarca/{idMarca}")]
        public async Task<IActionResult> ListarActivosPorMarca(int idMarca)
        {
            try
            {
                var tareas = await _marcaTareasBP.ListarActivos(idMarca);
                return Ok(tareas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var tarea = await _marcaTareasBP.ObtenerPorId(id);
                if (tarea == null)
                    return NotFound(new { message = "Tarea no encontrada" });

                return Ok(tarea);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("marca/{marcaId}")]
        public async Task<IActionResult> ListarPorMarca(int marcaId)
        {
            try
            {
                var tareas = await _marcaTareasBP.ListarPorMarca(marcaId);
                return Ok(tareas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] MarcaTareasBE tarea)
        {
            try
            {
                var id = await _marcaTareasBP.Crear(tarea);
                return Ok(new { message = "Tarea creada exitosamente", id = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] MarcaTareasBE tarea)
        {
            try
            {
                tarea.MarcTare_Id = id;
                var resultado = await _marcaTareasBP.Actualizar(tarea);
                if (!resultado)
                    return BadRequest(new { message = "No se pudo actualizar la tarea" });

                return Ok(new { message = "Tarea actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPatch("finalizarTarea/{id}")]
        public async Task<IActionResult> ActualizarFechaFinalizacion(int id)
        {
            try
            {
                var resultado = await _marcaTareasBP.ActualizarFechaFinalizacion(id);
                if (!resultado)
                    return BadRequest(new { message = "No se pudo actualizar la fecha de finalización" });

                return Ok(new { message = "Fecha de finalización actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var resultado = await _marcaTareasBP.Eliminar(id);
                if (!resultado)
                    return BadRequest(new { message = "No se pudo eliminar la tarea" });

                return Ok(new { message = "Tarea eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("filtros")]
        public async Task<IActionResult> ListarConFiltros([FromBody] MarcaTareasBE filtros)
        {
            try
            {
                var tareas = await _marcaTareasBP.ListarConFiltros(filtros);
                return Ok(tareas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}