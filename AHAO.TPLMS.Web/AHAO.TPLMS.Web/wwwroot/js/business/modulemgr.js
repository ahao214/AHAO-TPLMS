//------------------------系统管理-->模块管理-----------------------------------------//
//刷新数据
function initable() {
    $("#dgModule").datagrid({
        url: "/ModuleMgr/List",
        title: "模块管理",
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
            { field: 'IsAutoExpand', title: '自动展开', width: 100, align: 'center' },
            { field: 'HotKey', title: '热键', width: 100, align: 'center' },
            { field: 'IconName', title: '图标', width: 160, align: 'center' },           
            {
                field: 'Status', title: '状态', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (row.Status == "0")
                        return '禁用';
                    else if (row.Status == "1")
                        return '启用';
                    else
                        return '禁用';
                }
            },
            {
                title: "操作", field: "Id", width: 70, formatter: function (value, row, index) {
                    var str = '';
                    //if ($.canEdit) {
                        str += $.formatString('<img onclick="updateUserInfo(\'{0}\');"  src="{1}" title="编辑"/>', row.id, '~/js/easyui/themes/icons/edit.png');
                  //  }
                    str += '&nbsp;';
                   // if ($.canGrant) {
                        str += $.formatString('<img onclick="showCreateUserDialog();" src="{0}" title="添加"/>', '~/js/easyui/themes/icons/edit_add.png');
                   // }
                    str += '&nbsp;';
                   // if ($.canDelete) {
                        str += $.formatString('<img onclick="" src="{0}" title="删除"/>', '~/js/easyui/themes/icons/cancel.png');
                   // }
                    return str;
                }
            }
        ]]
   

    });
 
}
function reloaded() {   //reload
    $("#reload").click(function () {
        //
        $('#dgModule').datagrid('reload');

    });}

//修改点击按钮事件
function updModuleInfo() {    
    $("#edit").click(function () {
        BindUpdTree();
        //判断选择的中
        var row = $("#dgModule").datagrid('getSelected');        
        if (row) {
           
            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定                    
                    $("#IDUpdate").val(row.Id);
                    $("#UpdUrl").val(row.Url);
                    $("#UpdName").val(row.Name);
                    $("#IsLeafUpdate").val( row.IsLeaf);
                    $("#IsAutoExpandUpdate").val(row.IsAutoExpand);
                    $("#SortNoUpdate").val( row.SortNo);
                    $("#IconNameUpdate").val( row.IconName);
                    $("#HotKeyUpdate").val( row.HotKey);                    
                    
                    $("#StatusUpdate").combobox('setValue', row.Status);
                     //打开对话框编辑
                    $("#divUpdateModule").dialog({
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
                var obj_url = $("#UpdUrl").val();
                var obj_isleaf = $("#IsLeafUpdate").val();
                var obj_IsExpand = $("#IsAutoExpandUpdate").val();
                var obj_sort = $("#SortNoUpdate").val();
                var obj_status = $("#StatusUpdate").combobox('getValue');
                var obj_fullname = $("#UpdName").val();

                var obj_icon = $("#IconNameUpdate").val();
                var obj_hotkey = $("#HotKeyUpdate").val();
                if (obj_url == "" || obj_fullname == "") {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": $("#IDUpdate").val(),
                    "Name": obj_fullname,
                    "Url": obj_url,
                    "IsLeaf": obj_isleaf,
                    "IsAutoExpand": obj_IsExpand,
                    "SortNo": obj_sort,
                    "IconName": obj_icon,
                    "HotKey": obj_hotkey,
                    "Status": obj_status         
                };
                $.post("/ModuleMgr/Update", postData, function (data) {
                    if (data == "OK") {
                        $("#divUpdateModule").dialog("close");
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
function deleteModule() {
    $("#del").click(function () {
        var rows = $("#dgModule").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/ModuleMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgModule").datagrid("load", {});
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
    $("#AddUrl").val("");
    $("#IsLeafAdd").attr("checked", false);
    $("#IsAutoExpandAdd").attr("checked", true);    
    $("#StatusAdd").combobox('setValue','1');    
    $("#SortNoAdd").val("");    
    $("#IconNameAdd").val("");
    $("#HotKeyAdd").val("");
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
function showCreateModuleDialog() {
    
    $("#add").click(function () {
        clearAll();
        BindTree();
        $("#divAddModule").dialog({
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
        //  alert('1');
        //保存
        //验证
        $.messager.confirm('确认', '您确认要保存吗？', function (r) {
            if (r) {                                
                var obj_url = $("#AddUrl").val();
                var obj_isleaf = $("#IsLeafAdd").val();
                var obj_IsExpand = $("#IsAutoExpandAdd").val();
                var obj_sort = $("#SortNoAdd").val();             
                var obj_status = $("#StatusAdd").combobox('getValue');                
                var obj_fullname = $("#AddName").val();
                var obj_pid = $("#AddTree").combotree("getValue");//取得选中的编码，单个的
                var obj_pname = $("#AddTree").combotree("getText"); //取所有选中的文本，是一个String
                var obj_icon = $("#IconNameAdd").val();
                var obj_hotkey = $("#HotKeyAdd").val();
                if (obj_url == "" || obj_fullname == "" ) {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "id": "",
                    "Name": obj_fullname,
                    "Url": obj_url,
                    "IsLeaf": obj_isleaf,
                    "IsAutoExpand": obj_IsExpand,
                    "SortNo": obj_sort,
                    "IconName": obj_icon,
                    "HotKey": obj_hotkey,
                    "Status": obj_status,
                    "ParentId": obj_pid,
                    "ParentName": obj_pname
                };
                $.post("/ModuleMgr/Add", postData, function (data) {
                    if (data == "OK") {
                        $("#divAddModule").dialog("close");
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
function BindUpdTree() {
    $('#TreeUpdate').combotree({
        url: '/ModuleMgr/GetJsonTree',
        valueField: 'Id',
        textField: 'Name',
        multiple: false,
        editable: false,
        method: 'get',
        panelHeight: 'auto',
        checkbox: false,
        //required: true,
        //全部折叠
        onLoadSuccess: function (node, data) {
            $('#TreeUpdate').combotree('tree').tree("collapseAll");
        },
    });}
function BindTree() {
    //绑定类别下拉列表
    
    $('#AddTree').combotree({
        url: '/ModuleMgr/GetJsonTree',
        valueField: 'Id',
        textField: 'Name',
        multiple: false,
        editable: false,
        method: 'get',
        panelHeight: 'auto',
        checkbox: false,
        //required: true,
        //全部折叠
        onLoadSuccess: function (node, data) {
            $('#AddTree').combotree('tree').tree("collapseAll");
        },
    });

}

//------------------------系统管理-->模块管理结束-----------------------------------------//
