namespace WebServiceBackEnd.BE.CU
{
    public class PermisoBE
    {
        public int Perm_Id { get; set; }
        public string Perm_Nombre { get; set; }
        public string Perm_Actividad { get; set; }
        public string? Perm_Descripcion { get; set; }
        public bool Perm_Estatus { get; set; }
        public string? Perm_CreadoPor { get; set; }
        public DateTime? Perm_CreadoFecha { get; set; }
        public string? Perm_ModificadoPor { get; set; }
        public DateTime? Perm_ModificadoFecha { get; set; }


        public int? Accion { get; set; }
        public bool Perm_FiltroEstatus { get; set; }
    }
}
