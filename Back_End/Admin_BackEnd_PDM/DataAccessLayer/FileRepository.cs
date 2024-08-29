using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.Identity.Client;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.InteropServices;

namespace DataAccessLayer
{
    public class FileRepository : IFileRepository
    {
        private IDatabaseHelper _dbHelper;

        public FileRepository(IDatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public List<FileModel> GetAllFile()
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_files");
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<FileModel> GetAllFilesByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_all_file_by_user",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<FileModel> GetFilesByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_file_files",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<FileModel> SearchFile(int user_id, string filename_new)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_file_search",
                    "@user_id", user_id,
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
        public List<FileModel> GetVideosByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_video_files",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<FileModel> GetImagesByUserId(int user_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_image_files",
                    "@user_id", user_id);

                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                return dt.ConvertTo<FileModel>().ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool Create(FileModel model)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_file_create",
                    "@user_id", model.user_id,
                    "@filename_old", model.filename_old,
                    "@filename_new", model.filename_new,
                    "@file_size", model.file_size,
                    "@file_type", model.file_type,                    
                    "@upload_date", model.upload_date,                 
                    "@last_modified", model.last_modified,
                    "@file_path", model.file_path);

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
       
        public bool UpdateName(int file_id, string filename_new)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_update_filename_new",
                    "@file_id", file_id,
                    "@new_filename", filename_new);
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

     

        //Xóa file
        public bool Delete(int file_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_file_delete",
                    "@file_id", file_id);

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
        public bool DeleteFileGroup(int file_id, int group_id)
        {
            try
            {
                string msgError = "";
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_groupdata_delete",
                    "@file_id", file_id,
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
        public FileModel GetFileByfile_id(int file_id)
        {
            string msgError = "";
            try
            {
                var dt = _dbHelper.ExecuteSProcedureReturnDataTable(out msgError, "sp_get_file_by_fileId",
                    "@fileId", file_id);
                if (!string.IsNullOrEmpty(msgError))
                    throw new Exception(msgError);

                if (dt.Rows.Count > 0)
                {
                    return dt.AsEnumerable().Select(row => new FileModel
                    {
                        file_id = row.Field<int>("file_id"),
                        user_id = row.Field<int>("user_id"),
                        filename_old = row.Field<string>("filename_old"),
                        filename_new = row.Field<string>("filename_new"),
                        file_size = row.Field<double>("file_size"),
                        file_type = row.Field<string>("file_type"),
                        upload_date = row.Field<DateTime?>("upload_date"),                   
                        last_modified = row.Field<DateTime?>("last_modified"),
                        file_path = row.Field<string>("file_path")
                    }).FirstOrDefault();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool ShareFile(ShareFileModel model)
        {
            try
            {
                string msgError = "";
                var groupIds = string.Join(",", model.group_id); // Convert list of group_id to comma-separated string
                var result = _dbHelper.ExecuteScalarSProcedureWithTransaction(out msgError, "sp_share_file_with_groups",
                    "@file_id", model.file_id,
                    "@user_id", model.user_id,
                    "@group_ids", groupIds);

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
    }
}
