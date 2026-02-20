import {
  X,
  Calendar,
  FileText,
  Tag,
  ClipboardList,
  Building2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import ApiService from "../../Services/ApiService";
import ApiConfig from "../Config/api.config";

function MarcasDetails({ marca, onClose, token }) {
  const [acciones, setAcciones] = useState([]);
  const [loadingAcciones, setLoadingAcciones] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (marca?.Marc_Id && token) {
      cargarAcciones();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [marca]);

  const cargarAcciones = async () => {
    setLoadingAcciones(true);
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSMARCA.TAREAS}/listar/activosPorMarca/${marca.Marc_Id}`,
        token,
      );
      if (response.ok) {
        const data = await response.json();
        setAcciones(data);
      }
    } catch (error) {
      console.error("Error al cargar acciones:", error);
    } finally {
      setLoadingAcciones(false);
    }
  };

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
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Tipo de Marca
                  </label>
                  <p className="text-stone-900 font-medium">
                    {marca.TipoMar_Nombre || "N/A"}
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-2">
                    Diseño
                  </label>
                  <div className="w-full aspect-square rounded-xl border-2 border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden shadow-sm">
                    {marca.Marc_Diseno ? (
                      <img
                        src={marca.Marc_Diseno}
                        alt={marca.Marc_Marca || "Diseño de marca"}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="flex flex-col items-center justify-center gap-2 text-stone-400"
                      style={{
                        display: marca.Marc_Diseno ? "none" : "flex",
                      }}
                    >
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-sm font-medium">Sin diseño</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Marca
                    </label>
                    <p className="text-stone-900 font-medium">
                      {marca.Marc_Marca || "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                        Tipo
                      </label>
                      <p className="text-stone-900 font-medium">
                        {marca.Marc_Tipo || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                  <div className="pt-3 border-t border-stone-200">
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Titular
                    </label>
                    <p className="text-stone-900 font-medium">
                      {marca.Marc_Titular || "N/A"}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-200">
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Licenciamiento
                    </label>
                    <p className="text-stone-900 font-medium break-words whitespace-pre-wrap">
                      {marca.Marc_licenciamiento || "N/A"}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-200">
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                      Observaciones
                    </label>
                    <p className="text-stone-900 font-medium break-words">
                      {marca.Marc_Observaciones || "Sin observaciones"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas y Acciones - Ambas cards con altura fija igual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fechas */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200 md:h-72">
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Fecha Solicitud
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_FechaSolicitud)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Fecha Registro
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_FechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Dure
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_Dure)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Renovación
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_Renovacion)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Oposición
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_Oposicion)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Seguimiento
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_FechaSeguimiento)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-stone-600 uppercase block mb-1">
                      Fecha de Aviso
                    </label>
                    <p className="text-stone-900 font-medium text-sm">
                      {formatDate(marca.Marc_FechaAviso)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones - Card con scroll interno */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-stone-200 md:h-72 flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-stone-200 shrink-0">
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
                    Acciones ({acciones.length})
                  </h3>
                </div>

                {/* Scroll interno que ocupa todo el espacio */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {loadingAcciones ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
                    </div>
                  ) : acciones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-500">
                      <ClipboardList className="w-8 h-8 mb-2 text-stone-300" />
                      <p className="text-sm font-medium">
                        No hay acciones pendientes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 pr-1">
                      {acciones.map((accion) => (
                        <div
                          key={accion.MarcTare_Id}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-stone-900 break-words">
                                {accion.MarcTare_Descripcion}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">
                                {"Fecha Creación: " +
                                  formatDate(accion.MarcTare_FechaCreacion)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t-2 border-stone-200 bg-white rounded-b-3xl shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
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
