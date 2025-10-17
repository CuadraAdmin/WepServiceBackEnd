using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.BP.CU;

namespace WebServiceBackEnd.Controllers.CU
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PermisosController : ControllerBase
    {
        private readonly PermisoBP _permisoBP;

        public PermisosController(PermisoBP permisoBP)
        {
            _permisoBP = permisoBP;
        }

        /// <summary>
        /// Lista todos los permisos
        /// </summary>
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var permisos = await _permisoBP.Listar();
                return Ok(permisos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Lista permisos con filtros personalizados
        /// </summary>
        /// <param name="accion">0=básico, 1=completo, 2=por ID</param>
        /// <param name="id">ID del permiso (opcional)</param>
        /// <param name="nombre">Nombre del permiso (búsqueda parcial)</param>
        /// <param name="actividad">Actividad del permiso (búsqueda parcial)</param>
        /// <param name="estatus">Estado del permiso (true=activo, false=inactivo)</param>
        /// <param name="filtrarEstatus">Indica si se debe filtrar por estatus</param>
        [HttpGet("filtrar")]
        public async Task<IActionResult> ListarConFiltros(
            [FromQuery] int accion = 1,
            [FromQuery] int? id = null,
            [FromQuery] string? nombre = null,
            [FromQuery] string? actividad = null,
            [FromQuery] bool? estatus = null,
            [FromQuery] bool filtrarEstatus = false)
        {
            try
            {
                var filtros = new PermisoBE
                {
                    Accion = accion,
                    Perm_Id = id ?? 0,
                    Perm_Nombre = nombre,
                    Perm_Actividad = actividad,
                    Perm_Estatus = estatus ?? false,
                    Perm_FiltroEstatus = filtrarEstatus
                };

                var permisos = await _permisoBP.ListarConFiltros(filtros);
                return Ok(permisos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtiene un permiso por su ID
        /// </summary>
        [HttpGet("obtener/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var permiso = await _permisoBP.ObtenerPorId(id);
                if (permiso == null)
                {
                    return NotFound(new { mensaje = "Permiso no encontrado" });
                }
                return Ok(permiso);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Crea un nuevo permiso
        /// </summary>
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] PermisoBE permiso)
        {
            try
            {
                var id = await _permisoBP.Crear(permiso);
                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { id },
                    new { id, mensaje = "Permiso creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Actualiza un permiso existente
        /// </summary>
        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PermisoBE permiso)
        {
            try
            {
                permiso.Perm_Id = id;
                var resultado = await _permisoBP.Actualizar(permiso);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Permiso no encontrado" });
                }

                return Ok(new { mensaje = "Permiso actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Elimina un permiso (baja lógica)
        /// </summary>
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var resultado = await _permisoBP.Eliminar(id);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Permiso no encontrado" });
                }

                return Ok(new { mensaje = "Permiso eliminado exitosamente" });
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
                var resultado = await _permisoBP.ActivarPermiso(id);
                if (!resultado)
                    return NotFound(new { mensaje = "Permiso no encontrado" });

                return Ok(new { mensaje = "Permiso activado exitosamente" });
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