using System;
using System.Collections.Generic;

namespace DataModel;

public partial class FileModel
{
    public int FileId { get; set; }

    public int? UserId { get; set; }

    public string? Filename { get; set; }

    public double? FileSize { get; set; }

    public string? FileType { get; set; }

    public DateTime? UploadDate { get; set; }

    public DateTime? LastModified { get; set; }

    public string? FilePath { get; set; }

    public virtual ICollection<FileVersion> FileVersions { get; set; } = new List<FileVersion>();

    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();

    public virtual UserModel? User { get; set; }

    public virtual ICollection<Folder> Folders { get; set; } = new List<Folder>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
