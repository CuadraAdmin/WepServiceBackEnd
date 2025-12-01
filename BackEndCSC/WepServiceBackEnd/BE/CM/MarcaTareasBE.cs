namespace WebServiceBackEnd.BE.CM
{
    public class MarcaTareasBE
    {
        public int MarcTare_Id { get; set; }
        public int Marc_Id { get; set; }
        public string? MarcTare_Descripcion { get; set; }
        public DateTime MarcTare_FechaCreacion { get; set; }
        public string? MarcTare_CreadoPor { get; set; }
        public DateTime? MarcTare_FechaFinalizacion { get; set; }
        public DateTime? MarcTare_FechaIniciacion { get; set; }

        public bool MarcTare_Estatus { get; set; }
        public string? MarcTare_ModificadoPor { get; set; }
        public DateTime? MarcTare_ModificadoFecha { get; set; }

        public MarcasBE? objMarcasBE { get; set; }

        // Propiedades auxiliares para operaciones
        public int? Accion { get; set; }
        public bool MarcTare_FiltroEstatus { get; set; }
    }
}