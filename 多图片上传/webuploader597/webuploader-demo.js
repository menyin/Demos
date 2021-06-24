$(function () {
    var $queue = $('.filelist'),
// 添加的文件总大小
        fileSize = 0,

// 实例化
        uploader = WebUploader.create({
            formData: {'act': 'logo', 'timestamp': '1613792084', 'fileSize': 350},//cny_add
            fileVal: 'Filedata',//cny_add
            pick: {
                id: '#filePicker',
                // label: '点击选择图片'
            },
            dnd: '.uploader .dndArea',
            paste: document.body,

            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            // swf文件路径
            // swf: BASE_URL + '/Uploader.swf',
            disableGlobalDnd: true,
            chunked: true,
            // server: 'http://webuploader.duapp.com/server/fileupload.php',
            // server: 'http://2betop.net/fileupload.php',
            server: '/api/web/uploadify.api',
            fileNumLimit: 300,
            fileSizeLimit: 5 * 1024 * 1024,    // 200 M
            fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
        });

    uploader.onUploadProgress = function (file, percentage) {

    };

    uploader.onFileQueued = function (file) {
        //直接上传文件
        uploader.upload();
        debugger
    };



    uploader.on('uploadSuccess', function (file, response) {
        if(response.status>0){
            addFile(file);
        }else{
            alert(response.msg);
        }
        debugger;
    });

    uploader.onError = function (code) {
        alert('Eroor: ' + code);
    };


// 当有文件添加进来时执行，负责view的创建
    function addFile(file,response) {
        debugger;
        var $li = $('<li id="' + file.id + '">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"><img src="'+response.path+'"></p>' +
            '</li>'),
            $btns = $('<div class="file-panel"><span class="cancel">删除</span></div>').appendTo($li);

        $li.on('mouseenter', function () {
            $btns.stop().animate({height: 30});
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({height: 0});
        });

        $btns.on('click', 'span', function () {
            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }


        });

        $li.appendTo($queue);
    }


});