import { Edit2, Trash2, Check, FileText, Upload } from "lucide-react";
import Badge from "../Globales/Badge";

function MarcasTable({ marcas, onEdit, onDelete, onActivate, onViewFiles }) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
      <table className="w-full">
        <thead className="uppercase">
          <tr className="bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700">
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              Color
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              País Origen
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white  tracking-wider">
              Archivos
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold text-white tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 uppercase">
          {marcas.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-12 h-12 text-stone-300" />
                  <p className="text-stone-500 font-medium">
                    No hay marcas para mostrar
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            marcas.map((marca, index) => (
              <tr
                key={marca.id}
                className="hover:bg-stone-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shadow-md"
                      style={{ background: marca.color }}
                    />
                    <span className="text-xs font-mono text-stone-500">
                      {marca.color}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-stone-900 text-lg">
                    {marca.nombre}
                  </div>
                  {marca.descripcion && (
                    <div className="text-sm text-stone-600 mt-1">
                      {marca.descripcion}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                    {marca.categoria || "Sin categoría"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-stone-700 font-medium">
                    {marca.paisOrigen || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-stone-700 font-medium">
                    {marca.anioFundacion || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge active={marca.activo}>
                    {marca.activo ? "ACTIVO" : "INACTIVO"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewFiles(marca)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Ver archivos</span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(marca)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {marca.activo ? (
                      <button
                        onClick={() => onDelete(marca)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Desactivar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
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
  );
}

export default MarcasTable;
