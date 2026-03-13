using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using WebServiceBackEnd.BE.CG;
using WebServiceBackEnd.BE.CM;

namespace WebServiceBackEnd.DA.CG
{
    public class AreaDA
    {
        private readonly string _connectionString;

        public AreaDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<dynamic>> Listar(AreaBE filtros)
        {
            try
            {
                List<dynamic> list = new List<dynamic>();

                using (SqlConnection db = new SqlConnection(_connectionString))
                {
                    await db.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Seleccionar", db);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion);
                    cmd.Parameters.AddWithValue("@Area_FiltroEstatus", filtros.Area_FiltroEstatus);
                    cmd.Parameters.AddWithValue("@Depa_Id", filtros.Depa_Id);
                    cmd.Parameters.AddWithValue("@Area_Clave", filtros.Area_Clave);
                    cmd.Parameters.AddWithValue("@Area_Nombre", filtros.Area_Nombre);
                    cmd.Parameters.AddWithValue("@Area_Estatus", filtros.Area_Estatus);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            list.Add(row);
                        }
                    }
                    return list;
                }
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        public async Task<AreaBE?> ObtenerPorId(int areaId)
        {
            try
            {
                if (areaId <= 0)
                    throw new ArgumentException("El ID del área es inválido");
                using (IDbConnection db = new SqlConnection(_connectionString))
                {
                    var resultado = await db.QueryFirstOrDefaultAsync<AreaBE>(
                        "cg.usp_Area_Seleccionar",
                        new { Area_Id = areaId },
                        commandType: CommandType.StoredProcedure,
                        commandTimeout: 7200
                    );
                    return resultado;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<int> Crear(AreaBE _Area)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Depa_Id", _Area.Depa_Id);
                    cmd.Parameters.AddWithValue("@Area_Clave", string.IsNullOrEmpty(_Area.Area_Clave) ? DBNull.Value : _Area.Area_Clave);
                    cmd.Parameters.AddWithValue("@Area_Nombre", string.IsNullOrEmpty(_Area.Area_Nombre) ? DBNull.Value : _Area.Area_Nombre);
                    cmd.Parameters.AddWithValue("@Area_Estatus", _Area.Area_Estatus);
                    cmd.Parameters.AddWithValue("@Area_CreadoPor", string.IsNullOrEmpty(_Area.Area_CreadoPor) ? DBNull.Value : _Area.Area_CreadoPor);


                    SqlParameter outputParam = new SqlParameter("@Area_IdGenerado", SqlDbType.Int)
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
                throw new Exception($"Error al crear Area: {ex.Message}");
            }
        }
        public async Task<bool> Actualizar(AreaBE area)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Area_Id", area.Area_Id);
                    cmd.Parameters.AddWithValue("@Depa_Id", area.Depa_Id);
                    cmd.Parameters.AddWithValue("@Area_Clave", area.Area_Clave);
                    cmd.Parameters.AddWithValue("@Area_Nombre", area.Area_Nombre);
                    cmd.Parameters.AddWithValue("@Area_Estatus", area.Area_Estatus);
                    cmd.Parameters.AddWithValue("@Area_ModificadoPor", area.Area_ModificadoPor);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el área:  {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int area_Id, string? modificadoPor = null)
        {
            try
            {
                using (SqlConnection coon = new SqlConnection(_connectionString))
                {
                    await coon.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Eliminar", coon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Area_Id", area_Id);
                    cmd.Parameters.AddWithValue("@Area_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

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
                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Activar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Area_Id", id);
                    cmd.Parameters.AddWithValue("@Area_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);
                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<List<dynamic>> ListarConFiltros(AreaBE filtros)
        {
            try
            {
                List<dynamic> list = new List<dynamic>();
                using (SqlConnection db = new SqlConnection(_connectionString))
                {
                    await db.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cg.usp_Area_Seleccionar", db);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion);
                    cmd.Parameters.AddWithValue("@Area_FiltroEstatus", filtros.Area_FiltroEstatus);
                    cmd.Parameters.AddWithValue("@Depa_Id", filtros.Depa_Id);
                    cmd.Parameters.AddWithValue("@Area_Clave", filtros.Area_Clave);
                    cmd.Parameters.AddWithValue("@Area_Nombre", filtros.Area_Nombre);
                    cmd.Parameters.AddWithValue("@Area_Estatus", filtros.Area_Estatus);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var row = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader.GetValue(i));
                            }
                            list.Add(row);
                        }
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar la áreas con filtros: {ex.Message}");
            }

        }


    }
}