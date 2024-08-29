using BusinessLogicLayer.Interfaces;
using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer
{
    public class GroupMemberBusiness:IGroupMemberBusiness
    {
        private IGroupMemberRepository _res;
        public GroupMemberBusiness(IGroupMemberRepository res)
        {
            _res = res;
        }
        public bool Create(GroupMemberModel model)
        {
            return _res.Create(model);
        }
        public bool Delete(int group_id, int user_id)
        {
            return _res.Delete(group_id, user_id);
        }
        public List<InfoGroupMembers> GetGroupMembers(int group_id)
        {
            return _res.GetGroupMembers(group_id);
        }
  
    }
}
