import { X, Building2, Hash, FileText } from "lucide-react";
import { useEffect } from "react";

function ModalFormulario({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
  error,
  setError,
  editingEmpresa,
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo convertir a mayúsculas, NO hacer trim mientras escribe
    let processedValue = value.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    setError("");
  };

  const handleSubmitWithTrim = (e) => {
    e.preventDefault();

    // Hacer trim solo al enviar el formulario
    const cleanedData = {
      ...formData,
      Empr_Clave: formData.Empr_Clave.trim(),
      Empr_Nombre: formData.Empr_Nombre.trim(),
    };

    setFormData(cleanedData);
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div
          className="sticky top-0 z-10 px-6 py-4 border-b border-stone-200 flex items-center justify-between text-white rounded-t-2xl"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {editingEmpresa ? "Editar Empresa" : "Nueva Empresa"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitWithTrim} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
              <Hash className="w-4 h-4 text-stone-500" />
              Clave *
            </label>
            <input
              type="text"
              name="Empr_Clave"
              value={formData.Empr_Clave}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all uppercase"
              placeholder="CLAVE DE LA EMPRESA"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
              <FileText className="w-4 h-4 text-stone-500" />
              Nombre *
            </label>
            <textarea
              name="Empr_Nombre"
              value={formData.Empr_Nombre}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all uppercase resize-none"
              placeholder="NOMBRE DE LA EMPRESA"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              {loading
                ? "Guardando..."
                : editingEmpresa
                ? "Actualizar"
                : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalFormulario;
