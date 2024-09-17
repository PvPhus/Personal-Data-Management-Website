using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Mvc;

namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendRequestController : ControllerBase
    {
        private IFriendRequestBusiness _FriendRequestBusiness;
        public FriendRequestController(IFriendRequestBusiness FriendRequestBusiness)
        {
            _FriendRequestBusiness = FriendRequestBusiness;
        }
        [HttpGet("get_all_request_friend")]
        public IActionResult GetAllRequestFriend(int user_id)
        {
            try
            {
                var rf = _FriendRequestBusiness.GetAllRequestFriend(user_id);
                if (rf == null)
                {
                    return NotFound("No request friend found for the specified user.");
                }
                return Ok(rf);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("create_friend_request")]
        public IActionResult FriendRequest([FromBody] FriendRequestModel model)
        {
            try
            {
                _FriendRequestBusiness.FriendRequest(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
        [Route("friend_accept")]
        [HttpPut]
        public IActionResult FriendAccept(int request_id)
        {
            try
            {
                _FriendRequestBusiness.FriendAccept(request_id);
                return Ok(request_id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("friend_block")]
        [HttpPut]
        public IActionResult FriendBlock(int request_id)
        {
            try
            {
                _FriendRequestBusiness.FriendBlock(request_id);
                return Ok(request_id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("friend_declined")]
        [HttpPut]
        public IActionResult FriendDeclined(int request_id)
        {
            try
            {
                _FriendRequestBusiness.FriendDeclined(request_id);
                return Ok(request_id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("friend_destroy")]
        [HttpDelete]
        public IActionResult FriendDestroy(int request_id)
        {
            try
            {
                _FriendRequestBusiness.FriendDestroy(request_id);
                return Ok(request_id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }

}
