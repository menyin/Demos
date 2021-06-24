define(function(require, exports,module) {
    var $ = require("$")
        ,tmp = {
        ua : window.navigator.userAgent.toLowerCase()
        ,m : /mobile/.test(this.ua)
        ,o2str : Object.prototype.toString
    }
        ,_regEx = {
        "safemail" : "^\\w+([-+.]{0,6}\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"
        ,"safetel" : "[\\d-]+"
    }

    //由于大部分是1级命名，因此避免冲突请在添加函数时搜索是否已存在
    var out = {
        is360 : (/360browser/.test(tmp.ua)&& tmp.m)
        ,isUC : (/ uc /.test(tmp.ua)&& tmp.m)
        ,isQQ : (/mqqbrowser/.test(tmp.ua) && tmp.m)
        ,isStr : function(a) {return "[object String]" === tmp.o2str.call(a)}
        ,isObj : function(a) {return a === Object(a)}
        ,isFun : function(a) {return "[object Function]" === tmp.o2str.call(a)}
        ,isArr : Array.isArray || function(a) {return "[object Array]" === tmp.o2str.call(a)}
        ,isAndroid : /android/.test(tmp.ua)
        ,isIPhone : (/iphone/.test(tmp.ua) && tmp.m)
        ,isIpad : /ipad/.test(tmp.ua)
        ,isIOS : /iphone|ipad|ipod/.test(tmp.ua)
        ,isWeixin : /micromessenger/.test(tmp.ua)
        ,isSelectDate : function(y,m,d){
            var date = y+"/"+m+"/"+d,
                isTrue = true;
            date = new Date(date);
            if(/NaN|Invalid Date/.test(date.toString())) isTrue = false;
            if(date.getDate()!= d || date.getMonth()+1!=m) isTrue = false;
            return isTrue
        }
        // 检测localStorage是否可用
        ,isLocalStorage: (function(){
            // https://github.com/marcuswestin/store.js/blob/b115845a60bb0c3922ec1ddfd1d35762cf0fec30/store.js#L180-187
            var enabled = true;
            try {
                var testKey = '__testKey__';
                var ls = window.localStorage;
                ls.setItem(testKey, testKey);
                if (ls.getItem(testKey) !== testKey) enabled = false;
                ls.removeItem(testKey);
            } catch (err) {
                enabled = false;
            }
            return enabled;
        })()
        ,isEmpty: function(str){
            if (out.trim(str) == "")return true
            return false;
        }
        //验证是否是数字
        ,isNum: function(str){
            var strRef = "1234567890";
            if (str == "") return false;
            for (i = 0; i < str.length; i++) {
                tempChar = str.substring(i, i + 1);
                if (strRef.indexOf(tempChar, 0) == -1) {
                    return false;
                }
            }
            return true;
        }
        //验证需要的email
        ,isSafeMail : function(m){
            return /^\w+([-+.]{0,6}\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(m)&&m.length<100
        }
        ,isMobile: function(m) {
            return /^1\d{10}$/.test(m);
        }
        //验证需要的年份
        ,isSafeYear : function(y){
            if(!/^\d{4}$/.test(y)) return false
            if(y>2099||y<1900) return false
            return true
        }
        //验证需要的身高
        ,isSafeHeight : function(n){
            if(!/^\d{2,3}$/.test(n)) return false
            if(n<50&&n>300) return false
            return true
        }
        //验证需要的城市编号
        ,isCityId : function(n){
            if(!/^\d{4,6}$/.test(n)) return false
            return true
        }
        ,cache : function(jq){
            //定义在sea.js
            if (!window.my.cache[jq]) {
                window.my.cache[jq] = $(jq);
            }
            return window.my.cache[jq];
        }
        //任何对象可以toString
        ,toString : function(data){
            var JSON;
            if(typeof JSON!=="object"){JSON={}}(function(){function d(f){return f<10?"0"+f:f}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(f){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+d(this.getUTCMonth()+1)+"-"+d(this.getUTCDate())+"T"+d(this.getUTCHours())+":"+d(this.getUTCMinutes())+":"+d(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(f){return this.valueOf()}}var c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,g=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,b,j={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;function a(f){g.lastIndex=0;return g.test(f)?'"'+f.replace(g,function(k){var l=j[k];return typeof l==="string"?l:"\\u"+("0000"+k.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+f+'"'}function e(r,o){var m,l,s,f,p=h,n,q=o[r];if(q&&typeof q==="object"&&typeof q.toJSON==="function"){q=q.toJSON(r)}if(typeof i==="function"){q=i.call(o,r,q)}switch(typeof q){case"string":return a(q);case"number":return isFinite(q)?String(q):"null";case"boolean":case"null":return String(q);case"object":if(!q){return"null"}h+=b;n=[];if(Object.prototype.toString.apply(q)==="[object Array]"){f=q.length;for(m=0;m<f;m+=1){n[m]=e(m,q)||"null"}s=n.length===0?"[]":h?"[\n"+h+n.join(",\n"+h)+"\n"+p+"]":"["+n.join(",")+"]";h=p;return s}if(i&&typeof i==="object"){f=i.length;for(m=0;m<f;m+=1){if(typeof i[m]==="string"){l=i[m];s=e(l,q);if(s){n.push(a(l)+(h?": ":":")+s)}}}}else{for(l in q){if(Object.prototype.hasOwnProperty.call(q,l)){s=e(l,q);if(s){n.push(a(l)+(h?": ":":")+s)}}}}s=n.length===0?"{}":h?"{\n"+h+n.join(",\n"+h)+"\n"+p+"}":"{"+n.join(",")+"}";h=p;return s}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(m,k,l){var f;h="";b="";if(typeof l==="number"){for(f=0;f<l;f+=1){b+=" "}}else{if(typeof l==="string"){b=l}}i=k;if(k&&typeof k!=="function"&&(typeof k!=="object"||typeof k.length!=="number")){throw new Error("JSON.stringify")}return e("",{"":m})}}}());
            return JSON.stringify(data)
        }
        //JSON格式的string可转化为obj
        ,toJSON : function(data){
            if( !data || typeof data !== "string" || this.isObj(data)) return data;
            data = data.replace(new RegExp( "^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g" ),"")
            if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
                return window.JSON && window.JSON.parse ?
                    window.JSON.parse( data ) :
                    (new Function("return " + data))();
            }else{
                return null
            }
        }
        //获取某个年月的最大天数
        ,getMaxDay : function(y,m){
            return new Date(y,m,0).getDate()
        }
        //获取常见正则表达式
        ,getRegExStr : function(s){
            s = s ||"";return _regEx[s.toLowerCase()]
        }
        //获取2个日期相隔多少月
        ,getMonth : function(a,b){
            var endDate = new Date(b)
                ,startDate = new Date(a)
                ,number = 0
                ,yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12
                ,monthToMonth = endDate.getMonth() - startDate.getMonth()
            number += yearToMonth
            number += monthToMonth
            return Math.abs(number)
        }
        //批量设置多个input对象的值
        ,setMultiVal : function(objs,vals){
            for(var i=0;i<objs.length;i++){
                if(objs[i])$("#"+objs[i]).val(vals[i])
            }
        }
        //批量设置多个div对象的值
        ,setMutiText : function (objs,vals,attrName,attrVals){
            for(var i=0;i<objs.length;i++){
                if(objs[i]){
                    var $obj = $("#"+objs[i]);
                    $obj.text(vals[i]);
                    if(attrName[i])
                        $obj.attr(attrName[i],attrVals[i]||'');

                }
            }
        }
        ,trim : function(str){
            if(!out.isStr(str)) return str
            return str.replace(/(^[\s\t\xa0\u3000]+)|([\s\t\xa0\u3000]+$)/g, "")
        }
        //获取字符长度
        ,len : function(d,t){
            var b=0
            //英文0.5，中文1
            if(t===0){
                for (var a = 0; a < d.length; a++) {
                    b = b + (d.charCodeAt(a) > 128 ? 1 : 0.5);
                }
                //英文1，中文2
            }else if(t===1){
                for(var a = 0; a < d.length; a++){
                    b = b + (d.charCodeAt(a) > 128 ? 2 : 1);
                }
                //英文1，中文1
            }else{
                b=d.length
            }
            return Math.ceil(b)
        }
        ,check : function(str,par){
            /* 传参的时候需要对逻辑进行控制，如max=1 min=2 永远是false;max字数统计是 可以附带一个maxType参数，其他同理
             *
             * regex可以传递多个如：regex1,regex2...regex1Type,regex2Type...
             *
             * 验证长度的例子:util.check("abc中文",{min:6,minType:1,max:15,error:function(str,type,val){}})
             */
            this._isEmpty = function(s){
                if(s==undefined||s==null) return true
                if(out.isStr(s)){
                    return s.replace(/(^[\s\t\xa0\u3000]+)|([\s\t\xa0\u3000]+$)/g, "")==""
                }else{
                    return false
                }
            }
            this.notEmpty = function(s,v,t){
                return !this._isEmpty(s)
            }
            var error = par.error
                ,success = par.success
                ,emp = ["notempty","empty","Empty"]
                ,isNotEmpty = false
            delete par.error
            delete par.success
            for(var i=0,l=emp.length;i<l;i++){
                if(par[emp[i]]===true){par.notEmpty=true;isNotEmpty=true}
                delete par[emp[i]]
            }
            if(!isNotEmpty && !par.notEmpty && this._isEmpty(str)){
                if(success) success(str); return true
            }
            //最长..
            this.max = function(s,v,t){
                t= typeof(t)!=="number"?2:t;return !(out.len(s,t)>v)
            }
            //最短..
            this.min = function(s,v,t){
                t= typeof(t)!=="number"?2:t;return !(out.len(s,t)<v)
            }
            //开始于..
            this.start =
                this.begin = function(s,v,t){
                    return this.regEx(s,"^"+v,t)
                }
            //结束于..
            this.finish =
                this.end = function(s,v,t){
                    return this.regEx(s,v+"$",t)
                }
            //包含..
            this.has = function(s,v,t){
                return this.regEx(s,v,t)
            }
            //between 必须传2个元素的数组
            this.between = function(s,v,t){
                try{return s>v[0]&&s<v[1]}catch(e){}
            }
            //等于..
            this.eq = function(s,v){
                return s==v
            }
            //大于..
            this.gt = function(s,v){
                return s>v
            }
            //小于..
            this.lt = function(s,v){
                return s<v
            }

            this._hasHtml = function(s){
                return this.regEx("<[A-Za-z/]+.[^>]+>").test(s)
            }
            //不含html..
            this.nothtml =
                this.notHtml = function(s,v){
                    return v?!this._hasHtml(s):true
                }
            //自定义正则
            this.regEx =
                this.regex = function(s,v,t){
                    if ( typeof v === 'string' ) {
                        return new RegExp(v,t||"").test(s)
                    } else {
                        return v.test(s)
                    }

                }
            for(var m in par){
                if(m.indexOf("Type")==-1){
                    if(!this[m.replace(/\d/g,"")](str,par[m],par[m+"Type"])){
                        if(error) error(str,m,par[m]); return false
                    }
                }
            }
            if(success) success(str); return true
        }//end check
        //格式化命名空间str eg: "mjobcn.util.pkg"
        ,pkg : function(str,of){
            var n,s = str,
                a = s.split("."),
                o = of||window;
            for(var i=0;i<a.length;i++){
                n = a[i];
                if(!o[n]) o[n] = {};
                o = o[n];
            }
            return o;
        }
        //发送google统计
        ,track : function(path){
            if(window["_gaq"]){
                /*参数1：函数
                  参数2：类别 通常是路径
                  参数3：操作
                  参数4：标签
                  参数5：数值
                  参数6：是否计算互动
                    类别（string）
                    操作（string）
                    标签（string）
                    数值（integer ）
                    互动（true 或 false）
                */
                _gaq.push(['_trackEvent',path,"click","click",0,true]);
            }
        }
        //eg:util.url.getParameter(name)
        ,url :{
            getParameter : function(name){
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg)
                if (r != null) return r[2];
                return null;
            }
            ,getPar : function(name){
                return this.getParameter(name);
            }
        }
        //这是一个2级util方法,eg:util.cookie.get(key)
        ,cookie : {
            _isValidKey : function (key) {
                return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
            }
            ,getRaw : function (key) {
                if (out.cookie._isValidKey(key)) {
                    var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                        result = reg.exec(document.cookie);
                    if (result) {
                        return result[2] || null;
                    }
                }
                return null;
            }
            ,get : function (key) {
                var value = out.cookie.getRaw(key);
                if ('string' == typeof value) {
                    value = decodeURIComponent(value);
                    return value;
                }
                return null;
            }
            ,remove : function (key, options) {
                options = options || {};
                options.expires = new Date(0);
                out.cookie.setRaw(key, '', options);
            }
            ,setRaw : function (key, value, options) {
                if (!out.cookie._isValidKey(key)) return;
                options = options || {};
                // 计算cookie过期时间
                var expires = options.expires;
                if ('number' == typeof options.expires) {
                    expires = new Date();
                    expires.setTime(expires.getTime() + options.expires);
                }
                document.cookie =
                    key + "=" + value
                    + (options.path ? "; path=" + options.path : "; path=/")
                    + (expires ? "; expires=" + expires.toGMTString() : "")
                    + (options.domain ? "; domain=" + options.domain : "")
                    + (options.secure ? "; secure" : '');
            }
            ,set : function (key, value, options) {
                out.cookie.setRaw(key, encodeURIComponent(value), options);
            }
        }
    }

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.

    out.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g ,
        evaluate    : /\{%([\s\S]+?)%\}/g,
        escape      : /\{%-([\s\S]+?)%\}/g
    };




    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    var encodeHTML = function (str) {
        var o = {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}
        return str.replace(/&|<|>|"|'/g,function(v){
            return o[v];
        });
    };
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    out.template = function(text, data, settings) {
        var render;
        settings = $.extend({}, out.templateSettings, settings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':encodeHTML(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', 'out', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, out);
        var template = function(data) {
            return render.call(this, data, out);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };


    /**
     * 关键字高亮
     * @param  {String} keyword   需要高亮显示的关键字
     * @param  {String} strings   待处理的字符串
     * @param  {String} highlight 高亮显示的标签样式
     * @return {String}           处理结果
     */
    out.highlight = {
        regex: {
            // 关键字分隔符
            separator: /[\s,，;；&＆\\、。\/]/g,
            // 正则元字符
            metaChar: /([\\\^\&\*\+\?\(\)\[\]\{\}\|\.])/g,
            andWord: /\band\b/i,
            htmlTag: new RegExp('<\/?[^>]*>', 'ig'),
            keyword: null,
            highlight: null
        },
        highlightElement: '',
        formatKeyword: function(keyword) {
            keywordList = keyword.replace(this.regex.separator, ' ')
                .replace(this.regex.metaChar, '\\$1')
                .replace(this.regex.andWord, ' ')
                .replace(/[,;\s]*\bor\b[,;\s]*/i, ' ')
                .split(' ');
            // 对关键字集合排序处理
            // 目的将关键字中存在集合关系的较长的关键字置于前面
            keywordList = keywordList.sort(function(kw1, kw2) {
                var kw1Len = kw1.length;
                var kw2Len = kw2.length;

                if (kw2.indexOf(kw1) !== -1 && kw1Len < kw2Len) {  // 子集排在父集前面的情况，如['c', 'c++']
                    return 1;
                } else if (kw1.indexOf(kw2) !== -1 && kw1Len > kw2Len) {  // 子集排在父集后面的情况，如['c++', 'c']
                    return -1;
                } else {
                    return 0;
                }
            });
            // 合并关键字数组到字符串，以'|'分隔
            return keywordList.join('|');
        },
        processing: function(opts) {
            this.regex.keyword = opts.regex.keyword;
            this.regex.highlight = opts.regex.highlight;
            this.highlightElement = opts.highlightElement;
            var rawStr = opts.rawStr;
            var self = this;

            if ( !rawStr.match(this.regex.keyword) ) {
                // 没有需要高亮的关键字
                return rawStr;
            } else if ( !rawStr.match(this.regex.htmlTag) ) {
                // 存在待高亮的关键字，但内容不包含html标签
                var result = rawStr.replace(this.regex.highlight, this.highlightElement);
                return result;
            } else {
                var result = _highlight(rawStr);
                return result;
            }

            function _highlight(content) {
                var _lastTagIndex = 0;  //用于记录上一次正则匹配到的位置
                var _lastTag = '';
                var _result = '';
                var _matched = '';

                while( _matched = self.regex.htmlTag.exec(content) ) {
                    var tag = _matched[0];
                    var tagLen = tag.length;

                    if (self.regex.htmlTag.lastIndex - tagLen === 0) {
                        // 边界情况 - 以html标签开头
                        _lastTagIndex = self.regex.htmlTag.lastIndex;
                        _lastTag = tag;
                        return _highlight(content);
                    } else {
                        var prefix = content.substring(0, _lastTagIndex);
                        var cont = content.substring(_lastTagIndex, self.regex.htmlTag.lastIndex - tagLen);
                        var suffix = content.substring(self.regex.htmlTag.lastIndex - tagLen);
                        if ( cont && self.regex.keyword.test(cont) ) cont = cont.replace(self.regex.highlight, self.highlightElement);
                        if (_result) {
                            _result += _lastTag + cont;
                        } else {
                            _result = prefix + cont;
                        }
                        _lastTagIndex = self.regex.htmlTag.lastIndex;
                        _lastTag = tag;
                    }
                }

                // 匹配完毕，但最后一个被匹配标签的后面仍有未处理的字符的情况
                if (self.regex.htmlTag.lastIndex !== content.length) {
                    var prefix = content.substring(0, _lastTagIndex);
                    var cont = content.substring(_lastTagIndex);
                    if ( cont && self.regex.keyword.test(cont) ) cont = cont.replace(self.regex.highlight, self.highlightElement);
                    _result += _lastTag + cont;
                }

                return _result;
            }
        }
    };

    module.exports = out;
});
