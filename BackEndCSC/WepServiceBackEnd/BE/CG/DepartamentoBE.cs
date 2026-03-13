namespace WebServiceBackEnd.BE.CG
{
    public class DepartamentoBE
    {
        
            public int Depa_Id { get; set; }
            public int Empr_Id { get; set; }
            public string? Depa_Clave { get; set; }
            public string? Depa_Nombre { get; set; }
            public bool Depa_Estatus { get; set; }
            public string? Depa_CreadoPor { get; set; }
            public DateTime? Depa_CreadoFecha { get; set; }
            public string? Depa_ModificadoPor { get; set; }
            public DateTime? Depa_ModificadoFecha { get; set; }
            // Propiedades auxiliares para operaciones
            public int? Accion { get; set; }
            public bool Depa_FiltroEstatus { get; set; }
        
    }
}
