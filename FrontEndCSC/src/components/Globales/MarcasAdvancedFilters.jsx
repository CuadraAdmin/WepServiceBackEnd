import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import MultiSelectConBusqueda from "../Globales/MultiSelectConBusqueda";

export function FilterButton({
  showFilters,
  setShowFilters,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm whitespace-nowrap ${
          hasActiveFilters
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            : "bg-white text-stone-700 border-2 border-stone-200 hover:bg-stone-50"
        }`}
      >
        <Filter className="w-5 h-5" />
        <span className="hidden md:inline">Filtros </span>
        <span className="md:hidden">Filtros</span>
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
            ●
          </span>
        )}
      </button>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center justify-center gap-2 px-3 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
          <span className="hidden md:inline">Limpiar</span>
        </button>
      )}
    </div>
  );
}

function MarcasAdvancedFilters({
  marcas,
  onApplyFilters,
  onClearFilters,
  showFilters,
  setShowFilters,
}) {
  const [filters, setFilters] = useState({
    empresas: [],
    marcas: [],
    registros: [],
    fechaAno: "",
    fechaMes: "",
    fechaDia: "",
    fechaRangoDesde: "",
    fechaRangoHasta: "",
    estadoRenovacion: [],
  });

  const empresasOptions = [
    ...new Set(marcas.map((m) => m.Empr_Nombre).filter(Boolean)),
  ]
    .sort()
    .map((emp) => ({ value: emp, label: emp }));

  const marcasOptions = [
    ...new Set(marcas.map((m) => m.Marc_Marca).filter(Boolean)),
  ]
    .sort()
    .map((marca) => ({ value: marca, label: marca }));

  const registrosOptions = [
    ...new Set(marcas.map((m) => m.Marc_Registro).filter(Boolean)),
  ]
    .sort()
    .map((reg) => ({ value: reg, label: reg }));

  const estatusOptions = [
    { value: "Vencida", label: "Vencida" },
    { value: "Urgente", label: "Urgente" },
    { value: "Próximo", label: "Próximo" },
    { value: "Atención", label: "Atención" },
    { value: "Normal", label: "Normal" },
    { value: "Sin fecha", label: "Sin fecha" },
  ];

  const monthsOptions = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // Días
  const daysOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      empresas: [],
      marcas: [],
      registros: [],
      fechaAno: "",
      fechaMes: "",
      fechaDia: "",
      fechaRangoDesde: "",
      fechaRangoHasta: "",
      estadoRenovacion: [],
    });
    onClearFilters();
  };

  const hasActiveFilters =
    filters.empresas.length > 0 ||
    filters.marcas.length > 0 ||
    filters.registros.length > 0 ||
    filters.fechaAno !== "" ||
    filters.fechaMes !== "" ||
    filters.fechaDia !== "" ||
    filters.fechaRangoDesde !== "" ||
    filters.fechaRangoHasta !== "" ||
    filters.estadoRenovacion.length > 0;

  // Solo hacer aparecer los filtros si showFilters es true
  if (!showFilters) return null;

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-xl border-2 border-stone-200 p-6">
      <div className="space-y-4">
        {/* Fila 1: Multiselects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Empresas */}
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Entidad
            </label>
            <MultiSelectConBusqueda
              options={empresasOptions}
              selected={filters.empresas}
              onChange={(values) =>
                setFilters({ ...filters, empresas: values })
              }
              placeholder="Seleccionar..."
              searchPlaceholder="Buscar empresa..."
              color="#6b5345"
              showSearch={false}
            />
          </div>

          {/* Filtro de Marcas */}
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Marca
            </label>
            <MultiSelectConBusqueda
              options={marcasOptions}
              selected={filters.marcas}
              onChange={(values) => setFilters({ ...filters, marcas: values })}
              placeholder="Seleccionar..."
              searchPlaceholder="Buscar marca..."
              color="#6b5345"
              showSearch={false}
            />
          </div>

          {/* Filtro de Registros */}
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Registro
            </label>
            <MultiSelectConBusqueda
              options={registrosOptions}
              selected={filters.registros}
              onChange={(values) =>
                setFilters({ ...filters, registros: values })
              }
              placeholder="Seleccionar..."
              searchPlaceholder="Buscar registro..."
              color="#6b5345"
              showSearch={true}
            />
          </div>
        </div>

        {/* Fila 2: Fecha Específica + Estatus */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Año
            </label>
            <input
              type="number"
              value={filters.fechaAno}
              onChange={(e) =>
                setFilters({ ...filters, fechaAno: e.target.value })
              }
              placeholder="Año"
              min="1900"
              max="9099"
              className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-stone-200 focus:border-stone-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Mes
            </label>
            <select
              value={filters.fechaMes}
              onChange={(e) =>
                setFilters({ ...filters, fechaMes: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-stone-200 focus:border-stone-400 outline-none transition-all"
            >
              <option value="">Todos</option>
              {monthsOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Día
            </label>
            <select
              value={filters.fechaDia}
              onChange={(e) =>
                setFilters({ ...filters, fechaDia: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-stone-200 focus:border-stone-400 outline-none transition-all"
            >
              <option value="">Todos</option>
              {daysOptions.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Estado Renovación
            </label>
            <MultiSelectConBusqueda
              options={estatusOptions}
              selected={filters.estadoRenovacion}
              onChange={(values) =>
                setFilters({ ...filters, estadoRenovacion: values })
              }
              placeholder="Seleccionar..."
              color="#6b5345"
              showSearch={false}
            />
          </div>
        </div>

        {/* Fila 3: Rango de Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.fechaRangoDesde}
              onChange={(e) =>
                setFilters({ ...filters, fechaRangoDesde: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-stone-200 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.fechaRangoHasta}
              onChange={(e) =>
                setFilters({ ...filters, fechaRangoHasta: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-stone-200 focus:border-blue-400 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 mt-4 pt-4 border-t-2 border-stone-200">
        <button
          onClick={handleClearFilters}
          className="flex-1 px-4 py-2.5 rounded-lg border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-all text-sm"
        >
          Limpiar
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2.5 text-white rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default MarcasAdvancedFilters;
