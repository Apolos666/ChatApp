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

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

builder.Services.AddCarter();

builder.Services.AddSignalR();

builder.Services.Configure<KafkaOptions>(
    builder.Configuration.GetSection(KafkaOptions.SectionName));

builder.Services.AddSingleton<IKafkaProducer<MessageDto>, MessageProducer>();
builder.Services.AddSingleton<IKafkaProducer<MessagePinnedDto>, MessagePinProducer>();
builder.Services.AddSingleton<IKafkaProducer<TypingIndicatorDto>, TypingIndicatorProducer>();

builder.Services.AddHostedService<MessageSentConsumer>();
builder.Services.AddHostedService<MessagePinnedConsumer>();
builder.Services.AddHostedService<TypingIndicatorConsumer>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.Configure<CloudinaryOptions>(
    builder.Configuration.GetSection(CloudinaryOptions.SectionName));
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<IVideoCallService, VideoCallService>();

var app = builder.Build();

app.UseExceptionHandler();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseCurrentUser();
app.UseAuthorization();

app.MapCarter();

app.MapHub<ChatHub>("/chatHub");
app.MapHub<VideoCallHub>("/videoCallHub");

app.Run();
