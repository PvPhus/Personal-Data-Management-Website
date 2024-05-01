using System;
using System.Collections.Generic;

namespace DataModel;

public partial class GroupDatum
{
    public int? FileId { get; set; }

    public int? GroupId { get; set; }

    public int? UserId { get; set; }

    public DateTime? UploadDate { get; set; }

    public virtual FileModel? File { get; set; }

    public virtual Group? Group { get; set; }

    public virtual UserModel? User { get; set; }
}
