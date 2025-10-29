using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.BE
{
    public class EmpresaBE
    {
        public int Empr_Id { get; set; }
        public string? Empr_Clave { get; set; }
        public string? Empr_Nombre { get; set; }
        public string? Empr_PermisoGenerado { get; set; }
        public bool Empr_Estatus { get; set; }
        public string? Empr_CreadoPor { get; set; }
        public DateTime? Empr_CreadoFecha { get; set; }
        public string? Empr_ModificadoPor { get; set; }
        public DateTime? Empr_ModificadoFecha { get; set; }

        // Propiedades auxiliares para operaciones
        public int? Accion { get; set; }
        public bool Empr_FiltroEstatus { get; set; }

    }
}
