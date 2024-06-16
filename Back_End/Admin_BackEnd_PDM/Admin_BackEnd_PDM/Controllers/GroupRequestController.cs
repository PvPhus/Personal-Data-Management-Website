using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataModel;
using BusinessLogicLayer;
using DataAccessLayer.Interfaces;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;


namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupRequestController : ControllerBase
    {
        private readonly IGroupRequestBusiness _GroupRequestBusiness;
        public GroupRequestController(IGroupRequestBusiness GroupRequestBusiness)
        {
            _GroupRequestBusiness = GroupRequestBusiness ?? throw new ArgumentNullException(nameof(GroupRequestBusiness));
          
        }
        [Route("create_request")]
        [HttpPost]
        public IActionResult GroupRequest([FromBody] GroupRequestModel model)
        {
            try
            {
                _GroupRequestBusiness.GroupRequest(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
        [Route("get_list_request")]
        [HttpGet]
        public IActionResult GetListRequest([FromQuery] int group_id)
        {
            try
            {
                var requests = _GroupRequestBusiness.GetListRequest(group_id);
                if (requests == null || !requests.Any())
                {
                    return NotFound("No requests found for the specified group.");
                }
                return Ok(requests);
            }
            catch (Exception ex)
            {       
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("delete-request")]
        [HttpDelete]
        public IActionResult DeleteItem(int request_id)
        {
            try
            {
                bool isDeleted = _GroupRequestBusiness.Delete(request_id);

                if (isDeleted)
                {
                    return Ok("File deleted successfully.");
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
                return StatusCode(500, "An error occurred while deleting the file.");
            }
        }
        [HttpGet("get_1_request")]
        public IActionResult getRequest(int request_id)
        {
            try
            {
                var request = _GroupRequestBusiness.getRequest(request_id);
                if (request == null)
                {
                    return NotFound("No request found for the specified request_id.");
                }
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("check_group_request")]
        public IActionResult CheckSpam(int user_id, int group_id)
        {
            try
            {
                var check = _GroupRequestBusiness.CheckSpam(user_id, group_id);
                if (check == null)
                {
                    return NotFound("No request found for the specified request_id.");
                }
                return Ok(check);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("count_request/{group_id}")]
        public IActionResult GetCountRequest(int group_id)
        {
            try
            {
                var members = _GroupRequestBusiness.GetCountRequest(group_id);
                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
