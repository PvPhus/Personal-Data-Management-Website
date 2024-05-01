using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Group
{
    public int GroupId { get; set; }

    public string? GroupName { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? TotalMembers { get; set; }

    public virtual ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();

    public virtual UserModel? User { get; set; }
}
