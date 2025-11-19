import { X, Eye, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";

function ImageZoomModal({ image, onClose }) {
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleReset = () => {
    setImageZoom(1);
    setImageRotation(0);
  };

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl flex flex-col shadow-2xl"
        style={{ height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal - Altura fija */}
        <div
          className="p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Eye className="w-5 h-5 text-white flex-shrink-0" />
            <h3 className="text-lg font-bold text-white truncate">
              {image.nombre}
            </h3>
          </div>

          {/* Controles de zoom y rotación */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Alejar"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm font-medium min-w-[60px] text-center">
              {Math.round(imageZoom * 100)}%
            </span>
            <button
              onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Acercar"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setImageRotation((imageRotation + 90) % 360)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Rotar"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 hover:bg-white/20 rounded-lg transition-colors text-white text-sm font-medium"
              title="Restablecer"
            >
              Restablecer
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Contenedor de imagen con tamaño fijo y scrol propio */}
        <div
          className="flex-1 overflow-auto bg-gradient-to-br from-stone-100 to-stone-200 rounded-b-2xl relative"
          style={{ minHeight: "0" }}
        >
          {/* Grid de fondo para mejor visualización */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={image.url}
              alt={image.nombre}
              className="max-w-full max-h-full object-contain transition-all duration-300 drop-shadow-2xl"
              style={{
                transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageZoomModal;
