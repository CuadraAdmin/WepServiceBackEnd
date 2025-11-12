using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE;
using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.DA.CM
{
    public class MarcasDA
    {
        private readonly string _connectionString;

        public MarcasDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> marcas = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1); 
                    cmd.Parameters.AddWithValue("@Marc_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Marc_Id", 0);
                    cmd.Parameters.AddWithValue("@Empr_Id", 0);
                    cmd.Parameters.AddWithValue("@Marc_Marca", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Registro", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Titular", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            marcas.Add(row);
                        }
                    }
                }
                return marcas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar marcas: {ex.Message}");
            }
        }

        public async Task<MarcasBE?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1); 
                    cmd.Parameters.AddWithValue("@Marc_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Marc_Id", id);
                    cmd.Parameters.AddWithValue("@Empr_Id", 0);
                    cmd.Parameters.AddWithValue("@Marc_Marca", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Registro", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Titular", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new MarcasBE
                            {
                                Marc_Id = reader.GetInt32(reader.GetOrdinal("Marc_Id")),
                                Empr_Id = reader.GetInt32(reader.GetOrdinal("Empr_Id")),
                                Marc_Consecutivo = reader.IsDBNull(reader.GetOrdinal("Marc_Consecutivo"))? null : reader.GetString(reader.GetOrdinal("Marc_Consecutivo")),
                                Marc_Pais = reader.IsDBNull(reader.GetOrdinal("Marc_Pais"))? null : reader.GetString(reader.GetOrdinal("Marc_Pais")),
                                Marc_SolicitudNacional = reader.IsDBNull(reader.GetOrdinal("Marc_SolicitudNacional"))? null : reader.GetString(reader.GetOrdinal("Marc_SolicitudNacional")),
                                Marc_Registro = reader.IsDBNull(reader.GetOrdinal("Marc_Registro"))? null : reader.GetString(reader.GetOrdinal("Marc_Registro")),
                                Marc_Marca = reader.IsDBNull(reader.GetOrdinal("Marc_Marca"))? null : reader.GetString(reader.GetOrdinal("Marc_Marca")),
                                Marc_Diseno = reader.IsDBNull(reader.GetOrdinal("Marc_Diseno"))? null : reader.GetString(reader.GetOrdinal("Marc_Diseno")),
                                Marc_Clase = reader.IsDBNull(reader.GetOrdinal("Marc_Clase"))? null : reader.GetString(reader.GetOrdinal("Marc_Clase")),
                                Marc_Titular = reader.IsDBNull(reader.GetOrdinal("Marc_Titular"))? null : reader.GetString(reader.GetOrdinal("Marc_Titular")),
                                Marc_Figura = reader.IsDBNull(reader.GetOrdinal("Marc_Figura"))? null : reader.GetString(reader.GetOrdinal("Marc_Figura")),
                                Marc_Titulo = reader.IsDBNull(reader.GetOrdinal("Marc_Titulo"))? null : reader.GetString(reader.GetOrdinal("Marc_Titulo")),
                                Marc_Tipo = reader.IsDBNull(reader.GetOrdinal("Marc_Tipo"))? null : reader.GetString(reader.GetOrdinal("Marc_Tipo")),
                                Marc_Rama = reader.IsDBNull(reader.GetOrdinal("Marc_Rama"))? null : reader.GetString(reader.GetOrdinal("Marc_Rama")),
                                Marc_Autor = reader.IsDBNull(reader.GetOrdinal("Marc_Autor"))? null : reader.GetString(reader.GetOrdinal("Marc_Autor")),
                                Marc_Observaciones = reader.IsDBNull(reader.GetOrdinal("Marc_Observaciones"))? null : reader.GetString(reader.GetOrdinal("Marc_Observaciones")),
                                Marc_FechaSolicitud = reader.IsDBNull(reader.GetOrdinal("Marc_FechaSolicitud"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaSolicitud")),
                                Marc_FechaRegistro = reader.IsDBNull(reader.GetOrdinal("Marc_FechaRegistro"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaRegistro")),
                                Marc_Dure = reader.IsDBNull(reader.GetOrdinal("Marc_Dure")) ? null : reader.GetDateTime(reader.GetOrdinal("Marc_Dure")),
                                Marc_Renovacion = reader.IsDBNull(reader.GetOrdinal("Marc_Renovacion"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_Renovacion")),
                                Marc_Oposicion = reader.IsDBNull(reader.GetOrdinal("Marc_Oposicion")) ? null : reader.GetDateTime(reader.GetOrdinal("Marc_Oposicion")),
                                Marc_ProximaTarea = reader.IsDBNull(reader.GetOrdinal("Marc_ProximaTarea"))? null : reader.GetString(reader.GetOrdinal("Marc_ProximaTarea")),
                                Marc_FechaSeguimiento = reader.IsDBNull(reader.GetOrdinal("Marc_FechaSeguimiento"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaSeguimiento")),
                                Marc_FechaAviso = reader.IsDBNull(reader.GetOrdinal("Marc_FechaAviso"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaAviso")),
                                Marc_Estatus = reader.GetBoolean(reader.GetOrdinal("Marc_Estatus")),
                                Marc_CreadoPor = reader.IsDBNull(reader.GetOrdinal("Marc_CreadoPor"))? null : reader.GetString(reader.GetOrdinal("Marc_CreadoPor")),
                                Marc_CreadoFecha = reader.IsDBNull(reader.GetOrdinal("Marc_CreadoFecha"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_CreadoFecha")),
                                Marc_ModificadoPor = reader.IsDBNull(reader.GetOrdinal("Marc_ModificadoPor"))? null : reader.GetString(reader.GetOrdinal("Marc_ModificadoPor")),
                                Marc_ModificadoFecha = reader.IsDBNull(reader.GetOrdinal("Marc_ModificadoFecha"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_ModificadoFecha"))
                            };
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener marca: {ex.Message}");
            }
        }

        public async Task<int> Crear(MarcasBE marca)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Empr_Id", marca.Empr_Id);
                    cmd.Parameters.AddWithValue("@Marc_Consecutivo",string.IsNullOrEmpty(marca.Marc_Consecutivo) ? DBNull.Value : marca.Marc_Consecutivo);
                    cmd.Parameters.AddWithValue("@Marc_Pais",string.IsNullOrEmpty(marca.Marc_Pais) ? DBNull.Value : marca.Marc_Pais);
                    cmd.Parameters.AddWithValue("@Marc_SolicitudNacional",string.IsNullOrEmpty(marca.Marc_SolicitudNacional) ? DBNull.Value : marca.Marc_SolicitudNacional);
                    cmd.Parameters.AddWithValue("@Marc_Registro",string.IsNullOrEmpty(marca.Marc_Registro) ? DBNull.Value : marca.Marc_Registro);
                    cmd.Parameters.AddWithValue("@Marc_Marca",string.IsNullOrEmpty(marca.Marc_Marca) ? DBNull.Value : marca.Marc_Marca);
                    cmd.Parameters.AddWithValue("@Marc_Diseno",string.IsNullOrEmpty(marca.Marc_Diseno) ? DBNull.Value : marca.Marc_Diseno);
                    cmd.Parameters.AddWithValue("@Marc_Clase",string.IsNullOrEmpty(marca.Marc_Clase) ? DBNull.Value : marca.Marc_Clase);
                    cmd.Parameters.AddWithValue("@Marc_Titular",string.IsNullOrEmpty(marca.Marc_Titular) ? DBNull.Value : marca.Marc_Titular);
                    cmd.Parameters.AddWithValue("@Marc_Figura",string.IsNullOrEmpty(marca.Marc_Figura) ? DBNull.Value : marca.Marc_Figura);
                    cmd.Parameters.AddWithValue("@Marc_Titulo",string.IsNullOrEmpty(marca.Marc_Titulo) ? DBNull.Value : marca.Marc_Titulo);
                    cmd.Parameters.AddWithValue("@Marc_Tipo",string.IsNullOrEmpty(marca.Marc_Tipo) ? DBNull.Value : marca.Marc_Tipo);
                    cmd.Parameters.AddWithValue("@Marc_Rama",string.IsNullOrEmpty(marca.Marc_Rama) ? DBNull.Value : marca.Marc_Rama);
                    cmd.Parameters.AddWithValue("@Marc_Autor",string.IsNullOrEmpty(marca.Marc_Autor) ? DBNull.Value : marca.Marc_Autor);
                    cmd.Parameters.AddWithValue("@Marc_Observaciones",string.IsNullOrEmpty(marca.Marc_Observaciones) ? DBNull.Value : marca.Marc_Observaciones);
                    cmd.Parameters.AddWithValue("@Marc_FechaSolicitud",marca.Marc_FechaSolicitud.HasValue ? marca.Marc_FechaSolicitud.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_FechaRegistro",marca.Marc_FechaRegistro.HasValue ? marca.Marc_FechaRegistro.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Dure",marca.Marc_Dure.HasValue ? marca.Marc_Dure.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Renovacion",marca.Marc_Renovacion.HasValue ? marca.Marc_Renovacion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Oposicion",marca.Marc_Oposicion.HasValue ? marca.Marc_Oposicion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_ProximaTarea",string.IsNullOrEmpty(marca.Marc_ProximaTarea) ? DBNull.Value : marca.Marc_ProximaTarea);
                    cmd.Parameters.AddWithValue("@Marc_FechaSeguimiento",marca.Marc_FechaSeguimiento.HasValue ? marca.Marc_FechaSeguimiento.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_FechaAviso",marca.Marc_FechaAviso.HasValue ? marca.Marc_FechaAviso.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Estatus", marca.Marc_Estatus);
                    cmd.Parameters.AddWithValue("@Marc_CreadoPor",string.IsNullOrEmpty(marca.Marc_CreadoPor) ? DBNull.Value : marca.Marc_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@Marc_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear marca: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(MarcasBE marca)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Marc_Id", marca.Marc_Id);
                    cmd.Parameters.AddWithValue("@Empr_Id", marca.Empr_Id);
                    cmd.Parameters.AddWithValue("@Marc_Consecutivo",string.IsNullOrEmpty(marca.Marc_Consecutivo) ? DBNull.Value : marca.Marc_Consecutivo);
                    cmd.Parameters.AddWithValue("@Marc_Pais",string.IsNullOrEmpty(marca.Marc_Pais) ? DBNull.Value : marca.Marc_Pais);
                    cmd.Parameters.AddWithValue("@Marc_SolicitudNacional",string.IsNullOrEmpty(marca.Marc_SolicitudNacional) ? DBNull.Value : marca.Marc_SolicitudNacional);
                    cmd.Parameters.AddWithValue("@Marc_Registro",string.IsNullOrEmpty(marca.Marc_Registro) ? DBNull.Value : marca.Marc_Registro);
                    cmd.Parameters.AddWithValue("@Marc_Marca",string.IsNullOrEmpty(marca.Marc_Marca) ? DBNull.Value : marca.Marc_Marca);
                    cmd.Parameters.AddWithValue("@Marc_Diseno",string.IsNullOrEmpty(marca.Marc_Diseno) ? DBNull.Value : marca.Marc_Diseno);
                    cmd.Parameters.AddWithValue("@Marc_Clase",string.IsNullOrEmpty(marca.Marc_Clase) ? DBNull.Value : marca.Marc_Clase);
                    cmd.Parameters.AddWithValue("@Marc_Titular",string.IsNullOrEmpty(marca.Marc_Titular) ? DBNull.Value : marca.Marc_Titular);
                    cmd.Parameters.AddWithValue("@Marc_Figura",string.IsNullOrEmpty(marca.Marc_Figura) ? DBNull.Value : marca.Marc_Figura);
                    cmd.Parameters.AddWithValue("@Marc_Titulo",string.IsNullOrEmpty(marca.Marc_Titulo) ? DBNull.Value : marca.Marc_Titulo);
                    cmd.Parameters.AddWithValue("@Marc_Tipo",string.IsNullOrEmpty(marca.Marc_Tipo) ? DBNull.Value : marca.Marc_Tipo);
                    cmd.Parameters.AddWithValue("@Marc_Rama",string.IsNullOrEmpty(marca.Marc_Rama) ? DBNull.Value : marca.Marc_Rama);
                    cmd.Parameters.AddWithValue("@Marc_Autor",string.IsNullOrEmpty(marca.Marc_Autor) ? DBNull.Value : marca.Marc_Autor);
                    cmd.Parameters.AddWithValue("@Marc_Observaciones",string.IsNullOrEmpty(marca.Marc_Observaciones) ? DBNull.Value : marca.Marc_Observaciones);
                    cmd.Parameters.AddWithValue("@Marc_FechaSolicitud",marca.Marc_FechaSolicitud.HasValue ? marca.Marc_FechaSolicitud.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_FechaRegistro",marca.Marc_FechaRegistro.HasValue ? marca.Marc_FechaRegistro.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Dure", marca.Marc_Dure.HasValue ? marca.Marc_Dure.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Renovacion",marca.Marc_Renovacion.HasValue ? marca.Marc_Renovacion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Oposicion", marca.Marc_Oposicion.HasValue ? marca.Marc_Oposicion.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_ProximaTarea",string.IsNullOrEmpty(marca.Marc_ProximaTarea) ? DBNull.Value : marca.Marc_ProximaTarea);
                    cmd.Parameters.AddWithValue("@Marc_FechaSeguimiento",marca.Marc_FechaSeguimiento.HasValue ? marca.Marc_FechaSeguimiento.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_FechaAviso",marca.Marc_FechaAviso.HasValue ? marca.Marc_FechaAviso.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Marc_Estatus", marca.Marc_Estatus);
                    cmd.Parameters.AddWithValue("@Marc_ModificadoPor",string.IsNullOrEmpty(marca.Marc_ModificadoPor) ? DBNull.Value : marca.Marc_ModificadoPor);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar marca: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id, string? modificadoPor = null)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Marc_Id", id);
                    cmd.Parameters.AddWithValue("@Marc_ModificadoPor",
                        string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                throw;
            }
            
        }

        public async Task<bool> Activar(int id, string? modificadoPor = null)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Activar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Marc_Id", id);
                    cmd.Parameters.AddWithValue("@Marc_ModificadoPor",
                        string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        public async Task<List<dynamic>> ListarConFiltros(MarcasBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Marc_FiltroEstatus", filtros.Marc_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Marc_Id", filtros.Marc_Id);
                    cmd.Parameters.AddWithValue("@Empr_Id", filtros.Empr_Id);
                    cmd.Parameters.AddWithValue("@Marc_Marca",string.IsNullOrEmpty(filtros.Marc_Marca) ? DBNull.Value : filtros.Marc_Marca);
                    cmd.Parameters.AddWithValue("@Marc_Registro",string.IsNullOrEmpty(filtros.Marc_Registro) ? DBNull.Value : filtros.Marc_Registro);
                    cmd.Parameters.AddWithValue("@Marc_Titular",string.IsNullOrEmpty(filtros.Marc_Titular) ? DBNull.Value : filtros.Marc_Titular);
                    cmd.Parameters.AddWithValue("@Marc_Estatus", filtros.Marc_Estatus);

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
                throw new Exception($"Error al listar marcas con filtros: {ex.Message}");
            }
        }
        public async Task<List<dynamic>> ObtenerPorEmpresasConPermisos(int usuarioId)
        {
            List<dynamic> marcasConPermisos = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cm.usp_Marcas_ObtenerPorEmpresasConPermisos", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Usua_Id", usuarioId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;

                            // Datos de Marca
                            row["Marc_Id"] = reader.GetInt32(reader.GetOrdinal("Marc_Id"));
                            row["Empr_Id"] = reader.GetInt32(reader.GetOrdinal("Empr_Id"));
                            row["Marc_Consecutivo"] = reader.IsDBNull(reader.GetOrdinal("Marc_Consecutivo"))? null : reader.GetString(reader.GetOrdinal("Marc_Consecutivo"));
                            row["Marc_Pais"] = reader.IsDBNull(reader.GetOrdinal("Marc_Pais"))? null : reader.GetString(reader.GetOrdinal("Marc_Pais"));
                            row["Marc_SolicitudNacional"] = reader.IsDBNull(reader.GetOrdinal("Marc_SolicitudNacional"))? null : reader.GetString(reader.GetOrdinal("Marc_SolicitudNacional"));
                            row["Marc_Registro"] = reader.IsDBNull(reader.GetOrdinal("Marc_Registro"))? null : reader.GetString(reader.GetOrdinal("Marc_Registro"));
                            row["Marc_Marca"] = reader.IsDBNull(reader.GetOrdinal("Marc_Marca"))? null : reader.GetString(reader.GetOrdinal("Marc_Marca"));
                            row["Marc_Diseno"] = reader.IsDBNull(reader.GetOrdinal("Marc_Diseno"))? null : reader.GetString(reader.GetOrdinal("Marc_Diseno"));
                            row["Marc_Clase"] = reader.IsDBNull(reader.GetOrdinal("Marc_Clase"))? null : reader.GetString(reader.GetOrdinal("Marc_Clase"));
                            row["Marc_Titular"] = reader.IsDBNull(reader.GetOrdinal("Marc_Titular"))? null : reader.GetString(reader.GetOrdinal("Marc_Titular"));
                            row["Marc_Figura"] = reader.IsDBNull(reader.GetOrdinal("Marc_Figura"))? null : reader.GetString(reader.GetOrdinal("Marc_Figura"));
                            row["Marc_Titulo"] = reader.IsDBNull(reader.GetOrdinal("Marc_Titulo"))? null : reader.GetString(reader.GetOrdinal("Marc_Titulo"));
                            row["Marc_Tipo"] = reader.IsDBNull(reader.GetOrdinal("Marc_Tipo"))? null : reader.GetString(reader.GetOrdinal("Marc_Tipo"));
                            row["Marc_Rama"] = reader.IsDBNull(reader.GetOrdinal("Marc_Rama"))? null : reader.GetString(reader.GetOrdinal("Marc_Rama"));
                            row["Marc_Autor"] = reader.IsDBNull(reader.GetOrdinal("Marc_Autor"))? null : reader.GetString(reader.GetOrdinal("Marc_Autor"));
                            row["Marc_Observaciones"] = reader.IsDBNull(reader.GetOrdinal("Marc_Observaciones"))? null : reader.GetString(reader.GetOrdinal("Marc_Observaciones"));
                            row["Marc_FechaSolicitud"] = reader.IsDBNull(reader.GetOrdinal("Marc_FechaSolicitud"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaSolicitud"));
                            row["Marc_FechaRegistro"] = reader.IsDBNull(reader.GetOrdinal("Marc_FechaRegistro"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaRegistro"));
                            row["Marc_Dure"] = reader.IsDBNull(reader.GetOrdinal("Marc_Dure"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_Dure"));
                            row["Marc_Renovacion"] = reader.IsDBNull(reader.GetOrdinal("Marc_Renovacion"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_Renovacion"));
                            row["Marc_Oposicion"] = reader.IsDBNull(reader.GetOrdinal("Marc_Oposicion"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_Oposicion"));
                            row["Marc_ProximaTarea"] = reader.IsDBNull(reader.GetOrdinal("Marc_ProximaTarea"))? null : reader.GetString(reader.GetOrdinal("Marc_ProximaTarea"));
                            row["Marc_FechaSeguimiento"] = reader.IsDBNull(reader.GetOrdinal("Marc_FechaSeguimiento"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaSeguimiento"));
                            row["Marc_FechaAviso"] = reader.IsDBNull(reader.GetOrdinal("Marc_FechaAviso"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_FechaAviso"));
                            row["Marc_Estatus"] = reader.GetBoolean(reader.GetOrdinal("Marc_Estatus"));
                            row["Marc_CreadoPor"] = reader.IsDBNull(reader.GetOrdinal("Marc_CreadoPor"))? null : reader.GetString(reader.GetOrdinal("Marc_CreadoPor"));
                            row["Marc_CreadoFecha"] = reader.IsDBNull(reader.GetOrdinal("Marc_CreadoFecha"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_CreadoFecha"));
                            row["Marc_ModificadoPor"] = reader.IsDBNull(reader.GetOrdinal("Marc_ModificadoPor"))? null : reader.GetString(reader.GetOrdinal("Marc_ModificadoPor"));
                            row["Marc_ModificadoFecha"] = reader.IsDBNull(reader.GetOrdinal("Marc_ModificadoFecha"))? null : reader.GetDateTime(reader.GetOrdinal("Marc_ModificadoFecha"));

                            // Datos de Empresa
                            row["Empr_Clave"] = reader.IsDBNull(reader.GetOrdinal("Empr_Clave"))? null : reader.GetString(reader.GetOrdinal("Empr_Clave"));
                            row["Empr_Nombre"] = reader.IsDBNull(reader.GetOrdinal("Empr_Nombre"))? null : reader.GetString(reader.GetOrdinal("Empr_Nombre"));
                            row["Empr_PermisoGenerado"] = reader.IsDBNull(reader.GetOrdinal("Empr_PermisoGenerado"))? null : reader.GetString(reader.GetOrdinal("Empr_PermisoGenerado"));

                            // Datos de Permiso
                            row["Perm_Id"] = reader.GetInt32(reader.GetOrdinal("Perm_Id"));
                            row["Perm_Nombre"] = reader.GetString(reader.GetOrdinal("Perm_Nombre"));

                            marcasConPermisos.Add(row);
                        }
                    }
                }
                return marcasConPermisos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener marcas por empresas con permisos: {ex.Message}");
            }
        }
        public async Task<(string EmpresaClave, string MarcaNombre)?> ObtenerEmpresaYMarcaPorId(int marcaId)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand(@"
                SELECT e.Empr_Clave, m.Marc_Marca
                FROM cm.Marcas m
                INNER JOIN dbo.Empresa e ON m.Empr_Id = e.Empr_Id
                WHERE m.Marc_Id = @MarcaId", conn);

                    cmd.Parameters.AddWithValue("@MarcaId", marcaId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var empresaClave = reader.IsDBNull(0) ? null : reader.GetString(0);
                            var marcaNombre = reader.IsDBNull(1) ? null : reader.GetString(1);

                            if (!string.IsNullOrEmpty(empresaClave) && !string.IsNullOrEmpty(marcaNombre))
                            {
                                return (empresaClave, marcaNombre);
                            }
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener empresa y marca: {ex.Message}");
            }
        }
    }
}