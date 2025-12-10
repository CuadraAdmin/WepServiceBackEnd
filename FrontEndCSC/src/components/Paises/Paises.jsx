import { useState, useEffect, useRef } from "react";
import { Globe, Plus, Search } from "lucide-react";
import Alert from "../Globales/Alert";
import PaisesTable from "./PaisesTable";
import ModalFormulario from "./ModalFormulario";
import ModalDesactivar from "./ModalDesactivar";
import ModalActivar from "./ModalActivar";
import ApiConfig from "../Config/api.config";
import { usePermissions } from "../../hooks/usePermissions";
import ApiService from "../../Services/ApiService";

function Paises({ token, userData }) {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editingPais, setEditingPais] = useState(null);
  const [paisToDelete, setPaisToDelete] = useState(null);
  const [paisToActivate, setPaisToActivate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const hasFetchedRef = useRef(false);

  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const Usua_Id = usuario.usua_Id;

  const { hasPermission } = usePermissions(token, Usua_Id);

  const [formData, setFormData] = useState({
    Pais_Id: 0,
    Pais_Clave: "",
    Pais_Nombre: "",
    Pais_Estatus: true,
  });

  useEffect(() => {
    if (Usua_Id && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      cargarPaises();
    }
  }, [Usua_Id]);

  const cargarPaises = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ApiService.get(
        `${ApiConfig.ENDPOINTSPAISES.PAISES}/listar`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        setPaises(data);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al cargar países");
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
        Pais_CreadoPor: editingPais ? undefined : nombreUsuario,
        Pais_ModificadoPor: editingPais ? nombreUsuario : undefined,
      };

      let response;
      if (editingPais) {
        response = await ApiService.put(
          `${ApiConfig.ENDPOINTSPAISES.PAISES}/actualizar/${formData.Pais_Id}`,
          dataToSend,
          token
        );
      } else {
        response = await ApiService.post(
          `${ApiConfig.ENDPOINTSPAISES.PAISES}/crear`,
          dataToSend,
          token
        );
      }

      if (response.ok) {
        setSuccess(
          editingPais
            ? "PAÍS ACTUALIZADO EXITOSAMENTE"
            : "PAÍS CREADO EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        await cargarPaises();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al guardar el país");
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
    if (!paisToDelete) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.delete(
        `${ApiConfig.ENDPOINTSPAISES.PAISES}/eliminar/${paisToDelete.Pais_Id}`,
        token
      );

      if (response.ok) {
        setSuccess("PAÍS DESACTIVADO EXITOSAMENTE");
        setShowDeleteModal(false);
        setPaisToDelete(null);
        await cargarPaises();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al desactivar el país");
        setShowDeleteModal(false);
        setPaisToDelete(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowDeleteModal(false);
      setPaisToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!paisToActivate) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.patch(
        `${ApiConfig.ENDPOINTSPAISES.PAISES}/activar/${paisToActivate.Pais_Id}`,
        {},
        token
      );

      if (response.ok) {
        setSuccess("PAÍS ACTIVADO EXITOSAMENTE");
        setShowActivateModal(false);
        setPaisToActivate(null);
        await cargarPaises();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al activar el país");
        setShowActivateModal(false);
        setPaisToActivate(null);
      }
    } catch (error) {
      setError("Error de conexión: " + error.message);
      setShowActivateModal(false);
      setPaisToActivate(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (pais) => {
    setEditingPais(pais);
    setFormData({
      Pais_Id: pais.Pais_Id,
      Pais_Clave: pais.Pais_Clave || "",
      Pais_Nombre: pais.Pais_Nombre || "",
      Pais_Estatus: pais.Pais_Estatus,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      Pais_Id: 0,
      Pais_Clave: "",
      Pais_Nombre: "",
      Pais_Estatus: true,
    });
    setEditingPais(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError("");
  };

  const filteredPaises = paises.filter((pais) => {
    const matchesSearch =
      pais.Pais_Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pais.Pais_Clave?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && pais.Pais_Estatus) ||
      (filterStatus === "inactive" && !pais.Pais_Estatus);

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
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-stone-900">
                  Gestión de Países
                </h1>
                <p className="text-xs md:text-sm text-stone-600">
                  Administra todos los países del sistema
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {hasPermission("Paises.Agregar") && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nuevo País</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar países..."
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
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
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
          <PaisesTable
            paises={filteredPaises}
            onEdit={openEditModal}
            onDelete={(pais) => {
              setPaisToDelete(pais);
              setShowDeleteModal(true);
            }}
            onActivate={(pais) => {
              setPaisToActivate(pais);
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
        editingPais={editingPais}
      />

      <ModalDesactivar
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPaisToDelete(null);
        }}
        onConfirm={handleDelete}
        pais={paisToDelete}
        loading={loading}
      />

      <ModalActivar
        show={showActivateModal}
        onClose={() => {
          setShowActivateModal(false);
          setPaisToActivate(null);
        }}
        onConfirm={handleActivate}
        pais={paisToActivate}
        loading={loading}
      />
    </div>
  );
}

export default Paises;
