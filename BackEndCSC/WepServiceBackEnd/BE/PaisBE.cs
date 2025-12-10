namespace WebServiceBackEnd.BE
{
    public class PaisBE
    {
        public int Pais_Id { get; set; }
        public string? Pais_Clave { get; set; }
        public string? Pais_Nombre { get; set; }
        public bool Pais_Estatus { get; set; }
        public string? Pais_CreadoPor { get; set; }
        public DateTime? Pais_CreadoFecha { get; set; }
        public string? Pais_ModificadoPor { get; set; }
        public DateTime? Pais_ModificadoFecha { get; set; }

        // Para filtros
        public int? Accion { get; set; }
        public bool Pais_FiltroEstatus { get; set; }
    }
}
