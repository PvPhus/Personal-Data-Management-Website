using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class FriendRequestRepository : IFriendRequestRepository
    {
        private IDatabaseHelper _dbHelper;
        public FriendRequestRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public List<FriendRequestModel> GetAllRequestFriend(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_request_friend",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FriendRequestModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool FriendRequest(FriendRequestModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_request_create",
                    "@sender_id", model.sender_id,
                    "@receiver_id", model.receiver_id);
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
        public bool FriendAccept(int request_id)
        {
            try
            {

                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_request_accept",
                    "@request_id", request_id);
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
        public bool FriendBlock(int request_id)
        {
            try
            {

                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_block",
                    "@request_id", request_id);
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
        public bool FriendDeclined(int request_id)
        {
            try
            {

                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_declined",
                    "@request_id", request_id);
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
        public bool FriendDestroy(int request_id)
        {
            try
            {

                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_friend_destroy",
                    "@request_id", request_id);
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
