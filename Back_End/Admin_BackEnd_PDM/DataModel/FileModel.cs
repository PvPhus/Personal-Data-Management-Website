using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FileModel
{
    public int file_id { get; set; }

    public int user_id { get; set; }

    public string filename_old { get; set; }
    public string filename_new { get; set; }

    public double file_size { get; set; }

    public string file_type { get; set; }

    public DateTime? upload_date { get; set; }

    public DateTime? last_modified { get; set; }

    public string file_path { get; set; }
}
