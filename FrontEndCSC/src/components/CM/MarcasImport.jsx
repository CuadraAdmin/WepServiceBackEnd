import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import ApiService from "../../Services/ApiService";
import ApiConfig from "../Config/api.config";
import MarcasValidator from "./MarcasValidator";

function MarcasImport({
  onClose,
  onSuccess,
  token,
  userData,
  empresasOptions,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState({ success: 0, errors: [] });
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [mostrarValidador, setMostrarValidador] = useState(false);
  const [datosCompletos, setDatosCompletos] = useState([]);
  const [workbook, setWorkbook] = useState(null);
  const [hojasDisponibles, setHojasDisponibles] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState("");
  const [mostrarResultadoFinal, setMostrarResultadoFinal] = useState(false);
  const fileInputRef = useRef(null);

  const nombreUsuario = userData?.usuario?.usua_Usuario || "Sistema";

  const columnMapping = {
    Consecutivo: "Marc_Consecutivo",
    País: "Marc_Pais",
    "Solicitud Nacional": "Marc_SolicitudNacional",
    Registro: "Marc_Registro",
    Marca: "Marc_Marca",
    Clase: "Marc_Clase",
    Titular: "Marc_Titular",
    Figura: "Marc_Figura",
    Título: "Marc_Titulo",
    Tipo: "Marc_Tipo",
    Rama: "Marc_Rama",
    Autor: "Marc_Autor",
    Observaciones: "Marc_Observaciones",
    "Fecha Solicitud": "Marc_FechaSolicitud",
    "Fecha Registro": "Marc_FechaRegistro",
    DURE: "Marc_Dure",
    Renovación: "Marc_Renovacion",
    Oposición: "Marc_Oposicion",
    "Fecha Seguimiento": "Marc_FechaSeguimiento",
    "Nombre Contacto": "Contacto_Nombre",
    "Correo Contacto": "Contacto_Correo",
  };

  const estaVacio = (valor) => {
    if (!valor) return true;

    const valorStr = String(valor).trim().toUpperCase();

    const valoresVacios = [
      "",
      "N/A",
      "NA",
      "N.A.",
      "N.A",
      "-",
      "--",
      "SIN DATO",
      "NINGUNO",
      "NULL",
      "VACIO",
      "VACÍO",
    ];

    return valoresVacios.includes(valorStr);
  };

  const sanitizarFecha = (valor) => {
    if (!valor) return null;

    const valorStr = String(valor).trim().toUpperCase();

    const valoresInvalidos = [
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
      "",
    ];

    if (valoresInvalidos.includes(valorStr)) {
      return null;
    }

    if (!isNaN(valor) && valor > 0) {
      return valor;
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fechaRegex.test(valorStr)) {
      return valorStr;
    }

    const formatoDDMMAAAA = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
    const matchDDMMAAAA = valorStr.match(formatoDDMMAAAA);
    if (matchDDMMAAAA) {
      const [, dia, mes, anio] = matchDDMMAAAA;
      return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }

    const formatoMMDDAAAA = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
    const matchMMDDAAAA = valorStr.match(formatoMMDDAAAA);
    if (matchMMDDAAAA) {
      const [, mes, dia, anio] = matchMMDDAAAA;
      if (parseInt(mes) <= 12) {
        return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
      }
    }

    return null;
  };

  const sanitizarClase = (valor) => {
    if (!valor) return null;

    const valorStr = String(valor).trim();

    if (valorStr.includes(",")) {
      return valorStr;
    }

    if (valorStr.includes("\n") || valorStr.includes("\r")) {
      const clases = valorStr
        .split(/[\n\r]+/)
        .map((c) => c.trim())
        .filter((c) => c !== "" && !isNaN(c));

      return clases.join(", ");
    }

    const espaciosMultiples = valorStr.match(/^\d+(\s+\d+)+$/);
    if (espaciosMultiples) {
      const clases = valorStr
        .split(/\s+/)
        .map((c) => c.trim())
        .filter((c) => c !== "");

      return clases.join(", ");
    }

    return valorStr;
  };

  const sanitizarTexto = (valor) => {
    if (estaVacio(valor)) {
      return null;
    }
    return String(valor).trim();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError("Solo se permiten archivos Excel (.xlsx, .xls)");
      return;
    }

    setFile(selectedFile);
    setError("");
    setPreview([]);
    setResults({ success: 0, errors: [] });
    setHojaSeleccionada("");
    setDatosCompletos([]);
    setMostrarResultadoFinal(false);

    try {
      const data = await selectedFile.arrayBuffer();
      const wb = XLSX.read(data, {
        type: "array",
        cellDates: true,
        cellStyles: true,
      });

      setWorkbook(wb);
      setHojasDisponibles(wb.SheetNames);

      if (wb.SheetNames.length > 0) {
        const primeraHoja = wb.SheetNames[0];
        setHojaSeleccionada(primeraHoja);
        await procesarHoja(wb, primeraHoja);
      }
    } catch (err) {
      setError("Error al leer el archivo: " + err.message);
    }
  };

  const handleHojaChange = async (nombreHoja) => {
    setHojaSeleccionada(nombreHoja);
    setError("");
    setPreview([]);
    setResults({ success: 0, errors: [] });
    setMostrarResultadoFinal(false);

    if (workbook && nombreHoja) {
      await procesarHoja(workbook, nombreHoja);
    }
  };

  const procesarHoja = async (wb, nombreHoja) => {
    try {
      const worksheet = wb.Sheets[nombreHoja];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: null,
      });

      const processedData = jsonData.map((row) => {
        const mappedRow = {};

        Object.keys(columnMapping).forEach((excelColumn) => {
          const systemField = columnMapping[excelColumn];
          let valor = row[excelColumn] || null;

          if (
            [
              "Marc_FechaSolicitud",
              "Marc_FechaRegistro",
              "Marc_Dure",
              "Marc_Renovacion",
              "Marc_Oposicion",
              "Marc_FechaSeguimiento",
              "Marc_FechaAviso",
            ].includes(systemField)
          ) {
            valor = sanitizarFecha(valor);
          } else if (systemField === "Marc_Clase") {
            valor = sanitizarClase(valor);
          }

          // --- BLOQUE A: Campos OBLIGATORIOS que aceptan N/A o guiones (-) ---
          // Para estos campos, NO usamos sanitizarTexto() que convierte 'N/A' a null.
          // Solo convertimos a null si están REALMENTE vacíos.
          const camposQueAceptanNA = [
            "Marc_Marca",
            "Marc_Registro",
            "Marc_SolicitudNacional",
          ];

          if (camposQueAceptanNA.includes(systemField)) {
            if (valor === null || String(valor).trim() === "") {
              valor = null;
            } else {
              valor = String(valor).trim();
            }
          }
          // --- FIN BLOQUE A ---

          // --- BLOQUE B: Otros campos que NO deben aceptar N/A (debe ser null si está vacío o tiene N/A) ---
          else if (
            [
              "Marc_Consecutivo",
              "Marc_Pais",
              "Marc_Titular",
              "Marc_Figura",
              "Marc_Titulo",
              "Marc_Tipo",
              "Marc_Rama",
              "Marc_Autor",
              "Marc_Observaciones",
              "Contacto_Nombre",
              "Contacto_Correo",
            ].includes(systemField)
          ) {
            // Estos campos usan sanitizarTexto para convertir 'N/A' o '-' a null
            // (que es el comportamiento deseado para la mayoría de los campos opcionales o los obligatorios que no aceptan N/A).
            valor = sanitizarTexto(valor);
          }

          mappedRow[systemField] = valor;
        });

        return mappedRow;
      });

      setDatosCompletos(processedData);
      setPreview(processedData.slice(0, 5));
    } catch (err) {
      setError("Error al procesar la hoja: " + err.message);
    }
  };

  const convertirFechaExcel = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      if (!isNaN(fechaStr)) {
        const excelEpoch = new Date(1900, 0, 1);
        const days = parseInt(fechaStr) - 2;
        const date = new Date(
          excelEpoch.getTime() + days * 24 * 60 * 60 * 1000
        );
        return date.toISOString().split("T")[0];
      }
      const date = new Date(fechaStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
      return null;
    } catch {
      return null;
    }
  };

  const crearContactoNotificacion = async (marcaId, contacto) => {
    try {
      const contactoData = {
        marc_Id: marcaId,
        marcNoti_Nombre: contacto.nombre,
        marcNoti_Correo: contacto.correo,
        marcNoti_TelefonoWhatsApp: "",
        marcNoti_Estatus: true,
        marcNoti_CreadoPor: nombreUsuario,
      };

      const response = await ApiService.post(
        `${ApiConfig.ENDPOINTSMARCA.NOTIFICACIONES}/crear`,
        contactoData,
        token
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || "Error al crear contacto de notificación"
        );
      }

      const resultado = await response.json();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleImport = async (datosValidados = null) => {
    if (!empresaSeleccionada) {
      setError("Debe seleccionar una empresa antes de importar");
      return;
    }

    const datosAImportar = datosValidados || datosCompletos;

    if (datosAImportar.length === 0) {
      setError("No hay datos para importar");
      return;
    }

    setLoading(true);
    setError("");
    setResults({ success: 0, errors: [] });
    setMostrarValidador(false);

    const limpiarMensajeError = (mensaje) => {
      if (!mensaje) return "Error desconocido";

      // Si el mensaje contiene "SQLError:", extraer solo el mensaje principal
      if (mensaje.includes("SQLError:")) {
        const lineas = mensaje.split("\n");
        const lineaPrincipal = lineas[0].replace("SQLError: ", "").trim();
        return lineaPrincipal;
      }

      // Si contiene "#SP:", "#LI:", etc., tomar solo la primera línea
      if (mensaje.includes("#SP:") || mensaje.includes("#LI:")) {
        return mensaje.split("\n")[0].replace("SQLError: ", "").trim();
      }

      return mensaje;
    };

    try {
      setProgress({ current: 0, total: datosAImportar.length });

      const errors = [];
      let successCount = 0;

      for (let i = 0; i < datosAImportar.length; i++) {
        const mappedRow = datosAImportar[i];
        const filaExcelActual = i + 2;

        try {
          const fechaRenovacion = convertirFechaExcel(
            mappedRow.Marc_Renovacion
          );
          const fechaAviso = fechaRenovacion;

          // 1. CREAR LA MARCA
          const marca = {
            Empr_Id: parseInt(empresaSeleccionada),
            Marc_Consecutivo: mappedRow.Marc_Consecutivo,
            Marc_Pais: mappedRow.Marc_Pais,
            Marc_SolicitudNacional: mappedRow.Marc_SolicitudNacional || null,
            Marc_Registro: mappedRow.Marc_Registro || null,
            Marc_Marca: mappedRow.Marc_Marca || null,
            Marc_Clase: mappedRow.Marc_Clase || null,
            Marc_Titular: mappedRow.Marc_Titular,
            Marc_Renovacion: fechaRenovacion,
            Marc_FechaAviso: fechaAviso,
            Marc_Diseno: null,
            Marc_Figura: mappedRow.Marc_Figura || null,
            Marc_Titulo: mappedRow.Marc_Titulo || null,
            Marc_Tipo: mappedRow.Marc_Tipo || null,
            Marc_Rama: mappedRow.Marc_Rama || null,
            Marc_Autor: mappedRow.Marc_Autor || null,
            Marc_Observaciones: mappedRow.Marc_Observaciones || null,
            Marc_FechaSolicitud: convertirFechaExcel(
              mappedRow.Marc_FechaSolicitud
            ),
            Marc_FechaRegistro: convertirFechaExcel(
              mappedRow.Marc_FechaRegistro
            ),
            Marc_Dure: convertirFechaExcel(mappedRow.Marc_Dure),
            Marc_Oposicion: convertirFechaExcel(mappedRow.Marc_Oposicion),
            Marc_FechaSeguimiento: convertirFechaExcel(
              mappedRow.Marc_FechaSeguimiento
            ),
            Marc_Estatus: true,
            Marc_CreadoPor: nombreUsuario,
          };

          const response = await ApiService.post(
            `${ApiConfig.ENDPOINTSMARCA.MARCAS}/crear`,
            marca,
            token
          );

          if (response.ok) {
            const marcaCreada = await response.json();
            const marcaId =
              marcaCreada.id || marcaCreada.marcaId || marcaCreada.Marc_Id;

            // 2. CREAR EL CONTACTO SI EXISTE
            if (mappedRow.Contacto_Nombre && mappedRow.Contacto_Correo) {
              try {
                await crearContactoNotificacion(marcaId, {
                  nombre: mappedRow.Contacto_Nombre,
                  correo: mappedRow.Contacto_Correo,
                });
              } catch (contactoError) {
                const mensajeLimpio = limpiarMensajeError(
                  contactoError.message || "Error al crear contacto"
                );
              }
            } else {
            }

            successCount++;
          } else {
            const errorData = await response.json();

            const mensajeError = limpiarMensajeError(
              errorData.mensaje ||
                errorData.message ||
                "Error desconocido al crear marca"
            );

            errors.push({
              fila: filaExcelActual,
              marca:
                marca.Marc_Marca ||
                marca.Marc_Consecutivo ||
                "Sin identificador",
              error: mensajeError,
              detalles: errorData,
            });
          }
        } catch (error) {
          const mensajeError = limpiarMensajeError(
            error.message || "Error al procesar registro"
          );

          errors.push({
            fila: filaExcelActual,
            marca:
              mappedRow.Marc_Marca ||
              mappedRow.Marc_Consecutivo ||
              "Desconocida",
            error: mensajeError,
            detalles: error,
          });
        }

        setProgress({ current: i + 1, total: datosAImportar.length });
      }

      setResults({ success: successCount, errors });
      setMostrarResultadoFinal(true);

      if (successCount > 0) {
        onSuccess?.();
      }
    } catch (error) {
      const mensajeError = limpiarMensajeError(
        error.message || "Error general en la importación"
      );
      setError("Error general en la importación: " + mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const descargarReporteErrores = () => {
    if (results.errors.length === 0) return;

    const datosReporte = results.errors.map((err) => ({
      Fila: err.fila,
      Marca: err.marca,
      Error: err.error,
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosReporte);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");
    XLSX.writeFile(
      workbook,
      `errores_importacion_${new Date().getTime()}.xlsx`
    );
  };

  const descargarPlantilla = () => {
    const plantilla = [
      {
        Consecutivo: "",
        País: "",
        "Solicitud Nacional": "",
        Registro: "",
        Marca: "",
        Clase: "",
        Titular: "",
        Figura: "",
        Título: "",
        Tipo: "",
        Rama: "",
        Autor: "",
        Observaciones: "",
        "Fecha Solicitud": "",
        "Fecha Registro": "",
        DURE: "",
        Renovación: "",
        Oposición: "",
        "Fecha Seguimiento": "",
        "Nombre Contacto": "",
        "Correo Contacto": "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(plantilla);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");
    XLSX.writeFile(workbook, "plantilla_marcas.xlsx");
  };

  const cerrarYLimpiar = () => {
    setFile(null);
    setPreview([]);
    setDatosCompletos([]);
    setResults({ success: 0, errors: [] });
    setMostrarResultadoFinal(false);
    setMostrarValidador(false);
    setError("");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
          <div
            className="p-6 rounded-t-3xl flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Importar Marcas
                </h2>
                <p className="text-white/90 text-sm">Desde archivo Excel</p>
              </div>
            </div>
            <button
              onClick={cerrarYLimpiar}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!mostrarResultadoFinal && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Empresa *
                  </label>
                  <select
                    value={empresaSeleccionada}
                    onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-stone-500 focus:outline-none"
                    disabled={loading}
                  >
                    <option value="">Seleccione una empresa</option>
                    {empresasOptions.map((empresa) => (
                      <option key={empresa.value} value={empresa.value}>
                        {empresa.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-2">
                        Instrucciones
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Selecciona la empresa</li>
                        <li>Descarga la plantilla vacía</li>
                        <li>
                          Sube tu archivo Excel y selecciona la hoja a importar
                        </li>
                        <li>
                          <strong>
                            OBLIGATORIOS (no pueden estar vacíos):
                          </strong>{" "}
                          Consecutivo, País, Solicitud Nacional, Marca, Clase,
                          Registro, Titular
                        </li>
                        <li>
                          <strong>Nota:</strong> Solicitud Nacional, Marca,
                          Clase y Registro pueden tener "N/A" si no aplican,
                          pero NO pueden estar vacíos
                        </li>
                        <li>
                          <strong>OPCIONALES:</strong> Renovación, Figura,
                          Título, Tipo, Rama, Autor, Observaciones, todas las
                          fechas
                        </li>
                        <li>
                          <strong>CONTACTO (opcional):</strong> Si incluyes
                          Nombre Contacto y Correo Contacto, se creará
                          automáticamente (el teléfono se puede agregar después
                          editando la marca)
                        </li>
                        <li>Fechas en formato: AAAA-MM-DD</li>
                        <li>
                          Clases: Use comas (25, 35) o saltos de línea. Si no
                          aplica use "N/A"
                        </li>
                      </ul>
                      <button
                        onClick={descargarPlantilla}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Descargar Plantilla Vacía
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block w-full border-2 border-dashed border-stone-300 rounded-2xl p-8 hover:border-stone-400 transition-colors cursor-pointer bg-stone-50 hover:bg-stone-100">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-12 h-12 text-stone-700" />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-stone-900">
                          {file
                            ? file.name
                            : "Click para seleccionar archivo Excel"}
                        </p>
                        <p className="text-sm text-stone-600 mt-1">
                          Formatos: .xlsx, .xls
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {hojasDisponibles.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Hoja del Excel *
                    </label>
                    <select
                      value={hojaSeleccionada}
                      onChange={(e) => handleHojaChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-stone-500 focus:outline-none"
                      disabled={loading}
                    >
                      {hojasDisponibles.map((hoja) => (
                        <option key={hoja} value={hoja}>
                          {hoja}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-stone-500 mt-1">
                      Hojas disponibles: {hojasDisponibles.length}
                    </p>
                  </div>
                )}

                {preview.length > 0 && !loading && (
                  <div className="bg-stone-50 rounded-xl p-4 border-2 border-stone-200">
                    <h3 className="font-bold text-stone-900 mb-3">
                      Vista Previa (Primeras 5 filas) - Hoja: {hojaSeleccionada}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-stone-300">
                            <th className="text-left p-2 font-semibold text-stone-700">
                              Marca
                            </th>
                            <th className="text-left p-2 font-semibold text-stone-700">
                              Clase(s)
                            </th>
                            <th className="text-left p-2 font-semibold text-stone-700">
                              Registro
                            </th>
                            <th className="text-left p-2 font-semibold text-stone-700">
                              Titular
                            </th>
                            <th className="text-left p-2 font-semibold text-stone-700">
                              Contacto
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-b border-stone-200">
                              <td className="p-2 font-semibold">
                                {row.Marc_Marca || "-"}
                              </td>
                              <td className="p-2 text-blue-600">
                                {row.Marc_Clase || "-"}
                              </td>
                              <td className="p-2">
                                {row.Marc_Registro || "-"}
                              </td>
                              <td className="p-2">{row.Marc_Titular}</td>
                              <td className="p-2 text-xs">
                                {row.Contacto_Nombre || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {loading && (
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-bold text-blue-900">
                      Importando marcas y contactos...
                    </p>
                    <p className="text-sm text-blue-700">
                      {progress.current} de {progress.total} procesadas
                    </p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {mostrarResultadoFinal && !loading && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-3xl font-bold text-green-900">
                          {results.success}
                        </p>
                        <p className="text-sm text-green-700">
                          Importadas exitosamente
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-3xl font-bold text-red-900">
                          {results.errors.length}
                        </p>
                        <p className="text-sm text-red-700">
                          Fallaron al importar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {results.success > 0 && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-green-900 mb-2">
                          ✓ Importación completada
                        </h4>
                        <p className="text-sm text-green-800">
                          Se importaron exitosamente {results.success} marca(s)
                          con sus contactos a la base de datos
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {results.errors.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-red-900">
                            Errores en la base de datos ({results.errors.length}
                            )
                          </h4>
                          <button
                            onClick={descargarReporteErrores}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            Descargar Reporte
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-2">
                          {results.errors.map((err, i) => (
                            <div
                              key={i}
                              className="text-sm text-red-800 bg-white border border-red-300 p-3 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <span className="font-semibold">
                                  Fila {err.fila}: {err.marca}
                                </span>
                              </div>
                              <p className="text-red-700">{err.error}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {error && !mostrarResultadoFinal && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="p-6 border-t-2 border-stone-200 bg-stone-50 rounded-b-3xl flex gap-3">
            {!mostrarResultadoFinal ? (
              <>
                <button
                  onClick={cerrarYLimpiar}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition-all"
                  disabled={loading}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setMostrarValidador(true)}
                  disabled={
                    loading ||
                    !file ||
                    preview.length === 0 ||
                    !empresaSeleccionada
                  }
                  className="flex-1 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Validar y Continuar
                </button>
              </>
            ) : (
              <button
                onClick={cerrarYLimpiar}
                className="flex-1 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                }}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarValidador && datosCompletos.length > 0 && (
        <MarcasValidator
          data={datosCompletos}
          onValidationComplete={handleImport}
          onCancel={() => setMostrarValidador(false)}
        />
      )}
    </>
  );
}

export default MarcasImport;
