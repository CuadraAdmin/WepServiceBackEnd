using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.DA.CM
{
    public class MarcaNotificacionDA
    {
        private readonly string _connectionString;

        public MarcaNotificacionDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<MarcaNotificacionBE>> Listar(int marcaId = 0)
        {
            List<MarcaNotificacionBE> lista = new List<MarcaNotificacionBE>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaNotificacion_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Marc_Id", marcaId);
                    cmd.Parameters.AddWithValue("@MarcNoti_Id", 0);
                    cmd.Parameters.AddWithValue("@MarcNoti_Estatus", DBNull.Value);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            lista.Add(new MarcaNotificacionBE
                            {
                                MarcNoti_Id = reader.GetInt32(reader.GetOrdinal("MarcNoti_Id")),
                                Marc_Id = reader.GetInt32(reader.GetOrdinal("Marc_Id")),
                                MarcNoti_Nombre = reader.IsDBNull(reader.GetOrdinal("MarcNoti_Nombre")) ? null : reader.GetString(reader.GetOrdinal("MarcNoti_Nombre")),
                                MarcNoti_Correo = reader.IsDBNull(reader.GetOrdinal("MarcNoti_Correo")) ? null : reader.GetString(reader.GetOrdinal("MarcNoti_Correo")),
                                MarcNoti_TelefonoWhatsApp = reader.IsDBNull(reader.GetOrdinal("MarcNoti_TelefonoWhatsApp")) ? null : reader.GetString(reader.GetOrdinal("MarcNoti_TelefonoWhatsApp")),
                                MarcNoti_Estatus = reader.GetBoolean(reader.GetOrdinal("MarcNoti_Estatus")),
                                objMarcasBE = new MarcasBE()
                                {
                                    Marc_Marca = reader.IsDBNull(reader.GetOrdinal("Marc_Marca")) ? null : reader.GetString(reader.GetOrdinal("Marc_Marca")),
                                    Marc_Renovacion = reader.IsDBNull(reader.GetOrdinal("Marc_Renovacion")) ? null : reader.GetDateTime(reader.GetOrdinal("Marc_Renovacion"))
                                }
                            });
                        }
                    }
                }
                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar notificaciones: {ex.Message}");
            }
        }

        public async Task<int> Crear(MarcaNotificacionBE notificacion)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaNotificacion_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Marc_Id", notificacion.Marc_Id);
                    cmd.Parameters.AddWithValue("@MarcNoti_Nombre", notificacion.MarcNoti_Nombre);
                    cmd.Parameters.AddWithValue("@MarcNoti_Correo", notificacion.MarcNoti_Correo);
                    cmd.Parameters.AddWithValue("@MarcNoti_TelefonoWhatsApp", notificacion.MarcNoti_TelefonoWhatsApp);
                    cmd.Parameters.AddWithValue("@MarcNoti_Estatus", notificacion.MarcNoti_Estatus);
                    cmd.Parameters.AddWithValue("@MarcNoti_CreadoPor", string.IsNullOrEmpty(notificacion.MarcNoti_CreadoPor) ? DBNull.Value : notificacion.MarcNoti_CreadoPor); // ✅ CORREGIDO

                    SqlParameter outputParam = new SqlParameter("@MarcNoti_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear notificación: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(MarcaNotificacionBE notificacion)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaNotificacion_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@MarcNoti_Id", notificacion.MarcNoti_Id);
                    cmd.Parameters.AddWithValue("@MarcNoti_Nombre", notificacion.MarcNoti_Nombre);
                    cmd.Parameters.AddWithValue("@MarcNoti_Correo", notificacion.MarcNoti_Correo);
                    cmd.Parameters.AddWithValue("@MarcNoti_TelefonoWhatsApp", notificacion.MarcNoti_TelefonoWhatsApp);
                    cmd.Parameters.AddWithValue("@MarcNoti_Estatus", notificacion.MarcNoti_Estatus);
                    cmd.Parameters.AddWithValue("@MarcNoti_ModificadoPor", string.IsNullOrEmpty(notificacion.MarcNoti_ModificadoPor) ? DBNull.Value : notificacion.MarcNoti_ModificadoPor); // ✅ CORREGIDO

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar notificación: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id, string modificadoPor = "Sistema")
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaNotificacion_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@MarcNoti_Id", id);
                    cmd.Parameters.AddWithValue("@MarcNoti_ModificadoPor",
                        string.IsNullOrEmpty(modificadoPor) ? (object)DBNull.Value : modificadoPor);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar notificación: {ex.Message}");
            }
        }

        public async Task<(int TotalInsertados, int TotalErrores, List<dynamic> Resultados)> CrearMasivo(List<MarcaNotificacionBE> contactos)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // Crear DataTable con estructura del UTT
                    DataTable dt = new DataTable();
                    dt.Columns.Add("Marc_Id", typeof(int));
                    dt.Columns.Add("MarcNoti_Nombre", typeof(string));
                    dt.Columns.Add("MarcNoti_Correo", typeof(string));
                    dt.Columns.Add("MarcNoti_TelefonoWhatsApp", typeof(string));
                    dt.Columns.Add("MarcNoti_Estatus", typeof(bool));
                    dt.Columns.Add("MarcNoti_CreadoPor", typeof(string));

                    // Llenar DataTable
                    foreach (var contacto in contactos)
                    {
                        dt.Rows.Add(
                            contacto.Marc_Id,
                            string.IsNullOrEmpty(contacto.MarcNoti_Nombre) ? DBNull.Value : contacto.MarcNoti_Nombre,
                            string.IsNullOrEmpty(contacto.MarcNoti_Correo) ? DBNull.Value : contacto.MarcNoti_Correo,
                            string.IsNullOrEmpty(contacto.MarcNoti_TelefonoWhatsApp) ? DBNull.Value : contacto.MarcNoti_TelefonoWhatsApp,
                            contacto.MarcNoti_Estatus,
                            string.IsNullOrEmpty(contacto.MarcNoti_CreadoPor) ? DBNull.Value : contacto.MarcNoti_CreadoPor
                        );
                    }

                    SqlCommand cmd = new SqlCommand("cm.usp_MarcaNotificacion_InsertarMasivo", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 300; // 5 minutos para grandes lotes

                    // Parámetro tipo tabla
                    SqlParameter tvpParam = cmd.Parameters.AddWithValue("@Contactos", dt);
                    tvpParam.SqlDbType = SqlDbType.Structured;
                    tvpParam.TypeName = "cm.utt_MarcaNotificacion";

                    // Parámetros de salida
                    SqlParameter totalInsertadosParam = new SqlParameter("@TotalInsertados", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(totalInsertadosParam);

                    SqlParameter totalErroresParam = new SqlParameter("@TotalErrores", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(totalErroresParam);

                    // Ejecutar y leer resultados
                    List<dynamic> resultados = new List<dynamic>();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            resultados.Add(row);
                        }
                    }

                    int totalInsertados = Convert.ToInt32(totalInsertadosParam.Value);
                    int totalErrores = Convert.ToInt32(totalErroresParam.Value);

                    return (totalInsertados, totalErrores, resultados);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear contactos masivamente: {ex.Message}");
            }
        }
    }
}