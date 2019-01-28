/**
 * Created by Administrator on 2017/3/8.
 */
$(function() {
	/**
	 * 图片裁剪器
	 * 
	 * @author 陈南阳
	 * @vision 1.0.0
	 * @createtime 2018-03-06
	 * @reference jquey-1.8.3.min.js+ jquery-ui-widget.js
	 *            jquery.iframe-transport.js jquery.fileupload.js
	 *            js/layer-v3.0.2/layer.js layer.css jquery.Jcrop.js
	 *            jquery.Jcrop.css
	 */
	(function(w) {
		w.imgCutor = {};
		w.imgCutor.open = open;
		/**
		 * 打开图片裁剪器窗口
		 * 
		 * @params {object} options 初始化参数
		 * @desciption options包含以下属性： title 裁切器标题 yesbt 裁切器确定按钮标题 nobt 裁切器取消按钮标题
		 *             filebt 裁切器浏览按钮标题 uploadurl 原图上传功能后台服务地址 imgcuturl
		 *             截图处理功能后台服务地址，本插件会再选定截图区域后给该服务接口传递参数x、y、width、height
		 *             yescall 裁切完成后回调(yesbt按钮确定后触发)
		 *             包含参数，形如：{bigimg:'http:www.server.com/bigimg.jpg',bigimg:'http:www.server.com/litteimg.jpg'}
		 */
		function open(options) {
			if (!options) {
				return 'error:options must be require';
			}
			if (!options.uploadurl) {
				return 'error:uploadurl must be require';
			}

			var title = options.title || '图片裁剪器';
			var yesbt = options.yesbt || '确定';
			var nobt = options.nobt || '取消';
			var filebt = options.filebt || '浏览';
			var noimgmsg = options.noimgmsg || '请先选择裁切的图片！';
			closeloading();//关闭上传已有上传进度条
			layer.open({
				type : 1,
				title : title,
				shadeClose : true,
				shade : 0.8,
				// area: ['50%', '60%'],
				area : [ '820px', '580px' ],
				btn : [ yesbt, nobt, filebt ],
				content : sHtml,// content内容形式由type参数决定，1为html文本，2为iframe嵌套页面...
				success : function() {
					/* 初始化上传控件 */
					initialFileButton(options.uploadurl);
				},
				yes : function(index, dom) {
					if (!$('#target').attr('src')) {
						alert(noimgmsg);
						return false;
					}
					// 将确定裁切尺寸发送给服务器进行裁切，在回调函数里进行回调
					var x = $('#x').val();
					var y = $('#y').val();
					var width = $('#w').val();
					var height = $('#h').val();
					var oSize = {
						x : $('#x').val(),
						y : $('#y').val(),
						width : $('#w').val(),
						height : $('#h').val()
					};
					var imgUrl = $('#target').attr('src');
					/* http://localhost:8080/mtwsns-snss/sgmtw/UploadImg/ImgCut?imgUrl=/upload/album/photo/20170307/WecuC5qudSecppji.png&x=10&y=10&width=100&height=100 */
					var url = options.imgcuturl + '?imgUrl=' + imgUrl + '&x='
							+ x + '&y=' + y + '&width=' + width + '&height='
							+ height;
					$.get(url, function(data) {
						data = JSON.parse(data);
						if (data && options.yescall) {
							data.ori = $('#target').attr('src');
							options.yescall.apply(null, [ data ]);
						} else {
							options.yescall.apply(null, [ null ]);
						}
					});
					layer.close(index);
				},
				cancel : function(index) {
					
					closeloading();
				},
				btn3 : function() {// 浏览文件确定按钮
					$('#fileuploadBtn').click();
					return false;
				}
			});
		}

		/**
		 * 浏览文件按钮初始化
		 */
		function initialFileButton(uploadUrl) {
			$('#fileuploadBtn').fileupload({
				url : uploadUrl,
				dataType : 'json',
				pasteZone : $('#fileuploadBtn'),
				formData : {},
				done : function(e, data) {				
					
					if (data.result.flag != undefined) {
						if (data.result.flag == "false") {
							var j_lang_err = locale.indexOf('zh')>-1?"文件上传失败！":"File upload failed!"
							layer.alert(j_lang_err);
							closeloading();
							return false;
						}
					}

					var img = new Image();
					img.onload = function() {
						$('#target').attr('src', data.result[0].ori);
						change_image(data.result[0].ori);
					}
					img.src = data.result[0].ori;

				},
				change : function(e, data) {
				},
				fail : function(e, data) {

				},
				progressall : function(e, data) {
				
					console.log(data.loaded + '--' + data.total);
				},
				send:function(e, data){
					openloading();
				}
			});
		}

		/**
		 * 图片裁切器初始化
		 * 
		 * @param {string}
		 *            sImgSrc 将要裁切的大图url
		 */
		function change_image(sImgSrc) {
			/* 设置各个位置img的src begin */
			$('#target,#preview,#preview2,.jcrop-holder img').attr('src',
					sImgSrc);
			/* 设置各个位置img的src end */

			/* 测试 begin */
			// $("#target").attr('src', 'images/eeeeeee.png');
			// $("#preview").attr('src', 'images/eeeeeee.png');
			// $("#preview2").attr('src', 'images/eeeeeee.png');
			/* 测试 end */

			var iOrignHeight = $('#target').height();
			var iTargetW = $('#target').width();
			var iTargetH = $('#target').height();
			/* 限定图片则固定区域内 begin */
			if (iTargetW > iTargetH) {
				$('#target').css({
					'width' : '100%'
				});
			} else {
				$('#target').css({
					'height' : '100%'
				});
			}
			/* 限定图片则固定区域内 begin */

			// 存储缩放比例
			// var
			// iOrignScale=Math.round(($('#target').width()/iTargetW)*100)/100;
			var iOrignScale = iTargetW / $('#target').width();
			var jcrop_api, boundx, boundy;
			setTimeout(function() {
				$('#target').Jcrop({
					minSize : [ 48, 48 ],// 初始化最小裁切区域
					setSelect : [ 0, 0, 220, 220 ],// 初始化裁切区域
					onChange : updatePreview,
					onSelect : updatePreview,
					onSelect : updateCoords,
					aspectRatio : 1
				}, function() {
					// Use the API to get the real image size
					var bounds = this.getBounds();
					boundx = bounds[0];
					boundy = bounds[1];
					// Store the API in the jcrop_api variable
					jcrop_api = this;
				});

				function updatePreview(c) {
					if (parseInt(c.w) > 0) {
						var rx = 48 / c.w; // 小头像预览Div的大小
						var ry = 48 / c.h;

						$('#preview').css({
							width : Math.round(rx * boundx) + 'px',
							height : Math.round(ry * boundy) + 'px',
							marginLeft : '-' + Math.round(rx * c.x) + 'px',
							marginTop : '-' + Math.round(ry * c.y) + 'px'
						});
					}
					{
						var rx = 199 / c.w; // 大头像预览Div的大小
						var ry = 199 / c.h;
						$('#preview2').css({
							width : Math.round(rx * boundx) + 'px',
							height : Math.round(ry * boundy) + 'px',
							marginLeft : '-' + Math.round(rx * c.x) + 'px',
							marginTop : '-' + Math.round(ry * c.y) + 'px'
						});
					}
				}
				;

				function updateCoords(c) {
					// $('#x').val(c.x);
					// $('#y').val(c.y);
					// $('#w').val(c.w);
					// $('#h').val(c.h);
					// 因为原图放到容器里有进行缩放，所以要原图比例映射裁切尺寸，以便推送给服务器。
					$('#x').val(parseInt(c.x * iOrignScale));
					$('#y').val(parseInt(c.y * iOrignScale));
					$('#w').val(parseInt(c.w * iOrignScale));
					$('#h').val(parseInt(c.h * iOrignScale));
				}
				;
				closeloading();
			}, 500);

		}

		/* 弹出框html */
		var sLoadingImg = '<div class="loadingImg" style="display:none;position:absolute;left:206px;top:206px;width:37px; height:37px;background: url(js/imgcutor1.0.0/images/loading0.gif) no-repeat center center;">'
				/*+ '<p class="item1" style="display:none;margin:0 6px;width:14px;height:14px;background:#4898d5;float:left"></p>'
				+ '<p class="item2" style="display:none;margin:0 6px;width:14px;height:14px;background:#4898d5;float:left"></p>'
				+ '<p class="item3" style="display:none;margin:0 6px;width:14px;height:14px;background:#4898d5;float:left"></p>'
				+ '<p class="item4" style="display:none;margin:0 6px;width:14px;height:14px;background:#4898d5;float:left"></p>'
				+ '<p class="item5" style="display:none;margin:0 6px;width:14px;height:14px;background:#4898d5;float:left"></p>'*/
				+ '</div>';

				var background='url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC\');';
		var sHtml = sLoadingImg+'<div id="imgcutor" style="width:450px;height: 450px;float: left;background: '+background+';margin:0 20px;"><img  id="target"></div>'
				+ '<div style="width:190px;height:195px;margin:0 20px;overflow:hidden; float:right;"><img style="float:left;" id="preview2" ></div>'
				+ '<div style="width:48px;height:48px;margin:0 10px;overflow:hidden; float:right;"><img style="float:left;" id="preview" ></div>'
				+ '<div style="clear: both;"></div>'
				+ '<form action="#" method="post" onsubmit="return checkCoords()" style="width: 0;height: 0;" enctype="multipart/form-data" id="form">'
				+ '<input type="file" name="file" style="width: 0;height: 0;" id="fileuploadBtn" onchange="">'
				+ '<input type="hidden" id="x" name="x" />'
				+ '<input type="hidden" id="y" name="y" />'
				+ '<input type="hidden" id="w" name="w" />'
				+ '<input type="hidden" id="h" name="h" />' +
				// '<input type="submit" value="裁剪"/>'+
				'</form>';
		var iNow = 0;
		var timer =null;
		function openloading(){
			timer= setInterval(function() {
				if (iNow == 5) {
					iNow = 0
					$('.loadingImg').find('p').hide();
				} else {
					iNow++;
					$('.loadingImg').find('.item' + iNow).show();
				}
			}, 200);
		}

		function closeloading(){
			iNow = 0;
			clearInterval(timer);
			$('.loadingImg').find('p').hide();
		}			
				
	})(window);

});