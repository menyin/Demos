define('widge.popup', ['tools.position', 'tools.iframe'], function (require, exports, module) {
    var shape = require('base.shape'),
        $ = require('jquery'),
        util = require('base.util'),
        position = require('tools.position'),
        shim = require('tools.iframe').shim,
        template = '<div></div>',
        defaultName = 'hb_ui',
        doc = document, win = window;
    var popup = shape(function (o) {
        popup.parent().call(this, util.merge({
            idName: null,
            className: 'popup',
            width: 200,
            height: 100,
            zIndex: 99,
            visible: false,
            align: {
                selfXY: [0, 0],
                baseElement: position.viewport,
                baseXY: [0, 0],
                topElement: position.viewport,
                topXY: null
            },
            content: null
        }, o));
        this.init();
    });
    popup.implement({
        init: function () {
            this.after('_render', function () {
                var pos = this.get('element').css('position');
                if (pos === 'static' || pos === 'relative') {
                    this.get('element').css({position: 'absolute', left: '-9999px', top: '-9999px'});
                }
                this.setLevel();
            });
            this._render();
            this._createShim();
            this._setupResize();
            this.after('show', function () {
                this.setPosition();
            });
            if (this.get('visible')) {
                this.get('element').show();
            }
        }, _render: function () {
            var element, target, className = normalizeClassName(this.get('className'));
            if (this.get('element')) {
                if (util.type.isString(this.get('element'))) {
                    element = $(this.get('element'));
                    this.set('element', element);
                } else if (this.get('element')[0]) {
                    element = this.get('element');
                }
            } else {
                element = $(template);
                this.set('element', element);
            }
            element.addClass(className);
            this.addClass(this.get('idName'), true);
            this.resetSize();
            element.appendTo(doc.body).hide();
        }, _setupResize: function () {
            popup.allPopups.push(this);
        }, _createShim: function () {
            var iframe = this._iframe = new shim(this.get('element'));
            this.after('setPosition', util.bind(iframe.shim, iframe));
            this.after('hide', util.bind(iframe.hide, iframe));
            var attrs = ['width', 'height'];
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.on('change:' + attr, util.bind(iframe.shim, iframe));
                }
            }
            this.before('destory', util.bind(iframe.destory, iframe));
        }, addClass: function (idName, isInit) {
            !isInit && idName != undefined && this.set('idName', idName);
            if (idName) {
                var element = this.get('element');
                idName = this.get('idName');
                if (util.type.isArray(idName)) {
                    $(idName).each(function (index, val) {
                        element.addClass(val);
                    })
                } else {
                    element.addClass(idName);
                }
            }
            return this;
        }, clearClass: function () {
            var idName = this.get('idName');
            if (idName) {
                var element = this.get('element');
                if (util.type.isArray(idName)) {
                    $(idName).each(function (index, val) {
                        element.removeClass(val);
                    });
                } else {
                    element.removeClass(idName);
                }
                idName && this.set('idName', null);
            }
            return this;
        }, setLevel: function (zIndex) {
            zIndex != undefined && this.set('zIndex', zIndex);
            this.get('element').css('z-index', this.get('zIndex') || 0);
        }, resetSize: function (width, height) {
            var element = this.get('element');
            element.css({width: width || this.get('width') || 'auto', height: height || this.get('height') || 'auto'});
            return this;
        }, setPosition: function (align, callback) {
            var element = this.get('element');
            if (!isInDocument(element[0]))return;
            align || (align = this.get('align'));
            if (!align)return;
            var isHidden = element.css('display') === 'none';
            if (isHidden) {
                element.css({visibility: 'hidden', display: 'block'});
            }
            var pinObj = {
                element: element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, baseObj = {element: align.baseElement, x: align.baseXY[0], y: align.baseXY[1]}, topObj = {};
            if (align.topXY) {
                topObj.x = align.topXY[0];
                topObj.y = align.topXY[1];
                topObj.element = align.topElement;
                position.pin(pinObj, baseObj, topObj, callback);
            } else {
                position.pin(pinObj, baseObj, callback);
            }
            if (isHidden) {
                element.css({visibility: '', display: 'none'});
            }
        }, show: function () {
            if (!this.get('visible')) {
                this.get('element').show();
                this.set('visible', true);
            }
            return this;
        }, hide: function () {
            if (this.get('visible')) {
                this.get('element').hide();
                this.set('visible', false);
            }
            return this;
        }, destory: function () {
            if (this._iframe) {
                this._iframe.destory();
                delete this._iframe;
            }
            destory(this, popup.allPopups);
            destory(this, popup.blurPopups);
            if (this.get('element')) {
                this.get('element').remove();
            }
            popup.parent('destory').call(this);
        }, _blurHide: function (arr) {
            arr = $.makeArray(arr);
            if (util.type.isBoolean(arr[0])) {
                arr.splice(0, 1);
            }
            arr.push(this.get('element'));
            this._popupElements = arr;
            popup.blurPopups.push(this);
            return this;
        }, removeBlurHide: function () {
            util.array.filter(popup.blurPopups, function (val, index) {
                if (this === val) {
                    popup.blurPopups.splice(index, 1);
                }
            }, this);
            return this;
        }
    });
    popup.allPopups = [];
    popup.blurPopups = [];
    function normalizeClassName(name) {
        if (name) {
            name = defaultName + '_' + name;
        }
        return name;
    }

    function isInDocument(element) {
        return $.contains(doc.documentElement, element);
    }

    function destory(target, array) {
        $(array).each(function (i, val) {
            if (target === val) {
                array.slice(i, 1);
            }
        });
        return array;
    }

    function hidePopups(e) {
        $(popup.blurPopups).each(function (index, item) {
            if (!item || !item.get('visible') || item._isDialogClose) {
                return;
            }
            for (var i = 0; i < item._popupElements.length; i++) {
                var el = $(item._popupElements[i])[0];
                if (el === e.target || $.contains(el, e.target)) {
                    return;
                }
            }
            item.hide();
        });
    }

    $(doc).on('click', function (e) {
        hidePopups(e);
    });
    var timeout, winWidth = $(win).width(), winHeight = $(win).height();
    $(win).on('resize', function (e) {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function () {
            var winNewWidth = $(win).width();
            var winNewHeight = $(win).height();
            if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                $(popup.allPopups).each(function (i, item) {
                    if (!item || !item.get('visible')) {
                        return;
                    }
                    item.setPosition();
                    item._changeSize && item._changeSize(e);
                });
            }
            winWidth = winNewWidth;
            winHeight = winNewHeight;
        }, 80);
    });
    return popup;
});