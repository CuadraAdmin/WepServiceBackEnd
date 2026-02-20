using WebServiceBackEnd.BE.CM.CM_TipoMarca;
using WebServiceBackEnd.DA.CM.CM_TipoMarca;

namespace WebServiceBackEnd.BP.CM.CM_TipoMarca
{
    public class TipoMarcaBP
    {
        private readonly TipoMarcaDA _tipoMarcaDA;

        public TipoMarcaBP(TipoMarcaDA tipoMarcaDA)
        {
            _tipoMarcaDA = tipoMarcaDA;
        }

        public async Task<List<TipoMarcaBE>> Listar()
        {
            return await _tipoMarcaDA.Listar();
        }

        public async Task<TipoMarcaBE?> ObtenerPorId(int id)
        {
            return await _tipoMarcaDA.ObtenerPorId(id);
        }

        public async Task<int> Crear(TipoMarcaBE tipoMarca)
        {
            if (string.IsNullOrWhiteSpace(tipoMarca.TipoMar_Nombre))
            {
                throw new Exception("El nombre del tipo de marca es requerido");
            }

            return await _tipoMarcaDA.Crear(tipoMarca);
        }

        public async Task<bool> Actualizar(TipoMarcaBE tipoMarca)
        {
            if (string.IsNullOrWhiteSpace(tipoMarca.TipoMar_Nombre))
            {
                throw new Exception("El nombre del tipo de marca es requerido");
            }

            return await _tipoMarcaDA.Actualizar(tipoMarca);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _tipoMarcaDA.Eliminar(id);
        }

        public async Task<bool> Activar(int id)
        {
            if (id <= 0)
                throw new ArgumentException("El ID del tipo de marca es inválido");

            return await _tipoMarcaDA.Activar(id);
        }

        public async Task<List<dynamic>> ListarConFiltros(TipoMarcaBE filtros)
        {
            try
            {
                return await _tipoMarcaDA.ListarConFiltros(filtros);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los tipos de marca: {ex.Message}");
            }
        }
    }
}
