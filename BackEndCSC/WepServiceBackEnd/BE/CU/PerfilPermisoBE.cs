namespace WebServiceBackEnd.BE.CU
{
    public class PerfilPermisoBE
    {
        public int PePerm_Id { get; set; }
        public int PePerm_PerfId { get; set; }
        public int PePerm_PermId { get; set; }
        public bool PePerm_Estatus { get; set; }
        public string? PePerm_CreadoPor { get; set; }
        public DateTime? PePerm_CreadoFecha { get; set; }
        public string? PePerm_ModificadoPor { get; set; }
        public DateTime? PePerm_ModificadoFecha { get; set; }
    }
}
