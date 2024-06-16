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
    public class GroupRequestBusiness : IGroupRequestBusiness
    {
        private readonly IGroupRequestRepository _res;
        public GroupRequestBusiness(IGroupRequestRepository res)
        {
            _res = res ?? throw new ArgumentNullException(nameof(res));
        }
        public bool GroupRequest(GroupRequestModel model)
        {
            return _res.GroupRequest(model);
        }
        public List<GroupRequestModel> GetListRequest(int group_id)
        {
            return _res.GetListRequest(group_id);
        }
        public bool Delete(int request_id)
        {
            return _res.Delete(request_id);
        }
        public GroupRequestModel getRequest(int request_id)
        {
            return _res.getRequest(request_id);
        }
        public bool CheckSpam(int user_id, int group_id)
        {
            return _res.CheckSpam(user_id, group_id);
        }
        public GroupRequestModel GetCountRequest(int group_id)
        {
            return _res.GetCountRequest(group_id);
        }
    }
}
