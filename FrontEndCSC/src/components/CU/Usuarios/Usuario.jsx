import { useState, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import ApiConfig from "../../Config/api.config";
import { usePermissions } from "../../../hooks/usePermissions";
import AsignarPerfilesUsuario from "./AsignarPerfilesUsuario";
import UsuarioCard from "./UsuarioCard";
import TablaUsuarios from "./TablaUsuarios";
import ModalFormulario from "./ModalFormulario";
import ModalConfirmacion from "./ModalConfirmacion";
import ModalCambiarContrasena from "./ModalCambiarContrasena";
import SearchBar from "../../Globales/SearchBar";
import Alert from "../../Globales/Alert";

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
      const response = await fetch(
        ApiConfig.getUrl(ApiConfig.ENDPOINTSUSUARIOS.LISTAR),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const usuariosConPerfiles = await Promise.all(
          data.map(async (usuario) => {
            try {
              const perfilesResponse = await fetch(
                ApiConfig.getUrl(
                  ApiConfig.ENDPOINTSUSUARIOS.PERFILES(usuario.usua_Id)
                ),
                {
                  method: "GET",
                  headers: ApiConfig.getHeaders(token),
                }
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
      if (editingUsuario) {
        const url = ApiConfig.getUrl(
          ApiConfig.ENDPOINTSUSUARIOS.ACTUALIZAR(editingUsuario.usua_Id)
        );
        const body = {
          Usua_Nombre: formData.usua_Nombre.trim().toUpperCase(),
          Usua_Usuario: formData.usua_Usuario.trim(),
          Usua_Correo: formData.usua_Correo.trim(),
          Usua_Telefono: formData.usua_Telefono.trim(),
          Usua_Contrasena: formData.usua_Contrasena || "",
          Usua_Estatus: formData.usua_Estatus,
          Usua_ModificadoPor: nombreUsuario,
        };

        const response = await fetch(url, {
          method: "PUT",
          headers: ApiConfig.getHeaders(token),
          body: JSON.stringify(body),
        });

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
        const url = ApiConfig.getUrl(ApiConfig.ENDPOINTSUSUARIOS.CREAR);
        const body = {
          Usua_Usuario: formData.usua_Usuario.trim(),
          Usua_Nombre: formData.usua_Nombre.trim().toUpperCase(),
          Usua_Correo: formData.usua_Correo.trim(),
          Usua_Telefono: formData.usua_Telefono.trim(),
          Usua_Contrasena: formData.usua_Contrasena,
          Usua_Estatus: formData.usua_Estatus,
          Usua_CreadoPor: nombreUsuario,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: ApiConfig.getHeaders(token),
          body: JSON.stringify(body),
        });

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

      const response = await fetch(
        ApiConfig.getUrl(
          ApiConfig.ENDPOINTSUSUARIOS.CAMBIAR_CONTRASENA(
            usuarioToChangePassword.usua_Id
          )
        ),
        {
          method: "PUT",
          headers: ApiConfig.getHeaders(token),
          body: JSON.stringify(requestBody),
        }
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
      const response = await fetch(
        ApiConfig.getUrl(
          ApiConfig.ENDPOINTSUSUARIOS.ELIMINAR(usuarioToDelete.usua_Id)
        ),
        {
          method: "DELETE",
          headers: ApiConfig.getHeaders(token),
        }
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
      const response = await fetch(
        ApiConfig.getUrl(
          ApiConfig.ENDPOINTSUSUARIOS.ACTIVAR(usuarioToActivate.usua_Id)
        ),
        {
          method: "PATCH",
          headers: ApiConfig.getHeaders(token),
        }
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
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 pb-4 pt-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-stone-200">
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
                    Gestión de Usuarios
                  </h1>
                  <p className="text-stone-600 mt-1">
                    {filteredUsuarios.length} usuario
                    {filteredUsuarios.length !== 1 ? "s" : ""} encontrado
                    {filteredUsuarios.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {hasPermission("Usuarios.Crear") && (
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
                  <span className="hidden sm:inline">Nuevo Usuario</span>
                  <span className="sm:hidden">Agregar</span>
                </button>
              )}
            </div>
          </div>

          {/* Mensajes */}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}

          {/* Barra de búsqueda */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
                  <Users className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-stone-600 font-medium">
                  Cargando usuarios...
                </p>
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
              </div>
            </div>
          ) : (
            <>
              {(viewMode === "grid" || window.innerWidth < 768) && (
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

              {viewMode === "table" && window.innerWidth >= 768 && (
                <TablaUsuarios
                  usuarios={filteredUsuarios}
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
              )}
            </>
          )}
        </div>
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
