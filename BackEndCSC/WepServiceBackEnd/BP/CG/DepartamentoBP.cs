using WebServiceBackEnd.BE.CG;
using WebServiceBackEnd.DA.CG;

namespace WebServiceBackEnd.BP.CG
{
    public class DepartamentoBP
    {
        public readonly DepartamentoDA _DepartamentoDA;

        public DepartamentoBP(IConfiguration configuration)
        {
            _DepartamentoDA = new DepartamentoDA(configuration);
        }

        public async Task<List<DepartamentoBE>> Listar()
        {
            return await _DepartamentoDA.Listar();
        }
        public async Task<DepartamentoBE?> ObtenerPorId(int depaId)
        {
            if (depaId <= 0)
                throw new ArgumentException("El ID del departamento es inválido");
            return await _DepartamentoDA.ObtenerPorId(depaId);
        }
        public async Task<int> Crear(DepartamentoBE Departamento)
        {
            // Validaciones
            if (string.IsNullOrWhiteSpace(Departamento.Depa_Clave))
                throw new ArgumentException("La clave del departamento es obligatoria");
            if (string.IsNullOrWhiteSpace(Departamento.Depa_Nombre))
                throw new ArgumentException("El nombre del departamento es obligatorio");
            if (Departamento.Empr_Id <= 0)
                throw new ArgumentException("El Empresa no existe");
            return await _DepartamentoDA.Crear(Departamento);
        }
        public async Task<bool> Actualizar(DepartamentoBE Departamento)
        {
            // Validaciones
            try
            {
                if (Departamento == null)
                    throw new ArgumentNullException("Los datos del departamento son obligatorios");
                if (Departamento.Depa_Id <= 0)
                    throw new ArgumentException("El ID del departamento es obligatorio");
                if (string.IsNullOrWhiteSpace(Departamento.Depa_Clave))
                    throw new ArgumentException("La clave del departamento es obligatoria");
                if (string.IsNullOrWhiteSpace(Departamento.Depa_Nombre))
                    throw new ArgumentException("El nombre del departamento es obligatorio");
                if (Departamento.Empr_Id <= 0)
                    throw new ArgumentException("La empresa es requerida");

                var departamentoExistente = await _DepartamentoDA.ObtenerPorId(Departamento.Depa_Id);
                if (departamentoExistente == null)
                    throw new InvalidOperationException("El departamento no existe");
                departamentoExistente.Depa_ModificadoFecha = DateTime.Now;

                return await _DepartamentoDA.Actualizar(Departamento);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el departamento: {ex.Message}", ex);
            }
           
        }

        public async Task<bool> Eliminar(int depaId, string? modificadoPor= null)
        {
            try
            {
                if (depaId <= 0)
                    throw new ArgumentException("El ID del departamento es obligatorio");
                var departamentoExistente = await _DepartamentoDA.ObtenerPorId(depaId);
                
                if (departamentoExistente == null)
                    throw new InvalidOperationException("El departamento no existe");
                if(!departamentoExistente.Depa_Estatus)
                    throw new InvalidOperationException("El departamento ya se encuentra inactivo");
                
                return await _DepartamentoDA.Eliminar(depaId, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el departamento: {ex.Message}", ex);
            }
            
        }
        public async Task<bool> Activar(int id, string? modificadoPor= null)
        {
            try
            {
                if(id <= 0)
                    throw new ArgumentException("El ID del departamento es obligatorio");
                var marca = await _DepartamentoDA.ObtenerPorId(id);
                if(marca == null)
                    throw new InvalidOperationException("El departamento no existe");

                if(marca.Depa_Estatus)
                    throw new InvalidOperationException("El departamento ya se encuentra activo");

                return await _DepartamentoDA.Activar(id, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {

                throw new Exception ($"Error al activar el departamento: {ex.Message}", ex);
            }
        }

        public async Task<List<dynamic>> ListarConFiltros(DepartamentoBE filtros)
        {
            try
            {
                if(filtros == null)
                    filtros = new DepartamentoBE();
                if (!filtros.Accion.HasValue)
                    filtros.Accion = 1;

                return await _DepartamentoDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar departamentos con filtros: {ex.Message}", ex);
            }
        }
            
    }
}

