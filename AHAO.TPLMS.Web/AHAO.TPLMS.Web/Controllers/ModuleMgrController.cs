using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JST.TPLMS.Service;
using JST.TPLMS.Util.Helpers;
using JST.TPLMS.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JST.TPLMS.Web.Controllers
{
    public class ModuleMgrController : Controller
    {
        ModuleService moduleSer;
        public ModuleMgrController(ModuleService modu)
        { moduleSer = modu; }
        // GET: ModuleMgr
        public ActionResult Index()
        {
            return View();
        }

        // GET: ModuleMgr/Details/5
        public ActionResult Details(int id)
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
        public string GetPermit(string uid)
        {
            int userId = NumberHelper.ToInt(uid);
            var page = Request.Form["page"].ToString();
            var size = Request.Form["rows"].ToString();
            int pageIndex = page == null ? 1 : int.Parse(page);
            int pageSize = size == null ? 20 : int.Parse(size);
            var moduleList = moduleSer.GetModules(pageIndex, pageSize);
            var userList = moduleSer.LoadForUser(userId);
            foreach (var item in userList)
            {
                var m = moduleList.Where(u => u.Id == item.Id).FirstOrDefault();
                m.Checked = true;
            }
            var json = JsonHelper.Instance.Serialize(moduleList);
            return json;
        }
        public string GetRolePermit(string rid)
        {
            int roleId = NumberHelper.ToInt(rid);
            var page = Request.Form["page"].ToString();
            var size = Request.Form["rows"].ToString();
            int pageIndex = page == null ? 1 : int.Parse(page);
            int pageSize = size == null ? 20 : int.Parse(size);
            var moduleList = moduleSer.GetModules(pageIndex, pageSize);
            var roleList = moduleSer.LoadForRole(roleId);
            foreach (var item in roleList)
            {
                var m = moduleList.Where(u => u.Id == item.Id).FirstOrDefault();
                m.Checked = true;
            }
            var json = JsonHelper.Instance.Serialize(moduleList);
            return json;
        }
        // GET: ModuleMgr/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ModuleMgr/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ModuleMgr/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ModuleMgr/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

    
        public ActionResult Update(Entitys.Module u)
        {
            string result = "NO";
            try
            {
                // TODO: Add update logic here
                result = moduleSer.Save(u);

            }
            catch
            {

            }
            return Content(result);
        }
        public ActionResult Add(Entitys.Module u)
        {
            string result = "NO";
            try
            {
                // TODO: Add logic here
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
                // TODO: Add Delete logic here
                result = moduleSer.Delete(ids);
            }
            catch
            {

            }
            return Content(result);
        }
        public string  GetJsonTree()
        {
            List<ModuleJson> list = LinqJsonTree(0);
            list.Insert(0, new ModuleJson() { id =0, children = null,  parentId =0, text = "根节点" });
            return JsonHelper.Instance.Serialize(list);
            
        }
            /// <summary>
            /// 递归
            /// </summary>
            /// <param name="list"></param>
            /// <returns></returns>
            //
            private List<ModuleJson> LinqJsonTree(int parentId)
        {
            List<Entitys.Module> classlist = moduleSer.GetModules(1, 100).Where(m=>m.ParentId==parentId).ToList();

            List<ModuleJson> jsonData = new List<ModuleJson>();
            classlist.ForEach(item =>
            {
                jsonData.Add(new ModuleJson
                {
                    id = item.Id,
                    children = LinqJsonTree(item.Id),
                    parentId = item.ParentId,
                    text = item.Name,
                    url = string.Empty
                });
            });


            return jsonData;
        }
    }
}