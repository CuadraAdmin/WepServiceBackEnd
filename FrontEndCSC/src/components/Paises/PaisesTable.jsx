import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

function PaisesTable({ paises, onEdit, onDelete, onActivate, hasPermission }) {
  if (paises.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-stone-500 text-lg">No hay países registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className="text-white"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Clave
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {paises.map((pais) => (
              <tr
                key={pais.Pais_Id}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-stone-900">
                    {pais.Pais_Clave}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-stone-700">{pais.Pais_Nombre}</span>
                </td>
                <td className="px-6 py-4">
                  {pais.Pais_Estatus ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Editar */}
                    {hasPermission("Paises.Editar") && (
                      <button
                        onClick={() => onEdit(pais)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all hover:scale-110"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}

                    {/* Botón Desactivar (solo si está activo) */}
                    {pais.Pais_Estatus && hasPermission("Paises.Eliminar") && (
                      <button
                        onClick={() => onDelete(pais)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-110"
                        title="Desactivar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Botón Activar (solo si está inactivo) */}
                    {!pais.Pais_Estatus && hasPermission("Paises.Activar") && (
                      <button
                        onClick={() => onActivate(pais)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all hover:scale-110"
                        title="Activar"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaisesTable;
