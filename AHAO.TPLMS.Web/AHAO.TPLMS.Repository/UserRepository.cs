using System;
using System.Collections.Generic;
using System.Linq;
using AHAO.TPLMS.Contract;
using AHAO.TPLMS.DataBase;
using AHAO.TPLMS.Entitys;


namespace AHAO.TPLMS.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(TPLMSDbContext m_Context) : base(m_Context)
        {

        }

        public IEnumerable<User> LoadUsers(int pageindex, int pagesize)
        {
            return Context.User.OrderBy(u => u.Id).Skip((pageindex - 1) * pagesize).Take(pagesize);
        }

        public User GetUser(string userName)
        {
            return FindSingle(u => u.UserId == userName);
        }

        public bool Delete(string ids)
        {
            var idList = ids.Split(',');
            var userList = Context.User.Where(u => idList.Contains(u.Id.ToString()));
            bool result = true;
            Delete(userList.ToArray());
            return result;
        }
    }
}
