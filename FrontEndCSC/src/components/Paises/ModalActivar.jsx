import { CheckCircle } from "lucide-react";

function ModalActivar({ show, onClose, onConfirm, pais, loading }) {
  if (!show || !pais) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Activar País</h2>
              <p className="text-sm text-stone-600">
                El país estará disponible nuevamente
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-stone-700">
              ¿Estás seguro de activar el país{" "}
              <span className="font-bold">{pais.Pais_Nombre}</span>?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? "Activando..." : "Activar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalActivar;
