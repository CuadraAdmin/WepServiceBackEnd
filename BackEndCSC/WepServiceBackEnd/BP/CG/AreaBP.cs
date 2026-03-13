using WebServiceBackEnd.BE.CG;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA;
using WebServiceBackEnd.DA.CG;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.BP.CG
{
    public class AreaBP
    {
        private readonly AreaDA _AreaDA;

        public AreaBP(IConfiguration configuration)
        {
            _AreaDA = new AreaDA(configuration);
        }

        public async Task<List<dynamic>> Listar(int Accion)
        {
            AreaBE newArea = new AreaBE();
            newArea.Accion = Accion;
            return await _AreaDA.Listar(newArea);
        }
        public async Task<AreaBE?> ObtenerPorId(int areaId)
        {
            try
            {
                if (areaId <= 0)
                    throw new ArgumentException("El ID del área es inválido");
                return await _AreaDA.ObtenerPorId(areaId);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el área: {ex.Message}");
            }

        }
        public async Task<int> Crear(AreaBE Area)
        {
            try
            {
                // Validaciones
                if (string.IsNullOrWhiteSpace(Area.Area_Clave))
                    throw new ArgumentException("La clave del área es obligatoria");
                if (string.IsNullOrWhiteSpace(Area.Area_Nombre))
                    throw new ArgumentException("El nombre del área es obligatorio");
                if (Area.Depa_Id <= 0)
                    throw new ArgumentException("El Departamento no existe");
                return await _AreaDA.Crear(Area);
            }
            catch (ArgumentException)
            {

                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear el área: {ex.Message}");
            }

        }
        public async Task<bool> Actualizar(AreaBE area)
        {
            try
            {
                // Validaciones
                if (area == null)
                    throw new ArgumentException("Los datos de el área son requeridos");
                if (string.IsNullOrWhiteSpace(area.Area_Clave))
                    throw new ArgumentException("La clave del área es obligatoria");
                if (string.IsNullOrWhiteSpace(area.Area_Nombre))
                    throw new ArgumentException("El nombre del área es obligatorio");
                if (area.Depa_Id <= 0)
                    throw new ArgumentException("El Departamento no existe");
                return await _AreaDA.Actualizar(area);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el área: {ex.Message}");
            }
        }

        public async Task<bool> Eliminar(int id, string? modificadoPor = null)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID del área debe ser mayor a 0");

                var area = await _AreaDA.ObtenerPorId(id);
                if (area == null)
                    throw new ArgumentException("El área no existe en el sistema");

                if (!area.Area_Estatus)
                    throw new ArgumentException("El área ya está eliminada");

                return await _AreaDA.Eliminar(id, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el área: {ex.Message}");
            }
        }
        public async Task<bool> Activar(int id, string? modificadoPor = null)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID del área debe ser mayor a 0");

                var marca = await _AreaDA.ObtenerPorId(id);
                if (marca == null)
                    throw new ArgumentException("El área no existe en el sistema");

                if (marca.Area_Estatus)
                    throw new ArgumentException("El área ya está activa");

                return await _AreaDA.Activar(id, modificadoPor);
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error  al activar el área: {ex.Message}");
            }
        }
        public async Task<List<dynamic>> ListarConFiltros(AreaBE filtros)
        {
            try
            {
                if (filtros == null)
                    filtros = new AreaBE();

                if (!filtros.Accion.HasValue)
                    filtros.Accion = 1;

                var Areas = await _AreaDA.ListarConFiltros(filtros);



                return Areas;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar las áreas con filtros: {ex.Message}");
            }
        }
    }
}
