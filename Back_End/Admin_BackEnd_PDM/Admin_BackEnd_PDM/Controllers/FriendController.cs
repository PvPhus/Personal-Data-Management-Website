using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Mvc;

namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController:ControllerBase
    {
        private IFriendBusiness _FriendBusiness;
        public FriendController(IFriendBusiness FriendBusiness)
        {
            _FriendBusiness = FriendBusiness;
        }

        [HttpPost("create_messages_friend")]
        public IActionResult CreateMessages([FromBody] FriendMessagesModel model)
        {
            try
            {
                _FriendBusiness.CreateMessages(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
    }

}
