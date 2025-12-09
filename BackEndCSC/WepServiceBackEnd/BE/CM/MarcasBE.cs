namespace WebServiceBackEnd.BE.CM
{
    public class MarcasBE
    {
        public int Marc_Id { get; set; }
        public int Empr_Id { get; set; }
        public string? Marc_Consecutivo { get; set; }
        public string? Marc_Pais { get; set; }
        public string? Marc_SolicitudNacional { get; set; }
        public string? Marc_Registro { get; set; }
        public string? Marc_Marca { get; set; }
        public string? Marc_Diseno { get; set; }
        public string? Marc_Clase { get; set; }
        public string? Marc_Titular { get; set; }
        public string? Marc_licenciamiento { get; set; }
        public string? Marc_Figura { get; set; }
        public string? Marc_Titulo { get; set; }
        public string? Marc_Tipo { get; set; }
        public string? Marc_Rama { get; set; }
        public string? Marc_Autor { get; set; }
        public string? Marc_Observaciones { get; set; }
        public DateTime? Marc_FechaSolicitud { get; set; }
        public DateTime? Marc_FechaRegistro { get; set; }
        public DateTime? Marc_Dure { get; set; }
        public DateTime? Marc_Renovacion { get; set; }
        public DateTime? Marc_Oposicion { get; set; }
        public string? Marc_ProximaTarea { get; set; }
        public DateTime? Marc_FechaSeguimiento { get; set; }
        public DateTime? Marc_FechaAviso { get; set; }
        public bool Marc_Estatus { get; set; }
        public string? Marc_CreadoPor { get; set; }
        public DateTime? Marc_CreadoFecha { get; set; }
        public string? Marc_ModificadoPor { get; set; }
        public DateTime? Marc_ModificadoFecha { get; set; }


        public EmpresaBE? objEmpresaBE { get; set; }

        // Propiedades auxiliares para operaciones
        public int? Accion { get; set; }
        public bool Marc_FiltroEstatus { get; set; }

        //para notificacion
        public int DiasRestantes { get; set; }
        public string? TipoPeriodo { get; set; }
        public List<string> Tareas { get; set; } = new List<string>(); 

    }
}
