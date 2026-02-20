namespace WebServiceBackEnd.BE.CM.CM_TipoMarca
{
    public class TipoMarcaBE
    {
        public int TipoMar_Id { get; set; }
        public string TipoMar_Nombre { get; set; }
        public bool TipoMar_Estatus { get; set; }
        public string? TipoMar_CreadoPor { get; set; }
        public DateTime? TipoMar_CreadoFecha { get; set; }
        public string? TipoMar_ModificadoPor { get; set; }
        public DateTime? TipoMar_ModificadoFecha { get; set; }

        
        public int? Accion { get; set; }
        public bool TipoMar_FiltroEstatus { get; set; }
    }
}
