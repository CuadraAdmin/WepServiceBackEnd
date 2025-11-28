using SendGrid;
using SendGrid.Helpers.Mail;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.Services
{
    public class NotificationService
    {
        private readonly string _sendGridApiKey;
        private readonly string _sendGridFromEmail;
        private readonly string _sendGridFromName;
        private readonly string _twilioAccountSid;
        private readonly string _twilioAuthToken;
        private readonly string _twilioWhatsAppFrom;

        public NotificationService(IConfiguration configuration)
        {
            _sendGridApiKey = configuration["SendGrid:ApiKey"] ?? "";
            _sendGridFromEmail = configuration["SendGrid:FromEmail"] ?? "";
            _sendGridFromName = configuration["SendGrid:FromName"] ?? "";
            _twilioAccountSid = configuration["Twilio:AccountSid"] ?? "";
            _twilioAuthToken = configuration["Twilio:AuthToken"] ?? "";
            _twilioWhatsAppFrom = configuration["Twilio:WhatsAppFrom"] ?? "";
        }

        public async Task<bool> EnviarCorreoAsync(string destinatario, string asunto, string contenidoHtml)
        {
            try
            {
                var client = new SendGridClient(_sendGridApiKey);
                var from = new EmailAddress(_sendGridFromEmail, _sendGridFromName);
                var to = new EmailAddress(destinatario);
                var msg = MailHelper.CreateSingleEmail(from, to, asunto, "", contenidoHtml);

                var response = await client.SendEmailAsync(msg);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar correo: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EnviarWhatsAppAsync(string numeroDestino, string mensaje)
        {
            try
            {
                TwilioClient.Init(_twilioAccountSid, _twilioAuthToken);

                var message = await MessageResource.CreateAsync(
                    body: mensaje,
                    from: new PhoneNumber($"whatsapp:{_twilioWhatsAppFrom}"),
                    to: new PhoneNumber($"whatsapp:{numeroDestino}")
                );

                return message.ErrorCode == null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar WhatsApp: {ex.Message}");
                return false;
            }
        }

        public string GenerarCorreoRenovacion(MarcasBE marca)
        {
            string urgencia = marca.DiasRestantes switch
            {
                30 => "1 mes",
                15 => "15 días",
                1 => "1 día",
                _ => $"{marca.DiasRestantes} días"
            };

            string colorAlerta = marca.DiasRestantes switch
            {
                1 => "#dc3545",
                15 => "#ffc107",
                30 => "#0d6efd",
                _ => "#ffc107"
            };

            string htmlTareas = "";
            if (marca.Tareas != null && marca.Tareas.Any())
            {
                htmlTareas = @"
        <div class='tareas'>
            <h3>Acciones:</h3>
            <ul>";

                foreach (var tarea in marca.Tareas)
                {
                    htmlTareas += $"<li>{tarea}</li>";
                }

                htmlTareas += "</ul></div>";
            }

            string fechaRenovacion = marca.Marc_Renovacion.HasValue
                ? marca.Marc_Renovacion.Value.ToString("dd/MM/yyyy")
                : "No especificada";

            string fechaAviso = marca.Marc_FechaAviso.HasValue
                ? marca.Marc_FechaAviso.Value.ToString("dd/MM/yyyy")
                : "No especificada";

            return $@"
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #6b5345 0%, #8b6f47 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .alert {{ background: #fff3cd; border-left: 4px solid {colorAlerta}; padding: 15px; margin: 20px 0; }}
                .info-marca {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .info-marca p {{ margin: 10px 0; }}
                .info-marca strong {{ color: #6b5345; }}
                .tareas {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .tareas h3 {{ color: #6b5345; margin-top: 0; }}
                .tareas ul {{ margin: 10px 0; padding-left: 20px; }}
                .tareas li {{ margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                .urgente {{ color: {colorAlerta}; font-weight: bold; font-size: 18px; }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Notificación de Marca</h2>
                </div>
                <div class='content'>
                    
                    
                    <div class='info-marca'>
                        <h3>📊 Información de la Marca</h3>
                        <p><strong>🏢 Empresa:</strong> {marca.objEmpresaBE?.Empr_Clave} - {marca.objEmpresaBE?.Empr_Nombre}</p>
                        <p><strong>🏷️ Marca:</strong> {marca.Marc_Marca}</p>
                        <p><strong>📄 Registro:</strong> {marca.Marc_Registro}</p>
                        <p><strong>📅 Fecha de Renovación:</strong> {fechaRenovacion}</p>
                        <p><strong>🔔 Fecha de Aviso:</strong> {fechaAviso}</p>
                        <p><strong>⏳ Días restantes:</strong> {marca.DiasRestantes} días</p>
                    </div>
                    
                    {htmlTareas}
                    
                    <p style='margin-top: 20px; color: #666;'>Por favor, tome las acciones necesarias para renovar la marca antes de la fecha límite.</p>
                </div>
                <div class='footer'>
                    <p>Sistema de Gestión de Marcas - CSC</p>
                    <p>Este es un mensaje automático, no responder.</p>
                </div>
            </div>
        </body>
        </html>
    ";
        }

        public string GenerarMensajeWhatsApp(MarcasBE marca)
        {
            string urgencia = marca.DiasRestantes switch
            {
                30 => "1 mes",
                15 => "15 días",
                1 => "1 día",
                _ => $"{marca.DiasRestantes} días"
            };

            string fechaRenovacion = marca.Marc_Renovacion.HasValue
                ? marca.Marc_Renovacion.Value.ToString("dd/MM/yyyy")
                : "No especificada";

            string fechaAviso = marca.Marc_FechaAviso.HasValue
                ? marca.Marc_FechaAviso.Value.ToString("dd/MM/yyyy")
                : "No especificada";

            string mensaje = $@"⚠️ *NOTIFICACIÓN DE MARCA*

🏢 *Empresa:* {marca.objEmpresaBE?.Empr_Clave} - {marca.objEmpresaBE?.Empr_Nombre}
🏷️ *Marca:* {marca.Marc_Marca}
📄 *Registro:* {marca.Marc_Registro}
📅 *Fecha de Renovación:* {fechaRenovacion}
🔔 *Fecha de Aviso:* {fechaAviso}
⏰ *Tiempo restante:* {urgencia}";

            if (marca.Tareas != null && marca.Tareas.Any())
            {
                mensaje += "\n\n*Acciones:*";
                foreach (var tarea in marca.Tareas)
                {
                    mensaje += $"\n• {tarea}";
                }
            }

            mensaje += "\n\n_Sistema de Gestión de Marcas - CSC_";

            return mensaje;
        }
    }
}