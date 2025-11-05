import { ChevronDown } from "lucide-react";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar...",
  label = "",
  required = false,
  disabled = false,
  error = "",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-stone-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 pr-10 rounded-xl border-2 outline-none transition-all appearance-none cursor-pointer font-medium ${
            disabled
              ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
              : error
              ? "border-red-300 focus:border-red-500 bg-red-50 focus:bg-white"
              : "border-stone-200 focus:border-stone-400 bg-stone-50 focus:bg-white"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-stone-500" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
