import { useState, useEffect } from "react";
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  Loader2,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import ApiConfig from "../Config/api.config";

function MarcasFiles({ marca, onClose, token }) {
  const [archivos, setArchivos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  useEffect(() => {
    if (marca?.Marc_Id) {
      cargarArchivos();
    }
  }, [marca]);

  const cargarArchivos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        ApiConfig.getUrl(
          `${ApiConfig.ENDPOINTSMARCA.ARCHIVOS}/listar/${marca.Marc_Id}`
        ),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const archivosNormalizados = data.map((archivo) => ({
          Nombre: archivo.nombre || archivo.Nombre,
          Url: archivo.url || archivo.Url,
          ContentType: archivo.contentType || archivo.ContentType,
          Tamaño: archivo.tamaño || archivo.Tamaño || archivo.size,
          FechaSubida: archivo.fechaSubida || archivo.FechaSubida,
          TipoArchivo: archivo.tipoArchivo || archivo.TipoArchivo,
        }));
        setArchivos(archivosNormalizados);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al cargar archivos");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (contentType) => {
    if (!contentType) return <File className="w-5 h-5" />;

    if (contentType.startsWith("image/"))
      return <ImageIcon className="w-5 h-5" />;
    if (contentType.includes("pdf")) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;

    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX");
    } catch {
      return "N/A";
    }
  };

  const canPreview = (contentType) => {
    if (!contentType) return false;
    return (
      contentType.startsWith("image/") ||
      contentType.includes("pdf") ||
      contentType.includes("text/")
    );
  };

  const handlePreview = async (archivo) => {
    setPreviewLoading(true);
    setImageZoom(1);
    setImageRotation(0);

    try {
      setPreview({
        nombre: archivo.Nombre,
        url: archivo.Url,
        contentType: archivo.ContentType,
        tipo: archivo.ContentType?.startsWith("image/")
          ? "image"
          : archivo.ContentType?.includes("pdf")
          ? "pdf"
          : "other",
      });
    } catch (error) {
      setError("Error al cargar la vista previa");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreview(null);
    setImageZoom(1);
    setImageRotation(0);
  };

  const handleFileUpload = async (e, tipoArchivo = "documento") => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          setError(`El archivo ${file.name} excede el tamaño máximo de 10MB`);
          continue;
        }

        const extensionesPermitidas = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
        ];
        const extension = "." + file.name.split(".").pop().toLowerCase();

        if (!extensionesPermitidas.includes(extension)) {
          setError(`Tipo de archivo no permitido: ${file.name}`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          ApiConfig.getUrl(
            `${ApiConfig.ENDPOINTSMARCA.ARCHIVOS}/upload/${marca.Marc_Id}?tipoArchivo=${tipoArchivo}`
          ),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.mensaje || `Error al subir ${file.name}`);
        }
      }

      await cargarArchivos();
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (url, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    setError("");

    try {
      const response = await fetch(
        ApiConfig.getUrl(`${ApiConfig.ENDPOINTSMARCA.ARCHIVOS}/eliminar`),
        {
          method: "DELETE",
          headers: {
            ...ApiConfig.getHeaders(token),
          },
          body: JSON.stringify({ url }),
        }
      );

      if (response.ok) {
        await cargarArchivos();
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al eliminar archivo");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    }
  };

  const handleDownload = (url, nombre) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre || "archivo";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
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
                  disabled={uploading}
                />
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="p-4 rounded-2xl shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.2) 100%)",
                    }}
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-stone-700 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-stone-700" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-stone-900">
                      {uploading
                        ? "Subiendo archivos..."
                        : "Hacer clic para seleccionar archivos"}
                    </p>
                    <p className="text-sm text-stone-600 mt-1">
                      Formatos: PDF, Word, Excel, imágenes (Máx. 10MB por
                      archivo)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Archivos Lista */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-700" />
                Archivos cargados ({archivos.length})
              </h3>

              {loading ? (
                <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                </div>
              ) : archivos.length === 0 ? (
                <div className="bg-stone-50 rounded-xl p-8 text-center">
                  <File className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-medium">
                    No hay archivos cargados
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {archivos.map((archivo, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-stone-200 rounded-xl p-4 hover:border-stone-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="p-3 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.15) 100%)",
                          }}
                          onClick={() => handlePreview(archivo)}
                        >
                          <div className="text-stone-700">
                            {getFileIcon(archivo.ContentType)}
                          </div>
                        </div>

                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handlePreview(archivo)}
                        >
                          <p className="font-semibold text-stone-900 truncate hover:text-stone-700">
                            {archivo.Nombre}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-stone-600 mt-1">
                            <span>{formatFileSize(archivo.Tamaño)}</span>
                            <span>•</span>
                            <span>{formatDate(archivo.FechaSubida)}</span>
                            {archivo.TipoArchivo && (
                              <>
                                <span>•</span>
                                <span className="capitalize">
                                  {archivo.TipoArchivo}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canPreview(archivo.ContentType) && (
                            <button
                              onClick={() => handlePreview(archivo)}
                              className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                              title="Vista previa"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDownload(archivo.Url, archivo.Nombre)
                            }
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(archivo.Url, archivo.Nombre)
                            }
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

      {/* Modal de Vista Previa */}
      {preview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            {/* Header del preview */}
            <div
              className="p-4 rounded-t-2xl flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Eye className="w-5 h-5 text-white flex-shrink-0" />
                <h3 className="text-lg font-bold text-white truncate">
                  {preview.nombre}
                </h3>
              </div>

              {/* Controles para imágenes */}
              {preview.tipo === "image" && (
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={() =>
                      setImageZoom(Math.max(0.5, imageZoom - 0.25))
                    }
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
                </div>
              )}

              <button
                onClick={closePreview}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Contenido del preview */}
            <div className="flex-1 overflow-auto bg-stone-100 rounded-b-2xl">
              {previewLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-stone-400 animate-spin" />
                </div>
              ) : preview.tipo === "image" ? (
                <div className="h-full flex items-center justify-center p-4 overflow-auto">
                  <img
                    src={preview.url}
                    alt={preview.nombre}
                    className="max-w-full h-auto object-contain transition-all duration-300"
                    style={{
                      transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                    }}
                  />
                </div>
              ) : preview.tipo === "pdf" ? (
                <iframe
                  src={preview.url}
                  className="w-full h-full min-h-[600px]"
                  title={preview.nombre}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <File className="w-16 h-16 text-stone-400 mb-4" />
                  <p className="text-stone-600 font-medium mb-2">
                    Vista previa no disponible para este tipo de archivo
                  </p>
                  <button
                    onClick={() => handleDownload(preview.url, preview.nombre)}
                    className="px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg mt-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    Descargar archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MarcasFiles;
