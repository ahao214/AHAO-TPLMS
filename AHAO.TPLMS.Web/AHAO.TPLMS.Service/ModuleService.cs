using AHAO.TPLMS.Contract;
using AHAO.TPLMS.Entitys;
using NPOI.SS.Formula.Functions;
using NPOI.SS.Util;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace AHAO.TPLMS.Service
{
    public class ModuleService
    {
        private IModuleRepository _moduleMgr;

        private Module _module;
        private List<Module> _modules;   //模块列表       

        public ModuleService(IModuleRepository userMgr)
        {
            _moduleMgr = userMgr;
        }

        public dynamic LoadModules(int pageindex, int pagesize)
        {
            //查询模块表
            Expression<Func<Module, bool>> exp = u => u.Id > 0;
            var users = _moduleMgr.Find(pageindex, pagesize, exp);
            int total = _moduleMgr.GetCount(exp);
            List<Module> lst = new List<Module>();
            foreach (var item in users)
            {
                lst.Add(item);
            }

            return new
            {
                total = total,
                rows = lst
            };
        }


        public List <Module> GetModules (int pageindex,int pagesize)
        {
            //查询模块表
            var users = _moduleMgr.LoadModules(1, 100);
            List<Module> lst = new List<Module>();
            foreach(var item in users )
            {
                lst.Add(item);
            }
            return lst;
        }


        public string Save(Module m)
        {
            try
            {
                //修改模块信息
                _moduleMgr.Update(m);
            }
            catch ( Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

        public string Add (Module m )
        {
            try
            {
                //添加模块信息
                _moduleMgr.Add(m);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

        public string Delete (Module m )
        {
            try
            {
                //删除模块信息
                _moduleMgr.Delete(m);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return "OK";
        }

    }
}
