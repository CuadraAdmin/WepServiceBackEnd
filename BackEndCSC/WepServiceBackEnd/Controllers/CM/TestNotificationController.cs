using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.Services;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BE;

namespace WebServiceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestNotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public TestNotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Probar envío de correo
        /// </summary>
        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            // Crear marca de prueba
            var marcaPrueba = new MarcasBE
            {
                Marc_Id = 1,
                Marc_Marca = "Marca de Prueba",
                Marc_Registro = "REG-12345",
                DiasRestantes = 30,
                TipoPeriodo = "30dias",
                objEmpresaBE = new EmpresaBE
                {
                    Empr_Clave = "EMP-001",
                    Empr_Nombre = "Empresa de Prueba S.A. de C.V."
                },
                Tareas = new List<string>
                {
                    "Preparar documentación de renovación",
                    "Revisar estado de registro",
                    "Contactar con abogado"
                }
            };

            var html = _notificationService.GenerarCorreoRenovacion(marcaPrueba);

            var resultado = await _notificationService.EnviarCorreoAsync(
                request.Email,
                "⚠️ Prueba de Notificaciones - Sistema CSC",
                html
            );

            if (resultado)
                return Ok(new { mensaje = "Correo enviado exitosamente. Revisa tu bandeja de entrada." });
            else
                return BadRequest(new { mensaje = "Error al enviar correo. Verifica la configuración de SendGrid." });
        }

        /// <summary>
        /// Probar envío de WhatsApp (requiere Twilio configurado)
        /// </summary>
        [HttpPost("test-whatsapp")]
        public async Task<IActionResult> TestWhatsApp([FromBody] TestWhatsAppRequest request)
        {
            // Crear marca de prueba
            var marcaPrueba = new MarcasBE
            {
                Marc_Id = 1,
                Marc_Marca = "Marca de Prueba",
                Marc_Registro = "REG-12345",
                DiasRestantes = 15,
                TipoPeriodo = "15dias",
                objEmpresaBE = new EmpresaBE
                {
                    Empr_Clave = "EMP-001",
                    Empr_Nombre = "Empresa de Prueba S.A."
                },
                Tareas = new List<string>
                {
                    "Preparar documentación",
                    "Revisar registro"
                }
            };

            var mensaje = _notificationService.GenerarMensajeWhatsApp(marcaPrueba);

            var resultado = await _notificationService.EnviarWhatsAppAsync(
                request.Telefono,
                mensaje
            );

            if (resultado)
                return Ok(new { mensaje = "WhatsApp enviado exitosamente" });
            else
                return BadRequest(new { mensaje = "Error al enviar WhatsApp. Verifica la configuración de Twilio." });
        }
    }

    public class TestEmailRequest
    {
        public string Email { get; set; }
    }

    public class TestWhatsAppRequest
    {
        public string Telefono { get; set; }
    }
}