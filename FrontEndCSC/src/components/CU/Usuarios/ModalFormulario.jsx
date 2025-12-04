import { X, Save, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Alert from "../../Globales/Alert";

const ModalFormulario = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingUsuario,
  loading,
  error,
  nombreUsuario,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!show) return null;

  const validateForm = () => {
    if (!formData.usua_Usuario || formData.usua_Usuario.trim() === "") {
      setValidationError("El campo Usuario es requerido");
      return false;
    }
    if (!formData.usua_Nombre || formData.usua_Nombre.trim() === "") {
      setValidationError("El campo Nombre Completo es requerido");
      return false;
    }
    // Validar correo solo si se proporciona
    if (formData.usua_Correo && formData.usua_Correo.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.usua_Correo)) {
        setValidationError("El correo debe contener @ y un dominio válido");
        return false;
      }
    }
    // Validar teléfono solo si se proporciona
    if (formData.usua_Telefono && formData.usua_Telefono.trim() !== "") {
      if (formData.usua_Telefono.length < 10) {
        setValidationError("El teléfono debe tener 10 dígitos");
        return false;
      }
    }
    if (!editingUsuario) {
      if (!formData.usua_Contrasena || formData.usua_Contrasena.trim() === "") {
        setValidationError("El campo Contraseña es requerido");
        return false;
      }
      if (formData.usua_Contrasena.length < 6) {
        setValidationError("La contraseña debe tener al menos 6 caracteres");
        return false;
      }
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div
          className="p-6 md:p-8 text-white flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <p className="text-white/80 mt-1 text-sm">
              {editingUsuario
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

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && <Alert type="error" message={error} />}
          {validationError && <Alert type="error" message={validationError} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuario
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="usuario-field"
                value={formData.usua_Usuario}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usua_Usuario: e.target.value,
                  })
                }
                autoComplete="off"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre Completo
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre-field"
                value={formData.usua_Nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usua_Nombre: e.target.value,
                  })
                }
                autoComplete="off"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email-unique-field"
                value={formData.usua_Correo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usua_Correo: e.target.value,
                  })
                }
                autoComplete="new-email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Ingrese un correo válido"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono-field"
                value={formData.usua_Telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    usua_Telefono: value,
                  });
                }}
                autoComplete="off"
                pattern="[0-9]{10}"
                maxLength={10}
                title="Ingrese un teléfono de 10 dígitos"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          {!editingUsuario && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="new-password-unique"
                  value={formData.usua_Contrasena}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usua_Contrasena: e.target.value,
                    })
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                  title="La contraseña debe tener al menos 6 caracteres"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
            <input
              type="checkbox"
              id="estatus"
              checked={formData.usua_Estatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  usua_Estatus: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
              style={{ accentColor: "#6b5345" }}
            />
            <label
              htmlFor="estatus"
              className="text-sm font-semibold text-stone-700 cursor-pointer"
            >
              Usuario activo
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
              onClick={handleSubmit}
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
                  {editingUsuario ? "Actualizar" : "Crear"} Usuario
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
