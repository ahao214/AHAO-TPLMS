﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace AHAO.TPLMS.Entitys
{
    public class User
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [MaxLength(150),Required]
        public string  UserId { get; set; }
        [MaxLength(250),Required]
        public string Password { get; set; }
        [MaxLength(100),Required]
        public string Name { get; set; }
        public int Sex { get; set; }
        public int Status { get; set; }
        public int Type { get; set; }
        [MaxLength(100)]
        public string BizCode { get; set; }
        public DateTime CreateTime { get; set; }
        public int CreateId { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }
        [MaxLength(50)]
        public string Mobile { get; set; }
        [MaxLength(150)]
        public string Email { get; set; }
    }
}
