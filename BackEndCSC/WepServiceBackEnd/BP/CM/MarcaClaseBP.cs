using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.BP.CM
{
    public class MarcaClaseBP
    {
        private readonly MarcaClaseDA _marcaClaseDA;

        public MarcaClaseBP(IConfiguration configuration)
        {
            _marcaClaseDA = new MarcaClaseDA(configuration);
        }

        public async Task<List<dynamic>> Listar()
        {
            return await _marcaClaseDA.Listar();
        }

        public async Task<MarcaClaseBE?> ObtenerPorId(int id)
        {
            return await _marcaClaseDA.ObtenerPorId(id);
        }

        public async Task<dynamic?> ObtenerPorClave(string clave)
        {
            return await _marcaClaseDA.ObtenerPorClave(clave);
        }

        public async Task<List<dynamic>> ListarConFiltros(MarcaClaseBE filtros)
        {
            return await _marcaClaseDA.ListarConFiltros(filtros);
        }
    }
}