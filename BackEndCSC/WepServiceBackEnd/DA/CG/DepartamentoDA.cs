using Dapper;
using System.Data;
using System.Data.SqlClient;
using WebServiceBackEnd.BE.CG;

namespace WebServiceBackEnd.DA.CG
{
    public class DepartamentoDA
    {
        private readonly string _connectionString;

        public DepartamentoDA(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<List<DepartamentoBE>> Listar()
        {
            try
            {
                using (IDbConnection db = new SqlConnection(_connectionString))
                {
                    var resultado = await db.QueryAsync<DepartamentoBE>(
                        "cg.usp_Departamento_Seleccionar",
                        commandType: CommandType.StoredProcedure,
                        commandTimeout: 7200
                    );
                    return resultado.ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }
           
        }
        public async Task<DepartamentoBE?> ObtenerPorId(int depaId)
        {
            try
            {
                if (depaId <= 0)
                    throw new ArgumentException("El ID del departamento es inválido");
                using (IDbConnection db = new SqlConnection(_connectionString))
                {
                    var resultado = await db.QueryFirstOrDefaultAsync<DepartamentoBE>(
                        "cg.usp_Departamento_Seleccionar",
                        new { Depa_Id = depaId },
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
        public async Task<int> Crear(DepartamentoBE departamento)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Departamento_Insertar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Empr_Id", departamento.Empr_Id);
                    cmd.Parameters.AddWithValue("@Depa_Clave", departamento.Depa_Clave);
                    cmd.Parameters.AddWithValue("@Depa_Nombre", departamento.Depa_Nombre);
                    cmd.Parameters.AddWithValue("@Depa_Estatus", departamento.Depa_Estatus);
                    cmd.Parameters.AddWithValue("@Depa_CreadoPor", departamento.Depa_CreadoPor);

                    SqlParameter outputParam = new SqlParameter("@Depa_IdGenerado", SqlDbType.Int)
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
                throw new Exception("Error al crear el departamento: " + ex.Message);
            }
        }
        public async Task<bool> Actualizar(DepartamentoBE departamento)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Departamento_Actualizar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Depa_Id", departamento.Depa_Id);
                    cmd.Parameters.AddWithValue("@Empr_Id", departamento.Empr_Id);
                    cmd.Parameters.AddWithValue("@Depa_Clave", departamento.Depa_Clave);
                    cmd.Parameters.AddWithValue("@Depa_Nombre", departamento.Depa_Nombre);
                    cmd.Parameters.AddWithValue("@Depa_ModificadoPor", departamento.Depa_ModificadoPor);
                    cmd.Parameters.AddWithValue("@Depa_Estatus", departamento.Depa_Estatus);

                    int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                    return filasAfectadas > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el departamento:  {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int depa_Id, string? modificadoPor = null)
        {
            try
            {
                using (SqlConnection coon = new SqlConnection(_connectionString))
                {
                    await coon.OpenAsync();

                    SqlCommand cmd = new SqlCommand("cg.usp_Departamento_Eliminar", coon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Depa_Id", depa_Id);
                    cmd.Parameters.AddWithValue("@Depa_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);

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
                    SqlCommand cmd = new SqlCommand("cg.usp_Departamento_Activar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Depa_Id", id);
                    cmd.Parameters.AddWithValue("@Depa_ModificadoPor", string.IsNullOrEmpty(modificadoPor) ? DBNull.Value : modificadoPor);
                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<List<dynamic>> ListarConFiltros(DepartamentoBE filtros)
        {
            try
            {
                List<dynamic> list = new List<dynamic>();
                using (SqlConnection db = new SqlConnection(_connectionString))
                {
                    await db.OpenAsync();
                    SqlCommand cmd = new SqlCommand("cg.usp_Departamento_Seleccionar", db);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Accion", filtros.Accion);
                    cmd.Parameters.AddWithValue("@Depa_FiltroEstatus", filtros.Depa_FiltroEstatus);
                    cmd.Parameters.AddWithValue("@Depa_Id", filtros.Depa_Id);
                    cmd.Parameters.AddWithValue("@Empr_Id", filtros.Empr_Id);
                    cmd.Parameters.AddWithValue("@Depa_Clave", filtros.Depa_Clave);
                    cmd.Parameters.AddWithValue("@Depa_Nombre", filtros.Depa_Nombre);
                    cmd.Parameters.AddWithValue("@Depa_Estatus", filtros.Depa_Estatus);

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
                throw new Exception($"Error al listar los departamentos con filtros: {ex.Message}");
            }
            
        }
    }
}
