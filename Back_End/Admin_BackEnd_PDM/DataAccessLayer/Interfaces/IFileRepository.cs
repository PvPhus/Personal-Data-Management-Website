using DataModel;
using System.Collections.Generic;

namespace DataAccessLayer.Interfaces
{
    public partial interface IFileRepository
    {
        List<FileModel> GetAllFile();
        List<FileModel> GetAllFilesByUserId(int user_id);
        List<FileModel> GetFilesByUserId(int user_id);
        List<FileModel> GetVideosByUserId(int user_id);
        List<FileModel> GetImagesByUserId(int user_id);
        List<FileModel> SearchFile(int user_id, string filename_new);
        bool Create(FileModel model);
        bool UpdateName(int file_id, string filename_new);
        bool Delete(int file_id);
        FileModel GetFileByfile_id(int file_id);
        bool DeleteFileGroup(int file_id, int group_id);
        bool ShareFile(ShareFileModel model);
     
            
    }
}
