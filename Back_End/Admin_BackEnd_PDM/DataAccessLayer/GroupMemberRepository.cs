using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class GroupMemberRepository : IGroupMemberRepository
    {
        private IDatabaseHelper _dbHelper;
        public GroupMemberRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public bool Create(GroupMemberModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_add_group_member",
                    "@group_id", model.group_id,
                    "@user_id", model.user_id);

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
        public bool Delete(int group_id, int user_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_delete_group_member",
                    "@group_id", group_id,
                    "@user_id", user_id);

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


        public List<InfoGroupMembers> GetGroupMembers(int group_id)
        {
            string msgError = "";
            var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_group_members",
                "@group_id", group_id);

            if (!string.IsNullOrEmpty(msgError))
            {
                throw new Exception("Database error: " + msgError);
            }

            return dt.ConvertTo<InfoGroupMembers>().ToList();
        }
        public GroupMemberModel GetCountMember(int group_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_count_group_members",
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (dt.Rows.Count == 0)
                {
                    return null;
                }

                var request = dt.ConvertTo<GroupMemberModel>().FirstOrDefault();
                return request;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in getRequest method: " + ex.Message);
                throw;
            }
        }

    }
}
