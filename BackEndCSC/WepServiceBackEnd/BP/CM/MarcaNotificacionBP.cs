using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.BP.CM
{
    public class MarcaNotificacionBP
    {
        private readonly MarcaNotificacionDA _marcaNotificacionDA;

        public MarcaNotificacionBP(IConfiguration configuration)
        {
            _marcaNotificacionDA = new MarcaNotificacionDA(configuration);
        }

        public async Task<List<MarcaNotificacionBE>> Listar(int marcaId = 0)
        {
            return await _marcaNotificacionDA.Listar(marcaId);
        }

        public async Task<int> Crear(MarcaNotificacionBE notificacion)
        {
            try
            {
                if (notificacion == null)
                    throw new ArgumentException("Los datos de la notificación son requeridos");

                if (notificacion.Marc_Id <= 0)
                    throw new ArgumentException("El ID de marca es obligatorio");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_Nombre))
                    throw new ArgumentException("El nombre es obligatorio");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_Correo))
                    throw new ArgumentException("El correo es obligatorio");

                // Validar formato de correo
                if (!IsValidEmail(notificacion.MarcNoti_Correo))
                    throw new ArgumentException("El formato del correo no es válido");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_TelefonoWhatsApp))
                    throw new ArgumentException("El teléfono de WhatsApp es obligatorio");

                // Validar formato de teléfono (debe tener al menos 10 dígitos)
                string telefonoLimpio = new string(notificacion.MarcNoti_TelefonoWhatsApp.Where(char.IsDigit).ToArray());
                if (telefonoLimpio.Length < 10)
                    throw new ArgumentException("El teléfono debe tener al menos 10 dígitos");

                return await _marcaNotificacionDA.Crear(notificacion);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al crear notificación: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(MarcaNotificacionBE notificacion)
        {
            try
            {
                if (notificacion == null)
                    throw new ArgumentException("Los datos de la notificación son requeridos");

                if (notificacion.MarcNoti_Id <= 0)
                    throw new ArgumentException("El ID de la notificación es obligatorio");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_Nombre))
                    throw new ArgumentException("El nombre es obligatorio");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_Correo))
                    throw new ArgumentException("El correo es obligatorio");

                // Validar formato de correo
                if (!IsValidEmail(notificacion.MarcNoti_Correo))
                    throw new ArgumentException("El formato del correo no es válido");

                if (string.IsNullOrWhiteSpace(notificacion.MarcNoti_TelefonoWhatsApp))
                    throw new ArgumentException("El teléfono de WhatsApp es obligatorio");

                // Validar formato de teléfono
                string telefonoLimpio = new string(notificacion.MarcNoti_TelefonoWhatsApp.Where(char.IsDigit).ToArray());
                if (telefonoLimpio.Length < 10)
                    throw new ArgumentException("El teléfono debe tener al menos 10 dígitos");

                return await _marcaNotificacionDA.Actualizar(notificacion);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al actualizar notificación: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id, string modificadoPor = "Sistema")
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID del contacto es inválido");

                if (string.IsNullOrEmpty(modificadoPor))
                    modificadoPor = "Sistema";

                return await _marcaNotificacionDA.Eliminar(id, modificadoPor);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al eliminar: {ex.Message}");
            }
        }

        /// <summary>
        /// Valida si un correo electrónico tiene formato válido
        /// </summary>
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}