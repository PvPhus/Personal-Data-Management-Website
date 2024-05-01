using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer;
using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
// Th�m d?ch v? v�o v�ng ch?a.
builder.Services.AddTransient<IDatabaseHelper, DatabaseHelper>();
//builder.Services.AddTransient<IKhachHangRepository, KhachHangRepository>();
//builder.Services.AddTransient<IKhachHangBusiness, KhachHangBusiness>();
//builder.Services.AddTransient<INhaCungCapRepository, NhaCungCapRepository>();
//builder.Services.AddTransient<INhaCungCapBusiness, NhaCungCapBusiness>();
//builder.Services.AddTransient<IHoaDonRepository, HoaDonRepository>();
//builder.Services.AddTransient<IHoaDonBusiness, HoaDonBusiness>();
//builder.Services.AddTransient<IDoGiaDungRepository, DoGiaDungRepository>();
//builder.Services.AddTransient<IDoGiaDungBusiness, DoGiaDungBusiness>();
//builder.Services.AddTransient<INhanVienRepository, NhanVienRepository>();
//builder.Services.AddTransient<INhanVienBusiness, NhanVienBusiness>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUserBusiness, UserBusiness>();

// c?u h�nh c�c ??i t??ng c�i ??t ???c g� m?nh
IConfiguration configuration = builder.Configuration;
var appSettingsSection = configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);

// ??nh c?u h�nh x�c th?c jwt
var appSettings = appSettingsSection.Get<AppSettings>();
var key = Encoding.ASCII.GetBytes(appSettings.Secret);
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Th�m d?ch v? v�o v�ng ch?a.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// ??nh c?u h�nh ???ng d?n y�u c?u HTTP.v
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();