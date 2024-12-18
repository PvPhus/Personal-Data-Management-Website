﻿using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IGroupMemberRepository
    {
        bool Create(GroupMemberModel model);
        bool Delete(int group_id, int user_id);   
        List<InfoGroupMembers> GetGroupMembers(int group_id);

    }
}
