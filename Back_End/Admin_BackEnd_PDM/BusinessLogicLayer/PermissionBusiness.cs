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
    public class PermissionBusiness:IPermissionBusiness
    {
        private IPermissionRepository _res;

        public PermissionBusiness(IPermissionRepository res)
        {
            _res = res;
        }
        public bool Update(PermissionModel model)
        {
            return _res.Update(model);
        }
        public PermissionModel GetPermissionUser(int user_id, int group_id)
        {
            return _res.GetPermissionUser(user_id, group_id);
        }
    }
}
