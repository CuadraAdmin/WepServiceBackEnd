import { AlertCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

function ModalDesactivar({ show, onClose, onConfirm, marca, loading }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show || !marca) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-t-3xl">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-stone-900">
            ¿Desactivar Marca?
          </h2>
        </div>

        <div className="p-8">
          <p className="text-center text-stone-600 mb-6 leading-relaxed">
            ¿Estás seguro de que deseas desactivar la marca{" "}
            <span className="font-bold text-stone-900 block mt-2 text-lg">
              "{marca.Marc_Marca}"
            </span>
            ?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Desactivando...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Desactivar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDesactivar;
