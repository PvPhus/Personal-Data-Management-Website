using System;
using System.Collections.Generic;

namespace DataModel;

public partial class ActivityLogModel
{
    public int log_id { get; set; }

    public int? user_id { get; set; }
    public string? avatar_url { get; set; }
    public string? username { get; set; }
    public string? description { get; set; }

    public DateTime? time_log { get; set; }

    public DateTime? time_out { get; set; }

    public virtual UserModel? User { get; set; }
}
