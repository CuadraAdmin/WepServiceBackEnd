namespace WebServiceBackEnd.BE.CM
{
    public class MarcaNotificacionBE
    {
        public int MarcNoti_Id { get; set; }
        public int Marc_Id { get; set; }
        public string? MarcNoti_Nombre { get; set; }
        public string? MarcNoti_Correo { get; set; }
        public string? MarcNoti_TelefonoWhatsApp { get; set; }
        public bool MarcNoti_Estatus { get; set; }
        public string? MarcNoti_CreadoPor { get; set; }
        public DateTime? MarcNoti_CreadoFecha { get; set; }
        public string? MarcNoti_ModificadoPor { get; set; }
        public DateTime? MarcNoti_ModificadoFecha { get; set; }

        
        public MarcasBE? objMarcasBE { get; set; }
    }
}