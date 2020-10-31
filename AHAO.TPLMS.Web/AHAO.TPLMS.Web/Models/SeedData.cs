using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AHAO.TPLMS.Entitys;
using AHAO.TPLMS.DataBase;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace AHAO.TPLMS.Web.Models
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new TPLMSDbContext(serviceProvider.GetRequiredService<DbContextOptions<TPLMSDbContext>>()))
            {
                //Look for any User
                if (context.User.Any())
                {
                    return; //DB has been seeded
                }

                context.User.AddRange(
                    new User
                    {
                        UserId = "admin",
                        Password = "admin",
                        Name = "管理员",
                        Sex = 1,
                        Status = 1,
                        Type = 0,
                        BizCode = string.Empty,
                        CreateId = 0,
                        CreateTime = DateTime.Now,
                        Address = string.Empty,
                        Mobile = string.Empty,
                        Email = string.Empty
                    },
                     new User
                     {
                         UserId = "test",
                         Password = "test",
                         Name = "Test",
                         Sex = 0,
                         Status = 1,
                         Type = 0,
                         BizCode = string.Empty,
                         CreateId = 0,
                         CreateTime = DateTime.Now,
                         Address = "上海黄浦",
                         Mobile = "55090098",
                         Email = string.Empty
                     },
                      new User
                      {
                          UserId = "wang",
                          Password = "wang",
                          Name = "王五",
                          Sex = 1,
                          Status = 1,
                          Type = 0,
                          BizCode = string.Empty,
                          CreateId = 0,
                          CreateTime = DateTime.Now,
                          Address = "上海松江",
                          Mobile = "13897674532",
                          Email = string.Empty
                      },
                       new User
                       {
                           UserId = "shOper",
                           Password = "shOper",
                           Name = "张三",
                           Sex = 0,
                           Status = 1,
                           Type = 0,
                           BizCode = string.Empty,
                           CreateId = 0,
                           CreateTime = DateTime.Now,
                           Address = "上海奉贤",
                           Mobile = "13900805505",
                           Email = string.Empty
                       },
                        new User
                        {
                            UserId = "10001",
                            Password = "10001",
                            Name = "西门庆",
                            Sex = 1,
                            Status = 1,
                            Type = 0,
                            BizCode = string.Empty,
                            CreateId = 0,
                            CreateTime = DateTime.Now,
                            Address = "北京朝阳",
                            Mobile = "18098760123",
                            Email = string.Empty
                        }
                    );
                context.SaveChanges();
            }
        }
    }
}
