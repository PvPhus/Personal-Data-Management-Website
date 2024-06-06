using System;
using System.Collections.Generic;

namespace DataModel;

public partial class ActivityLogModel
{
    public int LogId { get; set; }

    public int? UserId { get; set; }

    public string? Description { get; set; }

    public DateTime? TimeLog { get; set; }

    public DateTime? TimeOut { get; set; }

    public virtual UserModel? User { get; set; }
}
