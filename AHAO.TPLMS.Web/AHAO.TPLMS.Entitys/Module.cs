using System;
using System.Collections.Generic;
using System.Text;

namespace AHAO.TPLMS.Entitys
{
    public class Module
    {
        public List<Module> GetModules(int pageindex, int pagesize = 1000)
        {
            //模块列表

            var users = _moduleMgr.LoadModules(pageindex, pagesize);

            List<Module> list = new List<Module>();
            foreach (var item in users)
            {
                list.Add(item);
            }

            return list;
        }
    }
}
