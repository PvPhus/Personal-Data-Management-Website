using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataModel;
using BusinessLogicLayer;

namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserBusiness _UserBusiness;
        public UserController(IUserBusiness UserBusiness)
        {
            _UserBusiness = UserBusiness;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthenticateModel model)
        {
            var user = _UserBusiness.Login(model.email, model.password);
            if (user == null)
                return BadRequest(new { message = "Tài khoản hoặc mật khẩu không đúng!" });

            // Trả về tất cả các thông tin của người dùng từ UserModel
            return Ok(new
            {
                user_id = user.UserId,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                password = user.Password,
                avatar_url = user.AvatarUrl,
                join_date = user.JoinDate,
                token = user.Token
            });
        }
        [HttpGet("user/{email}")]
        public IActionResult GetUserByEmail(string email)
        {
            var user = _UserBusiness.GetUserByEmail(email);
            if (user == null)
                return NotFound();

            // Trả về tất cả các thông tin của người dùng
            return Ok(new
            {
                user_id = user.UserId,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                password = user.Password,
                avatar_url = user.AvatarUrl,
                join_date = user.JoinDate,
                token = user.Token
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserModel model)
        {
            try
            {
                // Gọi business logic để thực hiện đăng ký người dùng
                UserModel registeredUser = _UserBusiness.RegisterUser(model.Username, model.Email, model.Password, model.Role, model.AvatarUrl);

                // Trả về thông tin người dùng đã đăng ký thành công
                return Ok(registeredUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
