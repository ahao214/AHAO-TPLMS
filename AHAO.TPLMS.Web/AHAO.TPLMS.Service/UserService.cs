using System;
using System.Collections.Generic;
using System.Text;
using AHAO.TPLMS.Contract;
using AHAO.TPLMS.Entitys;
using System.Linq.Expressions;
using System.Runtime.InteropServices.WindowsRuntime;

namespace AHAO.TPLMS.Service
{
    public class UserService
    {
        private IUserRepository _UserMgr;
        private User _user;
        private List<User> _users;  //用户列表

        public UserService(IUserRepository userMgr)
        {
            _UserMgr = userMgr;
        }

        public dynamic LoadUser(int pageIndex,int pageSize)
        {
            //查询用户表
            Expression<Func<User, bool>> exp = u => u.Id > 0;
            var users = _UserMgr.Find(pageIndex, pageSize, exp);
            int total = _UserMgr.GetCount(exp);
            List<User> list = new List<User>();

            foreach(var item in users  )
            {
                list.Add(item);
            }

            return new
            {
                total = total,
                rows = list
            };
        }

        #region 更新用户

        public string Save(User u)
        {
            try
            {                
                _UserMgr.Update(u);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

        #endregion

        #region 添加用户

        public string Add(User user )
        {
            try
            {                
                _UserMgr.Add(user);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

        #endregion

        #region 删除用户

        public string Delete(User user)
        {
            try
            {
                _UserMgr.Delete(user);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

        #endregion 

    }
}
