import {
  User,
  Edit2,
  Trash2,
  Shield,
  Check,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import Badge from "../../Globales/Badge";

const UsuarioCard = ({
  usuario,
  onEdit,
  onDelete,
  onActivate,
  onAsignarPerfiles,
  onChangePassword,
  hasPermission,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 hover:border-stone-300 transform hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-stone-400">
            #{usuario.usua_Id}
          </span>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {usuario.usua_Nombre}
        </h3>
        <p className="text-sm text-stone-600 mb-2 flex items-center gap-1">
          <User className="w-3 h-3" />
          {usuario.usua_Usuario}
        </p>
        <p className="text-sm text-stone-500 flex items-center gap-1 mb-1">
          <Mail className="w-3 h-3" />
          {usuario.usua_Correo}
        </p>
        <p className="text-sm text-stone-500 flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {usuario.usua_Telefono}
        </p>
        {usuario.perfiles && usuario.perfiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {usuario.perfiles.slice(0, 2).map((perfil) => (
              <span
                key={perfil.perf_Id}
                className="px-2 py-1 text-xs rounded-lg bg-purple-100 text-purple-700"
              >
                {perfil.perf_Nombre}
              </span>
            ))}
            {usuario.perfiles.length > 2 && (
              <span className="px-2 py-1 text-xs rounded-lg bg-stone-100 text-stone-700">
                +{usuario.perfiles.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
      <Badge active={usuario.usua_Estatus}>
        {usuario.usua_Estatus ? "Activo" : "Inactivo"}
      </Badge>

      <div className="flex gap-2">
        {hasPermission("Usuarios.AsignarPerfiles") && (
          <button
            onClick={() => onAsignarPerfiles(usuario)}
            className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
            title="Asignar Perfiles"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Usuarios.CambiarContrasena") && (
          <button
            onClick={() => onChangePassword(usuario)}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all hover:scale-110"
            title="Cambiar Contraseña"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Usuarios.Editar") && (
          <button
            onClick={() => onEdit(usuario)}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Usuarios.Eliminar") && usuario.usua_Estatus && (
          <button
            onClick={() => onDelete(usuario)}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all hover:scale-110"
            title="Desactivar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {hasPermission("Usuarios.Activar") && !usuario.usua_Estatus && (
          <button
            onClick={() => onActivate(usuario)}
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

export default UsuarioCard;
