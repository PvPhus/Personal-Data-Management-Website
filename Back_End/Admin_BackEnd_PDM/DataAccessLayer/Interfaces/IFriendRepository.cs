using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Interfaces
{
    public partial interface IFriendRepository
    {
        bool CreateMessages(FriendMessagesModel model);
        List<FriendMessagesModel> GetDataFriendChat(int sender_id, int receiver_id);
        bool ShareFriendListData(ShareFriendListDataModel model);
        bool DeleteDataFriend(int message_id);
        bool FriendBlockMessage(int sender_id, int receiver_id);
        bool DeleteConversation(int sender_id, int receiver_id);    
    }
}
