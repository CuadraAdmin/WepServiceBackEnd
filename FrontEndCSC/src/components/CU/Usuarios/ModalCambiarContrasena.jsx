import { X, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Alert from "../../Globales/Alert";

const ModalCambiarContrasena = ({
  show,
  usuario,
  onClose,
  onSubmit,
  passwordData,
  setPasswordData,
  loading,
  error,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!show || !usuario) return null;

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
            <h2 className="text-2xl font-bold">Cambiar Contraseña</h2>
            <p className="text-white/80 mt-1 text-sm">{usuario.usua_Nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          {error && <Alert type="error" message={error} />}

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Nueva Contraseña
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.contrasenaNueva}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    contrasenaNueva: e.target.value,
                  })
                }
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Ingrese la nueva contraseña (mín. 6 caracteres)"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirmar Contraseña
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.confirmarContrasena}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmarContrasena: e.target.value,
                })
              }
              required
              autoComplete="new-password"
              placeholder="Confirme la nueva contraseña"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Cambiando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarContrasena;
