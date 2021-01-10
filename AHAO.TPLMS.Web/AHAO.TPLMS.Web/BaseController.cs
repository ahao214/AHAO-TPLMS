using AHAO.TPLMS.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AHAO.TPLMS.Web
{
    public class BaseController : Controller
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            #region 验证用户登录
            var result = GetSession(UserInfoKey.UserName.ToString());
            base.OnActionExecuting(context);
            //1.判断session对象是否存在
            if (context.HttpContext.Session == null)
            {
                context.HttpContext.Response.WriteAsync("<script type='text/javascript>alert('~登录已过期，请重新登录');window.top.location='/';</script>");
                context.Result = new EmptyResult();
                return;
            }
            //2.登录验证
            if (string.IsNullOrEmpty(result))
            {
                var name = context.ActionDescriptor.DisplayName;
                bool isLogin = name.Contains(".Login") || name.Contains(".SubmitLogin");
                if (!isLogin)
                {
                    context.HttpContext.Response.WriteAsync("<script type='text/javascript'>alert('登录已过期，请重新登录');window.top.location='/';</script>");
                    context.Result = new RedirectResult("/Home/Login");
                    return;

                }
            }

            #endregion

        }

        /// <summary>
        /// 返回成功
        /// </summary>
        /// <returns></returns>
        public AjaxResult Success()
        {
            AjaxResult res = new AjaxResult
            {
                Success = true,
                Msg = "请求成功！",
                Data = null
            };
            return res;
        }


        public AjaxResult Success(string id,string no)
        {
            AjaxResult res = new AjaxResult
            {
                Success = true,
                Msg = "请求成功！",
                Data = null,
                Id = id,
                No = no
            };
            return res;
        }

        /// <summary>
        /// 返回错误
        /// </summary>
        /// <param name="msg">错误提示</param>
        /// <returns></returns>
        public AjaxResult Error(string msg)
        {
            AjaxResult res = new AjaxResult
            {
                Success = false,
                Msg = msg,
                Data = null
            };
            return res;
        }


        public string GetLoginKey(string userName)
        {
            return string.Format("{0}Login", userName);
        }


        /// <summary>
        /// 设置Session
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        protected void SetSession(string key, string value)
        {
            HttpContext.Session.SetString(key, value);
        }


        /// <summary>
        /// 获取Session
        /// </summary>
        /// <param name="key">键</param>
        /// <returns>返回对应的值</returns>
        protected string GetSession(string key)
        {
            string value = HttpContext.Session.GetString(key);
            if (string.IsNullOrEmpty(value))
            {
                value = string.Empty;
            }
            return value;
        }
        public enum UserInfoKey
        {
            UserName = 1,
            UserInfo,
            UserRole
        }
    }
}
