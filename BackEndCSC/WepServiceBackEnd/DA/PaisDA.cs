using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE;

namespace WebServiceBackEnd.DA
{
    public class PaisDA
    {
        private readonly string _connectionString;

        public PaisDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> paises = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 0);
                    cmd.Parameters.AddWithValue("@Pais_FiltroEstatus", 0); 
                    cmd.Parameters.AddWithValue("@Pais_Id", 0);
                    cmd.Parameters.AddWithValue("@Pais_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", 1);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            paises.Add(row);
                        }
                    }
                }
                return paises;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar países: {ex.Message}");
            }
        }

        public async Task<PaisBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 2);
                    cmd.Parameters.AddWithValue("@Pais_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Pais_Id", id);
                    cmd.Parameters.AddWithValue("@Pais_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new PaisBE
                            {
                                Pais_Id = reader.GetInt32(reader.GetOrdinal("Pais_Id")),
                                Pais_Clave = reader.IsDBNull(reader.GetOrdinal("Pais_Clave")) ? null : reader.GetString(reader.GetOrdinal("Pais_Clave")),
                                Pais_Nombre = reader.IsDBNull(reader.GetOrdinal("Pais_Nombre")) ? null : reader.GetString(reader.GetOrdinal("Pais_Nombre")),
                                Pais_Estatus = reader.GetBoolean(reader.GetOrdinal("Pais_Estatus")),
                                Pais_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Pais_CreadoPor")) ? null : reader.GetString(reader.GetOrdinal("Pais_CreadoPor")),
                                Pais_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Pais_CreadoFecha")) ? null : reader.GetDateTime(reader.GetOrdinal("Pais_CreadoFecha")),
                                Pais_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Pais_ModificadoPor")) ? null : reader.GetString(reader.GetOrdinal("Pais_ModificadoPor")),
                                Pais_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Pais_ModificadoFecha")) ? null : reader.GetDateTime(reader.GetOrdinal("Pais_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener país: {ex.Message}");
            }
        }

        public async Task<dynamic?> ObtenerPorNombre(string nombre)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@Pais_FiltroEstatus", 1);
                    cmd.Parameters.AddWithValue("@Pais_Id", 0);
                    cmd.Parameters.AddWithValue("@Pais_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", nombre);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", 1);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            return row;
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener país por nombre: {ex.Message}");
            }
        }

        public async Task<int> Crear(PaisBE pais)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Pais_Clave", string.IsNullOrEmpty(pais.Pais_Clave) ? DBNull.Value : pais.Pais_Clave);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", string.IsNullOrEmpty(pais.Pais_Nombre) ? DBNull.Value : pais.Pais_Nombre);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", pais.Pais_Estatus);
                    cmd.Parameters.AddWithValue("@Pais_CreadoPor", string.IsNullOrEmpty(pais.Pais_CreadoPor) ? DBNull.Value : pais.Pais_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@Pais_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear país: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(PaisBE pais)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Pais_Id", pais.Pais_Id);
                    cmd.Parameters.AddWithValue("@Pais_Clave", string.IsNullOrEmpty(pais.Pais_Clave) ? DBNull.Value : pais.Pais_Clave);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", string.IsNullOrEmpty(pais.Pais_Nombre) ? DBNull.Value : pais.Pais_Nombre);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", pais.Pais_Estatus);
                    cmd.Parameters.AddWithValue("@Pais_ModificadoPor", string.IsNullOrEmpty(pais.Pais_ModificadoPor) ? DBNull.Value : pais.Pais_ModificadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar país: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int paisId, string modificadoPor)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Pais_Id", paisId);
                    cmd.Parameters.AddWithValue("@Pais_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar país: {ex.Message}");
            }
        }

        public async Task<bool> Activar(int paisId, string modificadoPor)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Activar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Pais_Id", paisId);
                    cmd.Parameters.AddWithValue("@Pais_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al activar país: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(PaisBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("dbo.usp_Pais_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Pais_FiltroEstatus", filtros.Pais_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Pais_Id", filtros.Pais_Id);
                    cmd.Parameters.AddWithValue("@Pais_Clave", string.IsNullOrEmpty(filtros.Pais_Clave) ? DBNull.Value : filtros.Pais_Clave);
                    cmd.Parameters.AddWithValue("@Pais_Nombre", string.IsNullOrEmpty(filtros.Pais_Nombre) ? DBNull.Value : filtros.Pais_Nombre);
                    cmd.Parameters.AddWithValue("@Pais_Estatus", filtros.Pais_Estatus);

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
                throw new Exception($"Error al listar países con filtros: {ex.Message}");
            }
        }
    }
}