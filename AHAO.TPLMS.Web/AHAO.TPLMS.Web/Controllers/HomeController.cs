using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using AHAO.TPLMS.Service;
using System.Runtime.InteropServices.WindowsRuntime;
using AHAO.TPLMS.Web.Models;
using Microsoft.Extensions.Caching.Memory;
using AHAO.TPLMS.Util.Helpers;
using AHAO.TPLMS.Util;
using Newtonsoft.Json.Linq;

namespace AHAO.TPLMS.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : BaseController
    {
        AuthoriseService auth;


        public HomeController(AuthoriseService authorise)
        {
            auth = authorise;
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Login()
        {
            return View();
        }

        #region 登录与登出

        public ActionResult SubmitLogin(string userName, string password)
        {
            MemoryCacheHelper memHelper = new MemoryCacheHelper();
            int count = 0;
            AjaxResult res = null;
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                res = Error("账号或密码不能为空!");
            }
            var obj = memHelper.Get(userName);
            if (!(obj is null))
            {
                int.TryParse(obj.ToString(), out count);
            }
            if (count > 3)
            {
                res = Error("你已经登录三次出错了,请在一个小时之后再试!");
            }
            else
            {
                bool theUser = auth.Check(userName, password);
                if (theUser)
                {
                    res = Success();
                }
                else
                {
                    res = Error("账号或密码不正确!");
                }
                memHelper.Add(userName, count + 1);
            }
            return Content(res.ToJson());
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <returns></returns>
        public AjaxResult Logout()
        {
            return Success("注销成功!");
        }

        #endregion

        /// <summary>
        /// 返回成功
        /// </summary>
        /// <param name="msg">消息</param>
        /// <returns></returns>
        public AjaxResult Success(string msg)
        {
            AjaxResult res = new AjaxResult
            {
                Success = true,
                Msg = msg,
                Data = null
            };
            return res;
        }

    }
}
