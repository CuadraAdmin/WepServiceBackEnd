import { AlertCircle, CheckCircle, X } from "lucide-react";

const Alert = ({ type, message, onClose }) => {
  const styles = {
    success: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const style = styles[type] || styles.error;

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <p className={`${style.text} font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
