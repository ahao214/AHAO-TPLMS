using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace AHAO.TPLMS.Entitys
{
    public class Role
    {
        public Role()
        {
            this.Id = 0;
            this.Name = string.Empty;
            this.Status = 0;
            this.Code = string.Empty;
            this.CreateTime = DateTime.Now;
            this.CreateId = string.Empty;
            this.OrgId = 0;
            this.OrgCascadeId = string.Empty;
            this.OrgName = string.Empty;
            this.Checked = false;
        }
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        public int Status { get; set; }
        [StringLength(10)]
        public string Code { get; set; }

        public DateTime CreateTime { get; set; }


        [StringLength(64)]
        public string CreateId { get; set; }

        public int OrgId { get; set; }


        [StringLength(255)]
        public string OrgCascadeId { get; set; }

        [Required]
        [StringLength(255)]
        public string OrgName { get; set; }
        [NotMapped]
        public bool Checked { get; set; }
    }
}
