function isPc() {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return 0;
    } else {
        return 1;
    }
}

/*function preload(api) {
    var img = new Image();
    img.src = api;
}*/
function analysis() {
    var t = isPc();//类型：1pc,2手机，
    var url = encodeURIComponent(document.URL);//当前url
    var referer = encodeURIComponent(document.referrer);//来源url
    var defaultParms = {t: t, url: url, referer: referer};
    if(analysis.parms) {
        defaultParms = extend(defaultParms, analysis.parms);
    }
    defaultParms.api = defaultParms.api || '192.168.1.10:88';
    var apiStr = '//' +  defaultParms.api + '/?_='+new Date().getTime();
    for (var parm in defaultParms) {
        if (parm&&parm!='api') {
            apiStr=apiStr+'&'+parm+'='+defaultParms[parm];
        }
    }
    analysis.img.src = apiStr;
}
analysis.img = new Image();
analysis.setParms=function (parms) {
    analysis.parms=parms;
    return analysis;
}
setTimeout(function () {
    analysis();
});



/**
 * 合并两个对象
 * @param obj1
 * @param obj2
 * @remark
 * 如有同名属性，则obj2将覆盖obj1
 */
function extend(obj1, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key) === true) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}

