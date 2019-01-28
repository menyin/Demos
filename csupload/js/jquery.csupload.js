(function ($) {
    $.fn.csupload = function (options) {
        var IE=!window.FormData;//不支持FormData都认为是IE
        // var IE=true;
        var that = $(this);
        var defaultOptions = {
            uploadUrl: 'http://192.168.1.21:8080/upload/',
            filterUrl: 'http://192.168.1.21:8080/upload/api/?act=get',
            accept: '.png,.jpg,.jepg,.gif',
            name: 'file',
            submitBtn: null, //默认自动上传，当传递$选择器时则手动上传，如：'#submitBtn',
            preview:function (files) {console.log(files);},
            success:function (result) {console.log(result);}
        };


        var $inputFile = $('<input id="inputFile" type="file" name="file" multiple="multiple">');
        var $form = $('<form action="' + options.uploadUrl + '" style="display: none;"  enctype="multipart/form-data"></form>');

        (function init() {
            initOptions();
            initUI();
            initEvent();
        })();


        function initOptions() {
           for(dkey in defaultOptions){
               if(!options[dkey]){
                   options[dkey]=defaultOptions[dkey];
               }
           }
        }

        function initUI() {
            for (prop in options) {
                if('name id accept '.indexOf(prop)>-1){
                    $inputFile.attr(prop, options[prop]);
                }
            }
            if(!IE){
                $form.append($inputFile).appendTo('body');
            }else{

                that.append($inputFile).css({position:'relative',display:'block',width:'80px',height:'32px'});
                setTimeout(function () {
                    $('#inputFile').css({position: 'absolute', opacity: 0, width: '100%', height: '100%',top:0,left:0});
                    that.find('#inputFile-queue').hide();
                });
            }

        }

        function initEvent() {
            if(!IE){
                that.on('click', function (e) {
                    $inputFile.click();
                });
                $inputFile.on('change', function () {
                    selectFileH5(this);
                });
            }else{
                var tempFiles={};
                var tempFilesIndex=0;
                $('#inputFile').uploadify({
                    // 'swf'      : 'http://cdn.597.cs/uploadify.swf',
                    'swf'      : 'js/uploadify/uploadify.swf',
                    // 'swf'      : 'uploadify.swf',
                    'uploader' :  options.uploadUrl,
                    'multi': true,
                    'onUploadStart' : function(file) {

                    },
                    'onUploadSuccess' : function(file, data, response) {
                        if(typeof (data)=='string'){
                            data=eval('('+data+')');
                        }
                        for(prop in data){
                            tempFiles[tempFilesIndex]=data[prop];
                            tempFilesIndex++;
                        }
                        debugger;
                        // options.success&&options.success(data);
                    },
                    'onQueueComplete' : function(queueData) {
                        debugger;
                        options.success&&options.success(tempFiles);
                        tempFiles={};
                        tempFilesIndex=0;
                        // alert(queueData.uploadsSuccessful + ' files were successfully uploaded.');
                    },
                    'onUploadError' : function(file, errorCode, errorMsg, errorString) {
                        debugger;
                        options.error&&options.error(errorCode);
                    }
                });
            }




            function calculate(file, callBack) {
                var fileReader = new FileReader(),
                    blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
                    chunkSize = 20971520,

                    chunks = Math.ceil(file.size / chunkSize),
                    currentChunk = 0,
                    spark = new SparkMD5();
                fileReader.onload = function (e) {
                    spark.appendBinary(e.target.result);
                    currentChunk++;
                    if (currentChunk < chunks) {
                        loadNext();
                    }
                    else {
                        /*var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(ee){
                            file.strBase64=ee.target.result
                            callBack(file, spark.end());
                        }*/
                        callBack(file, spark.end());
                    }
                };

                function loadNext() {
                    var start = currentChunk * chunkSize,
                        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                    fileReader.readAsBinaryString(blobSlice.call(file, start, end));
                };
                loadNext();
            }

            function selectFileH5(obj) {
                var log = document.getElementById("log");
                window.md5 = "/upload/api/?act=get";
                /*for(var i=0;i<fl;i++){
                    var file=obj.files[i];
                    calculate(file,function(e,md5){
                        md5 = md5+e.name.substr(e.name.lastIndexOf("."))
                        log.innerHTML+="<div id='"+md5+"'>文件名: "+e.name+"  MD5: "+md5+" ("+e.size.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')+" bytes)</div>\n";
                        window.md5=window.md5+"&md5="+md5;
                    });
                }*/
                var avalabeFiles = {};
                var recursionSign = 0;
                recursionCreateMd5();

                /**
                 * 生成文件md5
                 */
                function recursionCreateMd5() {
                    if (recursionSign < obj.files.length) {
                        calculate(obj.files[recursionSign], function (e, md5) {
                            recursionSign++;
                            if(options.preview){//启动预览
                                readFileContext(e,function () {
                                    avalabeFiles[md5 + e.name.substr(e.name.lastIndexOf("."))] = e;
                                    avalabeFiles[md5 + e.name.substr(e.name.lastIndexOf("."))].isUploaded='0';
                                    recursionCreateMd5();
                                })
                            }else{
                                avalabeFiles[md5+e.name.substr(e.name.lastIndexOf("."))]=e;
                                recursionCreateMd5();
                            }

                        });
                    } else {
                        recursionSign = 0;
                        filterMd5();
                    }
                }

                /**
                 * 读取文件内容转为base64字符串
                 * @param file
                 * @param callBack
                 */
                function readFileContext(file,callBack) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        file.strBase64 = e.target.result
                        callBack&&callBack(file);
                    }
                }


                /**
                 * 过滤文件列表
                 */
                function filterMd5() {

                    for (md5 in avalabeFiles) {
                        options.filterUrl += '&md5=' + md5;
                    }
                    //请求过滤
                    $.ajax({
                        url: options.filterUrl,
                        success: function (result) {

                            debugger;
                            if(options.preview){//启动预览
                                for(prop in result){
                                    avalabeFiles[prop].isUploaded=result[prop];
                                }
                                options.preview(avalabeFiles);
                            }else{

                            }
                            if(options.submitBtn){//手动提交
                                $(options.submitBtn).on('click',function () {
                                    debugger;
                                    uploadFilesH5(result);
                                })
                            }else{//自动提交
                                uploadFilesH5(result);
                            }
                        }
                    });
                }

                /**
                 * H5上传文件
                 * @param result 可上传文件列表
                 */
                function uploadFilesH5(result) {
                    var uploadForm = new FormData();
                    var j = 0;
                    for (key in result) {
                        // uploadForm.append('file['+j+']', avalabeFiles[key]);
                        debugger;
                        uploadForm.append(options.name, avalabeFiles[key]);
                        // uploadForm.append('file', avalabeFiles[key].strBase64);

                        j++;
                    }

                    debugger;
                    $.ajax({
                        url:options.uploadUrl ,
                        data: uploadForm,
                        type: 'POST',
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function (result) {
                            /*console.log(result);
                            console.log('渲染界面');*/
                            if(typeof (result)=='string'){
                                result=eval('('+result+')');
                            }
                            options.success&&options.success(result);
                        },
                        error : function() {
                            alert("图片上传异常！");
                        }
                    });
                }

                // $.get(window.md5);

            }

            function selectFileIE(obj) {
                // options.preview&&options.preview(obj);//启动预览
                /*if(options.submitBtn){//手动提交
                    $(options.submitBtn).on('click',function () {
                        uploadFilesIE();
                    })
                }else{//自动提交
                    uploadFilesIE();
                }
                /!**
                 * IE上传文件
                 * @param result 可上传文件列表
                 *!/
                function uploadFilesIE() {
                    $('#csupload').click();
                }*/
                // $('#inputFile object').click();//uploadify控件无法自定义触发时机

            }
        }

    }

})(jQuery);