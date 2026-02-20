import { Tag, Edit2, Trash2, Check } from "lucide-react";
import Badge from "../../Globales/Badge";

const TipoMarcaCard = ({
  tipo,
  onEdit,
  onDelete,
  onActivate,
  hasPermission,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-stone-300 transform hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            <Tag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-stone-400">
            #{tipo.tima_Id}
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-900">
          {tipo.tipoMar_Nombre}
        </h3>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
      <Badge active={tipo.tipoMar_Estatus}>
        {tipo.tipoMar_Estatus ? "Activo" : "Inactivo"}
      </Badge>

      <div className="flex gap-2">
        {hasPermission("TiposMarca.Editar") && (
          <button
            onClick={() => onEdit(tipo)}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("TiposMarca.Eliminar") && tipo.tipoMar_Estatus && (
          <button
            onClick={() => onDelete(tipo)}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
            title="Desactivar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("TiposMarca.Activar") && !tipo.tipoMar_Estatus && (
          <button
            onClick={() => onActivate(tipo)}
            className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-110"
            title="Activar"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default TipoMarcaCard;
