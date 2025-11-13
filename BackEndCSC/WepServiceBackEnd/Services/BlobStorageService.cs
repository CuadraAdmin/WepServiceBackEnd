using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using WebServiceBackEnd.BE.CM;
using WebServiceBackEnd.DA.CM;

namespace WebServiceBackEnd.Services
{
    public class BlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private readonly MarcasDA _marcasDA;

        public BlobStorageService(IConfiguration configuration, MarcasDA marcasDA)
        {
            var connectionString = configuration.GetConnectionString("AzureBlobStorages");
            _blobServiceClient = new BlobServiceClient(connectionString);
            _containerName = configuration["CadenaContenedor:NombreContenedor"] ?? "marcas-archivos";
            _marcasDA = marcasDA;

            CreateContainerIfNotExists().Wait();
        }

        private async Task CreateContainerIfNotExists()
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();
        }

        /// <summary>
        /// Obtener ruta base: Cuadra/Nike_1/
        /// </summary>
        private async Task<string> ObtenerRutaBaseAsync(int marcaId)
        {
            var datos = await _marcasDA.ObtenerEmpresaYMarcaPorId(marcaId);

            if (datos == null)
                throw new Exception("Marca o empresa no encontrada");

            return $"{datos.Value.EmpresaClave}/{datos.Value.MarcaNombre}_{marcaId}";
        }

        /// <summary>
        /// Renombrar carpeta de marca si cambió el nombre
        /// </summary>
        public async Task RenombrarCarpetaMarcaAsync(int marcaId, string nombreAnterior)
        {
            try
            {
                var datos = await _marcasDA.ObtenerEmpresaYMarcaPorId(marcaId);

                if (datos == null)
                    throw new Exception("Marca no encontrada");

                string rutaAnterior = $"{datos.Value.EmpresaClave}/{nombreAnterior}_{marcaId}";
                string rutaNueva = $"{datos.Value.EmpresaClave}/{datos.Value.MarcaNombre}_{marcaId}";

                // Si los nombres son iguales, no hacer nada
                if (rutaAnterior == rutaNueva)
                    return;

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

                // Listar todos los archivos de la ruta anterior
                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: $"{rutaAnterior}/"))
                {
                    var blobAnterior = containerClient.GetBlobClient(blobItem.Name);

                    // Nueva ruta del archivo
                    var nuevaRuta = blobItem.Name.Replace(rutaAnterior, rutaNueva);
                    var blobNuevo = containerClient.GetBlobClient(nuevaRuta);

                    // Copiar archivo a nueva ubicación
                    await blobNuevo.StartCopyFromUriAsync(blobAnterior.Uri);

                    // Esperar a que termine la copia
                    var propiedades = await blobNuevo.GetPropertiesAsync();
                    while (propiedades.Value.CopyStatus == CopyStatus.Pending)
                    {
                        await Task.Delay(100);
                        propiedades = await blobNuevo.GetPropertiesAsync();
                    }

                    // Eliminar archivo anterior
                    await blobAnterior.DeleteIfExistsAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al renombrar carpeta de marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Subir imagen de diseño (logo)
        /// Ruta: Cuadra/Nike_1/diseno/guid.jpg
        /// </summary>
        public async Task<string> UploadImagenDisenoAsync(int marcaId, IFormFile file)
        {
            try
            {
                string rutaBase = await ObtenerRutaBaseAsync(marcaId);

                await DeleteArchivosTipo(rutaBase, "diseno");

                var fileName = $"{rutaBase}/diseno/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(fileName);

                var metadata = new Dictionary<string, string>
                {
                    { "nombreoriginal", file.FileName }
                };

                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders
                    {
                        ContentType = file.ContentType
                    });

                    await blobClient.SetMetadataAsync(metadata);
                }

                return GenerateSasUrl(blobClient);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al subir imagen de diseño: {ex.Message}");
            }
        }

        /// <summary>
        /// Subir archivo general
        /// Ruta: Cuadra/Nike_1/Archivos/guid.pdf
        /// </summary>
        public async Task<string> UploadFileAsync(int marcaId, IFormFile file, string tipoArchivo = "imagen")
        {
            try
            {
                string rutaBase = await ObtenerRutaBaseAsync(marcaId);

                var fileName = $"{rutaBase}/Archivos/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(fileName);

                var metadata = new Dictionary<string, string>
                {
                    { "nombreoriginal", file.FileName }
                };

                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders
                    {
                        ContentType = file.ContentType
                    });

                    await blobClient.SetMetadataAsync(metadata);
                }

                return GenerateSasUrl(blobClient);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al subir archivo: {ex.Message}");
            }
        }

        /// <summary>
        /// Listar todos los archivos de una marca
        /// </summary>
        public async Task<List<ArchivoMarcaBE>> ListarArchivosAsync(int marcaId)
        {
            try
            {
                var archivos = new List<ArchivoMarcaBE>();
                string rutaBase = await ObtenerRutaBaseAsync(marcaId);

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var prefix = $"{rutaBase}/Archivos/";

                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: prefix, traits: BlobTraits.Metadata))
                {
                    var blobClient = containerClient.GetBlobClient(blobItem.Name);
                    var properties = await blobClient.GetPropertiesAsync();

                    string nombreOriginal = "archivo";
                    if (blobItem.Metadata != null && blobItem.Metadata.ContainsKey("nombreoriginal"))
                    {
                        nombreOriginal = blobItem.Metadata["nombreoriginal"];
                    }
                    else
                    {
                        var pathParts = blobItem.Name.Split('/');
                        nombreOriginal = pathParts.Length > 3 ? pathParts[3] : blobItem.Name;
                    }

                    archivos.Add(new ArchivoMarcaBE
                    {
                        Nombre = nombreOriginal, 
                        Url = GenerateSasUrl(blobClient),
                        TipoArchivo = "Archivos",
                        ContentType = properties.Value.ContentType,
                        Tamaño = properties.Value.ContentLength,
                        FechaSubida = properties.Value.CreatedOn.DateTime
                    });
                }

                return archivos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar archivos: {ex.Message}");
            }
        }
        /// <summary>
        /// Obtener URL de imagen de diseño
        /// </summary>
        public async Task<string?> ObtenerImagenDisenoAsync(int marcaId)
        {
            try
            {
                string rutaBase = await ObtenerRutaBaseAsync(marcaId);

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var prefix = $"{rutaBase}/diseno/";

                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: prefix))
                {
                    var blobClient = containerClient.GetBlobClient(blobItem.Name);
                    return GenerateSasUrl(blobClient);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Eliminar archivo por URL
        /// </summary>
        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                // Separar la URL base del SAS token
                var urlSinToken = fileUrl.Split('?')[0];
                var uri = new Uri(urlSinToken);

                var segments = uri.AbsolutePath.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);


                var blobName = string.Join("/", segments.Skip(1));


                blobName = Uri.UnescapeDataString(blobName);

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(blobName);


                var existe = await blobClient.ExistsAsync();

                if (!existe)
                {
                    throw new Exception($"El archivo no existe en Azure Storage. Ruta: {blobName}");
                }

                return await blobClient.DeleteIfExistsAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar archivo: {ex.Message}");
            }
        }

        /// <summary>
        /// Eliminar archivos de un tipo específico
        /// </summary>
        private async Task DeleteArchivosTipo(string rutaBase, string tipoArchivo)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var prefix = $"{rutaBase}/{tipoArchivo}/";

                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: prefix))
                {
                    var blobClient = containerClient.GetBlobClient(blobItem.Name);
                    await blobClient.DeleteIfExistsAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar archivos de tipo {tipoArchivo}: {ex.Message}");
            }
        }

        /// <summary>
        /// Eliminar TODOS los archivos de una marca
        /// </summary>
        public async Task<int> DeleteAllFilesFromMarcaAsync(int marcaId)
        {
            try
            {
                string rutaBase = await ObtenerRutaBaseAsync(marcaId);

                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var prefix = $"{rutaBase}/";
                int deletedCount = 0;

                await foreach (var blobItem in containerClient.GetBlobsAsync(prefix: prefix))
                {
                    var blobClient = containerClient.GetBlobClient(blobItem.Name);
                    if (await blobClient.DeleteIfExistsAsync())
                    {
                        deletedCount++;
                    }
                }

                return deletedCount;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar archivos de la marca: {ex.Message}");
            }
        }

        /// <summary>
        /// Generar URL con SAS Token
        /// </summary>
        private string GenerateSasUrl(BlobClient blobClient)
        {
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerName,
                BlobName = blobClient.Name,
                Resource = "b",
                ExpiresOn = DateTimeOffset.UtcNow.AddYears(1)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasUri = blobClient.GenerateSasUri(sasBuilder);
            return sasUri.ToString();
        }
    }
}