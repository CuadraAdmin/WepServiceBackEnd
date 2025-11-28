import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

function EmpresasTable({
  empresas,
  onEdit,
  onDelete,
  onActivate,
  hasPermission,
}) {
  if (empresas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-stone-500 text-lg">No hay empresas registradas</p>
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
            {empresas.map((empresa) => (
              <tr
                key={empresa.Empr_Id}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-stone-900">
                    {empresa.Empr_Clave}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-stone-700">{empresa.Empr_Nombre}</span>
                </td>
                <td className="px-6 py-4">
                  {empresa.Empr_Estatus ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {hasPermission("Empresas.Editar") && (
                      <button
                        onClick={() => onEdit(empresa)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all hover:scale-110"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("Empresas.Eliminar") &&
                      (empresa.Empr_Estatus ? (
                        <button
                          onClick={() => onDelete(empresa)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-110"
                          title="Desactivar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(empresa)}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all hover:scale-110"
                          title="Activar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ))}
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

export default EmpresasTable;
