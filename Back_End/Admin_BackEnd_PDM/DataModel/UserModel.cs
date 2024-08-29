using System;
using System.Collections.Generic;

namespace DataModel;

public partial class UserModel
{
    public int user_id { get; set; }

    public string? username { get; set; }

    public string? email { get; set; }

    public string? password { get; set; }

    public string? role { get; set; }

    public string? avatar_url { get; set; }

    public DateTime? join_date { get; set; }

    public string Token { get; set; }
}
