define('product.jpCommon', function(require, exports, module) {

    var $ = module['jquery'],
        doc = document,
        win = win;
    $.fn.extend({
        bgiframe:function(s){
            //����ie7Ҳ����������⣬���Բ���ʲô�����������
            //if ($.browser.msie && /6.0/.test(navigator.userAgent))
            try
            {
                s = $.extend({ top: 'auto', left: 'auto', width: 'auto', height: 'auto', opacity: true, src: 'javascript:void(0);'
                }, s || {});

                var prop = function(n)
                {
                    return n && n.constructor == Number ? n + 'px' : n;
                };
                var width = this.outerWidth(true);
                var height = this.outerHeight(true);
                var html = this.find('.bgiframe');
                if (html.length > 0)
                {
                    html.remove();
                }
                html = '<iframe class="bgiframe" frameborder="0" tabindex="-1" src="about:blank"' + 'style="display:block;position:absolute;z-index:-1;' + (s.opacity !== false ? 'filter:Alpha(Opacity=\'0\');' : '') + 'top:' + (s.top == 'auto' ? '0px' : prop(s.top)) + ';' + 'left:' + (s.left == 'auto' ? '0px' : prop(s.left)) + ';' + 'width:' + prop(width) + ';' + 'height:' + prop(height) + ';' + ' overflow:hidden;"/>';
                this.prepend(html);
            } catch (e) { }
            return this;
        },
        textDefault: function(dclass,iclass){
            this.each(function(){
                var _this = $(this),
                    _dText = _this.find(dclass || ".def-text"),
                    _input = _this.find(iclass || "input[type='text']");
                _this.click(function(){
                    _dText.hide();
                    _input.focus();
                });
                _input.blur(function(){
                    if(/^[��\s]*$/.test($(this).val())){
                        _dText.show();
                    }
                });
            });
        },
        backTop:function(){
            var target = $(this);
            $(win).scroll(function(){
                if ($(doc).scrollTop() > 120){
                    target.find('a.backTop').css({'display':'inline-block'});
                }else{
                    target.find('a.backTop').css({'display':'none'});
                }
            });
            target.find('a.backTop').click(function(){
                $('html,body').animate({ scrollTop: 0 });
            });
        },
        watermark: function(){
            var getVal = function(el){
                    if (el.length == 0) return '';
                    if (el[0].type.toLowerCase() == 'a' || el[0].type.toLowerCase() == 'span'){
                        return el.html();
                    } else {
                        return el.val();
                    }
                },
                txtLabel = "txtLabel",
                createLabel = function(id, txt){
                    return '<label class="' + txtLabel + '" for="'+ id +'" style="display: none;">' + txt + '</label>';
                },
                status = '',
                attr = 'watermark',
                label, txt;
            var self = this;

            function toggleLabel(el, label){
                if(getVal(el) === ''){
                    label.show();
                } else {
                    label.hide();
                }
            }

            $.fn.resetWatermark = function(){
                $(this).each(function(){
                    var _this = $(this),
                        label = _this.parent().find('.' + txtLabel);
                    toggleLabel(_this, label);
                });
            }

            return $(this).each(function(){
                var _this = $(this);
                if(txt = _this.attr(attr)){
                    var label = _this.parent().find('.' + txtLabel);
                    if(!label.length){
                        label = $(createLabel(_this.attr('id'), txt)).prependTo(_this.parent());
                    }
                    toggleLabel(_this, label);
                    _this.on('focus blur', function(e){
                        var _this = $(this);

                        if(e.type === 'focus'){
                            label.hide();
                        } else {
                            toggleLabel(_this, label);
                        }
                    });
                }
            });
        },
        placeHolder: function(options){
            isPlaceHolder = "placeholder" in document.createElement('input');
            if(isPlaceHolder){
                $.fn.resetReplaceHolder = function(){}
                return $(this);
            }

            var getVal = function(el){
                    if (el.length == 0) return '';
                    if (el[0].type.toLowerCase() == 'a' || el[0].type.toLowerCase() == 'span'){
                        return el.html();
                    } else {
                        return el.val();
                    }
                },
                txtLabel = "txtLabel",
                createLabel = function(id, txt){
                    return '<label class="' + txtLabel + '" for="'+ id +'" style="display: none;">' + txt + '</label>';
                },
                status = '',
                attr = 'placeHolder',
                label,
                self = this;

            function toggleLabel(el, label){
                if(getVal(el) === ''){
                    label.show();
                } else {
                    label.hide();
                }
            }

            $.fn.resetPlaceHolder = function(){
                $(this).each(function(){
                    var _this = $(this),
                        label = _this.parent().find('.' + txtLabel);
                    toggleLabel(_this, label);
                });
            }

            return $(this).each(function(){
                var _this = $(this),
                    txt = _this.attr(attr);
                if(txt = _this.attr(attr)){
                    var label = _this.parent().find('.' + txtLabel);
                    if(!label.length){
                        label = $(createLabel(_this.attr('id'), txt)).prependTo(_this.parent());
                    }
                    toggleLabel(_this, label);
                    if(!options || (options && !options.isLabelClick)){
                        label.on('click', function(e){
                            _this.trigger(options && options.eventType || 'focus');
                        });
                    }
                    _this.on('focus blur click keyup', function(e){
                        var _this = $(this);
                        toggleLabel(_this, label);
                        options && options[e.type] && options[e.type].call(null, _this, label, !!_this.val());
                    });
                }
            });
        }
    });
    $.fn.bgIframe = $.fn.bgiframe;

    var zindex = 100,
        getZIndex = function() {
            return zindex++;
        };
    //��Ƭ��ʾ���
    $.showPhotoHD = function(node, photo, hdPhoto) {
        var el = $(node);
        var doc = $(document);
        var wnd = $(window);
        var offset = el.offset();
        var top = 0;
        var left = 0;
        var fix = 2;
        var isHd = false;
        var toTop = function(el, con) {
            top = offset.top - con.height() - fix - 3;
            left = offset.left + el.width() + fix;
            if (left + con.outerWidth() > wnd.scrollLeft() + wnd.width()) {
                left -= left + con.outerWidth() - wnd.scrollLeft() - wnd.width();
            }
            return top >= wnd.scrollTop();
        }

        var toBottom = function(el, con) {
            top = offset.top + el.height() + fix;
            left = offset.left - con.outerWidth() - fix;
            if (left < wnd.scrollLeft()) {
                left += wnd.scrollLeft() - left;
            }
            return top + con.outerHeight() <= wnd.scrollTop() + wnd.height();
        }
        //��λ
        var pos = function(el, con) {
            //����Ǹ�����ֱ�Ӷ�λ�����
            if (isHd) {
                top = offset.top;
                //310ΪСͼ�Ŀ�ȶ�+��ͼ�Ŀ��+��ɫ�ļ�ಿ��
                left = offset.left - con.outerWidth() + 310;
            } else {
                if (!toTop(el, con)) toBottom(el, con);
            }
            con.css({ top: top, left: left, 'z-index': getZIndex() });
            con.show();
            el.mouseout(function() {
                con.hide();
            });
        }

        if (hdPhoto) {
            var hdImg = $('img[src="' + hdPhoto + '"]');
            if (hdImg.length > 0) {
                isHd = true;
                pos(el, hdImg.closest('div.floatlayer_pic'));
                return;
            }
        } else {
            var norImg = $('img[src="' + photo + '"]');
            if (norImg.length > 0) {
                pos(el, norImg.closest('div.floatlayer_pic'));
                return;
            }
        }
        var src = null;
        var width = 0;
        var height = 0;
        if (hdPhoto) {
            isHd = true;
            src = hdPhoto;
            width = 180;
            height = 225;
        } else if (photo) {
            src = photo;
            width = 120;
            height = 150;
        }
        var img = $('<div class="" style="position:absolute;top:-1000px;left:-1000px;"><img width="'+width+'" height="'+height+'" src="' + src + '"/></div>');
        var div = $('<div style="position:absolute;overflow:hidden;" class="floatlayer_pic"></div>');
        div.append(img);
        div.css({ width: width + 4, height: height + 4 });
        div.appendTo('body');
        var failNotify = setTimeout(function() {
            div.addClass(isHd ? 'floatlayer_error2' : 'floatlayer_error').html('��Ƭ����ʧ��');
        }, 10000);
        img.find('img').load(function() {
            clearTimeout(failNotify);
            $(this).closest('div').css({ left: 0, top: 0 });
            $(this).closest('div').parent().bgIframe();
        });
        pos(el, div);
        el.mouseout(function() {
            div.hide();
        });
    }


    return $;
});/**
 *  dialog.js
 */

define('jpjob.jobDialog', function(require, exports, module){

    var $ = module['jquery'];
    var contextData = '_dialog';
    var cachedata = {};
    var arrweebox = new Array();
    var dialogID = 0;
    var getID = function() { return dialogID++; }
    var getElement = function(obj)
    {
        if ($.isPlainObject(obj)) return obj;
        if (typeof (obj) == 'string') return $(obj);
        return obj;
    }
    var zindex = 10000;
    var getZIndex = function() {
        return zindex++;
    };
    var errorHtml =
        '            	<div class="dialogError">' +
        '            		�ǳ���Ǹ�����ݼ���ʧ��' +
        '                </div>' +
        '               <div class="dialogErrBtn"><a class="btn1 btnsF12" onclick="$(this).closeDialog();" href="javascript:void(0)">�ر�</a></div>';
    var weebox = function(opt)
    {
        this.id = '';
        this.dh = null;
        this.mh = null;
        this.dc = null;
        this.dt = null;
        this.header = null; //����ͷ���������رհ�ť
        this.dw = null; //�����ڲ�װ���ݵĲ��֣����ÿ��ʱ���������
        this.db = null;
        this._dragging = false;
        this.cachedContent = null;
        this.options = null;
        this.contentInited = false;
        this._defaults = {
            src: null, //������confirm�Ի���ʱ���õ�ԭJquery�������¼�������ʱ����Բ�������ȥ
            cache: false,
            type: 'dialog', //���� message confirm dialog model hover anchor��
            title: '',
            width: 0,
            height: 0,
            maskClass: 'dialogMask', //���ֲ��class����
            timeout: 0,
            draggable: true,
            modal: true,    //�Ƿ�ģ̬
            focus: null,
            blur: null,
            left: 0,
            top: 0,
            position: 'center',
            anchorPosition: true, //�Ƿ�ʼ�ն�λ��ĳһλ�ã�ֻ��ĳЩ״̬����Ч
            dependElement: null,
            keepHover: null, //Ҫ���ָ������ڵĽڵ㣬���������Щ�ڵ���ʱ����رո�������
            overlay: 30,
            icon: '',
            showBackground: true,
            showBorder: true,
            showHeader: true,
            showButton: true,
            showCancel: true,
            showClose: true,
            showOk: true,
            showMask: false, //�Ƿ���ʾ����
            okBtnName: 'ȷ��',
            cancelBtnName: 'ȡ��',
            content: '',
            contentType: 'text',
            contentChange: false,
            clickClose: false,
            animate: '',
            showAnimate: '',
            hideAnimate: '',
            onclose: null, //�¼�
            onopen: null,
            oncancel: null,
            onok: null
            //select: { url: '', type: 'radio', tele: '', vele: '', width: 120, search: false, fn: null }
        };

        var self = this;
        //��ʼ��ѡ��
        this.initOptions = function()
        {
            var tempOpt = opt || {};
            tempOpt.animate = tempOpt.animate || '';
            tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
            tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
            self.options = $.extend({}, this._defaults, tempOpt);
        };

        //��ʼ������Box
        this.initBox = function()
        {
            if (self.options.id)
            {
                self.id = self.options.id;
            } else
            {
                self.id = getID();
            }

            var html = '';
            switch (self.options.type)
            {
                case 'anchor': //��λ����Ļĳһλ�õĴ���
                    var iconFont  = ''; //����ͼ��
                    var typeClass = ''; //����class
                    switch (self.options.icon)
                    {
                        case 'success':
                            iconFont = '&#xf058;';
                            typeClass = 'prtSuccess';
                            break;
                        case 'fail':
                            iconFont = '&#xf057;';
                            typeClass = 'prtFail';
                            break;
                        case 'warning':
                            iconFont = '&#xf06a;';
                            typeClass = 'prtWarning';
                            break;
                        case 'question':
                            iconFont = '&#xf059;';
                            typeClass = 'prtQuestion';
                            break;
                        case 'info':
                            iconFont = '&#xf06a;';
                            typeClass = 'prt prtInfo';
                            break;
                    }
                    html = '<div class="_dialog" id="_dialog' + self.id + '">' +
                        '	<div class="prt ' + typeClass + '">' +
                        '    	<div class="prtCon">'+
                        '    		<i class="jpFntWes">' + iconFont +'</i><span class="_dialogContent prtTxt"></span><span class="clear"></span>' +
                        '    	</div>' +
                        '    </div>' +
                        '</div>';
                    break;
                case 'message': //��ʾ����
                case 'confirm': //ȷ�ϴ���
                    html = '<div class="_dialog dialog" id="_dialog' + self.id + '">' +
                        '	<div class="dialogCon">' +
                        '    <div class="dialogHead _dialogHeader"><span class="_title">ϵͳ��Ϣ</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="�ر�">��</a></div> ' +
                        '	<table border="0" cellspacing="0" cellpadding="0">' +
                        '		<tr>' +
                        '			<td class="dialog-cl"></td>' +
                        '			<td>' +
                        '				<div class="_container dialogContent"><div class="_dialogContent popTxt"></div>' +
                        '				<div class="_dialog-button dialogBtn">' +
                        '					<a href="javascript:void(0)" class="btn1 btnsF12 _dialogOk">ȷ&nbsp;��</a>' +
                        '					<a href="javascript:void(0)" class="btn3 btnsF12 _dialogCancel">ȡ&nbsp;��</a>' +
                        '				</div>' +
                        '</div>' +
                        '			</td>' +
                        '			<td class="dialog-cr"></td>' +
                        '		</tr>' +
                        '	</table>' +
                        '	</div>' +
                        '</div>';
                    break;
                case 'modal': //ģʽ����
                case 'dialog': //��ģʽ����
                    html = '<div class="_dialog dialog" id="_dialog' + self.id + '">' +
                        '<div class="dialogCon">' +
                        '	<div class="dialogHead _dialogHeader"><span class="_title">ϵͳ��Ϣ</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="�ر�">��</a></div> ' +
                        '	<table border="0" cellspacing="0" cellpadding="0">' +
                        '		<tr>' +
                        '			<td class="dialog-cl"></td>' +
                        '			<td>' +
                        '				<div class="_container _dialogContent dialogContent"></div>' +
                        '			</td>' +
                        '			<td class="dialog-cr"></td>' +
                        '		</tr>' +
                        '	</table>' +
                        '</div>' +
                        '</div>';
                    break;
                case 'running':
                    html = '<div class="_dialog dialog" id="_dialog' + self.id + '" style="padding:0;">' +
                        '<div class="dialogCon"  style="background:none;_overflow:hidden;">' +
                        '	<div class="dialogHead _dialogHeader"><span class="_title">ϵͳ��Ϣ</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="�ر�"></a></div> ' +
                        '	<table border="0" cellspacing="0" cellpadding="0">' +
                        '		<tr>' +
                        '			<td class="dialog-cl"></td>' +
                        '			<td>' +
                        '				<div class="_container _dialogContent dialogContent" style="padding:0;overflow:inherit"></div>' +
                        '			</td>' +
                        '			<td class="dialog-cr"></td>' +
                        '		</tr>' +
                        '	</table>' +
                        '</div>' +
                        '</div>';
                    break;
                case 'img': //ͼƬ
                    html = '<div class="_dialog" id="_dialog' + self.id + '"></div>';
                    break;
            }
            self.dh = $(html).appendTo('body').css({
                position: 'absolute',
                //    overflow: 'hidden',
                zIndex: getZIndex(),
                left: -10000,
                top: -10000
            });

            // ��ʼ����ʽ��Ԫ��
            if (self.options.type == 'message' || self.options.type == 'confirm')
            {
                self.dh.addClass('dialogSel');
            }
            self.dc = self.find('._dialogContent');
            self.dt = self.find('._title');
            self.dw = self.find('._container');
            self.header = self.find('._dialogHeader');
            self.db = self.find('._dialogButton');

            if (self.options.boxclass)
            {
                self.dh.addClass(self.options.boxclass);
            }
            if (self.options.height > 0)
            {
                self.dc.css('height', self.options.height);
            }
            if (self.options.width > 0)
            {
                self.dw.css('width', self.options.width);
            }
            if (self.options.position == 'anchorRight')
            {
                self.dh.addClass('anchorRight');
            }
            self.dh.data(contextData, self);
        }

        //��ʼ������
        this.initMask = function()
        {
            if (self.options.showMask)
            {
                // �Ƿ���ʾ���ֲ�
                var pos = function() {
                    var h, w;
                    var wnd = $(window);
                    var doc = $(document);
                    if (doc.height() > wnd.height())
                    {
                        h = doc.height() - 5; //self.bheight();
                        w = doc.width() - 21;
                    } else
                    {
                        h = doc.height() - 5; //self.bheight();
                        w = doc.width() - 5;
                    }
                    return {height:h,width:w};
                }

                //��ʱ����type=modeal�����ֲ���ʽ
                if(self.options.type == 'modal') {
                    self.options.maskClass='dialogMask';
                }
                var isIE6=$.browser.msie&&($.browser.version=="6.0");
                if(isIE6)
                {
                    // ���Ie 6bug
                    var a = pos();
                    self.mh = $('<div id="_mask' + self.id + '" class="' + self.options.maskClass + '"></div>')
                        .appendTo('body').show().css(
                        {
                            width: a.width,
                            height: a.height,
                            position:'absolute',
                            zIndex: getZIndex()
                        }).bgiframe();
                    //.animate({opacity: 0.5},500)
                    $(window).resize(function()
                    {
                        var a = pos();
                        self.mh.css({ height: a.height, width: a.width });
                    });
                }
                else
                {
                    self.mh = $('<div id="_mask' + self.id + '" class="' + self.options.maskClass + '"></div>')
                        .appendTo('body').show().css(
                        {
                            zIndex: getZIndex()
                        });
                    //.animate({opacity: 0.5},500)
                }
            }
        }
        // ����title
        this.setTitle = function(title)
        {
            if (title == '')
            {
                self.dt.html('&nbsp;');
            } else
            {
                self.dt.html(title);
            }
        }

        //��ʼ����������
        this.initContent = function(content)
        {
            // ����title
            self.setTitle(self.options.title);
            self.dh.find("._dialogOk").val(self.options.okBtnName);
            self.dh.find("._dialogCancel").val(self.options.cancelBtnName);

            // �Ƿ���ʾheader
            if (!self.options.showHeader)
            {
                self.header.hide();
            }
            // �Ƿ���ʾ�߿�
            if (!self.options.showBorder)
            {
                self.dh.css({ border: 'none' });
                self.dc.css({ border: 'none' });
            }
            // ������ɫ
            if (!self.options.showBackground)
            {
                self.dh.css({ background: 'none' });
                self.dc.css({ background: 'none' });
            }
            // ��ʾ��ť
            if (!self.options.showButton)
            {
                self.dh.find('._dialogButton').hide();
            }
            // �Ƿ���ʾȡ����ť
            if (!self.options.showCancel)
            {
                self.dh.find('._dialogCancel').hide();
            }
            //�Ƿ���ʾ�رհ�ť
            if (!self.options.showClose)
            {
                self.dh.find('._dialogClose').hide();
            }
            // �Ƿ���ʾok��ť
            if (!self.options.showOk)
            {
                self.dh.find("._dialogOk").hide();
            }

            //���û��ͼ�����ݲ�ƫ��
            /*
             if (!self.options.icon)
             {
             //self.dc.css({padding:0});
             }
             */
            if (self.options.contentType == "selector")
            {
                // �����ѡ��һ��Ԫ��
                var content = getElement(self.options.content).clone(true);
                content.show();
                content.css('display', 'block');
                self.setContent(content);
                self.contentInited = true;
                self.onopen();
            } else if (self.options.contentType == "ajax")
            {
                // ����һ��ҳ�浽����
                self.setLoading();
                //return;
                var stop = self.stopLoading;
                setTimeout(stop, 8000);
                var url = self.options.content;
                $.ajax(
                    {
                        url: url,
                        dataType: 'html',
                        isWindow: true,
                        success: function(data)
                        {
                            self.stopLoading();
                            self.setContent(data);
                            self.innerShow(true);
                            if (self.options.cache)
                            {
                                self.cachedContent = data;
                            }
                            self.contentInited = true;
                            self.onopen();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown)
                        {
                            self.stopLoading();
                            self.setContent(errorHtml);
                            self.innerShow(true);
                            if (self.options.cache)
                            {
                                self.cachedContent = data;
                            }
                            self.contentInited = true;
                            self.onopen();
                        }
                    });
            } else if (self.options.contentType == "iframe")
            {
                /*����iframeʹ�������ֱ����������ҳ�� by ePim*/
                var html = '<style type="text/css">';
                html += ('\n.dialog-box .dialogContent{padding:0px;}');
                html += ('\n</style>');
                html += ('<iframe class="dialogIframe" src="' + self.options.content + '" width="100%" height="100%" frameborder="0"></iframe>');
                self.setContent(html);
                self.contentInited = true;
                self.onopen();
                //self.show();
            } else if (self.options.contentType == 'img')
            {
                var html = '<div class="floatlayer_pic"><img src="' + self.options.content + '" /></div>';
                self.setContent(html);
                self.contentInited = true;
                self.onopen();
            } else
            {
                self.setContent(self.options.content);
                self.contentInited = true;
                self.onopen();
            }
        }

        //��ʼ�������¼�
        this.initEvent = function()
        {
            self.dh.find("._dialogClose, ._dialogCancel, ._dialogOk")
                .unbind('click').click(function() {
                    $(this).closeDialog();
                    return false;
                });
            //���û����¼��̰�ťʱ��ȡ����ť
            self.dh.keydown(function(event)
            {
                var e = $.event.fix(event);
                //esc���� ��Ч���˳���ť
                if (e.keyCode == 27)
                {
                    var cancell = self.dh.find('._dialogCancel');
                    if (cancell.is(':visible'))
                    {
                        cancell.click();
                    } else if (self.dh.find('._dialogClose').is(':visible'))
                    {
                        self.dh.find('._dialogClose').click();
                    }
                }
            });
            self.dh.mousedown( function() { self.dh.css('z-index', getZIndex()) });
            if (self.options.onok)
            {
                self.setOnok(self.options.onok);
            }

            if (self.options.oncancel)
            {
                self.setOncancel(self.options.oncancel);
            }

            if (self.options.timeout > 0)
            {
                window.setTimeout(self.close, (self.options.timeout * 1000));
            }
            if (self.options.type == 'hover') {
                $('body').mousedown(function(event) {
                    var e = $.event.fix(event);
                    var src = e.target;
                    var keep = false;
                    if (self.dh[0] == src || $.contains(self.dh[0], src)){
                        keep = true;
                    }
                    //�������ģʽ������Ҳ���ر�
                    $('._dialog').each(function() {
                        if ($.contains(this, src)) {
                            keep = true;
                        }
                    });
                    if (!keep && self.options.keepHover) {
                        if ($.isArray(self.options.keepHover)) {
                            try{
                                for (var i in self.options.keepHover){
                                    if (typeof self.options.keepHover[i] == 'string'){
                                        $(self.options.keepHover[i]).each(function(){
                                            if (this == src || $.contains(this, src)){
                                                keep = true;
                                            }
                                        });
                                    } else{
                                        var el = self.options.keepHover[i][0];
                                        if (el == src || $.contains(el, src)){
                                            keep = true;
                                        }
                                    }

                                }
                            } catch (e) { }
                        } else
                        {
                            try
                            {
                                if (typeof self.options.keepHover == 'string') {
                                    $(self.options.keepHover).each(function(){
                                        if (this == src || $.contains(this, src)){
                                            keep = true;
                                        }
                                    });
                                } else{
                                    var el = self.options.keepHover[0];
                                    if (el == src || $.contains(el, src)){
                                        keep = true;
                                    }
                                }
                            } catch (e) { }
                        }
                    }
                    if (!keep) {
                        self.close();
                    }
                });

                self.dh.find('tr').each(function(){
                    $(this).mouseover(function() { $(this).addClass('cu'); }).mouseout(function() { $(this).removeClass('cu'); });
                });
            }
            self.drag();
        }

        //����onok�¼�
        this.setOnok = function(fn)
        {
            //self.dh.find(".dialog-ok").unbind('click');
            if (typeof (fn) == "function")
            {
                var src = self.options.src;
                self.dh.find("._dialogOk").click(function() { fn(src); });
            } else if (typeof fn == 'number')
            {
                self.dh.find("._dialogOk").click(function()
                {
                    window.history.go(fn);
                });
            } else if (typeof fn == 'string')
            {
                self.dh.find("._dialogOk").click(function()
                {
                    window.location = fn;
                });
            }
        }
        //����onOncancel�¼�
        this.setOncancel = function(fn)
        {
            //self.dh.find(".dialog-cancel").unbind('click');
            if (typeof (fn) == "function")
            {
                var src = self.options.src;
                self.dh.find("._dialogClose,._dialogCancel").click(function() { fn(src) });
            } else if (typeof (fn) == "number")
            {
                self.dh.find("._dialogClose,._dialogCancel").click(function() { window.history.go(fn); });
            } else if (typeof (fn) == "function")
            {
                self.dh.find("._dialogClose,._dialogCancel").click(function() { window.location = fn; });
            }
        }

        //��ǰ�Ļص�����
        this.onopen = function()
        {
            if (typeof (self.options.onopen) == "function")
            {
                self.options.onopen(self);
            }
        }

        //�ر��¼�
        this.onclose = function()
        {
            //����Ǽ��ص�ҳ�棬��ո�����ʾ����
            /*
             if (self.options.contentType == 'ajax' && (self.options.type == 'modal' || self.options.type == 'dialog'))
             {
             // clearHighLight();
             }*/
            if (typeof self.options.onclose == 'number')
            {
                window.history.go(self.options.onclose);
            } else if (typeof self.options.onclose == 'string')
            {
                setTimeout('window.location = "' + self.options.onclose + '";', 100);

            } else if (typeof (self.options.onclose) == "function")
            {
                var src = self.options.src;
                return self.options.onclose(src);
            }
        }

        //������ק
        this.drag = function()
        {
            //ȡ���϶�Ч������Ϊ������iframe���϶�����
            return;
            if (self.options.draggable && self.options.showHeader)
            {
                var header = self.dh.find('._dialogHeader');
                header.css('cursor', 'move');
                var mouseMove = function(event)
                {
                    var h = self;
                    //var o = document;
                    var width = h.dh.width();
                    var height = h.dh.height();
                    if (window.getSelection){
                        window.getSelection().removeAllRanges();
                    } else{
                        document.selection.empty();
                    }
                    var left = event.clientX - h.mx; // Math.max(event.clientX - h.mx, 0);
                    var top = event.clientY - h.my; //Math.max(event.clientY - h.my, 0);
                    h.dh.css({ left: left, top: top });
                };
                var mouseUp = function(){
                    var h = self;
                    if (h.releaseCapture)
                    {
                        h.releaseCapture();
                    }
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                };
                var mouseDown = function(event){
                    var dhleft = parseInt(self.dh.css('left').replace('px'));
                    var dhtop = parseInt(self.dh.css('top').replace('px'));
                    self.mx = event.clientX - dhleft; // event.clientX;
                    self.my = event.clientY - dhtop; //event.clientY;
                    if (self.setCapture)
                    {
                        self.setCapture();
                    }

                    $(document).mousemove(mouseMove).mouseup(mouseUp);
                };
                header.mousedown(mouseDown);
            }
        }
        //����һ����ť
        this.addButton = function(opt){
            opt = opt || {};
            opt.title = opt.title || 'OK';
            opt.bclass = opt.bclass || 'dialog-btn1';
            opt.fn = opt.fn || null;
            opt.index = opt.index || 0;
            var btn = $('<input type="button" class="' + opt.bclass + '" value="' + opt.title + '">').click(function()
            {
                if (typeof opt.fn == "function") opt.fn(self);
            });
            if (opt.index < self.db.find('input').length)
            {
                self.db.find('input:eq(' + opt.index + ')').before(btn);
            } else
            {
                self.db.append(opt);
            }
        }
        this.hide = function(fn){
            if (typeof self.options.hideAnimate == "string")
            {
                self.dh.hide(self.options.animate, fn);
            } else
            {

                self.dh.animate(self.options.hideAnimate.animate, self.options.hideAnimate.speed, "", fn);
            }
        }
        //���õ�������
        this.focus = function()
        {/*
         if (self.options.focus)
         {
         self.dh.find(self.options.focus).focus(); //TODO IE��Ҫ����
         self.dh.find(self.options.focus).focus();
         } else
         {
         self.dh.find('._dialogCancel').focus();
         }*/
        }
        //�ڵ����ڲ���Ԫ��
        this.find = function(selector)
        {
            return self.dh.find(selector);
        }
        //���ü��ؼ�״̬
        this.setLoading = function(){
            self.setContent('<div class="dialogLoading">�����У����Ժ�</div>');
        }
        //ֹͣ����״̬
        this.stopLoading = function(){
            try
            {
                if(self.loading&&typeof self.loading != "undefined")
                {
                    self.loading.remove();
                }
            } catch (e) { } finally
            {
                self.loading = null;
                return;
            }
        }

        this.setWidth = function(width){
            self.dw.width(width);
        }
        //ȡ�ñ���
        this.getTitle = function()
        {
            return self.dt.html();
        }

        //��������
        this.setContent = function(content) {
            if (typeof content == 'string'){
                self.dc.html(content);
            } else
            {
                self.dc.append(content);
            }
            if (self.options.height > 0)
            {
                self.dc.css('height', self.options.height);
            } else
            {
                self.dc.css('height', '');
            }
            if (self.options.width > 0)
            {
                //self.dh.css('width', self.options.width);
            } else
            {
                self.dh.css('width', '');
            }
            if (self.options.showButton)
            {
                self.dh.find("._dialog-button").show();
            }
        }

        //ȡ������
        this.getContent = function()
        {
            return self.dc.html();
        }

        //���ð�ť
        this.disabledButton = function(btname, state)
        {
            self.dh.find('._dialog' + btname).attr("disabled", state);
        }
        //���ذ�ť
        this.hideButton = function(btname)
        {
            self.dh.find('._dialog' + btname).hide();
        }
        //��ʾ��ť
        this.showButton = function(btname)
        {
            self.dh.find('._dialog' + btname).show();
        }
        //���ð�ť����
        this.setButtonTitle = function(btname, title)
        {
            self.dh.find('._dialog' + btname).val(title);
        }
        //�������
        this.next = function(opt)
        {
            opt = opt || {};
            opt.title = opt.title || self.getTitle();
            opt.content = opt.content || "";
            opt.okname = opt.okname || "ȷ��";
            opt.width = opt.width || 260;
            opt.onok = opt.onok || self.close;
            opt.onclose = opt.onclose || null;
            opt.oncancel = opt.oncancel || null;
            opt.hideCancel = opt.hideCancel || true;
            self.setTitle(opt.title);
            self.setButtonTitle("ok", okname);
            self.setWidth(width);
            self.setOnok(opt.onok);
            if (opt.content != "") self.setContent(opt.content);
            if (opt.hideCancel) self.hideButton("cancel");
            if (typeof (opt.onclose) == "function") self.setOnclose(opt.onclose);
            if (typeof (opt.oncancel) == "function") self.setOncancel(opt.oncancel);
            self.show();
        }

        this.toggle = function()
        {
            if (self.options.id && self.dh && self.dh.length > 0)
            {
                try
                {
                    var d = self; //$('#_dialog' + self.options.id).data(contextData);
                    if (d.dh.is(':visible'))
                    {
                        d.close();
                    } else
                    {
                        d.show();
                    }
                } catch (e) { alert('toggle:' + e.message); }
            } else
            {
                if (self.dh && self.dh.length && self.dh.is(':visible'))
                {
                    self.close();
                } else
                {
                    self.show();
                }
            }
        }

        //��ʾ����
        this.show = function()
        {
            //�ر����еĲ�
            if (self.options.id)
            {
                try
                {
                    //�д�
                    var d = $('#_dialog' + self.options.id); //.data(contextData);
                    //d.close();
                    if (d.size() > 0) return;
                } catch (e) { }
            }

            var dialog = self.options.id ? self : $.extend({}, self);
            dialog.initMask();
            dialog.initBox();
            dialog.initContent();
            // if (dialog.options.contentType != 'ajax')
            {
                dialog.innerShow();
            }
            return false;
        }

        this.innerShow = function(isComplete)
        {
            var dialog = self;
            dialog.initEvent();
            dialog.initPosition();
            if (dialog.mh)
            {
                dialog.mh.show();
            }
            if (dialog.options.showAnimate == "toggle" || dialog.options.showAnimate == "slide" || dialog.options.showAnimate == "fade")
            {
                switch (dialog.options.animate)
                {
                    case 'toggle':
                        dialog.dh.hide().show(400);
                        break;
                    case 'slide':
                        dialog.dh.hide().slideDown(400);
                        break;
                    case 'fade':
                        dialog.dh.hide().fadeIn(400, function()
                        {
                            //�ۼ���ȷ����رհ�ť
                            var ok = self.dh.find('._dialogOk');
                            if (ok.is(':visible'))
                            {
                                ok.focus();
                            } else
                            {
                                self.dh.find('._dialogClose').focus();
                            }
                        });
                        break;
                }
            } else if (dialog.options.showAnimate)
            {
                dialog.dh.animate(dialog.options.showAnimate.animate, dialog.options.showAnimate.speed, function()
                {
                    //�ۼ���ȷ����رհ�ť
                    var ok = self.dh.find('._dialogOk');
                    if (ok.is(':visible'))
                    {
                        ok.focus();
                    } else
                    {
                        self.dh.find('._dialogClose').focus();
                    }
                });
            } else
            {
                dialog.dh.show();
                //�ۼ���ȷ����رհ�ť
                var ok = self.dh.find('._dialogOk');
                if (ok.is(':visible'))
                {
                    ok.focus();
                } else
                {
                    self.dh.find('._dialogClose').focus();
                }
            }
            if(self.options.showMask)self.dh.bgiframe();
        }

        //�رյ���
        this.close = function(n)
        {
            var result = self.onclose(result);
            if(typeof result !='undefined' && !result){
                return;
            }

            //���ùرպ�Ľ���
            if (self.options.blur)
            {
                $(self.options.blur).focus();
            }
            //��������ɾ��
            for (i = 0; i < arrweebox.length; i++)
            {
                if (arrweebox[i].dh.get(0) == self.dh.get(0))
                {
                    arrweebox.splice(i, 1);
                    break;
                }
            }
            //�رջص��������Ƴ�����
            var closeCallback = function()
            {
                self.dh.remove();
                if (self.mh)
                {
                    /*
                     self.mh.animate({opacity:0},{complete:function()
                     {
                     self.mh.remove();
                     }});
                     */
                    self.mh.remove();
                }
            };
            if (self.options.showAnimate == "toggle" || self.options.showAnimate == "slide" || self.options.showAnimate == "fade")
            {
                switch (self.options.animate)
                {
                    case 'toggle':
                        self.dh.hide(400, closeCallback);
                        break;
                    case 'slide':
                        self.dh.slideUp(400, closeCallback);
                        break;
                    case 'fade':
                        self.dh.fadeOut(400, closeCallback);
                        break;
                }
            } else if (self.options.showAnimate)
            {
                self.dh.animate(self.options.showAnimate.animate, self.options.showAnimate.speed, closeCallback);
            } else
            {
                //self.dh.hide();
                closeCallback();
            }
        }
        //ȡ�����ո߶�
        this.bheight = function()
        {
            if ($.browser.msie && $.browser.version < 7)
            {
                var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                var offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);

                if (scrollHeight < offsetHeight)
                {
                    return $(window).height();
                } else
                {
                    return scrollHeight;
                }
            } else
            {
                return $(document).height();
            }
        }
        //ȡ�����տ��
        this.bwidth = function()
        {
            if ($.browser.msie && $.browser.version < 7)
            {
                var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                var offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

                if (scrollWidth < offsetWidth)
                {
                    return $(window).width();
                } else
                {
                    return scrollWidth;
                }
            } else
            {
                return $(document).width();
            }
        }
        //��ʼ������λ��
        this.initPosition = function(obj)
        {
            var src = obj || self.dh;
            if (self.options.position == 'center' || self.options.type == 'modal' || self.options.position == 'anchor' || self.options.position == 'anchorRight')//���Զ�λ��ĳ��λ��
            {
                self.anchorToPos(src);
                if (self.options.anchorPosition)
                {
                    var anchor = function(s)
                    {
                        return function() { self.anchorToPos(s); };
                    } (src);

                    anchor = $.proxy(anchor, self);
                }
                return;
            } else {
                var depend = getElement(self.options.dependElement);
                var offset = depend.offset();
                var wnd = $(window);
                var doc = $(document);
                var left = 0, top = 0;

                var toDepend = function()
                {
                    left = depend.offset().left;
                    if (offset.left + self.dh.outerWidth() > doc.width())
                    {
                        left = doc.width() - src.outerWidth() - 10;
                    }
                    top = offset.top - src.outerHeight();
                    if (offset.top + self.dh.outerHeight() > doc.height())
                    {
                        top = doc.height() - src.outerHeight() - 10;
                    }
                }

                var toTop = function()
                {
                    var dependTop = 0;
                    if (self.options.type == 'menu' && self.options.container)
                    {
                        offset = depend.position();
                        dependTop = depend.offset().top;
                    }

                    left = offset.left;
                    top = offset.top - src.outerHeight();
                    if (left + self.dh.outerWidth() > wnd.scrollLeft() + wnd.width()) left -= left + self.dh.outerWidth() - wnd.scrollLeft() - wnd.width()

                    if (self.options.type == 'menu') top++;
                    return top + dependTop >= wnd.scrollTop();
                }

                var toUnder = function()
                {
                    var dependTop = 0;
                    if (self.options.type == 'menu' && self.options.container)
                    {
                        offset = depend.position();
                        //�������������Լ������ֽ��еĵ�����ֻ�м������ֲ���Ҫ����ڸ��������ж�λ���������������document
                        offset.top += 3;
                        offset.left += 10;
                        dependTop = depend.offset().top;
                    }
                    left = offset.left;
                    top = offset.top + depend.outerHeight();
                    if (self.options.type == 'menu') top--;
                    return top + dependTop + self.dh.outerHeight() <= wnd.scrollTop() + wnd.height();
                }
                var toAuto = function()
                {
                    try
                    {
                        var offset = depend.offset();
                        left = offset.left + depend.outerWidth();
                        top = offset.top - src.outerHeight();
                    } catch (e) { }
                }

                if (self.options.position == 'depend')
                {
                    toDepend();
                } else if (self.options.position == 'top')//��λ��ĳԪ������
                {
                    if (!toTop()) toUnder();
                }
                else if (self.options.position == 'under')//��λ��ĳԪ������
                {
                    if (!toUnder()) toTop();
                } else if (self.options.position == 'auto')
                {
                    toAuto();
                }
            }
            src.css({ left: Math.max(left, 0), top: Math.max(top, 0) });
        }

        // ��λ
        self.anchorToPos = function(obj)
        {
            var src = obj || self.dh;
            /*
             if (!$.support.fixed)
             {
             top = doc.scrollTop();
             left = doc.scrollLeft();
             }
             */
            // 2013-07-25 momo ���ݴ���Ч�����е���

            // ���ж�λ
            var pos = function(obj) {
                var wnd = $(window);
                var doc = $(document);
                var top = 0;
                var left = 0;
                top = doc.scrollTop();
                left = doc.scrollLeft();
                top += (wnd.height() - obj.outerHeight()) / 2;
                left += (wnd.width() - obj.outerWidth()) / 2;
                return {t:top,l:left};
            };
            var postion  = pos(src);
            src.css({left: postion.l, top: postion.t });
        }

        // ��ʼ������
        self.initOptions();
    }

    this.singleID = '';
    this._onbox = false;
    this._opening = false;
    this.zIndex = 999;
    var length = function()
    {
        return arrweebox.length;
    }

    //�ر�Ψһ�Ի���
    $.fn.closeSingleDialog = function()
    {
        try
        {
            var container = $('#_dialog' + this.singleID);
            var context = container.data(contextData);
            context.close();
        } catch (e) { }
    }

    //�رյ�ǰ�Ի���
    $.fn.closeDialog = function()
    {
        try
        {
            var container = this.getDialog();

            var context = container.data(contextData);
            context.close();
        } catch (e) { alert(e.message); }
    }

    //��ȡ��ǰ�Ի���
    $.fn.getDialog = function()
    {
        return this.closest('._dialog');
    }

    //��ȡ��ǰ�Ի����ʵ������
    $.fn.getDialogItem = function()
    {
        var container = this.getDialog();
        return container.data(contextData);
    }

    //��ȡ���������Թ���dialog����
    var getContentOption = function(content)
    {
        var contentType = 'html';
        if (/^#/.test(content))
        {
            contentType = 'selector';
        } else if (/\.(png|aspx|ashx|html|htm|asp)/i.test(content))
        {
            contentType = 'ajax';
        } else if (/\.(jpg|png|gif)$/i.test(content))
        {
            contentType = 'img';
        }
        else// if(/^(http:)|(https:)/.test(href))
        {
            contentType = 'html';
        }
        return { content: content, contentType: contentType };
    }

    //��Ϣ��
    $.message = function(msg, options)
    {
        var opt = {};
        if (typeof options == 'function' || typeof options == 'string' || typeof options == 'number')
        {
            opt.onclose = options;
        } else
        {
            opt = $.extend(opt, options);
        }
        opt.type = 'message';
        opt.position = 'center';
        opt.contentType = 'html';
        opt.showMask = opt.showMask || true;
        opt.icon = opt.icon || 'success';
        opt.content = msg;
        //opt.animate = 'fade';
        opt.title = opt.title || 'ϵͳ��ʾ';
        opt.draggable = false;
        opt.id = '_tooltip' + getID();
        opt.showCancel = false;
        //opt.animate='slow';
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //��Ϣ��
    $.fn.message = function(msg, options)
    {
        var opt = {};
        if (typeof options == 'function' || typeof options == 'string' || typeof options == 'number')
        {
            opt.onclose = options;
        } else
        {
            opt = $.extend(opt, options);
        }
        opt.type = 'message';
        opt.position = 'center';
        opt.contentType = 'html';
        opt.icon = opt.icon || 'success';
        opt.content = msg;
        opt.showMask = opt.showMask || true;
        //opt.animate = 'fade';
        opt.title = opt.title || 'ϵͳ��ʾ';
        opt.draggable = false;
        opt.id = '_tooltip' + getID();
        opt.showCancel = false;
        //opt.animate='slow';
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //ȷ�Ͽ�
    $.confirm = function(msg, title, ok, cancell)
    {
        var opt = {};
        opt.src = this;
        opt.type = 'confirm';
        opt.position = 'center';
        opt.contentType = 'html';
        opt.icon = 'question';
        opt.content = msg;
        opt.showMask = true;
        //opt.animate = 'fade';
        opt.draggable = false;
        opt.id = '_tooltip' + getID();
        //opt.okBtnName='��';
        //opt.cancelBtnName='��';
        if (typeof title == 'function')
        {
            opt.onok = title;
            opt.oncancell = ok;
        } else
        {
            opt.title = title;
            opt.onok = ok;
            opt.oncancel = cancell;
        }
        opt.title = opt.title || 'ϵͳ��ʾ';
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //ȷ�Ͽ�
    $.fn.confirm = function(msg, title, ok, cancell)
    {
        var opt = {};
        opt.src = this;
        opt.type = 'confirm';
        opt.position = 'center';
        opt.contentType = 'html';
        opt.icon = 'question';
        opt.content = msg;
        //opt.animate = 'fade';
        opt.draggable = false;
        opt.showMask = true;
        opt.id = '_tooltip' + getID();
        //opt.okBtnName='��';
        //opt.cancelBtnName='��';
        if (typeof title == 'function')
        {
            opt.onok = title;
            opt.oncancell = ok;
        } else
        {
            opt.title = title;
            opt.onok = ok;
            opt.oncancel = cancell;
        }
        opt.title = opt.title || 'ϵͳ��ʾ';
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //��ָ����url����ʾ�Ի���
    $.showDialog = function(url, options)
    {
        var opt = options || {};
        opt.content = url;
        opt.contentType = opt.contentType || 'ajax';
        //if (typeof opt.animate == 'undefined') opt.animate = 'fade';
        opt.type = opt.type || 'dialog';
        opt.position = opt.depend || 'depend';
        opt.dependElement = $($.event.fix(event).target);
        opt.showButton = opt.showButton || false;
        opt.draggable = true;
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //��ָ����url����ģʽ������ʾ�Ի���draggable
    $.showModal = function(url, options)
    {
        var opt = options || {};
        opt.content = url;
        opt.contentType = opt.contentType || 'ajax';
        //if (typeof opt.animate == 'undefined') opt.animate = 'fade';
        opt.showMask = opt.showMask || true;
        opt.type = 'modal';
        opt.showButton = opt.showButton || false;
        //opt.draggable = opt.draggable || false;
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //�ṩ��λ����Ļ��ĳ��λ�õĴ�����ʾ
    $.anchor = function(msg, options)
    {
        var opt = options || {};
        opt.type = 'anchor';
        opt.position = opt.position || 'center';
        opt.content = msg;
        //opt.animate = 'fade';
        opt.contentType = 'html';
        opt.timeout = opt.timeout || 2;
        if (typeof opt.icon == 'undefined') opt.icon = 'success';
        opt.draggable = false;
        opt.showMask = false;
        opt.id = '_anchor' + getID();
        opt.showButton = false;
        var box = new weebox(opt);
        box.show();
        return box;
    }

    //��ʾһ����Ϣ��ʾ��2������ʧ
    $.anchorMsg = function(msg, opt)
    {
        opt = opt || {};
        if (typeof opt.timeout == 'undefined') opt.timeout = 2;
        //opt.timeout = 0;
        $.anchor(msg, opt);
    }

    $.showError = function(msg)
    {
        msg = msg || '�ǳ���Ǹ�����ݼ���ʧ��';
        var errorHtml =
            '            	<div class="dialogError">' +
            '            		' + msg +
            '                </div>' +
            '               <div class="dialogPopBtn"></div>';

        $.showModal(errorHtml, { conentType: 'html'});
    }
    //���ð�ť״̬Ϊ��������״̬
    $.fn.running = function(msg, opt)
    {
        if ($.isPlainObject(msg))
        {
            opt = msg;
            msg = null;
        }
        msg = msg || '���ڴ������Ժ�';
        opt = $.extend({}, opt);
        opt.type = 'dialog';
        opt.position = 'auto';
        opt.dependElement = this;
        opt.contentType = 'html';
        opt.content = '<div class="tipLoad"><div class="tipLoadTxt">' + msg + '</div></div>';
        //opt.animate = 'fade';
        opt.showHeader = false;
        opt.showBorder = false;
        opt.showBackground = false;
        opt.draggable = false;
        opt.showButton = false;
        opt.id = new Date().getTime();
        var box = new weebox(opt);
        box.show();
        this.data('running', box);
        return box;
    }

    //�ָ���������״̬�İ�ťΪ����״̬
    $.fn.stopRunning = function()
    {
        var running = this.data('running');
        try
        {
            running.close();
        } catch (e)
        { }
    }

    return $;

});

/**
 *  jQuery  jort.js
 *  Copyright (c)  ZhangYu
 */

define('jpjob.jobsort2', 'jpjob.jobDialog', function(require, exports, module){

    var $ = module['jquery'],
        dialog = module['jpjob.jobDialog'];
    var jobsort = function(element,opt) {
        this.id = '';
        this.dh = null; //
        this.dc = null; // ����
        this.df = null; // �ײ�
        this.$element = $(element),
            this.options = null; //������Ϣ
        this.hd = null;
        this.currLevel = 1;
        this.lastSelectItem = ['NULL','����'];
        this._defaults ={
            url: '/api/web/jobclass.api?id=0',
            multipleUrl:'/api/web/jobclass.api?act=multiple&id=',
            allSubUrl:'/api/web/jobclass.api?id=',
            isLimit:false,
            max:5,
            tipClass:'tipClass',
            hddName:'hddName',
            inputName:'jobSortName',
            selectItems:[],
            selectClass:'cu',
            type:'multiple', // single|multiple
            unLimitedLevel:3,
            onSelect:null,
            target:null
        };

        var self = this;
        //��ʼ��ѡ��
        this.initOptions = function(){
            var tempOpt = opt || {};
            tempOpt.animate = tempOpt.animate || '';
            tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
            tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
            self.options = $.extend({}, this._defaults, tempOpt);
        };

        this.initHtml= function(type) {
            // ��ʼ���ؼ�
            var html =' <span><div class="prompt clearfix">'+
                '<span class="max">����ѡ����</span>'+
                '<div class="left"><a href="#">����</a><label> | ��ѡ��</label></div>'+
                ' </div>'+
                ' <div class="dropLst">'+
                ' <div class="dropLstCon">'+
                '     <div class="lst lst1">'+
                '        <ul>'+
                '        </ul>'+
                '     </div>'+
                '    <div class="lst lst2">'+
                '    	<ul>'+
                '       </ul>'+
                '    </div>'+
                '    <div class="lst lst3">'+
                '     	<ul>'+
                '       </ul>'+
                '    </div>'+
                '    <div class="clear"></div>'+
                ' </div> '+
                ' </div></span>';
            self.dh =$(html).appendTo(self.$element).find('.dropLst');//.hide()
            self.hd =self.$element.find('.prompt').show();
            self.tipElement = self.hd;//��������
            self.hc = self.$element.find('.dropLstCon');
            self.hddElement = $('<input type="hidden" name="'+self.options.hddName+'"/>').appendTo(self.$element);
            // �Ƿ�����
            if(self.options.isLimit){
                self.tipElement.find('.unlimited').hide();
            }

            // ����һ�����
            var url = self.options.url;
            self.loadData(url,self.selectItem);
            if(self.isSingle()) {
                self.tipElement.find('.unlimited').hide().end().find('p').html('��ѡ����ࣻ����ѡ�񼴿��޸ĵ�ǰѡ��');
                // self.hd.find('.JobCay').hide();
                self.hd.find('.dropIco').html('&#xf0d7;');
                self.hd.removeClass('dropSet').addClass('dropRdSet');
            }else {
                self.tipElement.find('.max').html("����ѡ"+self.options.max+"��");
            }
            if(self.options.selectItems.length>0) {
                var jobsorturl = self.options.multipleUrl+self.options.selectItems.join(',');
                self.options.selectItems = [];
                self.loadData(jobsorturl,self.setControl);
            }

        };

        // ��ʼ���¼�
        this.initEvent = function() {
            self.dh.find('.closeDrop').click(function() {
                self.dh.hide();
            });
            self.dh.find('.unlimited').click(function(){
                self.dh.hide();
                self.reset();
                //self.hd.find('.left').before($('<span class="seled" d="null,����">����<i class="delSel">��</i></span>'));
            });
            self.hd.click(function(e) {
                var target = $(e.target);
                if(target.is('.delSel')) {
                    self.lastSelectItem = target.parent().attr('d').split(',');
                    self.checkItem(false);
                    e.stopPropagation();
                    return;
                }
                self.dh.show();
            });
            // ѡ��һ������
            self.dh.find('.lst1 ul').click(function(e) {
                var target = $(e.target);
                if(target.is('input')) {
                }else if(target.is('label') || target.is('li')) {
                    target = target.is('label') ? target.closest('li') : target;
                    self.currLevel = 2;
                    $(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);

                    self.lastSelectItem = $(target).attr('d').split(',');
                    self.isChecked = $(target).find('input').is(':checked');
                    self.isDisabled = $(target).find('input').is(':disabled');
                    var url = self.options.url+self.lastSelectItem[0];
                    self.loadData(url,self.selectItem);

                }
            });

            // ѡ���������
            self.dh.find('.lst2 ul').click(function(e) {
                var target = $(e.target);
                self.lastSelectItem = $(target).closest('li').attr('d').split(',');
                if(target.is('input')) {
                    self.checkItem(target.is(':checked'));
                }else if(target.is('label') || target.is('li')) {
                    var target = target.is('label') ? target.closest('li') : target;
                    if(target.is('li[isParent]')) {
                        var target = target.closest('li');
                        var input = $(target).find('input:visible');
                        if(input.length<=0) {
                            return;
                        }
                        var disabled = $(target).find('input').is(':disabled');
                        var checked = $(target).find('input').is(':checked');
                        if($(target).find('input').is(':radio')&&checked) {
                            return;
                        }
                        if(disabled) {
                            return;
                        }
                        if(checked) {
                            $(target).find('input').removeAttr('checked');
                        }else {
                            $(target).find('input').attr('checked','checked');
                        }
                        self.checkItem(!checked);
                        return;
                    }
                    self.currLevel = 3;
                    $(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
                    self.isChecked = $(target).find('input').is(':checked');
                    self.isDisabled = $(target).find('input').is(':disabled');
                    var url = self.options.url+self.lastSelectItem[0];
                    self.loadData(url,self.selectItem);

                }
            });

            // ѡ��������
            self.dh.find('.lst3 ul').click(function(e) {
                var target = $(e.target);
                self.lastSelectItem = $(target).closest('li').attr('d').split(',');
                if(target.is('input')) {
                    //target.attr("checked","checked");
                    self.checkItem(target.is(':checked'));
                }else if(target.is('label') || target.is('li')) {
                    var target = target.is('label') ? target.closest('li') : target;
                    var input = $(target).find('input:visible');
                    if(input.length<=0) {
                        return;
                    }
                    var disabled = $(target).find('input').is(':disabled');
                    var checked = $(target).find('input').is(':checked');
                    if($(target).find('input').is(':radio')&&checked) {
                        return;
                    }
                    if(disabled) {
                        return;
                    }
                    if(checked) {
                        $(target).find('input').removeAttr('checked');
                    }else {
                        $(target).find('input').attr('checked','checked');
                    }
                    self.checkItem(!checked);
                }
            });

            self.hc.mouseover(function(e){
                var target = $(e.target);
                if(target.is('li')){
                    self.hc.find('li').removeClass('hov');
                    target.addClass('hov');
                }
                else if(target.closest('li').length>0) {
                    self.hc.find('li').removeClass('hov');
                    target.closest('li').addClass('hov');
                }
            });

        };

        this.show =function () {
            this.initOptions();
            this.initHtml();
            this.initEvent();
        };

        // ɾ����
        this.delItems = function(data) {
            $.each(data,function(i,n){
                if(self.options.selectItems.contains(n.jobsort)) {
                    self.del(n.jobsort,n.jobsort_name);
                }
            });
        };

        // ɾ����ѡ��
        this.del = function(id,name) {
            self.hd.find('.seled[d="'+id+','+name+'"]').remove();
            self.options.selectItems.remove(id);
            self.hddElement.val(self.options.selectItems.join(','));
            self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');

        };
        this.add = function(id,name) {
            if(self.isSingle()) {
                self.hd.find('.left').after($('<a class="label seled" d="'+id+','+name+'">'+name+'</a>'));
            }else {
                self.hd.find('.left').after($('<a class="label seled" d="'+id+','+name+'">'+name+'<i class="delSel">��</i></a>'));
            }
            if(!self.options.selectItems.contains(id)) {
                self.options.selectItems.push(id);
            }
            self.hddElement.val( self.options.selectItems.join(','));
        };

        // ѡ���¼�
        this.loadData = function(url,callback) {
            // ѡ����ʱ
            $.ajax({
                url: url,
                type: "get",
                dataType: "jsonp",
                success: function(data) {
                    if(typeof callback == 'function') {
                        callback(data);
                    }
                }
            });
        };

        // ��ѡѡ��
        this.checkRadio = function() {
            var id = self.lastSelectItem[0],
                name = self.lastSelectItem[1],
                url = self.options.url+ id;
            /*	 ȡ������
             self.loadData(url,function(data){
             $.each(data,function(i,n){
             self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').attr('disabled','disabled');
             });
             });*/
            if(self.isExists(id)) {
                return;
            }
            // ɾ��֮ǰ��
            self.hd.find('.seled[d]').each(function(){
                var obj = $(this).attr('d').split(','),
                    delurl = self.options.url+ obj[0];
                self.del(obj[0],obj[1]);
            });
            // ���������֮ǰ��ѡ�еģ��Ƴ�Inupt�е����ɾ���ؼ��еļ�¼
            self.loadData(url,self.delItems);
            // ������ǰ�inPut��
            self.add(id,name);
            self.dh.hide();
        };

        this.checkMultiple = function() {
            var isLimit = false;
            if(self.options.selectItems.length+1>self.options.max) {
                //self.tipElement.addClass(self.options.tipClass);
                isLimit = true;
            }else {
                //self.tipElement.removeClass(self.options.tipClass);
                isLimit = false;
            }
            return isLimit;
        };

        // check��
        this.checkItem = function(isChecked) {
            var id = self.lastSelectItem[0],
                name = self.lastSelectItem[1],
                url = self.options.allSubUrl+ id,
                isSingle = self.isSingle();
            if(isChecked) {
                self.hd.find('.seled[d="null,����"]').remove();
                if(isSingle) {
                    self.checkRadio(id);
                }else {
                    if(self.checkMultiple()) {
                        self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
                        $.anchor('������ѡ��'+self.options.max+'��',{icon:'info'});
                        return;
                    }
                    // ѡ�е�ǰ��
                    self.dh.find('li[d="'+id+','+name+'"]').addClass("cur").find('input').attr('checked',true);
                    self.loadData(url,function(data){
                        // ���������֮ǰ��ѡ�еģ��Ƴ�Inupt�е����ɾ���ؼ��еļ�¼
                        self.delItems(data);
                        // ����н��ò�ѡ�����е�����
                        $.each(data,function(i,n){
                            self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').attr('checked','checked').attr('disabled','disabled');

                        });
                    });
                    // ������ǰ���
                    self.add(id,name);
                }
            }else {
                self.dh.find('li[d="'+id+','+name+'"]').removeClass("cur").find('input').removeAttr('checked');
                self.loadData(url,function(data){
                    $.each(data,function(i,n){
                        self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').removeAttr('checked').removeAttr('disabled');
                    });
                });
                self.del(id,name);
                // self.checkMultiple();
            }
            if(typeof self.options.onSelect =='function') {
                self.options.onSelect();
            }
        };


        // �Ƿ����
        this.isExists = function(id) {
            return self.options.selectItems.contains(id);
        };
        // �Ƿ�ѡ
        this.isSingle = function(id) {
            return self.options.type=='single';
        };
        this.selectItem= function(data) {
            var arr = new Array(),
                pid = self.lastSelectItem[0],
                pname = self.lastSelectItem[1],
                isSingle = self.isSingle(),
                createItem = function(isSigle,pid,id,name,isdisabled,isChecked,isParent,isFirst,isShowControl) {
                    var s = new StringBuilder();
                    s.Append('<li d="'+id+','+name+'"');
                    if(isFirst) {
                        s.Append(' class="ths"');
                    }
                    if(isParent) {
                        s.Append(' isParent="true"');
                    }
                    s.Append('>');

                    if(isSigle) {
                        s.Append('<input type="radio" class="rdo" name="'+self.options.inputName+'" ');
                    }else {
                        s.Append('<i class="jpFntWes">&#xf105;</i><input type="checkbox"  class="chb" name="'+self.options.inputName+'" ');
                    }
                    if(isdisabled) {
                        if(!self.isSingle()) {
                            s.Append(' disabled="disabled"');
                            s.Append(' checked="checked"');
                        }
                    }
                    else if(isChecked) {
                        s.Append(' checked="checked"');
                    }
                    if(!isShowControl) {
                        s.Append(' style="display:none;"');
                    }
                    s.Append(' />');
                    if(isParent) {
                        s.Append('<label>ȫ��('+name+')</label>');
                    }else {
                        s.Append('<label>'+name+'</label>');
                    }
                    s.Append('</li>');
                    return s.toString();
                };

            //&&!isSingle
            if(self.currLevel>=self.options.unLimitedLevel) { // �Ƿ�����������ʾ��ǰ��
                arr.push(createItem(isSingle,pid,pid,pname,self.isDisabled,self.isChecked,true,true,true));
            }

            if(self.currLevel == 1) {
                // һ��ְλ���
                $.each(data,function(i,n){
                    arr.push('<li d="'+n.jobsort+','+n.jobsort_name+'"><label>'+n.jobsort_name+'</label></li>');
                });
                self.dh.find('.lst1 ul').empty().html(arr.join(''));
            }else if(self.currLevel == 2) {
                self.dh.find('.lst2 ul').empty();
                self.dh.find('.lst3 ul').empty();
                var bool = false;
                $.each(data,function(i,n){
                    bool = true;
                    var item = createItem(isSingle,pid,n.jobsort,n.jobsort_name,self.isChecked,self.isExists(n.jobsort),false,false,false);
                    arr.push(item);
                });
                if(bool) {
                    self.dh.find('.lst2 ul').html(arr.join(''));
                }
            }else {
                self.dh.find('.lst3 ul').empty();
                var bool = false;
                $.each(data,function(i,n){
                    bool = true;
                    var item = createItem(isSingle,pid,n.jobsort,n.jobsort_name,self.isChecked,self.isExists(n.jobsort),false,false,true);
                    arr.push(item);
                });
                if(bool) {
                    self.dh.find('.lst3 ul').html(arr.join(''));
                }
            }
        };

        this.setControl = function(data) {
            $.each(data,function(i,n){
                self.lastSelectItem[0] = n.jobsort;
                self.lastSelectItem[1] = n.jobsort_name;
                //TODO:�������Ƿ�ѡ��
                self.checkItem(true);
            });
        }
        this.reset = function() {
            self.options.selectItems = [ ];
            //  this.hc.find('.lst2 ul li').remove();
            //  this.hc.find('.lst3 ul li').remove();
            this.hc.find('input[type="checkbox"],input[type="radio"]').removeAttr('checked').removeAttr('disabled');
            this.hd.find('.seled').remove();
            this.$element.find('input[name="'+this.options.hddName+'"]').val(' ');
        }

        // ����ֵ
        this.setValue = function(items) {
            var values = items.split(','),
                newArr = new Array(),
                isSingle = self.isSingle();
            if(isSingle) {
                var jobsorturl = self.options.multipleUrl+items;
                self.loadData(jobsorturl,self.setControl);
            }else {
                for(var i =0,len = values.length;i<len;i+=1) {
                    if(!self.isExists(values[i])) {
                        //self.options.selectItems.push(values[i]);
                        newArr.push(values[i]);
                    }
                }
                if(newArr.length>0) {
                    var jobsorturl = self.options.multipleUrl+newArr.join(',');
                    self.loadData(jobsorturl,self.setControl);
                }
            }


        };

        // ��ȡ����
        this.getValue = function() {
            var v=new Array();
            this.hd.find('.seled').each(function(){
                var area = $(this).attr('d');
                v.push(area);
            });
            return v;
        };
        $('body').click(function(e){
            // ��ⷢ����body�еĵ���¼������������ؼ�
            var cell = $(e.target);
            if (cell)
            {
                var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
                var inID = self.$element.attr('id');
                var isTagert = false;
                try
                {
                    // ����¼�����Ԫ�ز���InputԪ�� ���Ҳ��Ƿ�����ʱ��ؼ�����
                    isTagert = tgID != inID && $(cell).closest('#' + inID).length <= 0;
                }
                catch (e)
                {
                    isTagert = true;
                }
                if (isTagert && !self.options.target)
                {
                    self.dh.hide();
                }
            }
        });
    };

    var old = $.fn.jobsort;

    $.fn.jobsort = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.jobsort');
            var options = typeof option == 'object' && option;
            if (!data) {
                $this.data('bs.jobsort', (data = new jobsort(this, options)));
                data.show();
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    }
    $.fn.setJobSortValue = function(ids) {
        var jobsort = $(this).data('bs.jobsort');
        jobsort.setValue(ids);
    };

    $.fn.getJobSortValue = function() {
        var jobsort = $(this).data('bs.jobsort');
        return jobsort.getValue();
    };

    $.fn.removeJobSortValue = function(id,name) {
        var jobsort = $(this).data('bs.jobsort');
        return jobsort.del(id,name);
    };
    $.fn.resetJobsortValue = function() {
        var jobsort = $(this).data('bs.jobsort');
        jobsort.reset();
    };

    $.fn.jobsort.Constructor = jobsort;
    // �����ͻ
    $.fn.jobsort.noConflict = function () {
        $.fn.jobsort = old;
        return this;
    }

    return $;
});// JavaScript Document

define('product.jobSortActions',
    function(require, exports, module){

        var $ = module['jquery'];
        //����
        var side_menu = $("#job_filter_box");//��ѡ����
        side_menu.find(".one_sort .mutil").click(function(){
            //��ѡ
            var onesort = $(this).closest(".one_sort").removeClass("one_sort").addClass("many_sort");
            onesort.next(".actions-oper").show();

            onesort.find("li").each(function(){
                if($(this).find(".first").hasClass("cur"))$(this).find("a").addClass("cur");
                else $(this).find(".sub_link").removeClass("cur");
            });
        });
        side_menu.find(".one_sort li").each(function(){
            checked($(this));
        });
        //����ɸѡ
        var filter_group = $("#filter_group");
        filter_group.find(".mutil").click(function(){
            //��ѡ
            var _this = $(this),
                filter_menu = _this.closest(".filter_menu");
            filter_menu.toggleClass("mutil_mode");

            if(!_this.get(0).bindClick)_this.get(0).bindClick = filter_menu.each(function(){checked($(this));});

            if(_this.html().indexOf("��ѡ") > -1){
                _this.html("�ص�ѡ");
            }
            else _this.html('��ѡ<i class="jpFntWes">&#xf067;</i>');

        });
        filter_group.find(".filter_menu").hover(function(){
            $(this).addClass("filter_menu_select");
        },function(){
            $(this).removeClass("filter_menu_select");
        });
        //ѡ��orȡ��
        function checked(_self){
            _self.find("a").click(function(){
                var _this = $(this),//��ǰ
                    _subSort = _self.find(".sub_sort"),//һ��
                    _sub_link = _self.find(".sub_link"); //����

                if(_this.closest(".many_sort").length >= 1 || _this.closest(".mutil_mode").length >= 1){
                    _this.toggleClass("cur");//ѡ�л�ȡ��
                    _subSort.find(".first").removeClass("cur");
                    //�ж�Ϊһ��
                    if(_this.hasClass("sub_link")){
                        _this.hasClass("cur") ? _subSort.find("a").addClass("cur") : _subSort.find("a").removeClass("cur");
                    }else{
                        //����
                        _subSort.find("a").length - _subSort.find(".cur").length == 1 ? _sub_link.addClass("cur") :	_sub_link.removeClass("cur");
                    }
                    return false;
                }
            });
        };
        //�ύ�������ȡ��
        var checkOper = {
            //�ύ
            submit:function(sortli){
                var _ArrVal = new Array();
                sortli.each(function(){
                    var _this = $(this),_sub_link = _this.find(".sub_link"); //����
                    if(_sub_link.hasClass("cur")){
                        if(_this.parent(".first").length <= 0 && _sub_link.attr("data-value"))_ArrVal.push(_sub_link.attr("data-value"));
                    }else{
                        _this.find(".cur").each(function(){
                            var _cur = $(this);
                            if(!_cur.hasClass("first") && !_cur.hasClass("hide") && _cur.attr("data-value")){
                                _ArrVal.push(_cur.attr("data-value"));
                            }
                        });
                    }
                });
                return _ArrVal;
            },
            //���
            remove:function(sortli){
                sortli.find(".cur").removeClass("cur");
            },
            //ȡ��
            cancel:function(sortli){
                sortli.find(".dft_checked").addClass("cur");
                sortli.each(function(){
                    if($(this).find(".cur").length > 0)$(this).find(".sub_link").addClass("cur");
                });
                sortli.closest("td").find(".many_sort").addClass("one_sort").removeClass("many_sort").next(".actions-oper").hide();
                sortli.parents(".filter_menu").removeClass("mutil_mode").find(".mutil").html('��ѡ<i class="jpFntWes">&#xf067;</i>');
            }
        };

        //��Ƹ��ҵ\�����ص�\�������� ��ť����
        $("#frmCalling,#frmArea,#frmReward,#filter_group .actions-oper").click(function(e){
            var _this = $(this),
                sortli = _this.closest("td").find("li");
            if(_this.closest(".mutil_mode").length >= 1){
                sortli = _this.prev(".normal_list");
            }
            switch($(e.target).attr("data-type")){
                case "submit":
                    var hid = _this.find(".many-hidden"),
                        val = checkOper.submit(sortli);
                    if(val&&val!='')hid.val(hid.attr("type-value")+val.join(","));
                    //else hid.remove();
                    else hid.val('all');
                    _this.closest("form").submit();
                    break;
                case "remove":
                    checkOper.remove(sortli);
                    break;
                case "cancel":
                    checkOper.remove(sortli);
                    checkOper.cancel(sortli);
                    break;
            }
        });
    });