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
    public class FriendRequestBusiness : IFriendRequestBusiness
    {
        private IFriendRequestRepository _res;

        public FriendRequestBusiness(IFriendRequestRepository res)
        {
            _res = res;
        }
        public bool FriendRequest(FriendRequestModel model)
        {
            return _res.FriendRequest(model);
        }
        public bool FriendAccept(int request_id)
        {
            return _res.FriendAccept(request_id);
        }
        public bool FriendBlock(int request_id)
        {
            return _res.FriendBlock(request_id);
        }
        public bool FriendDeclined(int request_id)
        {
            return _res.FriendDeclined(request_id);
        }
        public bool FriendDestroy(int request_id)
        {
            return _res.FriendDestroy(request_id);
        }
    }
}
