using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.BP;
using WebServiceBackEnd.BP.CU;

namespace WebServiceBackEnd.Controllers.CU
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioBP _usuarioBP;

        public UsuariosController(UsuarioBP usuarioBP)
        {
            _usuarioBP = usuarioBP;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestBE request)
        {
            try
            {
                var response = await _usuarioBP.Login(request);

                if (!response.Exito)
                {
                    return Unauthorized(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error en el servidor: {ex.Message}" });
            }
        }

        [HttpPut("cambiar-contrasena/{usuarioId}")]
        [Authorize]
        public async Task<IActionResult> CambiarContrasena(int usuarioId, [FromBody] CambiarContrasenaRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.ContrasenaActual) || string.IsNullOrEmpty(request.ContrasenaNueva))
                {
                    return BadRequest(new { mensaje = "Las contraseñas son requeridas" });
                }

                var resultado = await _usuarioBP.CambiarContrasena(usuarioId, request.ContrasenaActual, request.ContrasenaNueva);

                if (!resultado)
                {
                    return BadRequest(new { mensaje = "No se pudo cambiar la contraseña" });
                }

                return Ok(new { mensaje = "Contraseña actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpGet("Listar")]
        [Authorize]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var usuarios = await _usuarioBP.Listar();
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("Obtener/{id}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var usuario = await _usuarioBP.ObtenerPorId(id);

                if (usuario == null)
                {
                    return NotFound(new { mensaje = "Usuario no encontrado" });
                }

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("Agregar")]
        [Authorize]
        public async Task<IActionResult> Crear([FromBody] UsuarioBE usuario)
        {
            try
            {
                var id = await _usuarioBP.Crear(usuario);
                return CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id, mensaje = "Usuario creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("actualizar/{id}")]
        [Authorize]
        public async Task<IActionResult> Actualizar(int id, [FromBody] UsuarioBE usuario)
        {
            try
            {
                usuario.Usua_Id = id;
                var resultado = await _usuarioBP.Actualizar(usuario);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Usuario no encontrado" });
                }

                return Ok(new { mensaje = "Usuario actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("eliminar/{id}")]
        [Authorize]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var resultado = await _usuarioBP.Eliminar(id);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Usuario no encontrado" });
                }

                return Ok(new { mensaje = "Usuario eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPatch("activar/{id}")]
        [Authorize]
        public async Task<IActionResult> Activar(int id)
        {
            try
            {
                var resultado = await _usuarioBP.ActivarUsuario(id);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Usuario no encontrado" });
                }

                return Ok(new { mensaje = "Usuario activado exitosamente" });
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

        [HttpPost("asignar/{usuarioId}/perfiles/{perfilId}")]
        [Authorize]
        public async Task<IActionResult> AsignarPerfil(int usuarioId, int perfilId, [FromBody] string creadoPor)
        {
            try
            {
                var resultado = await _usuarioBP.AsignarPerfil(usuarioId, perfilId, creadoPor);
                return Ok(new { mensaje = "Perfil asignado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("quitar/{usuarioId}/perfiles/{perfilId}")]
        [Authorize]
        public async Task<IActionResult> RemoverPerfil(int usuarioId, int perfilId)
        {
            try
            {
                var resultado = await _usuarioBP.RemoverPerfil(usuarioId, perfilId);

                if (!resultado)
                {
                    return NotFound(new { mensaje = "Relación no encontrada" });
                }

                return Ok(new { mensaje = "Perfil removido exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("obtener/{usuarioId}/perfilesUsuario")]
        [Authorize]
        public async Task<IActionResult> ObtenerPerfiles(int usuarioId)
        {
            try
            {
                var perfiles = await _usuarioBP.ObtenerPerfiles(usuarioId);
                return Ok(perfiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("obtener/{usuarioId}/permisos")]
        [Authorize]
        public async Task<IActionResult> ObtenerPermisos(int usuarioId)
        {
            try
            {
                var permisos = await _usuarioBP.ObtenerPermisos(usuarioId);
                return Ok(permisos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("ListarConFiltros")]
        [Authorize]
        public async Task<IActionResult> ListarConFiltros([FromBody] UsuarioBE filtros)
        {
            try
            {
                var usuarios = await _usuarioBP.ListarConFiltros(filtros);
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
    }
    public class CambiarContrasenaRequest
    {
        public string ContrasenaActual { get; set; }
        public string ContrasenaNueva { get; set; }
    }
}