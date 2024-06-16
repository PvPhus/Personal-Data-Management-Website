using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataModel;
using BusinessLogicLayer;
using DataAccessLayer.Interfaces;

namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupMemberController : ControllerBase
    {
        private IGroupMemberBusiness _GroupMemberBusiness;
        public GroupMemberController(IGroupMemberBusiness GroupMemberBusiness)
        {
            _GroupMemberBusiness = GroupMemberBusiness;
        }

        [Route("add_member")]
        [HttpPost]
        public IActionResult CreateItem([FromBody] GroupMemberModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest("Invalid data.");
                }

                bool isCreated = _GroupMemberBusiness.Create(model);
                if (!isCreated)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
        [Route("delete-member")]
        [HttpDelete]
        public IActionResult DeleteItem(int group_id, int user_id)
        {
            try
            {
                bool isDeleted = _GroupMemberBusiness.Delete(group_id, user_id);

                if (isDeleted)
                {
                    return Ok("Member deleted successfully.");
                }
                else
                {
                    return NotFound("File not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the member.");
            }
        }
        [HttpGet("groupMembers/{group_id}")]
        public IActionResult GetGroupMembers(int group_id)
        {
            try
            {
                var members = _GroupMemberBusiness.GetGroupMembers(group_id);
                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("count_member/{group_id}")]
        public IActionResult GetCountMember(int group_id)
        {
            try
            {
                var members = _GroupMemberBusiness.GetCountMember(group_id);
                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
