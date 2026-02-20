import { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";
import ApiConfig from "../../Config/api.config";
import { usePermissions } from "../../../hooks/usePermissions";
import TipoMarcaCard from "./TipoMarcaCard";
import ModalFormulario from "./ModalFormulario";
import ModalConfirmacion from "./ModalConfirmacion";
import Alert from "../../Globales/Alert";
import Badge from "../../Globales/Badge";
import ApiService from "../../../Services/ApiService";

function TipoMarca({ token, userData }) {
  const [tiposMarca, setTiposMarca] = useState([]);
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
  const [editingTipo, setEditingTipo] = useState(null);
  const [tipoToDelete, setTipoToDelete] = useState(null);
  const [tipoToActivate, setTipoToActivate] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    tipoMar_Nombre: "",
    tipoMar_Estatus: true,
  });

  useEffect(() => {
    if (token) {
      cargarTiposMarca();
    } else {
      setError("No hay token de autenticación");
    }
  }, [token]);

  const cargarTiposMarca = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        ApiConfig.ENDPOINTSTIPOSMARCA.LISTAR,
        token,
      );

      if (response.ok) {
        const data = await response.json();
        setTiposMarca(data);
      } else {
        setError(`Error al cargar tipos de marca (${response.status})`);
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

      if (editingTipo) {
        const body = {
          TipoMar_Id: editingTipo.tipoMar_Id,
          TipoMar_Nombre: formData.tipoMar_Nombre.trim().toUpperCase(),
          TipoMar_Estatus: formData.tipoMar_Estatus,
          TipoMar_ModificadoPor: nombreUsuario,
        };

        response = await ApiService.put(
          ApiConfig.ENDPOINTSTIPOSMARCA.ACTUALIZAR(editingTipo.tipoMar_Id),
          body,
          token,
        );
      } else {
        const body = {
          TipoMar_Nombre: formData.tipoMar_Nombre.trim().toUpperCase(),
          TipoMar_Estatus: formData.tipoMar_Estatus,
          TipoMar_CreadoPor: nombreUsuario,
        };

        response = await ApiService.post(
          ApiConfig.ENDPOINTSTIPOSMARCA.CREAR,
          body,
          token,
        );
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingTipo
            ? "TIPO DE MARCA ACTUALIZADO EXITOSAMENTE"
            : "TIPO DE MARCA CREADO EXITOSAMENTE",
        );
        setShowModal(false);
        resetForm();
        cargarTiposMarca();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const mensaje = data.mensaje || "Error al guardar el tipo de marca";
        const mensajeLower = mensaje.toLowerCase();

        if (
          (mensajeLower.includes("ya existe") ||
            mensajeLower.includes("ya está registrado")) &&
          (mensajeLower.includes("nombre") || mensajeLower.includes("tipo"))
        ) {
          setError("Ya existe un tipo de marca con ese nombre");
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
    if (!tipoToDelete) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.delete(
        ApiConfig.ENDPOINTSTIPOSMARCA.ELIMINAR(tipoToDelete.tipoMar_Id),
        token,
      );

      if (response.ok) {
        setSuccess("TIPO DE MARCA DESACTIVADO EXITOSAMENTE");
        setShowDeleteModal(false);
        setTipoToDelete(null);
        cargarTiposMarca();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al desactivar el tipo de marca");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!tipoToActivate) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiService.patch(
        ApiConfig.ENDPOINTSTIPOSMARCA.ACTIVAR(tipoToActivate.tipoMar_Id),
        null,
        token,
      );

      if (response.ok) {
        setSuccess("TIPO DE MARCA ACTIVADO EXITOSAMENTE");
        setShowActivateModal(false);
        setTipoToActivate(null);
        cargarTiposMarca();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await response.json();
        setError(data.mensaje || "Error al activar el tipo de marca");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tipoMar_Nombre: "",
      tipoMar_Estatus: true,
    });
    setEditingTipo(null);
    setError("");
  };

  const openEditModal = (tipo) => {
    setEditingTipo(tipo);
    setFormData({
      tipoMar_Nombre: tipo.tipoMar_Nombre,
      tipoMar_Estatus: tipo.tipoMar_Estatus,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setTimeout(() => resetForm(), 300);
  };

  const filteredTipos = tiposMarca.filter((tipo) => {
    const matchesSearch = tipo.tipoMar_Nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && tipo.tipoMar_Estatus) ||
      (filterStatus === "inactive" && !tipo.tipoMar_Estatus);

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
                <Tags className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-stone-900 whitespace-nowrap">
                  Tipos de Marca
                </h1>
                <p className="text-stone-600 text-xs">
                  {filteredTipos.length} tipo
                  {filteredTipos.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex-1 relative w-full lg:min-w-[300px]">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar tipo de marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
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

              {hasPermission("TiposMarca.Crear") && (
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

      <div className="px-2 md:px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
                <Tags className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-stone-600 font-medium">
                Cargando tipos de marca...
              </p>
            </div>
          </div>
        ) : filteredTipos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%)",
                }}
              >
                <Tags className="w-10 h-10 text-stone-400" />
              </div>
              <div>
                <p className="text-stone-900 text-lg font-semibold mb-1">
                  No se encontraron tipos de marca
                </p>
                <p className="text-stone-500 text-sm">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer tipo de marca"}
                </p>
              </div>
              {!searchTerm &&
                filterStatus === "all" &&
                hasPermission("TiposMarca.Crear") && (
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
                    Crear Tipo de Marca
                  </button>
                )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTipos.map((tipo) => (
                  <TipoMarcaCard
                    key={tipo.tipoMar_Id}
                    tipo={tipo}
                    onEdit={openEditModal}
                    onDelete={(t) => {
                      setTipoToDelete(t);
                      setShowDeleteModal(true);
                    }}
                    onActivate={(t) => {
                      setTipoToActivate(t);
                      setShowActivateModal(true);
                    }}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            )}

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
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredTipos.map((tipo) => (
                        <tr
                          key={tipo.tipoMar_Id}
                          className="hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-stone-900">
                            {tipo.tipoMar_Nombre}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge active={tipo.tipoMar_Estatus}>
                              {tipo.tipoMar_Estatus ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {hasPermission("TiposMarca.Editar") && (
                                <button
                                  onClick={() => openEditModal(tipo)}
                                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission("TiposMarca.Eliminar") &&
                                tipo.tipoMar_Estatus && (
                                  <button
                                    onClick={() => {
                                      setTipoToDelete(tipo);
                                      setShowDeleteModal(true);
                                    }}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              {hasPermission("TiposMarca.Activar") &&
                                !tipo.tipoMar_Estatus && (
                                  <button
                                    onClick={() => {
                                      setTipoToActivate(tipo);
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

      <ModalFormulario
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingTipo={editingTipo}
        loading={loading}
        error={error}
        nombreUsuario={nombreUsuario}
      />

      <ModalConfirmacion
        show={showDeleteModal}
        type="delete"
        tipo={tipoToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setTipoToDelete(null);
        }}
        loading={loading}
        nombreUsuario={nombreUsuario}
      />

      <ModalConfirmacion
        show={showActivateModal}
        type="activate"
        tipo={tipoToActivate}
        onConfirm={handleActivate}
        onCancel={() => {
          setShowActivateModal(false);
          setTipoToActivate(null);
        }}
        loading={loading}
        nombreUsuario={nombreUsuario}
      />
    </div>
  );
}

export default TipoMarca;
