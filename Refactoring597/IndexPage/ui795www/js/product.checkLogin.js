define('product.checkLogin', ['widge.overlay.jpDialog', 'tools.cookie'], function(require, exports, module) {
	var jquery = require('jquery'),
		util = require('base.util'),
		Dialog = require('widge.overlay.jpDialog'),
		cookie = exports.cookie = require('tools.cookie');
	var dialog = exports.dialog = exports.dialog || new Dialog({
		width: 342,
		close: 'x',
		initHeight: 100,
		isAjax: true,
		isClick: true
	});
	exports.isLogin = function(callback, className,isCompany) {
		/*
		var userName = cookie.get('username'),
			usertype = cookie.get('userType'),
			logined = userName > 0 && usertype == 'per';

		if (!logined && !util.type.isBoolean(callback)) {
			var url = '/login/Index/success-' + (callback || '');
			
			if (util.type.isString(className)) {
				dialog.addClass(className);
			} else {
				dialog.clearClass();
			}
			
			dialog.setContent({
				title: '登录',
				content: url
			}).resetSize(342).show().off('loadComplete').on('loadComplete', function() {
				this.oneCloseEvent('#btnLogin');
			});
		}
		return logined;
		*/
		var subject = (isCompany==1) ? '企业登录' : '个人登录';

		var url = '/person/ajaxlogin.html?com='+isCompany;

		if(util.type.isString(callback)){
			url = url+'&key='+callback;
		}
		if (util.type.isString(className)) {
			dialog.addClass(className);
		} else {
			dialog.clearClass();
		}	
		dialog.setContent({
			title: subject,
			content: url
		}).resetSize(342).show().off('loadComplete').on('loadComplete', function() {
			this.oneCloseEvent('#btnLogin');
		});
	}
	exports.isPersonLogin = function(callback, className, href) {
		var userName = cookie.get('username'),
			usertype = cookie.get('userType'),
			logined = userName > 0 && usertype == 'per';
		if (!logined && !util.type.isBoolean(callback)) {
			var url = href ? href + (callback || '') : '/personregister/Index/success-' + (callback || '');

			
			if (util.type.isString(className)) {
				dialog.addClass(className);
			} else {
				dialog.clearClass();
			}

			dialog.setContent({
				content: url,
				isOverflow: true
			}).resetSize(650).show();
		}
		return logined;
	}
	exports.setBlurHideTrigger = function(trigger) {
		dialog.setBlurHideTrigger(trigger);
	}
	return exports;
});