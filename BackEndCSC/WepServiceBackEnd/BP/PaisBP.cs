using WebServiceBackEnd.BE;
using WebServiceBackEnd.DA;

namespace WebServiceBackEnd.BP
{
    public class PaisBP
    {
        private readonly PaisDA _paisDA;

        public PaisBP(IConfiguration configuration)
        {
            _paisDA = new PaisDA(configuration);
        }

        public async Task<List<dynamic>> Listar()
        {
            return await _paisDA.Listar();
        }

        public async Task<PaisBE?> ObtenerPorId(int paisId)
        {
            if (paisId <= 0)
                throw new ArgumentException("El ID del país es inválido");

            return await _paisDA.ObtenerPorId(paisId);
        }

        public async Task<dynamic?> ObtenerPorNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new ArgumentException("El nombre del país es inválido");

            return await _paisDA.ObtenerPorNombre(nombre);
        }

        public async Task<int> Crear(PaisBE pais)
        {
            // Validaciones
            if (string.IsNullOrWhiteSpace(pais.Pais_Clave))
                throw new ArgumentException("La clave del país es obligatoria");

            if (string.IsNullOrWhiteSpace(pais.Pais_Nombre))
                throw new ArgumentException("El nombre del país es obligatorio");

            return await _paisDA.Crear(pais);
        }

        public async Task<bool> Actualizar(PaisBE pais)
        {
            // Validaciones
            if (pais.Pais_Id <= 0)
                throw new ArgumentException("El ID del país es inválido");

            if (string.IsNullOrWhiteSpace(pais.Pais_Clave))
                throw new ArgumentException("La clave del país es obligatoria");

            if (string.IsNullOrWhiteSpace(pais.Pais_Nombre))
                throw new ArgumentException("El nombre del país es obligatorio");

            return await _paisDA.Actualizar(pais);
        }

        public async Task<bool> Eliminar(int paisId, string modificadoPor)
        {
            if (paisId <= 0)
                throw new ArgumentException("El ID del país es inválido");

            return await _paisDA.Eliminar(paisId, modificadoPor);
        }

        public async Task<bool> Activar(int paisId, string modificadoPor)
        {
            if (paisId <= 0)
                throw new ArgumentException("El ID del país es inválido");

            return await _paisDA.Activar(paisId, modificadoPor);
        }

        public async Task<List<dynamic>> ListarConFiltros(PaisBE filtros)
        {
            return await _paisDA.ListarConFiltros(filtros);
        }
    }
}