using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.BP.CU;

namespace WebServiceBackEnd.Controllers.CU
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PerfilesController : ControllerBase
    {
        private readonly PerfilBP _perfilBP;

        public PerfilesController(PerfilBP perfilBP)
        {
            _perfilBP = perfilBP;
        }

        [HttpGet("listar")]
        public async Task<ActionResult<List<PerfilBE>>> ObtenerTodos()
        {
            try
            {
                var perfiles = await _perfilBP.ObtenerTodosPerfiles();
                return Ok(perfiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        [HttpGet("obtener/{id}")]
        public async Task<ActionResult<PerfilBE>> ObtenerPorId(int id)
        {
            try
            {
                var perfil = await _perfilBP.ObtenerPerfilPorId(id);
                if (perfil == null)
                    return NotFound(new { mensaje = "Perfil no encontrado" });

                return Ok(perfil);
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

        [HttpGet("obtener/{id}/permisosPerfil")]
        public async Task<ActionResult<List<PermisoBE>>> ObtenerPermisos(int id)
        {
            try
            {
                var permisos = await _perfilBP.ObtenerPermisosPorPerfil(id);
                return Ok(permisos);
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

        [HttpPost("crear")]
        public async Task<ActionResult<int>> Crear([FromBody] PerfilBE perfil)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _perfilBP.CrearPerfil(perfil);
                return CreatedAtAction(nameof(ObtenerPorId), new { id }, id);
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

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PerfilBE perfil)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id != perfil.Perf_Id)
                    return BadRequest(new { mensaje = "El ID en la URL no coincide con el del perfil" });

                var resultado = await _perfilBP.ActualizarPerfil(perfil);
                if (!resultado)
                    return NotFound(new { mensaje = "Perfil no encontrado" });

                return Ok(new { mensaje = "Permiso actualizado exitosamente" });
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

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var resultado = await _perfilBP.EliminarPerfil(id);
                if (!resultado)
                    return NotFound(new { mensaje = "Perfil no encontrado" });

                return Ok(new { mensaje = "Permiso eliminado exitosamente" });
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

        [HttpPost("asignar/{perfilId}/permisos/{permisoId}")]
        public async Task<IActionResult> AsignarPermiso(int perfilId, int permisoId)
        {
            try
            {
                var usuario = User.Identity?.Name ?? "Sistema";
                var resultado = await _perfilBP.AsignarPermisoAPerfil(perfilId, permisoId, usuario);

                if (!resultado)
                    return BadRequest(new { mensaje = "No se pudo asignar el permiso" });

                return Ok(new { mensaje = "Permiso asignado exitosamente" });
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

        [HttpDelete("quitar/{perfilId}/permisos/{permisoId}")]
        public async Task<IActionResult> RemoverPermiso(int perfilId, int permisoId)
        {
            try
            {
                var resultado = await _perfilBP.RemoverPermisoAPerfil(perfilId, permisoId);
                if (!resultado)
                    return NotFound(new { mensaje = "Permiso no encontrado en el perfil" });

                return Ok(new { mensaje = "Permiso removido exitosamente" });
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

        [HttpPost("filtro")]
        public async Task<ActionResult<List<PerfilBE>>> filtros([FromBody] PerfilBE filtros)
        {
            try
            {
                var perfiles = await _perfilBP.ListarConFiltros(filtros);
                return Ok(perfiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });

            }
        }
    }
}