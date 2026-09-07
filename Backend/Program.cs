using System.Text;
using AICustomerSupport.Backend.AI.Embeddings;
using AICustomerSupport.Backend.AI.Implementations;
using AICustomerSupport.Backend.AI.Interfaces;
using AICustomerSupport.Backend.AI.RAG;
using AICustomerSupport.Backend.AI.Retrieval;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.Helpers;
using AICustomerSupport.Backend.Middleware;
using AICustomerSupport.Backend.Services.Implementations;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Database Configuration
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase", true);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (useInMemory || string.IsNullOrEmpty(connectionString))
    {
        options.UseInMemoryDatabase("AICustomerSupportDb");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "SUPER_SECRET_KEY_FOR_AI_CUSTOMER_SUPPORT_PLATFORM_123456789_EXTENDED_KEY";
var keyBytes = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "AICustomerSupportApi",
        ValidAudience = jwtSettings["Audience"] ?? "AICustomerSupportClient",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

builder.Services.AddAuthorization();

// Dependency Injection - Helpers & Services
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IKnowledgeService, KnowledgeService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// AI & RAG Pipeline Services
builder.Services.AddScoped<IEmbeddingService, EmbeddingService>();
builder.Services.AddScoped<IBm25SearchService, Bm25SearchService>();
builder.Services.AddScoped<IVectorSearchService, VectorSearchService>();
builder.Services.AddScoped<IRrfFusionService, RrfFusionService>();
builder.Services.AddScoped<IRagService, RagService>();
builder.Services.AddScoped<AIService>();
builder.Services.AddScoped<IAIService>(sp => sp.GetRequiredService<AIService>());

// CORS Setup (for frontend communication)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// OpenAPI / Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AI Customer Support API", Version = "v1" });
    
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);
    var schemeRef = new OpenApiSecuritySchemeReference("Bearer");

    c.AddSecurityRequirement((doc) => new OpenApiSecurityRequirement
    {
        { schemeRef, new List<string>() }
    });
});

var app = builder.Build();

// Seed Database & Index RAG Chunks
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbSeeder.SeedAsync(context);

    var ragService = scope.ServiceProvider.GetRequiredService<IRagService>();
    await ragService.EnsureChunksIndexedAsync();
}

// Middleware Pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
