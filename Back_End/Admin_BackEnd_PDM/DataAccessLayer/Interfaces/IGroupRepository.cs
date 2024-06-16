using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Interfaces
{
    public partial interface IGroupRepository
    {
        List<DataInGroupModel> GetAllDataInGroup(int group_id);
        List<GroupModel> GetAllListGroups();
        List<GroupModel> GetAllGroups(int user_id);
        List<GroupModel> GetGroupsByUserId(int user_id);
        bool Create(GroupModel model);
        List<GroupModel> Get3Group(int user_id);
        bool Delete(int group_id);
        List<GroupDataModel> GetDataGroup(int user_id, int group_id);
        CountModel GetCount(int group_id);
        List<GroupModel> SearchGroup(string group_name, int user_id);
        bool CheckAdminGroup(int group_id, int user_id);
        List<FileModel> SearchDataGroup(int group_id, string filename_new);
    }
}
