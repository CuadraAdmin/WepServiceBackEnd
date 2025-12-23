import {
  X,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  Download,
  AlertCircle,
  Bell,
} from "lucide-react";
import Alert from "../Globales/Alert";
import Select from "../Globales/Select";
import { useState, useEffect } from "react";
import ApiConfig from "../Config/api.config";
import NotificacionesForm from "./NotificacionesForm";

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
  userData,
}) {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [contactosOriginales, setContactosOriginales] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
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

  useEffect(() => {
    const cargarContactosExistentes = async () => {
      if (editingMarca && editingMarca.Marc_Id > 0) {
        try {
          const response = await fetch(
            ApiConfig.getUrl(
              `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/listar/${editingMarca.Marc_Id}`
            ),
            {
              method: "GET",
              headers: ApiConfig.getHeaders(token),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const contactosFormateados = data.map((notif) => {
              let telefono =
                notif.marcNoti_TelefonoWhatsApp ||
                notif.MarcNoti_TelefonoWhatsApp ||
                "";

              // REMOVER EL "1" SI EXISTE PARA MOSTRARLO EN EL FRONTEND
              if (telefono.startsWith("+521")) {
                telefono = "+52" + telefono.slice(4); // +5214771234567 → +524771234567
              }

              return {
                id: notif.marcNoti_Id || notif.MarcNoti_Id,
                nombre: notif.marcNoti_Nombre || notif.MarcNoti_Nombre || "",
                correo: notif.marcNoti_Correo || notif.MarcNoti_Correo || "",
                telefonoWhatsApp: telefono,
              };
            });
            setContactos(contactosFormateados);
            setContactosOriginales(contactosFormateados); // GUARDAR ORIGINALES

            if (contactosFormateados.length > 0) {
              setShowNotificaciones(true);
            }
          }
        } catch (error) {
          console.error("Error al cargar contactos:", error);
        }
      } else {
        setContactos([]);
        setContactosOriginales([]); // LIMPIAR ORIGINALES
        setShowNotificaciones(false);
      }
    };

    if (show) {
      cargarContactosExistentes();
    }
  }, [editingMarca, show, token]);

  useEffect(() => {
    const cargarPaises = async () => {
      setLoadingPaises(true);
      try {
        const response = await fetch(
          ApiConfig.getUrl(
            `${ApiConfig.ENDPOINTSPAISES.PAISES}/listarConFiltros`
          ),
          {
            method: "POST",
            headers: ApiConfig.getHeaders(token),
            body: JSON.stringify({
              Accion: 1,
              Pais_FiltroEstatus: true,
              Pais_Id: 0,
              Pais_Clave: null,
              Pais_Nombre: null,
              Pais_Estatus: true,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPaises(data);
        }
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setLoadingPaises(false);
      }
    };

    if (show) {
      cargarPaises();
    }
  }, [show, token]);

  const paisesOptions = paises.map((pais) => ({
    value: pais.Pais_Nombre,
    label: `${pais.Pais_Nombre} (${pais.Pais_Clave})`,
  }));

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

  const handleDownloadImage = async () => {
    try {
      const downloadUrl = ApiConfig.getUrl(
        `${
          ApiConfig.ENDPOINTSMARCA.ARCHIVOS
        }/descargar-imagen?url=${encodeURIComponent(previewImage)}`
      );

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar la imagen");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `diseño-${formData.Marc_Marca || "marca"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
      setError("Error al descargar la imagen");
      setTimeout(() => setError(""), 5000);
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

  const validateForm = () => {
    const errors = [];

    if (!formData.Empr_Id) {
      errors.push("Debe seleccionar una empresa");
    }

    //  PAÍS - OBLIGATORIO SIN N/A (debe tener texto real)
    if (!formData.Marc_Pais?.trim()) {
      errors.push("El país es obligatorio");
    }

    // Función auxiliar para validar campos que aceptan N/A
    const esValorValido = (valor) => {
      if (!valor) return false;
      const valorTrim = String(valor).trim();
      if (valorTrim === "") return false;
      return true; // Acepta cualquier texto, incluyendo "N/A"
    };

    //  CAMPOS OBLIGATORIOS QUE ACEPTAN N/A
    if (!esValorValido(formData.Marc_SolicitudNacional)) {
      errors.push(
        "La solicitud nacional es obligatoria (puede usar N/A si no aplica)"
      );
    }

    if (!esValorValido(formData.Marc_Registro)) {
      errors.push("El registro es obligatorio (puede usar N/A si no aplica)");
    }

    if (!esValorValido(formData.Marc_Marca)) {
      errors.push(
        "El nombre de la marca es obligatorio (puede usar N/A si no aplica)"
      );
    }

    if (!esValorValido(formData.Marc_Clase)) {
      errors.push("La clase es obligatoria (puede usar N/A si no aplica)");
    }

    if (!esValorValido(formData.Marc_Titular)) {
      errors.push("El titular es obligatorio (puede usar N/A si no aplica)");
    }

    // RENOVACIÓN - OBLIGATORIO (fecha)
    // if (!formData.Marc_Renovacion) {
    //   errors.push("La fecha de renovación es obligatoria");
    // }

    // IMAGEN DE DISEÑO - YA NO ES OBLIGATORIA
    // (se removió la validación)

    // FECHA DE AVISO - OBLIGATORIA
    // if (!formData.Marc_FechaAviso) {
    //   errors.push(
    //     "La fecha de aviso es obligatoria para el sistema de notificaciones"
    //   );
    // }

    //  VALIDAR QUE HAYA AL MENOS 1 CONTACTO
    if (contactos.length === 0) {
      errors.push("Debe agregar al menos 1 contacto de notificación");
    }

    // VALIDAR CAMPOS DE CADA CONTACTO
    contactos.forEach((contacto, index) => {
      if (!contacto.nombre?.trim()) {
        errors.push(`Contacto #${index + 1}: El nombre es obligatorio`);
      }
      if (!contacto.correo?.trim()) {
        errors.push(`Contacto #${index + 1}: El correo es obligatorio`);
      }
    });

    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError(errors[0]);

      if (!formData.Marc_FechaAviso || !formData.Marc_FechaSeguimiento) {
        setShowNotificaciones(true);
      }

      const modalContent = document.querySelector(".overflow-y-auto");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
      setTimeout(() => {
        setValidationErrors([]);
        setError("");
      }, 8000);
      return;
    }

    setValidationErrors([]);
    await onSubmit(
      e,
      {
        uploadImage: uploadImageAfterSave,
        deleteImage: deleteImageIfNeeded,
        hasImageChanges: imageFile !== null || imageToDelete,
      },
      contactos, // Contactos actuales
      contactosOriginales // NUEVO: Contactos originales
    );
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
          {/* MOSTRAR ERRORES DE VALIDACIÓN */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-2">
                    Errores de validación:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setValidationErrors([]);
                    setError("");
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {/* IMAGEN DE DISEÑO */}
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 border-2 border-stone-200">
            <label className="text-sm font-bold text-stone-700 mb-3 block">
              Imagen de Diseño
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
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg">
                    <Upload className="w-5 h-5" />
                    {previewImage ? "Cambiar Imagen" : "Subir Imagen"}
                  </div>
                </label>

                {previewImage && (
                  <>
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                      Eliminar Imagen
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-600 font-semibold hover:bg-green-100 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Descargar Imagen
                    </button>
                  </>
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
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Consecutivo: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="Consecutivo"
              />
            </div>

            {/* PAÍS - OBLIGATORIO */}
            <div className="space-y-2">
              <Select
                label="País"
                options={paisesOptions}
                value={formData.Marc_Pais}
                onChange={(value) =>
                  setFormData({ ...formData, Marc_Pais: value })
                }
                placeholder={
                  loadingPaises ? "Cargando países..." : "Seleccione un país"
                }
                required={true}
                disabled={loadingPaises}
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
              <p className="text-xs text-stone-600">
                Puede usar <span className="font-semibold">N/A</span> si no
                aplica
              </p>
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
              <p className="text-xs text-stone-600">
                Puede usar <span className="font-semibold">N/A</span> si no
                aplica
              </p>
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
              <p className="text-xs text-stone-600">
                Puede usar <span className="font-semibold">N/A</span> si no
                aplica
              </p>
            </div>

            <input type="hidden" value={formData.Marc_Diseno} />

            {/* CLASE - OBLIGATORIO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700">
                Clase <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.Marc_Clase}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    Marc_Clase: e.target.value,
                  });
                }}
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_Clase: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                placeholder="25, 35, 45"
                required
              />
              <p className="text-xs text-stone-600">
                Si son varias clases, sepárelas con comas:{" "}
                <span className="font-semibold">12, 14, 32</span>. Puede usar{" "}
                <span className="font-semibold">N/A</span> si no aplica
              </p>
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
              <p className="text-xs text-stone-600">
                Puede usar <span className="font-semibold">N/A</span> si no
                aplica
              </p>
            </div>
            {/* LICENCIAMIENTO - NUEVO CAMPO */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-700">
                Licenciamiento
              </label>
              <textarea
                value={formData.Marc_licenciamiento || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Marc_licenciamiento: e.target.value,
                  })
                }
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    Marc_licenciamiento: e.target.value.trim(),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                rows="3"
                placeholder="Licenciamiento"
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
                Renovación
                {/* <span className="text-red-600">*</span> */}
              </label>
              <input
                type="date"
                value={formData.Marc_Renovacion || ""}
                onChange={(e) => {
                  const nuevaFecha = e.target.value;
                  setFormData({
                    ...formData,
                    Marc_Renovacion: nuevaFecha,
                    Marc_FechaAviso: nuevaFecha,
                  });
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                // required
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
          </div>
          {/* SECCIÓN DE NOTIFICACIONES*/}
          <div className="md:col-span-2 space-y-4">
            <div className="border rounded-xl p-4 bg-stone-50 border-stone-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-stone-600" />
                    <h3 className="font-semibold text-stone-800">
                      Sistema de Notificaciones
                    </h3>
                    {(!formData.Marc_FechaAviso ||
                      !formData.Marc_FechaSeguimiento) && (
                      <span className="text-xs px-2 py-0.5 bg-stone-600 text-white rounded font-medium">
                        Requerido
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Se enviarán notificaciones 30, 15 y 1 día antes de la fecha
                    de aviso
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotificaciones(!showNotificaciones)}
                  className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm font-medium"
                >
                  {showNotificaciones ? "Ocultar" : "Gestionar"}
                </button>
              </div>
            </div>

            {showNotificaciones && (
              <NotificacionesForm
                marcaId={formData.Marc_Id}
                formData={formData}
                setFormData={setFormData}
                userData={userData}
                token={token}
                contactos={contactos}
                setContactos={setContactos}
              />
            )}
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
