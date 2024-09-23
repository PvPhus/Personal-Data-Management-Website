using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FriendMessagesModel
{
    public int sender_id { get; set; }
    public int receiver_id { get; set; }
    public string? username { get; set; }
    public string? email { get; set; }
    public string? avatar_url { get; set; }
    public string? status { get; set; }
    public DateTime? request_date { get; set; }

    public int? message_id { get; set; }
    public string? content { get; set; }
    public DateTime? timestamp { get; set; }
    public int? file_id {  get; set; }
    public string? filename_new { get; set; }
    public string? filename_old { get; set; }
    public float? file_size { get; set; }
    public string? file_type { get; set; }   
}
