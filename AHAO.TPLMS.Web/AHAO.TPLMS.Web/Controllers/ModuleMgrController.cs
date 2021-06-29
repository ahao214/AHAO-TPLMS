using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AHAO.TPLMS.Service;
using AHAO.TPLMS.Util.Helpers;
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

    }
}