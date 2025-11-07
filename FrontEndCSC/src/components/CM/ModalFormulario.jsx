import { X, Save } from "lucide-react";
import Alert from "../Globales/Alert";
import Select from "../Globales/Select";

function ModalFormulario({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  empresasOptions,
  loading,
  error,
  setError,
  editingMarca,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div
          className="p-8 rounded-t-3xl"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editingMarca ? "Editar Marca" : "Nueva Marca"}
              </h2>
              {editingMarca && formData.Marc_Marca && (
                <p className="text-white/90 text-sm mt-1">
                  {formData.Marc_Marca}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* EMPRESA - OBLIGATORIO */}
            <div className="md:col-span-2">
              <Select
                label="Empresa"
                options={empresasOptions}
                value={formData.Empr_Id}
                onChange={(value) =>
                  setFormData({ ...formData, Empr_Id: value })
                }
                placeholder="Seleccione una empresa"
                required={true}
              />
            </div>

            {/* CONSECUTIVO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Consecutivo
              </label>
              <input
                type="text"
                value={formData.Marc_Consecutivo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Consecutivo: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Consecutivo"
              />
            </div>

            {/* PAÍS */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">País</label>
              <input
                type="text"
                value={formData.Marc_Pais}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Pais: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Pais"
              />
            </div>

            {/* SOLICITUD NACIONAL (EXPEDIENTE) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Solicitud Nacional (Expediente)
              </label>
              <input
                type="text"
                value={formData.Marc_SolicitudNacional}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_SolicitudNacional: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Expediente"
              />
            </div>

            {/* REGISTRO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Registro
              </label>
              <input
                type="text"
                value={formData.Marc_Registro}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Registro: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Registro"
              />
            </div>

            {/* MARCA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Marca</label>
              <input
                type="text"
                value={formData.Marc_Marca}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Marca: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Nombre de la marca"
              />
            </div>

            {/* DISEÑO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Diseño</label>
              <input
                type="text"
                value={formData.Marc_Diseno}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Diseno: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Diseño"
              />
            </div>

            {/* CLASE */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Clase</label>
              <input
                type="text"
                value={formData.Marc_Clase}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Clase: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Clase"
              />
            </div>

            {/* TITULAR - 2 columnas */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-700">
                Titular
              </label>
              <input
                type="text"
                value={formData.Marc_Titular}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Titular: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Titular"
              />
            </div>

            {/* FIGURA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Figura</label>
              <input
                type="text"
                value={formData.Marc_Figura}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Figura: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Figura"
              />
            </div>

            {/* TÍTULO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Título</label>
              <input
                type="text"
                value={formData.Marc_Titulo}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Titulo: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Título"
              />
            </div>

            {/* TIPO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Tipo</label>
              <input
                type="text"
                value={formData.Marc_Tipo}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Tipo: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Tipo"
              />
            </div>

            {/* RAMA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Rama</label>
              <input
                type="text"
                value={formData.Marc_Rama}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Rama: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Rama"
              />
            </div>

            {/* AUTOR */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Autor</label>
              <input
                type="text"
                value={formData.Marc_Autor}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Autor: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Autor"
              />
            </div>

            {/* OBSERVACIONES - 2 columnas */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-700">
                Observaciones
              </label>
              <textarea
                value={formData.Marc_Observaciones}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Observaciones: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                rows="3"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* FECHA SOLICITUD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Fecha Solicitud
              </label>
              <input
                type="date"
                value={formData.Marc_FechaSolicitud || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_FechaSolicitud: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* FECHA REGISTRO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Fecha Registro
              </label>
              <input
                type="date"
                value={formData.Marc_FechaRegistro || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_FechaRegistro: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* DURE */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Dure</label>
              <input
                type="date"
                value={formData.Marc_Dure || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Dure: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* RENOVACION */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Renovación
              </label>
              <input
                type="date"
                value={formData.Marc_Renovacion || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Renovacion: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* OPOSICIÓN */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Oposición
              </label>
              <input
                type="date"
                value={formData.Marc_Oposicion || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Oposicion: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* PRÓXIMA TAREA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Próxima Tarea
              </label>
              <input
                type="text"
                value={formData.Marc_ProximaTarea}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_ProximaTarea: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Próxima tarea"
              />
            </div>

            {/* FECHA DE SEGUIMIENTO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Fecha de Seguimiento
              </label>
              <input
                type="date"
                value={formData.Marc_FechaSeguimiento || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_FechaSeguimiento: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            {/* FECHA DE AVISO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Fecha de Aviso
              </label>
              <input
                type="date"
                value={formData.Marc_FechaAviso || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_FechaAviso: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          {/* ALERTA DE ERROR DENTRO DEL MODAL */}
          {error && (
            <div className="mt-4">
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
            <input
              type="checkbox"
              id="activo"
              checked={formData.Marc_Estatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Marc_Estatus: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
              style={{ accentColor: "#6b5345" }}
            />
            <label
              htmlFor="activo"
              className="text-sm font-semibold text-stone-700 cursor-pointer"
            >
              Marca activa
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
              type="submit"
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
                  {editingMarca ? "Actualizar" : "Crear"} Marca
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalFormulario;
