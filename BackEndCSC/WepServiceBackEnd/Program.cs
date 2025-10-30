using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using WebServiceBackEnd.BE.CU;
using WebServiceBackEnd.BP.CU;
using WebServiceBackEnd.DA.CU;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

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

// Registrar todas las clases que terminan en "DA"
var daTypes = assembly.GetTypes()
    .Where(t => t.Name.EndsWith("DA") && !t.IsInterface && !t.IsAbstract);

foreach (var type in daTypes)
{
    builder.Services.AddScoped(type);
}

// Registrar todas las clases que terminan en "BP"
var bpTypes = assembly.GetTypes()
    .Where(t => t.Name.EndsWith("BP") && !t.IsInterface && !t.IsAbstract);

foreach (var type in bpTypes)
{
    builder.Services.AddScoped(type);
}
// ========================================================

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();