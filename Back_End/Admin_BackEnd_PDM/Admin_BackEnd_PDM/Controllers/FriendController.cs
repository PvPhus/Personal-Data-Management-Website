using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
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
        [HttpGet("get_data_friend_chat")]
        public IActionResult GetDataFriendChat(int sender_id, int receiver_id)
        {
            try
            {
                var datas = _FriendBusiness.GetDataFriendChat(sender_id, receiver_id);
                if (datas == null)
                {
                    return NotFound("No data found for the chat.");
                }
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("share_friend_list_data")]
        [HttpPost]
        public IActionResult ShareFriendListData([FromBody] ShareFriendListDataModel model)
        {
            try
            {
                if (model == null || model.file_id == null || !model.file_id.Any())
                {
                    return BadRequest("Invalid data.");
                }

                bool isShared = _FriendBusiness.ShareFriendListData(model);
                if (isShared)
                {
                    return Ok("Files shared successfully.");
                }
                else
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); 
            }
        }
        [Route("delete-data-friend/{message_id}")]
        [HttpDelete]
        public IActionResult DeleteDataFriend(int message_id)
        {
            try
            {
                bool isDeleted = _FriendBusiness.DeleteDataFriend(message_id);

                if (isDeleted)
                {
                    return Ok("Data deleted successfully.");
                }
                else
                {
                    return NotFound("Data not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the data.");
            }
        }
        [Route("friend_block_message")]
        [HttpPut]
        public IActionResult FriendBlockMessage(int sender_id, int receiver_id)
        {
            try
            {
                _FriendBusiness.FriendBlockMessage(sender_id, receiver_id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("delete-conversation")]
        [HttpDelete]
        public IActionResult DeleteConversation(int sender_id, int receiver_id)
        {
            try
            {
                bool isDeleted = _FriendBusiness.DeleteConversation(sender_id, receiver_id);

                if (isDeleted)
                {
                    return Ok("Conversation deleted successfully.");
                }
                else
                {
                    return NotFound("Conversation not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the conversation.");
            }
        }
    }
}
