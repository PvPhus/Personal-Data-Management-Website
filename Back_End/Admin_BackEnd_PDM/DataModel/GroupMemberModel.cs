using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupMemberModel
{
    public int group_id { get; set; }

    public int user_id { get; set; }

    public int? permission_id { get; set; }
    public DateTime? join_date { get; set; }
    public int? total_members { get; set; }
}
