using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using System.Collections.Generic;

namespace BusinessLogicLayer
{
    public class FileBusiness : IFileBusiness
    {
        private IFileRepository _res;

        public FileBusiness(IFileRepository res)
        {
            _res = res;
        }
        public List<FileModel> GetAllFile()
        {
            return _res.GetAllFile();
        }
        public List<FileModel> GetFilesByUserId(int user_id)
        {
            return _res.GetFilesByUserId(user_id);
        }
        public List<FileModel> GetVideosByUserId(int user_id)
        {
            return _res.GetVideosByUserId(user_id);
        }
        public List<FileModel> GetImagesByUserId(int user_id)
        {
            return _res.GetImagesByUserId(user_id);
        }
        public List<FileModel> SearchFile(int user_id, string filename_new)
        {
            return _res.SearchFile(user_id, filename_new);
        }
        public bool Create(FileModel model)
        {
            return _res.Create(model);
        }
        public bool Update(FileModel model)
        {
            return _res.Update(model);
        }
        public bool Delete(int file_id)
        {
            return _res.Delete(file_id);
        }
        public FileModel GetFileByFileId(int file_id)
        {
            return _res.GetFileByfile_id(file_id);
        }
        public bool ShareFile(ShareFileModel model)
        {
            return _res.ShareFile(model);
        }
        public bool UpdateName(int file_id, string filename_new)
        {
            return _res.UpdateName(file_id, filename_new);
        }
    }
}
