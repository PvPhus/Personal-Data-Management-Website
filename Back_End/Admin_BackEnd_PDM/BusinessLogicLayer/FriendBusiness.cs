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
    }
}
