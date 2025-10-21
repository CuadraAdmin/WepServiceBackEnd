import { Search, Filter, LayoutGrid, List } from "lucide-react";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-stone-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o correo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all bg-stone-50 focus:bg-white appearance-none cursor-pointer font-medium"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="hidden md:flex gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-md text-stone-900"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Vista de tarjetas"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white shadow-md text-stone-900"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Vista de tabla"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
