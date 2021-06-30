using AHAO.TPLMS.Service;
using AHAO.TPLMS.Util.Helpers;
using Microsoft.AspNetCore.Mvc;
using AHAO.TPLMS.Entitys;
using AHAO.TPLMS.Web.Models;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;

namespace AHAO.TPLMS.Web.Controllers
{
    public class ModuleMgrController : Controller
    {
        ModuleService moduleSer;
        public ModuleMgrController(ModuleService modu)
        {
            moduleSer = modu;
        }


        // GET: ModuleMgr
        public ActionResult Index()
        {
            return View();
        }

        public string List()
        {
            var page = Request.Form["page"].ToString();
            var size = Request.Form["rows"].ToString();
            int pageIndex = page == null ? 1 : int.Parse(page);
            int pageSize = size == null ? 20 : int.Parse(size);
            var userList = moduleSer.LoadModules(pageIndex, pageSize);
            var json = JsonHelper.Instance.Serialize(userList);
            return json;
        }

        public ActionResult Update(Module u)
        {
            string result = "NO";
            try
            {
                //TODO:Add update logic here 
                result = moduleSer.Save(u);
            }
            catch
            {
            }
            return Content(result);
        }

        public ActionResult Add(Module u)
        {
            string result = "NO";
            try
            {
                result = moduleSer.Add(u);
            }
            catch
            {

            }
            return Content(result);
        }

        public ActionResult Delete(string ids)
        {
            string result = "NO";
            try
            {
                result = moduleSer.Delete(ids);
            }
            catch { }
            return Content(result);
        }

        public string GetJsonTree()
        {
            List<ModuleJson> lst = LinqJsonTree(0);
            lst.Insert(0, new ModuleJson()
            {
                id = 0,
                children = null,
                ParentId = 0,
                text = "根结点"
            });
            return JsonHelper.Instance.Serialize(lst);
        }

        /// <summary>
        /// 递归
        /// </summary>
        /// <param name="paretnId"></param>
        /// <returns></returns>
        private List<ModuleJson> LinqJsonTree(int paretnId)
        {
            List<Module> lst = moduleSer.GetModules(1, 100).Where(m => m.ParentId == paretnId).ToList();
            List<ModuleJson> jsonData = new List<ModuleJson>();
            lst.ForEach(item =>
             {
                 jsonData.Add(new ModuleJson
                 {
                     id = item.Id,
                     children = LinqJsonTree(item.Id),
                     ParentId = item.ParentId,
                     text = item.Name
                 });
             });

            return jsonData;
        }

    }
}