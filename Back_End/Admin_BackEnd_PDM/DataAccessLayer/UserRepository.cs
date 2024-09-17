using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataModel;
using DataAccessLayer.Interfaces;
using System.Data;

namespace DataAccessLayer
{
    public class UserRepository : IUserRepository
    {
        private IDatabaseHelper _dbHelper;

        public UserRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public UserModel Login(string email, string password)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_login",
                     "@inputEmail", email,
                     "@inputPassword", password);
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);
                return dt.ConvertTo<UserModel>().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool GetUserByEmail(string email)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_user_by_email",
                     "@email", email);
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);
                return dt.Rows.Count > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool LogOut(ActivityLogModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_logout",
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
        public UserModel RegisterUser(string username, string email, string password, string role, string avatar_url)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_register",
                     "@inputUsername", username,
                     "@inputEmail", email,
                     "@inputPassword", password,
                     "@inputRole", role,
                     "@inputAvatarUrl", avatar_url
                     );

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception(msgError);
                }

                // Chuyển đổi DataTable thành UserModel
                return dt.ConvertTo<UserModel>().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public UserModel GetUserByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_user_by_userId",
                     "@user_id", user_id
                     );
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                // Chuyển đổi DataTable thành UserModel
                var user = dt.ConvertTo<UserModel>().FirstOrDefault();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetUserByUserId method: " + ex.Message);
            }
        }
        public List<UserModel> GetAllUser(int user_id) 
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_users",
                    "@user_id", user_id);
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<UserModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool UpdateInfo(int user_id, string username, string avatar_url)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_update_user_info",
                    "@user_id", user_id,
                    "@new_username", username,
                    "@new_avatar_url", avatar_url);
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
        public List<ActivityLogModel> GetAll()
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_activitylog");
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<ActivityLogModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

