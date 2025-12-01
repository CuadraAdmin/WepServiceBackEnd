using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.DA.CM
{
    public class MarcaTareasDA
    {
        private readonly string _connectionString;

        public MarcaTareasDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> tareas = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@MarcTare_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Id", 0);
                    cmd.Parameters.AddWithValue("@Marc_Id", 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            tareas.Add(row);
                        }
                    }
                }
                return tareas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar tareas: {ex.Message}");
            }
        }

        public async Task<MarcaTareasBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@MarcTare_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Id", id);
                    cmd.Parameters.AddWithValue("@Marc_Id", 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new MarcaTareasBE
                            {
                                MarcTare_Id = reader.GetInt32(reader.GetOrdinal("MarcTare_Id")),
                                Marc_Id = reader.GetInt32(reader.GetOrdinal("Marc_Id")),
                                MarcTare_Descripcion = reader.IsDBNull(reader.GetOrdinal("MarcTare_Descripcion")) ? null : reader.GetString(reader.GetOrdinal("MarcTare_Descripcion")),
                                MarcTare_FechaIniciacion = reader.IsDBNull(reader.GetOrdinal("MarcTare_FechaIniciacion")) ? null : reader.GetDateTime(reader.GetOrdinal("MarcTare_FechaIniciacion")),
                                MarcTare_FechaFinalizacion = reader.IsDBNull(reader.GetOrdinal("MarcTare_FechaFinalizacion")) ? null : reader.GetDateTime(reader.GetOrdinal("MarcTare_FechaFinalizacion")),
                                MarcTare_Estatus = reader.GetBoolean(reader.GetOrdinal("MarcTare_Estatus")),
                                MarcTare_CreadoPor = reader.IsDBNull(reader.GetOrdinal("MarcTare_CreadoPor")) ? null : reader.GetString(reader.GetOrdinal("MarcTare_CreadoPor")),
                                MarcTare_FechaCreacion = reader.GetDateTime(reader.GetOrdinal("MarcTare_FechaCreacion")),
                                MarcTare_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("MarcTare_ModificadoPor")) ? null : reader.GetString(reader.GetOrdinal("MarcTare_ModificadoPor")),
                                MarcTare_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("MarcTare_ModificadoFecha")) ? null : reader.GetDateTime(reader.GetOrdinal("MarcTare_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener tarea: {ex.Message}");
            }
        }

        public async Task<int> Crear(MarcaTareasBE tarea)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Marc_Id", tarea.Marc_Id);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", string.IsNullOrEmpty(tarea.MarcTare_Descripcion) ? DBNull.Value : tarea.MarcTare_Descripcion);
                    cmd.Parameters.AddWithValue("@MarcTare_FechaIniciacion", tarea.MarcTare_FechaIniciacion.HasValue ? tarea.MarcTare_FechaIniciacion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcTare_CreadoPor", string.IsNullOrEmpty(tarea.MarcTare_CreadoPor) ? DBNull.Value : tarea.MarcTare_CreadoPor);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", tarea.MarcTare_Estatus);

                    SqlParameter outputParam = new SqlParameter("@MarcTare_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear tarea: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(MarcaTareasBE tarea)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@MarcTare_Id", tarea.MarcTare_Id);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", string.IsNullOrEmpty(tarea.MarcTare_Descripcion) ? DBNull.Value : tarea.MarcTare_Descripcion);
                    cmd.Parameters.AddWithValue("@MarcTare_FechaIniciacion", tarea.MarcTare_FechaIniciacion.HasValue ? tarea.MarcTare_FechaIniciacion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", tarea.MarcTare_Estatus);
                    cmd.Parameters.AddWithValue("@MarcTare_ModificadoPor", string.IsNullOrEmpty(tarea.MarcTare_ModificadoPor) ? DBNull.Value : tarea.MarcTare_ModificadoPor);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar tarea: {ex.Message}");
            }
        }
        public async Task<bool> ActualizarFechaFinalizacion(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_ActualizarFechaFinalizacion", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MarcTare_Id", id);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MarcTare_Id", id);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(MarcaTareasBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@MarcTare_FiltroEstatus", filtros.MarcTare_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Id", filtros.MarcTare_Id);
                    cmd.Parameters.AddWithValue("@Marc_Id", filtros.Marc_Id);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", string.IsNullOrEmpty(filtros.MarcTare_Descripcion) ? DBNull.Value : filtros.MarcTare_Descripcion);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", filtros.MarcTare_Estatus);

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
                throw new Exception($"Error al listar tareas con filtros: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarPorMarca(int marcaId)
        {
            List<dynamic> tareas = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaTareas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1);
                    cmd.Parameters.AddWithValue("@MarcTare_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@MarcTare_Id", 0);
                    cmd.Parameters.AddWithValue("@Marc_Id", marcaId);
                    cmd.Parameters.AddWithValue("@MarcTare_Descripcion", DBNull.Value);
                    cmd.Parameters.AddWithValue("@MarcTare_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            tareas.Add(row);
                        }
                    }
                }
                return tareas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar tareas por marca: {ex.Message}");
            }
        }
    }
}