using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AHAO.TPLMS.Web.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(maxLength: 150, nullable: false),
                    Password = table.Column<string>(maxLength: 250, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Sex = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    BizCode = table.Column<string>(maxLength: 100, nullable: true),
                    CreateTime = table.Column<DateTime>(nullable: false),
                    CreateId = table.Column<int>(nullable: false),
                    Address = table.Column<string>(maxLength: 250, nullable: true),
                    Mobile = table.Column<string>(maxLength: 50, nullable: true),
                    Email = table.Column<string>(maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
