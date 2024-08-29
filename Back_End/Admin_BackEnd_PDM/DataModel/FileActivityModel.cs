using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FileActivityModel
{
    public int activity_id { get; set; }
    public int? file_id { get; set; }
    public int? user_id { get; set; }
    public string? action { get; set; }
    public DateTime? timestamp { get; set; }
}
