using DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public partial interface IUserBusiness
    {
        UserModel Login(string email, string password);
        bool GetUserByEmail(string email);
        UserModel RegisterUser(string username, string email, string password, string role, string avatarUrl);
        UserModel GetUserByUserId(int user_id);


    }
}
