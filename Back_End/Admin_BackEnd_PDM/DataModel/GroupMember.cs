using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupMember
{
    public int GroupId { get; set; }

    public int UserId { get; set; }

    public int? PermissionId { get; set; }

    public virtual Group Group { get; set; } = null!;

    public virtual Permission? Permission { get; set; }

    public virtual UserModel User { get; set; } = null!;
}
