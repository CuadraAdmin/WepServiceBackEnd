import { useState, useEffect } from "react";
import { Building2, Plus, Search, FileDown } from "lucide-react";
import Alert from "../Globales/Alert";
import EmpresasTable from "./EmpresasTable";
import ModalFormulario from "./ModalFormulario";
import ModalDesactivar from "./ModalDesactivar";
import ModalActivar from "./ModalActivar";
import ApiConfig from "../Config/api.config";
import { usePermissions } from "../../hooks/usePermissions";
import ApiService from "../../Services/ApiService";

function Empresas({ token, userData }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  const [empresaToActivate, setEmpresaToActivate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const Usua_Id = usuario.usua_Id;

  const { hasPermission } = usePermissions(token, Usua_Id);

  const [formData, setFormData] = useState({
    Empr_Id: 0,
    Empr_Clave: "",
    Empr_Nombre: "",
    Empr_Estatus: true,
  });

  useEffect(() => {
    if (Usua_Id) {
      cargarEmpresas();
    }
  }, [Usua_Id]);

  const cargarEmpresas = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/listar`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setEmpresas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al cargar empresas");
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
      const dataToSend = {
        ...formData,
        Empr_CreadoPor: editingEmpresa ? undefined : nombreUsuario,
        Empr_ModificadoPor: editingEmpresa ? nombreUsuario : undefined,
      };

      let response;
      if (editingEmpresa) {
        response = await ApiService.put(
          `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/actualizar/${formData.Empr_Id}`,
          dataToSend,
          token
        );
      } else {
        response = await ApiService.post(
          `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/crear`,
          dataToSend,
          token
        );
      }

      if (response.ok) {
        setSuccess(
          editingEmpresa
            ? "EMPRESA ACTUALIZADA EXITOSAMENTE"
            : "EMPRESA CREADA EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        await cargarEmpresas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al guardar la empresa");
        setTimeout(() => setError(""), 8000);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!empresaToDelete) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const empresaActualizada = {
        ...empresaToDelete,
        Empr_Estatus: false,
        Empr_ModificadoPor: nombreUsuario,
      };

      const response = await ApiService.put(
        `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/actualizar/${empresaToDelete.Empr_Id}`,
        empresaActualizada,
        token
      );

      if (response.ok) {
        setSuccess("EMPRESA DESACTIVADA EXITOSAMENTE");
        setShowDeleteModal(false);
        setEmpresaToDelete(null);
        await cargarEmpresas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al desactivar la empresa");
        setShowDeleteModal(false);
        setEmpresaToDelete(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowDeleteModal(false);
      setEmpresaToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!empresaToActivate) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const empresaActualizada = {
        ...empresaToActivate,
        Empr_Estatus: true,
        Empr_ModificadoPor: nombreUsuario,
      };

      const response = await ApiService.put(
        `${ApiConfig.ENDPOINTSEMPRESAS.EMPRESAS}/actualizar/${empresaToActivate.Empr_Id}`,
        empresaActualizada,
        token
      );

      if (response.ok) {
        setSuccess("EMPRESA ACTIVADA EXITOSAMENTE");
        setShowActivateModal(false);
        setEmpresaToActivate(null);
        await cargarEmpresas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al activar la empresa");
        setShowActivateModal(false);
        setEmpresaToActivate(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowActivateModal(false);
      setEmpresaToActivate(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      Empr_Id: empresa.Empr_Id,
      Empr_Clave: empresa.Empr_Clave || "",
      Empr_Nombre: empresa.Empr_Nombre || "",
      Empr_Estatus: empresa.Empr_Estatus,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      Empr_Id: 0,
      Empr_Clave: "",
      Empr_Nombre: "",
      Empr_Estatus: true,
    });
    setEditingEmpresa(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError("");
  };

  const filteredEmpresas = empresas.filter((empresa) => {
    const matchesSearch =
      empresa.Empr_Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.Empr_Clave?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && empresa.Empr_Estatus) ||
      (filterStatus === "inactive" && !empresa.Empr_Estatus);

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
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-stone-900">
                  Gestión de Empresas
                </h1>
                <p className="text-xs md:text-sm text-stone-600">
                  Administra todas tus empresas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {hasPermission("Empresas.Agregar") && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nueva Empresa</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white shadow-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white shadow-sm font-semibold text-stone-700 cursor-pointer hover:bg-stone-50"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
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
          <EmpresasTable
            empresas={filteredEmpresas}
            onEdit={openEditModal}
            onDelete={(empresa) => {
              setEmpresaToDelete(empresa);
              setShowDeleteModal(true);
            }}
            onActivate={(empresa) => {
              setEmpresaToActivate(empresa);
              setShowActivateModal(true);
            }}
            hasPermission={hasPermission}
          />
        )}
      </div>

      <ModalFormulario
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        error={error}
        setError={setError}
        editingEmpresa={editingEmpresa}
      />

      <ModalDesactivar
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEmpresaToDelete(null);
        }}
        onConfirm={handleDelete}
        empresa={empresaToDelete}
        loading={loading}
      />

      <ModalActivar
        show={showActivateModal}
        onClose={() => {
          setShowActivateModal(false);
          setEmpresaToActivate(null);
        }}
        onConfirm={handleActivate}
        empresa={empresaToActivate}
        loading={loading}
      />
    </div>
  );
}

export default Empresas;
