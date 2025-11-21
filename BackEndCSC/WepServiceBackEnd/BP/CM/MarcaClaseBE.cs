namespace WebServiceBackEnd.BP.CM
{
    public class MarcaClaseBE
    {
        public int MarcClas_Id { get; set; }
        public string? MarcClas_Clave { get; set; }
        public string? MarcClas_Descripcion { get; set; }
        public bool MarcClas_Estatus { get; set; }
        public string? MarcClas_CreadoPor { get; set; }
        public DateTime? MarcClas_CreadoFecha { get; set; }
        public string? MarcClas_ModificadoPor { get; set; }
        public DateTime? MarcClas_ModificadoFecha { get; set; }


        // Filtros
        public int? Accion { get; set; }
        public bool MarcClas_FiltroEstatus { get; set; }
    }
}
