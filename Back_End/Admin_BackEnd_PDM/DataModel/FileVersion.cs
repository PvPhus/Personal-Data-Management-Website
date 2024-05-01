using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FileVersion
{
    public int VersionId { get; set; }

    public int? FileId { get; set; }

    public int? VersionNumber { get; set; }

    public DateTime? UploadDate { get; set; }

    public string? FilePath { get; set; }

    public virtual FileModel? File { get; set; }
}
