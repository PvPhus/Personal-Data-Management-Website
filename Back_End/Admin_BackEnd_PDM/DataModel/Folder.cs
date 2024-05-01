using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Folder
{
    public int FolderId { get; set; }

    public int? UserId { get; set; }

    public string? FolderName { get; set; }

    public int? ParentFolderId { get; set; }

    public DateTime? CreationDate { get; set; }

    public virtual ICollection<Folder> InverseParentFolder { get; set; } = new List<Folder>();

    public virtual Folder? ParentFolder { get; set; }

    public virtual UserModel? User { get; set; }

    public virtual ICollection<FileModel> Files { get; set; } = new List<FileModel>();
}
