using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using WebServiceBackEnd;
using WebServiceBackEnd.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// IMPORTANTE: Registrar BlobStorageService
builder.Services.AddScoped<BlobStorageService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddHostedService<NotificationJobService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// ========== REGISTRO AUTOMÁTICO CON REFLECTION ==========
var assembly = Assembly.GetExecutingAssembly();

var daTypes = assembly.GetTypes()
    .Where(t => t.Name.EndsWith("DA") && !t.IsInterface && !t.IsAbstract);
foreach (var type in daTypes)
{
    builder.Services.AddScoped(type);
}

var bpTypes = assembly.GetTypes()
    .Where(t => t.Name.EndsWith("BP") && !t.IsInterface && !t.IsAbstract);
foreach (var type in bpTypes)
{
    builder.Services.AddScoped(type);
}
// ========================================================

builder.Services.AddEndpointsApiExplorer();

// Configuración de Swagger con soporte para archivos
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WebService BackEnd API",
        Version = "v1",
        Description = "API para gestión de marcas y archivos"
    });

    options.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });

    options.OperationFilter<SwaggerFileOperationFilter>();

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebService BackEnd API v1");
    });
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();