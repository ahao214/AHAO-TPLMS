//------------------------系统管理-->用户管理-----------------------------------------//
//刷新数据
function initable() {
    $("#dgUser").datagrid({
        url: "/UserMgr/List",
        title: "用户管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载用户的信息...",
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
            { title: "用户名", field: "UserId", width: 100, sortable: true },
            { title: "密码", field: "Password", width: 100, sortable: true, formatter: function (value, rowData, rowIndex) { return "******"; } },
            { title: "姓名", field: "Name", width: 100, sortable: true },
            /*{
                title: "是否用加密锁", field: "IsUseKey", width: 100, sortable: true, formatter: function (value, rowData, rowIndex) {
                    if (rowData.IsUseKey == 1) {
                        return "<span title='是'>是</span>"
                    }
                    else {
                        return "<span title='否'>否</span>"
                    }
                }
            }, { title: "加密锁号", field: "KeyPassword", width: 150 }*/           
            {
                field: 'Sex', title: '性别', width: 50, align: 'center', formatter: function (value, row, index) {
                    if (row.Sex == "1")
                        return '男';                  
                    else
                        return '女';
                }
            },
            {
                field: 'Type', title: '类别', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (row.Type == "1")
                        return '供应商';
                    else if (row.Type == "2")
                        return '客户';                    
                    else
                        return '员工';
                }
            },            
            { field: 'Address', title: '地址', width: 160, align: 'center' },
            { field: 'Mobile', title: '电话', width: 120, align: 'center' },
            { field: 'Email', title: '电子邮件', width: 160, align: 'center' },
            { field: 'CreateTime', title: '创建时间', width: 100, align: 'center' },
            { field: 'CreateId', title: '创建者', width: 100, align: 'center' },
            {
                field: 'Status', title: '状态', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (row.Status == "0")
                        return '审核拒绝';
                    else if (row.Status == "1")
                        return '审核通过';
                    else
                        return '审核拒绝';
                }
            },
            {
                title: '操作', field: 'BizCode',  width: 60, align: 'center', formatter: function (value, row, index) {
                 
                    var str = '';
                    str += "<a>" + row.Id + "</a>";  
                    str += "<img src='/js/easyui/themes/icons/edit.png' title=\"编辑\" onclick='updateUserInfo(&apos;" + row.Id + "&apos;)'>" + "</img>";  
                                       
                    return str;
                }
            }
        ]]
   

    });
 
}
function reloaded() {   //reload
    $("#reload").click(function () {
        //
        $('#dgUser').datagrid('reload');

    });}

//修改点击按钮事件
function updUserInfo() {    
    $("#edit").click(function () {
     
        //判断选择的中
        var row = $("#dgUser").datagrid('getSelected');        
        if (row) {
           
            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定
                    
                    $("#IDUpdate").val(row.Id);
                    $("#UpdUserId").val(row.UserId);
                    $("#UpdName").val(row.Name);
                    $("#PwdUpdate").val( row.Password);
                    $("#BizCodeUpdate").val(row.BizCode);
                    $("#MobileUpdate").val( row.Mobile);
                    $("#AddressUpdate").val( row.Address);
                    $("#EmailUpdate").val( row.Email);
                    $("#CreateTimeUpdate").val(row.CreateTime);
                    
                        $("#TypeUpdate").combobox('setValue', row.Type);
                  
                    
                        $("#SexUpdate").combobox('setValue', row.Sex);
                    
                   
                        $("#StatusUpdate").combobox('setValue', row.Status);
                    $("#divUpdateUser").dialog({
                        closed: false,
                        title: "修改用户",
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
                var obj_userid = $("#UpdUserId").val();
                var obj_userpassword = $("#PwdUpdate").val();
                var obj_address = $("#AddressUpdate").val();
                var obj_email = $("#EmailUpdate").val();
                var obj_type = $("#TypeUpdate").combobox('getValue');
                var obj_status = $("#StatusUpdate").combobox('getValue');
                var obj_sex = $("#SexUpdate").combobox('getValue');
                var obj_fullname = $("#UpdName").val();
                var obj_createtime = $("#CreateTimeUpdate").val();
                var obj_mobile = $("#MobileUpdate").val();
                var obj_code = $("#BizCodeUpdate").val();
                if (obj_userid == "" || obj_userpassword == "" || obj_fullname == "" || obj_email == "" || obj_mobile == "") {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": $("#IDUpdate").val(),
                    "Name": obj_fullname,
                    "Password": obj_userpassword,
                    "Email": obj_email,
                    "Type": obj_type,
                    "UserId": obj_userid,
                    "Address": obj_address,
                    "Mobile": obj_mobile,
                    "Status": obj_status,
                    "Sex": obj_sex,
                    "BizCode":obj_code,
                    "CreateTime": obj_createtime
                };
                $.post("/UserMgr/Update", postData, function (data) {
                    if (data == "OK") {
                        $("#divUpdateUser").dialog("close");
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
//删除用户
function deleteUser() {
    $("#del").click(function () {
        var rows = $("#dgUser").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/UserMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgUser").datagrid("load", {});
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
//修改用户信息
function updateUserInfo() {
    var rows = $("#dgUser").datagrid("getSelections");
    if (rows.length != 1) {
        $.messager.alert("提示", "请选择一条数据！");
        return;
    }
    else {		
        //处理修改：弹出修改的对话框                          
        $("#IDUpdate").val(rows[0].Id);
        $("#UpdName").val(rows[0].Name);
        $("#PwdUpdate").val(rows[0].Password);
        $("#StatusUpdate").combobox('setValue', row.Status);
        $("#divUpdateUser").dialog({
            closed: false,
            title: "修改用户",
            modal: true,
            width: 300,
            height: 300,
            collapsible: true,
            minimizable: true,
            maximizable: true,
            resizable: true,
        });
    }
}
//清空文本框
function clearAll() {
    $("#AddUserId").val("");
    $("#PwdAdd").val("");
    $("#AddressAdd").val("");
    $("#EmailAdd").val("");
    $("#TypeAdd").combobox('setValue','0');
    $("#StatusAdd").combobox('setValue','0');
    $("#SexAdd").combobox('setValue','0');
    $("#AddName").val("");
    $("#CreateTimeAdd").val(getNowFormatDate());
    $("#MobileAdd").val("");
    $("#BizCodeAdd").val("");
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
function showCreateUserDialog() {
    
    $("#add").click(function () {
        clearAll();
        $("#divAddUser").dialog({
            closed: false,
            title: "添加用户",
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
                var obj_userid = $("#AddUserId").val();
                var obj_userpassword = $("#PwdAdd").val();
                var obj_address = $("#AddressAdd").val();
                var obj_email = $("#EmailAdd").val();
                var obj_type = $("#TypeAdd").combobox('getValue');
                var obj_status = $("#StatusAdd").combobox('getValue');
                var obj_sex = $("#SexAdd").combobox('getValue');
                var obj_fullname = $("#AddName").val();
                var obj_createtime = $("#CreateTimeAdd").val();
                var obj_mobile = $("#MobileAdd").val();
                var obj_code = $("#BizCodeAdd").val();
                if (obj_userid == "" || obj_userpassword == "" || obj_fullname == "" || obj_email == "" || obj_mobile == "") {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": "",
                    "Name": obj_fullname,
                    "Password": obj_userpassword,
                    "Email": obj_email,
                    "Type": obj_type,
                    "UserId": obj_userid,
                    "Address": obj_address,
                    "Mobile": obj_mobile,
                    "Status": obj_status,
                    "Sex": obj_sex,
                    "BizCode": obj_code,
                    "CreateTime": obj_createtime
                };
                $.post("/UserMgr/Add", postData, function (data) {
                    if (data == "OK") {
                        $("#divAddUser").dialog("close");
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
        var rows = $("#dgUser").datagrid("getSelections");        
        if (rows.length != 1) {
            $.messager.alert("提示", "请选择一条数据！");
            return;
        }
        else {
            $("#divUserModule").dialog({
                closed: false,
                title: "设置用户权限",
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
                    $.post("/UserMgr/Assign", { "ids": codes.join(','), "uid": id }, function (data) {
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

    $("#roleassign").click(function () {
        var rows = $("#dgUser").datagrid("getSelections");
        if (rows.length != 1) {
            $.messager.alert("提示", "请选择一条数据！");
            return;
        }
        else {
            $("#divUserRole").dialog({
                closed: false,
                title: "分配角色",
                modal: true,
                width: 500,
                height: 400,
                collapsible: true,
                //maximized: true,   
                minimizable: true,
                resizable: true
            });
            id = rows[0].Id;
            ShowRole(id);
        }
    });
    $("#btnRoleAssign").click(function () {
        var rows = $("#dgRole").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要保存吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/UserMgr/Assign", { "ids": codes.join(','), "uid": id ,"type":"1"}, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "保存成功！");
                            $("#dgRole").datagrid("load", {});
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
        url: "/ModuleMgr/GetPermit?uid="+id,
       // title: "设置权限",
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
            $("#dgModule").datagrid("clearChecked");
            $("#dgModule").datagrid("clearSelections");
            if (data) {
                $.each(data.rows, function (index, item) {
                    if (item.Checked) {
                        $('#dgModule').datagrid('checkRow', index);
                    }
                });
            }
        }

    });
  

}


function ShowRole(id) {
    $("#dgRole").datagrid({
        url: "/RoleMgr/GetPermit?uid=" + id,
        // title: "设置权限",
        pagination: false,
      
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载角色信息...",
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
            { title: "创建时间", field: "CreateTime", width: 120, sortable: true },
         

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
            $("#dgRole").datagrid("clearChecked");
            $("#dgRole").datagrid("clearSelections");
            if (data) {
                $.each(data.rows, function (index, item) {
                    if (item.Checked) {
                        $('#dgRole').datagrid('checkRow', index);
                    }
                });
            }
        }

    });


}

//设置角色成功之后执行的方法
function afterSetRole() {
    $("#divUserRole").dialog({
        closed: true
    });
}
function afterSetModule() {
    $("#divUserModule").dialog({
        closed: true
    });
}

//------------------------系统管理-->用户管理结束-----------------------------------------//
