import {
  Mail,
  Phone,
  Plus,
  Trash2,
  Calendar,
  Edit2,
  Loader2,
  UserCheck,
  Bell,
  X,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ApiConfig from "../Config/api.config";
import { toCamelCase, toPascalCase } from "../../utils/caseConverter";

function NotificacionesForm({
  marcaId,
  formData,
  setFormData,
  onSave,
  token,
  userData,
}) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [whatsappErrors, setWhatsappErrors] = useState({});

  const nombreUsuario = userData?.usuario?.usua_Usuario || "Sistema";

  useEffect(() => {
    if (marcaId > 0) {
      cargarNotificaciones();
    }
  }, [marcaId]);

  const cargarNotificaciones = async () => {
    setLoadingList(true);
    try {
      const response = await fetch(
        ApiConfig.getUrl(
          `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/listar/${marcaId}`
        ),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotificaciones(toPascalCase(data));
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setError("Error al cargar notificaciones");
    } finally {
      setLoadingList(false);
    }
  };

  // Validar formato de WhatsApp
  const validarWhatsApp = (numero) => {
    const numeroLimpio = numero.replace(/[\s-]/g, "");
    const regex = /^\+[1-9]\d{9,14}$/;

    if (!regex.test(numeroLimpio)) {
      return {
        valido: false,
        mensaje: "Formato inválido. Debe ser: +52XXXXXXXXXX (sin espacios)",
      };
    }

    if (numeroLimpio.startsWith("+52")) {
      // Validar longitud: debe ser 13 dígitos (+52 + 1 + 10 dígitos)
      if (numeroLimpio.length === 13) {
        return { valido: true, numeroCorregido: numeroLimpio };
      }

      // Si tiene 12 dígitos (+52 + 10), agregar el "1"
      if (numeroLimpio.length === 12) {
        return {
          valido: true,
          numeroCorregido:
            numeroLimpio.slice(0, 3) + "1" + numeroLimpio.slice(3),
          mensaje: "Se agregará '1' después del +52",
        };
      }

      // Si tiene más o menos dígitos, es inválido
      return {
        valido: false,
        mensaje: `Número inválido. Tiene ${
          numeroLimpio.length - 3
        } dígitos después de +52, debe tener 10 (formato: +5214771234567)`,
      };
    }

    return { valido: true, numeroCorregido: numeroLimpio };
  };

  const formatearWhatsApp = (numero) => {
    const resultado = validarWhatsApp(numero);
    return resultado.numeroCorregido || numero;
  };

  const agregarNuevoContacto = () => {
    setNotificaciones([
      ...notificaciones,
      {
        MarcNoti_Id: 0,
        Marc_Id: marcaId,
        MarcNoti_Nombre: "",
        MarcNoti_Correo: "",
        MarcNoti_TelefonoWhatsApp: "",
        MarcNoti_Estatus: true,
        MarcNoti_CreadoPor: nombreUsuario,
      },
    ]);
    setEditingIndex(notificaciones.length);
  };

  const eliminarContacto = async (index) => {
    const notif = notificaciones[index];

    if (notif.MarcNoti_Id > 0) {
      if (!window.confirm("¿Eliminar este contacto de notificación?")) return;

      setLoading(true);
      try {
        const response = await fetch(
          ApiConfig.getUrl(
            `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/eliminar/${notif.MarcNoti_Id}?modificadoPor=${nombreUsuario}`
          ),
          {
            method: "DELETE",
            headers: ApiConfig.getHeaders(token),
          }
        );

        if (response.ok) {
          await cargarNotificaciones();
          setError("");
        } else {
          const errorData = await response.json();
          setError(errorData.mensaje || "Error al eliminar");
        }
      } catch (error) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    } else {
      setNotificaciones(notificaciones.filter((_, i) => i !== index));
      setEditingIndex(null);
    }
  };

  const actualizarContacto = (index, campo, valor) => {
    const nuevas = [...notificaciones];

    if (campo === "MarcNoti_TelefonoWhatsApp") {
      const valorLimpio = valor.replace(/[\s-]/g, "");
      nuevas[index][campo] = valorLimpio;

      const validacion = validarWhatsApp(valorLimpio);
      setWhatsappErrors({
        ...whatsappErrors,
        [index]: validacion.valido ? null : validacion.mensaje,
      });
    } else {
      nuevas[index][campo] = valor;
    }

    setNotificaciones(nuevas);
  };

  const guardarContacto = async (index) => {
    const notif = notificaciones[index];

    if (
      !notif.MarcNoti_Nombre ||
      !notif.MarcNoti_Correo ||
      !notif.MarcNoti_TelefonoWhatsApp
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const validacion = validarWhatsApp(notif.MarcNoti_TelefonoWhatsApp);
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    const telefonoFinal =
      validacion.numeroCorregido || notif.MarcNoti_TelefonoWhatsApp;

    setLoading(true);
    setError("");

    try {
      const dataToSend = toCamelCase({
        ...notif,
        MarcNoti_TelefonoWhatsApp: telefonoFinal,
      });

      if (notif.MarcNoti_Id === 0) {
        const response = await fetch(
          ApiConfig.getUrl(`${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/crear`),
          {
            method: "POST",
            headers: ApiConfig.getHeaders(token),
            body: JSON.stringify({
              ...dataToSend,
              marcNoti_CreadoPor: nombreUsuario,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al crear contacto");
        }
      } else {
        const response = await fetch(
          ApiConfig.getUrl(
            `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/actualizar/${notif.MarcNoti_Id}`
          ),
          {
            method: "PUT",
            headers: ApiConfig.getHeaders(token),
            body: JSON.stringify({
              ...dataToSend,
              marcNoti_ModificadoPor: nombreUsuario,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al actualizar contacto");
        }
      }

      await cargarNotificaciones();
      setEditingIndex(null);
      setError("");
      setWhatsappErrors({});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
              Fecha de Aviso <span className="text-stone-800">*</span>
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
              required
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
            <h3 className="text-sm font-semibold">Contactos de Notificación</h3>
            <p className="text-xs opacity-80">
              {notificaciones.length} contacto
              {notificaciones.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={agregarNuevoContacto}
          disabled={marcaId === 0 || editingIndex !== null}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          title={marcaId === 0 ? "Guarda la marca primero" : ""}
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {/* Errores */}
      {error && (
        <div className="bg-stone-100 border border-stone-400 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-stone-700 flex-shrink-0" />
          <p className="text-xs text-stone-800 font-medium flex-1">{error}</p>
          <button
            onClick={() => setError("")}
            className="text-stone-700 hover:text-stone-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Loading lista */}
      {loadingList && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        </div>
      )}

      {/* Lista de contactos */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notificaciones.length === 0 && !loadingList && (
          <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
            <UserCheck className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-stone-600">
              No hay contactos registrados
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Agrega contactos para recibir notificaciones
            </p>
          </div>
        )}

        {notificaciones.map((notif, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 border ${
              editingIndex === index
                ? "bg-stone-50 border-stone-400"
                : "bg-white border-stone-200"
            }`}
          >
            {/* HEADER DEL CONTACTO */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">
                  Contacto #{index + 1}
                </span>
                {notif.MarcNoti_Id > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-700 rounded">
                    Guardado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {editingIndex === index ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setWhatsappErrors({});
                      }}
                      disabled={loading}
                      className="p-1.5 rounded text-stone-600 hover:bg-stone-100"
                      title="Cancelar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => guardarContacto(index)}
                      disabled={loading}
                      className="px-2.5 py-1 text-xs bg-stone-700 text-white rounded hover:bg-stone-800 font-medium disabled:opacity-50 flex items-center gap-1"
                    >
                      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(index)}
                      className="p-1.5 rounded text-stone-600 hover:bg-stone-100"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarContacto(index)}
                      className="p-1.5 rounded text-stone-600 hover:bg-stone-100"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* CONTENIDO DEL CONTACTO */}
            {editingIndex === index ? (
              <div className="space-y-2">
                <div className="grid md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1 block">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={notif.MarcNoti_Nombre}
                      onChange={(e) =>
                        actualizarContacto(
                          index,
                          "MarcNoti_Nombre",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1.5 text-sm rounded border border-stone-300 focus:border-stone-500 outline-none"
                      placeholder="Nombre"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1 block">
                      Correo *
                    </label>
                    <input
                      type="email"
                      value={notif.MarcNoti_Correo}
                      onChange={(e) =>
                        actualizarContacto(
                          index,
                          "MarcNoti_Correo",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1.5 text-sm rounded border border-stone-300 focus:border-stone-500 outline-none"
                      placeholder="correo"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1 block">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={notif.MarcNoti_TelefonoWhatsApp}
                      onChange={(e) =>
                        actualizarContacto(
                          index,
                          "MarcNoti_TelefonoWhatsApp",
                          e.target.value
                        )
                      }
                      className={`w-full px-2 py-1.5 text-sm rounded border outline-none ${
                        whatsappErrors[index]
                          ? "border-stone-600"
                          : "border-stone-300 focus:border-stone-500"
                      }`}
                      placeholder="+5214771234567"
                    />
                  </div>
                </div>

                {/* Ayuda para formato de WhatsApp */}
                <div className="bg-stone-100 border border-stone-300 rounded p-2 text-xs text-stone-700">
                  <p className="font-medium mb-1">Formato: +521 + 10 dígitos</p>
                  <p className="text-stone-600">
                    Ejemplo: +5214771234567 (sin espacios)
                  </p>
                </div>

                {/* Error específico de WhatsApp */}
                {whatsappErrors[index] && (
                  <div className="bg-stone-100 border border-stone-400 rounded p-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-stone-700" />
                    <p className="text-xs text-stone-800">
                      {whatsappErrors[index]}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-stone-500 mb-0.5">Nombre</p>
                  <p className="font-medium text-stone-900">
                    {notif.MarcNoti_Nombre || "Sin nombre"}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500 mb-0.5">Correo</p>
                  <p className="font-medium text-stone-900 truncate">
                    {notif.MarcNoti_Correo || "Sin correo"}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500 mb-0.5">WhatsApp</p>
                  <p className="font-medium text-stone-900">
                    {notif.MarcNoti_TelefonoWhatsApp || "Sin teléfono"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificacionesForm;
