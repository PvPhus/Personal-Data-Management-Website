using BusinessLogicLayer.Interfaces;
using DataAccessLayer;
using DataAccessLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer
{
    public class GroupBusiness : IGroupBusiness
    {
        private IGroupRepository _res;

        public GroupBusiness(IGroupRepository res)
        {
            _res = res;
        }
        public List<GroupModel> GetAllListGroups()
        {
            return _res.GetAllListGroups();
        }
        public List<DataInGroupModel> GetAllDataInGroup(int group_id)
        {
            return _res.GetAllDataInGroup(group_id);
        }
        public List<GroupModel> GetAllGroups(int user_id)
        {
            return _res.GetAllGroups(user_id);
        }
        public bool Create(GroupModel model)
        {
            return _res.Create(model);
        }
        public List<GroupModel> GetGroupsByUserId(int user_id)
        {
            return _res.GetGroupsByUserId(user_id);
        }
        public List<GroupModel> Get3Group(int user_id)
        {
            return _res.Get3Group(user_id);
        }
        public bool Delete(int group_id)
        {
            return _res.Delete(group_id);
        }
        public List<GroupDataModel> GetDataGroup(int user_id, int group_id)
        {
            return _res.GetDataGroup(user_id, group_id);
        }
    
        public List<GroupModel> SearchGroup(string group_name, int user_id)
        {
            return _res.SearchGroup(group_name, user_id);
        }
        public bool CheckAdminGroup(int group_id, int user_id)
        {
            return _res.CheckAdminGroup(group_id, user_id);
        }
        public List<FileModel> SearchDataGroup(int group_id, string filename_new)
        {
            return _res.SearchDataGroup(group_id, filename_new);
        }
        public List<GroupMessagesModel> MessagesGroup(int group_id)
        {
            return _res.MessagesGroup(group_id);
        }
        public bool CreateMessages(GroupMessagesModel model)
        {
            return _res.CreateMessages(model);
        }
    }
}
