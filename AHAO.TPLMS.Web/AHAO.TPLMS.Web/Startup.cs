using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AHAO.TPLMS.DataBase;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AHAO.TPLMS.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            //services.AddControllers();
            //services.AddDbContext<TPLMSDbContext>(Options => Options.UseSqlServer(Configuration.GetConnectionString("TPLMSDbContext")));
            services.AddDbContext<TPLMSDbContext>(options=>options.UseSqlServer("server=LAPTOP-3HE8JVHO\\MSSQLSERVER02;database=TPLMS;uid=sa;pwd=hao@chen214", b => b.MigrationsAssembly("AHAO.TPLMS.Web")));
            services.AddMvc();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            return RegisterAutofac(services);   //ע��Autofac
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=login}/{id?}");
            });

            //app.UseRouting();           

            //app.UseAuthorization();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});
        }


        private IServiceProvider RegisterAutofac(IServiceCollection services)
        {
            //ʵ����Autofac����
            var builder = new ContainerBuilder();
            //��Services�еķ�����䵽Autofac��
            builder.Populate(services);
            //��ģ�����ע��
            builder.RegisterModule<AutofacDI>();
            //����ע��options,��DbContext�����ʼ��ʹ��
            builder.Register(c =>
            {
                var optionBuilder = new DbContextOptionsBuilder<TPLMSDbContext>();
                optionBuilder.UseSqlServer(Configuration.GetConnectionString("TPLMSDbContext"));
                return optionBuilder.Options;
            }).InstancePerLifetimeScope();

            //ע��DbContext
            builder.RegisterType<TPLMSDbContext>()
                .AsSelf()
                .InstancePerLifetimeScope();

            //��������
            var Container = builder.Build();

            //������IoC�ӹ�Core����DI����
            return new AutofacServiceProvider(Container);




        }

    }
}
