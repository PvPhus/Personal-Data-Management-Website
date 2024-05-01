using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Permission
{
    public int PermissionId { get; set; }

    public int? UserId { get; set; }

    public int? FileId { get; set; }

    public bool? CanRead { get; set; }

    public bool? CanWrite { get; set; }

    public bool? CanShare { get; set; }

    public virtual FileModel? File { get; set; }

    public virtual ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();

    public virtual UserModel? User { get; set; }
}
