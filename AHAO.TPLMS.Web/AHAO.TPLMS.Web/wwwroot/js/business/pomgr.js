//------------------------系统管理-->订单管理-----------------------------------------//
//刷新数据
function initable() {
    $("#dgPO").datagrid({
        url: "/POMgr/List",
        title: "订单管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载订单信息...",
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
            { title: "订单号", field: "NO", width: 100, sortable: true },            
            { title: "文件名称", field: "FileName", width: 250, sortable: true },
                        
            { field: 'CreateTime', title: '创建时间', width: 100, align: 'center' },
            { field: 'Oper', title: '操作者', width: 100, align: 'center' },
          
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
        $('#dgPO').datagrid('reload');

    });}

//修改点击按钮事件
function updPOInfo() {    
    $("#edit").click(function () {

        //判断选择的中
        var row = $("#dgPO").datagrid('getSelected');        
        if (row) {
           
            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定                    
                    $("#IDUpdate").val(row.Id);
                    $("#UpdNO").val(row.NO);
                    $("#UpdFileName").val(row.FileName);
                    $("#CreateTimeUpdate").val( row.CreateTime);
                    $("#OperUpdate").val(row.Oper);
                  
                     //打开对话框编辑
                    $("#divAddUpdPO").dialog({
                        closed: false,
                        title: "修改订单",
                        modal: true,
                        width: 700,
                        height: 450,
                        collapsible: true,
                        minimizable: true,
                        maximizable: true,
                        resizable: true,
                    });    
                    ShowDetail(row.NO);
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
                var obj_No = $("#UpdNO").val();
                var obj_CreateTime = $("#CreateTimeUpdate").val();
                var obj_Oper = $("#OperUpdate").val();
                var obj_fullname = $("#UpdFileName").val();

                if (obj_No == "" || obj_fullname == "") {
                    $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                    return;
                }
                var postData = {
                    "Id": $("#IDUpdate").val(),
                    "FileName": obj_fullname,
                    "NO": obj_No,
                    "CreateTime": obj_CreateTime,
                    "Oper": obj_Oper
                };
                $.post("/POMgr/Update", postData, function (data) {
                    if (data == "OK") {
                        $("#divAddUpdPO").dialog("close");
                        $.messager.alert("提示", "修改成功！");
                        initable();
                    }
                    else if (data == "NO") {
                        $.messager.alert("提示", "修改失败！");
                        return;
                    }
                });

            }
        })
       
    });
}
//删除模块
function deletePO() {
    $("#del").click(function () {
        var rows = $("#dgPO").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/POMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgPO").datagrid("clearChecked");
                            $("#dgPO").datagrid("clearSelections");
                            $("#dgPO").datagrid("load", {});
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
    $("#IDUpdate").val("");
    $("#UpdNO").val("");
    $("#CreateTimeUpdate").val(getNowFormatDate());    
    $("#OperUpdate").val("");
    $("#UpdFileName").val("");
}
function GetNo() {
    $.get("/POMgr/GetNo", function (data) {       
        $("#UpdNO").val(data);
    });
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
//弹出 添加订单的的对话框
function showPODialog() {
    
    $("#add").click(function () {
        clearAll();    
       
        $("#divAddUpdPO").dialog({
            closed: false,
            title: "添加订单",
            modal: true,
            width: 700,
            height: 450,
            collapsible: true,
            minimizable: true,
            maximizable: true,
            resizable: true
        });
        GetNo();
        ShowDetail("");
    });

    $("#btnSave").click(function () {
        //  alert('1');
        //启用
        $("#ctlBtn").removeAttr("disabled");
        //保存
        var id = $("#IDUpdate").val();
        if (id == "" || id == undefined) {
            //验证
            $.messager.confirm('确认', '您确认要保存吗？', function (r) {
                if (r) {
                    var obj_No = $("#UpdNO").val();
                    var obj_CreateTime = $("#CreateTimeUpdate").val();
                    var obj_Oper = $("#OperUpdate").val();
                    var obj_fullname = $("#UpdFileName").val();
                    if (obj_No == "" || obj_fullname == "") {
                        $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                        return;
                    }
                    var postData = {
                        "id": "",
                        "FileName": obj_fullname,
                        "NO": obj_No,
                        "CreateTime": obj_CreateTime,
                        "Oper": obj_Oper
                    };
                    $.post("/POMgr/Add", postData, function (data) {
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
        }
        else {
            saveDetail();
        }

    });
}


//添加明细

function ShowDetail(no) {
    $("#dgPOD").datagrid({
        url: "/POMgr/GetDetail?no=" + no,
        title: "订单明细",
        pagination: false,      
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载订单明细信息...",
        nowarp: false,
        border: false,
        idField: "Id",
        sortName: "Id",
        sortOrder: "asc",
    
        columns: [[
            { title: "编号", field: "Id", width: 50, sortable: true },
            { title: "订单号", field: "NO", width: 100, sortable: true },
            { title: "货物代码", field: "CargoCode", width: 100, sortable: true },
            { title: "货物名称", field: "CargoName", width: 160, sortable: true },
            { title: "收货方", field: "Rcv", width: 80, sortable: true },
            {
                title: "数量", field: "Qty", width: 100, align: 'center', editor: {
                    type: 'validatebox',
                    options: {
                        validType: 'number'
                    }
                }},
            { title: "供应商", field: "SupplierId", width: 100, align: 'center' },
            { title: "截止日期", field: "ClosingDate", width: 100, align: 'center' }           
           
        ]],
        onDblClickRow: function(index,rowData) {
            editrow(index);
        }
    });
 
}
function editrow(index) {
    $('#dgPOD').datagrid('beginEdit', index);
}
function endEdit() {
    var rows = $('#dgPOD').datagrid('getRows');
    for (var i = 0; i < rows.length; i++) {
        $('#dgPOD').datagrid('endEdit', i);
    }
}
function saveDetail() {

    endEdit();
    $.messager.confirm('确认', '您确认要修改吗？', function (r) {
        if ($('#dgPOD').datagrid('getChanges').length) {

            var obj_No = $("#UpdNO").val();
            var obj_CreateTime = $("#CreateTimeUpdate").val();
            var obj_Oper = $("#OperUpdate").val();
            var obj_fullname = $("#UpdFileName").val();          
            var postData = {
                "id": $("#IDUpdate").val(),
                "FileName": obj_fullname,
                "NO": obj_No,
                "CreateTime": obj_CreateTime,
                "Oper": obj_Oper
            };

            var inserted = $('#dgPOD').datagrid('getChanges', "inserted");
            var deleted = $('#dgPOD').datagrid('getChanges', "deleted");
            var updated = $('#dgPOD').datagrid('getChanges', "updated");

            var effectRow = new Object();
            if (inserted.length) {
                effectRow["inserted"] = JSON.stringify(inserted);
            }
            if (deleted.length) {
                effectRow["deleted"] = JSON.stringify(deleted);
            }
            if (updated.length) {
                effectRow["updated"] = JSON.stringify(updated);
            }
            if (postData.id) {
                effectRow["postdata"] = JSON.stringify(postData);
            }
            $.post("/POMgr/Update", effectRow, function (data) {
               
                if (data.success) {
                    $.messager.alert("提示", "保存成功！");
                    $('#dgPOD').datagrid('acceptChanges');
                 
                }
                else {
                    $.messager.alert("提示", data.msg);
                    return;
                }              
            }, "JSON")
            ;
        }
        })    
}
function init() {
    $("#ctlBtn").attr({ "disabled": "disabled" });
    $("#btnCancle").click(function () {       
        $("#divAddUpdPO").dialog("close");     
    });
}
//------------------------系统管理-->订单管理结束-----------------------------------------//
