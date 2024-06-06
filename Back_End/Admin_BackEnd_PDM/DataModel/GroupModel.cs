using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupModel
{
    public int group_id { get; set; }

    public string? group_image { get; set; }
    public string? group_name { get; set; }

    public int? user_id { get; set; }

    public DateTime? created_date { get; set; }

    public int? total_members { get; set; }

    public virtual ICollection<GroupMemberModel> GroupMembers { get; set; } = new List<GroupMemberModel>();

    public virtual UserModel? User { get; set; }
}
