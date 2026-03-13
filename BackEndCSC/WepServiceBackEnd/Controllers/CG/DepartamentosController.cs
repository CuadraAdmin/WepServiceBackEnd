
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.BE.CG;
using WebServiceBackEnd.BP.CG;
using WebServiceBackEnd.DA.CG;

namespace WebServiceBackEnd.Controllers.CG
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartamentosController : ControllerBase
    {
        private readonly DepartamentoBP _DepartamentoBP;

        public DepartamentosController(IConfiguration configuration)
        {
            _DepartamentoBP = new DepartamentoBP(configuration);
        }

        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var resultado = await _DepartamentoBP.Listar();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }

        }

        [HttpGet("obtener/{depaId}")]
        public async Task<IActionResult> ObtenerPorId(int depaId)
        {
            try
            {
                var resultado = await _DepartamentoBP.ObtenerPorId(depaId);
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
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
         
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] DepartamentoBE Departamento)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _DepartamentoBP.Crear(Departamento);

                //return Ok("Departamento creado satisfactoriamente" + resultado);
                return CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id, mensaje = "Marca creada exitosamente" });
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

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] DepartamentoBE Departamento)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                if (id != Departamento.Depa_Id)
                    return BadRequest(new { mensaje = "El Id en la URL no coincide con del departamento" });

                var depaAnterior = await _DepartamentoBP.ObtenerPorId(id);
                if (depaAnterior == null)
                    return NotFound("Departamento no encontrado");

                string nombreDepartamentoAnterior = depaAnterior.Depa_Nombre;
                bool cambionombre = depaAnterior.Depa_Nombre != Departamento.Depa_Nombre;
                var resultado = await _DepartamentoBP.Actualizar(Departamento);

                //var resultado = await _DepartamentoBP.Actualizar(id, Departamento);
                if (!resultado)
                    return NotFound("Departamento no encontrado");
                return Ok("Departamento actualizado satisfactoriamente");
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
                var useario = User.Identity?.Name ?? "Sistemas";

                var resultado = await _DepartamentoBP.Eliminar(id, useario);
                if (!resultado)
                    return NotFound("Departamento no encontrado");

                return Ok("Departamento eliminado satisfactoriamente");
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
                var useario = User.Identity?.Name ?? "Sistemas";
                var resultado = await _DepartamentoBP.Activar(id, useario);
                if (!resultado)
                    return NotFound("Departamento no encontrado");

                return Ok("Departamento activado satisfactoriamente");
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
        public async Task<IActionResult> Filtrar([FromBody] DepartamentoBE filtro)
        {
            try
            {
                var resultado = await _DepartamentoBP.ListarConFiltros(filtro);
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
