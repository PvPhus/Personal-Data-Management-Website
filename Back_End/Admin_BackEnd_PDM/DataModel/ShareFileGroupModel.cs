using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataModel
{
    public class ShareFileGroupModel
    {
        public int file_id { get; set; }
        public int user_id { get; set; }
        public List<int> group_id { get; set; }
    }
}
