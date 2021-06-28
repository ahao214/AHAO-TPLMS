using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AHAO.TPLMS.Web.Models
{
    /// <summary>
    /// 构建Json数据源的数据格式，属性有id,test,children，这里名字不要更改，否认不能读取出来
    /// </summary>
    public class ModuleJson
    {
        /// <summary>
        /// ID
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 分类
        /// </summary>
        public string text { get; set; }
        /// <summary>
        /// 子类
        /// </summary>
        public List<ModuleJson> children { get; set; }
        /// <summary>
        /// 父ID
        /// </summary>
        public int ParentId { get; set; }


    }
}
