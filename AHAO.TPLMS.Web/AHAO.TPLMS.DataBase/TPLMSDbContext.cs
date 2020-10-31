using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using AHAO.TPLMS.Entitys;

namespace AHAO.TPLMS.DataBase
{
    public partial class TPLMSDbContext : DbContext
    {
        public virtual DbSet<User> User { get; set; }


        public TPLMSDbContext(DbContextOptions<TPLMSDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
