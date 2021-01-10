using AHAO.TPLMS.Contract;
using AHAO.TPLMS.DataBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;

namespace AHAO.TPLMS.Repository
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseRepository<T> : IRepository<T> where T : class
    {
        public TPLMSDbContext Context;

        public BaseRepository(TPLMSDbContext m_Context)
        {
            Context = m_Context;
        }

        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
            Save();
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <param name="entities"></param>
        public void BatchAdd(T[] entities)
        {
            Context.Set<T>().AddRange(entities);
            Save();
        }

        public void Delete(T entity)
        {
            Context.Set<T>().Remove(entity);
            Save();
        }

        /// <summary>
        /// 执行存储过程
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public int ExecProcedure(string sp, params SqlParameter[] parameters)
        {
            int flag;
            try
            {
                flag = this.Context.Database.ExecuteSqlCommand(sp, parameters);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return flag;
        }
        /// <summary>
        /// 根据过滤条件获取哦记录
        /// </summary>
        /// <param name="exp"></param>
        /// <returns></returns>
        public IQueryable<T> Find(Expression<Func<T, bool>> exp=null)
        {
            return Filter(exp);
        }

        /// <summary>
        /// 得到分页记录
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <param name="exp"></param>
        /// <returns></returns>
        public IQueryable<T> Find(int pageindex = 1, int pagesize = 10, Expression<Func<T, bool>> exp = null)
        {
            if(pageindex<1)
            {
                pageindex = 1;
            }
            return Filter(exp).Skip(pagesize * (pageindex - 1)).Take(pagesize);
        }

        /// <summary>
        /// 查找单个对象
        /// </summary>
        /// <param name="exp"></param>
        /// <returns></returns>
        public T FindSingle(Expression<Func<T, bool>> exp = null)
        {
            return Context.Set<T>().AsNoTracking().FirstOrDefault(exp);
        }

        /// <summary>
        /// 根据过滤条件获取记录数
        /// </summary>
        /// <param name="exp"></param>
        /// <returns></returns>
        public int GetCount(Expression<Func<T, bool>> exp = null)
        {
            return Filter(exp).Count();
        }

        public string GetNo(string name, int OrgId)
        {
            SqlParameter[] parameters =
            {
                new System.Data.SqlClient.SqlParameter("@Name",System.Data.SqlDbType.NVarChar,10),
                new System.Data.SqlClient.SqlParameter("@BH",System.Data.SqlDbType.NVarChar,30)
            };
            parameters[0].Value = name;
            parameters[1].Direction = System.Data.ParameterDirection.Output;
            //int numdata = Context.ExecuteNonQueryAsync("P_NextBH", parameters);
            int numdata = 1;
            string no = parameters[1].Value.ToString();
            if(numdata<0)
            {
                no = string.Empty;
            }
            return no;
        }

        public bool IsExist(Expression<Func<T, bool>> exp)
        {
            return Context.Set<T>().Any(exp);
        }

        public void Save()
        {
            Context.SaveChanges();
        }

        public virtual void Delete(object[] entitys)
        {
            Context.RemoveRange(entitys);
            Save();
        }

        public void Update(T entity)
        {
            var entry = this.Context.Entry(entity);
            //todo:如果状态没有任何改变，则会报错
            //注释，使用下面的方法
            entry.State = EntityState.Modified;
            Save();
        }

        private IQueryable<T> Filter(Expression<Func<T,bool>> exp)
        {
            var dbSet = Context.Set<T>().AsQueryable();
            if (exp != null)
            {
                dbSet = dbSet.Where(exp);
            }
            return dbSet;
        }
    }
}
