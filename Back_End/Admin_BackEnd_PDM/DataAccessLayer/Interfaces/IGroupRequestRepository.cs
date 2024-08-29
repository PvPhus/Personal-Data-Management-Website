using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IGroupRequestRepository
    {
        List<GroupRequestModel> GetListRequest(int group_id);
        bool GroupRequest(GroupRequestModel model);
        bool Delete(int request_id);
        GroupRequestModel getRequest(int request_id);

        bool CheckSpam(int user_id, int group_id);
     
    }
}
