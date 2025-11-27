using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.DA.CM;
using WebServiceBackEnd.Services;

namespace WebServiceBackEnd.Services
{
    public class NotificationJobService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationJobService> _logger;
        private bool _ejecucionExitosaHoy = false;

        public NotificationJobService(
            IServiceProvider serviceProvider,
            ILogger<NotificationJobService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Esperar hasta la próxima ejecución programada (10:00 AM)
            await EsperarHastaHoraProgramada(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Iniciando verificación de notificaciones...");

                    bool huboEnviosExitosos = false;

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                        var connectionString = configuration.GetConnectionString("CadenaSQL");
                        var marcaDA = new MarcasDA(configuration);
                        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();
                        var marcaNotifDA = new MarcaNotificacionDA(configuration);

                        var marcas = await marcaDA.ObtenerMarcasParaNotificacion();

                        _logger.LogInformation($"Marcas encontradas para notificar: {marcas.Count}");

                        if (marcas.Count == 0)
                        {
                            huboEnviosExitosos = true; // No hay marcas = éxito (nada que enviar)
                        }

                        foreach (var marca in marcas)
                        {
                            _logger.LogInformation($"Procesando marca: {marca.Marc_Marca} (ID: {marca.Marc_Id}) - {marca.DiasRestantes} días restantes");

                            var contactos = await marcaNotifDA.Listar(marca.Marc_Id);
                            var contactosActivos = contactos.Where(c => c.MarcNoti_Estatus).ToList();

                            _logger.LogInformation($"Contactos activos encontrados: {contactosActivos.Count}");

                            foreach (var contacto in contactosActivos)
                            {
                                bool correoExitoso = false;
                                bool whatsappExitoso = false;

                                try
                                {
                                    if (await YaSeEnvioNotificacion(connectionString, marca.Marc_Id, contacto.MarcNoti_Id, marca.TipoPeriodo))
                                    {
                                        _logger.LogInformation($"Notificación ya enviada para {contacto.MarcNoti_Nombre} - Periodo: {marca.TipoPeriodo}");
                                        huboEnviosExitosos = true; // Ya se envió = éxito
                                        continue;
                                    }

                                    // Enviar correo
                                    var htmlCorreo = notificationService.GenerarCorreoRenovacion(marca);

                                    correoExitoso = await notificationService.EnviarCorreoAsync(
                                        contacto.MarcNoti_Correo,
                                        $"⚠️ Renovación de Marca - {marca.Marc_Marca}",
                                        htmlCorreo
                                    );

                                    _logger.LogInformation($"Correo enviado a {contacto.MarcNoti_Correo}: {(correoExitoso ? "EXITOSO" : "FALLIDO")}");

                                    // Enviar WhatsApp
                                    var mensajeWA = notificationService.GenerarMensajeWhatsApp(marca);

                                    whatsappExitoso = await notificationService.EnviarWhatsAppAsync(
                                        contacto.MarcNoti_TelefonoWhatsApp,
                                        mensajeWA
                                    );

                                    _logger.LogInformation($"WhatsApp enviado a {contacto.MarcNoti_TelefonoWhatsApp}: {(whatsappExitoso ? "EXITOSO" : "FALLIDO")}");

                                    // Si al menos uno fue exitoso, marcamos como éxito
                                    if (correoExitoso || whatsappExitoso)
                                    {
                                        huboEnviosExitosos = true;
                                    }

                                    await RegistrarNotificacionLog(connectionString, marca.Marc_Id, contacto.MarcNoti_Id, "Correo", marca.TipoPeriodo, correoExitoso, null);
                                    await RegistrarNotificacionLog(connectionString, marca.Marc_Id, contacto.MarcNoti_Id, "WhatsApp", marca.TipoPeriodo, whatsappExitoso, null);
                                }
                                catch (Exception exContacto)
                                {
                                    _logger.LogError($"Error enviando notificación a {contacto.MarcNoti_Nombre}: {exContacto.Message}");
                                    await RegistrarNotificacionLog(connectionString, marca.Marc_Id, contacto.MarcNoti_Id, "Correo", marca.TipoPeriodo, false, exContacto.Message);
                                }
                            }
                        }
                    }

                    // Decidir siguiente ejecución
                    if (huboEnviosExitosos)
                    {
                        _ejecucionExitosaHoy = true;
                        _logger.LogInformation($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Verificación completada exitosamente. Próxima ejecución mañana a las 10:00 AM.");
                        await EsperarHastaHoraProgramada(stoppingToken);
                    }
                    else
                    {
                        _logger.LogWarning($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] No se pudieron enviar todas las notificaciones. Reintentando en 1 hora...");
                        await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"ERROR CRÍTICO en job de notificaciones: {ex.Message}\n{ex.StackTrace}");
                    _logger.LogInformation("Reintentando en 1 hora...");
                    await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                }
            }
        }

        private async Task EsperarHastaHoraProgramada(CancellationToken stoppingToken)
        {
            var ahora = DateTime.Now;
            var proximaEjecucion = new DateTime(ahora.Year, ahora.Month, ahora.Day, 10, 0, 0); // 10:00 AM

            // Si ya pasó las 10:00 AM de hoy, programar para mañana
            if (ahora >= proximaEjecucion)
            {
                proximaEjecucion = proximaEjecucion.AddDays(1);
            }

            // Resetear flag cuando cambie el día
            _ejecucionExitosaHoy = false;

            var tiempoEspera = proximaEjecucion - ahora;

            _logger.LogInformation($"Próxima ejecución programada para: {proximaEjecucion:yyyy-MM-dd HH:mm:ss} (en {tiempoEspera.TotalHours:F2} horas)");

            await Task.Delay(tiempoEspera, stoppingToken);
        }

        private async Task<bool> YaSeEnvioNotificacion(string connectionString, int marcaId, int contactoId, string tipoPeriodo)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                await conn.OpenAsync();
                SqlCommand cmd = new SqlCommand(@"
                    SELECT COUNT(*) 
                    FROM cm.MarcaNotificacionLog 
                    WHERE Marc_Id = @Marc_Id 
                        AND MarcNoti_Id = @MarcNoti_Id 
                        AND MarcNotiLog_TipoPeriodo = @TipoPeriodo
                        AND MarcNotiLog_Exitoso = 1
                        AND CAST(MarcNotiLog_FechaEnvio AS DATE) = CAST(GETDATE() AS DATE)", conn);

                cmd.Parameters.AddWithValue("@Marc_Id", marcaId);
                cmd.Parameters.AddWithValue("@MarcNoti_Id", contactoId);
                cmd.Parameters.AddWithValue("@TipoPeriodo", tipoPeriodo);

                int count = (int)await cmd.ExecuteScalarAsync();
                return count > 0;
            }
        }

        private async Task RegistrarNotificacionLog(string connectionString, int marcaId, int contactoId, string tipoNotificacion, string tipoPeriodo, bool exitoso, string? mensajeError)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                await conn.OpenAsync();
                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO cm.MarcaNotificacionLog (Marc_Id, MarcNoti_Id, MarcNotiLog_TipoNotificacion, MarcNotiLog_TipoPeriodo, MarcNotiLog_FechaEnvio, MarcNotiLog_Exitoso, MarcNotiLog_MensajeError)
                    VALUES (@Marc_Id, @MarcNoti_Id, @TipoNotificacion, @TipoPeriodo, GETDATE(), @Exitoso, @MensajeError)", conn);

                cmd.Parameters.AddWithValue("@Marc_Id", marcaId);
                cmd.Parameters.AddWithValue("@MarcNoti_Id", contactoId);
                cmd.Parameters.AddWithValue("@TipoNotificacion", tipoNotificacion);
                cmd.Parameters.AddWithValue("@TipoPeriodo", tipoPeriodo);
                cmd.Parameters.AddWithValue("@Exitoso", exitoso);
                cmd.Parameters.AddWithValue("@MensajeError", (object?)mensajeError ?? DBNull.Value);

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}