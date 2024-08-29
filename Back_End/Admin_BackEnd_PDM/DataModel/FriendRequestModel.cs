using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FriendRequestModel
{
    public int request_id { get; set; }
    public int? sender_id { get; set; }
    public int? receiver_id { get; set; }
    public string? status { get; set; }
    public DateTime? request_date { get; set; }
}
