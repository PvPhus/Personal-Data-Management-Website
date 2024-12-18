﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataModel;

namespace DataAccessLayer.Interfaces
{
    public partial interface IUserRepository
    {
        bool GetUserByEmail(string email);
        UserModel Login(string email, string password);
        UserModel RegisterUser(string username, string email, string password, string role, string avatar_url);
        UserModel GetUserByUserId(int user_id);
        bool UpdateInfo(int user_id, string username, string avatar_url);
        bool LogOut(ActivityLogModel model);
        List<ActivityLogModel> GetAll();
        List<UserModel> GetAllUser(int user_id);
    }
}
