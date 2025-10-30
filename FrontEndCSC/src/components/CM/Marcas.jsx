import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Filter,
  Check,
  FileDown,
  Trash2,
} from "lucide-react";
import Alert from "../Globales/Alert";
import MarcasTable from "./MarcasTable";
import MarcasFiles from "./MarcasFiles";
import { exportToExcel } from "./exportUtils";
import MultiSelectConBusqueda from "../Globales/MultiSelectConBusqueda";

function Marcas({ token, userData }) {
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [editingMarca, setEditingMarca] = useState(null);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
  const [marcaToActivate, setMarcaToActivate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const Usua_Id = usuario.usua_Id;
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    paisOrigen: "",
    anioFundacion: "",
    color: "#6b5345",
    activo: true,
  });
  //alert(Usua_Id + " " + nombreUsuario);

  useEffect(() => {
    cargarMarcas();
  }, []);

  const cargarMarcas = () => {
    setLoading(true);
    setTimeout(() => {
      const marcasJson = [
        {
          id: 1,
          nombre: "Cuadra",
          descripcion: "Marca líder en ropa",
          categoria: "Vaquero",
          paisOrigen: "Estados Unidos",
          anioFundacion: "20/10/2026",
          color: "#FF6B35",
          activo: true,
        },
        {
          id: 2,
          nombre: "Corra l",
          descripcion: "Ropa USA",
          categoria: "Vaquero",
          paisOrigen: "USA",
          anioFundacion: "01/02/2025",
          color: "#004D9B",
          activo: true,
        },
        {
          id: 3,
          nombre: "Tiendas Cuadra",
          descripcion: "Bolsas etc",
          categoria: "vestimenta",
          paisOrigen: "Mexico",
          anioFundacion: "03/03/2027",
          color: "#000000",
          activo: false,
        },
      ];
      setMarcas(marcasJson);
      setLoading(false);
    }, 1000);
  };
  const opcionesMarcas = marcas.map((marca) => ({
    value: marca.id.toString(),
    label: marca.nombre,
  }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      if (editingMarca) {
        setMarcas(
          marcas.map((m) =>
            m.id === editingMarca.id
              ? {
                  ...editingMarca,
                  ...formData,
                  nombre: formData.nombre.trim().toUpperCase(),
                }
              : m
          )
        );
        setSuccess("MARCA ACTUALIZADA EXITOSAMENTE");
      } else {
        const newMarca = {
          id: Math.max(...marcas.map((m) => m.id), 0) + 1,
          ...formData,
          nombre: formData.nombre.trim().toUpperCase(),
        };
        setMarcas([...marcas, newMarca]);
        setSuccess("MARCA CREADA EXITOSAMENTE");
      }
      setShowModal(false);
      resetForm();
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }, 1000);
  };

  const handleDelete = () => {
    if (!marcaToDelete) return;
    setLoading(true);

    setTimeout(() => {
      setMarcas(
        marcas.map((m) =>
          m.id === marcaToDelete.id ? { ...m, activo: false } : m
        )
      );
      setSuccess("MARCA DESACTIVADA EXITOSAMENTE");
      setShowDeleteModal(false);
      setMarcaToDelete(null);
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }, 800);
  };

  const handleActivate = () => {
    if (!marcaToActivate) return;
    setLoading(true);

    setTimeout(() => {
      setMarcas(
        marcas.map((m) =>
          m.id === marcaToActivate.id ? { ...m, activo: true } : m
        )
      );
      setSuccess("MARCA ACTIVADA EXITOSAMENTE");
      setShowActivateModal(false);
      setMarcaToActivate(null);
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }, 800);
  };

  const openEditModal = (marca) => {
    setEditingMarca(marca);
    setFormData({
      nombre: marca.nombre,
      descripcion: marca.descripcion || "",
      categoria: marca.categoria || "",
      paisOrigen: marca.paisOrigen || "",
      anioFundacion: marca.anioFundacion || "",
      color: marca.color || "#6b5345",
      activo: marca.activo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      categoria: "",
      paisOrigen: "",
      anioFundacion: "",
      color: "#6b5345",
      activo: true,
    });
    setEditingMarca(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError("");
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredMarcas);
    setSuccess("ARCHIVO EXCEL EXPORTADO EXITOSAMENTE");
    setTimeout(() => setSuccess(""), 4000);
  };

  const filteredMarcas = marcas.filter((marca) => {
    const matchesSearch =
      marca.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.categoria?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && marca.activo) ||
      (filterStatus === "inactive" && !marca.activo);

    return matchesSearch && matchesStatus;
  });

  const statsActivas = marcas.filter((m) => m.activo).length;
  const statsInactivas = marcas.filter((m) => !m.activo).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50">
      {/* Header */}
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
            </div>
          </div>

          <div className="min-h-screen...">
            <div className="px-4 py-4">
              <MultiSelectConBusqueda
                options={opcionesMarcas}
                selected={marcasSeleccionadas}
                onChange={setMarcasSeleccionadas}
                label="Seleccionar Marcas"
                placeholder="Elige una o más marcas..."
              />
            </div>
          </div>
          {/* Filters */}
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

      {/* Main Content */}
      <div className="px-2 md:px-4 py-6">
        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
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
          />
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div
              className="p-8 rounded-t-3xl"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingMarca ? "Editar Marca" : "Nueva Marca"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && <Alert variant="error">{error}</Alert>}

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  placeholder="CUADRA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                  rows="3"
                  placeholder="Descripción de la marca..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="Vaquero"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">
                    País de Origen
                  </label>
                  <input
                    type="text"
                    value={formData.paisOrigen}
                    onChange={(e) =>
                      setFormData({ ...formData, paisOrigen: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                    placeholder="México"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700">
                  Año de Fundación
                </label>
                <input
                  type="text"
                  value={formData.anioFundacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      anioFundacion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  Color de Marca
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                      })
                    }
                    className="w-20 h-12 rounded-xl border-2 border-stone-200 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          color: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white font-mono"
                      placeholder="#6b5345"
                    />
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl shadow-md"
                    style={{ background: formData.color }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activo: e.target.checked,
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

      {/* Modal de Confirmación - Desactivar */}
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
                  "{marcaToDelete.nombre}"
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

      {/* Modal de Confirmación - Activar */}
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
                  "{marcaToActivate.nombre}"
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

      {/* Modal de Archivos */}
      {showFilesModal && selectedMarca && (
        <MarcasFiles
          marca={selectedMarca}
          onClose={() => {
            setShowFilesModal(false);
            setSelectedMarca(null);
          }}
        />
      )}
    </div>
  );
}

export default Marcas;
