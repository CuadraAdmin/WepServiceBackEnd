import { X, Layers, Info, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ApiService from "../../Services/ApiService";
import ApiConfig from "../Config/api.config";

function MarcaClaseModal({ claves, onClose, token }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarClases = useCallback(async () => {
    setLoading(true);
    setError("");

    // Separar claves si vienen separadas por comas
    const clavesArray =
      typeof claves === "string"
        ? claves
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c)
        : Array.isArray(claves)
        ? claves
        : [claves];

    if (clavesArray.length === 0) {
      setError("No hay clases para cargar");
      setLoading(false);
      return;
    }

    const clasesObtenidas = [];

    try {
      // Hacer una petición por cada clave
      for (const clave of clavesArray) {
        try {
          const response = await ApiService.get(
            `${ApiConfig.ENDPOINTSMARCA.CLASES}/obtenerPorClave/${clave}`,
            token
          );

          if (response.ok) {
            const data = await response.json();
            clasesObtenidas.push(data);
          } else {
            clasesObtenidas.push({
              MarcClas_Clave: clave,
              MarcClas_Descripcion: null,
              error: "No se encontró información",
            });
          }
        } catch (err) {
          clasesObtenidas.push({
            MarcClas_Clave: clave,
            MarcClas_Descripcion: null,
            error: err.message,
          });
        }
      }

      setClases(clasesObtenidas);
    } catch (error) {
      setError("Error al cargar las clases: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [claves, token]); // Ahora claves y token están en las dependencias

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    if (claves && token) {
      cargarClases();
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [claves, token, cargarClases, onClose]); // Incluir cargarClases y onClose

  // Calcular clavesArray para el render
  const clavesArray =
    typeof claves === "string"
      ? claves
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c)
      : Array.isArray(claves)
      ? claves
      : [claves];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 md:p-6 rounded-t-3xl flex items-center justify-between gap-3"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="p-2 md:p-3 bg-white/20 rounded-xl flex-shrink-0">
              <Layers className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">
                {clavesArray.length > 1
                  ? `Detalle de ${clavesArray.length} Clases`
                  : "Detalle de Clase"}
              </h2>
              <p className="text-white/90 text-xs md:text-sm truncate">
                {clavesArray.length > 1
                  ? `Clases: ${clavesArray.join(", ")}`
                  : `Clase: ${clavesArray[0]}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
          ) : clases.length > 0 ? (
            <div className="space-y-4">
              {clases.map((clase, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-4 border-2 transition-all hover:shadow-md ${
                    clase.error
                      ? "border-red-200 bg-red-50"
                      : "border-stone-200"
                  }`}
                >
                  {/* Clave */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        background: clase.error
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)"
                          : "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                      }}
                    >
                      <Layers
                        className={`w-4 h-4 ${
                          clase.error ? "text-red-600" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-stone-600 uppercase block">
                        Clase
                      </span>
                      <p className="text-xl md:text-2xl font-bold text-stone-900 break-words">
                        {clase.MarcClas_Clave || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Descripción o Error */}
                  <div className="bg-white rounded-xl p-3 border border-stone-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{
                          background: clase.error
                            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)"
                            : "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                        }}
                      >
                        <Info
                          className={`w-4 h-4 ${
                            clase.error ? "text-red-600" : "text-white"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-stone-600 uppercase">
                        Descripción
                      </span>
                    </div>
                    {clase.error ? (
                      <p className="text-red-700 font-medium ml-11 flex items-center gap-2">
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        {clase.error}
                      </p>
                    ) : (
                      <p className="text-stone-800 font-medium ml-11 leading-relaxed text-justify break-words">
                        {clase.MarcClas_Descripcion || "Sin descripción"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-stone-500 font-medium">
                No se encontraron clases
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl">
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
