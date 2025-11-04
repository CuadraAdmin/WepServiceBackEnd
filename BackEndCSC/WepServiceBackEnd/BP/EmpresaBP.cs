using WebServiceBackEnd.BE;
using WebServiceBackEnd.DA;

namespace WebServiceBackEnd.BP
{
    public class EmpresaBP
    {
        private readonly EmpresaDA _empresaDA;

        public EmpresaBP(EmpresaDA empresaDA)
        {
            _empresaDA = empresaDA;
        }

        public async Task<List<dynamic>> Listar()
        {
            try
            {
                return await _empresaDA.Listar();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al listar empresas: {ex.Message}");
            }
        }

        public async Task<EmpresaBE?> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID de la empresa debe ser mayor a 0");

                return await _empresaDA.ObtenerPorId(id);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener empresa: {ex.Message}");
            }
        }

        public async Task<int> Crear(EmpresaBE empresa)
        {
            try
            {
                if (empresa == null)
                    throw new ArgumentException("Los datos de la empresa son requeridos");

                if (string.IsNullOrWhiteSpace(empresa.Empr_Clave))
                    throw new ArgumentException("La clave de la empresa es obligatoria");

                if (string.IsNullOrWhiteSpace(empresa.Empr_Nombre))
                    throw new ArgumentException("El nombre de la empresa es obligatorio");

                return await _empresaDA.Crear(empresa);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al crear empresa: {ex.Message}");
            }
        }

        public async Task<bool> Actualizar(EmpresaBE empresa)
        {
            try
            {
                if (empresa == null)
                    throw new ArgumentException("Los datos de la empresa son requeridos");

                if (empresa.Empr_Id <= 0)
                    throw new ArgumentException("El ID de la empresa es obligatorio");

                if (string.IsNullOrWhiteSpace(empresa.Empr_Clave))
                    throw new ArgumentException("La clave de la empresa es obligatoria");

                if (string.IsNullOrWhiteSpace(empresa.Empr_Nombre))
                    throw new ArgumentException("El nombre de la empresa es obligatorio");

                var empresaExistente = await _empresaDA.ObtenerPorId(empresa.Empr_Id);
                if (empresaExistente == null)
                    throw new ArgumentException("La empresa no existe en el sistema");

                return await _empresaDA.Actualizar(empresa);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al actualizar empresa: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(EmpresaBE filtros)
        {
            try
            {
                if (filtros == null)
                    filtros = new EmpresaBE();

                if (!filtros.Accion.HasValue)
                    filtros.Accion = 1;

                return await _empresaDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al listar empresas con filtros: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ObtenerEmpresasPorPermiso(int usuarioId)
        {
            try
            {
                if (usuarioId <= 0)
                    throw new ArgumentException("El ID del usuario debe ser mayor a 0");

                return await _empresaDA.ObtenerEmpresasPorPermiso(usuarioId);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener empresas por permiso: {ex.Message}");
            }
        }

        public async Task<List<dynamic>> ObtenerActivas()
        {
            try
            {
                var filtros = new EmpresaBE
                {
                    Accion = 0,
                    Empr_FiltroEstatus = true,
                    Empr_Estatus = true
                };

                return await _empresaDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en BP al obtener empresas activas: {ex.Message}");
            }
        }
    }
}