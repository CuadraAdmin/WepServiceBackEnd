namespace WebServiceBackEnd.BE.CU
{
    public class UsuarioPerfilBE
    {
        public int UsPerf_Id { get; set; }
        public int UsPerf_UsuaId { get; set; }
        public int UsPerf_PerfId { get; set; }
        public bool UsPerf_Estatus { get; set; }
        public string? UsPerf_CreadoPor { get; set; }
        public DateTime? UsPerf_CreadoFecha { get; set; }
        public string? UsPerf_ModificadoPor { get; set; }
        public DateTime? UsPerf_ModificadoFecha { get; set; }
    }
}
