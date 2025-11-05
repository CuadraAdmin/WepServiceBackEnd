import {
  X,
  Calendar,
  FileText,
  Tag,
  ClipboardList,
  Building2,
} from "lucide-react";

function MarcasDetails({ marca, onClose }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-MX");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div
          className="p-6 rounded-t-3xl flex items-center justify-between shrink-0"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Detalles de Marca
              </h2>
              <p className="text-white/90 text-sm">{marca.Marc_Marca}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
          <div className="space-y-5">
            {/* Generales */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Generales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Empresa
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Empr_Nombre || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Consecutivo
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Consecutivo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    País
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Pais || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Datos de Registro */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Datos de Registro
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Solicitud Nacional (Expediente)
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_SolicitudNacional || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Registro
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Registro || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Especificaciones del Producto */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Especificaciones del Producto
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div className="lg:col-span-3">
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Marca
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Marca || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Diseño
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Diseno || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Clase
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Clase || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Figura
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Figura || "N/A"}
                  </p>
                </div>
                <div className="lg:col-span-3">
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Titular
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Titular || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Título
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Titulo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Tipo
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Tipo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Rama
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Rama || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Autor
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.Marc_Autor || "N/A"}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Observaciones
                  </label>
                  <p className="text-stone-900 font-medium break-words">
                    {marca.Marc_Observaciones || "Sin observaciones"}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas y Siguientes Acciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fechas */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">Fechas</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Fecha Solicitud
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_FechaSolicitud)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Fecha Registro
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_FechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Dure
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_Dure)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Renovación
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_Renovacion)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Oposición
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_Oposicion)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Siguientes Acciones */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Siguientes Acciones
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Próxima Tarea
                    </label>
                    <p className="text-stone-900 font-medium">
                      {marca.Marc_ProximaTarea || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Fecha de Seguimiento
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_FechaSeguimiento)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Fecha de Aviso
                    </label>
                    <p className="text-stone-900 font-medium">
                      {formatDate(marca.Marc_FechaAviso)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t-2 border-stone-200 bg-white rounded-b-3xl shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarcasDetails;
