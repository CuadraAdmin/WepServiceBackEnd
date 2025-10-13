using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.DA;
using WebServiceBackEnd.DA.CU;

namespace WebServiceBackEnd.BP.CU
{
    public class UsuarioBP
    {
        private readonly UsuarioDA _usuarioDA;
        private readonly IConfiguration _configuration;

        public UsuarioBP(UsuarioDA usuarioDA, IConfiguration configuration)
        {
            _usuarioDA = usuarioDA;
            _configuration = configuration;
        }

        public async Task<LoginResponseBE> Login(LoginRequestBE request)
        {
            try
            {
                // Validar credenciales (ahora con BCrypt)
                var usuario = await _usuarioDA.ValidarCredenciales(request.Usuario, request.Contrasena);

                if (usuario == null)
                {
                    return new LoginResponseBE
                    {
                        Exito = false,
                        Mensaje = "Usuario o contraseña incorrectos"
                    };
                }

                var perfiles = await _usuarioDA.ObtenerPerfilesUsuario(usuario.Usua_Id);
                usuario.Perfiles = perfiles;

                var permisos = await _usuarioDA.ObtenerPermisosUsuario(usuario.Usua_Id);

                var token = GenerarTokenJWT(usuario, permisos);
                //usuario.Token = token;

                return new LoginResponseBE
                {
                    Exito = true,
                    Mensaje = "Login exitoso",
                    Token = token,
                    Usuario = usuario
                };
            }
            catch (Exception ex)
            {
                return new LoginResponseBE
                {
                    Exito = false,
                    Mensaje = $"Error en el login: {ex.Message}"
                };
            }
        }

        private string GenerarTokenJWT(UsuarioBE usuario, List<PermisoBE> permisos)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Usua_Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Usua_Usuario),
                new Claim(ClaimTypes.Email, usuario.Usua_Correo),
                new Claim("Nombre", usuario.Usua_Nombre)
            };

            if (usuario.Perfiles != null)
            {
                foreach (var perfil in usuario.Perfiles)
                {
                    claims.Add(new Claim("Perfil", perfil.Perf_Nombre));
                }
            }

            foreach (var permiso in permisos)
            {
                claims.Add(new Claim("Permiso", $"{permiso.Perm_Nombre}:{permiso.Perm_Actividad}"));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiracion = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expiracion,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<List<UsuarioBE>> Listar()
        {
            return await _usuarioDA.Listar();
        }

        public async Task<UsuarioBE?> ObtenerPorId(int id)
        {
            var usuario = await _usuarioDA.ObtenerPorId(id);
            if (usuario != null)
            {
                usuario.Perfiles = await _usuarioDA.ObtenerPerfilesUsuario(id);
            }
            return usuario;
        }

        public async Task<int> Crear(UsuarioBE usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Usua_Nombre))
            {
                throw new Exception("El nombre es requerido");
            }

            if (string.IsNullOrWhiteSpace(usuario.Usua_Usuario))
            {
                throw new Exception("El usuario es requerido");
            }

            if (string.IsNullOrWhiteSpace(usuario.Usua_Contrasena))
            {
                throw new Exception("La contraseña es requerida");
            }

            usuario.Usua_Contrasena = PasswordHelper.HashPassword(usuario.Usua_Contrasena);

            return await _usuarioDA.Crear(usuario);
        }

        public async Task<bool> Actualizar(UsuarioBE usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Usua_Nombre))
            {
                throw new Exception("El nombre es requerido");
            }

            if (string.IsNullOrWhiteSpace(usuario.Usua_Usuario))
            {
                throw new Exception("El usuario es requerido");
            }

            return await _usuarioDA.Actualizar(usuario);
        }

        public async Task<bool> CambiarContrasena(int usuarioId, string contrasenaActual, string contrasenaNueva)
        {
            var usuario = await _usuarioDA.ObtenerPorId(usuarioId);
            if (usuario == null)
            {
                throw new Exception("Usuario no encontrado");
            }

            var usuarioValidado = await _usuarioDA.ValidarCredenciales(usuario.Usua_Usuario, contrasenaActual);
            if (usuarioValidado == null)
            {
                throw new Exception("Contraseña actual incorrecta");
            }

            string nuevaContrasenaHash = PasswordHelper.HashPassword(contrasenaNueva);

            return await _usuarioDA.ActualizarContrasena(usuarioId, nuevaContrasenaHash);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _usuarioDA.Eliminar(id);
        }

        public async Task<bool> AsignarPerfil(int usuarioId, int perfilId, string creadoPor)
        {
            return await _usuarioDA.AsignarPerfilAUsuario(usuarioId, perfilId, creadoPor);
        }

        public async Task<bool> RemoverPerfil(int usuarioId, int perfilId)
        {
            return await _usuarioDA.RemoverPerfilAUsuario(usuarioId, perfilId);
        }

        public async Task<List<PerfilBE>> ObtenerPerfiles(int usuarioId)
        {
            return await _usuarioDA.ObtenerPerfilesUsuario(usuarioId);
        }

        public async Task<List<PermisoBE>> ObtenerPermisos(int usuarioId)
        {
            return await _usuarioDA.ObtenerPermisosUsuario(usuarioId);
        }

        public async Task<List<dynamic>> ListarConFiltros(UsuarioBE filtros)
        {
            try
            {
                return await _usuarioDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {

                throw new Exception($"Error al obtener los usuarios: {ex.Message}");
            }
        }
    }
}