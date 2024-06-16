using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataModel
{
    public class InfoGroupMembers
    {
        public int user_id { get; set; }
        public string avatar_url { get; set; }
        public string username { get; set; }
        public int group_id { get; set; }
        public DateTime join_date { get; set; }
        public int permission_id { get; set; }
        public bool can_read { get; set; }
        public bool can_download { get; set; }
        public bool can_share { get; set; }
        public bool can_delete { get; set; }
    }
}
