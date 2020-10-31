using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AHAO.TPLMS.DataBase;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            //services.AddDbContext<TPLMSDbContext>(Options => Options.UseSqlServer(Configuration.GetConnectionString("TPLMSDbContext")));
            services.AddDbContext<TPLMSDbContext>(options=>options.UseSqlServer("server=.\\sqlexpress;database=TPLMS;uid=sa;pwd=hao@chen214", b => b.MigrationsAssembly("AHAO.TPLMS.Web")));
            services.AddMvc();                                 
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();           

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
