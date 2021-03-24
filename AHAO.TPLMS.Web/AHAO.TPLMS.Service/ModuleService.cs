using AHAO.TPLMS.Contract;
using AHAO.TPLMS.Entitys;
using System;
using System.Collections.Generic;
using System.Text;

namespace AHAO.TPLMS.Service
{
    public class ModuleService
    {
        private IModuleRepository _moduleMgr;

        private Module _module;
        private List<Module> _modules;   //模块列表
        private IRelationsRepository _relaMgr;

        public ModuleService(IModuleRepository userMgr, IRelationsRepository _rela)
        {
            _moduleMgr = userMgr;
            _relaMgr = _rela;
        }
    }
}
