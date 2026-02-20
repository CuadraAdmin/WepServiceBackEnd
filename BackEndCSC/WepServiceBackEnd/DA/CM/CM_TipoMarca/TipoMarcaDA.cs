using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE.CM.CM_TipoMarca;

namespace WebServiceBackEnd.DA.CM.CM_TipoMarca
{
    public class TipoMarcaDA
    {
        private readonly string _connectionString;

        public TipoMarcaDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<TipoMarcaBE>> Listar()
        {
            List<TipoMarcaBE> tiposMarca = new List<TipoMarcaBE>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", 0);
                    cmd.Parameters.AddWithValue("@TipoMar_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@TipoMar_Id", 0);
                    cmd.Parameters.AddWithValue("@TipoMar_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@TipoMar_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tiposMarca.Add(new TipoMarcaBE
                            {
                                TipoMar_Id = reader.GetInt32(reader.GetOrdinal("TipoMar_Id")),
                                TipoMar_Nombre = reader.GetString(reader.GetOrdinal("TipoMar_Nombre")),
                                TipoMar_Estatus = reader.GetBoolean(reader.GetOrdinal("TipoMar_Estatus"))
                            });
                        }
                    }
                }
                return tiposMarca;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar tipos de marca: {ex.Message}");
            }
        }

        public async Task<TipoMarcaBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", 2);
                    cmd.Parameters.AddWithValue("@TipoMar_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@TipoMar_Id", id);
                    cmd.Parameters.AddWithValue("@TipoMar_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@TipoMar_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new TipoMarcaBE
                            {
                                TipoMar_Id = reader.GetInt32(reader.GetOrdinal("TipoMar_Id")),
                                TipoMar_Nombre = reader.GetString(reader.GetOrdinal("TipoMar_Nombre")),
                                TipoMar_Estatus = reader.GetBoolean(reader.GetOrdinal("TipoMar_Estatus")),
                                TipoMar_CreadoPor = reader.IsDBNull(reader.GetOrdinal("TipoMar_CreadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("TipoMar_CreadoPor")),
                                TipoMar_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("TipoMar_CreadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("TipoMar_CreadoFecha")),
                                TipoMar_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("TipoMar_ModificadoPor"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("TipoMar_ModificadoPor")),
                                TipoMar_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("TipoMar_ModificadoFecha"))
                                    ? null
                                    : reader.GetDateTime(reader.GetOrdinal("TipoMar_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener tipo de marca: {ex.Message}");
            }
        }

        public async Task<int> Crear(TipoMarcaBE tipoMarca)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@TipoMar_Nombre", tipoMarca.TipoMar_Nombre);
                    cmd.Parameters.AddWithValue("@TipoMar_Estatus", tipoMarca.TipoMar_Estatus);
                    cmd.Parameters.AddWithValue("@TipoMar_CreadoPor",
                        string.IsNullOrEmpty(tipoMarca.TipoMar_CreadoPor) ? DBNull.Value : tipoMarca.TipoMar_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@TipoMar_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear tipo de marca: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(TipoMarcaBE tipoMarca)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@TipoMar_Id", tipoMarca.TipoMar_Id);
                    cmd.Parameters.AddWithValue("@TipoMar_Nombre", tipoMarca.TipoMar_Nombre);
                    cmd.Parameters.AddWithValue("@TipoMar_Estatus", tipoMarca.TipoMar_Estatus);
                    cmd.Parameters.AddWithValue("@TipoMar_ModificadoPor",
                        string.IsNullOrEmpty(tipoMarca.TipoMar_ModificadoPor) ? DBNull.Value : tipoMarca.TipoMar_ModificadoPor);

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
                throw new Exception($"Error al actualizar tipo de marca: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@TipoMar_Id", id);

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
                throw new Exception($"Error al eliminar tipo de marca: {ex.Message}");
            }
        }

        public async Task<bool> Activar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Activar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@TipoMar_Id", id);

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
                throw new Exception($"Error al activar tipo de marca: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(TipoMarcaBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();

            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_TiposMarca_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@TipoMar_FiltroEstatus", filtros.TipoMar_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@TipoMar_Id", filtros.TipoMar_Id);
                    cmd.Parameters.AddWithValue("@TipoMar_Nombre",
                        string.IsNullOrEmpty(filtros.TipoMar_Nombre) ? DBNull.Value : filtros.TipoMar_Nombre);
                    cmd.Parameters.AddWithValue("@TipoMar_Estatus", filtros.TipoMar_Estatus);

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
                throw new Exception($"Error al listar tipos de marca con filtros: {ex.Message}");
            }
        }
    }
}
