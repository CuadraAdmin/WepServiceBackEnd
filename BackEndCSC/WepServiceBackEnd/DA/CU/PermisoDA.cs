using Microsoft.Data.SqlClient;
using System.Data;
using WebServiceBackEnd.BE.CU;

namespace WebServiceBackEnd.DA.CU
{
    public class PermisoDA
    {
        private readonly string _connectionString;

        public PermisoDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar()
        {
            List<dynamic> permisos = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 1); 
                    cmd.Parameters.AddWithValue("@Perm_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Perm_Id", 0);
                    cmd.Parameters.AddWithValue("@Perm_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Perm_Actividad", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Perm_Estatus", 0);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            }
                            permisos.Add(row);
                        }
                    }
                }
                return permisos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar permisos: {ex.Message}");
            }
        }

        public async Task<dynamic?> ObtenerPorId(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", 2); // Acción 2 para obtener por ID
                    cmd.Parameters.AddWithValue("@Perm_FiltroEstatus", 0);
                    cmd.Parameters.AddWithValue("@Perm_Id", id);
                    cmd.Parameters.AddWithValue("@Perm_Nombre", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Perm_Actividad", DBNull.Value);
                    cmd.Parameters.AddWithValue("@Perm_Estatus", 0);

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
                throw new Exception($"Error al obtener permiso: {ex.Message}");
            }
        }

        public async Task<int> Crear(PermisoBE permiso)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Perm_Nombre", permiso.Perm_Nombre);
                    cmd.Parameters.AddWithValue("@Perm_Actividad", permiso.Perm_Actividad);
                    cmd.Parameters.AddWithValue("@Perm_Descripcion",
                        string.IsNullOrEmpty(permiso.Perm_Descripcion) ? DBNull.Value : permiso.Perm_Descripcion);
                    cmd.Parameters.AddWithValue("@Perm_Estatus", permiso.Perm_Estatus);
                    cmd.Parameters.AddWithValue("@Perm_CreadoPor",
                        string.IsNullOrEmpty(permiso.Perm_CreadoPor) ? DBNull.Value : permiso.Perm_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@Perm_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear permiso: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(PermisoBE permiso)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Perm_Id", permiso.Perm_Id);
                    cmd.Parameters.AddWithValue("@Perm_Nombre", permiso.Perm_Nombre);
                    cmd.Parameters.AddWithValue("@Perm_Actividad", permiso.Perm_Actividad);
                    cmd.Parameters.AddWithValue("@Perm_Descripcion",
                        string.IsNullOrEmpty(permiso.Perm_Descripcion) ? DBNull.Value : permiso.Perm_Descripcion);
                    cmd.Parameters.AddWithValue("@Perm_Estatus", permiso.Perm_Estatus);
                    cmd.Parameters.AddWithValue("@Perm_ModificadoPor",
                        string.IsNullOrEmpty(permiso.Perm_ModificadoPor) ? DBNull.Value : permiso.Perm_ModificadoPor);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar permiso: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Eliminar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Perm_Id", id);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();
                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar permiso: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(PermisoBE filtros)
        {
            List<dynamic> lista = new List<dynamic>();
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cu.usp_Permiso_Seleccionar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion ?? 1);
                    cmd.Parameters.AddWithValue("@Perm_FiltroEstatus", filtros.Perm_FiltroEstatus ? 1 : 0);
                    cmd.Parameters.AddWithValue("@Perm_Id", filtros.Perm_Id);
                    cmd.Parameters.AddWithValue("@Perm_Nombre",
                        string.IsNullOrEmpty(filtros.Perm_Nombre) ? DBNull.Value : filtros.Perm_Nombre);
                    cmd.Parameters.AddWithValue("@Perm_Actividad",
                        string.IsNullOrEmpty(filtros.Perm_Actividad) ? DBNull.Value : filtros.Perm_Actividad);
                    cmd.Parameters.AddWithValue("@Perm_Estatus", filtros.Perm_Estatus);

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
                throw new Exception($"Error al listar permisos con filtros: {ex.Message}");
            }
        }
    }

}
