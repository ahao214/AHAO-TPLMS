using AHAO.TPLMS.Contract;
using AHAO.TPLMS.DataBase;
using AHAO.TPLMS.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AHAO.TPLMS.Repository
{
    public class ModuleRepository : BaseRepository<Module>, IModuleRepository
    {
        public ModuleRepository(TPLMSDbContext m_context) : base(m_context)
        {

        }

        public IEnumerable<Module> LoadModules(int pageindex, int pagesize)
        {
            return Context.Module.OrderBy(u => u.id).Skip((pageindex - 1) * pagesize).Take(pagesize);
        }

        public IEnumerable<Module> GetModules(string userName)
        {
            var moduleList = Context.Module.ToArray();
            return moduleList;
        }

        public bool Delete(string ids)
        {
            var idList = ids.Split(',');
            var moduleList = Context.Module.Where(m => idList.Contains(m.id.ToString());
            bool result = true;
            Delete(moduleList.ToArray());
            return result;
        }
    }
}
