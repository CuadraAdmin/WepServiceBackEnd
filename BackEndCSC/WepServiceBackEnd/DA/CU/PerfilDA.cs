using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE.CU;

namespace WebServiceBackEnd.DA.CU
{
    public class PerfilDA
    {
        private readonly string _connectionString;

        public PerfilDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<PerfilBE>> Listar()
        {
            List<PerfilBE> perfiles = new List<PerfilBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Seleccionar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Accion", 1); 

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                perfiles.Add(new PerfilBE
                                {
                                    Perf_Id = reader.GetInt32(reader.GetOrdinal("Perf_Id")),
                                    Perf_Nombre = reader.GetString(reader.GetOrdinal("Perf_Nombre")),
                                    Perf_Descripcion = reader.IsDBNull(reader.GetOrdinal("Perf_Descripcion"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_Descripcion")),
                                    Perf_Estatus = reader.GetBoolean(reader.GetOrdinal("Perf_Estatus")),
                                    Perf_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Perf_CreadoPor"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_CreadoPor")),
                                    Perf_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Perf_CreadoFecha"))
                                        ? null : reader.GetDateTime(reader.GetOrdinal("Perf_CreadoFecha")),
                                    Perf_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Perf_ModificadoPor"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_ModificadoPor")),
                                    Perf_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Perf_ModificadoFecha"))
                                        ? null : reader.GetDateTime(reader.GetOrdinal("Perf_ModificadoFecha"))
                                });
                            }
                        }
                    }
                }
                return perfiles;
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al listar perfiles: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar perfiles: {ex.Message}");
            }
        }

        public async Task<PerfilBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Seleccionar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Accion", 2); 
                        cmd.Parameters.AddWithValue("@Perf_Id", id);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new PerfilBE
                                {
                                    Perf_Id = reader.GetInt32(reader.GetOrdinal("Perf_Id")),
                                    Perf_Nombre = reader.GetString(reader.GetOrdinal("Perf_Nombre")),
                                    Perf_Descripcion = reader.IsDBNull(reader.GetOrdinal("Perf_Descripcion"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_Descripcion")),
                                    Perf_Estatus = reader.GetBoolean(reader.GetOrdinal("Perf_Estatus")),
                                    Perf_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Perf_CreadoPor"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_CreadoPor")),
                                    Perf_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Perf_CreadoFecha"))
                                        ? null : reader.GetDateTime(reader.GetOrdinal("Perf_CreadoFecha")),
                                    Perf_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Perf_ModificadoPor"))
                                        ? null : reader.GetString(reader.GetOrdinal("Perf_ModificadoPor")),
                                    Perf_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Perf_ModificadoFecha"))
                                        ? null : reader.GetDateTime(reader.GetOrdinal("Perf_ModificadoFecha"))
                                };
                            }
                        }
                    }
                }
                return null;
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al obtener perfil: {ex.Message}");
            }
        }

        public async Task<List<PermisoBE>> ObtenerPermisosPorPerfil(int perfilId)
        {
            List<PermisoBE> permisos = new List<PermisoBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_ObtenerPermisos", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Perf_Id", perfilId);

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
                                        ? null : reader.GetString(reader.GetOrdinal("Perm_Descripcion")),
                                    Perm_Estatus = reader.GetBoolean(reader.GetOrdinal("Perm_Estatus"))
                                });
                            }
                        }
                    }
                }
                return permisos;
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al obtener permisos del perfil: {ex.Message}");
            }
        }

        public async Task<int> Crear(PerfilBE perfil)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Insertar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Perf_Nombre", perfil.Perf_Nombre);
                        cmd.Parameters.AddWithValue("@Perf_Descripcion",
                            (object)perfil.Perf_Descripcion ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Perf_Estatus", perfil.Perf_Estatus);
                        cmd.Parameters.AddWithValue("@Perf_CreadoPor",
                            (object)perfil.Perf_CreadoPor ?? DBNull.Value);

                        // Parámetro de salida
                        SqlParameter outputParam = new SqlParameter("@Perf_IdGenerado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        await cmd.ExecuteNonQueryAsync();

                        return Convert.ToInt32(outputParam.Value);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al crear perfil: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(PerfilBE perfil)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Actualizar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Perf_Id", perfil.Perf_Id);
                        cmd.Parameters.AddWithValue("@Perf_Nombre", perfil.Perf_Nombre);
                        cmd.Parameters.AddWithValue("@Perf_Descripcion",
                            (object)perfil.Perf_Descripcion ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Perf_Estatus", perfil.Perf_Estatus);
                        cmd.Parameters.AddWithValue("@Perf_ModificadoPor",
                            (object)perfil.Perf_ModificadoPor ?? DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al actualizar perfil: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Eliminar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Perf_Id", id);

                        await cmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al eliminar perfil: {ex.Message}");
            }
        }
        public async Task<bool> Activar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Activar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Perf_Id", id);

                        await cmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al activar perfil: {ex.Message}");
            }
        }

        public async Task<bool> AsignarPermisoAPerfil(int perfilId, int permisoId, string creadoPor)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_AsignarPermiso", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Perf_Id", perfilId);
                        cmd.Parameters.AddWithValue("@Perm_Id", permisoId);
                        cmd.Parameters.AddWithValue("@PerfPerm_CreadoPor", creadoPor);

                        await cmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al asignar permiso a perfil: {ex.Message}");
            }
        }

        public async Task<bool> RemoverPermisoAPerfil(int perfilId, int permisoId)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("cu.usp_Perfil_RemoverPermiso", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Perf_Id", perfilId);
                        cmd.Parameters.AddWithValue("@Perm_Id", permisoId);

                        await cmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error al remover permiso de perfil: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(PerfilBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cu.usp_Perfil_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Perf_FiltroEstatus", filtros.Perf_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Perf_Id", filtros.Perf_Id);
                    cmd.Parameters.AddWithValue("@Perf_Nombre",
                        string.IsNullOrEmpty(filtros.Perf_Nombre) ? DBNull.Value : filtros.Perf_Nombre);
                    cmd.Parameters.AddWithValue("@Perf_Estatus", filtros.Perf_Estatus);

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
                throw new Exception($"Error al listar perfiles con filtros: {ex.Message}");
            }
        }
    }
}