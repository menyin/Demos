$.fn.extend({
    multiuploder: function (options) {
        var uploader,
            that=this,
            $this=$(that),
            fileNum=0,filesNum=0,
            defaultOptions={
                formData: {'act': 'logo', 'timestamp': '1613792084', 'fileSize': 50},//cny_add
                fileVal: 'Filedata',//cny_add
                pick: {
                    id: '#filePicker',
                    // label: '点击选择图片'
                    name:'Filedata'
                },
                dnd: '.uploader .dndArea',
                paste: document.body,
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',//详见：https://blog.csdn.net/Joe__sir/article/details/104535543
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
                fileSingleSizeLimit: 1 * 1024 * 1024,    // 50 M
                duplicate:true,

                //extend
                initImgs:null //例：['//cdn.597.com/a.png','//cdn.597.com/b.png'] //如果input有初始化值，以initImgs为主

            },
        opts=$.extend(defaultOptions,options);

        //init UI
        (function initUI() {
            var initImgs=initImgs||$this.val().split(',');
            var initImgsHtml='';
            if(initImgs&&initImgs.length){
                for(var i=0;i<initImgs.length;i++){
                    initImgsHtml += '<li id="WU_FILE_0" class="fileli">\n' +
                        '          <p class="imgWrap">\n' +
                        '            <img src="'+initImgs[i]+'">\n' +
                        '          </p>\n' +
                        '          <div class="file-panel" style="height: 0px; overflow: hidden;"><span>图片预览</span><span class="filedel">删除</span></div>\n' +
                        '        </li>\n';
                }
            }
            var html='<div class="uploader wu-example">\n' +
                '    <div  class="dndArea placeholder">\n' +
                '      <ul class="filelist">\n' +initImgsHtml+
                '        <li id="filePicker" class="filePicker">\n' +
                '          <div class="uploading">\n' +
                '            <img class="" src="//cdn.597.zl/oa/images/webuploader/uploading.gif" alt="">\n' +
                '          </div>\n' +
                '        </li>\n' +
                '      </ul>\n' +
                '    </div>\n' +
             /*   '    <div class="statusBar" style="/!*display:none;*!/">\n' +
                '      <div class="progress">\n' +
                '        <span class="text">0%</span>\n' +
                '        <span class="percentage"></span>\n' +
                '      </div>\n' +
                '    </div>\n' +*/
                '  </div>'; 
                $(html).insertAfter($this);
        })();

        //init Controller
        (function initController() {
             uploader = WebUploader.create(opts);
        })();

        //init Events
        (function initEvents() {
            uploader.onStartUpload = function (file, percentage) {
                $('.statusBar .progress .text').text('上传文件中');

                opts.onStartUpload&&opts.onStartUpload(file, percentage);
            };
            uploader.on('uploadSuccess', function (file, response) {
                if(response.status>0){
                    fileNum++
                    $('.statusBar .progress .text').text('成功上传'+fileNum+'个文件');
                    addFile(file,response);
                }else{
                    alert(response.msg);
                    $('.uploader .filePicker .uploading').hide();
                }
                if(fileNum==filesNum){
                    $('.uploader .filePicker .uploading').hide();
                }else{
                    setTimeout(function () {
                        $('.uploader .filePicker .uploading').hide();
                    },6000);
                }

                opts.onUploadSuccess&&opts.onUploadSuccess(file, response);
            });
            uploader.on('filesQueued', function (files) {
                //直接上传文件
                fileNum=0;
                filesNum=files.length;
                uploader.upload();
                $('.uploader .filePicker .uploading').show();

                opts.onFilesQueued&&opts.onFilesQueued(files);
            });
            uploader.onError = function (code) {
                alert('Eroor: ' + code);
                $('.uploader .filePicker .uploading').hide();
                opts.onError&&opts.onError(code);
            };

            //注册事件
            $('.uploader').on('mousedown','.filePicker', function () {
                $(this).find('.file-panel').stop().animate({height: 0});
                opts.onFilePicker&&opts.onFilePicker();
            });
            $('.uploader').on('mouseenter','.fileli', function () {
                $(this).find('.file-panel').stop().animate({height: 30});
            });
            $('.uploader').on('mouseleave','.fileli', function () {
                $(this).find('.file-panel').stop().animate({height: 0});
            });
            $(document).on('click','.fileli .filedel', function () {
                var src=$(this).closest('.fileli').find('.imgWrap img').attr('src');
                opts.onFiledel&&opts.onFiledel.call(this,src);
                $this.val($this.val().replace(','+src,'').replace(src+',','').replace(src,''));
                $(this).closest('.fileli').remove();

            });
        })();

        //define function
        // 当有文件添加进来时执行，负责view的创建
        function addFile(file,response) {
            $this.val($this.val()+','+response.path);

            var $li = $('<li id="' + file.id + '" class="fileli">' +
                // '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"><img src="'+response.path+'"></p>' +
                '</li>'),
                $btns = $('<div class="file-panel"><span>图片预览</span><span class="filedel">删除</span></div>').appendTo($li);
            $li.insertBefore('.filePicker');
        }

    }
});