using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupRequestModel
{
    public int request_id { get; set; }
    public int user_id { get; set; }
    public int group_id { get; set; }
    public string? username {  get; set; }
    public string? avatar_url { get; set; }
    public DateTime? request_date { get; set; }
    public int? total_requests { get; set; }
    public virtual ICollection<UserModel> Users { get; set; } = new List<UserModel>();
    public virtual ICollection<GroupModel> Groups { get; set; } = new List<GroupModel>();
}
