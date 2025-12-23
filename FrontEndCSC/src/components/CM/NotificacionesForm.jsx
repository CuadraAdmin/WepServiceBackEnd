import {
  Mail,
  Plus,
  Trash2,
  Calendar,
  UserCheck,
  AlertCircle,
} from "lucide-react";

function NotificacionesForm({
  marcaId,
  formData,
  setFormData,
  token,
  userData,
  contactos,
  setContactos,
}) {
  const agregarNuevoContacto = () => {
    setContactos([
      ...contactos,
      {
        nombre: "",
        correo: "",
        telefonoWhatsApp: "", // Se mantiene en el estado pero no se muestra en la UI
      },
    ]);
  };

  const eliminarContacto = (index) => {
    const contacto = contactos[index];

    if (contacto.id) {
      if (
        !window.confirm(
          "¿Eliminar este contacto? Esta acción no se puede deshacer."
        )
      ) {
        return;
      }
    }

    setContactos(contactos.filter((_, i) => i !== index));
  };

  const actualizarContacto = (index, campo, valor) => {
    const nuevos = [...contactos];
    nuevos[index][campo] = valor;
    setContactos(nuevos);
  };

  return (
    <div className="space-y-3">
      {/* FECHAS DE LA MARCA */}
      <div className="bg-stone-50 border border-stone-300 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-stone-800 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-600" />
          Fechas para Notificaciones
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-stone-700 mb-1 block">
              Fecha de Aviso
              {/* <span className="text-red-600">*</span> */}
            </label>
            <input
              type="date"
              value={formData.Marc_FechaAviso || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Marc_FechaAviso: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 text-sm rounded-lg border border-stone-300 focus:border-stone-500 outline-none"
              // required
            />
            <p className="text-xs text-stone-600 mt-1">30, 15 y 1 día antes</p>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 mb-1 block">
              Fecha de Seguimiento
            </label>
            <input
              type="date"
              value={formData.Marc_FechaSeguimiento || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Marc_FechaSeguimiento: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 text-sm rounded-lg border border-stone-300 focus:border-stone-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* HEADER CONTACTOS */}
      <div className="flex items-center justify-between bg-stone-700 rounded-lg p-3">
        <div className="flex items-center gap-2 text-white">
          <UserCheck className="w-4 h-4" />
          <div>
            <h3 className="text-sm font-semibold">
              Contactos de Notificación{" "}
              <span className="text-xs">(Mínimo 1)</span>
            </h3>
            <p className="text-xs opacity-80">
              {contactos.length} contacto{contactos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={agregarNuevoContacto}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {/* Lista de contactos */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {contactos.length === 0 && (
          <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
            <UserCheck className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-stone-600 font-medium">
              No hay contactos agregados
            </p>
            <p className="text-xs text-red-600 mt-1">
              Debes agregar al menos 1 contacto
            </p>
          </div>
        )}

        {contactos.map((contacto, index) => (
          <div
            key={index}
            className="rounded-lg p-3 border bg-stone-50 border-stone-300"
          >
            {/* HEADER DEL CONTACTO */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700">
                Contacto #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => eliminarContacto(index)}
                className="p-1.5 rounded text-red-600 hover:bg-red-50"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CAMPOS DEL CONTACTO - SOLO NOMBRE Y CORREO */}
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={contacto.nombre}
                  onChange={(e) =>
                    actualizarContacto(index, "nombre", e.target.value)
                  }
                  className="w-full px-2 py-1.5 text-sm rounded border border-stone-300 focus:border-stone-500 outline-none"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  Correo <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={contacto.correo}
                  onChange={(e) =>
                    actualizarContacto(index, "correo", e.target.value)
                  }
                  className="w-full px-2 py-1.5 text-sm rounded border border-stone-300 focus:border-stone-500 outline-none"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
        <p className="font-medium mb-1">
          📧 Los contactos recibirán notificaciones por correo electrónico
        </p>
        <p className="text-blue-700">
          Se enviarán alertas 30, 15 y 1 día antes de la fecha de aviso
        </p>
      </div>
    </div>
  );
}

export default NotificacionesForm;
