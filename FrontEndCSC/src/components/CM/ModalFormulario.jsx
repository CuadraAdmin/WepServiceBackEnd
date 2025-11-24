import { X, Save, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import Alert from "../Globales/Alert";
import Select from "../Globales/Select";
import { useState, useEffect } from "react";
import ApiConfig from "../Config/api.config";

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
  token,
}) {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(false);

  useEffect(() => {
    setPreviewImage(formData.Marc_Diseno || null);
    setImageFile(null);
    setImageToDelete(false);

    // Bloquear scroll del body
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [formData.Marc_Diseno, show]);

  if (!show) return null;

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen excede el tamaño máximo de 5MB");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setImageFile(file);
      setImageToDelete(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;
    setPreviewImage(null);
    setImageFile(null);
    setImageToDelete(true);
  };

  const uploadImageAfterSave = async (marcaId) => {
    if (!imageFile) return null;

    try {
      const formDataImg = new FormData();
      formDataImg.append("file", imageFile);

      const response = await fetch(
        ApiConfig.getUrl(
          `${ApiConfig.ENDPOINTSMARCA.ARCHIVOS}/upload-diseno/${marcaId}`
        ),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataImg,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error("Error al subir la imagen");
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteImageIfNeeded = async () => {
    if (!imageToDelete || !formData.Marc_Diseno) return;

    try {
      const response = await fetch(
        ApiConfig.getUrl(`${ApiConfig.ENDPOINTSMARCA.ARCHIVOS}/eliminar`),
        {
          method: "DELETE",
          headers: {
            ...ApiConfig.getHeaders(token),
          },
          body: JSON.stringify({ url: formData.Marc_Diseno }),
        }
      );

      if (!response.ok) {
        console.error("Error al eliminar imagen anterior");
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e, {
      uploadImage: uploadImageAfterSave,
      deleteImage: deleteImageIfNeeded,
      hasImageChanges: imageFile !== null || imageToDelete,
    });
  };

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

        <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
          {/* IMAGEN DE DISEÑO */}
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 border-2 border-stone-200">
            <label className="text-sm font-bold text-stone-700 mb-3 block">
              Imagen de Diseño <span className="text-red-600">*</span>
            </label>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-48 rounded-xl border-2 border-stone-300 bg-white flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Diseño de marca"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-400">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    required={!previewImage && !editingMarca}
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg">
                    <Upload className="w-5 h-5" />
                    {previewImage ? "Cambiar Imagen" : "Subir Imagen"}
                  </div>
                </label>

                {previewImage && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Eliminar Imagen
                  </button>
                )}

                <p className="text-xs text-stone-600 mt-2">
                  Formatos: JPG, PNG, GIF. Máximo 5MB.
                  {!editingMarca && (
                    <span className="block text-amber-600 font-semibold mt-1">
                      La imagen se subirá al guardar la marca
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

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
                Consecutivo <span className="text-red-600">*</span>
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Consecutivo: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Consecutivo"
                required
              />
            </div>

            {/* PAÍS - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                País <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.Marc_Pais}
                onChange={(e) =>
                  setFormData({ ...formData, Marc_Pais: e.target.value })
                }
                onBlur={(e) =>
                  setFormData({ ...formData, Marc_Pais: e.target.value.trim() })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="País"
                required
              />
            </div>

            {/* SOLICITUD NACIONAL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Solicitud Nacional (Expediente){" "}
                <span className="text-red-600">*</span>
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_SolicitudNacional: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Expediente"
                required
              />
            </div>

            {/* REGISTRO - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Registro <span className="text-red-600">*</span>
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Registro: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Registro"
                required
              />
            </div>

            {/* MARCA - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Marca <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.Marc_Marca}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Marca: e.target.value,
                  })
                }
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Marca: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Nombre de la marca"
                required
              />
            </div>

            <input type="hidden" value={formData.Marc_Diseno} />

            {/* CLASE - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Clase <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.Marc_Clase}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo permitir números
                  if (/^\d*$/.test(value)) {
                    setFormData({
                      ...formData,
                      Marc_Clase: value,
                    });
                  }
                }}
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Clase: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Clase"
                required
              />
            </div>

            {/* TITULAR - OBLIGATORIO */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-700">
                Titular <span className="text-red-600">*</span>
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Titular: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Titular"
                required
              />
            </div>

            {/* FIGURA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">Figura</label>
              <input
                type="text"
                value={formData.Marc_Figura}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Figura: e.target.value,
                  })
                }
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Figura: e.target.value.trim(),
                  })
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
                  setFormData({
                    ...formData,
                    Marc_Titulo: e.target.value,
                  })
                }
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Titulo: e.target.value.trim(),
                  })
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
                onBlur={(e) =>
                  setFormData({ ...formData, Marc_Tipo: e.target.value.trim() })
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
                onBlur={(e) =>
                  setFormData({ ...formData, Marc_Rama: e.target.value.trim() })
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
                  setFormData({
                    ...formData,
                    Marc_Autor: e.target.value,
                  })
                }
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Autor: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Autor"
              />
            </div>

            {/* OBSERVACIONES */}
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Observaciones: e.target.value.trim(),
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

            {/* RENOVACION - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Renovación <span className="text-red-600">*</span>
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
                required
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
            {/* PRÓXIMA TAREA
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_ProximaTarea: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Próxima tarea"
              />
            </div>
            */}

            {/* FECHA SEGUIMIENTO */}
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

            {/* FECHA AVISO */}
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
