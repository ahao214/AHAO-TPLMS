using AHAO.TPLMS.Entitys;
using System;
using System.Collections.Generic;
using System.Text;

namespace AHAO.TPLMS.Contract
{
    public interface IModuleRepository : IRepository<Module>
    {
        IEnumerable<Module> LoadModules(int pageindex, int pagesize);
        IEnumerable<Module> GetModules(String userName);
        bool Delete(string ids);
    }
}
