using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupDataModel
{
    public int? file_id { get; set; }
    public int? group_id { get; set; }
    public int? user_id { get; set; }
    public DateTime? upload_date { get; set; }
    public string? filename_new { get; set; }
    public string? file_type { get; set; }
    public float? file_size { get; set; }
    public string? username { get; set; }
    public string? avatar_url { get; set; }
    public virtual FileModel? File { get; set; }
    public virtual GroupModel? Group { get; set; }
    public virtual UserModel? User { get; set; }
}
