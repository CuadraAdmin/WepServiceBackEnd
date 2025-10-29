import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Filter,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import ApiConfig from "../../Config/api.config";
import { usePermissions } from "../../../hooks/usePermissions";
import ApiService from "../../../Services/ApiService";

const Badge = ({ active, children }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
      active
        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
        : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
    }`}
  >
    <span
      className={`w-2 h-2 rounded-full ${
        active ? "bg-green-500" : "bg-red-500"
      }`}
    ></span>
    {children}
  </span>
);

const PermisoCard = ({
  permiso,
  onEdit,
  onDelete,
  onActivate,
  hasPermission,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-stone-300 transform hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-stone-400">
            #{permiso.Perm_Id}
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {permiso.Perm_Nombre}
        </h3>
        <p className="text-sm text-stone-600 mb-3">
          <span className="font-semibold">Actividad:</span>{" "}
          {permiso.Perm_Actividad}
        </p>
        <p className="text-sm text-stone-500 leading-relaxed">
          {permiso.Perm_Descripcion || "Sin descripción"}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
      <Badge active={permiso.Perm_Estatus}>
        {permiso.Perm_Estatus ? "Activo" : "Inactivo"}
      </Badge>

      <div className="flex gap-2">
        {hasPermission("Permisos.Editar") && (
          <button
            onClick={() => onEdit(permiso)}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Permisos.Eliminar") && permiso.Perm_Estatus && (
          <button
            onClick={() => onDelete(permiso)}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
            title="Desactivar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Permisos.Activar") && !permiso.Perm_Estatus && (
          <button
            onClick={() => onActivate(permiso)}
            className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-110"
            title="Activar"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

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

function Permisos({ token, userData }) {
  const [permisos, setPermisos] = useState([]);

  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const userId = usuario.usua_Id;

  const { hasPermission } = usePermissions(token, userId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editingPermiso, setEditingPermiso] = useState(null);
  const [permisoToDelete, setPermisoToDelete] = useState(null);
  const [permisoToActivate, setPermisoToActivate] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    perm_Nombre: "",
    perm_Actividad: "",
    perm_Descripcion: "",
    perm_Estatus: true,
  });

  useEffect(() => {
    if (token) {
      cargarPermisos();
    } else {
      setError("No hay token de autenticación");
    }
  }, [token]);

  const cargarPermisos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        ApiConfig.ENDPOINTSPERMISOS.LISTAR,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setPermisos(data);
      } else {
        setError(`Error al cargar permisos (${response.status})`);
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
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
      let response;

      if (editingPermiso) {
        const body = {
          perm_Id: editingPermiso.Perm_Id,
          perm_Nombre: formData.perm_Nombre.trim().toUpperCase(),
          perm_Actividad: formData.perm_Actividad.trim().toUpperCase(),
          perm_Descripcion: formData.perm_Descripcion.trim().toUpperCase(),
          perm_Estatus: formData.perm_Estatus,
          perm_ModificadoPor: nombreUsuario,
        };

        response = await ApiService.put(
          ApiConfig.ENDPOINTSPERMISOS.ACTUALIZAR(editingPermiso.Perm_Id),
          body,
          token
        );
      } else {
        const body = {
          perm_Nombre: formData.perm_Nombre.trim().toUpperCase(),
          perm_Actividad: formData.perm_Actividad.trim().toUpperCase(),
          perm_Descripcion: formData.perm_Descripcion.trim().toUpperCase(),
          perm_Estatus: formData.perm_Estatus,
          perm_CreadoPor: nombreUsuario,
        };

        response = await ApiService.post(
          ApiConfig.ENDPOINTSPERMISOS.CREAR,
          body,
          token
        );
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingPermiso
            ? "PERMISO ACTUALIZADO EXITOSAMENTE"
            : "PERMISO CREADO EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        cargarPermisos();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const mensaje = data.mensaje || "Error al guardar el permiso";
        const mensajeLower = mensaje.toLowerCase();

        if (
          (mensajeLower.includes("ya existe") ||
            mensajeLower.includes("ya está registrado")) &&
          (mensajeLower.includes("nombre") || mensajeLower.includes("permiso"))
        ) {
          setError("Ya existe un permiso con ese nombre");
        } else {
          setError(mensaje);
        }
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!permisoToDelete) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.delete(
        ApiConfig.ENDPOINTSPERMISOS.ELIMINAR(permisoToDelete.Perm_Id),
        token
      );

      if (response.ok) {
        setSuccess("PERMISO DESACTIVADO EXITOSAMENTE");
        setShowDeleteModal(false);
        setPermisoToDelete(null);
        cargarPermisos();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al desactivar el permiso");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!permisoToActivate) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.patch(
        ApiConfig.ENDPOINTSPERMISOS.ACTIVAR(permisoToActivate.Perm_Id),
        null,
        token
      );

      if (response.ok) {
        setSuccess("PERMISO ACTIVADO EXITOSAMENTE");
        setShowActivateModal(false);
        setPermisoToActivate(null);
        cargarPermisos();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al activar el permiso");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (permiso) => {
    setEditingPermiso(permiso);
    setFormData({
      perm_Nombre: permiso.Perm_Nombre,
      perm_Actividad: permiso.Perm_Actividad,
      perm_Descripcion: permiso.Perm_Descripcion || "",
      perm_Estatus: permiso.Perm_Estatus,
    });
    setShowModal(true);
  };

  const openDeleteModal = (permiso) => {
    setPermisoToDelete(permiso);
    setShowDeleteModal(true);
  };

  const openActivateModal = (permiso) => {
    setPermisoToActivate(permiso);
    setShowActivateModal(true);
  };

  const resetForm = () => {
    setFormData({
      perm_Nombre: "",
      perm_Actividad: "",
      perm_Descripcion: "",
      perm_Estatus: true,
    });
    setEditingPermiso(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError("");
  };

  const filteredPermisos = permisos.filter((permiso) => {
    const matchesSearch =
      permiso.Perm_Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permiso.Perm_Actividad?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && permiso.Perm_Estatus) ||
      (filterStatus === "inactive" && !permiso.Perm_Estatus);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50">
      <div className="sticky top-0 z-30 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 shadow-md">
        <div className="px-2 md:px-4 py-4 md:py-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div
                className="p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-stone-900 whitespace-nowrap">
                  Gestión de Permisos
                </h1>
                <p className="text-stone-600 text-xs">
                  {filteredPermisos.length} permiso
                  {filteredPermisos.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="flex-1 relative w-full lg:min-w-[300px]">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white text-sm"
              />
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* Filtro */}
              <div className="relative flex-1 lg:flex-initial lg:min-w-[130px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white appearance-none cursor-pointer font-medium text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              {/* Botones de Vista */}
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 md:p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-md text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  title="Vista de tarjetas"
                >
                  <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 md:p-2.5 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-white shadow-md text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  title="Vista de tabla"
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {/* Botón Nuevo */}
              {hasPermission("Permisos.Crear") && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 md:px-5 py-2.5 md:py-3 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Nuevo</span>
                </button>
              )}
            </div>
          </div>

          {/* Mensajes */}
          {(success || error) && (
            <div className="space-y-2">
              {success && (
                <Alert
                  type="success"
                  message={success}
                  onClose={() => setSuccess("")}
                />
              )}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="px-2 md:px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
                <Shield className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-stone-600 font-medium">Cargando permisos...</p>
            </div>
          </div>
        ) : filteredPermisos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%)",
                }}
              >
                <Shield className="w-10 h-10 text-stone-400" />
              </div>
              <div>
                <p className="text-stone-900 text-lg font-semibold mb-1">
                  No se encontraron permisos
                </p>
                <p className="text-stone-500 text-sm">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer permiso"}
                </p>
              </div>
              {!searchTerm &&
                filterStatus === "all" &&
                hasPermission("Permisos.Crear") && (
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="mt-4 flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    Crear Permiso
                  </button>
                )}
            </div>
          </div>
        ) : (
          <>
            {/* Vista Grid */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPermisos.map((permiso) => (
                  <PermisoCard
                    key={permiso.Perm_Id}
                    permiso={permiso}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onActivate={openActivateModal}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            )}

            {/* Vista Tabla */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-180px)]">
                  {" "}
                  {/* 👈 CAMBIAR AQUÍ */}
                  <table className="w-full">
                    <thead
                      className="text-white sticky top-0 z-20"
                      style={{
                        background:
                          "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                      }}
                    >
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Nombre
                        </th>
                        <th className="text-left text-sm font-semibold">
                          Actividad
                        </th>
                        <th className="text-left text-sm font-semibold">
                          Descripción
                        </th>
                        <th className="text-center text-sm font-semibold">
                          Estado
                        </th>
                        <th className="text-center text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredPermisos.map((permiso) => (
                        <tr
                          key={permiso.Perm_Id}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-stone-900">
                            {permiso.Perm_Nombre}
                          </td>
                          <td className=" text-sm text-stone-600">
                            {permiso.Perm_Actividad}
                          </td>
                          <td className=" text-sm text-stone-500 max-w-xs truncate">
                            {permiso.Perm_Descripcion || "Sin descripción"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge active={permiso.Perm_Estatus}>
                              {permiso.Perm_Estatus ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {hasPermission("Permisos.Editar") && (
                                <button
                                  onClick={() => openEditModal(permiso)}
                                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Permisos.Eliminar") &&
                                permiso.Perm_Estatus && (
                                  <button
                                    onClick={() => openDeleteModal(permiso)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              {hasPermission("Permisos.Activar") &&
                                !permiso.Perm_Estatus && (
                                  <button
                                    onClick={() => openActivateModal(permiso)}
                                    className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-110"
                                    title="Activar"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de formulario */}
      {showModal && (
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
                  {editingPermiso ? "Editar Permiso" : "Nuevo Permiso"}
                </h2>
                <p className="text-white/80 mt-1 text-sm">
                  {editingPermiso
                    ? `Modificando como: ${nombreUsuario}`
                    : `Creando como: ${nombreUsuario}`}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]"
            >
              {error && <Alert type="error" message={error} />}

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  Nombre del Permiso
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.perm_Nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perm_Nombre: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white uppercase"
                  placeholder="NOMBRE"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  Actividad
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.perm_Actividad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perm_Actividad: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white uppercase"
                  placeholder="ACTIVIDAD"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  Descripción
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.perm_Descripcion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perm_Descripcion: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all resize-none bg-stone-50 focus:bg-white uppercase"
                  placeholder="DESCRIPCIÓN DEL PERMISO"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                <input
                  type="checkbox"
                  id="estatus"
                  checked={formData.perm_Estatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perm_Estatus: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
                  style={{ accentColor: "#6b5345" }}
                />
                <label
                  htmlFor="estatus"
                  className="text-sm font-semibold text-stone-700 cursor-pointer"
                >
                  Permiso activo
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
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
                      {editingPermiso ? "Actualizar" : "Crear"} Permiso
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de desactivación */}
      {showDeleteModal && permisoToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-t-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-stone-900">
                ¿Desactivar Permiso?
              </h2>
              <p className="text-center text-stone-600 mt-2 text-sm">
                Operación realizada por: {nombreUsuario}
              </p>
            </div>

            <div className="p-8">
              <p className="text-center text-stone-600 mb-6 leading-relaxed">
                ¿Estás seguro de que deseas desactivar el permiso{" "}
                <span className="font-bold text-stone-900 block mt-2 text-lg">
                  "{permisoToDelete.Perm_Nombre}"
                </span>
                ?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPermisoToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Desactivando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Desactivar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de activación */}
      {showActivateModal && permisoToActivate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-stone-900">
                ¿Activar Permiso?
              </h2>
              <p className="text-center text-stone-600 mt-2 text-sm">
                Operación realizada por: {nombreUsuario}
              </p>
            </div>

            <div className="p-8">
              <p className="text-center text-stone-600 mb-6 leading-relaxed">
                ¿Estás seguro de que deseas activar el permiso{" "}
                <span className="font-bold text-stone-900 block mt-2 text-lg">
                  "{permisoToActivate.Perm_Nombre}"
                </span>
                ?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowActivateModal(false);
                    setPermisoToActivate(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActivate}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Activando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Activar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Permisos;
