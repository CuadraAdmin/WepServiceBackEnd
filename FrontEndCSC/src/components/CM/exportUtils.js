// Exportacion a excel de marcas

import * as XLSX from "xlsx";

export const exportToExcel = (marcas) => {
  const worksheet = XLSX.utils.json_to_sheet(
    marcas.map((marca) => ({
      ID: marca.id,
      Nombre: marca.nombre,
      Descripción: marca.descripcion || "",
      Categoría: marca.categoria || "",
      "País de Origen": marca.paisOrigen || "",
      "Año de Fundación": marca.anioFundacion || "",
      Color: marca.color,
      Estado: marca.activo ? "ACTIVA" : "INACTIVA",
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Marcas");

  XLSX.writeFile(
    workbook,
    `marcas_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};
