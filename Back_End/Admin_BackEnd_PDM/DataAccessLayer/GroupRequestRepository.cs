using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public class GroupRequestRepository : IGroupRequestRepository
    {
        private IDatabaseHelper _dbHelper;

        public GroupRequestRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;

        }
        public bool GroupRequest(GroupRequestModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_group_request_create",
                    "@user_id", model.user_id,
                    "@group_id", model.group_id);
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
        public List<GroupRequestModel> GetListRequest(int group_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_list_request",
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<GroupRequestModel>().ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in Create method: " + ex.Message);
                throw;
            }
        }
        public bool Delete(int request_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_grouprequest_delete",
                    "@request_id", request_id);

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
        public GroupRequestModel getRequest(int request_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_request_by_id",
                    "@request_id", request_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (dt.Rows.Count == 0)
                {
                    return null;
                }

                var request = dt.ConvertTo<GroupRequestModel>().FirstOrDefault();
                return request;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in getRequest method: " + ex.Message);
                throw;
            }
        }
        public bool CheckSpam(int user_id, int group_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_check_group_request",
                    "@user_id", user_id,
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
                Console.WriteLine("Error in getRequest method: " + ex.Message);
                throw;
            }
        }
        public GroupRequestModel GetCountRequest(int group_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_count_group_requests",
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (dt.Rows.Count == 0)
                {
                    return null;
                }

                var request = dt.ConvertTo<GroupRequestModel>().FirstOrDefault();
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
