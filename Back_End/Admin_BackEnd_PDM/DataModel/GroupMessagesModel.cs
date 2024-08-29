using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupMessagesModel
{
    public int message_id { get; set; }
    public int? group_id { get; set; }
    public int? sender_id { get; set; }
    public string? avatar_url { get; set; }
    public string? username { get; set; }
    public string? content { get; set; }
    public DateTime? timestamp { get; set; }
}
