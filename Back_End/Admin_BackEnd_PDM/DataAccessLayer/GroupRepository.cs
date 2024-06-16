using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class GroupRepository:IGroupRepository
    {
        private IDatabaseHelper _dbHelper;

        public GroupRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public List<GroupModel> GetAllListGroups()
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_list_group");
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<DataInGroupModel> GetAllDataInGroup(int group_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_data_in_group",
                    "@group_id", group_id);
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<DataInGroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<GroupModel> GetAllGroups(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_groups",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool Create(GroupModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_group_create",
                    "@group_image", model.group_image,
                    "@group_name", model.group_name,
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
       
        public List<GroupModel> GetGroupsByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_groups_by_userId",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<GroupModel> Get3Group(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_3_groups",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool Delete(int group_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_group_delete",
                    "@group_id", group_id);

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
        public List<GroupDataModel> GetDataGroup(int user_id, int group_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_group_data_by_userId_groupId",
                    "@user_id", user_id,
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupDataModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public CountModel GetCount(int group_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_total_requests_members",
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (dt.Rows.Count == 0)
                {
                    return null;
                }

                var request = dt.ConvertTo<CountModel>().FirstOrDefault();
                return request;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in getRequest method: " + ex.Message);
                throw;
            }
        }
        public List<GroupModel> SearchGroup(string group_name, int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_group_search",
                    "@group_name", group_name,
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool CheckAdminGroup(int group_id, int user_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_check_admin_group",
                    "@group_id", group_id,
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                // Convert the result to a boolean (assuming the stored procedure returns 1 or 0)
                return Convert.ToBoolean(result);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và ném lại ngoại lệ để cho phép lớp gọi xử lý ngoại lệ
                Console.WriteLine("Error in Delete method: " + ex.Message);
                throw;
            }
        }
        public List<FileModel> SearchDataGroup(int group_id, string filename_new)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_data_group_search",             
                    "@group_id", group_id,
                    "@filename_new", filename_new);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
