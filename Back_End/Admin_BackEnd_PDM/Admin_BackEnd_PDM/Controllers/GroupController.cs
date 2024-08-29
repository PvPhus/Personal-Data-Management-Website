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
        [HttpGet("get_all_list_groups")]
        public IActionResult GetAllListGroups()
        {
            try
            {
                var groups = _GroupBusiness.GetAllListGroups();
                if (groups == null)
                {
                    return NotFound("No files found for the data.");
                }
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_all_data_in_groups")]
        public IActionResult GetAllDataInGroup(int group_id)
        {
            try
            {
                var datas = _GroupBusiness.GetAllDataInGroup(group_id);
                if (datas == null)
                {
                    return NotFound("No files found for the data.");
                }
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
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
        

        [HttpGet("search_group_by_name")]
        public IActionResult SearchFile(string group_name, int user_id)
        {
            try
            {
                var search = _GroupBusiness.SearchGroup(group_name, user_id);
                if (search == null)
                {
                    return NotFound("No file found for the search file name.");
                }
                return Ok(search);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("check_admin_group/")]
        public IActionResult CheckAdminGroup(int group_id, int user_id)
        {
            try
            {
                bool isAdmin = _GroupBusiness.CheckAdminGroup(group_id, user_id);
                return Ok(new { IsAdmin = isAdmin });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while checking admin group.");
            }
        }
        [HttpGet("search_data_group")]
        public IActionResult SearchDataGroup(int group_id, string filename_new)
        {
            try
            {
                var datas = _GroupBusiness.SearchDataGroup(group_id, filename_new);
                if (datas == null)
                {
                    return NotFound("No datas found for the specified file name.");
                }
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_messages_group")]
        public IActionResult MessagesGroup(int group_id)
        {
            try
            {
                var Messages = _GroupBusiness.MessagesGroup(group_id);
                if (Messages == null)
                {
                    return NotFound("No files found for the data.");
                }
                return Ok(Messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("create_messages")]
        public IActionResult CreateMessages([FromBody] GroupMessagesModel model)
        {
            try
            {
                _GroupBusiness.CreateMessages(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
    }
}
