// JavaScript Document

define('widge.overlay.mask', 
['widge.popup', 'tools.fixed'], 
function(require, exports, module) {

    var $ = require('jquery'),
		popup = require('widge.popup'),
		util = require('base.util'),
		fixed = require('tools.fixed'),
		Class = require('base.class').Class,
        isIE6 = !-[1,] && !window.XMLHttpRequest,
		win = $(window);

	var mask = Class(function(o){
			mask.parent().call(this, util.merge({
				width: isIE6 ? win.width() : '100%',
				height: isIE6 ? win.height() : '100%',
				className: 'ui-mask',
				opacity: 0.2,
				background: '#000',
				style: {
					left: 0,
					top: 0
				}
			}, o));
		}).extend(popup);

	mask.implement({
		show: function() {
           	this._changeSize();
            return mask.parent('show').call(this);
        },
		_render: function(){
			mask.parent('_render').call(this);
			this._renderPosition();
			this._renderBackground();
			this._renderOpacity();
		},
		_renderPosition: function(){
			fixed.pin(this.get('element'), 0, 0);
		},
		_renderBackground: function(){
			this.get('element').css('background', this.get('background'));
		},
		_renderOpacity: function(){
			this.get('element').css('opacity', this.get('opacity'));
		},
		setPosition:function(){},
		_changeSize: function(e){
			if(isIE6){
				this.set('width', win.width());
				this.set('height', win.height());
				e && this.resetSize();
				this._iframe.resize(win.width(), win.height());
			}
		},
		setBackground: function(val){
			this.set('background', val);
			this._renderBackground();
		},
		setOpacity: function(val){
			this.set('opacity', val);
			this._renderOpacity();
		}
	});
	
	return new mask();
});