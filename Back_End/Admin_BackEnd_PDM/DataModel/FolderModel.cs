using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FolderModel
{
    public int FolderId { get; set; }

    public int? UserId { get; set; }

    public string? FolderName { get; set; }

    public int? ParentFolderId { get; set; }

    public DateTime? CreationDate { get; set; }

    public virtual ICollection<FolderModel> InverseParentFolder { get; set; } = new List<FolderModel>();

    public virtual FolderModel? ParentFolder { get; set; }

    public virtual UserModel? User { get; set; }

    public virtual ICollection<FileModel> Files { get; set; } = new List<FileModel>();
}
