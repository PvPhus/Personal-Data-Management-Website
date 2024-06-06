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
                User_id = user.user_id,
                Username = user.username,
                Email = user.email,
                Role = user.role,
                Password = user.password,
                Avatar_url = user.avatar_url,
                Join_date = user.join_date,
                token = user.Token
            });
        }
        [HttpGet("user/{email}")]
        public IActionResult GetUserByEmail(string email)
        {
            try
            {
                // Gọi phương thức GetUserByEmail từ IUserBusiness để kiểm tra xem người dùng có tồn tại không
                bool userExists = _UserBusiness.GetUserByEmail(email);

                // Kiểm tra xem người dùng có tồn tại không và trả về kết quả
                return Ok(new { exists = userExists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] UserModel model)
        {
            try
            {
                // Kiểm tra nếu người dùng đã tồn tại
                if (_UserBusiness.GetUserByEmail(model.email))
                {
                    return Conflict("User already exists");
                }

                // Gọi business logic để thực hiện đăng ký người dùng
                UserModel registeredUser = _UserBusiness.RegisterUser(model.username, model.email, model.password, model.role, model.avatar_url);

                // Trả về thông tin người dùng đã đăng ký thành công
                return Ok(registeredUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("get_user_by_userid/{user_id}")]
        public IActionResult GetUserByUserId(int user_id)
        {
            try
            {
                // Gọi phương thức GetUserByEmail từ IUserBusiness để kiểm tra xem người dùng có tồn tại không
                UserModel user = _UserBusiness.GetUserByUserId(user_id);

                // Kiểm tra xem người dùng có tồn tại không và trả về kết quả
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
