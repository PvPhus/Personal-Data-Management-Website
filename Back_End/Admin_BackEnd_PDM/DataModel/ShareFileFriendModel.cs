using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataModel
{
    public class ShareFileFriendModel
    {
        public int file_id { get; set; }
        public int user_id { get; set; }
        public List<int> receiver_id { get; set; }
        public string? content { get; set; }
    }
}
