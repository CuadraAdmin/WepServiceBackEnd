namespace WebServiceBackEnd.BE.CM
{
    public class ArchivoMarcaBE
    {
        public string Nombre { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string TipoArchivo { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long Tamaño { get; set; }
        public DateTime FechaSubida { get; set; }
    }
}
