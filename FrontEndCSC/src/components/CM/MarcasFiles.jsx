import { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
} from "lucide-react";

function MarcasFiles({ marca, onClose }) {
  const [archivos, setArchivos] = useState([
    {
      id: 1,
      nombre: "Logo_Marca.png",
      tipo: "image/png",
      tamaño: "245 KB",
      fecha: "2025-01-15",
    },
    {
      id: 2,
      nombre: "Certificado_Registro.pdf",
      tipo: "application/pdf",
      tamaño: "2.3 MB",
      fecha: "2025-01-20",
    },
  ]);
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (tipo) => {
    if (tipo.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (tipo.includes("pdf")) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    setTimeout(() => {
      const newFiles = files.map((file, index) => ({
        id: archivos.length + index + 1,
        nombre: file.name,
        tipo: file.type,
        tamaño: `${(file.size / 1024).toFixed(0)} KB`,
        fecha: new Date().toISOString().split("T")[0],
      }));

      setArchivos([...archivos, ...newFiles]);
      setUploading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setArchivos(archivos.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="p-6 rounded-t-3xl flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {marca.Marc_Marca || "Marca"}
              </h2>
              <p className="text-white/90 text-sm">
                Gestión de archivos de la marca
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <label className="block w-full border-2 border-dashed border-stone-300 rounded-2xl p-8 hover:border-stone-400 transition-colors cursor-pointer bg-stone-50 hover:bg-stone-100">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className="p-4 rounded-2xl shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.2) 100%)",
                  }}
                >
                  <Upload className="w-8 h-8 text-stone-700" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-stone-900">
                    Hacer clic para seleccionar un archivo
                  </p>
                  <p className="text-sm text-stone-600 mt-1">
                    Soporta cualquier tipo de archivo (imágenes, PDF, Word,
                    Excel, etc.)
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Archivos Lista */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-700" />
              Archivos cargados ({archivos.length})
            </h3>

            {uploading && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700 font-medium">
                    Subiendo archivos...
                  </span>
                </div>
              </div>
            )}

            {archivos.length === 0 ? (
              <div className="bg-stone-50 rounded-xl p-8 text-center">
                <File className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">
                  No hay archivos cargados
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="bg-white border-2 border-stone-200 rounded-xl p-4 hover:border-stone-300 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.15) 100%)",
                        }}
                      >
                        <div className="text-stone-700">
                          {getFileIcon(archivo.tipo)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">
                          {archivo.nombre}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-stone-600 mt-1">
                          <span>{archivo.tamaño}</span>
                          <span>•</span>
                          <span>{archivo.fecha}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(archivo.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarcasFiles;
