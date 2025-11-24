import {
  X,
  Layers,
  Info,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ApiService from "../../Services/ApiService";
import ApiConfig from "../Config/api.config";

function MarcaClaseModal({ clave, onClose, token }) {
  const [clase, setClase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    if (clave && token) {
      cargarClase();
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [clave, onClose]);

  const cargarClase = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSMARCA.CLASES}/obtenerPorClave/${clave}`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setClase(data);
      } else {
        setError("No se encontró información para esta clase");
      }
    } catch (error) {
      setError("Error al cargar la información: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 rounded-t-3xl flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Detalle de Clase</h2>
              <p className="text-white/90 text-sm">Clase: {clave}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-700 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-600 font-medium">
                Cargando información...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-stone-600 font-medium text-center">{error}</p>
            </div>
          ) : clase ? (
            <div className="space-y-4">
              {/* Clave */}
              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-4 border border-stone-200">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-stone-600 uppercase">
                    Clave
                  </span>
                </div>
                <p className="text-2xl font-bold text-stone-900 ml-11">
                  {clase.MarcClas_Clave || "N/A"}
                </p>
              </div>

              {/* Descripción */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 uppercase">
                    Descripción
                  </span>
                </div>
                <p className="text-stone-800 font-medium ml-11 leading-relaxed text-justify">
                  {clase.MarcClas_Descripcion || "Sin descripción"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
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

export default MarcaClaseModal;
