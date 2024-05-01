using System;
using System.Collections.Generic;

namespace DataModel;

public partial class UserModel
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Role { get; set; }

    public string? AvatarUrl { get; set; }

    public DateTime? JoinDate { get; set; }

    public string Token { get; set; }

    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();

    public virtual ICollection<FileModel> Files { get; set; } = new List<FileModel>();

    public virtual ICollection<Folder> Folders { get; set; } = new List<Folder>();

    public virtual ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();

    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();

    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();
}
