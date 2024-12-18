﻿using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class PermissionRepository:IPermissionRepository
    {
        private IDatabaseHelper _dbHelper;
        public PermissionRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public bool Update(PermissionModel model)
        {
            try
            {
                
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_permission_update",
                    "@permission_id", model.permission_id,
                    "@can_read", model.can_read,
                    "@can_download", model.can_download,
                    "@can_share", model.can_share,
                    "@can_delete", model.can_delete);
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
        public PermissionModel GetPermissionUser(int user_id, int group_id)
        {
            try
            {
                string msgError = "";
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_permission_user_group",
                    "@user_id", user_id,
                    "@group_id", group_id);

                if (!string.IsNullOrEmpty(msgError))
                {
                    throw new Exception("Database error: " + msgError);
                }

                if (dt.Rows.Count == 0)
                {
                    return null;
                }

                var request = dt.ConvertTo<PermissionModel>().FirstOrDefault();
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
