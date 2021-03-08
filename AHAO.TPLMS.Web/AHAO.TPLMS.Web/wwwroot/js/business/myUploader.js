//------------------------系统管理-->文件上传管理-----------------------------------------//
var applicationPath = window.applicationPath === "" ? "" : window.applicationPath || "../../";
// 文件上传
jQuery(function () {  
    var $ = jQuery,
        $filename = $('#UpdFileName'),
        $list = $('#fileList'),
        $btn = $('#ctlBtn'),
        $btnre = $('#reset'),        
        state = 'pending',
        uploader;
    uploader = WebUploader.create({
        // 不压缩image
        resize: false,

        // swf文件路径
        swf: applicationPath + '~/js/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: '/POMgr/UploadFile?address=PO',
         //formData: {
         //    "NO": $("#UpdNO").val()                    
         //       },
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        //pick: '#picker'
        pick: {
            id: '#picker',
            multiple: false,
            label: '选择文件'
        },
        fileNumLimit: 1

    });
    // 当有文件被加入队列之前触发
    uploader.on('beforeFileQueued', function (file) {                 
            uploader.reset();
        $list.empty();     
            $filename.val("");       
    });
    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        $filename.val(file.name);
        $list.append('<div id="' + file.id + '" class="item">' +
           // '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
        //删除上传的文件
        $btnre.on('click', function () {
            $li = $('#' + file.id);           
                uploader.reset();
            $li.remove();   
            $filename.val("");
        });
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {

        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');
        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }
        $li.find('p.state').text('上传中');
        $percent.css('width', percentage * 100 + '%');

    });

    uploader.on('uploadSuccess', function (file, response) {
        console.log(response._raw);
        $('#' + file.id).find('p.state').text('已上传');
        $('#dgPOD').datagrid({
            url: "/POMgr/GetDetail?no=" + $("#UpdNO").val()
        });  
    });

    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });
    uploader.on('all', function (type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }
        if (state === 'uploading') {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }

    });

    $btn.on('click', function () {
        var obj_No = $("#UpdNO").val();
        if (obj_No == "" ) {
            $.messager.alert('提示', ' 请先生成订单号！', 'warning');
            return;
        }
        var obj = new Object();
        obj.NO = obj_No;        
        uploader.options.formData = obj;
        if (state === 'uploading') {
            uploader.stop();
        } else {
            uploader.upload();
        }
      
    });
});
//------------------------系统管理-->文件上传管理结束-----------------------------------------//
