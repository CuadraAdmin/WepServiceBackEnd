import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Shield,
  Check,
  Lock,
} from "lucide-react";
import ApiConfig from "../../Config/api.config";
import { usePermissions } from "../../../hooks/usePermissions";
import AsignarPerfilesUsuario from "./AsignarPerfilesUsuario";
import UsuarioCard from "./UsuarioCard";
import ModalFormulario from "./ModalFormulario";
import ModalConfirmacion from "./ModalConfirmacion";
import ModalCambiarContrasena from "./ModalCambiarContrasena";
import Alert from "../../Globales/Alert";
import Badge from "../../Globales/Badge";
import ApiService from "../../../Services/ApiService";

function Usuario({ token, userData }) {
  const [usuarios, setUsuarios] = useState([]);
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
  const [showPerfilesModal, setShowPerfilesModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [usuarioToActivate, setUsuarioToActivate] = useState(null);
  const [usuarioForPerfiles, setUsuarioForPerfiles] = useState(null);
  const [usuarioToChangePassword, setUsuarioToChangePassword] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    usua_Usuario: "",
    usua_Nombre: "",
    usua_Correo: "",
    usua_Telefono: "",
    usua_Contrasena: "",
    usua_Estatus: true,
  });

  const [passwordData, setPasswordData] = useState({
    contrasenaNueva: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    if (token) {
      cargarUsuarios();
    } else {
      setError("No hay token de autenticación");
    }
  }, [token]);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        ApiConfig.ENDPOINTSUSUARIOS.LISTAR,
        token
      );

      if (response.ok) {
        const data = await response.json();
        const usuariosConPerfiles = await Promise.all(
          data.map(async (usuario) => {
            try {
              const perfilesResponse = await ApiService.get(
                ApiConfig.ENDPOINTSUSUARIOS.PERFILES(usuario.usua_Id),
                token
              );
              if (perfilesResponse.ok) {
                const perfiles = await perfilesResponse.json();
                return { ...usuario, perfiles };
              }
            } catch (err) {
              console.error(
                `Error al cargar perfiles del usuario ${usuario.usua_Id}:`,
                err
              );
            }
            return { ...usuario, perfiles: [] };
          })
        );
        setUsuarios(usuariosConPerfiles);
      } else {
        setError(`Error al cargar usuarios (${response.status})`);
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
      if (editingUsuario) {
        const body = {
          Usua_Nombre: formData.usua_Nombre.trim().toUpperCase(),
          Usua_Usuario: formData.usua_Usuario.trim(),
          Usua_Correo: formData.usua_Correo.trim(),
          Usua_Telefono: formData.usua_Telefono.trim(),
          Usua_Contrasena: formData.usua_Contrasena || "",
          Usua_Estatus: formData.usua_Estatus,
          Usua_ModificadoPor: nombreUsuario,
        };

        const response = await ApiService.put(
          ApiConfig.ENDPOINTSUSUARIOS.ACTUALIZAR(editingUsuario.usua_Id),
          body,
          token
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess("USUARIO ACTUALIZADO EXITOSAMENTE");
          setShowModal(false);
          resetForm();
          await cargarUsuarios();
          setTimeout(() => setSuccess(""), 4000);
        } else {
          throw new Error(data.mensaje || "Error al actualizar el usuario");
        }
      } else {
        const body = {
          Usua_Usuario: formData.usua_Usuario.trim(),
          Usua_Nombre: formData.usua_Nombre.trim().toUpperCase(),
          Usua_Correo: formData.usua_Correo.trim(),
          Usua_Telefono: formData.usua_Telefono.trim(),
          Usua_Contrasena: formData.usua_Contrasena,
          Usua_Estatus: formData.usua_Estatus,
          Usua_CreadoPor: nombreUsuario,
        };

        const response = await ApiService.post(
          ApiConfig.ENDPOINTSUSUARIOS.CREAR,
          body,
          token
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess("USUARIO CREADO EXITOSAMENTE");
          setShowModal(false);
          resetForm();
          await cargarUsuarios();
          setTimeout(() => setSuccess(""), 4000);
        } else {
          throw new Error(data.mensaje || "Error al crear el usuario");
        }
      }
    } catch (err) {
      const errorMessage = err.message || "Error al conectar con el servidor";
      if (
        errorMessage.toLowerCase().includes("ya existe") ||
        errorMessage.toLowerCase().includes("ya está registrado")
      ) {
        if (
          errorMessage.toLowerCase().includes("usuario") ||
          errorMessage.toLowerCase().includes("nombre")
        ) {
          setError("Ya existe un usuario con ese nombre de usuario");
        } else if (errorMessage.toLowerCase().includes("correo")) {
          setError("Ya existe un usuario con ese correo electrónico");
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();

    if (!passwordData.contrasenaNueva) {
      setError("Por favor ingrese la nueva contraseña");
      return;
    }

    if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.contrasenaNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestBody = {
        ContrasenaNueva: passwordData.contrasenaNueva.trim(),
      };

      const response = await ApiService.put(
        ApiConfig.ENDPOINTSUSUARIOS.CAMBIAR_CONTRASENA(
          usuarioToChangePassword.usua_Id
        ),
        requestBody,
        token
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("CONTRASEÑA ACTUALIZADA EXITOSAMENTE");
        closePasswordModal();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        throw new Error(data.mensaje || "Error al cambiar la contraseña");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!usuarioToDelete) return;
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.delete(
        ApiConfig.ENDPOINTSUSUARIOS.ELIMINAR(usuarioToDelete.usua_Id),
        token
      );

      if (response.ok) {
        setSuccess("USUARIO DESACTIVADO EXITOSAMENTE");
        setShowDeleteModal(false);
        setUsuarioToDelete(null);
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al desactivar el usuario");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!usuarioToActivate) return;
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.patch(
        ApiConfig.ENDPOINTSUSUARIOS.ACTIVAR(usuarioToActivate.usua_Id),
        null,
        token
      );

      if (response.ok) {
        setSuccess("USUARIO ACTIVADO EXITOSAMENTE");
        setShowActivateModal(false);
        setUsuarioToActivate(null);
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al activar el usuario");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      usua_Usuario: "",
      usua_Nombre: "",
      usua_Correo: "",
      usua_Telefono: "",
      usua_Contrasena: "",
      usua_Estatus: true,
    });
    setEditingUsuario(null);
    setError("");
  };

  const openEditModal = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      usua_Usuario: usuario.usua_Usuario,
      usua_Nombre: usuario.usua_Nombre,
      usua_Correo: usuario.usua_Correo,
      usua_Telefono: usuario.usua_Telefono,
      usua_Contrasena: "",
      usua_Estatus: usuario.usua_Estatus,
    });
    setShowModal(true);
  };

  const openPasswordModal = (usuario) => {
    setUsuarioToChangePassword(usuario);
    setPasswordData({
      contrasenaNueva: "",
      confirmarContrasena: "",
    });
    setError("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setUsuarioToChangePassword(null);
    setPasswordData({
      contrasenaNueva: "",
      confirmarContrasena: "",
    });
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setTimeout(() => resetForm(), 300);
  };

  const handleClosePerfilesModal = () => {
    setShowPerfilesModal(false);
    setUsuarioForPerfiles(null);
    cargarUsuarios();
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.usua_Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.usua_Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.usua_Correo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && usuario.usua_Estatus) ||
      (filterStatus === "inactive" && !usuario.usua_Estatus);

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
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-stone-900 whitespace-nowrap">
                  Gestión de Usuarios
                </h1>
                <p className="text-stone-600 text-xs">
                  {filteredUsuarios.length} usuario
                  {filteredUsuarios.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* búsqueda */}
            <div className="flex-1 relative w-full lg:min-w-[300px]">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, usuario o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white text-sm"
              />
            </div>

            {/* controles */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* filtro */}
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
              {hasPermission("Usuarios.Crear") && (
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
                <Users className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-stone-600 font-medium">Cargando usuarios...</p>
            </div>
          </div>
        ) : filteredUsuarios.length === 0 ? (
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
                  No se encontraron usuarios
                </p>
                <p className="text-stone-500 text-sm">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer usuario"}
                </p>
              </div>
              {!searchTerm &&
                filterStatus === "all" &&
                hasPermission("Usuarios.Crear") && (
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
                    Crear Usuario
                  </button>
                )}
            </div>
          </div>
        ) : (
          <>
            {/* Vista Grid */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsuarios.map((usuario) => (
                  <UsuarioCard
                    key={usuario.usua_Id}
                    usuario={usuario}
                    onEdit={openEditModal}
                    onDelete={(u) => {
                      setUsuarioToDelete(u);
                      setShowDeleteModal(true);
                    }}
                    onActivate={(u) => {
                      setUsuarioToActivate(u);
                      setShowActivateModal(true);
                    }}
                    onAsignarPerfiles={(u) => {
                      setUsuarioForPerfiles(u);
                      setShowPerfilesModal(true);
                    }}
                    onChangePassword={openPasswordModal}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            )}

            {/* Vista Tabla */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-180px)]">
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
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Usuario
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Correo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Teléfono
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
                      {filteredUsuarios.map((usuario) => (
                        <tr
                          key={usuario.usua_Id}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-stone-900">
                            {usuario.usua_Nombre}
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-600">
                            {usuario.usua_Usuario}
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-500">
                            {usuario.usua_Correo}
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-500">
                            {usuario.usua_Telefono}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge active={usuario.usua_Estatus}>
                              {usuario.usua_Estatus ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {hasPermission("Usuarios.AsignarPerfiles") && (
                                <button
                                  onClick={() => {
                                    setUsuarioForPerfiles(usuario);
                                    setShowPerfilesModal(true);
                                  }}
                                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
                                  title="Asignar Perfiles"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Usuarios.CambiarContrasena") && (
                                <button
                                  onClick={() => openPasswordModal(usuario)}
                                  className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all hover:scale-110"
                                  title="Cambiar Contraseña"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Usuarios.Editar") && (
                                <button
                                  onClick={() => openEditModal(usuario)}
                                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("Usuarios.Eliminar") &&
                                usuario.usua_Estatus && (
                                  <button
                                    onClick={() => {
                                      setUsuarioToDelete(usuario);
                                      setShowDeleteModal(true);
                                    }}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              {hasPermission("Usuarios.Activar") &&
                                !usuario.usua_Estatus && (
                                  <button
                                    onClick={() => {
                                      setUsuarioToActivate(usuario);
                                      setShowActivateModal(true);
                                    }}
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

      {/* Modales */}
      <ModalFormulario
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingUsuario={editingUsuario}
        loading={loading}
        error={error}
        nombreUsuario={nombreUsuario}
      />

      <ModalConfirmacion
        show={showDeleteModal}
        type="delete"
        usuario={usuarioToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setUsuarioToDelete(null);
        }}
        loading={loading}
        nombreUsuario={nombreUsuario}
      />

      <ModalConfirmacion
        show={showActivateModal}
        type="activate"
        usuario={usuarioToActivate}
        onConfirm={handleActivate}
        onCancel={() => {
          setShowActivateModal(false);
          setUsuarioToActivate(null);
        }}
        loading={loading}
        nombreUsuario={nombreUsuario}
      />

      <ModalCambiarContrasena
        show={showPasswordModal}
        usuario={usuarioToChangePassword}
        onClose={closePasswordModal}
        onSubmit={handleCambiarContrasena}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        loading={loading}
        error={error}
      />

      {showPerfilesModal && usuarioForPerfiles && (
        <AsignarPerfilesUsuario
          usuario={usuarioForPerfiles}
          token={token}
          nombreUsuario={nombreUsuario}
          onClose={handleClosePerfilesModal}
        />
      )}
    </div>
  );
}

export default Usuario;
