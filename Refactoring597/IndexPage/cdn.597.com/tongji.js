try{
	if(typeof($)==="function"){
		$(function(){
			$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
			$('input:not([autocapitalize]),textarea:not([autocapitalize]),select:not([autocapitalize])').attr('autocapitalize', 'off');
			$('input:not([autocorrect]),textarea:not([autocorrect]),select:not([autocorrect])').attr('autocorrect', 'off');
			$('input:not([spellcheck]),textarea:not([spellcheck]),select:not([spellcheck])').attr('spellcheck', 'false');
		});
	}
}catch(e){}

document.write('<div style="display: none">');
//document.write('<script type="text/javascript">var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "//hm.baidu.com/hm.js?811ea98568ed055fcc96b08e0a8a0cc2"; var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();</script>');
document.write('<script src="http://s5.cnzz.com/z_stat.php?id=1000320696&web_id=1000320696" language="JavaScript"></script>');
document.write('</div>');

(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

(function(){
var src = (document.location.protocol == "http:") ? "http://js.passport.qihucdn.com/11.0.1.js?18f4d46fd2e1e54233c30dc96be41a12":"https://jspassport.ssl.qhimg.com/11.0.1.js?18f4d46fd2e1e54233c30dc96be41a12";
document.write('<script src="' + src + '" id="sozz"><\/script>');
})();