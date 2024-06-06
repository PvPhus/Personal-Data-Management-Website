using System;
using System.Collections.Generic;

namespace DataModel;

public partial class UserModel
{
    public int user_id { get; set; }

    public string? username { get; set; }

    public string? email { get; set; }

    public string? password { get; set; }

    public string? role { get; set; }

    public string? avatar_url { get; set; }

    public DateTime? join_date { get; set; }

    public string Token { get; set; }

    public virtual ICollection<ActivityLogModel> ActivityLogs { get; set; } = new List<ActivityLogModel>();

    public virtual ICollection<FileModel> Files { get; set; } = new List<FileModel>();

    public virtual ICollection<FolderModel> Folders { get; set; } = new List<FolderModel>();

    public virtual ICollection<GroupMemberModel> GroupMembers { get; set; } = new List<GroupMemberModel>();

    public virtual ICollection<GroupModel> Groups { get; set; } = new List<GroupModel>();

    public virtual ICollection<PermissionModel> Permissions { get; set; } = new List<PermissionModel>();
}
