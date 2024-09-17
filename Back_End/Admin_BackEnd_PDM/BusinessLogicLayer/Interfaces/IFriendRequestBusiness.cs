using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IFriendRequestBusiness
    {
        List<FriendRequestModel> GetAllRequestFriend(int user_id);
        bool FriendRequest(FriendRequestModel model);
        bool FriendAccept(int request_id);
        bool FriendBlock(int request_id);
        bool FriendDeclined(int request_id);
        bool FriendDestroy(int request_id);
    }
}
