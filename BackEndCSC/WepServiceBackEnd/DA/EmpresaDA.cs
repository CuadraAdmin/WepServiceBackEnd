using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE;

namespace WebServiceBackEnd.DA
{
    public class EmpresaDA
    {
        private readonly string _connectionString;

        public EmpresaDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> empresas = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@Empr_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Empr_Id", 0);
                    cmd.Parameters.AddWithValue("@Empr_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Empr_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Empr_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            empresas.Add(row);
                        }
                    }
                }
                return empresas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar empresas: {ex.Message}");
            }
        }

        public async Task<EmpresaBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 2);
                    cmd.Parameters.AddWithValue("@Empr_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Empr_Id", id);
                    cmd.Parameters.AddWithValue("@Empr_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Empr_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Empr_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new EmpresaBE
                            {
                                Empr_Id = reader.GetInt32(reader.GetOrdinal("Empr_Id")),
                                Empr_Clave = reader.IsDBNull(reader.GetOrdinal("Empr_Clave"))
                                    ? null : reader.GetString(reader.GetOrdinal("Empr_Clave")),
                                Empr_Nombre = reader.IsDBNull(reader.GetOrdinal("Empr_Nombre"))
                                    ? null : reader.GetString(reader.GetOrdinal("Empr_Nombre")),
                                Empr_PermisoGenerado = reader.IsDBNull(reader.GetOrdinal("Empr_PermisoGenerado"))
                                    ? null : reader.GetString(reader.GetOrdinal("Empr_PermisoGenerado")),
                                Empr_Estatus = reader.GetBoolean(reader.GetOrdinal("Empr_Estatus")),
                                Empr_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Empr_CreadoPor"))
                                    ? null : reader.GetString(reader.GetOrdinal("Empr_CreadoPor")),
                                Empr_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Empr_CreadoFecha"))
                                    ? null : reader.GetDateTime(reader.GetOrdinal("Empr_CreadoFecha")),
                                Empr_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Empr_ModificadoPor"))
                                    ? null : reader.GetString(reader.GetOrdinal("Empr_ModificadoPor")),
                                Empr_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Empr_ModificadoFecha"))
                                    ? null : reader.GetDateTime(reader.GetOrdinal("Empr_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener empresa: {ex.Message}");
            }
        }

        public async Task<int> Crear(EmpresaBE empresa)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Empr_Clave",
                        string.IsNullOrEmpty(empresa.Empr_Clave) ? DBNull.Value : empresa.Empr_Clave);
                    cmd.Parameters.AddWithValue("@Empr_Nombre",
                        string.IsNullOrEmpty(empresa.Empr_Nombre) ? DBNull.Value : empresa.Empr_Nombre);
                    cmd.Parameters.AddWithValue("@Empr_Estatus", empresa.Empr_Estatus);
                    cmd.Parameters.AddWithValue("@Empr_CreadoPor",
                        string.IsNullOrEmpty(empresa.Empr_CreadoPor) ? DBNull.Value : empresa.Empr_CreadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return 1;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear empresa: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(EmpresaBE empresa)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Empr_Id", empresa.Empr_Id);
                    cmd.Parameters.AddWithValue("@Empr_Clave",string.IsNullOrEmpty(empresa.Empr_Clave) ? DBNull.Value : empresa.Empr_Clave);
                    cmd.Parameters.AddWithValue("@Empr_Nombre",string.IsNullOrEmpty(empresa.Empr_Nombre) ? DBNull.Value : empresa.Empr_Nombre);
                    cmd.Parameters.AddWithValue("@Empr_Estatus", empresa.Empr_Estatus);
                    cmd.Parameters.AddWithValue("@Empr_ModificadoPor",string.IsNullOrEmpty(empresa.Empr_ModificadoPor) ? DBNull.Value : empresa.Empr_ModificadoPor);

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
                throw new Exception($"Error al actualizar empresa: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(EmpresaBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Empr_FiltroEstatus", filtros.Empr_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Empr_Id", filtros.Empr_Id);
                    cmd.Parameters.AddWithValue("@Empr_Clave",string.IsNullOrEmpty(filtros.Empr_Clave) ? DBNull.Value : filtros.Empr_Clave);
                    cmd.Parameters.AddWithValue("@Empr_Nombre",string.IsNullOrEmpty(filtros.Empr_Nombre) ? DBNull.Value : filtros.Empr_Nombre);
                    cmd.Parameters.AddWithValue("@Empr_Estatus", filtros.Empr_Estatus);

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
                throw new Exception($"Error al listar empresas con filtros: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ObtenerEmpresasPorPermiso(int usuarioId)
        {
            List<dynamic> empresas = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Empresa_EmpresasPorPermiso", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            empresas.Add(row);
                        }
                    }
                }
                return empresas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener empresas por permiso: {ex.Message}");
            }
        }
    }
}