//-----------------------系统管理-->入库单管理-----------------------------------------//
var editIndex = undefined;
var mainIndex = undefined;
//刷新数据
function initable() {
    $("#dgINO").datagrid({
        url: "/InStockMgr/List",
        title: "入库单管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载入库单信息...",
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
            { title: "入库单号", field: "InStockNo", width: 100, sortable: true },            
            {
                title: "状态", field: "Status", width: 50
            },
            { field: 'OTDDate', title: '到货日期', width: 100, align: 'center' },
            { title: "发货人", field: "ConsignerName", width: 150, sortable: true },
            { title: "收货人", field: "ConsigneeName", width: 150, sortable: false },
            { field: 'Rcv', title: '收货地', width: 60, align: 'center' },
            { field: 'RcvOper', title: '收货人', width: 100, align: 'center' },
            { field: 'SRcvTime', title: '收货开始时间', width: 120, align: 'center' },
            { field: 'ERcvTime', title: '收货结束时间', width: 120, align: 'center' },
            { field: 'CreateTime', title: '创建时间', width: 100, align: 'center' },
          
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

//显示送货单数据
function ShowDO() {
    $("#dgDO").datagrid({
        url: "/DOMgr/ImportList",
        title: "送货单管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载送货单信息...",
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
            { title: "送货单号", field: "DeliveryNo", width: 100, sortable: true },
            {
                title: "状态", field: "Status", width: 50
            },
            { title: "发货人", field: "ConsignerName", width: 150, sortable: true },
            { title: "收货人", field: "ConsigneeName", width: 150, sortable: false },
            { field: 'Rcv', title: '收货地', width: 60, align: 'center' },
            { field: 'FreightClause', title: '运输条款', width: 100, align: 'center' },
            { field: 'ForwardingClause', title: '运费条款', width: 100, align: 'center' },
            { field: 'DeliveryDate', title: '预计送货时间', width: 100, align: 'center' },
            { field: 'CreateTime', title: '创建时间', width: 100, align: 'center' }

        ]]


    });

}
function reloaded() {   //reload
    $("#reload").click(function () {
        //
        $('#dgINO').datagrid('reload');

    });}

//修改点击按钮事件
function updINOInfo() {    
    $("#edit").click(function () {
      
        //判断选择的中
        var row = $("#dgINO").datagrid('getSelected');        
        if (row) {
           
            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定                    
                    showINO(row);
                  
                     //打开对话框编辑
                    $("#divAddUpdINO").dialog({
                        closed: false,
                        title: "修改入库单",
                        modal: true,
                        width: 820,
                        height: 550,
                        collapsible: true,
                        minimizable: true,
                        maximizable: true,
                        resizable: true,
                    });    
                    ShowDetail(row.InStockNo);
                }
                
            });
            SetEnabled(row.Status);
        } else {
            $.messager.alert('提示', ' 请选择要编辑的行！', 'warning');
        }

    });
    
}
//删除模块
function deleteINO() {
    $("#del").click(function () {
        var rows = $("#dgINO").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/InStockMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgINO").datagrid("clearChecked");
                            $("#dgINO").datagrid("clearSelections");
                            $("#dgINO").datagrid("load", {});
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
    $("#DeliveryDateUpdate").val(getNowFormatDate());    
    $("#RcvUpdate").val("");
    $("#RemarkUpdate").val("");

    $("#rcv").val("");
    $("#cargoName").val("");
    
}
function GetNo() {
    $.get("/InStockMgr/GetNo", function (data) {
         // alert(data);
        var obj = JSON.parse(data);
        $("#UpdNO").val(obj.No);
        $("#IDUpdate").val(obj.Id);
        initable();
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

//将表单数据转为json
function form2Json(id) {

    var arr = $("#" + id).serializeArray()
    var jsonStr = "";

    jsonStr += '{';
    for (var i = 0; i < arr.length; i++) {
        jsonStr += '"' + arr[i].name + '":"' + arr[i].value + '",'
    }
    jsonStr = jsonStr.substring(0, (jsonStr.length - 1));
    jsonStr += '}'

    var json = JSON.parse(jsonStr)
    return json
}

function searchFunc() {
    var jsonStr = '{"cargoName":"' + $("#cargoName").val() + '"}';
    var queryParams = JSON.parse(jsonStr);
    $("#dgPOD").datagrid({ queryParams: queryParams });
   
} //扩展方法
//点击清空按钮出发事件
function clearSearch() {
    $("#dgPOD").datagrid("load", {}); //重新加载数据，无填写数据，向后台传递值则为空
    $("#searchForm").find("input").val(""); //找到form表单下的所有input标签并清空
}
function SetEnabled(status) {
    
    if (status == "提交") {
        $("#btnSave").prop('disabled', true);
        $("#btnAddLoc").prop('disabled', true);
    }
    else {
        $("#btnSave").removeAttr("disabled");
        $("#btnAddLoc").removeAttr("disabled");
    }
}
//弹出 导入送货单的的对话框
function showINODialog() {
    
    $("#add").click(function () {
        $("#divImportDO").dialog({
            closed: false,
            title: "生成入库单",
            modal: true,
            width: 820,
            height: 550,
            collapsible: true,
            minimizable: true,
            maximizable: true,
            resizable: true
        });
        ShowDO();
        $("#dgDO").datagrid("clearChecked");
        $("#dgDO").datagrid("clearSelections");
    });

    $("#btnSave").click(function () {
      
        //保存
        var id = $("#IDUpdate").val();
        if (id == "" || id == undefined) {
            //验证
            $.messager.confirm('确认', '您确认要保存吗？', function (r) {
                if (r) {
                    var obj_No = $("#UpdNO").val();
                    var obj_Rcv = $("#RcvUpdate").val();
                    
                    
                    if (obj_No == "" || obj_Rcv == "" || obj_SupId=="") {
                        $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                        return;
                    }
                    var postData = GetINO();
                    $.post("/InStockMgr/Add", postData, function (data) {
                        if (data == "OK") {
                           
                            $.messager.alert("提示", "保存成功！");
                            initable();     
                            collapseRows();
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
            initable();     
            collapseRows();
        }

    });



    $("#btnImportDO").click(function () {
        //保存
       
        var rows = $('#dgDO').datagrid('getSelections');
        if (rows.length > 0) {

            //验证
            $.messager.confirm('确认', '您确认将根据选中的送货单生成入库单吗？', function (r) {
                if (r) {
                    var ids = [];//重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        ids.push(rows[i].Id);
                    }
                    var postData = {
                        "Ids": ids.join(',')
                    };

                    $.post("/InStockMgr/ImportDO", postData, function (data) {
                        if (data == "OK") {
                            $('#dgDO').datagrid('reload');
                            $.messager.alert("提示", "入库单生成成功！");
                            initable();                           
                        }
                        else if (data == "NO") {
                            $.messager.alert("提示", "入库单生成失败！");
                            return;
                        }
                    });

                }
            })
        }

    });
}


//添加明细

function ShowDetail(no) {
    var lastIndex;
    $("#dgINOD").datagrid({
        url: "/InStockMgr/GetDetail?no=" + no,
        title: "入库单明细",
        pagination: false,      
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载入库单明细信息...",
        nowarp: false,
        border: false,
        idField: "Id",
        sortName: "Id",
        sortOrder: "asc",
        singleSelect: true,
        iconCls: 'icon-edit',
      
        columns: [[
            { title: "编号", field: "SeqNo", width: 50, sortable: true },
            { title: "入库单号", field: "InStock", width: 100, sortable: true },
            { title: "HSCode", field: "HSCode", width: 80, sortable: false },
            { title: "货物代码", field: "CargoCode", width: 100, sortable: true },
            { title: "货物名称", field: "CargoName", width: 160, sortable: false },
            { title: "规格型号", field: "Spcf", width: 80, sortable: false },
            {
                title: "数量", field: "Qty", width: 100, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 4
                    }
                }
            },
            {
                title: "长", field: "Length", width: 70, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 2
                    }
                }
            },
            {
                title: "宽", field: "Width", width: 70, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 2
                    }
                }
            },
            {
                title: "高", field: "Height", width: 70, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 2
                    }
                }
            },
            { title: "产销国", field: "Country", width: 70, align: 'center' },
            {
                title: "单价", field: "Price", width: 100, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 2
                    }
                }
            },        
            {
                title: "总价", field: "TotalAmt", width: 100, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 2
                    }
                }
            },
            { title: "包装", field: "Package", width: 70, align: 'center' },
            { title: "计量单位", field: "Unit", width: 70, align: 'center' },
            {
                title: "总体积", field: "Vol", width: 70, align: 'center', editor: {
                    type: 'numberbox', options: {
                        required: true, min: 0, precision: 4
                    }
                }
            },
            { title: "品牌", field: "Brand", width: 70, align: 'center' }

          
        ]],
        view: detailview,
        detailFormatter: function (index, row) {
            return '<div style="padding:2px"><table id="dgINODItem-' + index + '"></table></div>';
        },

        onExpandRow: function (index, row) {
            var ddv = $('#dgINODItem-' + index);
            ddv.datagrid({
                url: '/InStockMgr/GetLocs?inodId=' + row.Id,              
                fitColumns: false,
                singleSelect: true,
                rownumbers: true,
                loadMsg: '',
                height: 'auto',
                columns: [[
                    { field: 'SeqNo', title: '序号', width: 50 },
                    {
                        field: 'Qty', title: '数量', width: 120 ,editor: {
                            type: 'numberbox', options: {
                                required: true, min: 0, precision: 2
                            }
                        }},
                    {
                        field: 'Loc', title: '库位', width: 150, editor: {
                            type: 'text', options: {
                                required: true
                            }
                        }
                    },
                    { field: 'Remark', title: '备注', width: 200 },
                    
                    { field: 'Id', title: 'Id', width: 50, hidden: 'true' },
                     { field: 'InStockOrderDetailId', title: 'InodId', width: 50, hidden: 'true' }
                ]],
                onResize: function () {
                    $('#dgINOD').datagrid('fixDetailRowHeight', index);
                },
                onLoadSuccess: function () {
                    setTimeout(function () {
                        $('#dgINOD').datagrid('fixDetailRowHeight', index);
                    }, 0);
                    editIndex = undefined;//主网格换行
                },
                onAfterEdit: function (rowIndex, rowData, changes) {
                    editIndex = undefined;
                },
                onClickRow: function (index1, row1) {
                    if (editIndex != index1) {
                        if (endEditing(ddv))
                        {
                            ddv.datagrid('selectRow', index1).datagrid('beginEdit', index1);
                            editIndex = index1;
                        }
                        else { ddv.datagrid('selectRow', editIndex); }
                    }
                }
            });
            $('#dgINOD').datagrid('fixDetailRowHeight', index);
        },
   

        onClickRow: function (index, rowData) {
            if (lastIndex != index) {
                $('#dgINOD').datagrid('endEdit', lastIndex);                
                editrow(index);               
            }
            lastIndex = index;   
            mainIndex = index;
        },
        
        onBeginEdit: function (rowIndex, rowData) {
            
            setEditing(rowIndex);
        }
    });
}
function SubGridAddRow() {
    var ddv = $('#dgINODItem-' + mainIndex);
    var row = $('#dgINOD').datagrid('getSelected');
    if (mainIndex != undefined) {
        ddv.datagrid('endEdit', editIndex);
    }
    if (editIndex == undefined) {
       ddv.datagrid('insertRow', {
            index: 0,
           row: { InStockOrderDetailId:row.Id}
        });

        ddv.datagrid('beginEdit', 0);
        editIndex = 0;
    }
    
}
function endEditing(ddv) {
    var changes = ddv.datagrid('getChanges');
    if (editIndex == undefined)
    { return true }
    if (ddv.datagrid('validateRow', editIndex)) {
        //验证前一行
        //返回编辑器，结束编辑 
        ddv.datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else { return false; }
}
//折叠展开的子网格
function collapseRows() {
    var rows = $('#dgINOD').datagrid('getRows');
    $.each(rows, function (i, k) {
        //获取当前所有展开的子网格
        var expander = $('#dgINOD').datagrid('getExpander', i);
        if (expander.length && expander.hasClass('datagrid-row-collapse')) {
            if (k.id != row.id) {
                //折叠上一次展开的子网格
                $('#dgINOD').datagrid('collapseRow', i);
            }
        }
    });    
}
//计算报价小计
function setEditing(rowIndex) {
    var editors = $('#dgINOD').datagrid('getEditors', rowIndex);
    var priceEditor = editors[4];
    var qtyEditor = editors[0];
    var lengthEditor = editors[1];
    var widthEditor = editors[2];
    var heightEditor = editors[3];
    var totalVolEditor = editors[6];
    var totalAmtEditor = editors[5];
    priceEditor.target.numberbox({
        onChange: function () { calculate();}
    });
    qtyEditor.target.numberbox({
        onChange: function () {
            calculate();
            calculateVol();
        }
    });
    lengthEditor.target.numberbox({
        onChange: function () { calculateVol(); }
    });
    widthEditor.target.numberbox({
        onChange: function () { calculateVol(); }
    });
    heightEditor.target.numberbox({
        onChange: function () { calculateVol(); }
    });
    function calculate() {
        var cost = (priceEditor.target.val()) * (qtyEditor.target.val());
        console.log(cost);
        totalAmtEditor.target.numberbox("setValue", cost);
    }
    function calculateVol() {
        var vol = (lengthEditor.target.val() / 100.0) * (widthEditor.target.val() / 100.0) * (heightEditor.target.val() / 100.0)* (qtyEditor.target.val());
        console.log(vol);
        totalVolEditor.target.numberbox("setValue", vol);
    }
}
function editrow(index) {
    $('#dgINOD').datagrid('selectRow', index)
        .datagrid('beginEdit', index);
   
}
function endEdit() {
    var rows = $('#dgINOD').datagrid('getRows');
    for (var i = 0; i < rows.length; i++) {
        $('#dgINOD').datagrid('endEdit', i);
    }
}
function endEditSub(ddv) {
    if (mainIndex != undefined) {
        var rows = ddv.datagrid('getRows');
        for (var i = 0; i < rows.length; i++) {
            ddv.datagrid('endEdit', i);
        }        
       
    }
}
function saveDetail() {

    endEdit();
    var ddv = $('#dgINODItem-' + mainIndex);
   
    $.messager.confirm('确认', '您确认要修改吗？', function (r) {
        var effectRow = new Object();
        var postData = GetINO();
        if (postData.id) {
            effectRow["postdata"] = JSON.stringify(postData);
        }
        if (mainIndex != undefined) {
            endEditSub(ddv);
            var changes = ddv.datagrid('getChanges');

            if (changes.length) {
                var insed = ddv.datagrid('getChanges', "inserted");
                var deled = ddv.datagrid('getChanges', "deleted");
                var upded = ddv.datagrid('getChanges', "updated");


                if (insed.length) {
                    effectRow["subinserted"] = JSON.stringify(insed);
                }
                if (deled.length) {
                    effectRow["subdeleted"] = JSON.stringify(deled);
                }
                if (upded.length) {
                    effectRow["subupdated"] = JSON.stringify(upded);
                }
            }
        }
        if ($('#dgINOD').datagrid('getChanges').length) {

            var inserted = $('#dgINOD').datagrid('getChanges', "inserted");
            var deleted = $('#dgINOD').datagrid('getChanges', "deleted");
            var updated = $('#dgINOD').datagrid('getChanges', "updated");


            if (inserted.length) {
                effectRow["inserted"] = JSON.stringify(inserted);
            }
            if (deleted.length) {
                effectRow["deleted"] = JSON.stringify(deleted);
            }
            if (updated.length) {
                effectRow["updated"] = JSON.stringify(updated);
            }
        }
        $.post("/InStockMgr/Update", effectRow, function (data) {
            
            if (data.success) {
                $.messager.alert("提示", "保存成功！");
                $('#dgINOD').datagrid('acceptChanges');
             
            }
            else {
                $.messager.alert("提示", data.msg);
                return;
            }
        }, "JSON")
            ;
       
        })    
}
function init() {
    
    $("#btnCancle").click(function () {       
        $("#divAddUpdINO").dialog("close");   
        $('#dgINO').datagrid('reload');
    });
    $("#btnCancleDO").click(function () {
        $("#divImportDO").dialog("close");
        $('#dgINO').datagrid('reload');
    });
    $("#btnAddLoc").click(function () {
        SubGridAddRow();
    });

    $("#btnSubmit").click(function () {
        //保存
        var id = $("#IDUpdate").val();
        if (id == "" || id == undefined) {
            $.messager.alert("提示", "入库单没有保存，请先保存！");
            return;
        }
            //验证
            $.messager.confirm('确认', '您确认要提交入库单吗？', function (r) {
                if (r) {
                   
                    var postData = {
                        "Id": id
                        
                    };

                    $.post("/InStockMgr/Submit", postData, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "入库单已经提交成功！");                           
                            $("#StatusUpdate").val("提交");
                            SetEnabled("提交");
                        }
                        else if (data == "NO") {
                            $.messager.alert("提示", "入库单提交失败！");
                            return;
                        }
                    });

                }
            })
        

    });
}


function GetINO() {
    var postData = {
        "id": $("#IDUpdate").val(),
        "InStockNo": $("#UpdNO").val(),
        
        "OTDDate": $("#OTDDateUpdate").val(),
        "ConsignerNo": $("#ConsignerNoUpdate").val(),
        "ConsignerName": $("#ConsignerNameUpdate").val(),
        "ConsignerSccd": $("#ConsignerSccdUpdate").val(),
        "ConsigneeNo": $("#ConsigneeNoUpdate").val(),
        "ConsigneeName": $("#ConsigneeNameUpdate").val(),
        "ConsigneeSccd": $("#ConsigneeSccdUpdate").val(),
        "BizpoEtpsNo": $("#BizpoEtpsNoUpdate").val(),
        "BizpoEtpsName": $("#BizpoEtpsNameUpdate").val(),
        "BizpoEtpsSccd": $("#BizpoEtpsSccdUpdate").val(),
        "AgentNo": $("#AgentNoUpdate").val(),
        "AgentName": $("#AgentNameUpdate").val(),
        "AgentSccd": $("#AgentSccdUpdate").val(),
        "RcvOper": $("#RcvOperUpdate").val(),
        "Remark": $("#RemarkUpdate").val(),
        "SRcvTime": $("#SRcvTimeUpdate").val(),
        "Rcv": $("#RcvUpdate").val(),      
        "Status": $("#StatusUpdate").val(),
        "ERcvTime": $("#ERcvTimeUpdate").val(),
        "PackageType": $("#PackageTypeUpdate").val(),
        "PackageQty": $("#PackageQtyUpdate").val(),
        "GrossWt": $("#GrossWtUpdate").val(),
        "Accepter": $("#AccepterUpdate").val(),
        "Oper": $("#OperUpdate").val(),

        "NetWt": $("#NetWtUpdate").val()
    };
    return postData;
}

function showINO(row) {
     
    $("#IDUpdate").val(row.Id);
    $("#UpdNO").val(row.InStockNo);
    $("#OTDDateUpdate").val(row.OTDDate);
    $("#ConsignerNoUpdate").val(row.ConsignerNo);
    
    $("#ConsignerNameUpdate").val(row.ConsignerName);
    $("#ConsignerSccdUpdate").val(row.ConsignerSccd);
    $("#ConsigneeNoUpdate").val(row.ConsigneeNo);
    $("#ConsigneeNameUpdate").val(row.ConsigneeName);
    $("#ConsigneeSccdUpdate").val(row.ConsigneeSccd);
    $("#BizpoEtpsNoUpdate").val(row.BizpoEtpsNo),
    $("#BizpoEtpsNameUpdate").val(row.BizpoEtpsName),
    $("#BizpoEtpsSccdUpdate").val(row.BizpoEtpsSccd),

        $("#SRcvTimeUpdate").val(row.SRcvTime);
    $("#ERcvTimeUpdate").val(row.ERcvTime);
    $("#PackageTypeUpdate").val(row.PackageType);
    $("#AgentNoUpdate").val(row.AgentNo);
    $("#AgentNameUpdate").val(row.AgentName);
    $("#AgentSccdUpdate").val(row.AgentSccd);
    $("#PackageQtyUpdate").val(row.PackageQty),
    $("#RemarkUpdate").val(row.Remark);
    $("#RcvUpdate").val(row.Rcv);
    $("#StatusUpdate").val(row.Status);    
    $("#GrossWtUpdate").val(row.GrossWt);
    $("#AccepterUpdate").val(row.Accepter);
    $("#OperUpdate").val(row.Oper);
    $("#NetWtUpdate").val(row.NetWt);
    $("#RcvOperUpdate").val(row.RcvOper);
}
//------------------------系统管理-->入库单管理结束-----------------------------------------//
