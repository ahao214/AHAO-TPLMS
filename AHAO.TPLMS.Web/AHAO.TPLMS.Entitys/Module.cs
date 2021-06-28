using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AHAO.TPLMS.Entitys
{
    public class Module
    {
        public Module()
        {
            this.CascadeId = string.Empty;
            this.Name = string.Empty;
            this.Url = string.Empty;
            this.HotKey = string.Empty;
            this.ParentId = 0;
            this .IconName = string.Empty;
            this.Status = 0;
            this .ParentName = string.Empty;
            this .Vector = string.Empty;
            this.SortNo = 0;            
        }

        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Required]
        [StringLength(255)]
        public string CascadeId { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        [StringLength(255)]
        public string Url { get; set; }
        [StringLength(255)]
        public string HotKey { get; set; }
        public int ParentId { get; set; }
        public bool IsLeaf { get; set; }
        public bool IsAutoExpand { get; set; }
        [StringLength(255)]
        public string IconName { get; set; }
        public int Status { get; set; }
        [Required]
        [StringLength(255)]
        public string ParentName { get; set; }
        [StringLength(255)]
        public string Vector { get; set; }
        public int SortNo { get; set; }


    }
}
