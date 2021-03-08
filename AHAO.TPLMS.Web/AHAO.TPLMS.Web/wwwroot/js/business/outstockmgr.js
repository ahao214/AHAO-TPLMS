//-----------------------系统管理-->出库单管理-----------------------------------------//

//刷新数据
function initable() {
    $("#dgOUO").datagrid({
        url: "/OutStockMgr/List",
        title: "出库单管理",
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 30],
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载出库单信息...",
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
            { title: "出库单号", field: "OutStockNo", width: 100, sortable: true },            
            {
                title: "状态", field: "Status", width: 50
             },
            { title: "发货人", field: "ConsignerName", width: 150, sortable: true },
            { title: "收货人", field: "ConsigneeName", width: 150, sortable: false },
            { field: 'Rcv', title: '收货地', width: 60, align: 'center' },

            { field: 'Vessel', title: '船名', width: 100, align: 'center' },
            { field: 'Voyage', title: '航次', width: 100, align: 'center' },
            { field: 'POL', title: 'POL', width: 100, align: 'center' },
            { field: 'POD', title: 'POD', width: 100, align: 'center' },
            { field: 'ETA', title: 'ETA', width: 100, align: 'center' },
            { field: 'ETD', title: 'ETD', width: 100, align: 'center' },
            { field: 'ShipDate', title: '出库时间', width: 100, align: 'center' },
            { field: 'CloseingDate', title: '截柜日期', width: 100, align: 'center' },
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
function reloaded() {   //reload
    $("#reload").click(function () {
        //
        $('#dgOUO').datagrid('reload');

    });}

//修改点击按钮事件
function updOUOInfo() {    
    $("#edit").click(function () {
      
        //判断选择的中
        var row = $("#dgOUO").datagrid('getSelected');        
        if (row) {
           
            $.messager.confirm('编辑', '您想要编辑吗？', function (r) {
                if (r) {
                  
                    //先绑定                    
                    showOUO(row);
                  
                     //打开对话框编辑
                    $("#divAddUpdOUO").dialog({
                        closed: false,
                        title: "修改出库单",
                        modal: true,
                        width: 820,
                        height: 550,
                        collapsible: true,
                        minimizable: true,
                        maximizable: true,
                        resizable: true,
                    });    
                    ShowDetail(row.OutStockNo);
                }
                
            });
            SetEnabled(row.Status);
        } else {
            $.messager.alert('提示', ' 请选择要编辑的行！', 'warning');
        }

    });
    
}
//删除模块
function deleteOUO() {
    $("#del").click(function () {
        var rows = $("#dgOUO").datagrid("getSelections");
        if (rows.length > 0) {
            $.messager.confirm("提示", "确定要删除吗?", function (res) {
                if (res) {
                    var codes = []; //重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        codes.push(rows[i].Id);
                    }
                    $.post("/OutStockMgr/Delete", { "ids": codes.join(',') }, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "删除成功！");
                            $("#dgOUO").datagrid("clearChecked");
                            $("#dgOUO").datagrid("clearSelections");
                            $("#dgOUO").datagrid("load", {});
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
    $("#ShipDateUpdate").val(getNowFormatDate());    
    $("#RcvUpdate").val("");
    $("#StatusUpdate").val("");
    $("#RemarkUpdate").val("");
    $("#rcv").val("");
    $("#cargoName").val("");
    
}
function GetNo() {
    $.get("/OutStockMgr/GetNo", function (data) {
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
    $("#dgINOD").datagrid({ queryParams: queryParams });
   
} //扩展方法
//点击清空按钮出发事件
function clearSearch() {
    $("#dgINOD").datagrid("load", {}); //重新加载数据，无填写数据，向后台传递值则为空
    $("#searchForm").find("input").val(""); //找到form表单下的所有input标签并清空
}
function SetEnabled(status) {
    //var status = $("#StatusUpdate").val()
    if (status == "提交") {
        $("#btnSave").prop('disabled', true);
    }
    else {
        $("#btnSave").removeAttr("disabled");
    }
}
//弹出 添加出库单的的对话框
function showOUODialog() {
    
    $("#add").click(function () {
        clearAll();    
        
        $("#divAddUpdOUO").dialog({
            closed: false,
            title: "添加出库单",
            modal: true,
            width: 820,
            height: 550,
            collapsible: true,
            minimizable: true,
            maximizable: true,
            resizable: true
        });
       
        GetNo();
        ShowDetail("");
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
                    var obj_ContNo = $("#ContainerNoUpdate").val();
                    
                    if (obj_No == "" || obj_Rcv == "" || obj_ContNo== "") {
                        $.messager.alert('提示', ' 请填写相关必填项！', 'warning');
                        return;
                    }
                    var postData = GetOUO();
                    $.post("/OutStockMgr/Add", postData, function (data) {
                        if (data == "OK") {
                           // $("#divAddUpdDO").dialog("close");
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
            initable();
        }

    });



    $("#btnAddDetail").click(function () {
        //保存
        var no = $("#UpdNO").val();
        if (no == "" || no == undefined) {
            $.messager.alert("提示", "没有生成出库单号！");
            return;
        }

        var rows = $('#dgINOD').datagrid('getSelections');
        if (rows.length > 0) {

            //验证
            $.messager.confirm('确认', '您确认要添加所选择货物吗？', function (r) {
                if (r) {
                    var ids = [];//重要不是{}
                    for (var i = 0; i < rows.length; i++) {
                        ids.push(rows[i].Id);
                    }
                    var postData = {
                        "Ids": ids.join(','),
                        "No": no
                    };

                    $.post("/OutStockMgr/AddDetail", postData, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "出库单明细添加成功！");
                            $("#dgINOD").datagrid("clearChecked");
                            $("#dgINOD").datagrid("clearSelections");
                            ShowDetail(no);
                            ShowINODDetail();
                        }
                        else if (data == "NO") {
                            $.messager.alert("提示", "出库单明细添加失败！");
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
    $("#dgOUOD").datagrid({
        url: "/OutStockMgr/GetDetail?no=" + no,
        title: "出库单明细",
        pagination: false,      
        fit: true,
        fitColumns: false,
        loadMsg: "正在加载出库单明细信息...",
        nowarp: false,
        border: false,
        idField: "Id",
        sortName: "Id",
        sortOrder: "asc",
        singleSelect: true,
        iconCls: 'icon-edit',
       
        columns: [[
            { title: "编号", field: "SeqNo", width: 50, sortable: true },
            { title: "出库单号", field: "OutStockNo", width: 100, sortable: true },
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
        onClickRow: function (index, rowData) {
            if (lastIndex != index) {
                $('#dgOUOD').datagrid('endEdit', lastIndex);                
                editrow(index);               
            }
            lastIndex = index;           
        },
        
        onBeginEdit: function (rowIndex, rowData) {
         
            setEditing(rowIndex);
        }
    });
}
//计算报价小计
function setEditing(rowIndex) {
    var editors = $('#dgOUOD').datagrid('getEditors', rowIndex);
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
    $('#dgOUOD').datagrid('selectRow', index)
        .datagrid('beginEdit', index);
   
}
function endEdit() {
    var rows = $('#dgOUOD').datagrid('getRows');
    for (var i = 0; i < rows.length; i++) {
        $('#dgOUOD').datagrid('endEdit', i);
    }
}
function saveDetail() {

    endEdit();
    $.messager.confirm('确认', '您确认要修改吗？', function (r) {
        var effectRow = new Object();
        var postData = GetOUO();
        if (postData.id) {
            effectRow["postdata"] = JSON.stringify(postData);
        }

        if ($('#dgOUOD').datagrid('getChanges').length) {

            var inserted = $('#dgOUOD').datagrid('getChanges', "inserted");
            var deleted = $('#dgOUOD').datagrid('getChanges', "deleted");
            var updated = $('#dgOUOD').datagrid('getChanges', "updated");

         
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
        $.post("/OutStockMgr/Update", effectRow, function (data) {
            
            if (data.success) {
                $.messager.alert("提示", "保存成功！");
                $('#dgOUOD').datagrid('acceptChanges');
              
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
        $("#divAddUpdOUO").dialog("close");   
        $('#dgOUO').datagrid('reload');
    });


    $("#btnSubmit").click(function () {
        //保存
        var id = $("#IDUpdate").val();
        if (id == "" || id == undefined) {
            $.messager.alert("提示", "出库单没有保存，请先保存！");
            return;
        }
            //验证
            $.messager.confirm('确认', '您确认要提交出库单吗？', function (r) {
                if (r) {
                   
                    var postData = {
                        "Id": id
                        
                    };

                    $.post("/OutStockMgr/Submit", postData, function (data) {
                        if (data == "OK") {
                            $.messager.alert("提示", "出库单已经提交成功！");
                            $("#dgINOD").datagrid("clearChecked");
                            $("#dgINOD").datagrid("clearSelections");
                            $("#StatusUpdate").val("提交");
                            SetEnabled("提交");
                        }
                        else if (data == "NO") {
                            $.messager.alert("提示", "出库单提交失败！");
                            return;
                        }
                    });

                }
            })
        

    });
}

function ShowINODDetail() {
    $("#dgINOD").datagrid({
        url: "/InStockMgr/GetDetails?rcv=" + $("#RcvUpdate").val() + "&cargoName=" + $("#cargoName").val(),
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
        frozenColumns: [[//冻结列
            { field: "ck", checkbox: true, align: "left", width: 50 }

        ]],
        columns: [[
            { title: "编号", field: "Id", width: 40, sortable: true },
            { title: "供应商", field: "SupplierId", width: 80},
            { title: "入库单号", field: "InStockNO", width: 100, sortable: true },
            { title: "货物代码", field: "CargoCode", width: 80, sortable: true },
            { title: "货物名称", field: "CargoName", width: 160 },
            {
                title: "数量", field: "Qty", width: 100, align: 'center'
            },
            { title: "计量单位", field: "Unit", width: 80 },
           
           
            { title: "库位", field: "Loc", width: 100, align: 'center' }
         
        ]]
       
    });

}

function GetOUO() {
    var postData = {
        "id": $("#IDUpdate").val(),
        "OutStockNo": $("#UpdNO").val(),
        "BLNo": $("#BLNoUpdate").val(),
        "ShipDate": $("#ShipDateDateUpdate").val(),
        "Vessel": $("#VesselUpdate").val(),
        "Voyage": $("#VoyageNameUpdate").val(),
        "CloseingDate": $("#CloseingDateUpdate").val(),
        "ConsigneeNo": $("#ConsigneeNoUpdate").val(),
        "ConsigneeName": $("#ConsigneeNameUpdate").val(),
        "ConsigneeSccd": $("#ConsigneeSccdUpdate").val(),
        "ShipperNo": $("#ShipperNoUpdate").val(),
        "ShipperName": $("#ShipperNameUpdate").val(),
        "ShipperSccd": $("#ShipperSccdUpdate").val(),
        "AgentNo": $("#AgentNoUpdate").val(),
        "AgentName": $("#AgentNameUpdate").val(),
        "AgentSccd": $("#AgentSccdUpdate").val(),
        "ETA": $("#ETAUpdate").val(),
        "Remark": $("#RemarkUpdate").val(),
        "ETD": $("#ETDUpdate").val(),
        "Rcv": $("#RcvUpdate").val(),      
        "Status": $("#StatusUpdate").val(),
        "LCLFCL": $("#LCLFCLUpdate").val(),
        "ContainerNo": $("#ContainerNoUpdate").val(),

        "WarehouseOper": $("#WarehouseOperUpdate").val(),
        "STallyTime": $("#STallyTimeUpdate").val(),
        "ETallyTime": $("#ETallyTimeUpdate").val(),
        "POL": $("#POLUpdate").val(),
        "POD": $("#PODUpdate").val(),
        "ContainerSize": $("#ContainerSizeUpdate").val(),
        "ContainerType": $("#ContainerTypeUpdate").val(),
        "SONo": $("#SONoUpdate").val(),
        "PackageType": $("#PackageTypeUpdate").val(),
        "PackageQty": $("#PackageQtyUpdate").val(),
        "GrossWt": $("#GrossWtUpdate").val(),
        "NetWt": $("#NetWtUpdate").val(),

        "Oper": $("#ContainerNoUpdate").val()

    };
    return postData;
}

function showOUO(row) {
     
    $("#IDUpdate").val(row.Id);
    $("#UpdNO").val(row.OutStockNo);
    $("#ShipDateUpdate").val(row.ShipDate);
    $("#BLNoUpdate").val(row.BLNo);
    
    $("#VesselUpdate").val(row.Vessel);
    $("#VoyageUpdate").val(row.Voyage);
    $("#ConsigneeNoUpdate").val(row.ConsigneeNo);
    $("#ConsigneeNameUpdate").val(row.ConsigneeName);
    $("#ConsigneeSccdUpdate").val(row.ConsigneeSccd);
    $("#ShipperNoUpdate").val(row.ShipperNo);
    $("#ShipperNameUpdate").val(row.ShipperName);
    $("#ShipperSccdUpdate").val(row.ShipperSccd);
    $("#AgentNoUpdate").val(row.AgentNo);
    $("#AgentNameUpdate").val(row.AgentName);
    $("#AgentSccdUpdate").val(row.AgentSccd);
    $("#ContainerNoUpdate").val(row.ContainerNo);
    $("#RemarkUpdate").val(row.Remark);
    $("#RcvUpdate").val(row.Rcv);
    $("#StatusUpdate").val(row.Status);    
    $("#LCLFCLUpdate").val(row.LCLFCL);
    $("#ETAUpdate").val(row.ETA);
    $("#ETDUpdate").val(row.ETD);

    $("#WarehouseOperUpdate").val(row.WarehouseOper);
    $("#STallyTimeUpdate").val(row.STallyTime);
    $("#ETallyTimeUpdate").val(row.ETallyTime);
    $("#POLUpdate").val(row.POL);
    $("#PODUpdate").val(row.POD);
    $("#ContainerSizeUpdate").val(row.ContainerSize);
    $("#ContainerTypeUpdate").val(row.ContainerType);
    $("#SONoUpdate").val(row.SONo);
    $("#PackageTypeUpdate").val(row.PackageType);
    $("#PackageQtyUpdate").val(row.PackageQty);
     $("#GrossWtUpdate").val(row.GrossWt);
    $("#NetWtUpdate").val(row.NetWt);

}
//------------------------系统管理-->出库单管理结束-----------------------------------------//
