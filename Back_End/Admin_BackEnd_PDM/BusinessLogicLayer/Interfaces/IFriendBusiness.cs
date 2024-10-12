using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IFriendBusiness
    {
        bool CreateMessages(FriendMessagesModel model);
        List<FriendMessagesModel> GetDataFriendChat(int sender_id, int receiver_id);
        bool ShareFriendListData(ShareFriendListDataModel model);
    }
}
