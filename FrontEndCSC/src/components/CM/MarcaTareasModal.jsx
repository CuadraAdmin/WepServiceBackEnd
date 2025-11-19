import { useState, useEffect } from "react";
import {
  X,
  ListTodo,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Loader2,
  Calendar,
  FileText,
  User,
  Clock,
} from "lucide-react";
import ApiService from "../../Services/ApiService";
import ApiConfig from "../Config/api.config";
import Alert from "../Globales/Alert";
import { usePermissions } from "../../hooks/usePermissions";

function MarcaTareasModal({ marca, onClose, token, userData }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [formData, setFormData] = useState({
    MarcTare_Descripcion: "",
  });

  const nombreUsuario = userData?.usuario?.usua_Usuario || "Sistema";
  const usuario = userData?.usuario || {};
  const Usua_Id = usuario.usua_Id;

  const { hasPermission, loading: permissionsLoading } = usePermissions(
    token,
    Usua_Id
  );
  useEffect(() => {
    if (marca?.Marc_Id) {
      cargarTareas();
    }

    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [marca]);

  const cargarTareas = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSMARCA.TAREAS}/listar/activosPorMarca/${marca.Marc_Id}`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setTareas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al cargar acciones");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.MarcTare_Descripcion.trim()) {
        setError("La descripción es obligatoria");
        setLoading(false);
        return;
      }

      const dataToSend = {
        Marc_Id: marca.Marc_Id,
        MarcTare_Descripcion: formData.MarcTare_Descripcion.trim(),
        MarcTare_Estatus: true,
        ...(editingTarea
          ? { MarcTare_ModificadoPor: nombreUsuario }
          : { MarcTare_CreadoPor: nombreUsuario }),
      };

      let response;
      if (editingTarea) {
        response = await ApiService.put(
          `${ApiConfig.ENDPOINTSMARCA.TAREAS}/actualizar/${editingTarea.MarcTare_Id}`,
          dataToSend,
          token
        );
      } else {
        response = await ApiService.post(
          `${ApiConfig.ENDPOINTSMARCA.TAREAS}/crear`,
          dataToSend,
          token
        );
      }

      if (response.ok) {
        setSuccess(
          editingTarea
            ? "Tarea actualizada exitosamente"
            : "Tarea creada exitosamente"
        );
        resetForm();
        await cargarTareas();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al guardar la acción");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (tareaId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta acción?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.delete(
        `${ApiConfig.ENDPOINTSMARCA.TAREAS}/eliminar/${tareaId}`,
        token
      );

      if (response.ok) {
        setSuccess("Acción eliminada exitosamente");
        await cargarTareas();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al eliminar la acción");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = async (tareaId) => {
    if (!window.confirm("¿Marcar esta acción como finalizada?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.patch(
        `${ApiConfig.ENDPOINTSMARCA.TAREAS}/finalizarTarea/${tareaId}`,
        null,
        token
      );

      if (response.ok) {
        setSuccess("Acción finalizada exitosamente");
        await cargarTareas();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al finalizar la acción");
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (tarea) => {
    setEditingTarea(tarea);
    setFormData({
      MarcTare_Descripcion: tarea.MarcTare_Descripcion || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      MarcTare_Descripcion: "",
    });
    setEditingTarea(null);
    setShowForm(false);
  };

  const formatDate = (date) => {
    if (!date) return "Pendiente";
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="p-4 md:p-6 rounded-t-3xl flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="p-2 md:p-3 bg-white/20 rounded-xl flex-shrink-0">
              <ListTodo className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-bold text-white truncate">
                Acciones de la Marca
              </h2>
              <p className="text-white/90 text-xs md:text-sm truncate">
                Marca: {marca.Marc_Marca}
              </p>
              <p className="text-white/90 text-xs md:text-sm truncate">
                {" "}
                Registro: {marca.Marc_Registro}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Alerts */}
          {success && (
            <div className="mb-4">
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            </div>
          )}

          {error && (
            <div className="mb-4">
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>
          )}

          {/* Boton Agregar Nueva Acción */}
          {!showForm &&
            hasPermission("Marcas.GestionAcciones.CrearAcciones") && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-all shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <Plus className="w-5 h-5" />
                Nueva Acción
              </button>
            )}

          {/* Formulario de Tarea */}
          {showForm && (
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-4 md:p-6 border-2 border-stone-200 mb-6">
              <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4">
                {editingTarea ? "Editar Acción" : "Nueva Acción"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-bold text-stone-700 mb-2 block">
                    Descripción <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.MarcTare_Descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        MarcTare_Descripcion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white resize-none"
                    rows="3"
                    placeholder="Descripción de la acción..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    {loading
                      ? "Guardando..."
                      : editingTarea
                      ? "Actualizar"
                      : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Tareas */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-700" />
              Acciones Registradas ({tareas.length})
            </h3>

            {loading && !showForm ? (
              <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
              </div>
            ) : tareas.length === 0 ? (
              <div className="bg-stone-50 rounded-xl p-8 text-center">
                <ListTodo className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">
                  No hay acciones registradas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tareas.map((tarea) => (
                  <div
                    key={tarea.MarcTare_Id}
                    className={`bg-white border-2 rounded-xl transition-all ${
                      tarea.MarcTare_FechaFinalizacion
                        ? "border-green-200 bg-green-50/30"
                        : "border-stone-200 hover:border-stone-300 hover:shadow-md"
                    }`}
                  >
                    <div className="p-3 md:p-4">
                      <div className="flex gap-3">
                        {/* Estado (Checkbox) */}
                        <div className="flex-shrink-0 pt-0.5">
                          {tarea.MarcTare_FechaFinalizacion ? (
                            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-stone-300 bg-white"></div>
                          )}
                        </div>

                        {/* Contenido Principal */}
                        <div className="flex-1 min-w-0">
                          {/* Descripción */}
                          <h4 className="text-stone-900 font-semibold text-sm md:text-base mb-2 break-words leading-snug">
                            {tarea.MarcTare_Descripcion}
                          </h4>

                          {/* Información Compacta */}
                          <div className="space-y-1">
                            {/* Creado */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                              <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                <span>Creado:</span>
                                <span className="font-medium">
                                  {tarea.MarcTare_CreadoPor}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-stone-500">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>
                                  {formatDate(tarea.MarcTare_FechaCreacion)}
                                </span>
                              </div>
                            </div>

                            {/* Modificado */}
                            {tarea.MarcTare_ModificadoPor && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-600">
                                <div className="flex items-center gap-1.5">
                                  <Edit2 className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>Modificado:</span>
                                  <span className="font-medium">
                                    {tarea.MarcTare_ModificadoPor}
                                  </span>
                                </div>
                                {tarea.MarcTare_ModificadoFecha && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>
                                      {formatDate(
                                        tarea.MarcTare_ModificadoFecha
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Finalizada */}
                            {tarea.MarcTare_FechaFinalizacion && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-green-600 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>Finalizada:</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>
                                    {formatDate(
                                      tarea.MarcTare_FechaFinalizacion
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botones de Acción - Solo para tareas no finalizadas */}
                        {!tarea.MarcTare_FechaFinalizacion && (
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {hasPermission(
                              "Marcas.GestionAcciones.FinalizarAcciones"
                            ) && (
                              <button
                                onClick={() =>
                                  handleFinalizar(tarea.MarcTare_Id)
                                }
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all hover:scale-110"
                                title="Finalizar"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            {hasPermission(
                              "Marcas.GestionAcciones.EditarAcciones"
                            ) && (
                              <button
                                onClick={() => openEditForm(tarea)}
                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all hover:scale-110"
                                title="Editar"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                            )}
                            {hasPermission(
                              "Marcas.GestionAcciones.EliminarAcciones"
                            ) && (
                              <button
                                onClick={() =>
                                  handleEliminar(tarea.MarcTare_Id)
                                }
                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all hover:scale-110"
                                title="Eliminar"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl">
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

export default MarcaTareasModal;
