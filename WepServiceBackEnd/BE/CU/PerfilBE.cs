namespace WebServiceBackEnd.BE.CU
{
    public class PerfilBE
    {
        public int Perf_Id { get; set; }
        public string Perf_Nombre { get; set; }
        public string? Perf_Descripcion { get; set; }
        public bool Perf_Estatus { get; set; }
        public string? Perf_CreadoPor { get; set; }
        public DateTime? Perf_CreadoFecha { get; set; }
        public string? Perf_ModificadoPor { get; set; }
        public DateTime? Perf_ModificadoFecha { get; set; }

        public List<PermisoBE>? Permisos { get; set; }

        public int? Accion {get; set;}
        public bool Perf_FiltroEstatus { get; set;}
    }
}