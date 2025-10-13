using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebServiceBackEnd.BE.CU
{
    public class UsuarioBE
    {
        public int Usua_Id { get; set; }
        public string Usua_Nombre { get; set; }
        public string Usua_Usuario { get; set; }
        public string Usua_Correo { get; set; }
        public string? Usua_Telefono { get; set; }
        public string Usua_Contrasena { get; set; }
        public bool Usua_Estatus { get; set; }
        public string? Usua_CreadoPor { get; set; }
        public DateTime? Usua_CreadoFecha { get; set; }
        public string? Usua_ModificadoPor { get; set; }
        public DateTime? Usua_ModificadoFecha { get; set; }

        // Para el login/JWT
        public string? Token { get; set; }
        public List<PerfilBE>? Perfiles { get; set; }

        public int? Accion { get; set; } 
        public bool Usua_FiltroEstatus { get; set; } 
    }

    public class LoginRequestBE
    {
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class LoginResponseBE
    {
        public bool Exito { get; set; }
        public string? Mensaje { get; set; }
        public string? Token { get; set; }
        public UsuarioBE? Usuario { get; set; }
    }

}
