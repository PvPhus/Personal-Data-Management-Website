using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer;
using System.Security.Cryptography;

namespace BusinessLogicLayer
{
    public class UserBusiness : IUserBusiness
    {
        private IUserRepository _res;
        private string secret;

        public UserBusiness(IUserRepository res, IConfiguration configuration)
        {
            _res = res;
            secret = configuration["AppSettings:Secret"];
        }

        public UserModel Login(string email, string password)
        {
            var user = _res.Login(email, password);
            if (user == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secret.PadRight(16));

            // Kiểm tra và gán các thuộc tính của user
            string userEmail = user.email ?? string.Empty;
            string userRole = user.role ?? string.Empty;

            // Tạo danh sách các claim từ dữ liệu người dùng
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, userEmail),
                    new Claim(ClaimTypes.Role, userRole)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.Aes128CbcHmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user;
        }

        public UserModel RegisterUser(string username, string email, string password, string role, string avatar_url)
        {
            // Thực hiện kiểm tra logic nghiệp vụ, ví dụ: kiểm tra tính hợp lệ của email

            // Gọi phương thức từ repository để đăng ký người dùng
            UserModel registeredUser = _res.RegisterUser(username, email, password, role, avatar_url);

            return registeredUser;
        }
    

        public bool GetUserByEmail(string email)
        {
            return _res.GetUserByEmail(email);
        }
        public UserModel GetUserByUserId(int user_id)
        {
            return _res.GetUserByUserId(user_id);
        }

    }
}

