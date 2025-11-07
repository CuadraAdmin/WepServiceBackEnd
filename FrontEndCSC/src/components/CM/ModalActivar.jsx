import { CheckCircle, Check } from "lucide-react";

function ModalActivar({ show, onClose, onConfirm, marca, loading }) {
  if (!show || !marca) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-3xl">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-stone-900">
            ¿Activar Marca?
          </h2>
        </div>

        <div className="p-8">
          <p className="text-center text-stone-600 mb-6 leading-relaxed">
            ¿Estás seguro de que deseas activar la marca{" "}
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Activando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Activar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalActivar;
