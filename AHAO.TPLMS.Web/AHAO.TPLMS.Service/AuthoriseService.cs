using System;
using AHAO.TPLMS.Contract;
using AHAO.TPLMS.Core;
using AHAO.TPLMS.Entitys;
using AHAO.TPLMS.Repository;
using System.Collections.Generic;
using System.Text;
using AHAO.TPLMS.Service;
using System.Runtime.InteropServices.WindowsRuntime;

namespace AHAO.TPLMS.Service
{
    /// <summary>
    /// 登录服务
    /// <para>用户授权服务</para>
    /// </summary>
    public class AuthoriseService
    {
        private IUserRepository _loginUser;
        private ModuleService _moduleSvr;

        private IRoleRepository _roleMgr;
        private User _user;
        private List<Module> _modules;   //用户可访问的模块

        private List<Role> _roles;
        public AuthoriseService(IUserRepository login, ModuleService msvr, IRoleRepository role)
        {
            _loginUser = login;
            _moduleSvr = msvr;

            _roleMgr = role;
        }

        public List<Module> Modules
        {
            get
            {
                return _modules;
            }
        }

        public List<Role> Role
        {
            get
            {
                return _roles;
            }
        }

        public User User
        {
            get { return _user; }
        }

        public bool Check(string userName, string password)
        {
            var _user = _loginUser.FindSingle(u => u.UserId == userName);
            if (_user == null)
            {
                return false;
            }

            bool flag = CheckPassword(_user, password);
            return flag;

        }

        public bool CheckPassword(User u, string password)
        {
            if (u.Password == password)
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// 设置开发者账号
        /// </summary>
        public void SetSysUser()
        {
            _user = new User
            {
                UserId = "System"
            };
        }

        public bool IsRole(string roleName)
        {
            if (Role.Exists(r => r.Name == roleName))
            {
                return true;
            }
            return false;
        }

        public void GetUserAccessed(string name)
        {
            if (name == "System")
            {
                _modules = _moduleSvr.GetModules(1, 1000);
            }
            else
            {
                _user = _loginUser.FindSingle(u => u.UserId == name);
                if (_user != null)
                {
                    _modules = _moduleSvr.LoadForUser(_user.Id);
                }
                //用户角色
                _roles = _roleMgr.GetRoles(name).ToList();
            }
        }



    }
}
