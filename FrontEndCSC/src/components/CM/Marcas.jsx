import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  FileDown,
  Trash2,
  Check,
} from "lucide-react";
import Alert from "../Globales/Alert";
import Select from "../Globales/Select";
import MarcasTable from "./MarcasTable";
import MarcasFiles from "./MarcasFiles";
import MarcasDetails from "./MarcasDetails";
import { exportToExcel } from "./exportUtils";
import ApiConfig from "../Config/api.config";
import { usePermissions } from "../../hooks/usePermissions";
import ApiService from "../../Services/ApiService";

function Marcas({ token, userData }) {
  const [marcas, setMarcas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [editingMarca, setEditingMarca] = useState(null);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
  const [marcaToActivate, setMarcaToActivate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const Usua_Id = usuario.usua_Id;

  const { hasPermission, loading: permissionsLoading } = usePermissions(
    token,
    Usua_Id
  );

  const [formData, setFormData] = useState({
    Marc_Id: 0,
    Empr_Id: "",
    Marc_Consecutivo: "",
    Marc_Pais: "",
    Marc_SolicitudNacional: "",
    Marc_Registro: "",
    Marc_Marca: "",
    Marc_Diseno: "",
    Marc_Clase: "",
    Marc_Titular: "",
    Marc_Figura: "",
    Marc_Titulo: "",
    Marc_Tipo: "",
    Marc_Rama: "",
    Marc_Autor: "",
    Marc_Observaciones: "",
    Marc_FechaSolicitud: null,
    Marc_FechaRegistro: null,
    Marc_Dure: null,
    Marc_Renovacion: null,
    Marc_Oposicion: null,
    Marc_ProximaTarea: "",
    Marc_FechaSeguimiento: null,
    Marc_FechaAviso: null,
    Marc_Estatus: true,
  });

  useEffect(() => {
    if (Usua_Id && !permissionsLoading) {
      cargarMarcas();
      cargarEmpresas();
    }
  }, [Usua_Id, permissionsLoading]);

  const cargarEmpresas = async () => {
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/obtenerPorPermiso/${Usua_Id}`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setEmpresas(data);
      }
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  const cargarMarcas = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSMARCA.MARCAS}/obtenerPorPermisos/${Usua_Id}`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setMarcas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al cargar marcas");
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
      if (!formData.Empr_Id || formData.Empr_Id === "") {
        setError("La empresa es obligatoria");
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...formData,
        Empr_Id: parseInt(formData.Empr_Id),
        Marc_FechaSolicitud: formData.Marc_FechaSolicitud || null,
        Marc_FechaRegistro: formData.Marc_FechaRegistro || null,
        Marc_Dure: formData.Marc_Dure || null,
        Marc_Renovacion: formData.Marc_Renovacion || null,
        Marc_Oposicion: formData.Marc_Oposicion || null,
        Marc_FechaSeguimiento: formData.Marc_FechaSeguimiento || null,
        Marc_FechaAviso: formData.Marc_FechaAviso || null,
        Marc_CreadoPor: editingMarca ? undefined : nombreUsuario,
        Marc_ModificadoPor: editingMarca ? nombreUsuario : undefined,
      };

      let response;
      if (editingMarca) {
        response = await ApiService.put(
          `${ApiConfig.ENDPOINTSMARCA.MARCAS}/actualizar/${formData.Marc_Id}`,
          dataToSend,
          token
        );
      } else {
        response = await ApiService.post(
          `${ApiConfig.ENDPOINTSMARCA.MARCAS}/crear`,
          dataToSend,
          token
        );
      }

      if (response.ok) {
        setSuccess(
          editingMarca
            ? "MARCA ACTUALIZADA EXITOSAMENTE"
            : "MARCA CREADA EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        await cargarMarcas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.mensaje || "Error al guardar la marca";
        setError(errorMessage);
        // Cerrar el modal para que el error sea visible
        setShowModal(false);
        // Hacer scroll al inicio para que vea la alerta
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Limpiar el error después de 6 segundos
        setTimeout(() => setError(""), 6000);
      }
    } catch (error) {
      const errorMessage = "Error de conexión: " + error.message;
      setError(errorMessage);
      // Cerrar el modal para que el error sea visible
      setShowModal(false);
      // Hacer scroll al inicio
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Limpiar el error después de 6 segundos
      setTimeout(() => setError(""), 6000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!marcaToDelete) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.delete(
        `${ApiConfig.ENDPOINTSMARCA.MARCAS}/eliminar/${marcaToDelete.Marc_Id}`,
        token
      );

      if (response.ok) {
        setSuccess("MARCA DESACTIVADA EXITOSAMENTE");
        setShowDeleteModal(false);
        setMarcaToDelete(null);
        await cargarMarcas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al desactivar la marca");
        setShowDeleteModal(false);
        setMarcaToDelete(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowDeleteModal(false);
      setMarcaToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!marcaToActivate) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.patch(
        `${ApiConfig.ENDPOINTSMARCA.MARCAS}/activar/${marcaToActivate.Marc_Id}`,
        null,
        token
      );

      if (response.ok) {
        setSuccess("MARCA ACTIVADA EXITOSAMENTE");
        setShowActivateModal(false);
        setMarcaToActivate(null);
        await cargarMarcas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al activar la marca");
        setShowActivateModal(false);
        setMarcaToActivate(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowActivateModal(false);
      setMarcaToActivate(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (marca) => {
    setEditingMarca(marca);
    setFormData({
      Marc_Id: marca.Marc_Id,
      Empr_Id: marca.Empr_Id.toString(),
      Marc_Consecutivo: marca.Marc_Consecutivo || "",
      Marc_Pais: marca.Marc_Pais || "",
      Marc_SolicitudNacional: marca.Marc_SolicitudNacional || "",
      Marc_Registro: marca.Marc_Registro || "",
      Marc_Marca: marca.Marc_Marca || "",
      Marc_Diseno: marca.Marc_Diseno || "",
      Marc_Clase: marca.Marc_Clase || "",
      Marc_Titular: marca.Marc_Titular || "",
      Marc_Figura: marca.Marc_Figura || "",
      Marc_Titulo: marca.Marc_Titulo || "",
      Marc_Tipo: marca.Marc_Tipo || "",
      Marc_Rama: marca.Marc_Rama || "",
      Marc_Autor: marca.Marc_Autor || "",
      Marc_Observaciones: marca.Marc_Observaciones || "",
      Marc_FechaSolicitud: marca.Marc_FechaSolicitud
        ? new Date(marca.Marc_FechaSolicitud).toISOString().split("T")[0]
        : "",
      Marc_FechaRegistro: marca.Marc_FechaRegistro
        ? new Date(marca.Marc_FechaRegistro).toISOString().split("T")[0]
        : "",
      Marc_Dure: marca.Marc_Dure
        ? new Date(marca.Marc_Dure).toISOString().split("T")[0]
        : "",
      Marc_Renovacion: marca.Marc_Renovacion
        ? new Date(marca.Marc_Renovacion).toISOString().split("T")[0]
        : "",
      Marc_Oposicion: marca.Marc_Oposicion
        ? new Date(marca.Marc_Oposicion).toISOString().split("T")[0]
        : "",
      Marc_ProximaTarea: marca.Marc_ProximaTarea || "",
      Marc_FechaSeguimiento: marca.Marc_FechaSeguimiento
        ? new Date(marca.Marc_FechaSeguimiento).toISOString().split("T")[0]
        : "",
      Marc_FechaAviso: marca.Marc_FechaAviso
        ? new Date(marca.Marc_FechaAviso).toISOString().split("T")[0]
        : "",
      Marc_Estatus: marca.Marc_Estatus,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      Marc_Id: 0,
      Empr_Id: "",
      Marc_Consecutivo: "",
      Marc_Pais: "",
      Marc_SolicitudNacional: "",
      Marc_Registro: "",
      Marc_Marca: "",
      Marc_Diseno: "",
      Marc_Clase: "",
      Marc_Titular: "",
      Marc_Figura: "",
      Marc_Titulo: "",
      Marc_Tipo: "",
      Marc_Rama: "",
      Marc_Autor: "",
      Marc_Observaciones: "",
      Marc_FechaSolicitud: "",
      Marc_FechaRegistro: "",
      Marc_Dure: "",
      Marc_Renovacion: "",
      Marc_Oposicion: "",
      Marc_ProximaTarea: "",
      Marc_FechaSeguimiento: "",
      Marc_FechaAviso: "",
      Marc_Estatus: true,
    });
    setEditingMarca(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    //setError("");
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredMarcas);
    setSuccess("ARCHIVO EXCEL EXPORTADO EXITOSAMENTE");
    setTimeout(() => setSuccess(""), 4000);
  };

  const filteredMarcas = marcas.filter((marca) => {
    const matchesSearch =
      marca.Marc_Marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.Marc_Titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.Marc_Registro?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && marca.Marc_Estatus) ||
      (filterStatus === "inactive" && !marca.Marc_Estatus);

    return matchesSearch && matchesStatus;
  });

  const empresasOptions = empresas.map((empresa) => ({
    value: empresa.Empr_Id.toString(),
    label: `${empresa.Empr_Nombre} (${empresa.Empr_Clave})`,
  }));

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
                <Tag className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-stone-900">
                  Gestión de Marcas
                </h1>
                <p className="text-xs md:text-sm text-stone-600">
                  Administra todas tus marcas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <FileDown className="w-5 h-5" />
                <span className="hidden sm:inline">Exportar Excel</span>
              </button>
              {hasPermission("Marcas.Agregar") && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nueva Marca</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-stone-700 text-white shadow-lg"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "active"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "inactive"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                Inactivas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 md:px-4 py-6">
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

        {loading && !showModal ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <MarcasTable
            marcas={filteredMarcas}
            onEdit={openEditModal}
            onDelete={(marca) => {
              setMarcaToDelete(marca);
              setShowDeleteModal(true);
            }}
            onActivate={(marca) => {
              setMarcaToActivate(marca);
              setShowActivateModal(true);
            }}
            onViewFiles={(marca) => {
              setSelectedMarca(marca);
              setShowFilesModal(true);
            }}
            onViewDetails={(marca) => {
              setSelectedMarca(marca);
              setShowDetailsModal(true);
            }}
            hasPermission={hasPermission}
          />
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div
              className="p-8 rounded-t-3xl"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingMarca ? "Editar Marca" : "Nueva Marca"}
                  </h2>
                  {editingMarca && formData.Marc_Marca && (
                    <p className="text-white/90 text-sm mt-1">
                      {formData.Marc_Marca}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* EMPRESA - OBLIGATORIO */}
                <div className="md:col-span-2">
                  <Select
                    label="Empresa"
                    options={empresasOptions}
                    value={formData.Empr_Id}
                    onChange={(value) =>
                      setFormData({ ...formData, Empr_Id: value })
                    }
                    placeholder="Seleccione una empresa"
                    required={true}
                  />
                </div>

                {/* CONSECUTIVO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Consecutivo
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Consecutivo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Consecutivo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Consecutivo"
                  />
                </div>

                {/* PAÍS */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Pais}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Pais: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Pais"
                  />
                </div>

                {/* SOLICITUD NACIONAL (EXPEDIENTE) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Solicitud Nacional (Expediente)
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_SolicitudNacional}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_SolicitudNacional: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Expediente"
                  />
                </div>

                {/* REGISTRO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Registro
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Registro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Registro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Registro"
                  />
                </div>

                {/* MARCA */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Marca}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Marca: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Nombre de la marca"
                  />
                </div>

                {/* DISEÑO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Diseño
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Diseno}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Diseno: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Diseño"
                  />
                </div>

                {/* CLASE */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Clase
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Clase}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Clase: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Clase"
                  />
                </div>

                {/* TITULAR - 2 columnas */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-stone-700">
                    Titular
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Titular}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Titular: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Titular"
                  />
                </div>

                {/* FIGURA */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Figura
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Figura}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Figura: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Figura"
                  />
                </div>

                {/* TÍTULO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Titulo: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Título"
                  />
                </div>

                {/* TIPO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Tipo
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Tipo: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Tipo"
                  />
                </div>

                {/* RAMA */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Rama
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Rama}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Rama: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Rama"
                  />
                </div>

                {/* AUTOR */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_Autor}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Autor: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Autor"
                  />
                </div>

                {/* OBSERVACIONES - 2 columnas */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-stone-700">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.Marc_Observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Observaciones: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                    rows="3"
                    placeholder="Observaciones adicionales..."
                  />
                </div>

                {/* FECHA SOLICITUD */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Fecha Solicitud
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_FechaSolicitud || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_FechaSolicitud: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* FECHA REGISTRO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Fecha Registro
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_FechaRegistro || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_FechaRegistro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* DURE */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Dure
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_Dure || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, Marc_Dure: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* RENOVACION */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Renovación
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_Renovacion || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Renovacion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* OPOSICIÓN */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Oposición
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_Oposicion || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_Oposicion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* PRÓXIMA TAREA */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Próxima Tarea
                  </label>
                  <input
                    type="text"
                    value={formData.Marc_ProximaTarea}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_ProximaTarea: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Próxima tarea"
                  />
                </div>

                {/* FECHA DE SEGUIMIENTO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Fecha de Seguimiento
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_FechaSeguimiento || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_FechaSeguimiento: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* FECHA DE AVISO */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Fecha de Aviso
                  </label>
                  <input
                    type="date"
                    value={formData.Marc_FechaAviso || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Marc_FechaAviso: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.Marc_Estatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Marc_Estatus: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-stone-300 cursor-pointer"
                  style={{ accentColor: "#6b5345" }}
                />
                <label
                  htmlFor="activo"
                  className="text-sm font-semibold text-stone-700 cursor-pointer"
                >
                  Marca activa
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
                      {editingMarca ? "Actualizar" : "Crear"} Marca
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Desactivar */}
      {showDeleteModal && marcaToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-t-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-stone-900">
                ¿Desactivar Marca?
              </h2>
            </div>

            <div className="p-8">
              <p className="text-center text-stone-600 mb-6 leading-relaxed">
                ¿Estás seguro de que deseas desactivar la marca{" "}
                <span className="font-bold text-stone-900 block mt-2 text-lg">
                  "{marcaToDelete.Marc_Marca}"
                </span>
                ?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMarcaToDelete(null);
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

      {/* Modal Activar */}
      {showActivateModal && marcaToActivate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-stone-900">
                ¿Activar Marca?
              </h2>
            </div>

            <div className="p-8">
              <p className="text-center text-stone-600 mb-6 leading-relaxed">
                ¿Estás seguro de que deseas activar la marca{" "}
                <span className="font-bold text-stone-900 block mt-2 text-lg">
                  "{marcaToActivate.Marc_Marca}"
                </span>
                ?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowActivateModal(false);
                    setMarcaToActivate(null);
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

      {/* Modal Archivos */}
      {showFilesModal && selectedMarca && (
        <MarcasFiles
          marca={selectedMarca}
          onClose={() => {
            setShowFilesModal(false);
            setSelectedMarca(null);
          }}
        />
      )}

      {/* Modal Detalles */}
      {showDetailsModal && selectedMarca && (
        <MarcasDetails
          marca={selectedMarca}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMarca(null);
          }}
        />
      )}
    </div>
  );
}

export default Marcas;
