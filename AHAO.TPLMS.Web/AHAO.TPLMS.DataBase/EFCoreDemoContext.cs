using System;
using System.Reflection.Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using AHAO.TPLMS.Entitys;

namespace AHAO.TPLMS.DataBase
{
    public partial class EFCoreDemoContext:DbContext
    {
        public virtual DbSet<User> User { get; set; }


        public EFCoreDemoContext(DbContextOptions <EFCoreDemoContext> options):base(options)
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
