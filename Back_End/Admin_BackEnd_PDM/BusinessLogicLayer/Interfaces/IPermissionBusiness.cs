﻿using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IPermissionBusiness
    {
        bool Update(PermissionModel model);
        PermissionModel GetPermissionUser(int user_id, int group_id);
    }
}
