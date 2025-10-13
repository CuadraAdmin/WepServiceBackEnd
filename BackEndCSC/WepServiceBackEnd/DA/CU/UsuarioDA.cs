using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BE.CU;

namespace WebServiceBackEnd.DA.CU
{
    public class UsuarioDA
    {
        private readonly string _connectionString;

        public UsuarioDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<UsuarioBE?> ValidarCredenciales(string usuario, string contrasena)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", 3);
                    cmd.Parameters.AddWithValue("@Usua_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Usua_Id", 0);
                    cmd.Parameters.AddWithValue("@Usua_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Usuario", usuario);
                    cmd.Parameters.AddWithValue("@Usua_Correo", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            string hashedPassword = reader.GetString(reader.GetOrdinal("Usua_Contrasena"));

                            if (PasswordHelper.VerifyPassword(contrasena, hashedPassword))
                            {
                                return new UsuarioBE
                                {
                                    Usua_Id = reader.GetInt32(reader.GetOrdinal("Usua_Id")),
                                    Usua_Nombre = reader.GetString(reader.GetOrdinal("Usua_Nombre")),
                                    Usua_Usuario = reader.GetString(reader.GetOrdinal("Usua_Usuario")),
                                    Usua_Correo = reader.GetString(reader.GetOrdinal("Usua_Correo")),
                                    Usua_Telefono = reader.IsDBNull(reader.GetOrdinal("Usua_Telefono"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("Usua_Telefono")),
                                    Usua_Estatus = reader.GetBoolean(reader.GetOrdinal("Usua_Estatus"))
                                };
                            }
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al validar credenciales: {ex.Message}");
            }
        }

        public async Task<List<PerfilBE>> ObtenerPerfilesUsuario(int usuarioId)
        {
            List<PerfilBE> perfiles = new List<PerfilBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Perfiles_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            perfiles.Add(new PerfilBE
                            {
                                Perf_Id = reader.GetInt32(reader.GetOrdinal("Perf_Id")),
                                Perf_Nombre = reader.GetString(reader.GetOrdinal("Perf_Nombre")),
                                Perf_Descripcion = reader.IsDBNull(reader.GetOrdinal("Perf_Descripcion"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Perf_Descripcion")),
                                Perf_Estatus = reader.GetBoolean(reader.GetOrdinal("Perf_Estatus"))
                            });
                        }
                    }
                }
                return perfiles;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener perfiles: {ex.Message}");
            }
        }

        public async Task<List<UsuarioBE>> Listar()
        {
            List<UsuarioBE> usuarios = new List<UsuarioBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", 1); // Acción 1 = Lista completa con auditoría
                    cmd.Parameters.AddWithValue("@Usua_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Usua_Id", 0);
                    cmd.Parameters.AddWithValue("@Usua_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Usuario", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Correo", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            usuarios.Add(new UsuarioBE
                            {
                                Usua_Id = reader.GetInt32(reader.GetOrdinal("Usua_Id")),
                                Usua_Nombre = reader.GetString(reader.GetOrdinal("Usua_Nombre")),
                                Usua_Usuario = reader.GetString(reader.GetOrdinal("Usua_Usuario")),
                                Usua_Correo = reader.GetString(reader.GetOrdinal("Usua_Correo")),
                                Usua_Contrasena = reader.GetString(reader.GetOrdinal("Usua_Contrasena")),
                                Usua_Telefono = reader.IsDBNull(reader.GetOrdinal("Usua_Telefono"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_Telefono")),
                                Usua_Estatus = reader.GetBoolean(reader.GetOrdinal("Usua_Estatus")),
                                Usua_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Usua_CreadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_CreadoPor")),
                                Usua_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Usua_CreadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("Usua_CreadoFecha")),
                                Usua_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Usua_ModificadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_ModificadoPor")),
                                Usua_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Usua_ModificadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("Usua_ModificadoFecha"))
                            });
                        }
                    }
                }
                return usuarios;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar usuarios: {ex.Message}");
            }
        }

        public async Task<UsuarioBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", 2); // Acción 2 = Por ID
                    cmd.Parameters.AddWithValue("@Usua_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Usua_Id", id);
                    cmd.Parameters.AddWithValue("@Usua_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Usuario", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Correo", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new UsuarioBE
                            {
                                Usua_Id = reader.GetInt32(reader.GetOrdinal("Usua_Id")),
                                Usua_Nombre = reader.GetString(reader.GetOrdinal("Usua_Nombre")),
                                Usua_Usuario = reader.GetString(reader.GetOrdinal("Usua_Usuario")),
                                Usua_Correo = reader.GetString(reader.GetOrdinal("Usua_Correo")),
                                Usua_Contrasena = reader.GetString(reader.GetOrdinal("Usua_Contrasena")),
                                Usua_Telefono = reader.IsDBNull(reader.GetOrdinal("Usua_Telefono"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_Telefono")),
                                Usua_Estatus = reader.GetBoolean(reader.GetOrdinal("Usua_Estatus")),
                                Usua_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Usua_CreadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_CreadoPor")),
                                Usua_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Usua_CreadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("Usua_CreadoFecha")),
                                Usua_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Usua_ModificadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Usua_ModificadoPor")),
                                Usua_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Usua_ModificadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("Usua_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener usuario: {ex.Message}");
            }
        }

        public async Task<int> Crear(UsuarioBE usuario)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Nombre", usuario.Usua_Nombre);
                    cmd.Parameters.AddWithValue("@Usua_Usuario", usuario.Usua_Usuario);
                    cmd.Parameters.AddWithValue("@Usua_Correo", usuario.Usua_Correo);
                    cmd.Parameters.AddWithValue("@Usua_Telefono",
                        string.IsNullOrEmpty(usuario.Usua_Telefono) ? DBNull.Value : usuario.Usua_Telefono);
                    cmd.Parameters.AddWithValue("@Usua_Contrasena", usuario.Usua_Contrasena);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", usuario.Usua_Estatus);
                    cmd.Parameters.AddWithValue("@Usua_CreadoPor",
                        string.IsNullOrEmpty(usuario.Usua_CreadoPor) ? DBNull.Value : usuario.Usua_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@Usua_IdGenerado", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outputParam);

                    await cmd.ExecuteNonQueryAsync();

                    return Convert.ToInt32(outputParam.Value);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear usuario: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(UsuarioBE usuario)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuario.Usua_Id);
                    cmd.Parameters.AddWithValue("@Usua_Nombre", usuario.Usua_Nombre);
                    cmd.Parameters.AddWithValue("@Usua_Usuario", usuario.Usua_Usuario);
                    cmd.Parameters.AddWithValue("@Usua_Correo", usuario.Usua_Correo);
                    cmd.Parameters.AddWithValue("@Usua_Telefono",
                        string.IsNullOrEmpty(usuario.Usua_Telefono) ? DBNull.Value : usuario.Usua_Telefono);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", usuario.Usua_Estatus);
                    cmd.Parameters.AddWithValue("@Usua_ModificadoPor",
                        string.IsNullOrEmpty(usuario.Usua_ModificadoPor) ? DBNull.Value : usuario.Usua_ModificadoPor);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int filasAfectadas = reader.GetInt32(reader.GetOrdinal("FilasAfectadas"));
                            return filasAfectadas > 0;
                        }
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar usuario: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", id);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int filasAfectadas = reader.GetInt32(reader.GetOrdinal("FilasAfectadas"));
                            return filasAfectadas > 0;
                        }
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar usuario: {ex.Message}");
            }
        }

        public async Task<bool> AsignarPerfilAUsuario(int usuarioId, int perfilId, string creadoPor)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_UsuarioPerfil_Asignar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);
                    cmd.Parameters.AddWithValue("@Perf_Id", perfilId);
                    cmd.Parameters.AddWithValue("@UsuaPerf_CreadoPor", creadoPor);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int resultado = reader.GetInt32(reader.GetOrdinal("Resultado"));
                            return resultado > 0;
                        }
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al asignar perfil a usuario: {ex.Message}");
            }
        }

        public async Task<bool> RemoverPerfilAUsuario(int usuarioId, int perfilId)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_UsuarioPerfil_Remover", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);
                    cmd.Parameters.AddWithValue("@Perf_Id", perfilId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int filasAfectadas = reader.GetInt32(reader.GetOrdinal("FilasAfectadas"));
                            return filasAfectadas > 0;
                        }
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al remover perfil de usuario: {ex.Message}");
            }
        }

        public async Task<bool> ActualizarContrasena(int usuarioId, string nuevaContrasenaHash)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_ActualizarContrasena", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);
                    cmd.Parameters.AddWithValue("@Usua_Contrasena", nuevaContrasenaHash);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            int filasAfectadas = reader.GetInt32(reader.GetOrdinal("FilasAfectadas"));
                            return filasAfectadas > 0;
                        }
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar contraseña: {ex.Message}");
            }
        }

        public async Task<List<PermisoBE>> ObtenerPermisosUsuario(int usuarioId)
        {
            List<PermisoBE> permisos = new List<PermisoBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Permisos_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            permisos.Add(new PermisoBE
                            {
                                Perm_Id = reader.GetInt32(reader.GetOrdinal("Perm_Id")),
                                Perm_Nombre = reader.GetString(reader.GetOrdinal("Perm_Nombre")),
                                Perm_Actividad = reader.GetString(reader.GetOrdinal("Perm_Actividad")),
                                Perm_Descripcion = reader.IsDBNull(reader.GetOrdinal("Perm_Descripcion"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Perm_Descripcion")),
                                Perm_Estatus = reader.GetBoolean(reader.GetOrdinal("Perm_Estatus"))
                            });
                        }
                    }
                }
                return permisos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener permisos del usuario: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(UsuarioBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Usuario_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Usua_FiltroEstatus", filtros.Usua_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Usua_Id", filtros.Usua_Id);
                    cmd.Parameters.AddWithValue("@Usua_Nombre",
                        string.IsNullOrEmpty(filtros.Usua_Nombre) ? DBNull.Value : filtros.Usua_Nombre);
                    cmd.Parameters.AddWithValue("@Usua_Usuario",
                        string.IsNullOrEmpty(filtros.Usua_Usuario) ? DBNull.Value : filtros.Usua_Usuario);
                    cmd.Parameters.AddWithValue("@Usua_Correo",
                        string.IsNullOrEmpty(filtros.Usua_Correo) ? DBNull.Value : filtros.Usua_Correo);
                    cmd.Parameters.AddWithValue("@Usua_Estatus", filtros.Usua_Estatus);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }

                            lista.Add(row);
                        }
                    }
                }
                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar usuarios con filtros: {ex.Message}");
            }
        }
    }
}
