namespace WebServiceBackEnd.BE.CG
{
    public class AreaBE
    {
        public int Area_Id { get; set; }
        public int Depa_Id { get; set; }
        public string? Area_Clave { get; set; }
        public string? Area_Nombre { get; set; }
        public bool Area_Estatus { get; set; }
        public string? Area_CreadoPor { get; set; }
        public DateTime? Area_CreadoFecha { get; set; }
        public string? Area_ModificadoPor { get; set; }
        public DateTime? Area_ModificadoFecha { get; set; }
        // Propiedades auxiliares para operaciones
        public int? Accion { get; set; }
        public bool Area_FiltroEstatus { get; set; }
    }
}
