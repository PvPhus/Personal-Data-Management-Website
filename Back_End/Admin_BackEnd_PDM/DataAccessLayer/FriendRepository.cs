using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class FriendRepository:IFriendRepository
    {
        private IDatabaseHelper _dbHelper;
        public FriendRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public bool CreateMessages(FriendMessagesModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_Friend_Message_Create",
                    "@sender_id", model.sender_id,
                    "@receiver_id", model.receiver_id,
                    "@content", model.content);
                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (result != null && !string.IsNullOrEmpty(result.ToString()))
                {
                    throw new Exception("Database error: " + result.ToString());
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in Create method: " + ex.Message);
                throw;
            }
        }
        public List<FriendMessagesModel> GetDataFriendChat(int sender_id, int receiver_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_data_friend_chat",
                    "@sender_id", sender_id,
                    "@receiver_id", receiver_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FriendMessagesModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool ShareFriendListData(ShareFriendListDataModel model)
        {
            try
            {
                string msgError = "";
                var files = string.Join(",", model.file_id);
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_share_friend_list_data",
                    "@sender_id", model.sender_id,
                    "@receiver_id", model.receiver_id,
                    "@message_content", model.content,
                    "@file_ids", files);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (result != null && !string.IsNullOrEmpty(result.ToString()))
                {
                    throw new Exception("Database error: " + result.ToString());
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in ShareFile method: " + ex.Message);
                throw;
            }
        }
        public bool DeleteDataFriend(int message_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_delete_data_friend",
                    "@message_id", message_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                // Trả về true nếu không có lỗi xảy ra
                return true;
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và ném lại ngoại lệ để cho phép lớp gọi xử lý ngoại lệ
                Console.WriteLine("Error in Delete method: " + ex.Message);
                throw;
            }
        }
        public bool DeleteConversation(int sender_id, int receiver_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_delete_friend_chat",
                    "@sender_id", sender_id,
                    "@receiver_id", receiver_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                // Trả về true nếu không có lỗi xảy ra
                return true;
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và ném lại ngoại lệ để cho phép lớp gọi xử lý ngoại lệ
                Console.WriteLine("Error in Delete method: " + ex.Message);
                throw;
            }
        }

        public bool FriendBlockMessage(int sender_id, int receiver_id)
        {
            try
            {

                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_block_message",
                    "@sender_id", sender_id,
                    "@receiver_id", receiver_id);
                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                return true; // Trả về true nếu không có lỗi xảy ra
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và ném lại ngoại lệ để cho phép lớp gọi xử lý ngoại lệ
                Console.WriteLine("Error in Update method: " + ex.Message);
                throw;
            }
        }
    }
}
