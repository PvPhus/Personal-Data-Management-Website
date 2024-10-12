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
    public class FriendBusiness:IFriendBusiness
    {
        private IFriendRepository _res;

        public FriendBusiness(IFriendRepository res)
        {
            _res = res;
        }
        public bool CreateMessages(FriendMessagesModel model)
        {
            return _res.CreateMessages(model);
        }
        public List<FriendMessagesModel> GetDataFriendChat(int sender_id, int receiver_id)
        {
            return _res.GetDataFriendChat(sender_id, receiver_id);
        }
        public bool ShareFriendListData(ShareFriendListDataModel model)
        {
            return _res.ShareFriendListData(model);
        }
    }
}
