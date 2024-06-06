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
    public class GroupController : ControllerBase
    {
        private IGroupBusiness _GroupBusiness;
        public GroupController(IGroupBusiness GroupBusiness)
        {
            _GroupBusiness = GroupBusiness;
        }

        [HttpGet("get_all_group")]
        public IActionResult GetAllGroups(int user_id)
        {
            try
            {
                var groups = _GroupBusiness.GetAllGroups(user_id);
                if (groups == null)
                {
                    return NotFound("No groups found for the specified user.");
                }
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [Route("get_Groups/{user_id}")]
        [HttpGet]
        public IActionResult GetGroupsByUserId(int user_id)
        {
            try
            {
                var groups = _GroupBusiness.GetGroupsByUserId(user_id);
                if (groups == null)
                {
                    return NotFound("No group found for the specified user.");
                }
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [Route("create-group")]
        [HttpPost]
        public IActionResult CreateItem([FromBody] GroupModel model)
        {
            try
            {
                _GroupBusiness.Create(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }

        [Route("get_3_group/{user_id}")]
        [HttpGet]
        public IActionResult Get3Group(int user_id)
        {
            try
            {
                var groups = _GroupBusiness.Get3Group(user_id);
                if (groups == null)
                {
                    return NotFound("No group found for the specified user.");
                }
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("delete-group/{group_id}")]
        [HttpDelete]
        public IActionResult DeleteItem(int group_id)
        {
            try
            {
                bool isDeleted = _GroupBusiness.Delete(group_id);

                if (isDeleted)
                {
                    return Ok("Group deleted successfully.");
                }
                else
                {
                    return NotFound("Group not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the file.");
            }
        }
        [Route("get_data_group/")]
        [HttpGet]
        public IActionResult GetDataGroup(int user_id, int group_id)
        {
            try
            {
                var datas = _GroupBusiness.GetDataGroup(user_id, group_id);
                if (datas == null)
                {
                    return NotFound("No group found for the specified user.");
                }
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_count/{group_id}")]
        public IActionResult GetCount(int group_id)
        {
            try
            {
                var members = _GroupBusiness.GetCount(group_id);
                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
