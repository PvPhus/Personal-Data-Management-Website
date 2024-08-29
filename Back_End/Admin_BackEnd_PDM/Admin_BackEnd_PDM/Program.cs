using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer;
using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS policies
builder.Services.AddCors(options =>
{
    // Define a CORS policy named "AllowAll"
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });

    // Define a CORS policy named "AllowFrontend" specifically for http://127.0.0.1:8000 and http://localhost:3000
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:8000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the DI container
builder.Services.AddTransient<IDatabaseHelper, DatabaseHelper>();

builder.Services.AddTransient<IFileRepository, FileRepository>();
builder.Services.AddTransient<IFileBusiness, FileBusiness>();
builder.Services.AddTransient<IGroupRepository, GroupRepository>();
builder.Services.AddTransient<IGroupBusiness, GroupBusiness>();
builder.Services.AddTransient<IGroupMemberRepository, GroupMemberRepository>();
builder.Services.AddTransient<IGroupMemberBusiness, GroupMemberBusiness>();
builder.Services.AddTransient<IGroupRequestRepository, GroupRequestRepository>();
builder.Services.AddTransient<IGroupRequestBusiness, GroupRequestBusiness>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUserBusiness, UserBusiness>();
builder.Services.AddTransient<IPermissionRepository, PermissionRepository>();
builder.Services.AddTransient<IPermissionBusiness, PermissionBusiness>();

builder.Services.AddTransient<IFriendRepository, FriendRepository>();
builder.Services.AddTransient<IFriendBusiness, FriendBusiness>();

builder.Services.AddTransient<IFriendRequestRepository, FriendRequestRepository>();
builder.Services.AddTransient<IFriendRequestBusiness, FriendRequestBusiness>();
// Configure AppSettings from configuration
IConfiguration configuration = builder.Configuration;
builder.Services.Configure<AppSettings>(configuration.GetSection("AppSettings"));

// Configure JWT authentication
var appSettings = configuration.GetSection("AppSettings").Get<AppSettings>();
var key = Encoding.ASCII.GetBytes(appSettings.Secret);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Add controllers and configure Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable CORS for "AllowFrontend" policy
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
