using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BP.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.Controllers.CM
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MarcaNotificacionesController : ControllerBase
    {
        private readonly MarcaNotificacionBP _marcaNotificacionBP;

        public MarcaNotificacionesController(IConfiguration configuration)
        {
            _marcaNotificacionBP = new MarcaNotificacionBP(configuration);
        }

        [HttpGet("listar-todos")]
        public async Task<IActionResult> ListarTodos()
        {
            try
            {
                var notificaciones = await _marcaNotificacionBP.Listar(0);
                return Ok(notificaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        /// <summary>
        /// Listar contactos de notificación de una marca
        /// </summary>
        [HttpGet("listar/{marcaId}")]
        public async Task<IActionResult> Listar(int marcaId)
        {
            try
            {
                var notificaciones = await _marcaNotificacionBP.Listar(marcaId);
                return Ok(notificaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        /// <summary>
        /// Crear contacto de notificación
        /// </summary>
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] MarcaNotificacionBE notificacion)
        {
            try
            {
                var id = await _marcaNotificacionBP.Crear(notificacion);
                return Ok(new { mensaje = "Contacto de notificación creado exitosamente", id = id });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        /// <summary>
        /// Actualizar contacto de notificación
        /// </summary>
        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] MarcaNotificacionBE notificacion)
        {
            try
            {
                notificacion.MarcNoti_Id = id;
                var resultado = await _marcaNotificacionBP.Actualizar(notificacion);
                if (!resultado)
                    return BadRequest(new { mensaje = "No se pudo actualizar el contacto" });

                return Ok(new { mensaje = "Contacto actualizado exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        /// <summary>
        /// Eliminar contacto de notificación
        /// </summary>
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] string modificadoPor = "Sistema")
        {
            try
            {
                if (string.IsNullOrEmpty(modificadoPor))
                    modificadoPor = "Sistema";

                var resultado = await _marcaNotificacionBP.Eliminar(id, modificadoPor);

                if (!resultado)
                    return BadRequest(new { mensaje = "No se pudo eliminar el contacto" });

                return Ok(new { mensaje = "Contacto eliminado exitosamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Crear múltiples contactos de notificación en una sola operación
        /// </summary>
        [HttpPost("crear-masivo")]
        public async Task<IActionResult> CrearMasivo([FromBody] List<MarcaNotificacionBE> contactos)
        {
            try
            {
                var (totalInsertados, totalErrores, resultados) = await _marcaNotificacionBP.CrearMasivo(contactos);

                return Ok(new
                {
                    mensaje = $"Proceso completado: {totalInsertados} contactos insertados, {totalErrores} errores",
                    totalInsertados = totalInsertados,
                    totalErrores = totalErrores,
                    detalles = resultados
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}