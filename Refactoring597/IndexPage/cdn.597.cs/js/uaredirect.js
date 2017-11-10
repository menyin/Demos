define(function (require, exports, module) {

var $_GET = (function(){
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if(typeof(u[1]) == "string"){
		u = u[1].split("&");
		var get = {};
		for(var i in u){
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	}
})();

function uaredirect(f) {
	try {
		if ($_GET['refrom']=='tom') return;

		if (document.getElementById("bdmark") != null) {
			return;
		}
		var b = false;
		var k = window.location.search;
		if (k == "?type=Computer") {
			b = false;
		}
		else {
			if (arguments[1]) {
				var e = window.location.host;
				var a = window.location.href;

				if (isSubdomain(arguments[1], e) == 1) {
					f = f + "/#m/" + a;
					b = true
				}
				else {
					if (isSubdomain(arguments[1], e) == 2) {
						f = f + "/#m/" + a;
						b = true
					}
					else {
						f = a;
						b = false
					}
				}
			}

			else {
				b = true
			}
		}
		if (b) {
			var c = window.location.hash;
			if (!c.match("fromapp")) {
				if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i))) {
					location.replace(f)
				}
			}
		}
	}
	catch (d) {
	}
}
function isSubdomain(c, d) {
	this.getdomain = function (f) {
		var e = f.indexOf("://");
		if (e > 0) {
			var h = f.substr(e + 3)
		}
		else {
			var h = f
		}
		var g = /^www\./;
		if (g.test(h)) {
			h = h.substr(4)
		}
		return h
	};
	if (c == d) {
		return 1
	}
	else {
		var c = this.getdomain(c);
		var b = this.getdomain(d);
		if (c == b) {
			return 1
		}
		else {
			c = c.replace(".", "\\.");
			var a = new RegExp("\\." + c + "$");
			if (b.match(a)) {
				return 2
			}
			else {
				return 0
			}
		}
	}
};

	module.exports={uaredirect:uaredirect,isSubdomain:isSubdomain};
});