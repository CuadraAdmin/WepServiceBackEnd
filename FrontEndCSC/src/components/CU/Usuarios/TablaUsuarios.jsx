import { Edit2, Trash2, Shield, Check, Lock } from "lucide-react";
import Badge from "../../Globales/Badge";

const TablaUsuarios = ({
  usuarios,
  onEdit,
  onDelete,
  onActivate,
  onAsignarPerfiles,
  onChangePassword,
  hasPermission,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
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
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Correo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Teléfono
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {usuarios.map((usuario) => (
              <tr
                key={usuario.usua_Id}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-bold text-stone-900">
                  {usuario.usua_Nombre}
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">
                  {usuario.usua_Usuario}
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">
                  {usuario.usua_Correo}
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">
                  {usuario.usua_Telefono}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge active={usuario.usua_Estatus}>
                    {usuario.usua_Estatus ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {hasPermission("Usuarios.AsignarPerfiles") && (
                      <button
                        onClick={() => onAsignarPerfiles(usuario)}
                        className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
                        title="Asignar Perfiles"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("Usuarios.CambiarContrasena") && (
                      <button
                        onClick={() => onChangePassword(usuario)}
                        className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all hover:scale-110"
                        title="Cambiar Contraseña"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("Usuarios.Editar") && (
                      <button
                        onClick={() => onEdit(usuario)}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("Usuarios.Eliminar") &&
                      usuario.usua_Estatus && (
                        <button
                          onClick={() => onDelete(usuario)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
                          title="Desactivar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    {hasPermission("Usuarios.Activar") &&
                      !usuario.usua_Estatus && (
                        <button
                          onClick={() => onActivate(usuario)}
                          className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all hover:scale-110"
                          title="Activar"
                        >
                          <Check className="w-4 h-4" />
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
};

export default TablaUsuarios;
