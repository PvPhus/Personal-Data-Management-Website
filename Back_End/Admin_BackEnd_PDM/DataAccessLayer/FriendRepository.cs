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
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "Get_Data_Friend_Chat",
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
    }
}
