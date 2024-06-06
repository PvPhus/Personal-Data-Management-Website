using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataModel 
{ 
    public class PermissionModel
    {
        public int permission_id { get; set; }

        public int? user_id { get; set; }

        public bool? can_read { get; set; }

        public bool? can_download { get; set; }

        public bool? can_share { get; set; }

        public bool? can_delete { get; set; }
    }
}

