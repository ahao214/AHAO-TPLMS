using AHAO.TPLMS.Entitys;
using System;
using System.Collections.Generic;
using System.Text;


namespace AHAO.TPLMS.Contract
{
   public interface IUserRepository:IRepository<User>
    {
        IEnumerable<User> LoadUsers(int pageindex, int pagesize);
        User GetUser(string userName);
        bool Delete(string ids);
    }
}
