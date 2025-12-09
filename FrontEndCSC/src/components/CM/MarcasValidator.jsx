import { useState } from "react";
import { AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";

function MarcasValidator({ data, onValidationComplete, onCancel }) {
  const [showDetails, setShowDetails] = useState(false);

  // Agregar esta función al inicio del componente, después de estaVacioCompleto
  const normalizarFecha = (valor) => {
    if (!valor) return null;

    const valorStr = String(valor).trim().toUpperCase();

    const valoresNA = [
      "N/A",
      "NA",
      "N.A.",
      "N.A",
      "-",
      "--",
      "SIN FECHA",
      "PENDIENTE",
      "NO APLICA",
      "NULL",
      "VACIO",
      "VACÍO",
    ];

    if (valoresNA.includes(valorStr)) {
      return null;
    }

    // Si es una fecha válida, retornarla
    return valor;
  };

  const estaVacioCompleto = (valor) => {
    if (!valor) return true;

    const valorStr = String(valor).trim();

    // Solo considera vacío si está completamente vacío (sin texto)
    return valorStr === "";
  };

  const esValorNA = (valor) => {
    if (!valor) return false;

    const valorStr = String(valor).trim().toUpperCase();
    const valoresNA = ["N/A", "NA", "N.A.", "N.A", "-", "--"];

    return valoresNA.includes(valorStr);
  };

  const tieneContenidoValido = (valor) => {
    if (estaVacioCompleto(valor)) return false;
    return true;
  };

  const validarFormatoFecha = (fecha) => {
    if (!fecha) return true;

    const fechaStr = String(fecha).trim().toUpperCase();

    const valoresNA = [
      "N/A",
      "NA",
      "N.A.",
      "N.A",
      "-",
      "--",
      "SIN FECHA",
      "PENDIENTE",
      "NO APLICA",
      "NULL",
      "VACIO",
      "VACÍO",
    ];

    if (valoresNA.includes(fechaStr)) {
      return true;
    }

    // Formato AAAA-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(fechaStr)) {
      const [anio, mes, dia] = fechaStr.split("-").map(Number);
      const fecha = new Date(anio, mes - 1, dia);
      return (
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes - 1 &&
        fecha.getDate() === dia
      );
    }

    if (!isNaN(fechaStr) && Number(fechaStr) > 0) {
      return true;
    }

    return false;
  };

  // Validar todos los registros
  const validarRegistros = () => {
    const errores = [];
    const validos = [];

    data.forEach((row, index) => {
      const erroresFila = [];
      const fila = index + 2; // Fila en Excel (índice 0 = fila 2)

      // Validar campos obligatorios BÁSICOS (NO aceptan N/A, deben tener texto real)
      if (estaVacioCompleto(row.Marc_Pais)) {
        erroresFila.push("País vacío");
      }

      if (estaVacioCompleto(row.Marc_Titular)) {
        erroresFila.push("Titular vacío");
      }

      // CAMPOS QUE ACEPTAN N/A (solo valida que NO estén completamente vacíos)
      if (!tieneContenidoValido(row.Marc_SolicitudNacional)) {
        erroresFila.push(
          "Solicitud Nacional vacía (puede usar N/A si no aplica)"
        );
      }

      if (!tieneContenidoValido(row.Marc_Clase)) {
        erroresFila.push("Clase vacía (puede usar N/A si no aplica)");
      }

      if (!tieneContenidoValido(row.Marc_Marca)) {
        erroresFila.push("Marca vacía (puede usar N/A si no aplica)");
      }

      if (!tieneContenidoValido(row.Marc_Registro)) {
        erroresFila.push("Registro vacío (puede usar N/A si no aplica)");
      }

      // Validar formato de Clase SOLO si NO es N/A y NO está vacío
      if (!estaVacioCompleto(row.Marc_Clase) && !esValorNA(row.Marc_Clase)) {
        const claseStr = String(row.Marc_Clase).trim();
        const formatoClaseValido = /^[\d\s,]+$/.test(claseStr);
        if (!formatoClaseValido) {
          erroresFila.push(
            "Clase contiene caracteres inválidos (solo números, comas y espacios permitidos)"
          );
        }
      }

      // Validar formato de fechas opcionales (solo si tienen valor)
      if (
        row.Marc_FechaSolicitud &&
        String(row.Marc_FechaSolicitud).trim() !== "" &&
        !validarFormatoFecha(row.Marc_FechaSolicitud)
      ) {
        erroresFila.push("Fecha Solicitud inválida");
      }

      if (
        row.Marc_FechaRegistro &&
        String(row.Marc_FechaRegistro).trim() !== "" &&
        !validarFormatoFecha(row.Marc_FechaRegistro)
      ) {
        erroresFila.push("Fecha Registro inválida");
      }

      if (
        row.Marc_Dure &&
        String(row.Marc_Dure).trim() !== "" &&
        !validarFormatoFecha(row.Marc_Dure)
      ) {
        erroresFila.push("DURE inválido");
      }

      if (
        row.Marc_Renovacion &&
        String(row.Marc_Renovacion).trim() !== "" &&
        !validarFormatoFecha(row.Marc_Renovacion)
      ) {
        erroresFila.push("Renovación inválida");
      }

      if (
        row.Marc_Oposicion &&
        String(row.Marc_Oposicion).trim() !== "" &&
        !validarFormatoFecha(row.Marc_Oposicion)
      ) {
        erroresFila.push("Oposición inválida");
      }

      if (
        row.Marc_FechaSeguimiento &&
        String(row.Marc_FechaSeguimiento).trim() !== "" &&
        !validarFormatoFecha(row.Marc_FechaSeguimiento)
      ) {
        erroresFila.push("Fecha Seguimiento inválida");
      }

      if (erroresFila.length > 0) {
        errores.push({
          fila,
          marca: row.Marc_Marca || row.Marc_Consecutivo || "Sin identificador",
          errores: erroresFila,
          datos: row,
        });
      } else {
        validos.push({
          fila,
          marca: row.Marc_Marca || row.Marc_Consecutivo || "Sin identificador",
          datos: row,
        });
      }
    });

    return { validos, errores };
  };

  const resultadoValidacion = validarRegistros();
  const { validos, errores } = resultadoValidacion;

  const handleContinuar = () => {
    if (validos.length === 0) {
      return;
    }

    const datosNormalizados = validos.map((v) => {
      const datos = { ...v.datos };

      datos.Marc_FechaSolicitud = normalizarFecha(datos.Marc_FechaSolicitud);
      datos.Marc_FechaRegistro = normalizarFecha(datos.Marc_FechaRegistro);
      datos.Marc_Dure = normalizarFecha(datos.Marc_Dure);
      datos.Marc_Renovacion = normalizarFecha(datos.Marc_Renovacion);
      datos.Marc_Oposicion = normalizarFecha(datos.Marc_Oposicion);
      datos.Marc_FechaSeguimiento = normalizarFecha(
        datos.Marc_FechaSeguimiento
      );

      return datos;
    });

    onValidationComplete(datosNormalizados);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div
          className="p-6 rounded-t-3xl"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <h2 className="text-2xl font-bold text-white">Validación de Datos</h2>
          <p className="text-white/90 text-sm">
            Revisión de {data.length} registro(s) antes de importar
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-3xl font-bold text-green-900">
                    {validos.length}
                  </p>
                  <p className="text-sm text-green-700">Registros válidos</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-3xl font-bold text-red-900">
                    {errores.length}
                  </p>
                  <p className="text-sm text-red-700">Registros con errores</p>
                </div>
              </div>
            </div>
          </div>

          {validos.length > 0 && errores.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    Se importarán <strong>{validos.length} registro(s)</strong>{" "}
                    y se omitirán <strong>{errores.length} registro(s)</strong>{" "}
                    con errores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errores.length === data.length && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-semibold">
                    Todos los registros tienen errores. Corrija el archivo Excel
                    antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errores.length > 0 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-3 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <span className="font-semibold text-stone-900">
                Ver detalles de errores ({errores.length})
              </span>
              <Eye className="w-5 h-5 text-stone-600" />
            </button>
          )}

          {showDetails && errores.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 max-h-96 overflow-y-auto">
              <h4 className="font-bold text-red-900 mb-3">
                Detalle de Errores
              </h4>
              <div className="space-y-3">
                {errores.map((error, i) => (
                  <div
                    key={i}
                    className="bg-white border border-red-300 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-red-900">
                          Fila {error.fila}:
                        </span>{" "}
                        <span className="text-stone-700">{error.marca}</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {error.errores.length} error(es)
                      </span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {error.errores.map((err, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validos.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-900 mb-3">
                Vista Previa - Registros Válidos (Primeros 5)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-green-300">
                      <th className="text-left p-2 font-semibold text-green-800">
                        Fila
                      </th>
                      <th className="text-left p-2 font-semibold text-green-800">
                        Consecutivo
                      </th>
                      <th className="text-left p-2 font-semibold text-green-800">
                        Marca
                      </th>
                      <th className="text-left p-2 font-semibold text-green-800">
                        Clase
                      </th>
                      <th className="text-left p-2 font-semibold text-green-800">
                        Titular
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validos.slice(0, 5).map((registro, i) => (
                      <tr key={i} className="border-b border-green-200">
                        <td className="p-2 text-green-700">{registro.fila}</td>
                        <td className="p-2">
                          {registro.datos.Marc_Consecutivo}
                        </td>
                        <td className="p-2 font-semibold">
                          {registro.datos.Marc_Marca}
                        </td>
                        <td className="p-2 text-blue-600">
                          {registro.datos.Marc_Clase}
                        </td>
                        <td className="p-2">{registro.datos.Marc_Titular}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validos.length > 5 && (
                  <p className="text-xs text-green-700 mt-2">
                    ... y {validos.length - 5} registro(s) más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleContinuar}
            disabled={validos.length === 0}
            className="flex-1 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background:
                validos.length > 0
                  ? "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)"
                  : "#9ca3af",
            }}
          >
            {validos.length > 0
              ? `Continuar e Importar ${validos.length} Registro(s)`
              : "No hay registros válidos"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarcasValidator;
