import { useState, useEffect } from "react";
import { Tag, Plus, Search, FileDown } from "lucide-react";
import Alert from "../Globales/Alert";
import MarcasTable from "./MarcasTable";
import MarcasFiles from "./MarcasFiles";
import MarcasDetails from "./MarcasDetails";
import MarcasAdvancedFilters, {
  FilterButton,
} from "../Globales/MarcasAdvancedFilters";
import ModalFormulario from "./ModalFormulario";
import ModalDesactivar from "./ModalDesactivar";
import ModalActivar from "./ModalActivar";
import { exportToExcel } from "./exportUtils";
import ApiConfig from "../Config/api.config";
import { usePermissions } from "../../hooks/usePermissions";
import ApiService from "../../Services/ApiService";
import MarcaTareasModal from "./MarcaTareasModal";

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
  const [showTasksModal, setShowTasksModal] = useState(false);

  // Estado para filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const usuario = userData?.usuario || {};
  const nombreUsuario = usuario.usua_Usuario || "Sistema";
  const Usua_Id = usuario.usua_Id;

  const { hasPermission, loading: permissionsLoading } = usePermissions(
    token,
    Usua_Id
  );
  const handleViewTasks = (marca) => {
    setSelectedMarca(marca);
    setShowTasksModal(true);
  };
  const extractErrorMessage = (errorMessage) => {
    if (!errorMessage) return "Error desconocido";

    if (errorMessage.includes("Error en BP al")) {
      const match = errorMessage.match(/Error en BP al [^:]+: (.+)/);
      if (match && match[1]) {
        return extractErrorMessage(match[1]);
      }
    }

    if (errorMessage.includes("SQLError:")) {
      const match = errorMessage.match(/SQLError: ([^#]+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    if (errorMessage.includes("#SP:") || errorMessage.includes("#SV:")) {
      const match = errorMessage.match(/^([^#]+)/);
      if (match && match[1]) {
        return match[1].replace("SQLError:", "").trim();
      }
    }

    return errorMessage;
  };

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

  const handleSubmit = async (
    e,
    imageHandlers,
    contactosParam,
    contactosOriginalesParam = []
  ) => {
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
      let marcaId;

      if (editingMarca) {
        response = await ApiService.put(
          `${ApiConfig.ENDPOINTSMARCA.MARCAS}/actualizar/${formData.Marc_Id}`,
          dataToSend,
          token
        );
        marcaId = formData.Marc_Id;
      } else {
        response = await ApiService.post(
          `${ApiConfig.ENDPOINTSMARCA.MARCAS}/crear`,
          dataToSend,
          token
        );

        if (response.ok) {
          const result = await response.json();
          marcaId = result.id || result.marcaId || result.Marc_Id;
        }
      }

      if (response.ok) {
        // Procesar imagen
        if (imageHandlers && imageHandlers.hasImageChanges) {
          try {
            if (imageHandlers.deleteImage) {
              await imageHandlers.deleteImage();
            }

            if (imageHandlers.uploadImage) {
              const imageUrl = await imageHandlers.uploadImage(marcaId);
              if (imageUrl) {
                await ApiService.put(
                  `${ApiConfig.ENDPOINTSMARCA.MARCAS}/actualizar/${marcaId}`,
                  { ...dataToSend, Marc_Id: marcaId, Marc_Diseno: imageUrl },
                  token
                );
              }
            }
          } catch (imageError) {
            console.error("Error al procesar imagen:", imageError);
          }
        }

        // ELIMINAR CONTACTOS QUE YA NO ESTÁN (NUEVO)
        if (editingMarca && contactosOriginalesParam.length > 0) {
          try {
            const idsActuales = contactosParam
              .filter((c) => c.id)
              .map((c) => c.id);

            const contactosAEliminar = contactosOriginalesParam.filter(
              (original) => !idsActuales.includes(original.id)
            );

            for (const contacto of contactosAEliminar) {
              await ApiService.delete(
                `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/eliminar/${contacto.id}?modificadoPor=${nombreUsuario}`,
                token
              );
            }
          } catch (deleteError) {
            console.error("Error al eliminar contactos:", deleteError);
          }
        }

        // GUARDAR/ACTUALIZAR CONTACTOS
        if (contactosParam && contactosParam.length > 0) {
          for (const contacto of contactosParam) {
            // Formatear teléfono: agregar "1" si es +52 con 10 dígitos
            let telefonoFormateado = contacto.telefonoWhatsApp;
            if (telefonoFormateado.startsWith("+52")) {
              const digitosDespuesDe52 = telefonoFormateado.slice(3);
              if (digitosDespuesDe52.length === 10) {
                telefonoFormateado = "+521" + digitosDespuesDe52;
              }
            }

            if (contacto.id && editingMarca) {
              // ACTUALIZAR existente
              await ApiService.put(
                `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/actualizar/${contacto.id}`,
                {
                  marc_Id: marcaId,
                  marcNoti_Nombre: contacto.nombre,
                  marcNoti_Correo: contacto.correo,
                  marcNoti_TelefonoWhatsApp: telefonoFormateado, // Usar formateado
                  marcNoti_Estatus: true,
                  marcNoti_ModificadoPor: nombreUsuario,
                },
                token
              );
            } else {
              // CREAR nuevo
              await ApiService.post(
                `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/crear`,
                {
                  marc_Id: marcaId,
                  marcNoti_Nombre: contacto.nombre,
                  marcNoti_Correo: contacto.correo,
                  marcNoti_TelefonoWhatsApp: telefonoFormateado, // Usar formateado
                  marcNoti_Estatus: true,
                  marcNoti_CreadoPor: nombreUsuario,
                },
                token
              );
            }
          }
        }

        setSuccess(
          editingMarca
            ? "MARCA ACTUALIZADA EXITOSAMENTE"
            : "MARCA CREADA EXITOSAMENTE"
        );
        setShowModal(false);
        resetForm();
        setError("");
        await cargarMarcas();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const errorData = await response.json();
        const rawError = errorData.mensaje || "Error al guardar la marca";
        const cleanError = extractErrorMessage(rawError);
        setError(cleanError);
        setTimeout(() => setError(""), 8000);
      }
    } catch (error) {
      const rawError = "Error de conexión: " + error.message;
      const cleanError = extractErrorMessage(rawError);
      setError(cleanError);
      setTimeout(() => setError(""), 8000);
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
  // Agregar esta función en Marcas.jsx
  const calcularEstadoRenovacion = (fechaRenovacion) => {
    if (!fechaRenovacion)
      return {
        texto: "Sin fecha",
        color: "bg-gray-100 text-gray-700",
        border: "border-gray-200",
      };

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaRenov = new Date(fechaRenovacion);
    fechaRenov.setHours(0, 0, 0, 0);

    const diasDiferencia = Math.ceil(
      (fechaRenov - hoy) / (1000 * 60 * 60 * 24)
    );

    if (diasDiferencia < 0) {
      return {
        texto: "Vencida",
        color: "bg-red-600 text-white",
        border: "border-red-600",
      };
    } else if (diasDiferencia <= 1) {
      return {
        texto: "Urgente",
        color: "bg-red-500 text-white",
        border: "border-red-500",
      };
    } else if (diasDiferencia <= 15) {
      return {
        texto: "Próximo",
        color: "bg-yellow-400 text-yellow-900",
        border: "border-yellow-400",
      };
    } else if (diasDiferencia <= 29) {
      return {
        texto: "Atención",
        color: "bg-blue-400 text-blue-900",
        border: "border-blue-400",
      };
    } else {
      return {
        texto: "Normal",
        color: "bg-green-500 text-white",
        border: "border-green-500",
      };
    }
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
    setError("");
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredMarcas);
    setSuccess("ARCHIVO EXCEL EXPORTADO EXITOSAMENTE");
    setTimeout(() => setSuccess(""), 4000);
  };

  const applyAdvancedFilters = (marca, filters) => {
    if (
      filters.empresas.length > 0 &&
      !filters.empresas.includes(marca.Empr_Nombre)
    ) {
      return false;
    }

    if (
      filters.marcas.length > 0 &&
      !filters.marcas.includes(marca.Marc_Marca)
    ) {
      return false;
    }

    if (
      filters.registros.length > 0 &&
      !filters.registros.includes(marca.Marc_Registro)
    ) {
      return false;
    }

    if (filters.fechaAno || filters.fechaMes || filters.fechaDia) {
      if (!marca.Marc_Renovacion) return false;

      const fechaRenovacion = new Date(marca.Marc_Renovacion);

      if (
        filters.fechaAno &&
        fechaRenovacion.getFullYear() !== parseInt(filters.fechaAno)
      ) {
        return false;
      }

      if (
        filters.fechaMes &&
        String(fechaRenovacion.getMonth() + 1).padStart(2, "0") !==
          filters.fechaMes
      ) {
        return false;
      }

      if (
        filters.fechaDia &&
        String(fechaRenovacion.getDate()).padStart(2, "0") !== filters.fechaDia
      ) {
        return false;
      }
    }

    if (filters.fechaRangoDesde || filters.fechaRangoHasta) {
      if (!marca.Marc_Renovacion) return false;

      const fechaStr = marca.Marc_Renovacion.split("T")[0];
      const [year, month, day] = fechaStr.split("-");
      const fechaRenovacion = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      if (filters.fechaRangoDesde) {
        const [desdeYear, desdeMonth, desdeDay] =
          filters.fechaRangoDesde.split("-");
        const fechaDesde = new Date(
          parseInt(desdeYear),
          parseInt(desdeMonth) - 1,
          parseInt(desdeDay)
        );

        if (fechaRenovacion < fechaDesde) {
          return false;
        }
      }

      if (filters.fechaRangoHasta) {
        const [hastaYear, hastaMonth, hastaDay] =
          filters.fechaRangoHasta.split("-");
        const fechaHasta = new Date(
          parseInt(hastaYear),
          parseInt(hastaMonth) - 1,
          parseInt(hastaDay)
        );

        if (fechaRenovacion > fechaHasta) {
          return false;
        }
      }
    }

    // Filtro por estatus
    if (filters.estadoRenovacion.length > 0) {
      const estadoActual = calcularEstadoRenovacion(marca.Marc_Renovacion);
      if (!filters.estadoRenovacion.includes(estadoActual.texto)) {
        return false;
      }
    }

    return true;
  };

  const filteredMarcas = marcas.filter((marca) => {
    // Búsqueda por texto
    const matchesSearch =
      marca.Marc_Marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.Marc_Titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.Marc_Registro?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de estatus básico
    const matchesStatus =
      filterStatus === "all" ||
      (() => {
        const estado = calcularEstadoRenovacion(marca.Marc_Renovacion);
        if (filterStatus === "vencida") return estado.texto === "Vencida";
        if (filterStatus === "urgente") return estado.texto === "Urgente";
        if (filterStatus === "proximo") return estado.texto === "Próximo";
        if (filterStatus === "atencion") return estado.texto === "Atención";
        if (filterStatus === "normal") return estado.texto === "Normal";
        if (filterStatus === "sinfecha") return estado.texto === "Sin fecha";
        return true;
      })();

    // Filtros avanzados
    const matchesAdvanced =
      !advancedFilters || applyAdvancedFilters(marca, advancedFilters);

    return matchesSearch && matchesStatus && matchesAdvanced;
  });

  // Calcular si hay filtros activos para el botón
  const hasActiveFilters = advancedFilters !== null;

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

          {/* NUEVA BARRA DE BÚSQUEDA CON FILTROS Y SELECT DE ESTATUS */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Barra de búsqueda */}
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

            {/* Fila de Filtros y Select - En línea en móvil, separados en PC */}
            <div className="flex gap-3 md:contents">
              {/* Botón de Filtros Avanzados */}
              <FilterButton
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={() => setAdvancedFilters(null)}
              />

              {/* Select de Estatus */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 md:flex-initial px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-white shadow-sm font-semibold text-stone-700 cursor-pointer hover:bg-stone-50"
              >
                <option value="all">Todas</option>
                <option value="vencida">Vencida</option>
                <option value="urgente">Urgente</option>
                <option value="proximo">Próximo</option>
                <option value="atencion">Atención</option>
                <option value="normal">Normal</option>
                <option value="sinfecha">Sin fecha</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 md:px-4 py-6">
        {/* Filtros Avanzados */}
        <MarcasAdvancedFilters
          marcas={marcas}
          onApplyFilters={setAdvancedFilters}
          onClearFilters={() => setAdvancedFilters(null)}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

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
            onViewTasks={handleViewTasks}
            token={token}
          />
        )}
      </div>

      {/* Modal Crear/Editar */}
      <ModalFormulario
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        empresasOptions={empresasOptions}
        loading={loading}
        error={error}
        setError={setError}
        editingMarca={editingMarca}
        token={token}
        userData={userData}
      />

      {/* Modal Desactivar */}
      <ModalDesactivar
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMarcaToDelete(null);
        }}
        onConfirm={handleDelete}
        marca={marcaToDelete}
        loading={loading}
      />

      {/* Modal Activar */}
      <ModalActivar
        show={showActivateModal}
        onClose={() => {
          setShowActivateModal(false);
          setMarcaToActivate(null);
        }}
        onConfirm={handleActivate}
        marca={marcaToActivate}
        loading={loading}
      />

      {/* Modal Archivos */}
      {showFilesModal && selectedMarca && (
        <MarcasFiles
          marca={selectedMarca}
          token={token}
          onClose={() => {
            setShowFilesModal(false);
            setSelectedMarca(null);
            cargarMarcas();
          }}
          hasPermission={hasPermission}
        />
      )}

      {showDetailsModal && selectedMarca && (
        <MarcasDetails
          marca={selectedMarca}
          token={token}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMarca(null);
          }}
        />
      )}

      {/* Modal Tareas */}
      {showTasksModal && selectedMarca && (
        <MarcaTareasModal
          marca={selectedMarca}
          token={token}
          userData={userData}
          onClose={() => {
            setShowTasksModal(false);
            setSelectedMarca(null);
          }}
        />
      )}
    </div>
  );
}

export default Marcas;
