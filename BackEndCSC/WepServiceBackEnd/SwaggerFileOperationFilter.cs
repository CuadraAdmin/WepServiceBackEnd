using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace WebServiceBackEnd
{
    public class SwaggerFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var hasFormFile = context.ApiDescription.ParameterDescriptions
                .Any(p => p.Type == typeof(IFormFile) || p.Type == typeof(IFormFile[]));

            if (!hasFormFile)
                return;

            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = GenerateSchema(context.ApiDescription.ParameterDescriptions)
                    }
                }
            };
        }

        private OpenApiSchema GenerateSchema(IEnumerable<ApiParameterDescription> parameterDescriptions)
        {
            var schema = new OpenApiSchema
            {
                Type = "object",
                Properties = new Dictionary<string, OpenApiSchema>(),
                Required = new HashSet<string>()
            };

            foreach (var param in parameterDescriptions)
            {
                // Ignorar parámetros de ruta
                if (param.Source?.Id == "Path")
                    continue;

                if (param.Type == typeof(IFormFile) || param.Type == typeof(IFormFile[]))
                {
                    schema.Properties.Add(param.Name, new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    });

                    if (param.IsRequired)
                    {
                        schema.Required.Add(param.Name);
                    }
                }
                else if (param.Source?.Id == "Form")
                {
                    schema.Properties.Add(param.Name, new OpenApiSchema
                    {
                        Type = "string"
                    });
                }
            }

            return schema;
        }
    }
}