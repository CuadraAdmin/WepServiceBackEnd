import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";

/**
 * Componente de seleccion múltiple
 * Ejemplo de uso:
 * const opciones = permisos.map(p => ({
 *   value: p.Perm_Id.toString(),
 *   label: p.Perm_Nombre
 * }));
 */

function MultiSelectConBusqueda({
  options = [],
  selected = [],
  onChange,
  placeholder = "Seleccionar...",
  label = "",
  searchPlaceholder = "Buscar...",
  color = "#6b5345",
  disabled = false,
  maxHeight = "16rem",
  showSearch = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus en el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  const toggleOption = (value) => {
    if (disabled) return;

    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value, e) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(selected.filter((item) => item !== value));
    }
  };

  const getSelectedLabels = () => {
    return options
      .filter((opt) => selected.includes(opt.value))
      .map((opt) => opt.label);
  };

  // Filtrar opciones por búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Botón principal */}
        <button
          type="button"
          onClick={handleToggleDropdown}
          disabled={disabled}
          className={`w-full bg-white border-2 border-stone-300 rounded-xl px-4 py-3 text-left flex items-center justify-between transition-colors ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-stone-50"
              : "hover:border-stone-400 focus:border-stone-500"
          } focus:outline-none`}
        >
          <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[24px]">
            {selected.length === 0 ? (
              <span className="text-stone-400">{placeholder}</span>
            ) : (
              getSelectedLabels().map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                  }}
                >
                  {label}
                  {!disabled && (
                    <span
                      onClick={(e) => removeOption(selected[index], e)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          removeOption(selected[index], e);
                        }
                      }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-stone-400 transition-transform flex-shrink-0 ml-2 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-300 rounded-xl shadow-2xl overflow-hidden"
            style={{ maxHeight }}
          >
            {/* Campo de búsqueda */}
            {showSearch && (
              <div className="sticky top-0 bg-white p-2 border-b border-stone-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-stone-400 focus:outline-none bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Lista de opciones */}
            <div className="overflow-y-auto" style={{ maxHeight: "12rem" }}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-sm text-stone-500 text-center">
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No hay opciones disponibles"}
                </div>
              ) : (
                <div className="py-1">
                  {filteredOptions.map((option) => {
                    const isSelected = selected.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleOption(option.value)}
                        className="w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-sm font-medium text-stone-700 flex-1">
                          {option.label}
                        </span>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiSelectConBusqueda;
