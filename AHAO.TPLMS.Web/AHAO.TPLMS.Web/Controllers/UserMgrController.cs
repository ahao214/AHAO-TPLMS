using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AHAO.TPLMS.Service;
using AHAO.TPLMS.Util.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AHAO.TPLMS.Entitys;
using System.Runtime.InteropServices.WindowsRuntime;

namespace AHAO.TPLMS.Web.Controllers
{
    public class UserMgrController : BaseController
    {
        UserService users;

        public UserMgrController(UserService user)
        {
            users = user;            
        }

        // GET: UserMgr
        public ActionResult Index()
        {
            return View();
        }

        public String List()
        {
            var page = Request.Query["page"].FirstOrDefault();
            var size = Request.Query["rows"].FirstOrDefault();
            int pageIndxe = page == null ? 1 : int.Parse(page);
            int pageSize = size == null ? 20 : int.Parse(size);
            var userList = users.LoadUser(pageIndxe, pageSize);
            var json = JsonHelper.Instance.Serialize(userList);
            return json;
        }

        public ActionResult Update(User user )
        {
            string result = "NO";
            try
            {
                //TODO:Add update logic here
                result = users.Save(user);
            }
            catch
            {

            }
            return Content(result);
        }

        public ActionResult Add(User user)
        {
            string result = "NO";
            try
            {
                //TODO:Add logic here
                result = users.Add(user);
            }
            catch
            {

            }
            return Content(result);
        }

        public ActionResult Delete(User user )
        {
            string result = "NO";
            try
            {
                //TODO:Add delete logic here 
                result = users.Delete(user);
            }
            catch
            { }
            return Content(result);
        }

    }
}