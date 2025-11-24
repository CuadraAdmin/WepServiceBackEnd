import {
  Edit2,
  Trash2,
  Check,
  FileText,
  Upload,
  Eye,
  Filter,
  X,
  Info,
} from "lucide-react";
import Badge from "../Globales/Badge";
import ImageZoomModal from "./ImageZoomModal";
import { useState, useMemo, useEffect, useRef } from "react";
import { ListTodo } from "lucide-react";
import MarcaClaseModal from "./MarcaClaseModal";
function MarcasTable({
  marcas,
  onEdit,
  onDelete,
  onActivate,
  onViewFiles,
  onViewDetails,
  hasPermission,
  onViewTasks,
  token,
}) {
  const [showFilters, setShowFilters] = useState({});
  const [filters, setFilters] = useState({
    Empr_Nombre: "",
    Marc_Pais: "",
    Marc_Marca: "",
    Marc_Clase: "",
    Marc_Titular: "",
    Marc_Estatus: "",
    Marc_Renovacion_Min: "",
    Marc_Renovacion_Max: "",
  });
  const dropdownRefs = useRef({});
  const [selectedClase, setSelectedClase] = useState(null);

  // Estado para el modal de zoom de imagen (solo guardamos la imagen)
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => !ref || !ref.contains(event.target)
      );
      if (clickedOutside) {
        setShowFilters({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "N/A";
    }
  };

  const filterOptions = useMemo(() => {
    const empresas = [
      ...new Set(marcas.map((m) => m.Empr_Nombre).filter(Boolean)),
    ].sort();
    const paises = [
      ...new Set(marcas.map((m) => m.Marc_Pais).filter(Boolean)),
    ].sort();
    const marcasNames = [
      ...new Set(marcas.map((m) => m.Marc_Marca).filter(Boolean)),
    ].sort();
    const clases = [
      ...new Set(marcas.map((m) => m.Marc_Clase).filter(Boolean)),
    ].sort();
    const titulares = [
      ...new Set(marcas.map((m) => m.Marc_Titular).filter(Boolean)),
    ].sort();

    return { empresas, paises, marcasNames, clases, titulares };
  }, [marcas]);

  const toggleFilter = (column) => {
    setShowFilters((prev) => {
      if (prev[column]) {
        return {};
      }
      return { [column]: true };
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      Empr_Nombre: "",
      Marc_Pais: "",
      Marc_Marca: "",
      Marc_Clase: "",
      Marc_Titular: "",
      Marc_Estatus: "",
      Marc_Renovacion_Min: "",
      Marc_Renovacion_Max: "",
    });
    setShowFilters({});
  };

  const filteredMarcas = marcas.filter((marca) => {
    if (filters.Empr_Nombre && marca.Empr_Nombre !== filters.Empr_Nombre) {
      return false;
    }

    if (filters.Marc_Pais && marca.Marc_Pais !== filters.Marc_Pais) {
      return false;
    }

    if (filters.Marc_Marca && marca.Marc_Marca !== filters.Marc_Marca) {
      return false;
    }

    if (filters.Marc_Clase && marca.Marc_Clase !== filters.Marc_Clase) {
      return false;
    }

    if (filters.Marc_Titular && marca.Marc_Titular !== filters.Marc_Titular) {
      return false;
    }

    if (filters.Marc_Estatus !== "") {
      const isActive = filters.Marc_Estatus === "true";
      if (marca.Marc_Estatus !== isActive) {
        return false;
      }
    }

    if (filters.Marc_Renovacion_Min || filters.Marc_Renovacion_Max) {
      if (!marca.Marc_Renovacion) {
        return false;
      }

      // Crear fecha normalizada desde el string ISO
      const fechaStr = marca.Marc_Renovacion.split("T")[0];
      const [year, month, day] = fechaStr.split("-");
      const fechaRenovacion = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      if (filters.Marc_Renovacion_Min) {
        const fechaMinStr = filters.Marc_Renovacion_Min;
        const [minYear, minMonth, minDay] = fechaMinStr.split("-");
        const fechaMin = new Date(
          parseInt(minYear),
          parseInt(minMonth) - 1,
          parseInt(minDay)
        );

        if (fechaRenovacion < fechaMin) {
          return false;
        }
      }

      if (filters.Marc_Renovacion_Max) {
        const fechaMaxStr = filters.Marc_Renovacion_Max;
        const [maxYear, maxMonth, maxDay] = fechaMaxStr.split("-");
        const fechaMax = new Date(
          parseInt(maxYear),
          parseInt(maxMonth) - 1,
          parseInt(maxDay)
        );

        if (fechaRenovacion > fechaMax) {
          return false;
        }
      }
    }

    return true;
  });

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  // Función para abrir modal de zoom
  const handleImageClick = (marca) => {
    if (marca.Marc_Diseno) {
      setZoomImage({
        url: marca.Marc_Diseno,
        nombre: marca.Marc_Marca || "Diseño de marca",
      });
    }
  };

  // Función para cerrar modal de zoom
  const closeZoomModal = () => {
    setZoomImage(null);
  };

  return (
    <>
      <div className="space-y-4">
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar Filtros
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)]">
            <table className="w-full">
              <thead
                className="uppercase sticky top-0 z-10"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Empresa
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Empr_Nombre = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Empr_Nombre");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Empr_Nombre && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-56 max-h-72 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Empr_Nombre", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Empr_Nombre === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todas las empresas
                            </div>
                            {filterOptions.empresas.map((empresa) => (
                              <div
                                key={empresa}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleFilterChange("Empr_Nombre", empresa);
                                  setTimeout(() => setShowFilters({}), 0);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                  filters.Empr_Nombre === empresa
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-stone-900 hover:bg-stone-50"
                                }`}
                              >
                                {empresa}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        País
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Marc_Pais = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Pais");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Pais && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-56 max-h-72 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Pais", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Pais === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todos los países
                            </div>
                            {filterOptions.paises.map((pais) => (
                              <div
                                key={pais}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleFilterChange("Marc_Pais", pais);
                                  setTimeout(() => setShowFilters({}), 0);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                  filters.Marc_Pais === pais
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-stone-900 hover:bg-stone-50"
                                }`}
                              >
                                {pais}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-10 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Marca
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Marc_Marca = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Marca");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Marca && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-56 max-h-72 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Marca", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Marca === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todas las marcas
                            </div>
                            {filterOptions.marcasNames.map((marca) => (
                              <div
                                key={marca}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleFilterChange("Marc_Marca", marca);
                                  setTimeout(() => setShowFilters({}), 0);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                  filters.Marc_Marca === marca
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-stone-900 hover:bg-stone-50"
                                }`}
                              >
                                {marca}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    Diseño
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Clase
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Marc_Clase = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Clase");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Clase && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-56 max-h-72 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Clase", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Clase === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todas las clases
                            </div>
                            {filterOptions.clases.map((clase) => (
                              <div
                                key={clase}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleFilterChange("Marc_Clase", clase);
                                  setTimeout(() => setShowFilters({}), 0);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                  filters.Marc_Clase === clase
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-stone-900 hover:bg-stone-50"
                                }`}
                              >
                                {clase}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Titular
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Marc_Titular = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Titular");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Titular && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-56 max-h-72 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Titular", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Titular === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todos los titulares
                            </div>
                            {filterOptions.titulares.map((titular) => (
                              <div
                                key={titular}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleFilterChange("Marc_Titular", titular);
                                  setTimeout(() => setShowFilters({}), 0);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                  filters.Marc_Titular === titular
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-stone-900 hover:bg-stone-50"
                                }`}
                              >
                                {titular}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Estado
                      </span>
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current.Marc_Estatus = el)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Estatus");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Estatus && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-40 bg-white border border-stone-200 shadow-lg rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Estatus", "");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Estatus === ""
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Todos
                            </div>
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Estatus", "true");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Estatus === "true"
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Activo
                            </div>
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleFilterChange("Marc_Estatus", "false");
                                setTimeout(() => setShowFilters({}), 0);
                              }}
                              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                filters.Marc_Estatus === "false"
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-stone-900 hover:bg-stone-50"
                              }`}
                            >
                              Inactivo
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                    <div className="flex items-center">
                      <span className="py-1 px-2.5 text-sm text-white">
                        Fecha de Renovación
                      </span>
                      <div
                        className="relative"
                        ref={(el) =>
                          (dropdownRefs.current.Marc_Renovacion = el)
                        }
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("Marc_Renovacion");
                          }}
                          className="size-7.5 inline-flex justify-center items-center rounded-lg text-white border border-transparent hover:border-white/20 transition-colors ml-2"
                        >
                          <Filter className="w-3.5 h-3.5" />
                        </button>
                        {showFilters.Marc_Renovacion && (
                          <div
                            className="absolute top-full left-0 mt-2 z-50 w-72 bg-white border border-stone-200 shadow-lg rounded-lg p-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex gap-x-1">
                              <input
                                type="date"
                                value={filters.Marc_Renovacion_Min}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "Marc_Renovacion_Min",
                                    e.target.value
                                  )
                                }
                                placeholder="Mín"
                                className="w-full px-2.5 py-1.5 rounded-md text-xs text-stone-900 border border-stone-200 focus:border-blue-500 focus:ring-blue-500 outline-none"
                              />
                              <input
                                type="date"
                                value={filters.Marc_Renovacion_Max}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "Marc_Renovacion_Max",
                                    e.target.value
                                  )
                                }
                                placeholder="Máx"
                                className="w-full px-2.5 py-1.5 rounded-md text-xs text-stone-900 border border-stone-200 focus:border-blue-500 focus:ring-blue-500 outline-none"
                              />
                            </div>
                            <button
                              onClick={() => setShowFilters({})}
                              className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Aplicar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>

                  {hasPermission("Marcas.Archivos") && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white">
                      Archivos
                    </th>
                  )}
                  <th className="px-6 py-3 text-center text-xs font-semibold text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 uppercase">
                {filteredMarcas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={hasPermission("Marcas.Archivos") ? "10" : "9"}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-12 h-12 text-stone-300" />
                        <p className="text-stone-500 font-medium">
                          {hasActiveFilters
                            ? "No se encontraron marcas con los filtros aplicados"
                            : "No hay marcas para mostrar"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMarcas.map((marca) => (
                    <tr
                      key={marca.Marc_Id}
                      className="hover:bg-stone-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">
                          {marca.Empr_Nombre || "N/A"}
                        </div>
                        {marca.Empr_Clave && (
                          <div className="text-xs text-stone-500">
                            {marca.Empr_Clave}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-700 font-medium">
                          {marca.Marc_Pais || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900 text-lg">
                          {marca.Marc_Marca || "N/A"}
                        </div>
                        {marca.Marc_Registro && (
                          <div className="text-xs text-stone-500 mt-1">
                            Registro: {marca.Marc_Registro}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="relative w-20 h-20 rounded-lg border-2 border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden cursor-pointer group/image transition-all hover:border-blue-400 hover:shadow-lg"
                          onClick={() => handleImageClick(marca)}
                          title="Click para ampliar"
                        >
                          {marca.Marc_Diseno ? (
                            <>
                              <img
                                src={marca.Marc_Diseno}
                                alt={marca.Marc_Marca || "Diseño"}
                                className="w-full h-full object-contain p-1 transition-transform group-hover/image:scale-110"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              {/* Overlay con icono de zoom al hacer hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all flex items-center justify-center">
                                <Eye className="w-6 h-6 text-white opacity-0 group-hover/image:opacity-100 transition-opacity" />
                              </div>
                            </>
                          ) : null}
                          <div
                            className="flex flex-col items-center gap-1"
                            style={{
                              display: marca.Marc_Diseno ? "none" : "flex",
                            }}
                          >
                            <FileText className="w-6 h-6 text-stone-400" />
                            <span className="text-xs text-stone-400">
                              Sin imagen
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {marca.Marc_Clase ? (
                          <button
                            onClick={() => setSelectedClase(marca.Marc_Clase)}
                            className="px-3 items-center py-1.5 bg-stone-100 hover:bg-blue-100 text-stone-700 hover:text-blue-700 rounded-lg font-medium text-sm transition-colors"
                            title="Ver detalles"
                          >
                            {marca.Marc_Clase}
                          </button>
                        ) : (
                          <span className="text-stone-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-700 font-medium">
                          {marca.Marc_Titular || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge active={marca.Marc_Estatus}>
                          {marca.Marc_Estatus ? "ACTIVO" : "INACTIVO"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-700 font-medium">
                          {formatDate(marca.Marc_Renovacion)}
                        </span>
                      </td>
                      {hasPermission("Marcas.Archivos") && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onViewFiles(marca)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Ver</span>
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission("Marcas.GestionAcciones") && (
                            <button
                              onClick={() => onViewTasks(marca)}
                              className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                              title="Ver Acciones"
                            >
                              <ListTodo className="w-5 h-5" />
                            </button>
                          )}

                          {hasPermission("Marcas.Detalles") && (
                            <button
                              onClick={() => onViewDetails(marca)}
                              className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                              title="Ver Detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          )}
                          {hasPermission("Marcas.Modificar") && (
                            <button
                              onClick={() => onEdit(marca)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          )}
                          {marca.Marc_Estatus
                            ? hasPermission("Marcas.Eliminar") && (
                                <button
                                  onClick={() => onDelete(marca)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                  title="Desactivar"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )
                            : hasPermission("Marcas.Activar") && (
                                <button
                                  onClick={() => onActivate(marca)}
                                  className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                  title="Activar"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                              )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="text-sm text-stone-600 text-center">
            Mostrando {filteredMarcas.length} de {marcas.length} marcas
          </div>
        )}
      </div>

      {/* Modal de Zoom de Imagen*/}
      {zoomImage && (
        <ImageZoomModal image={zoomImage} onClose={closeZoomModal} />
      )}
      {/* Modal de Clase */}
      {selectedClase && (
        <MarcaClaseModal
          clave={selectedClase}
          token={token}
          onClose={() => setSelectedClase(null)}
        />
      )}
    </>
  );
}

export default MarcasTable;
