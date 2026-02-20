import { X, Save, Tag } from "lucide-react";
import Alert from "../../Globales/Alert";

const ModalFormulario = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingTipo,
  loading,
  error,
  nombreUsuario,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <div
          className="p-6 md:p-8 text-white flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold">
              {editingTipo ? "Editar Tipo de Marca" : "Nuevo Tipo de Marca"}
            </h2>
            <p className="text-white/80 mt-1 text-sm">
              {editingTipo
                ? `Modificando como: ${nombreUsuario}`
                : `Creando como: ${nombreUsuario}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {error && <Alert type="error" message={error} />}

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Descripción
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tipoMar_Nombre}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoMar_Nombre: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white uppercase"
              placeholder="Nombre"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
            <input
              type="checkbox"
              id="estatus"
              checked={formData.tipoMar_Estatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoMar_Estatus: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
              style={{ accentColor: "#6b5345" }}
            />
            <label
              htmlFor="estatus"
              className="text-sm font-semibold text-stone-700 cursor-pointer"
            >
              Tipo de marca activo
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingTipo ? "Actualizar" : "Crear"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFormulario;
