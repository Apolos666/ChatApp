var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

var jwtSettings = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secret = jwtSettings?.Secret ??
            throw new InvalidOperationException("JWT Secret is not configured");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(secret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        options.MapInboundClaims = false;
        options.SaveToken = true;
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseCurrentUser();
app.UseAuthorization();

app.MapGet("/api/test", (HttpContext context) =>
{
    var currentUser = context.GetCurrentUser();
    if (currentUser == null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new
    {
        message = $"Xin chào {currentUser.Name}!",
        user = currentUser
    });
})
.RequireAuthorization();

app.MapGet("/", () => "Hello World!");

app.Run();
