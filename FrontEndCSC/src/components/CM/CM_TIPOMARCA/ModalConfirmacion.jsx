import { AlertCircle, CheckCircle, Trash2, Check } from "lucide-react";

const ModalConfirmacion = ({
  show,
  type = "delete",
  tipo,
  onConfirm,
  onCancel,
  loading,
  nombreUsuario,
}) => {
  if (!show || !tipo) return null;

  const config = {
    delete: {
      title: "¿Desactivar Tipo de Marca?",
      bgGradient: "from-red-50 to-rose-50",
      iconBg: "from-red-100 to-red-200",
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      buttonBg:
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
      buttonText: "Desactivar",
      buttonIcon: <Trash2 className="w-5 h-5" />,
      message: "desactivar",
    },
    activate: {
      title: "¿Activar Tipo de Marca?",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "from-green-100 to-green-200",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      buttonBg:
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
      buttonText: "Activar",
      buttonIcon: <Check className="w-5 h-5" />,
      message: "activar",
    },
  };

  const {
    title,
    bgGradient,
    iconBg,
    icon,
    buttonBg,
    buttonText,
    buttonIcon,
    message,
  } = config[type];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
          <div className={`p-8 bg-gradient-to-br ${bgGradient} rounded-t-3xl`}>
            <div
              className={`w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-center text-stone-900">
              {title}
            </h2>
            <p className="text-center text-stone-600 mt-2 text-sm">
              Operación realizada por: {nombreUsuario}
            </p>
          </div>

          <div className="p-8">
            <p className="text-center text-stone-600 mb-6 leading-relaxed">
              ¿Estás seguro de que deseas {message} el tipo de marca{" "}
              <span className="font-bold text-stone-900 block mt-2 text-lg break-words">
                "{tipo.tipoMar_Nombre}"
              </span>
              ?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-6 py-3 ${buttonBg} text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {type === "delete" ? "Desactivando..." : "Activando..."}
                  </>
                ) : (
                  <>
                    {buttonIcon}
                    {buttonText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirmacion;
