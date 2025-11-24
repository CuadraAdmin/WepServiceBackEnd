using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServiceBackEnd.Services;

namespace WebServiceBackEnd.Controllers.CM
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MarcasArchivosController : ControllerBase
    {
        private readonly BlobStorageService _blobStorageService;

        public MarcasArchivosController(BlobStorageService blobStorageService)
        {
            _blobStorageService = blobStorageService;
        }

        /// <summary>
        /// Subir IMAGEN DE DISEÑO de la marca (solo una por marca)
        /// </summary>
        [HttpPost("upload-diseno/{marcaId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImagenDiseno(int marcaId,  IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha proporcionado ningún archivo" });
                }

                // Validar que sea imagen
                if (!file.ContentType.StartsWith("image/"))
                {
                    return BadRequest(new { mensaje = "Solo se permiten archivos de imagen" });
                }

                // Validar tamaño (máximo 5MB para diseño)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "La imagen excede el tamaño máximo de 5MB" });
                }

                var url = await _blobStorageService.UploadImagenDisenoAsync(marcaId, file);

                return Ok(new
                {
                    mensaje = "Imagen de diseño subida exitosamente",
                    url = url
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Subir archivo general (documentos, imágenes adicionales, etc.)
        /// </summary>
        [HttpPost("upload/{marcaId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadArchivo(int marcaId, IFormFile file, string tipoArchivo = "documento")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha proporcionado ningún archivo" });
                }

                // Validar tamaño (máximo 10MB)
                if (file.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "El archivo excede el tamaño máximo de 10MB" });
                }

                // Validar extensiones permitidas
                var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!extensionesPermitidas.Contains(extension))
                {
                    return BadRequest(new { mensaje = "Tipo de archivo no permitido" });
                }

                var url = await _blobStorageService.UploadFileAsync(marcaId, file, tipoArchivo);

                return Ok(new
                {
                    mensaje = "Archivo subido exitosamente",
                    url = url,
                    nombre = file.FileName,
                    tipo = tipoArchivo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Obtener URL de imagen de diseño de una marca
        /// </summary>
        [HttpGet("imagen-diseno/{marcaId}")]
        public async Task<IActionResult> ObtenerImagenDiseno(int marcaId)
        {
            try
            {
                var url = await _blobStorageService.ObtenerImagenDisenoAsync(marcaId);

                if (url == null)
                {
                    return NotFound(new { mensaje = "No se encontró imagen de diseño para esta marca" });
                }

                return Ok(new { url = url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Listar todos los archivos de una marca
        /// </summary>
        [HttpGet("listar/{marcaId}")]
        public async Task<IActionResult> ListarArchivos(int marcaId)
        {
            try
            {
                var archivos = await _blobStorageService.ListarArchivosAsync(marcaId);
                return Ok(archivos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Eliminar un archivo específico
        /// </summary>
        [HttpDelete("eliminar")]
        public async Task<IActionResult> EliminarArchivo([FromBody] EliminarArchivoRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Url))
                {
                    return BadRequest(new { mensaje = "URL del archivo es requerida" });
                }

                var resultado = await _blobStorageService.DeleteFileAsync(request.Url);

                if (resultado)
                {
                    return Ok(new { mensaje = "Archivo eliminado exitosamente" });
                }
                else
                {
                    return NotFound(new { mensaje = "Archivo no encontrado" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }


        /// <summary>
        /// Eliminar todos los archivos de una marca
        /// </summary>
        [HttpDelete("eliminar-todos/{marcaId}")]
        public async Task<IActionResult> EliminarTodosArchivos(int marcaId)
        {
            try
            {
                var deletedCount = await _blobStorageService.DeleteAllFilesFromMarcaAsync(marcaId);
                return Ok(new
                {
                    mensaje = $"Se eliminaron {deletedCount} archivos exitosamente",
                    cantidad = deletedCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }
        /// <summary>
        /// Descargar imagen pasando por el backend (evita CORS)
        /// </summary>
        [HttpGet("descargar-imagen")]
        public async Task<IActionResult> DescargarImagen([FromQuery] string url)
        {
            try
            {
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(url);

                // Obtener extensión de la URL
                var extension = Path.GetExtension(new Uri(url).LocalPath);
                var contentType = extension.ToLower() switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    _ => "application/octet-stream"
                };

                return File(imageBytes, contentType, $"diseño-marca{extension}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al descargar imagen: {ex.Message}" });
            }
        }
    }
    // Clase auxiliar para recibir la URL
    public class EliminarArchivoRequest
    {
        public string Url { get; set; }
    }
}