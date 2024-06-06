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
    }
}
