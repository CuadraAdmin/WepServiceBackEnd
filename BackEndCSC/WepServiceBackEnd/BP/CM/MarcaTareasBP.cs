using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.BP.CM
{
    public class MarcaTareasBP
    {
        private readonly MarcaTareasDA _marcaTareasDA;

        public MarcaTareasBP(IConfiguration configuration)
        {
            _marcaTareasDA = new MarcaTareasDA(configuration);
        }

        public async Task<List<dynamic>> Listar()
        {
            return await _marcaTareasDA.Listar();
        }

        public async Task<MarcaTareasBE?> ObtenerPorId(int id)
        {
            return await _marcaTareasDA.ObtenerPorId(id);
        }
        public async Task<List<dynamic>> ListarActivos()
        {
            var filtros = new MarcaTareasBE
            {
                Accion = 1,
                MarcTare_FiltroEstatus = true,
                MarcTare_Estatus = true
            };
            return await _marcaTareasDA.ListarConFiltros(filtros);
        }

        public async Task<int> Crear(MarcaTareasBE tarea)
        {
            return await _marcaTareasDA.Crear(tarea);
        }

        public async Task<bool> Actualizar(MarcaTareasBE tarea)
        {
            return await _marcaTareasDA.Actualizar(tarea);
        }

        public async Task<bool> ActualizarFechaFinalizacion(int id)
        {
            return await _marcaTareasDA.ActualizarFechaFinalizacion(id);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _marcaTareasDA.Eliminar(id);
        }

        public async Task<List<dynamic>> ListarConFiltros(MarcaTareasBE filtros)
        {
            return await _marcaTareasDA.ListarConFiltros(filtros);
        }

        public async Task<List<dynamic>> ListarPorMarca(int marcaId)
        {
            return await _marcaTareasDA.ListarPorMarca(marcaId);
        }
    }
}