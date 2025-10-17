import { useState, useEffect } from "react";
import {
  Users,
  User,
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
  Shield,
  Check,
} from "lucide-react";
import ApiConfig from "../Config/api.config";
import { usePermissions } from "../../hooks/usePermissions";
import AsignarPermisos from "./AsignarPermisos";

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

const PerfilCard = ({
  perfil,
  onEdit,
  onDelete,
  onActivate,
  onAsignarPermisos,
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
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-stone-400">
            #{perfil.perf_Id}
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {perfil.perf_Nombre}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          {perfil.perf_Descripcion || "Sin descripción"}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
      <Badge active={perfil.perf_Estatus}>
        {perfil.perf_Estatus ? "Activo" : "Inactivo"}
      </Badge>

      <div className="flex gap-2">
        {hasPermission("Perfiles.AsignarPermisos") && (
          <button
            onClick={() => onAsignarPermisos(perfil)}
            className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
            title="Asignar Permisos"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Perfiles.Editar") && (
          <button
            onClick={() => onEdit(perfil)}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Perfiles.Eliminar") && perfil.perf_Estatus && (
          <button
            onClick={() => onDelete(perfil)}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
            title="Desactivar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Perfiles.Activar") && !perfil.perf_Estatus && (
          <button
            onClick={() => onActivate(perfil)}
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

function Perfil({ token, userData }) {
  const [perfiles, setPerfiles] = useState([]);

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
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [perfilToDelete, setPerfilToDelete] = useState(null);
  const [perfilToActivate, setPerfilToActivate] = useState(null);
  const [perfilForPermisos, setPerfilForPermisos] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    perf_Nombre: "",
    perf_Descripcion: "",
    perf_Estatus: true,
  });

  useEffect(() => {
    if (token) {
      cargarPerfiles();
    } else {
      setError("No hay token de autenticación");
    }
  }, [token]);

  const cargarPerfiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        ApiConfig.getUrl(ApiConfig.ENDPOINTSPERFILES.LISTAR),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPerfiles(data);
      } else {
        setError(`Error al cargar perfiles (${response.status})`);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
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
      const url = editingPerfil
        ? ApiConfig.getUrl(
            ApiConfig.ENDPOINTSPERFILES.ACTUALIZAR(editingPerfil.perf_Id)
          )
        : ApiConfig.getUrl(ApiConfig.ENDPOINTSPERFILES.CREAR);

      const method = editingPerfil ? "PUT" : "POST";

      const body = editingPerfil
        ? {
            perf_Id: editingPerfil.perf_Id,
            perf_Nombre: formData.perf_Nombre.trim().toUpperCase(),
            perf_Descripcion: formData.perf_Descripcion.trim().toUpperCase(),
            perf_Estatus: formData.perf_Estatus,
            perf_ModificadoPor: nombreUsuario,
          }
        : {
            perf_Nombre: formData.perf_Nombre.trim().toUpperCase(),
            perf_Descripcion: formData.perf_Descripcion.trim().toUpperCase(),
            perf_Estatus: formData.perf_Estatus,
            perf_CreadoPor: nombreUsuario,
          };

      const response = await fetch(url, {
        method: method,
        headers: ApiConfig.getHeaders(token),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingPerfil
            ? "PERFIL ACTUALIZADO EXITOSAMENTE"
            : "PERFIL CREADO EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        cargarPerfiles();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        // ⭐ Detectar errores de duplicados ⭐
        const mensaje = data.mensaje || "Error al guardar el perfil";
        const mensajeLower = mensaje.toLowerCase();

        // Detectar si es un error de duplicado
        if (
          (mensajeLower.includes("ya existe") ||
            mensajeLower.includes("ya está registrado")) &&
          (mensajeLower.includes("nombre") || mensajeLower.includes("perfil"))
        ) {
          setError("Ya existe un perfil con ese nombre");
        } else {
          setError(mensaje);
        }
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!perfilToDelete) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        ApiConfig.getUrl(
          ApiConfig.ENDPOINTSPERFILES.ELIMINAR(perfilToDelete.perf_Id)
        ),
        {
          method: "DELETE",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        setSuccess(`PERFIL DESACTIVADO EXITOSAMENTE`);
        setShowDeleteModal(false);
        setPerfilToDelete(null);
        cargarPerfiles();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al desactivar el perfil");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!perfilToActivate) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        ApiConfig.getUrl(
          ApiConfig.ENDPOINTSPERFILES.ACTIVAR(perfilToActivate.perf_Id)
        ),
        {
          method: "PATCH",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        setSuccess(`PERFIL ACTIVADO EXITOSAMENTE`);
        setShowActivateModal(false);
        setPerfilToActivate(null);
        cargarPerfiles();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al activar el perfil");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (perfil) => {
    setEditingPerfil(perfil);
    setFormData({
      perf_Nombre: perfil.perf_Nombre,
      perf_Descripcion: perfil.perf_Descripcion || "",
      perf_Estatus: perfil.perf_Estatus,
    });
    setShowModal(true);
  };

  const openDeleteModal = (perfil) => {
    setPerfilToDelete(perfil);
    setShowDeleteModal(true);
  };

  const openActivateModal = (perfil) => {
    setPerfilToActivate(perfil);
    setShowActivateModal(true);
  };

  const openPermisosModal = (perfil) => {
    setPerfilForPermisos(perfil);
    setShowPermisosModal(true);
  };

  const resetForm = () => {
    setFormData({
      perf_Nombre: "",
      perf_Descripcion: "",
      perf_Estatus: true,
    });
    setEditingPerfil(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError("");
  };

  const handleClosePermisosModal = () => {
    setShowPermisosModal(false);
    setPerfilForPermisos(null);
    cargarPerfiles();
  };

  const filteredPerfiles = perfiles.filter((perfil) => {
    const matchesSearch = perfil.perf_Nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && perfil.perf_Estatus) ||
      (filterStatus === "inactive" && !perfil.perf_Estatus);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="p-4 rounded-2xl shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                  Gestión de Perfiles
                </h1>
                <p className="text-stone-600 mt-1">
                  {filteredPerfiles.length} perfil
                  {filteredPerfiles.length !== 1 ? "es" : ""} encontrado
                  {filteredPerfiles.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {hasPermission("Perfiles.Crear") && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Perfil</span>
                <span className="sm:hidden">Agregar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mensajes */}
        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError("")} />
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 border border-stone-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white appearance-none cursor-pointer font-medium"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <div className="hidden md:flex gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-md text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  title="Vista de tarjetas"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-white shadow-md text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  title="Vista de tabla"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
                <Users className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-stone-600 font-medium">Cargando perfiles...</p>
            </div>
          </div>
        ) : filteredPerfiles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%)",
                }}
              >
                <Users className="w-10 h-10 text-stone-400" />
              </div>
              <div>
                <p className="text-stone-900 text-lg font-semibold mb-1">
                  No se encontraron perfiles
                </p>
                <p className="text-stone-500 text-sm">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer perfil"}
                </p>
              </div>
              {!searchTerm &&
                filterStatus === "all" &&
                hasPermission("Perfiles.Crear") && (
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
                    Crear Perfil
                  </button>
                )}
            </div>
          </div>
        ) : (
          <>
            {/* Vista Grid */}
            {(viewMode === "grid" || window.innerWidth < 768) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPerfiles.map((perfil) => (
                  <PerfilCard
                    key={perfil.perf_Id}
                    perfil={perfil}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onActivate={openActivateModal}
                    onAsignarPermisos={openPermisosModal}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            )}

            {/* Vista Tabla */}
            {viewMode === "table" && window.innerWidth >= 768 && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead
                      className="text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                      }}
                    >
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Nombre
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Descripción
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredPerfiles.map((perfil) => (
                        <tr
                          key={perfil.perf_Id}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-stone-900">
                            {perfil.perf_Nombre}
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">
                            {perfil.perf_Descripcion || "Sin descripción"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge active={perfil.perf_Estatus}>
                              {perfil.perf_Estatus ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {hasPermission("Perfiles.AsignarPermisos") && (
                                <button
                                  onClick={() => openPermisosModal(perfil)}
                                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
                                  title="Asignar Permisos"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Perfiles.Editar") && (
                                <button
                                  onClick={() => openEditModal(perfil)}
                                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Perfiles.Eliminar") &&
                                perfil.perf_Estatus && (
                                  <button
                                    onClick={() => openDeleteModal(perfil)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              {hasPermission("Perfiles.Activar") &&
                                !perfil.perf_Estatus && (
                                  <button
                                    onClick={() => openActivateModal(perfil)}
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

        {/* Modal de formulario */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div
                className="p-6 md:p-8 text-white flex justify-between items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {editingPerfil ? "Editar Perfil" : "Nuevo Perfil"}
                  </h2>
                  <p className="text-white/80 mt-1 text-sm">
                    {editingPerfil
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
                    Nombre del Perfil
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.perf_Nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perf_Nombre: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="NOMBRE DEL PERFIL"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    Descripción
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.perf_Descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perf_Descripcion: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all resize-none bg-stone-50 focus:bg-white"
                    placeholder="DESCRIPCIÓN DETALLADA DEL PERFIL"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="estatus"
                    checked={formData.perf_Estatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perf_Estatus: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
                    style={{ accentColor: "#6b5345" }}
                  />
                  <label
                    htmlFor="estatus"
                    className="text-sm font-semibold text-stone-700 cursor-pointer"
                  >
                    Perfil activo
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
                        {editingPerfil ? "Actualizar" : "Crear"} Perfil
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación de desactivación */}
        {showDeleteModal && perfilToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
              <div className="p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-t-3xl">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-stone-900">
                  ¿Desactivar Perfil?
                </h2>
                <p className="text-center text-stone-600 mt-2 text-sm">
                  Operación realizada por: {nombreUsuario}
                </p>
              </div>

              <div className="p-8">
                <p className="text-center text-stone-600 mb-6 leading-relaxed">
                  ¿Estás seguro de que deseas desactivar el perfil{" "}
                  <span className="font-bold text-stone-900 block mt-2 text-lg">
                    "{perfilToDelete.perf_Nombre}"
                  </span>
                  ?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPerfilToDelete(null);
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

        {/* Modal de confirmación de activacion */}
        {showActivateModal && perfilToActivate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-3xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-stone-900">
                  ¿Activar Perfil?
                </h2>
                <p className="text-center text-stone-600 mt-2 text-sm">
                  Operación realizada por: {nombreUsuario}
                </p>
              </div>

              <div className="p-8">
                <p className="text-center text-stone-600 mb-6 leading-relaxed">
                  ¿Estás seguro de que deseas activar el perfil{" "}
                  <span className="font-bold text-stone-900 block mt-2 text-lg">
                    "{perfilToActivate.perf_Nombre}"
                  </span>
                  ?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowActivateModal(false);
                      setPerfilToActivate(null);
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

        {/* Modal de Asignar Permisos */}
        {showPermisosModal && perfilForPermisos && (
          <AsignarPermisos
            perfil={perfilForPermisos}
            token={token}
            nombreUsuario={nombreUsuario}
            onClose={handleClosePermisosModal}
          />
        )}
      </div>
    </div>
  );
}

export default Perfil;
