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
document.write('<script type="text/javascript">var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "//hm.baidu.com/hm.js?811ea98568ed055fcc96b08e0a8a0cc2"; var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();</script>');
document.write('<script src="http://s5.cnzz.com/z_stat.php?id=1000320696&web_id=1000320696" language="JavaScript"></script>');
document.write('</div>');