using BusinessLogicLayer.Interfaces;
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
        public CountModel GetCount(int group_id)
        {
            return _res.GetCount(group_id);
        }
    }
}
