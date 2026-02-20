// Exportacion a excel de marcas

import * as XLSX from "xlsx";

export const exportToExcel = (marcas) => {
  const worksheet = XLSX.utils.json_to_sheet(
    marcas.map((marca) => ({
      // ID: marca.Marc_Id,
      //Empresa: marca.Empr_Nombre || "",
      Empresa: marca.Empr_Clave || "",
      Consecutivo: marca.Marc_Consecutivo || "",
      País: marca.Marc_Pais || "",
      "Tipo de Marca": marca.TipoMar_Nombre || "",
      "Solicitud Nacional": marca.Marc_SolicitudNacional || "",
      Registro: marca.Marc_Registro || "",
      Marca: marca.Marc_Marca || "",
      Diseño: marca.Marc_Diseno || "",
      Clase: marca.Marc_Clase || "",
      Titular: marca.Marc_Titular || "",
      Licenciamiento: marca.Marc_licenciamiento || "",
      Figura: marca.Marc_Figura || "",
      Título: marca.Marc_Titulo || "",
      Tipo: marca.Marc_Tipo || "",
      Rama: marca.Marc_Rama || "",
      Autor: marca.Marc_Autor || "",
      Observaciones: marca.Marc_Observaciones || "",
      "Fecha Solicitud": marca.Marc_FechaSolicitud
        ? new Date(marca.Marc_FechaSolicitud).toLocaleDateString("es-MX")
        : "",
      "Fecha Registro": marca.Marc_FechaRegistro
        ? new Date(marca.Marc_FechaRegistro).toLocaleDateString("es-MX")
        : "",
      DURE: marca.Marc_Dure
        ? new Date(marca.Marc_Dure).toLocaleDateString("es-MX")
        : "",
      Renovación: marca.Marc_Renovacion
        ? new Date(marca.Marc_Renovacion).toLocaleDateString("es-MX")
        : "",
      Oposición: marca.Marc_Oposicion
        ? new Date(marca.Marc_Oposicion).toLocaleDateString("es-MX")
        : "",
      "Fecha Seguimiento": marca.Marc_FechaSeguimiento
        ? new Date(marca.Marc_FechaSeguimiento).toLocaleDateString("es-MX")
        : "",
      Estado: marca.Marc_Estatus ? "ACTIVA" : "INACTIVA",
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Marcas");

  XLSX.writeFile(
    workbook,
    `marcas_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};
