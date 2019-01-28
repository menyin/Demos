(function ($) {
    $.tip=function (msg,times,callback) {
        var winH=document.documentElement.clientHeight;
        var tipTop=winH/2-30;
        var $tipHtml=$('<div style="width: 100%;height:100%;position:fixed;top:0;left:0;line-height: 100%;text-align: center;vertical-align: middle;">\n' +
            '    <span style="margin-top:'+tipTop+'px;display:inline-block;background: rgba(0,0,0,0.6);border-radius:4px;padding:14px;color:#fff;text-align: center;">'+msg+'</span>\n' +
            '</div>')
        $('body').append($tipHtml);
        setTimeout(function () {
            $tipHtml.remove();
            if(callback){callback();}
        },times||1000)
    }
})($)