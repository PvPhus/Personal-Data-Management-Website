using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataModel
{
    public class ShareFriendListDataModel
    {
        public int sender_id { get; set; }
        
       
        public int receiver_id { get; set; }
        public string? content { get; set; }
        public List<int> file_id { get; set; }
    }
}
