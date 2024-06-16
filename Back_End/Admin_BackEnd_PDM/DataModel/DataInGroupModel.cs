using System;
using System.Collections.Generic;

namespace DataModel;

public partial class DataInGroupModel
{
    public int file_id { get; set; }
    public string filename_old { get; set; }
    public string filename_new { get; set; }
    public float file_size { get; set; }
    public string file_type { get; set; }
    public DateTime file_upload_date  { get; set; }
    public DateTime last_modified { get; set; }
    public string file_path { get; set; }
    public DateTime groupdata_upload_date { get; set; }
    public string username { get; set; }
    public int group_id { get; set; }
    public string group_name { get; set; }
}
