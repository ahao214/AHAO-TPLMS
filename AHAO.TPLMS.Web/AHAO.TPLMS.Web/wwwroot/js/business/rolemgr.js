//------------------------系统管理-->角色管理-----------------------------------------//
//刷新数据
function initable() {
    $("#dgRole").datagrid({
        url: "/RoleMgr/List",
        title: "角色管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载模块信息...",
        nowarp: false,
        border: false,
        idField: "Id",
        sortName: "Id",
        sortOrder: "asc",
        frozenColumns: [[//冻结列
            { field: "ck", checkbox: true, align: "left", width: 50 }
           
        ]],
        columns: [[
            { title: "编号", field: "Id", width: 50, sortable: true },
            { title: "角色名称", field: "Name", width: 100, sortable: true },            
            { title: "创建时间", field: "CreateTime", width: 150, sortable: true },
                        
            { field: 'Type', title: '类别', width: 80, align: 'center' },
          
              
            {
                field: 'Status', title: '状态', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (row.Status == "0")
                        return '禁用';
                    else if (row.Status == "1")
                        return '启用';
                    else
                        return '禁用';
                }
            }
           
        ]]
   

    });
 
}
function reloaded() {   //reload
    $("#reload").click(function () {
        //
        $('#dgRole').datagrid('reload');

    });}

//修改点击按钮事件
function updRoleInfo() {    
    $("#edit").click(function () {        
        //判断选择的中
        var row = $("#dgRole").datagrid('getSelected');        
        if (row) {

            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定                    
                    $("#IDUpdate").val(row.Id);
                 
                    $("#UpdName").val(row.Name);
                    $("#CreateTimeUpdate").val( row.CreateTime);                    
                    
                    $("#StatusUpdate").combobox('setValue', row.Status);
                     //打开对话框编辑
                    $("#divUpdateRole").dialog({
                        closed: false,
                        title: "修改模块",
                        modal: true,
                        width: 300,
                        height: 400,
                        collapsible: true,
                        minimizable: true,
                        maximizable: true,
                        resizable: true,
                    });                    
                }
                
            });

        } else {
            $.messager.alert('提示', ' 请选择要编辑的行！', 'warning');
        }

    });
    $("#btnUpdate").click(function () {
              //更新
        //验证
        $.messager.confirm('确认', '您确认要更新吗？', function (r) {
            if (r) {
                
                var obj_status = $("#StatusUpdate").combobox('getValue');
                var obj_fullname = $("#UpdName").val();

                var obj_createtime = $("#CreateTimeUpdate").val();
                
                if ( obj_fullname == "") {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": $("#IDUpdate").val(),
                    "Name": obj_fullname,
                    "OrgId": "",
                    "OrgCascadeId": "",
                    "Type": "",
                    "OrgName": "",
                    "CreateTime": obj_createtime,
                    "CreateId": "",
                    "Status": obj_status         
                };
                $.post("/RoleMgr/Update", postData, function (data) {
                    if (data == "OK") {
                        $("#divUpdateRole").dialog("close");
                        $.messager.alert("提示", "修改成功！");
                        initable();
                    }
                    else if (data == "NO") {
                        $.messager.alert("提示", "密码不能为空！");
                        return;
                    }
                });

            }
        })
       
    });
}
//删除模块
function deleteRole() {
    $("#del").click(function () {
        var rows = $("#dgRole").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/RoleMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgRole").datagrid("load", {});
                        }                       
                        else if (data == "NO") {
                            $.messager.alert("提示", "删除失败！");
                            return;
                        }
                    });
                }
            });
        }
    })
}
//清空文本框
function clearAll() {
    $("#AddName").val("");    
    $("#StatusAdd").combobox('setValue','1');    
    $("#CreateTimeAdd").val(getNowFormatDate());    
}
//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function searchFunc() { $("#datagrid").datagrid("load", sy.serializeObject($("#searchForm").form())); } //扩展方法
//点击清空按钮出发事件
function clearSearch() {
    $("#datagrid").datagrid("load", {}); //重新加载数据，无填写数据，向后台传递值则为空
    $("#searchForm").find("input").val(""); //找到form表单下的所有input标签并清空
}
//弹出 添加用户的的对话框
function showCreateRoleDialog() {
    
    $("#add").click(function () {
        clearAll();        
        $("#divAddRole").dialog({
            closed: false,
            title: "添加角色",
            modal: true,
            width: 300,
            height: 400,
            collapsible: true,
            minimizable: true,
            maximizable: true,
            resizable: true
        });
    });

    $("#btnAdd").click(function () {
        
        //保存
        //验证
        $.messager.confirm('确认', '您确认要保存吗？', function (r) {
            if (r) {                                
               
                var obj_status = $("#StatusAdd").combobox('getValue');                
                var obj_fullname = $("#AddName").val();
            
                var obj_createtime = $("#CreateTimeAdd").val();
                
                if ( obj_fullname == "" ) {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": "",
                    "Name": obj_fullname,
                    "OrgId": "",
                    "OrgCascadeId": "",
                    "Type": "",
                    "OrgName": "",
                    "CreateTime": obj_createtime,
                    "CreateId": "",
                    "Status": obj_status         
                };
                $.post("/RoleMgr/Add", postData, function (data) {
                    if (data == "OK") {
                        $("#divAddRole").dialog("close");
                        $.messager.alert("提示", "保存成功！");
                        initable();
                    }
                    else if (data == "NO") {
                        $.messager.alert("提示", "保存失败！");
                        return;
                    }
                });

            }
        })

    });
}


//分配权限
function SetUserLimit() {
    var id;
    $("#assign").click(function () {
        var rows = $("#dgRole").datagrid("getSelections");
        if (rows.length != 1) {
            $.messager.alert("提示", "请选择一条数据！");
            return;
        }
        else {
            $("#divRoleModule").dialog({
                closed: false,
                title: "设置角色权限",
                modal: true,
                width: 500,
                height: 400,
                collapsible: true,
                //maximized: true,   
                minimizable: true,
                resizable: true
            });
            id = rows[0].Id;         
            ShowModule(id);
        }
    });
    $("#btnAssign").click(function () {
        var rows = $("#dgModule").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要保存吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/RoleMgr/Assign", { "ids": codes.join(','), "rid": id }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "保存成功！");
                            $("#dgModule").datagrid("load", {});
                        }
                        else if (data == "NO") {
                            $.messager.alert("提示", "保存失败！");
                            return;
                        }
                    });
                }
            });
        }

    });
}

function ShowModule(id) {
    $("#dgModule").datagrid({
        url: "/ModuleMgr/GetRolePermit?rid=" + id,
        // title: "设置权限",
        pagination: true,
        pageSize: 50,    
        pageList: [50, 100, 200],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载模块信息...",
        nowarp: false,
        border: false,
        idField: "Id",
        sortName: "Id",
        sortOrder: "asc",
        frozenColumns: [[//冻结列
            { field: "ck", checkbox: true, align: "left", width: 50 }

        ]],
        columns: [[
            { title: "编号", field: "Id", width: 50, sortable: true },
            { title: "模块名称", field: "Name", width: 100, sortable: true },
            { title: "模块地址", field: "Url", width: 150, sortable: true },

            { field: 'IsLeaf', title: '叶子', width: 80, align: 'center' },

            {
                field: 'Status', title: '状态', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (row.Status == "0")
                        return '禁用';
                    else if (row.Status == "1")
                        return '启用';
                    else
                        return '禁用';
                }
            }

        ]],
        onLoadSuccess: function (data) {
            if (data) {
               $("#dgModule").datagrid("clearChecked");
                $("#dgModule").datagrid("clearSelections");
                $.each(data.rows, function (index, item) {
                    if (item.Checked) {
                        $('#dgModule').datagrid('checkRow', index);
                    }
                });
            }
        }

    });
  

}
//设置角色成功之后执行的方法
function afterSetModule() {
    $("#divRoleModule").dialog({
        closed: true
    });
}

//------------------------系统管理-->用户管理结束-----------------------------------------//
