using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.BP.CM;

namespace WebServiceBackEnd.DA.CM
{
    public class MarcaClaseDA
    {
        private readonly string _connectionString;

        public MarcaClaseDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> clases = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaClase_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_Id", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcClas_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            clases.Add(row);
                        }
                    }
                }
                return clases;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar clases: {ex.Message}");
            }
        }

        public async Task<MarcaClaseBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaClase_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_Id", id);
                    cmd.Parameters.AddWithValue("@MarcClas_Clave", DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcClas_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new MarcaClaseBE
                            {
                                MarcClas_Id = reader.GetInt32(reader.GetOrdinal("MarcClas_Id")),
                                MarcClas_Clave = reader.IsDBNull(reader.GetOrdinal("MarcClas_Clave")) ? null : reader.GetString(reader.GetOrdinal("MarcClas_Clave")),
                                MarcClas_Descripcion = reader.IsDBNull(reader.GetOrdinal("MarcClas_Descripcion")) ? null : reader.GetString(reader.GetOrdinal("MarcClas_Descripcion")),
                                MarcClas_Estatus = reader.GetBoolean(reader.GetOrdinal("MarcClas_Estatus")),
                                MarcClas_CreadoPor = reader.IsDBNull(reader.GetOrdinal("MarcClas_CreadoPor")) ? null : reader.GetString(reader.GetOrdinal("MarcClas_CreadoPor")),
                                MarcClas_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("MarcClas_CreadoFecha")) ? null : reader.GetDateTime(reader.GetOrdinal("MarcClas_CreadoFecha")),
                                MarcClas_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("MarcClas_ModificadoPor")) ? null : reader.GetString(reader.GetOrdinal("MarcClas_ModificadoPor")),
                                MarcClas_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("MarcClas_ModificadoFecha")) ? null : reader.GetDateTime(reader.GetOrdinal("MarcClas_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener clase: {ex.Message}");
            }
        }

        public async Task<dynamic?> ObtenerPorClave(string clave)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaClase_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@MarcClas_FiltroEstatus", true);
                    cmd.Parameters.AddWithValue("@MarcClas_Id", 0);
                    cmd.Parameters.AddWithValue("@MarcClas_Clave", clave);
                    cmd.Parameters.AddWithValue("@MarcClas_Estatus", true);

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
                throw new Exception($"Error al obtener clase por clave: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(MarcaClaseBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaClase_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@MarcClas_FiltroEstatus", filtros.MarcClas_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@MarcClas_Id", filtros.MarcClas_Id);
                    cmd.Parameters.AddWithValue("@MarcClas_Clave", string.IsNullOrEmpty(filtros.MarcClas_Clave) ? DBNull.Value : filtros.MarcClas_Clave);
                    cmd.Parameters.AddWithValue("@MarcClas_Estatus", filtros.MarcClas_Estatus);

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
                throw new Exception($"Error al listar clases con filtros: {ex.Message}");
            }
        }
    }
}