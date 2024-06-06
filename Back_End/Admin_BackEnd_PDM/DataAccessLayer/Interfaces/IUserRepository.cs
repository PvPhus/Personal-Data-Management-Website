using System;
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
    }
}
