﻿using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Tag
{
    public int TagId { get; set; }

    public string? TagName { get; set; }

    public virtual ICollection<FileModel> Files { get; set; } = new List<FileModel>();
}
