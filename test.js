(function () {
    window.BMap_loadScriptTime = (new Date).getTime();
    document.write('<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak=33f9256a1a1ba5a80eb40f8ed45bce3c&services=&t=20180521160403"></script>');
})();
define('product.jobSort.jobSorter', ['product.jobSort.jobSortDialog', 'module.dataSource'],
    function (require, exports, module) {
        var $ = module['jquery'], shape = module['base.shape'], DataSource = module['module.dataSource'],
            jobSortDialog = module['product.jobSort.jobSortDialog'], util = require('base.util'),
            template = '<li data-id="{value}"><a href="javascript:">{label}<span class="close">×</span></a></li>',
            hidInput = '<input name="{name}" type="hidden" />';
        var jobSorter = shape(function (o) {
            jobSorter.parent().call(this, util.merge({
                trigger: $('#dropJobsort'),
                remenSwitch: 'hide',
                icon: 'icon',
                label: '.label',
                name: 'hidJobsort',
                maxLength: 5,
                url: 'http://assets.huibo.com/js/v2/data/jobSortData.js?v=20150237',
                initURL: null,
                initURLParam: null,
                selectedId: null,
                dialog: null,
                search: null,
                template: template,
                model: false,
                level: true
            }, o));
            this.init();
        });
        jobSorter.implement({
            init: function () {
                this._initJobSorter();
                this._initDialog();
                this._initDataSource();
                this._initEvents();
            }, _initJobSorter: function () {
                var trigger = this.get('trigger');
                this._label = trigger.children(this.get('label'));
                this._hidInput = trigger.find('input[type="hidden"]');
                if (!this._hidInput.length) {
                    this._hidInput = $(util.string.replace(hidInput, {name: this.get('name')})).appendTo(this.get('trigger'));
                }
                this._hidInput.val(this.get('selectedId'));
            }, _initDataSource: function () {
                var url = this.get('initURL'), data = this._dialog.getMenu().getData();
                if (url) {
                    var urlParam = this.get('initURLParam'),
                        param = urlParam ? '&' + urlParam + '=' + this.get('selectedId') : '';
                    this._initDataSource = new DataSource({source: url + param});
                    var self = this;
                    this._initDataSource.on('data', function (e) {
                        if (util.type.isArray(e.data)) {
                            $.each(e.data, function (index, val) {
                                data.array[index] = val.id;
                                data.object[val.id] = val.label;
                                self._label.append(util.string.replace(self.get('template'), val));
                            });
                        }
                    });
                    this._initDataSource.getData();
                } else {
                    var label = this._label.children();
                    if (label.length) {
                        label.each(function (index, val) {
                            var id = $(this).attr('data-id');
                            data.array[index] = id;
                            data.object[id] = $(this).text().replace(/[×xX]/gi, '');
                        });
                    }
                }
                this._dialog.updateSearchData();
            }, _initDialog: function () {
                this._dialog = new jobSortDialog({
                    maxLength: this.get('maxLength'),
                    remenSwitch: this.get('remenSwitch'),
                    selectedId: this.get('selectedId'),
                    template: this.get('template'),
                    model: this.get('model'),
                    level: this.get('level'),
                    url: this.get('url'),
                    dialog: util.merge({
                        idName: 'hbJobSortDialog',
                        width: 854,
                        height: 'auto',
                        title: '选择职位类别'
                    }, this.get('dialog')),
                    search: util.merge({
                        idName: 'jobSearch',
                        width: 290,
                        align: {baseXY: [-1, '100%-1']},
                        size: 10,
                        dataSource: null,
                        defaultValue: '关键词快速匹配，点击选中'
                    }, this.get('search'))
                });
            }, _initEvents: function () {
                var trigger = this.get('trigger'), self = this;
                trigger.on('click', function (e) {
                    var target = $(e.target);
                    if (target.hasClass('close')) {
                        target = target.closest('li');
                        target.remove();
                        var value = target.attr('data-id');
                        self._dialog.deleteItem([target, self._dialog._resultPanel.children('span[data-id=' + value + ']')], value);
                        self._hidInput.val(self.getValue().array.join(','));
                    } else if (target[0] == self.get('trigger')[0] || (self.get('icon') && target.hasClass(self.get('icon')))) {
                        self._dialog.show();
                    }
                });
                this._dialog.on('submit', function (e) {
                    self._label.html(e.html);
                    self._hidInput.val(e.value);
                    this.hide();
                    self.trigger('submit', e);
                });
            }, addItem: function (e) {
                if (!e) return;
                var menu = this._dialog._menu;
                if (menu.addSelectedItem(e.value, e.label)) {
                    this._label.append(util.string.replace(this.get('template'), e));
                    this._dialog._addItemHTML(e);
                }
                this.updateData();
            }, clearAllItem: function () {
                this._label.empty();
                this._dialog.clearAllItem();
            }, updateData: function () {
                this._dialog.updateSearchData();
                this._hidInput.val(this.getValue().array.join(','));
            }, getValue: function () {
                return this._dialog.getMenu().getData();
            }, destory: function () {
                this._dialog.destory();
                jobSorter.parent('destory').call(this);
            }, hide: function () {
                this._dialog.hide();
            }
        });
        return jobSorter;
    });
define('product.jobSort.jobSortSearch', ['widge.autoComplete.search'], function (require, exports, module) {
    var $ = module['jquery'],
        shape = module['base.shape'], search = module['widge.autoComplete.search'],
        util = require('base.util'), template = {
            list: '<ul class="options"></ul>',
            item: '<li><a {selected} href="javascript:" data-id="{link}"><span class="status"></span>{label}</a></li>',
            footer: '<div class="footer"><a href="javascript:">换一批</a><span>共{count}个</span></div>',
            empty: '<div class="empty">没找到职位，换个关键词试试！</div>'
        }, itemName = 'a';
    var jobSortSearch = shape(function (o) {
        jobSortSearch.parent().call(this, util.merge({
            template: template, size: 10, datas: null
        }, o));
    }).extend(search);
    jobSortSearch.implement({
        _initEvents: function () {
            jobSortSearch.parent('_initEvents').call(this);
            var element = this.get('element'),
                options = element.children('.options'),
                self = this;
            element.on('click', '.footer a', function (e) {
                if (self.get('disabled')) return;
                self.dataSource.abort();
                self.dataSource.set('source', self._nextURL);
                self.dataSource.getData(self.input.get('element').val());
            });
            this.input.on('focus', util.bind(this.show, this));
            this.on('emptyData', function (e) {
                if (self._emptyContent) {
                    self._emptyContent.remove();
                    delete self._emptyContent;
                }
                if (self.isEmptyContent()) {
                    search.parent('hide').call(self);
                    return;
                }
                self._emptyContent = $(self.get('template').empty).appendTo(element);
                search.parent('show').call(self);
            });
        }, _initData: function () {
            var dataSource = this.get('dataSource');
            if (util.type.isString(dataSource)) {
                this.set('dataSource', dataSource.replace(/\{\{pageSize\}\}/g, this.get('size')));
            }
            jobSortSearch.parent('_initData').call(this);
        }, _handleQueryChange: function (val, prev) {
            if (this.get('disabled')) return;
            this.dataSource.set('source', this.get('dataSource'));
            this.dataSource.abort();
            this.dataSource.getData(val);
        }, _filterData: function (data) {
            var oldData = data;
            if (util.type.isObject(data)) {
                data = data.data || data;
            }
            jobSortSearch.parent('_filterData').call(this, data);
            if (this._footer) {
                this._footer.remove();
                delete this._footer;
            }
            if (oldData.totalPage && oldData.totalPage > 1) {
                this._footer = $(util.string.replace(template.footer, {count: oldData.totalSize})).appendTo(this.get('element'));
                var page = oldData.pageNo + 1;
                if (page > oldData.totalPage) {
                    page = 1;
                }
                this._nextURL = this.get('dataSource') + '&page=' + page;
            }
        }, _handleSelection: function (e) {
            var isMouse = e ? e.type === 'click' : false, items = this.get('items');
            if (!items || util.type.isString(items)) {
                return;
            }
            var index = isMouse ? items.index($(e.target)) : this.get('selectedIndex'), item = items.eq(index),
                data = this.get('data')[index];
            if (index >= 0 && item) {
                this.set('selectedIndex', index);
                if (e && !isMouse && !this.get('isSubmit')) {
                    e.preventDefault();
                }
                if (this.get('isAutoSelect')) {
                    data.link && (window.location.href = data.link);
                } else {
                    var selected = !item.hasClass('selected');
                    var obj = {
                        data: data,
                        index: index,
                        target: item,
                        url: data.link,
                        group: items,
                        selected: selected
                    };
                    this.trigger('searchItemSelected', obj);
                }
            }
        }, _renderItems: function (data) {
            if (this._emptyContent) {
                this._emptyContent.remove();
                delete this._emptyContent;
            }
            var items = this.get('itemsName'), template = this.get('template') || template, self = this, item,
                d = this.get('datas').object;
            if (item = template.item) {
                if (util.type.isArray(data)) {
                    var html = '', temp = {};
                    $.each(data, function (key, val) {
                        if (d[val.link]) {
                            temp.selected = 'class="selected"';
                        } else {
                            temp.selected = '';
                        }
                        temp.link = val.link;
                        temp.label = val.text = val.label;
                        html += util.string.replace(item, temp);
                    });
                    items.html(html)
                    if (html) {
                        this.set('items', items.find(itemName));
                    }
                } else {
                    throw new Error('widge.autoComplete.search: 数据格式不正确');
                }
            } else {
                throw new Error('widge.autoComplete.search: 模板{item}不正确');
            }
        }, _changeValue: function () {
        }
    });
    return jobSortSearch;
});

;define('product.jobSort.jobSortDialog', ['product.jobSort.jobSortMenu', 'product.jobSort.jobSortSearch', 'widge.overlay.hbDialog', 'widge.overlay.confirmBox'], function (require, exports, module) {
    var $ = module['jquery'], shape = module['base.shape'], hbDialog = module['widge.overlay.hbDialog'],
        ConfirmBox = module['widge.overlay.confirmBox'], jobSortMenu = module['product.jobSort.jobSortMenu'],
        search = module['product.jobSort.jobSortSearch'], util = require('base.util'),
        loader = '<div class="loader" style="text-align:center">正在加载数据中...</div>',
        loaderError = ['<div class="loader" style="text-align:center">错误：加载数据失败</div>', '<div class="jobBottomBox" style="text-align:center"><a class="yesBtn" href="javascript:" style="margin:0">确定</a></div>'].join(''),
        oneLengthHTML = '选择<em>{maxLength}</em> 项', maxLengthHTML = '最多<em>{maxLength}</em> 项',
        content = [loader, '<div class="jobPanel" style="display:none">', '<div class="jobTopActionsPanel clearfix">', '<div class="jobTopActionsLeft">', '<div class="jobTopSearchInput"><em></em><input id="jobTopSearchInput" /></div>', '{maxLengthHTML}', '</div>', '<div id="jobTopResult" class="jobTopResult"></div>', '</div>', '<div class="jobContentBox {oneClass}">', '<div class="jobSortMenu"><ul></ul></div>', '<div class="jobSortItems"></div>', '</div>', '{jobBottomBox}', '</div>'].join(''),
        cancelButtonTemplate = '<a class="cancelBtn" href="javascript:">取消</a>',
        yesButtonTemplate = '<a class="yesBtn" href="javascript:">确认</a>',
        resultItemTemplate = '<span data-id="{value}">{label}<a href="javascript:"></a></span>',
        promptMsgs = {'limit': '不能超过{maxLength}项', 'repeat': '不能重复选择'},
        jobBottomBoxTemplate = ['<div class="jobBottomBox">', yesButtonTemplate, cancelButtonTemplate, '</div>'].join(''),
        pWidth = 70, fontSize = 18;
    var jobSortDialog = shape(function (o) {
        jobSortDialog.parent().call(this, util.merge({
            maxLength: 5,
            remenSwitch: "hide",
            selectedId: null,
            model: false,
            oneLengthHTML: oneLengthHTML,
            maxLengthHTML: maxLengthHTML,
            dialog: {idName: 'hbJobSortDialog', width: 854, height: 'auto', title: '选择类型'},
            search: {idName: 'jobSearch', width: 290, align: {baseXY: [-1, '100%-1']}, size: 10, dataSource: null},
            url: 'http://assets.huibo.com/js/v2/data/jobSortData.js?v=20150227',
            level: true
        }, o));
        this.init();
    });
    jobSortDialog.implement({
        init: function () {
            this._isInit = true;
            this._initDialog();
            this._initResultPanel();
            this._initMenu();
            this._initSearch();
            this._initEvents();
        }, _initDialog: function () {
            this._dialog = new hbDialog(this.get('dialog'));
            var maxLength = this.get('maxLength'), html = this.get('maxLengthHTML'),
                jobBottomBox = jobBottomBoxTemplate, oneClass = '', f = true;
            if (maxLength == 1) {
                html = this.get('oneLengthHTML');
                f = false;
            } else if (maxLength <= 0) {
                html = '';
                f = false;
            }
            if (!f) {
                jobBottomBox = '';
                this._dialog.set('close', 'x');
                this._dialog._updateCloseBtn();
                oneClass = 'jobContentBox_one';
            }
            var dialogContent = util.string.replace(content, {
                'jobBottomBox': jobBottomBox,
                'oneClass': oneClass,
                'maxLengthHTML': html
            });
            this._dialog.setContent(util.string.replace(dialogContent, {'maxLength': maxLength}));
        }, _initSearch: function () {
            this._search = new search(util.merge({
                trigger: this._dialog.query('#jobTopSearchInput'),
                zIndex: this._dialog.get('zIndex') + 1
            }, this.get('search')));
        }, _initMenu: function () {
            var self = this;
            this._menu = new jobSortMenu({
                element: this._dialog.query('.jobSortItems'),
                trigger: this._dialog.query('.jobSortMenu'),
                selectedId: this.get('selectedId'),
                maxLength: this.get('maxLength'),
                remenSwitch: this.get('remenSwitch'),
                model: this.get('model'),
                url: this.get('url'),
                level: this.get('level')
            });
            this._menu.on('initItem', function (e) {
                if (!self._resultPanel.children('span[data-id=' + e.value + ']').length) {
                    self._resultPanel.append(util.string.replace(resultItemTemplate, e));
                }
            });
            this._menu.on('initError', function (e) {
                self._dialog.setContent(loaderError);
                self._dialog.query('.yesBtn').on('click', function () {
                    self._dialog.hide();
                });
            });
        }, _initResultPanel: function () {
            this._resultPanel = this._dialog.query('#jobTopResult');
        }, getItemHTML: function () {
            var data = this._menu.getData(), template = this.get('template'), label, resultHTML = '';
            this._labels = [];
            if (!template) {
                return '';
            }
            for (var i = 0, len = data.array.length; i < len; i++) {
                if (label = data.object[data.array[i]]) {
                    this._labels.push(label);
                    resultHTML += util.string.replace(template, {value: data.array[i], label: label});
                }
            }
            return resultHTML;
        }, _initEvents: function () {
            var self = this;

            function submitClick(e) {
                var data = self._menu.getData().array;
                e.html = self.getItemHTML();
                e.value = data.join(',');
                e.data = {value: data, label: self._labels && self._labels || []};
                self.trigger('submit', e);
            }

            this._dialog.query('.yesBtn').on('click', submitClick);
            this._dialog.query('.cancelBtn').on('click', function (e) {
                delete self._labels;
                var eventObj;
                self.clearAllItem();
                self._oldItem.each(function (key, val) {
                    eventObj = {label: $(this).text(), value: $(this).attr('data-id')}
                    self.addItem(eventObj);
                });
                self.updateSearchData();
                self.trigger('cancel', e);
                self.hide();
            });
            this._menu.on('loadComplete', function () {
                self._dialog.query('.loader').remove();
                self._dialog.query('.jobPanel').show();
                self._dialog.setPosition();
                self._oldItem = self._resultPanel.children().clone();
                self.updateSearchData();
            });
            this._menu.on('selectItem', function (e) {
                if (e.result && e.result.length) {
                    var span = self._resultPanel.find('span');
                    for (var i = 0, len = e.result.length; i < len; i++) {
                        span.filter('[data-id=' + e.result[i] + ']').remove();
                    }
                }
                var searchItems = self._search.get('items');
                self._resultPanel.append(util.string.replace(resultItemTemplate, e));
                self.updateSearchData();
                if (self.get('maxLength') == 1) {
                    searchItems && searchItems.removeClass('selected');
                    if (!e.sourceName) {
                        submitClick(e);
                    }
                }
                searchItems && searchItems.filter('[data-id=' + e.value + ']').addClass('selected');
            });
            this._menu.on('clickAll', function (e) {
                self._search.get('items') && self._search.get('items').removeClass('selected');
            });
            this._menu.on('one', function () {
                self.clearAllItem();
                self.updateSearchData();
            });
            this._menu.on('limit', function (e) {
                self.updateSearchData();
                var msg = util.string.replace(promptMsgs.limit, {maxLength: this.get('maxLength')});
                ConfirmBox.timeBomb(msg, {name: 'fail', width: pWidth + msg.length * fontSize, timeout: 800});
            });
            this._menu.on('notSelectItem', function (e) {
                self.updateSearchData();
                var msg = promptMsgs.repeat;
                ConfirmBox.timeBomb(msg, {name: 'fail', width: pWidth + msg.length * fontSize, timeout: 800});
            });
            this._resultPanel.on('click', 'a', function (e) {
                var target = $(e.currentTarget).parent(), id = target.attr('data-id');
                self.deleteItem(target, id);
                self._search.get('items').filter('[data-id=' + id + ']').removeClass('selected');
            });
            this._search.on('searchItemSelected', function (e) {
                var menu = self._menu, value = e.url,
                    eventObj = {label: e.data.value, value: value, result: menu._handleResult(value)};
                var maxLength = self.get('maxLength');
                if (e.selected) {
                    if (menu.addSelectedItem(value, eventObj.label) === true) {
                        if (maxLength == 1) {
                            this.hide();
                            submitClick(e);
                            eventObj.sourceName = 'search';
                        }
                        menu.trigger('selectItem', eventObj);
                    } else if (menu.addSelectedItem(value, eventObj.label) === 'limit') {
                        menu.trigger('limit', eventObj);
                    } else {
                        menu.trigger('notSelectItem', eventObj);
                    }
                } else {
                    e.target.removeClass('selected');
                    var target = self._resultPanel.children('span[data-id=' + value + ']');
                    self.deleteItem(target, value);
                }
            });
        }, clearAllItem: function () {
            this._resultPanel.empty();
            this._menu.clearSelectedItem();
        }, addItem: function (e) {
            if (!e) return;
            var menu = this._menu;
            if (menu.addSelectedItem(e.value, e.label)) {
                this._addItemHTML(e);
            }
            this.updateSearchData();
        }, _addItemHTML: function (e) {
            if (!e) return;
            this._resultPanel.append(util.string.replace(resultItemTemplate, e));
        }, deleteItem: function (target, val) {
            if (!val) return;
            if (util.type.isArray(target)) {
                for (var i = 0, len = target.length; i < len; i++) {
                    target[i].remove();
                }
            } else {
                target.remove();
            }
            this._menu.delSelectedItem(val);
            this.updateSearchData();
        }, updateSearchData: function () {
            this._search.set('datas', this._menu.getData(), {override: true});
        }, getMenu: function () {
            return this._menu;
        }, getSearch: function () {
            return this._search;
        }, show: function () {
            if (this._isInit) {
                var self = this;
                setTimeout(function () {
                    self._menu.init();
                }, 1);
                delete this._isInit;
            } else {
                this._oldItem = this._resultPanel.children().clone();
            }
            this._dialog.show();
        }, hide: function () {
            this._dialog.hide();
        }, destory: function () {
            this._menu.destory();
            this._search.destory();
            this._dialog.destory();
            jobSortDialog.parent('destory').call(this);
        }
    });
    return jobSortDialog;
});

define('product.jobSort.jobSortMenu', function (require, exports, module) {
    var $ = module['jquery'];
    shape = module['base.shape'], util = require('base.util'), doc = document, template = {
        triggerItem: '<li><a class="sub_item" href="javascript:"><!--<i class="hbFntWes">&#xf105;</i>-->{name}</a></li>',
        firstItem: '<li class="first_item"><a data-id="0" class="sub_item" href="javascript:">不限</a></li>',
        elementGroup: '<table class="child_item" cellpadding="0"></table>',
        elementCols: '<div></div>',
        elementRows: '<tr></tr>',
        elementTitle: '<th><{tag} href="javascript:" data-id="{id}">{name}</{tag}></th>',
        elementList: '<td><div></div></td>',
        elementItem: '<a href="javascript:" data-id="{id}">{name}</a>'
    }
    var jobSortMenu = shape(function (o) {
        jobSortMenu.parent().call(this, util.merge({
            element: null,
            trigger: null,
            elementItem: '.child_item',
            triggerMenu: 'ul',
            triggerItem: 'li',
            className: 'hover',
            selectedClassName: 'item_selected',
            delayHoverTime: 300,
            selectedIndex: 0,
            maxLength: 5,
            selectedId: null,
            model: false,
            level: true,
            isAll: false
        }, o));
        this._initSelectedItem();
    });
    jobSortMenu.implement({
        init: function () {
            this._index = 0;
            this._renders = {};
            var self = this;
            hbjs.loadJS(this.get('url'), function (moduleName) {
                moduleName = moduleName.substring(moduleName.lastIndexOf('/') + 1, moduleName.lastIndexOf('.js'));
                self.set('data', hbjs[moduleName]);
                if (!self.get('data')) {
                    self.trigger('initError');
                    return;
                }
                self._triggerMenu = self.get('trigger').find(self.get('triggerMenu'));
                self._renderTemplate();
                self._triggerItem = self._triggerMenu.find(self.get('triggerItem'));
                self._items = self.get('element').find('.child_item');
                self.selectMenu(self.get('selectedIndex'));
                self._initEvents();
            });
        }, _initSelectedItem: function () {
            var selectedId = this.get('selectedId');
            this._selectedId = [];
            this._selectedObj = {};
            if (selectedId && util.type.isString(selectedId)) {
                this._selectedId = selectedId.split(',');
            } else if (util.type.isArray(selectedId)) {
                this._selectedId = selectedId;
            }
            if (this._selectedId.length) {
                for (var i = 0, len = this._selectedId.length; i < len; i++) {
                    this._selectedObj[this._selectedId[i]] = true;
                }
            }
        }, getData: function () {
            return {array: this._selectedId, object: this._selectedObj}
        }, _initEvents: function () {
            var self = this, trigger = this.get('trigger'), itemName = this.get('triggerItem'), switchTimer,
                switchTimeout = this.get('delayHoverTime'), limit = 3, resultPos = null;
            this.pos = [];
            $(doc).on('mousemove', function (e) {
                self.pos.push({x: e.pageX, y: e.pageY});
                if (self.pos.length > limit) {
                    self.pos.shift();
                }
            });
            trigger.on('mouseenter', itemName, function (e) {
                var target = $(e.currentTarget);
                switchTimer && clearTimeout(switchTimer);
                if (!target.hasClass('first_item')) {
                    switchTimer = setTimeout(function () {
                        overHandle(e);
                    }, timeout());
                } else {
                    overHandle(e, true);
                }
            }).on('mouseleave', leaveHandle).on('click', '.first_item a', function (e) {
                selectedItem(e);
                self.trigger('clickAll', e);
            });
            var element = this.get('element');
            element.on('mouseleave', leaveHandle).on('click', 'a', selectedItem);

            function selectedItem(e) {
                var target = $(e.currentTarget), value = target.attr('data-id'),
                    eventObj = {target: target, label: target.text(), value: value, result: self._handleResult(value)};
                if (self.addSelectedItem(value, eventObj.label) === true) {
                    self.trigger('selectItem', eventObj);
                } else if (self.addSelectedItem(value, eventObj.label) === 'limit') {
                    self.trigger('limit', eventObj);
                } else {
                    self.trigger('notSelectItem', eventObj);
                }
            }

            function overHandle(e, f) {
                var target = $(e.currentTarget), index = self._triggerItem.index(target);
                self.selectMenu(index, f);
            }

            function leaveHandle(e) {
                switchTimer && clearTimeout(switchTimer);
            }

            function timeout() {
                var offset = trigger.offset(), dimStart = {x: offset.left + trigger.width(), y: offset.top},
                    dimEnd = {x: offset.left + trigger.width(), y: offset.top + trigger.height()},
                    endPos = self.pos[self.pos.length - 1], startPos = self.pos[0];
                if (!endPos) {
                    return 0;
                }
                if (!startPos) {
                    startPos = endPos;
                }
                if (startPos.x < offset.left || startPos.x > dimEnd.x || startPos.y < offset.top || startPos.y > dimEnd.y) {
                    return 0;
                }
                if (resultPos && endPos.x == resultPos.x && endPos.y == resultPos.y) {
                    return 0;
                }
                var cloneStart = dimStart, cloneEnd = dimEnd, L = J(endPos, cloneStart), H = J(endPos, cloneEnd),
                    D = J(startPos, cloneStart), A = J(startPos, cloneEnd);
                if (L < D && H > A) {
                    k = endPos;
                    return self.get('delayHoverTime');
                }
                k = null;
                return 0;
            }
        }, _handleResult: function (val) {
            var lastReg = /^(\d+)00$/gi, isSort = lastReg.test(val), firstId = val.substring(0, val.length - 2),
                selectedId = [].concat(this._selectedId), selId, ret = [];
            if (!isSort) {
                firstId = firstId + '00';
            }
            for (var i = 0, len = selectedId.length; i < len; i++) {
                if (val != 0) {
                    selId = isSort ? selectedId[i].substring(0, selectedId[i].length - 2) : selectedId[i];
                    if (selectedId[i] == 0) {
                        delete this._selectedObj[this._selectedId[i]];
                        this._selectedId.splice(i - ret.length, 1);
                        ret.push(selectedId[i]);
                        continue;
                    }
                    if (firstId === selId) {
                        if (!(isSort && this._selectedObj[val])) {
                            delete this._selectedObj[this._selectedId[i - ret.length]];
                            this._selectedId.splice(i - ret.length, 1);
                        }
                        ret.push(selectedId[i]);
                        if (!isSort) {
                            break;
                        }
                    }
                } else {
                    delete this._selectedObj[this._selectedId[i - ret.length]];
                    this._selectedId.splice(i - ret.length, 1);
                    ret.push(selectedId[i]);
                }
            }
            return ret;
        }, isLimit: function () {
            var selectedId = this._selectedId;
            return selectedId.length >= this.get('maxLength');
        }, isSelected: function (val) {
            if (!this._selectedId.length) {
                return false;
            }
            if (this._selectedObj[val]) {
                return true;
            }
            return false;
        }, clearSelectedItem: function () {
            this._selectedObj = {};
            this._selectedId = [];
        }, addSelectedItem: function (val, label) {
            if (!this.isSelected(val)) {
                if (this.get('maxLength') == 1) {
                    this.trigger('one');
                }
                if (this.isLimit()) {
                    return 'limit';
                }
                this._selectedObj[val] = label || true;
                this._selectedId.push(val);
                return true;
            }
            return false;
        }, delSelectedItem: function (val) {
            var selectedId = this._selectedId;
            if (!selectedId.length) {
                return;
            }
            for (var i = 0, len = selectedId.length; i < len; i++) {
                if (val == selectedId[i]) {
                    delete this._selectedObj[val];
                    this._selectedId.splice(i, 1);
                    return;
                }
            }
        }, selectMenu: function (index, f) {
            this._triggerItem.removeClass(this.get('className'));
            this._triggerItem.eq(index).addClass(this.get('className'));
            this._index = index;
            if (!f) {
                this._items.hide();
                this._items.eq(index).show();
            }
        }, _renderItem: function (target, val, obj, index) {
            var self = this, model = this.get('model'), el;
            if (this.get('level')) {
                target = $(template.elementRows).appendTo(target);
                $(val).each(function (i, val) {
                    val.tag = model ? 'span' : 'a';
                    el = $(util.string.replace(template.elementTitle, val)).appendTo(target);
                    if (obj && obj.renders) {
                        self._renderSelectedClass(obj.renders, el, obj.index, val);
                    }
                    if (self._selectedObj[val.id]) {
                        self._selectedObj[val.id] = val.name;
                        self.trigger('initItem', {label: val.name, value: val.id});
                    }
                    target = $(template.elementList).appendTo(target).children();
                    if (val.sub && util.type.isArray(val.sub)) {
                        $(val.sub).each(_renderItems);
                    }
                });
            } else {
                target = $('<div></div>').appendTo(target);
                if (obj && obj.renders) {
                    this._renderSelectedClass(obj.renders, target, obj.index, val);
                }
                _renderItems(index, val);
            }

            function _renderItems(index, value) {
                if (self._selectedObj[value.id]) {
                    self._selectedObj[value.id] = value.name;
                    self.trigger('initItem', {label: value.name, value: value.id});
                }
                el = $(util.string.replace(template.elementItem, value)).appendTo(target);
                if (obj && obj.renders) {
                    self._renderSelectedClass(obj.renders, el, obj.index + 1, value);
                }
            }
        }, _renderItems: function (target, val, obj) {
            var self = this, id = obj.length;
            if (!this.get('level')) {
                target = $(template.elementRows).appendTo(target);
                target = $(template.elementList).appendTo(target).children().addClass('simple');
            }
            $(val).each(function (key, val) {
                self._renderItem(target, val, {renders: obj, index: id}, key);
            });
        }, _renderTemplate: function () {
            if (this.get('isAll')) {
                this._triggerMenu.append(template.firstItem);
                this.get('element').append(template.elementGroup);
            }
            $(this.get('data')).each(util.bind(this._eachList, this));
            this.trigger('loadComplete');
        }, _eachList: function (index, val) {
            var el = $(util.string.replace(template.triggerItem, val)).appendTo(this._triggerMenu);
            this._renderSelectedClass(this._renders[index] = [], el, 0, val);
            if (val.sub && util.type.isArray(val.sub)) {
                childItem = $(template.elementGroup).appendTo(this.get('element'));
                this._renderItems(childItem, val.sub, this._renders[index], index);
                childItem.css({'visibility': '', 'display': 'none'});
                delete this._renders[index];
            }
        }, _renderSelectedClass: function (render, el, index, val) {
            el = el.children().length ? el.children() : el;
            if (index === 1 && render.length >= 3) {
                render.splice(render.length - 1, 1);
            }
            render[index] = el;
            if (this.isSelected(val)) {
                for (var i = render.length - 1; i >= 0; i--) {
                    if (!render[i]) {
                        render.splice(render.length - 1, 1);
                        continue;
                    }
                    render[i].addClass(this.get('selectedClassName'));
                }
                render.splice(index, 1);
            }
            this._renders[index] = render;
        }
    });

    function J(o, n) {
        return (n.y - o.y) / (n.x - o.x);
    }

    return jobSortMenu;
});


if (hbjs == undefined) {
    hbjs = window;
}
/*
hbjs.jobSortData = [{
    "id": "05",
    "name": "销售、客服、市场、公关",
    "sub": [{
        "id": "2100",
        "name": "销售人员",
        "order": "21",
        "sub": [{
            "id": "2101",
            "name": "销售代表",
            "alias": "xiaoshouguwen"
        },
            {
                "id": "2105",
                "name": "电话销售",
                "alias": "huawuyuan"
            },
            {
                "id": "2102",
                "name": "客户经理",
                "alias": "kehudaibiao"
            },
            {
                "id": "2113",
                "name": "营业员",
                "alias": "yingyeyuan"
            },
            {
                "id": "2109",
                "name": "置业顾问\/房产经纪人",
                "alias": "zhiye"
            },
            {
                "id": "2110",
                "name": "汽车销售顾问",
                "alias": "qichexiaoshou"
            },
            {
                "id": "2114",
                "name": "医药代表",
                "alias": "yiyaodaibiao"
            },
            {
                "id": "2103",
                "name": "渠道\/分销专员",
                "alias": "qudao"
            },
            {
                "id": "2106",
                "name": "团购业务员",
                "alias": "tuangouyewuyuan"
            },
            {
                "id": "2111",
                "name": "招商专员",
                "alias": "zhaoshangzhuanyuan"
            },
            {
                "id": "2112",
                "name": "销售内勤\/助理",
                "alias": "xiaoshouzhuli"
            },
            {
                "id": "2115",
                "name": "网络/在线销售",
                "alias": "zaixianxiaoshou"
            },
            {
                "id": "2116",
                "name": "驻店销售",
                "alias": "zhudianxiaoshou"
            }],
        "alias": "xiaoshou"
    },
        {
            "id": "2000",
            "name": "销售管理",
            "order": "20",
            "sub": [{
                "id": "2001",
                "name": "销售总监",
                "alias": "xiaoshouzongjian"
            },
                {
                    "id": "2010",
                    "name": "销售经理",
                    "alias": "xiaoshoubujingli"
                },
                {
                    "id": "2011",
                    "name": "渠道\/分销",
                    "alias": "qudaoguanli"
                },
                {
                    "id": "2009",
                    "name": "团购经理",
                    "alias": "tuangoujingli"
                },
                {
                    "id": "2007",
                    "name": "大客户经理",
                    "alias": "dakehujingli"
                },
                {
                    "id": "2008",
                    "name": "区域销售管理",
                    "alias": "daqujingli"
                },
                {
                    "id": "2012",
                    "name": "招商经理",
                    "alias": "zhaoshangjingli"
                }],
            "alias": "xiaoshouguanli"
        },
        {
            "id": "2300",
            "name": "客服\/售后",
            "order": "23",
            "sub": [{
                "id": "2301",
                "name": "客服总监",
                "alias": "kefuzongjian"
            },
                {
                    "id": "2311",
                    "name": "客服经理",
                    "alias": "kefujingli"
                },
                {
                    "id": "2309",
                    "name": "客服专员",
                    "alias": "kefu"
                },
                {
                    "id": "2310",
                    "name": "网店客服",
                    "alias": "taobao"
                },
                {
                    "id": "2306",
                    "name": "客户关系管理",
                    "alias": "kehuguanxiguanli"
                },
                {
                    "id": "2307",
                    "name": "售前\/售后技术支持",
                    "alias": "shouhoufuwu"
                }],
            "alias": "shouhou"
        },
        {
            "id": "3000",
            "name": "市场\/营销",
            "order": "30",
            "sub": [{
                "id": "3025",
                "name": "市场营销总监",
                "alias": "yingxiaozongjian"
            },
                {
                    "id": "3017",
                    "name": "市场营销经理",
                    "alias": "shichangbujingli"
                },
                {
                    "id": "3018",
                    "name": "市场营销专员",
                    "alias": "shichangzhuanyuan"
                },
                {
                    "id": "3019",
                    "name": "商务专员\/经理",
                    "alias": "shangwudaibiao"
                },
                {
                    "id": "3005",
                    "name": "选址拓展\/新店开发",
                    "alias": "xuanzhituozhan"
                },
                {
                    "id": "3024",
                    "name": "活动策划\/执行",
                    "alias": "cehua"
                },
                {
                    "id": "3020",
                    "name": "企划",
                    "alias": "qihuazhuanyuan"
                },
                {
                    "id": "3021",
                    "name": "促销员\/督导",
                    "alias": "cuxiaoyuan"
                },
                {
                    "id": "3022",
                    "name": "网络营销\/推广",
                    "alias": "wangluoyingxiao"
                },
                {
                    "id": "3023",
                    "name": "海外市场",
                    "alias": "haiwaishichang"
                },
                {
                    "id": "3026",
                    "name": "品牌经理/主管",
                    "alias": "pinpaijingli"
                },
                {
                    "id": "3027",
                    "name": "品牌专员",
                    "alias": "pinpaizhuanyuan"
                },
                {
                    "id": "3028",
                    "name": "市场分析/调研",
                    "alias": "shichangfenxi"
                }],
            "alias": "shichang"
        },
        {
            "id": "2900",
            "name": "公关\/媒介",
            "order": "29",
            "sub": [{
                "id": "2910",
                "name": "公关\/媒介经理",
                "alias": "gongguanjingli"
            },
                {
                    "id": "2904",
                    "name": "公关\/媒介专员",
                    "alias": "gongguanmeijie"
                },
                {
                    "id": "2911",
                    "name": "品牌经营",
                    "alias": "pinpaijingying"
                },
                {
                    "id": "2912",
                    "name": "广告协调",
                    "alias": "guanggaoxietiao"
                },
                {
                    "id": "2913",
                    "name": "会务安排",
                    "alias": "huiwuanpai"
                }],
            "alias": "gongguan"
        }],
    "alias": "xiaoshoukefushichang"
},
    {
        "id": "04",
        "name": "人资、行政、财务、管理",
        "sub": [{
            "id": "1400",
            "name": "人力资源",
            "order": "14",
            "sub": [{
                "id": "1413",
                "name": "人力资源专员",
                "alias": "renshizhuanyuan"
            },
                {
                    "id": "1404",
                    "name": "招聘专员",
                    "alias": "renyuanzhaopin"
                },
                {
                    "id": "1407",
                    "name": "培训专员",
                    "alias": "peixunzhuanyuan"
                },
                {
                    "id": "1405",
                    "name": "薪酬福利专员",
                    "alias": "xinchoufuli"
                },
                {
                    "id": "1406",
                    "name": "绩效专员",
                    "alias": "jixiaokaohe"
                },
                {
                    "id": "1412",
                    "name": "员工关系专员",
                    "alias": "yuangongguanxi"
                },
                {
                    "id": "1402",
                    "name": "人力资源经理\/主管",
                    "alias": "renshijingli"
                },
                {
                    "id": "1401",
                    "name": "人力资源总监",
                    "alias": "renliziyuanzongjian"
                }],
            "alias": "renshi"
        },
            {
                "id": "1500",
                "name": "行政后勤",
                "order": "15",
                "sub": [{
                    "id": "1503",
                    "name": "行政专员",
                    "alias": "xingzhengzhuanyuan"
                },
                    {
                        "id": "1511",
                        "name": "文员",
                        "alias": "xingzhengwenyuan"
                    },
                    {
                        "id": "1506",
                        "name": "前台接待",
                        "alias": "qiantaiwenyuan"
                    },
                    {
                        "id": "1512",
                        "name": "高管助理\/秘书",
                        "alias": "mishu"
                    },
                    {
                        "id": "1510",
                        "name": "系统管理员\/网管",
                        "alias": "wangguan"
                    },
                    {
                        "id": "1513",
                        "name": "保安",
                        "alias": "baoan"
                    },
                    {
                        "id": "1514",
                        "name": "保洁员",
                        "alias": "qingjiegong"
                    },
                    {
                        "id": "1516",
                        "name": "商务司机",
                        "alias": "shangwusiji"
                    },
                    {
                        "id": "1517",
                        "name": "客运司机",
                        "alias": "keyunsiji"
                    },
                    {
                        "id": "1518",
                        "name": "货运司机",
                        "alias": "huochesiji"
                    },
                    {
                        "id": "1515",
                        "name": "后勤",
                        "alias": "neiqin"
                    },
                    {
                        "id": "1502",
                        "name": "行政经理\/主管",
                        "alias": "xingzhengzhuguan"
                    },
                    {
                        "id": "1501",
                        "name": "行政总监",
                        "alias": "xingzhengzongjian"
                    }],
                "alias": "xingzheng"
            },
            {
                "id": "2400",
                "name": "财务\/审计\/税务",
                "order": "24",
                "sub": [{
                    "id": "2424",
                    "name": "财务专员",
                    "alias": "caiwuzhuanyuan"
                },
                    {
                        "id": "2412",
                        "name": "会计",
                        "alias": "kuaiji"
                    },
                    {
                        "id": "2414",
                        "name": "出纳",
                        "alias": "chuna"
                    },
                    {
                        "id": "2421",
                        "name": "投融资",
                        "alias": "tourongzi"
                    },
                    {
                        "id": "2422",
                        "name": "审计专员",
                        "alias": "shenji"
                    },
                    {
                        "id": "2423",
                        "name": "税务会计",
                        "alias": "shuiwu"
                    },
                    {
                        "id": "2428",
                        "name": "财务统计员",
                        "alias": "caiwutongji"
                    },
                    {
                        "id": "2427",
                        "name": "成本会计",
                        "alias": "chengbenguanli"
                    },
                    {
                        "id": "2425",
                        "name": "结算专员",
                        "alias": "jiesuan"
                    },
                    {
                        "id": "2426",
                        "name": "风控专员",
                        "alias": "fengkong"
                    },
                    {
                        "id": "2429",
                        "name": "资金\/资产会计",
                        "alias": "zijin"
                    },
                    {
                        "id": "2404",
                        "name": "财务经理\/主管",
                        "alias": "caiwuzhuguan"
                    },
                    {
                        "id": "2403",
                        "name": "财务总监",
                        "alias": "caiwuzongjian"
                    }],
                "alias": "caiwukuaiji"
            },
            {
                "id": "4500",
                "name": "律师\/法务",
                "order": "45",
                "sub": [{
                    "id": "4501",
                    "name": "律师\/法律顾问",
                    "alias": "falvguwen"
                },
                    {
                        "id": "4502",
                        "name": "法务经理\/主管",
                        "alias": "fawujingli"
                    },
                    {
                        "id": "4509",
                        "name": "法务专员",
                        "alias": "fawu"
                    },
                    {
                        "id": "4505",
                        "name": "知识产权\/专利顾问",
                        "alias": "zhishichanquan"
                    },
                    {
                        "id": "4510",
                        "name": "合规管理",
                        "alias": "heguiguanli"
                    }],
                "alias": "lushifawu"
            },
            {

                "id": "1300",
                "name": "高级管理",
                "order": "13",
                "sub": [{
                    "id": "1315",
                    "name": "CEO",
                    "alias": "zongjingli"
                },
                    {
                        "id": "1318",
                        "name": "副总",
                        "alias": "fuzongjingli"
                    },
                    {
                        "id": "1322",
                        "name": "CTO",
                        "alias": "cto"
                    },
                    {
                        "id": "1316",
                        "name": "COO",
                        "alias": "coo"
                    },
                    {
                        "id": "1317",
                        "name": "CFO",
                        "alias": "cfo"
                    },
                    {
                        "id": "1320",
                        "name": "办事处\/分公司负责人",
                        "alias": "banshichu"
                    },
                    {
                        "id": "1312",
                        "name": "总工程师",
                        "alias": "zonggongchengshi"
                    },
                    {
                        "id": "1313",
                        "name": "厂长\/副厂长",
                        "alias": "shengchanchangzhang"
                    },
                    {
                        "id": "1306",
                        "name": "合伙人",
                        "alias": "hehuoren"
                    },
                    {
                        "id": "1321",
                        "name": "总经理助理",
                        "alias": "zongjinglizhuli"
                    },
                    {
                        "id": "1399",
                        "name": "其他(高级管理)",
                        "alias": "qitagaojiguanli"
                    }],
                "alias": "gaojiguanli"
            }],
        "alias": "renli"
    },
    {
        "id": "09",
        "name": "生产、工人、质控",
        "sub": [{
            "id": "7500",
            "name": "生产\/营运",
            "order": "1",
            "sub": [{
                "id": "7501",
                "name": "厂长\/副厂长",
                "alias": "changzhang"
            },
                {
                    "id": "7502",
                    "name": "总工程师\/副总工程师",
                    "alias": "shengchanzonggongchengshi"
                },
                {
                    "id": "7503",
                    "name": "车间主任",
                    "alias": "shengchanbuzhang"
                },
                {
                    "id": "7504",
                    "name": "项目经理",
                    "alias": "xiangmujingli"
                },
                {
                    "id": "7505",
                    "name": "技术工程师",
                    "alias": "jishugongchengshi"
                },
                {
                    "id": "7506",
                    "name": "营运经理\/主管",
                    "alias": "shengchanguanli"
                },
                {
                    "id": "7507",
                    "name": "生产计划\/调度",
                    "alias": "diaodu"
                },
                {
                    "id": "7508",
                    "name": "物料管理\/库管",
                    "alias": "wuliaoguanli"
                },
                {
                    "id": "7509",
                    "name": "生产主管\/领班\/组长",
                    "alias": "shengchanzhuguan"
                },
                {
                    "id": "7510",
                    "name": "工艺设计",
                    "alias": "gongyisheji"
                },
                {
                    "id": "7511",
                    "name": "化验\/检验",
                    "alias": "huayan"
                },
                {
                    "id": "7512",
                    "name": "生产文员",
                    "alias": "shengchanwenyuan"
                },
                {
                    "id": "7513",
                    "name": "设备管理",
                    "alias": "shengchanshebeiguanli"
                },
                {
                    "id": "7599",
                    "name": "其他（生产\/营运）",
                    "alias": "qitashengchan"
                }],
            "alias": "shengchanyingyun"
        },
            {
                "id": "7600",
                "name": "普工\/技工",
                "order": "2",
                "sub": [{
                    "id": "7601",
                    "name": "普工",
                    "alias": "gongren"
                },
                    {
                        "id": "7602",
                        "name": "钣金工",
                        "alias": "banjingong"
                    },
                    {
                        "id": "7603",
                        "name": "机修工",
                        "alias": "jixiugong"
                    },
                    {
                        "id": "7604",
                        "name": "冲压工",
                        "alias": "chongyagong"
                    },
                    {
                        "id": "7605",
                        "name": "装配工",
                        "alias": "zhuangpei"
                    },
                    {
                        "id": "7606",
                        "name": "焊工",
                        "alias": "hangong"
                    },
                    {
                        "id": "7607",
                        "name": "钳工",
                        "alias": "qiangong"
                    },
                    {
                        "id": "7608",
                        "name": "车工",
                        "alias": "chegong"
                    },
                    {
                        "id": "7609",
                        "name": "磨工",
                        "alias": "mogong"
                    },
                    {
                        "id": "7610",
                        "name": "铣工",
                        "alias": "xigong"
                    },
                    {
                        "id": "7611",
                        "name": "切割技工",
                        "alias": "xianqiege"
                    },
                    {
                        "id": "7612",
                        "name": "模具工",
                        "alias": "mojugong"
                    },
                    {
                        "id": "7613",
                        "name": "叉车工\/铲车",
                        "alias": "chache"
                    },
                    {
                        "id": "7614",
                        "name": "空调工",
                        "alias": "kongtiaogong"
                    },
                    {
                        "id": "7615",
                        "name": "电梯工",
                        "alias": "diantigong"
                    },
                    {
                        "id": "7616",
                        "name": "锅炉工",
                        "alias": "guolugong"
                    },
                    {
                        "id": "7617",
                        "name": "水电工",
                        "alias": "shuidian"
                    },
                    {
                        "id": "7618",
                        "name": "木工",
                        "alias": "mugong"
                    },
                    {
                        "id": "7619",
                        "name": "油漆工",
                        "alias": "penqigong"
                    },
                    {
                        "id": "7620",
                        "name": "注塑工",
                        "alias": "zhusu"
                    },
                    {
                        "id": "7621",
                        "name": "铸造\/锻造",
                        "alias": "yazhu"
                    },
                    {
                        "id": "7622",
                        "name": "万能工",
                        "alias": "wannenggong"
                    },
                    /!*{
					 "id": "7623",
					 "name": "汽车修理",
					 "alias": "qicheweixiu"
					 },*!/
                    {
                        "id": "7624",
                        "name": "组装工",
                        "alias": "zuzhuanggong"
                    },{
                        "id": "7625",
                        "name": "包装工",
                        "alias": "baozhuanggong"
                    },{
                        "id": "7626",
                        "name": "旋压工",
                        "alias": "xuanyagong"
                    },{
                        "id": "7627",
                        "name": "仪表工",
                        "alias": "yibiaogong"
                    },{
                        "id": "7628",
                        "name": "电镀工",
                        "alias": "diandugong"
                    },{
                        "id": "7629",
                        "name": "喷塑工",
                        "alias": "pensugong"
                    },{
                        "id": "7630",
                        "name": "折弯工",
                        "alias": "zhewangong"
                    },{
                        "id": "7631",
                        "name": "刨工",
                        "alias": "paogong"
                    },{
                        "id": "7632",
                        "name": "钻工",
                        "alias": "zuangong"
                    },{
                        "id": "7633",
                        "name": "镗工",
                        "alias": "tanggong"
                    },{
                        "id": "7634",
                        "name": "铆工",
                        "alias": "maogong"
                    },{
                        "id": "7635",
                        "name": "抛光工",
                        "alias": "paoguanggong"
                    },{
                        "id": "7636",
                        "name": "炼胶工",
                        "alias": "lianjiaogong"
                    },{
                        "id": "7637",
                        "name": "硫化工",
                        "alias": "liuhuagong"
                    },{
                        "id": "7638",
                        "name": "吹膜工",
                        "alias": "chuimogong"
                    },
                    {
                        "id": "7699",
                        "name": "其他（普工\/技工）",
                        "alias": "qitagongren"
                    }],
                "alias": "jigong"
            },
            {
                "id": "7700",
                "name": "质控\/安防",
                "order": "3",
                "sub": [{
                    "id": "7701",
                    "name": "质量管理\/测试经理",
                    "alias": "zhiliangguanli"
                },
                    {
                        "id": "7702",
                        "name": "质量检验员\/测试员",
                        "alias": "zhijianyuan"
                    },
                    {
                        "id": "7703",
                        "name": "可靠度工程师",
                        "alias": "kekaodugongchengshi"
                    },
                    {
                        "id": "7704",
                        "name": "认证体系工程师\/审核员",
                        "alias": "renzhengtixigongchengshi"
                    },
                    {
                        "id": "7705",
                        "name": "供应商管理（SQE）",
                        "alias": "sqe"
                    },
                    {
                        "id": "7706",
                        "name": "安全消防",
                        "alias": "anfang"
                    },
                    {
                        "id": "7707",
                        "name": "环保",
                        "alias": "huanjingbaohu"
                    },
                    {
                        "id": "7799",
                        "name": "其他（质控\/安防）",
                        "alias": "qitazhikong"
                    }],
                "alias": "zhikong"
            }],
        "alias": "shengchan"
    },
    {
        "id": "01",
        "name": "互联网、游戏、软件",
        "order": "3",
        "sub": [{
            "id": "6000",
            "name": "后端开发",
            "order": "1",
            "sub": [{
                "id": "6001",
                "name": "PHP",
                "alias": "php"
            },
                {
                    "id": "6002",
                    "name": "Java",
                    "alias": "javachengxuyuan"
                },
                {
                    "id": "6003",
                    "name": ".net",
                    "alias": "netchengxuyuan"
                },
                {
                    "id": "6004",
                    "name": "C\/C++",
                    "alias": "c++"
                },
                {
                    "id": "6005",
                    "name": "C#",
                    "alias": "c"
                },
                {
                    "id": "6006",
                    "name": "python",
                    "alias": "python"
                },
                {
                    "id": "6007",
                    "name": "架构师",
                    "alias": "jiagoushi"
                },
                {
                    "id": "6008",
                    "name": "其他（后端开发）",
                    "alias": "houduankaifa"
                },
                {
                    "id": "6009",
                    "name": "数据挖掘",
                    "alias": "shujuwajue"
                },
                {
                    "id": "6010",
                    "name": "搜索算法",
                    "alias": "sousuosuanfa"
                },
                {
                    "id": "6011",
                    "name": "精准推荐",
                    "alias": "jingzhuntuijian"
                },
                {
                    "id": "6012",
                    "name": "全栈工程师",
                    "alias": "quanzhangongchengshi"
                },
                {
                    "id": "6013",
                    "name": "Delphi",
                    "alias": "delphi"
                },
                {
                    "id": "6014",
                    "name": "VB",
                    "alias": "vb"
                },
                {
                    "id": "6015",
                    "name": "Perl",
                    "alias": "perl"
                },
                {
                    "id": "6016",
                    "name": "Ruby",
                    "alias": "ruby"
                },
                {
                    "id": "6017",
                    "name": "Node.js",
                    "alias": "nodejs"
                },
                {
                    "id": "6018",
                    "name": "Go",
                    "alias": "go"
                },
                {
                    "id": "6019",
                    "name": "ASP",
                    "alias": "asp"
                },
                {
                    "id": "6020",
                    "name": "Shell",
                    "alias": "shell"
                }],
            "alias": "chengxuyuan"
        },
            {
                "id": "6100",
                "name": "移动开发",
                "order": "2",
                "sub": [{
                    "id": "6101",
                    "name": "IOS",
                    "alias": "ios"
                },
                    {
                        "id": "6102",
                        "name": "android",
                        "alias": "android"
                    },
                    {
                        "id": "6103",
                        "name": "html5(移动)",
                        "alias": "html5"
                    },
                    {
                        "id": "6104",
                        "name": "其他（移动开发）",
                        "alias": "shouji"
                    }],
                "alias": "yidongkaifa"
            },
            {
                "id": "6200",
                "name": "前端开发",
                "order": "3",
                "sub": [{
                    "id": "6201",
                    "name": "网页前端",
                    "alias": "wangyeqianduan"
                },
                    {
                        "id": "6202",
                        "name": "html5(前端)",
                        "alias": "html5qianduan"
                    },
                    {
                        "id": "6203",
                        "name": "JavaScript",
                        "alias": "javascript"
                    },
                    {
                        "id": "6204",
                        "name": "Flash",
                        "alias": "flash"
                    },
                    {
                        "id": "6205",
                        "name": "COCOS2D-X\/U3D",
                        "alias": "cocos2d"
                    },
                    {
                        "id": "6206",
                        "name": "其他（前端开发）",
                        "alias": "qianduan"
                    }],
                "alias": "qianduankaifa"
            },
            {
                "id": "9900",
                "name": "人工智能",
                "order": "4",
                "sub": [{
                    "id": "9901",
                    "name": "深度学习",
                    "alias": "shenduxuexi"
                },
                    {
                        "id": "9902",
                        "name": "机器学习",
                        "alias": "jixiexuexi"
                    },
                    {
                        "id": "9903",
                        "name": "图像处理",
                        "alias": "tuxiangchuli"
                    },
                    {
                        "id": "9904",
                        "name": "图像识别",
                        "alias": "tuxiangshibie"
                    },
                    {
                        "id": "9905",
                        "name": "语音识别",
                        "alias": "yuyinshibie"
                    },
                    {
                        "id": "9906",
                        "name": "机器视觉",
                        "alias": "jiqishijue"
                    },
                    {
                        "id": "9907",
                        "name": "算法工程师",
                        "alias": "suanfagongcs"
                    },
                    {
                        "id": "9908",
                        "name": "自然语言处理",
                        "alias": "ziranyuyanchuli"
                    }],
                "alias": "rengongzhineng"
            },
            {
                "id": "6300",
                "name": "运维",
                "order": "5",
                "sub": [{
                    "id": "6301",
                    "name": "运维工程师",
                    "alias": "yunweigongchengshi"
                },
                    {
                        "id": "6302",
                        "name": "网络安全",
                        "alias": "wangluoanquan"
                    },
                    {
                        "id": "6303",
                        "name": "运维经理",
                        "alias": "yunweijingli"
                    }],
                "alias": "yunwei"
            },
            {
                "id": "6400",
                "name": "数据库",
                "order": "6",
                "sub": [{
                    "id": "6401",
                    "name": "mysql",
                    "alias": "mysql"
                },
                    {
                        "id": "6402",
                        "name": "SQL Server",
                        "alias": "sqlserver"
                    },
                    {
                        "id": "6403",
                        "name": "Oracle",
                        "alias": "oracle"
                    },
                    {
                        "id": "6404",
                        "name": "hadoop",
                        "alias": "hadoop"
                    },
                    {
                        "id": "6405",
                        "name": "DBA",
                        "alias": "dba"
                    },
                    {
                        "id": "6406",
                        "name": "DB2",
                        "alias": "db2"
                    },
                    {
                        "id": "6407",
                        "name": "MongoDB",
                        "alias": "mongodb"
                    },
                    {
                        "id": "6408",
                        "name": "ETL",
                        "alias": "etl"
                    },
                    {
                        "id": "6409",
                        "name": "Hive",
                        "alias": "hive"
                    },
                    {
                        "id": "6410",
                        "name": "数据仓库",
                        "alias": "shujucangku"
                    }],
                "alias": "shujuku"
            },
            {
                "id": "6500",
                "name": "技术管理",
                "order": "7",
                "sub": [{
                    "id": "6501",
                    "name": "项目经理\/助理",
                    "alias": "itxiangmujingli"
                },
                    {
                        "id": "6502",
                        "name": "技术经理",
                        "alias": "jishujingli"
                    },
                    {
                        "id": "6503",
                        "name": "CTO",
                        "alias": "itcto"
                    }],
                "alias": "jishuguanli"
            },
            {
                "id": "6600",
                "name": "其他技术",
                "order": "8",
                "sub": [{
                    "id": "6601",
                    "name": "软件实施",
                    "alias": "ruanjianshishi"
                },
                    {
                        "id": "6602",
                        "name": "系统集成",
                        "alias": "xitongjicheng"
                    },
                    {
                        "id": "6603",
                        "name": "系统分析员",
                        "alias": "xitongfenxiyuan"
                    }],
                "alias": "qitajishu"
            },
            {
                "id": "6700",
                "name": "测试",
                "order": "9",
                "sub": [{
                    "id": "6701",
                    "name": "软件测试",
                    "alias": "ruanjianceshi"
                },
                    {
                        "id": "6702",
                        "name": "移动端测试",
                        "alias": "yidongduanceshi"
                    },
                    {
                        "id": "6703",
                        "name": "游戏测试",
                        "alias": "youxiceshi"
                    },
                    {
                        "id": "6704",
                        "name": "测试工程师",
                        "alias": "ceshigongchengshi"
                    },
                    {
                        "id": "6705",
                        "name": "测试主管/经理",
                        "alias": "ceshizhuguan"
                    },
                    {
                        "id": "6706",
                        "name": "测试总监",
                        "alias": "ceshizongjian"
                    }],
                "alias": "ceshi"
            },
            {
                "id": "6800",
                "name": "产品",
                "order": "10",
                "sub": [{
                    "id": "6801",
                    "name": "网页产品经理",
                    "alias": "wangyechanpinjingli"
                },
                    {
                        "id": "6802",
                        "name": "移动产品经理",
                        "alias": "yidongchanpinjingli"
                    },
                    {
                        "id": "6803",
                        "name": "电商产品经理",
                        "alias": "dianshangchanpinjingli"
                    },
                    {
                        "id": "6804",
                        "name": "软件产品经理",
                        "alias": "ruanjianchanpinjingli"
                    },
                    {
                        "id": "6805",
                        "name": "游戏策划",
                        "alias": "youxicehua"
                    },
                    {
                        "id": "6806",
                        "name": "产品经理",
                        "alias": "chanpinjingli"
                    },
                    {
                        "id": "6807",
                        "name": "产品专员\/助理",
                        "alias": "chanpinzhuanyuan"
                    },
                    {
                        "id": "6808",
                        "name": "数据产品经理",
                        "alias": "shujuchanpinjingli"
                    },
                    //{
                    //	"id": "6809",
                    //	"name": "游戏策划",
                    //	"alias": "youxicehua"
                    //},
                    {
                        "id": "6810",
                        "name": "产品部主管/经理",
                        "alias": "chanpinbuzhuguan"
                    },
                    {
                        "id": "6811",
                        "name": "产品总监",
                        "alias": "chanpinzongjian"
                    },
                    {
                        "id": "6812",
                        "name": "用户研究员",
                        "alias": "yonghuyanjiuyuan"
                    },
                    {
                        "id": "6813",
                        "name": "数据分析师",
                        "alias": "shujufenxishi"
                    }],
                "alias": "chanpin"
            },
            {
                "id": "6900",
                "name": "设计",
                "order": "11",
                "sub": [{
                    "id": "6901",
                    "name": "UI设计",
                    "alias": "ituisheji"
                },
                    {
                        "id": "6902",
                        "name": "平面设计",
                        "alias": "pingmiansheji"
                    },
                    {
                        "id": "6903",
                        "name": "网页设计\/美工",
                        "alias": "wangyeshejishi"
                    },
                    {
                        "id": "6904",
                        "name": "游戏设计\/原画设计",
                        "alias": "youxisheji"
                    },
                    {
                        "id": "6905",
                        "name": "交互设计",
                        "alias": "jiaohusheji"
                    },
                    {
                        "id": "6906",
                        "name": "设计师",
                        "alias": "shejishi"
                    },
                    {
                        "id": "6907",
                        "name": "设计主管/经理",
                        "alias": "shejizhuguan"
                    },
                    {
                        "id": "6908",
                        "name": "设计总监",
                        "alias": "shejizongjian"
                    }],
                "alias": "itsheji"
            },
            {
                "id": "7000",
                "name": "运营\/市场",
                "order": "12",
                "sub": [{
                    "id": "7001",
                    "name": "网店运营",
                    "alias": "wangdianyunying"
                },
                    {
                        "id": "7002",
                        "name": "SEO\/ASO\/SEM",
                        "alias": "seo"
                    },
                    {
                        "id": "7003",
                        "name": "网络推广",
                        "alias": "wangluotuiguang"
                    },
                    {
                        "id": "7004",
                        "name": "文案策划",
                        "alias": "wenan"
                    },
                    {
                        "id": "7005",
                        "name": "编辑\/内容运营",
                        "alias": "wangluobianji"
                    },
                    {
                        "id": "7006",
                        "name": "新媒体运营",
                        "alias": "xinmeitiyunying"
                    },
                    {
                        "id": "7007",
                        "name": "市场策划",
                        "alias": "shichangcehua"
                    },
                    {
                        "id": "7008",
                        "name": "运营\/市场专员",
                        "alias": "yunyingzhuanyuan"
                    },
                    {
                        "id": "7009",
                        "name": "运营\/市场经理",
                        "alias": "yunyingjingli"
                    },
                    {
                        "id": "7010",
                        "name": "运营\/市场总监",
                        "alias": "yunyingzongjian"
                    },
                    {
                        "id": "7011",
                        "name": "用户运营",
                        "alias": "yonghuyunying"
                    },
                    {
                        "id": "7012",
                        "name": "数据运营",
                        "alias": "shujuyunying"
                    },
                    {
                        "id": "7013",
                        "name": "活动运营",
                        "alias": "huodongyunying"
                    },
                    {
                        "id": "7014",
                        "name": "商家运营",
                        "alias": "shangjiayunying"
                    },
                    {
                        "id": "7015",
                        "name": "品类运营",
                        "alias": "pinleiyunying"
                    },
                    {
                        "id": "7016",
                        "name": "游戏运营",
                        "alias": "youxiyunying"
                    }],
                "alias": "wangzhanyunying"
            }],
        "alias": "hulianwang"
    },
    {
        "id": "02",
        "name": "通信、硬件、电子电器",
        "sub": [{
            "id": "7900",
            "name": "通信\/网络设备",
            "order": "1",
            "sub": [{
                "id": "7901",
                "name": "移动通信工程师",
                "alias": "yidongtongxingongchengshi"
            },
                {
                    "id": "7902",
                    "name": "有线传输工程师",
                    "alias": "youxianchuanshugongchengshi"
                },
                {
                    "id": "7903",
                    "name": "网络工程师",
                    "alias": "wangluogongchengshi"
                },
                {
                    "id": "7904",
                    "name": "通信项目管理",
                    "alias": "tongxinxiangmuguanli"
                },
                {
                    "id": "7905",
                    "name": "安装技术员",
                    "alias": "anzhuangjishuyuan"
                },
                {
                    "id": "7906",
                    "name": "通信技术工程师",
                    "alias": "tongxinjishugongchengshi"
                },
                {
                    "id": "7907",
                    "name": "通信设备维修",
                    "alias": "tongxinshebeiweixiu"
                },
                {
                    "id": "7908",
                    "name": "无线通信工程师",
                    "alias": "wuxiantongxingongchengshi"
                },
                {
                    "id": "7909",
                    "name": "电信交换工程师",
                    "alias": "dianxinjiaohuangongchengshi"
                },
                {
                    "id": "7910",
                    "name": "数据通信工程师",
                    "alias": "shujutongxingongchengshi"
                },
                {
                    "id": "7911",
                    "name": "电信网络工程师",
                    "alias": "dianxinwangluogongchengshi"
                },
                {
                    "id": "7912",
                    "name": "通信电源工程师",
                    "alias": "tongxindianyuangongchengshi"
                },
                {
                    "id": "7999",
                    "name": "其他（通信\/网络设备）",
                    "alias": "qitatongxin"
                }],
            "alias": "tongxin"
        },
            {
                "id": "9300",
                "name": "电子",
                "order": "2",
                "sub": [{
                    "id": "9301",
                    "name": "电源开发工程师",
                    "alias": "dianyuankaifagongchengshi"
                },
                    {
                        "id": "9302",
                        "name": "工艺工程师",
                        "alias": "dianzigongyi"
                    },
                    {
                        "id": "9303",
                        "name": "汽车电子工程师",
                        "alias": "qichedianzigongchengshi"
                    },
                    {
                        "id": "9304",
                        "name": "自动化工程师",
                        "alias": "zidonghuagongchengshi"
                    },
                    {
                        "id": "9305",
                        "name": "嵌入式开发",
                        "alias": "qianrushikaifa"
                    },
                    {
                        "id": "9306",
                        "name": "仪器\/仪表\/计量",
                        "alias": "yiqi"
                    },
                    {
                        "id": "9307",
                        "name": "测试工程师",
                        "alias": "dianziceshi"
                    },
                    {
                        "id": "9308",
                        "name": "SMT工程师",
                        "alias": "smt"
                    },
                    {
                        "id": "9309",
                        "name": "电子工程师",
                        "alias": "dianzigongchengshi"
                    }],
                "alias": "dianzi"
            },
            {
                "id": "9400",
                "name": "电器",
                "order": "3",
                "sub": [{
                    "id": "9401",
                    "name": "家电\/数码产品研发",
                    "alias": "jiadian"
                },
                    {
                        "id": "9402",
                        "name": "光源和照明工程师",
                        "alias": "zhaomingsheji"
                    },
                    {
                        "id": "9403",
                        "name": "音响工程师",
                        "alias": "yinxianggongchengshi"
                    },
                    {
                        "id": "9404",
                        "name": "电器维修",
                        "alias": "dianqiweixiu"
                    },
                    {
                        "id": "9405",
                        "name": "电器工程师",
                        "alias": "dianqigongchengshi"
                    }],
                "alias": "dianqi"
            }],
        "alias": "tongxinyingjian"
    },
    {
        "id": "09",
        "name": "汽摩、机械",
        "sub": [{
            "id": "7100",
            "name": "汽车研发\/设计",
            "order": "1",
            "sub": [{
                "id": "7101",
                "name": "电器设计师",
                "alias": "dianqishejishi"
            },
                {
                    "id": "7102",
                    "name": "底盘设计师",
                    "alias": "dipanshejishi"
                },
                {
                    "id": "7103",
                    "name": "车身\/造型设计师",
                    "alias": "cheshen"
                },
                {
                    "id": "7104",
                    "name": "动力系统工程师",
                    "alias": "donglixitonggongchengshi"
                },
                {
                    "id": "7105",
                    "name": "内外饰工程师",
                    "alias": "neiwaishigongchengshi"
                },
                {
                    "id": "7106",
                    "name": "机电工程师",
                    "alias": "jidiangongchengshi"
                },
                {
                    "id": "7107",
                    "name": "涂装工程师",
                    "alias": "tuzhuanggongchengshi"
                },
                {
                    "id": "7108",
                    "name": "总布置工程师",
                    "alias": "zongbuzhigongchengshi"
                },
                {
                    "id": "7109",
                    "name": "车辆试验\/测试",
                    "alias": "cheliangshiyan"
                },
                {
                    "id": "7110",
                    "name": "质量工程师",
                    "alias": "zhilianggongchengshi"
                },
                {
                    "id": "7111",
                    "name": "其他（汽车研发/设计）",
                    "alias": "yanfagongchengshi"
                },
                {
                    "id": "7112",
                    "name": "汽车设计工程师",
                    "alias": "qicheshejigongchengshi"
                },
                {
                    "id": "7113",
                    "name": "汽车电子工程师",
                    "alias": "qichedianzigongchengshi"
                },
                {
                    "id": "7114",
                    "name": "发动机/总装工程师",
                    "alias": "fadongjiorzongzhuang"
                },
                {
                    "id": "7115",
                    "name": "汽车项目管理",
                    "alias": "qichexiangmujingli"
                },
                {
                    "id": "7116",
                    "name": "汽车质量管理",
                    "alias": "qichezhiliangguanli"
                },
                {
                    "id": "7117",
                    "name": "汽车安全性能工程师",
                    "alias": "qicheanquanxingnenggongchengshi"
                },
                {
                    "id": "7118",
                    "name": "汽车装配工艺工程师",
                    "alias": "qichezhuangpeigongyigongchengshi"
                }],
            "alias": "qicheyanfa"
        },
            {
                "id": "7200",
                "name": "汽车销售\/市场",
                "order": "2",
                "sub": [{
                    "id": "7201",
                    "name": "汽车销售顾问",
                    "alias": "qichexiaoshouguwen"
                },
                    {
                        "id": "7202",
                        "name": "精品销售",
                        "alias": "jingpinxiaoshou"
                    },
                    {
                        "id": "7203",
                        "name": "零配件销售",
                        "alias": "lingpeijianxiaoshou"
                    },
                    {
                        "id": "7204",
                        "name": "销售内勤",
                        "alias": "xiaoshouneiqin"
                    },
                    {
                        "id": "7205",
                        "name": "销售经理",
                        "alias": "xiaoshoujingli"
                    },
                    {
                        "id": "7206",
                        "name": "市场营销专员",
                        "alias": "qicheshichangzhuanyuan"
                    },
                    {
                        "id": "7207",
                        "name": "市场营销经理",
                        "alias": "qicheshichangjingli"
                    },
                    {
                        "id": "7208",
                        "name": "二手车评估师",
                        "alias": "ershouchepinggushi"
                    },
                    {
                        "id": "7209",
                        "name": "销售库管",
                        "alias": "xiaoshoukuguan"
                    }],
                "alias": "qichexiaoshoushichang"
            },
            {
                "id": "7300",
                "name": "汽车服务\/维修",
                "order": "3",
                "sub": [{
                    "id": "7301",
                    "name": "汽车美容",
                    "alias": "qichemeirong"
                },
                    {
                        "id": "7302",
                        "name": "洗车工",
                        "alias": "xichegong"
                    },
                    {
                        "id": "7303",
                        "name": "售后服务\/客服",
                        "alias": "qicheshouhoufuwu"
                    },
                    {
                        "id": "7304",
                        "name": "售后经理\/主管",
                        "alias": "shouhoujingli"
                    },
                    {
                        "id": "7305",
                        "name": "保险理赔",
                        "alias": "baoxianlipei"
                    },
                    {
                        "id": "7306",
                        "name": "机电维修",
                        "alias": "jidianweixiu"
                    },
                    {
                        "id": "7307",
                        "name": "维修钣金工",
                        "alias": "weixiubanjingong"
                    },
                    {
                        "id": "7308",
                        "name": "维修漆工",
                        "alias": "weixiuqigong"
                    },
                    {
                        "id": "7399",
                        "name": "其他（服务\/售后\/维修）",
                        "alias": "fuwu"
                    }],
                "alias": "qichefuwu"
            },
            {
                "id": "7400",
                "name": "机械\/设备",
                "order": "4",
                "sub": [{
                    "id": "7401",
                    "name": "模具设计师",
                    "alias": "mujugongchengshi"
                },
                    {
                        "id": "7402",
                        "name": "机械工程师",
                        "alias": "jixiesheji"
                    },
                    {
                        "id": "7403",
                        "name": "机电工程师",
                        "alias": "jidian"
                    },
                    {
                        "id": "7404",
                        "name": "CNC工程师",
                        "alias": "cnc"
                    },
                    {
                        "id": "7405",
                        "name": "夹具设计师",
                        "alias": "jiajushejishi"
                    },
                    {
                        "id": "7406",
                        "name": "结构工程师",
                        "alias": "jiegougongchengshi"
                    },
                    {
                        "id": "7407",
                        "name": "绘图员",
                        "alias": "huituyuan"
                    },
                    {
                        "id": "7408",
                        "name": "设备管理",
                        "alias": "shebeiguanli"
                    },
                    {
                        "id": "7409",
                        "name": "设备维修",
                        "alias": "shebeiweixiu"
                    },
                    {
                        "id": "7410",
                        "name": "工艺工程师",
                        "alias": "gongyigongchengshi"
                    },
                    {
                        "id": "7411",
                        "name": "工业工程师",
                        "alias": "gongyegongchengshi"
                    },
                    {
                        "id": "7412",
                        "name": "材料工程师",
                        "alias": "cailiaogongchengshi"
                    },
                    {
                        "id": "7413",
                        "name": "技术研发",
                        "alias": "jishuyanfa"
                    },
                    {
                        "id": "7414",
                        "name": "技术研发经理\/主管",
                        "alias": "jishuyanfajingli"
                    },
                    {
                        "id": "7415",
                        "name": "注塑工程师/技师",
                        "alias": "zhusugongchengshi"
                    },
                    {
                        "id": "7416",
                        "name": "焊接工程师/技师",
                        "alias": "hanjiegongchengshi"
                    },
                    {
                        "id": "7417",
                        "name": "冲压工程师/技师",
                        "alias": "chongyagongchengshi"
                    },
                    {
                        "id": "7418",
                        "name": "锅炉工程师/技师",
                        "alias": "guolugongchengshi"
                    },
                    {
                        "id": "7499",
                        "name": "其他（机械\/设备）",
                        "alias": "qitajixie"
                    }],
                "alias": "jixie"
            }],
        "alias": "shengchan"
    },
    {
        "id": "06",
        "name": "房地产、建筑、物业、装饰",
        "sub": [{
            "id": "8000",
            "name": "建筑设计",
            "order": "1",
            "sub": [{
                "id": "8001",
                "name": "总建筑师\/设计总监",
                "alias": "zongjianzhushi"
            },
                {
                    "id": "8002",
                    "name": "建筑设计师",
                    "alias": "jianzhushi"
                },
                {
                    "id": "8003",
                    "name": "绘图\/效果图制作",
                    "alias": "xiaoguotu"
                },
                {
                    "id": "8004",
                    "name": "规划设计师",
                    "alias": "guihuashejishi"
                },
                {
                    "id": "8005",
                    "name": "方案设计师",
                    "alias": "fanganshejishi"
                },
                {
                    "id": "8006",
                    "name": "结构设计师",
                    "alias": "jiegoushejishi"
                },
                {
                    "id": "8007",
                    "name": "暖通设计师",
                    "alias": "nuantonggongcheng"
                },
                {
                    "id": "8008",
                    "name": "给排水设计师",
                    "alias": "geipaishui"
                },
                {
                    "id": "8009",
                    "name": "电气设计师",
                    "alias": "jianzhudianqishejishi"
                },
                {
                    "id": "8010",
                    "name": "幕墙设计师",
                    "alias": "muqiangshejishi"
                },
                {
                    "id": "8011",
                    "name": "施工图设计师",
                    "alias": "shigongtushejishi"
                },
                {
                    "id": "8012",
                    "name": "园林\/景观设计",
                    "alias": "jingguanshejishi"
                },
                {
                    "id": "8099",
                    "name": "其他（建筑设计）",
                    "alias": "qitajianzhusheji"
                }],
            "alias": "jianzhusheji"
        },
            {
                "id": "8100",
                "name": "建筑工程",
                "order": "2",
                "sub": [{
                    "id": "8101",
                    "name": "总工程师\/工程总监",
                    "alias": "jianzhuzonggongchengshi"
                },
                    {
                        "id": "8102",
                        "name": "工程经理",
                        "alias": "gongchengbujingli"
                    },
                    {
                        "id": "8103",
                        "name": "建筑工程师\/建造师",
                        "alias": "jianzaoshi"
                    },
                    {
                        "id": "8104",
                        "name": "招投标",
                        "alias": "zhaotoubiao"
                    },
                    {
                        "id": "8105",
                        "name": "配套工程师",
                        "alias": "peitaogongchengshi"
                    },
                    {
                        "id": "8106",
                        "name": "开发报建",
                        "alias": "kaifabaojian"
                    },
                    {
                        "id": "8107",
                        "name": "预结算\/造价",
                        "alias": "yusuan"
                    },
                    {
                        "id": "8108",
                        "name": "土建工程师",
                        "alias": "tujian"
                    },
                    {
                        "id": "8109",
                        "name": "安装工程师",
                        "alias": "anzhuanggongchengshi"
                    },
                    {
                        "id": "8110",
                        "name": "路桥\/市政工程师",
                        "alias": "shizheng"
                    },
                    {
                        "id": "8111",
                        "name": "岩土工程师",
                        "alias": "yantugongchengshi"
                    },
                    {
                        "id": "8112",
                        "name": "智能楼宇",
                        "alias": "zhinenglouyu"
                    },
                    {
                        "id": "8113",
                        "name": "测绘\/测量",
                        "alias": "celiang"
                    },
                    {
                        "id": "8114",
                        "name": "施工员",
                        "alias": "tujianshigongyuan"
                    },
                    {
                        "id": "8115",
                        "name": "施工管理\/工长",
                        "alias": "shigongguanli"
                    },
                    {
                        "id": "8116",
                        "name": "资料员",
                        "alias": "gongchengziliaoyuan"
                    },
                    {
                        "id": "8117",
                        "name": "采购\/材料",
                        "alias": "cailiaoyuan"
                    },
                    {
                        "id": "8118",
                        "name": "安全员",
                        "alias": "anquanyuan"
                    },
                    {
                        "id": "8119",
                        "name": "质检员",
                        "alias": "zhijian"
                    },
                    {
                        "id": "8120",
                        "name": "监理工程师",
                        "alias": "jianliyuan"
                    },
                    {
                        "id": "8121",
                        "name": "建筑机电工程师",
                        "alias": "jianzhujidiangongchengshi"
                    },
                    {
                        "id": "8122",
                        "name": "给排水/暖通工程",
                        "alias": "jipaishuiornuantong"
                    },
                    {
                        "id": "8123",
                        "name": "幕墙工程师",
                        "alias": "muqianggongchengshi"
                    },
                    {
                        "id": "8124",
                        "name": "建筑工程验收",
                        "alias": "jianzhugongchengyanshou"
                    },
                    {
                        "id": "8125",
                        "name": "建筑安装施工员",
                        "alias": "jianzhuanzhuangshigongyuan"
                    },
                    {
                        "id": "8126",
                        "name": "砌筑工",
                        "alias": "qiezhugong"
                    },
                    {
                        "id": "8127",
                        "name": "瓦工",
                        "alias": "wagong"
                    },
                    {
                        "id": "8128",
                        "name": "混凝土工",
                        "alias": "hunningtugong"
                    },
                    {
                        "id": "8129",
                        "name": "浇注工",
                        "alias": "jiaozhugong"
                    },
                    {
                        "id": "8130",
                        "name": "钢筋工",
                        "alias": "gangjingong"
                    },
                    {
                        "id": "8199",
                        "name": "其他（建筑工程）",
                        "alias": "qitajianzhugongcheng"
                    }],
                "alias": "jianzhugongcheng"
            },
            {
                "id": "8200",
                "name": "营销\/策划\/销售",
                "order": "3",
                "sub": [{
                    "id": "8201",
                    "name": "营销\/策划总监",
                    "alias": "yingxiaocehuazongjian"
                },
                    {
                        "id": "8202",
                        "name": "营销\/策划经理",
                        "alias": "yingxiaocehuajingli"
                    },
                    {
                        "id": "8203",
                        "name": "营销\/策划专员",
                        "alias": "yingxiaocehuazhuanyuan"
                    },
                    {
                        "id": "8204",
                        "name": "置业顾问\/房产经纪人",
                        "alias": "zhiyeguwen"
                    },
                    {
                        "id": "8205",
                        "name": "销售经理",
                        "alias": "fangchanxiaoshoujingli"
                    },
                    {
                        "id": "8206",
                        "name": "招商专员",
                        "alias": "zhaoshang"
                    },
                    {
                        "id": "8207",
                        "name": "招商经理",
                        "alias": "fangchanzhaoshangjingli"
                    },
                    {
                        "id": "8208",
                        "name": "权证员",
                        "alias": "quanzhengyuan"
                    },
                    {
                        "id": "8299",
                        "name": "其他（营销\/策划\/销售）",
                        "alias": "qitayingxiao"
                    }],
                "alias": "yingxiao"
            },
            {
                "id": "8400",
                "name": "装饰装修",
                "order": "5",
                "sub": [{
                    "id": "8401",
                    "name": "设计总监",
                    "alias": "zhuangxiushejizongjian"
                },
                    {
                        "id": "8402",
                        "name": "设计经理\/主管",
                        "alias": "shejizhuguan"
                    },
                    {
                        "id": "8403",
                        "name": "设计师\/高级设计师",
                        "alias": "shineisheji"
                    },
                    {
                        "id": "8404",
                        "name": "家装设计师",
                        "alias": "jiazhuangshejishi"
                    },
                    {
                        "id": "8405",
                        "name": "工装设计师",
                        "alias": "gongzhuangshejishi"
                    },
                    {
                        "id": "8406",
                        "name": "软装设计师",
                        "alias": "ruanzhuangshejishi"
                    },
                    {
                        "id": "8407",
                        "name": "绘图员",
                        "alias": "cad"
                    },
                    {
                        "id": "8408",
                        "name": "家装顾问",
                        "alias": "jiazhuangguwen"
                    },
                    {
                        "id": "8409",
                        "name": "工程\/项目总监",
                        "alias": "gongcheng"
                    },
                    {
                        "id": "8410",
                        "name": "工程\/项目经理",
                        "alias": "zhuangxiugongchengjingli"
                    },
                    {
                        "id": "8411",
                        "name": "工程监理",
                        "alias": "jianli"
                    },
                    {
                        "id": "8412",
                        "name": "施工员",
                        "alias": "shigongyuan"
                    },
                    {
                        "id": "8413",
                        "name": "水电工",
                        "alias": "shuidiangongchengshi"
                    },
                    {
                        "id": "8414",
                        "name": "木工",
                        "alias": "zhuangxiumugong"
                    },
                    {
                        "id": "8415",
                        "name": "泥工",
                        "alias": "nigong"
                    },
                    {
                        "id": "8416",
                        "name": "资料员",
                        "alias": "ziliao"
                    },
                    {
                        "id": "8417",
                        "name": "材料专员\/经理",
                        "alias": "cailiaozhuanyuan"
                    },
                    {
                        "id": "8499",
                        "name": "其他（装饰装修）",
                        "alias": "qitazhuangxiu"
                    }],
                "alias": "zhuangshi"
            },
            {
                "id": "8300",
                "name": "物业",
                "order": "4",
                "sub": [{
                    "id": "8301",
                    "name": "物业经理\/主管",
                    "alias": "wuyejingli"
                },
                    {
                        "id": "8302",
                        "name": "物管员",
                        "alias": "wuguan"
                    },
                    {
                        "id": "8303",
                        "name": "招商\/租售",
                        "alias": "wuyezhaoshang"
                    },
                    {
                        "id": "8304",
                        "name": "综合维修工",
                        "alias": "zongheweixiugong"
                    },
                    {
                        "id": "8305",
                        "name": "水电维修工",
                        "alias": "weixiudiangong"
                    },
                    {
                        "id": "8308",
                        "name": "保安经理",
                        "alias": "baoanzhuguan"
                    },
                    {
                        "id": "8306",
                        "name": "保安",
                        "alias": "wuyebaoan"
                    },
                    {
                        "id": "8307",
                        "name": "保洁员",
                        "alias": "baojieyuan"
                    },
                    {
                        "id": "8399",
                        "name": "其他（物业）",
                        "alias": "qitawuye"
                    }],
                "alias": "wuyeguanli"
            }],
        "alias": "fdc"
    },
    {
        "id": "03",
        "name": "金融、银行、保险",
        "sub": [{
            "id": "9000",
            "name": "银行",
            "order": "1",
            "sub": [{
                "id": "9001",
                "name": "行长\/副行长",
                "alias": "hangzhang"
            },
                {
                    "id": "9002",
                    "name": "业务部门经理\/主管",
                    "alias": "yewubumenjingli"
                },
                {
                    "id": "9003",
                    "name": "客户经理",
                    "alias": "yinhangkehujingli"
                },
                {
                    "id": "9004",
                    "name": "综合业务专员",
                    "alias": "zongheyewuzhuanyuan"
                },
                {
                    "id": "9005",
                    "name": "风险控制",
                    "alias": "fengxiankongzhi"
                },
                {
                    "id": "9006",
                    "name": "信审核查",
                    "alias": "xinshenhecha"
                },
                {
                    "id": "9007",
                    "name": "大堂经理",
                    "alias": "yinhangdatangjingli"
                },
                {
                    "id": "9008",
                    "name": "资产评估\/分析",
                    "alias": "zichanpinggu"
                },
                {
                    "id": "9009",
                    "name": "信贷管理",
                    "alias": "xindaiguanli"
                },
                {
                    "id": "9010",
                    "name": "银行柜员",
                    "alias": "yinhangguiyuan"
                },
                {
                    "id": "9011",
                    "name": "信用卡销售",
                    "alias": "xinyongkaxiaoshou"
                },
                {
                    "id": "9099",
                    "name": "其他（银行）",
                    "alias": "qitayinhang"
                }],
            "alias": "yinhang"
        },
            {
                "id": "9100",
                "name": "金融\/证券\/投资",
                "order": "2",
                "sub": [{
                    "id": "9101",
                    "name": "投融资专员",
                    "alias": "touzi"
                },
                    {
                        "id": "9102",
                        "name": "投融资经理\/主管",
                        "alias": "tourongzijingli"
                    },
                    {
                        "id": "9103",
                        "name": "证券分析师",
                        "alias": "zhengquanfenxishi"
                    },
                    {
                        "id": "9104",
                        "name": "金融产品经纪人",
                        "alias": "jinrongchanpinjingjiren"
                    },
                    {
                        "id": "9105",
                        "name": "投资银行业务",
                        "alias": "touziyinhangyewu"
                    },
                    {
                        "id": "9106",
                        "name": "金融操盘手",
                        "alias": "caopanshou"
                    },
                    {
                        "id": "9107",
                        "name": "金融研究员",
                        "alias": "jinrongyanjiuyuan"
                    },
                    {
                        "id": "9108",
                        "name": "投资\/基金项目经理",
                        "alias": "touzijingli"
                    },
                    {
                        "id": "9109",
                        "name": "投资顾问",
                        "alias": "touziguwen"
                    },
                    {
                        "id": "9110",
                        "name": "风控专员",
                        "alias": "jinrongfengkong"
                    },
                    {
                        "id": "9111",
                        "name": "金融产品经理",
                        "alias": "jinrongchanpjingli"
                    },
                    {
                        "id": "9112",
                        "name": "拍卖/担保/典当",
                        "alias": "paimaiordanbaoordiandang"
                    },
                    {
                        "id": "9199",
                        "name": "其他（金融\/证券\/投资）",
                        "alias": "qitajinrong"
                    }],
                "alias": "jinrongzhengquan"
            },
            {
                "id": "9200",
                "name": "保险",
                "order": "3",
                "sub": [{
                    "id": "9201",
                    "name": "保险经纪人\/客户经理",
                    "alias": "baoxianjingjiren"
                },
                    {
                        "id": "9202",
                        "name": "理财顾问",
                        "alias": "licaiguwen"
                    },
                    {
                        "id": "9203",
                        "name": "保险业务经理",
                        "alias": "baoxianyewujingli"
                    },
                    {
                        "id": "9204",
                        "name": "保险理赔",
                        "alias": "lipei"
                    },
                    {
                        "id": "9205",
                        "name": "车险专员",
                        "alias": "chexianzhuanyuan"
                    },
                    {
                        "id": "9206",
                        "name": "客户服务\/续期管理",
                        "alias": "kehufuwu"
                    },
                    {
                        "id": "9207",
                        "name": "保险培训师",
                        "alias": "baoxianpeixunshi"
                    },
                    {
                        "id": "9208",
                        "name": "保险内勤",
                        "alias": "baoxianneiqin"
                    },
                    {
                        "id": "9209",
                        "name": "保险产品开发",
                        "alias": "baoxianchanpinkaifa"
                    },
                    {
                        "id": "9299",
                        "name": "其他（保险）",
                        "alias": "qitabaoxian"
                    }],
                "alias": "baoxian"
            }],
        "alias": "jinrong"
    },
    {
        "id": "07",
        "name": "广告、设计、传媒",
        "sub": [{
            "id": "9500",
            "name": "广告",
            "order": "1",
            "sub": [{
                "id": "9501",
                "name": "广告客户总监",
                "alias": "guanggaokehuzongjian"
            },
                {
                    "id": "9502",
                    "name": "广告销售经理",
                    "alias": "guanggaoxiaoshoujingli"
                },
                {
                    "id": "9503",
                    "name": "广告客户专员",
                    "alias": "guanggaokehuzhuanyuan"
                },
                {
                    "id": "9504",
                    "name": "广告创意总监",
                    "alias": "guanggaochuangyizongjian"
                },
                {
                    "id": "9505",
                    "name": "广告创意\/设计",
                    "alias": "guanggaosheji"
                },
                {
                    "id": "9506",
                    "name": "美术指导",
                    "alias": "meishuzhidao"
                },
                {
                    "id": "9507",
                    "name": "文案策划",
                    "alias": "wenancehua"
                },
                {
                    "id": "9508",
                    "name": "广告执行\/制作\/安装",
                    "alias": "guanggaozhixing"
                },
                {
                    "id": "9509",
                    "name": "会务\/会展",
                    "alias": "huiwu"
                },
                {
                    "id": "9599",
                    "name": "其他（广告）",
                    "alias": "qitaguanggao"
                }],
            "alias": "guanggao"
        },
            {
                "id": "9600",
                "name": "设计",
                "order": "2",
                "sub": [{
                    "id": "9601",
                    "name": "平面设计师",
                    "alias": "pingmian"
                },
                    {
                        "id": "9602",
                        "name": "动画\/3D设计",
                        "alias": "3d"
                    },
                    {
                        "id": "9603",
                        "name": "网页设计",
                        "alias": "wangzhansheji"
                    },
                    {
                        "id": "9604",
                        "name": "UI设计",
                        "alias": "uisheji"
                    },
                    {
                        "id": "9605",
                        "name": "美工",
                        "alias": "meigong"
                    },
                    {
                        "id": "9606",
                        "name": "装修设计",
                        "alias": "zhuangxiusheji"
                    },
                    {
                        "id": "9607",
                        "name": "家具设计",
                        "alias": "jiajusheji"
                    },
                    {
                        "id": "9608",
                        "name": "原画师",
                        "alias": "yuanhuashi"
                    },
                    {
                        "id": "9609",
                        "name": "家居用品设计",
                        "alias": "jiajuyongpinsheji"
                    },
                    {
                        "id": "9610",
                        "name": "服装设计",
                        "alias": "fuzhuangsheji"
                    },
                    {
                        "id": "9611",
                        "name": "建筑设计",
                        "alias": "jianzhushejishi"
                    },
                    {
                        "id": "9612",
                        "name": "工艺品\/珠宝设计",
                        "alias": "gongyipin"
                    },
                    {
                        "id": "9613",
                        "name": "工业设计",
                        "alias": "gongyesheji"
                    },
                    {
                        "id": "9614",
                        "name": "店面\/展览设计",
                        "alias": "dianmian"
                    },
                    {
                        "id": "9615",
                        "name": "设计经理\/主管",
                        "alias": "shejijingli"
                    },
                    {
                        "id": "9616",
                        "name": "设计总监",
                        "alias": "shejizongjian"
                    },
                    {
                        "id": "9699",
                        "name": "其他（设计）",
                        "alias": "qitasheji"
                    }],
                "alias": "sheji"
            },
            {
                "id": "9700",
                "name": "影视\/媒体",
                "order": "3",
                "sub": [{
                    "id": "9701",
                    "name": "编导\/导演",
                    "alias": "biandao"
                },
                    {
                        "id": "9702",
                        "name": "主持人/司仪",
                        "alias": "zhuchiren"
                    },
                    {
                        "id": "9703",
                        "name": "演员\/模特",
                        "alias": "yanyuan"
                    },
                    {
                        "id": "9704",
                        "name": "摄像\/摄影",
                        "alias": "sheying"
                    },
                    {
                        "id": "9705",
                        "name": "化妆师\/造型师",
                        "alias": "huazhuangshi"
                    },
                    {
                        "id": "9706",
                        "name": "影视策划",
                        "alias": "yingshicehua"
                    },
                    {
                        "id": "9707",
                        "name": "后期制作/剪辑师",
                        "alias": "houqizhizuo"
                    },
                    {
                        "id": "9708",
                        "name": "经纪人",
                        "alias": "jingjiren"
                    },
                    {
                        "id": "9709",
                        "name": "灯光师",
                        "alias": "dengguangshi"
                    },
                    {
                        "id": "9799",
                        "name": "其他（影视\/媒体）",
                        "alias": "qitayingshi"
                    }],
                "alias": "yingshi"
            },
            {
                "id": "9800",
                "name": "写作\/出版\/印刷",
                "order": "4",
                "sub": [{
                    "id": "9801",
                    "name": "编辑",
                    "alias": "bianji"
                },
                    {
                        "id": "9802",
                        "name": "美术编辑",
                        "alias": "meishubianji"
                    },
                    {
                        "id": "9803",
                        "name": "记者",
                        "alias": "jizhe"
                    },
                    {
                        "id": "9804",
                        "name": "校对\/录入",
                        "alias": "jiaodui"
                    },
                    {
                        "id": "9805",
                        "name": "排版设计",
                        "alias": "paibansheji"
                    },
                    {
                        "id": "9806",
                        "name": "制版\/印刷操作",
                        "alias": "yinshua"
                    },
                    {
                        "id": "9899",
                        "name": "其他（写作\/出版\/印刷）",
                        "alias": "qitaxiezuo"
                    }],
                "alias": "xiezuo"
            }],
        "alias": "guanggaochuanmei"
    },
    {
        "id": "12",
        "name": "餐饮、百货、生活服务",
        "sub": [{
            "id": "8500",
            "name": "餐饮\/娱乐",
            "order": "1",
            "sub": [{
                "id": "8501",
                "name": "餐饮\/娱乐管理",
                "alias": "canyinguanli"
            },
                {
                    "id": "8502",
                    "name": "大堂经理\/领班",
                    "alias": "datangjingli"
                },
                {
                    "id": "8503",
                    "name": "厨师长\/行政总厨",
                    "alias": "chushizhang"
                },
                {
                    "id": "8504",
                    "name": "厨师",
                    "alias": "chushi"
                },
                {
                    "id": "8513",
                    "name": "打荷\/杂工",
                    "alias": "daza"
                },
                {
                    "id": "8514",
                    "name": "切菜\/配菜",
                    "alias": "peicai"
                },
                {
                    "id": "8515",
                    "name": "送餐员",
                    "alias": "songcanyuan"
                },
                {
                    "id": "8516",
                    "name": "面点师",
                    "alias": "miandianshi"
                },
                {
                    "id": "8517",
                    "name": "咖啡师",
                    "alias": "kafeishi"
                },
                {
                    "id": "8505",
                    "name": "服务员",
                    "alias": "fuwuyuan"
                },
                {
                    "id": "8506",
                    "name": "传菜员",
                    "alias": "zhuancaiyuan"
                },
                {
                    "id": "8507",
                    "name": "迎宾\/接待",
                    "alias": "yingbin"
                },
                {
                    "id": "8508",
                    "name": "调酒师\/吧台员",
                    "alias": "bayuan"
                },
                {
                    "id": "8509",
                    "name": "茶艺师",
                    "alias": "chayishi"
                },
                {
                    "id": "8510",
                    "name": "学徒",
                    "alias": "dunzi"
                },
                {
                    "id": "8511",
                    "name": "洗碗工",
                    "alias": "xiwangong"
                },
                {
                    "id": "8512",
                    "name": "收银员",
                    "alias": "shouyinyuan"
                },
                {
                    "id": "8599",
                    "name": "其他（餐饮\/娱乐）",
                    "alias": "qitacanyin"
                }],
            "alias": "canyin"
        },
            {
                "id": "8600",
                "name": "酒店\/旅游",
                "order": "2",
                "sub": [{
                    "id": "8601",
                    "name": "酒店管理",
                    "alias": "jiudianguanli"
                },
                    {
                        "id": "8602",
                        "name": "大堂经理\/领班",
                        "alias": "lingban"
                    },
                    {
                        "id": "8603",
                        "name": "酒店销售",
                        "alias": "jiudianxiaoshou"
                    },
                    {
                        "id": "8604",
                        "name": "前台接待",
                        "alias": "qiantai"
                    },
                    {
                        "id": "8605",
                        "name": "预定员",
                        "alias": "yudingyuan"
                    },
                    {
                        "id": "8606",
                        "name": "服务员",
                        "alias": "jiudianfuwuyuan"
                    },
                    {
                        "id": "8607",
                        "name": "行李员",
                        "alias": "xingliyuan"
                    },
                    {
                        "id": "8608",
                        "name": "保安",
                        "alias": "jiudianbaoan"
                    },
                    {
                        "id": "8609",
                        "name": "保洁员",
                        "alias": "baijie"
                    },
                    {
                        "id": "8610",
                        "name": "旅游销售",
                        "alias": "luyou"
                    },
                    {
                        "id": "8611",
                        "name": "旅游计调",
                        "alias": "jidiao"
                    },
                    {
                        "id": "8612",
                        "name": "导游",
                        "alias": "daoyou"
                    },
                    {
                        "id": "8613",
                        "name": "宴会管理",
                        "alias": "yanhuiguanli"
                    },
                    {
                        "id": "8614",
                        "name": "楼面经理",
                        "alias": "loumianjingli"
                    },
                    {
                        "id": "8615",
                        "name": "客房服务",
                        "alias": "kefangfuwu"
                    },
                    {
                        "id": "8616",
                        "name": "签证专员",
                        "alias": "qianzhengzhuanyuan"
                    },
                    {
                        "id": "8617",
                        "name": "票务",
                        "alias": "piaowu"
                    },
                    {
                        "id": "8618",
                        "name": "机场代表",
                        "alias": "jichangdaibiao"
                    },
                    {
                        "id": "8619",
                        "name": "船员/海员",
                        "alias": "chuanyuanorhaiyuan"
                    },
                    {
                        "id": "8699",
                        "name": "其他（酒店\/旅游）",
                        "alias": "jiudian1"
                    }],
                "alias": "jiudian"
            },
            {
                "id": "8700",
                "name": "美容\/健身\/运动",
                "order": "3",
                "sub": [{
                    "id": "8701",
                    "name": "美容师\/化妆师",
                    "alias": "huazhuang"
                },
                    {
                        "id": "8702",
                        "name": "美容顾问",
                        "alias": "meirongguwen"
                    },
                    {
                        "id": "8703",
                        "name": "美甲师",
                        "alias": "meijiashi"
                    },
                    {
                        "id": "8704",
                        "name": "发型师",
                        "alias": "faxingshi"
                    },
                    {
                        "id": "8705",
                        "name": "宠物美容",
                        "alias": "chongwumeirong"
                    },
                    {
                        "id": "8706",
                        "name": "按摩\/足疗",
                        "alias": "anmo"
                    },
                    {
                        "id": "8707",
                        "name": "健身顾问",
                        "alias": "jianshenguwen"
                    },
                    {
                        "id": "8708",
                        "name": "健身教练",
                        "alias": "jianshenjiaolian"
                    },
                    {
                        "id": "8709",
                        "name": "体育运动教练",
                        "alias": "tiyuyundongjiaolian"
                    },
                    {
                        "id": "8710",
                        "name": "瑜伽老师",
                        "alias": "yujialaoshi"
                    },
                    {
                        "id": "8711",
                        "name": "舞蹈老师",
                        "alias": "wudaolaoshi"
                    },
                    {
                        "id": "8712",
                        "name": "彩妆培训师",
                        "alias": "caizhuangpeixunshi"
                    },
                    {
                        "id": "8713",
                        "name": "发型助理/学徒",
                        "alias": "faxingzhuli"
                    },
                    {
                        "id": "8714",
                        "name": "游泳教练",
                        "alias": "youyongjiaolian"
                    },
                    {
                        "id": "8715",
                        "name": "救生员",
                        "alias": "jiushengyuan"
                    },
                    {
                        "id": "8716",
                        "name": "高尔夫教练",
                        "alias": "gaoerfujiaolian"
                    },
                    {
                        "id": "8799",
                        "name": "其他（美容\/美发\/按摩）",
                        "alias": "meirong1"
                    }],
                "alias": "meirong"
            },
            {
                "id": "8800",
                "name": "保安\/家政",
                "order": "4",
                "sub": [{
                    "id": "8801",
                    "name": "保安经理",
                    "alias": "baoanduizhang"
                },
                    {
                        "id": "8802",
                        "name": "保安",
                        "alias": "baoanyuan"
                    },
                    {
                        "id": "8803",
                        "name": "搬运工",
                        "alias": "banyungong"
                    },
                    {
                        "id": "8804",
                        "name": "保洁员",
                        "alias": "qingjie"
                    },
                    {
                        "id": "8805",
                        "name": "保姆\/护工",
                        "alias": "baomu"
                    },
                    {
                        "id": "8806",
                        "name": "月嫂",
                        "alias": "yuesao"
                    },
                    {
                        "id": "8807",
                        "name": "钟点工",
                        "alias": "zhongdiangong"
                    },
                    {
                        "id": "8808",
                        "name": "育婴师/保育员",
                        "alias": "yuyingshi"
                    },
                    {
                        "id": "8899",
                        "name": "其他（保安\/家政）",
                        "alias": "qitajiazheng"
                    }],
                "alias": "jiazheng"
            },
            {
                "id": "8900",
                "name": "百货\/零售",
                "order": "5",
                "sub": [{
                    "id": "8901",
                    "name": "店长",
                    "alias": "dianzhang"
                },
                    {
                        "id": "8902",
                        "name": "卖场经理",
                        "alias": "maichangjingli"
                    },
                    {
                        "id": "8903",
                        "name": "品类经理",
                        "alias": "pinleijingli"
                    },
                    {
                        "id": "8904",
                        "name": "营业员",
                        "alias": "lingshouyingyeyuan"
                    },
                    {
                        "id": "8905",
                        "name": "导购员",
                        "alias": "daogou"
                    },
                    {
                        "id": "8906",
                        "name": "防损员",
                        "alias": "fangsunyuan"
                    },
                    {
                        "id": "8907",
                        "name": "收银员",
                        "alias": "shouyin"
                    },
                    {
                        "id": "8908",
                        "name": "收货员\/理货员\/陈列员",
                        "alias": "lihuoyuan"
                    },
                    {
                        "id": "8909",
                        "name": "食品加工\/处理",
                        "alias": "shipinjiagong"
                    },
                    {
                        "id": "8910",
                        "name": "招商人员",
                        "alias": "zhaoshangrenyuan"
                    },
                    {
                        "id": "8911",
                        "name": "督导",
                        "alias": "shichangdudao"
                    },
                    {
                        "id": "8912",
                        "name": "驻店销售",
                        "alias": "chaoshizhudianxiaoshou"
                    },
                    {
                        "id": "8999",
                        "name": "其他（百货\/零售）",
                        "alias": "qitabaihuo"
                    }],
                "alias": "chaoshi"
            },
            {
                "id": "011700",
                "name": "婚庆/活动",
                "order": "6",
                "sub": [{
                    "id": "011701",
                    "name": "主持人/司仪",
                    "alias": "zhuchirenorsiyi"
                },
                    {
                        "id": "011702",
                        "name": "演员/模特",
                        "alias": "yanyuanormote"
                    },
                    {
                        "id": "011703",
                        "name": "摄像/摄影",
                        "alias": "shexiangsheying"
                    },
                    {
                        "id": "011704",
                        "name": "化妆师/造型师",
                        "alias": "huazhuangshiorzaoxingshi"
                    },
                    {
                        "id": "011705",
                        "name": "影视策划",
                        "alias": "huodongyingshicehua"
                    },
                    {
                        "id": "011706",
                        "name": "后期制作/剪辑师",
                        "alias": "houqizhizuoorjianjishi"
                    },
                    {
                        "id": "011707",
                        "name": "灯光师",
                        "alias": "dengguangshi"
                    },
                    {
                        "id": "011708",
                        "name": "DJ",
                        "alias": "dj"
                    },
                    {
                        "id": "011709",
                        "name": "驻唱/歌手",
                        "alias": "zhuchangorgeshou"
                    },
                    {
                        "id": "011710",
                        "name": "舞蹈演员",
                        "alias": "wudaoyanyuan"
                    }],
                "alias": "hunqingorhuodong"
            }],
        "alias": "canyinbaihuo"
    },
    {
        "id": "14",
        "name": "医疗、医药",
        "sub": [{
            "id": "010000",
            "name": "医药",
            "order": "1",
            "sub": [{
                "id": "010001",
                "name": "医药研发",
                "alias": "yiyaoyanfa"
            },
                {
                    "id": "010002",
                    "name": "生物工程\/生物制药",
                    "alias": "shengwugongcheng"
                },
                {
                    "id": "010003",
                    "name": "化学分析员",
                    "alias": "huaxuefenxiyuan"
                },
                {
                    "id": "010004",
                    "name": "药品临床实验",
                    "alias": "yaopinlinchuangshiyan"
                },
                {
                    "id": "010005",
                    "name": "药品生产",
                    "alias": "yaopinshengchan"
                },
                {
                    "id": "010006",
                    "name": "药品质量管理",
                    "alias": "yaopinzhiliangguanli"
                },
                {
                    "id": "010007",
                    "name": "医药招商",
                    "alias": "yiyaozhaoshang"
                },
                {
                    "id": "010008",
                    "name": "药品市场推广",
                    "alias": "yaopinshichangtuiguang"
                },
                {
                    "id": "010009",
                    "name": "医药代表",
                    "alias": "yiyaoxiaoshou"
                },
                {
                    "id": "010010",
                    "name": "医药销售经理\/主管",
                    "alias": "yiyaoxiaoshoujingli"
                },
                {
                    "id": "010011",
                    "name": "药店店长",
                    "alias": "yaodiandianzhang"
                },
                {
                    "id": "010012",
                    "name": "药店营业员",
                    "alias": "yaodianyingyeyuan"
                },
                {
                    "id": "010099",
                    "name": "其他（医药）",
                    "alias": "qitayiyao"
                }],
            "alias": "yiyao"
        },
            {
                "id": "010100",
                "name": "医疗器械",
                "order": "2",
                "sub": [{
                    "id": "010101",
                    "name": "医疗器械研发",
                    "alias": "yiliaoqixieyanfa"
                },
                    {
                        "id": "010102",
                        "name": "医疗器械临床实验",
                        "alias": "yiliaoqixielinchuangshiyan"
                    },
                    {
                        "id": "010103",
                        "name": "医疗设备生产\/质量管理",
                        "alias": "yiliaoshebeishengchan"
                    },
                    {
                        "id": "010104",
                        "name": "医疗器械市场推广",
                        "alias": "yiliaoqixieshichangtuiguang"
                    },
                    {
                        "id": "010105",
                        "name": "医疗器械销售",
                        "alias": "yiliaoqixiexiaoshou"
                    },
                    {
                        "id": "010106",
                        "name": "医疗器械维修\/售后",
                        "alias": "yiliaoqixieweixiu"
                    },
                    {
                        "id": "010199",
                        "name": "其他（医疗器械）",
                        "alias": "qitayiliaoqixie"
                    }],
                "alias": "yiliaoqixie"
            },
            {
                "id": "010200",
                "name": "医生\/技师",
                "order": "3",
                "sub": [{
                    "id": "010201",
                    "name": "内科医生",
                    "alias": "neikeyisheng"
                },
                    {
                        "id": "010202",
                        "name": "外科医生",
                        "alias": "waikeyisheng"
                    },
                    {
                        "id": "010203",
                        "name": "麻醉医生",
                        "alias": "mazuishi"
                    },
                    {
                        "id": "010204",
                        "name": "妇产科医生",
                        "alias": "fuchankeyisheng"
                    },
                    {
                        "id": "010205",
                        "name": "五官科医生",
                        "alias": "kouqiangyisheng"
                    },
                    {
                        "id": "010206",
                        "name": "儿科医生",
                        "alias": "erkeyisheng"
                    },
                    {
                        "id": "010207",
                        "name": "中医医生",
                        "alias": "zhongyi"
                    },
                    {
                        "id": "010208",
                        "name": "放射科医生",
                        "alias": "fangshekeyisheng"
                    },
                    {
                        "id": "010209",
                        "name": "B超医生",
                        "alias": "bchaoyisheng"
                    },
                    {
                        "id": "010210",
                        "name": "整形\/美容",
                        "alias": "zhengxing"
                    },
                    {
                        "id": "010211",
                        "name": "专科医生",
                        "alias": "zhuankeyisheng"
                    },
                    {
                        "id": "010212",
                        "name": "综合门诊\/全科医生",
                        "alias": "zonghemenzhen"
                    },
                    {
                        "id": "010213",
                        "name": "针灸\/推拿",
                        "alias": "zhenjiu"
                    },
                    {
                        "id": "010214",
                        "name": "理疗师",
                        "alias": "liliaoshi"
                    },
                    {
                        "id": "010215",
                        "name": "检验\/化验",
                        "alias": "jianyan"
                    },
                    {
                        "id": "010216",
                        "name": "药剂师",
                        "alias": "yaojishi"
                    },
                    {
                        "id": "010299",
                        "name": "其他（医生）",
                        "alias": "qitayisheng"
                    }],
                "alias": "yiyuan"
            },
            {
                "id": "010300",
                "name": "医院管理\/护理",
                "order": "4",
                "sub": [{
                    "id": "010301",
                    "name": "医院管理人员",
                    "alias": "yiyuanguanlirenyuan"
                },
                    {
                        "id": "010302",
                        "name": "护士长",
                        "alias": "hushichang"
                    },
                    {
                        "id": "010303",
                        "name": "护士",
                        "alias": "hushi"
                    },
                    {
                        "id": "010304",
                        "name": "医助",
                        "alias": "yizhu"
                    },
                    {
                        "id": "010305",
                        "name": "导医",
                        "alias": "daoyi"
                    },
                    {
                        "id": "010399",
                        "name": "其他（医院管理\/护理）",
                        "alias": "qitayiyuanguanli"
                    }],
                "alias": "yiyuanguanli"
            }],
        "alias": "yiliao"
    },
    {
        "id": "11",
        "name": "教育、培训、专业服务",
        "sub": [{
            "id": "010400",
            "name": "销售\/市场",
            "order": "1",
            "sub": [{
                "id": "010401",
                "name": "咨询总监",
                "alias": "zixunzongjian"
            },
                {
                    "id": "010402",
                    "name": "咨询经理\/主管",
                    "alias": "zixunjingli"
                },
                {
                    "id": "010403",
                    "name": "专业顾问\/咨询",
                    "alias": "zixunguwen"
                },
                {
                    "id": "010404",
                    "name": "招生顾问",
                    "alias": "zhaosheng"
                },
                {
                    "id": "010405",
                    "name": "课程顾问",
                    "alias": "kechengguwen"
                },
                {
                    "id": "010406",
                    "name": "调研员\/市场专员",
                    "alias": "diaoyanyuan"
                }],
            "alias": "xiaoshoushichang"
        },
            {
                "id": "010500",
                "name": "教师\/教务",
                "order": "2",
                "sub": [{
                    "id": "010501",
                    "name": "校长\/园长",
                    "alias": "xiaozhang"
                },
                    {
                        "id": "010502",
                        "name": "教务管理",
                        "alias": "jiaowuguanli"
                    },
                    {
                        "id": "010503",
                        "name": "教务人员",
                        "alias": "jiaowurenyuan"
                    },
                    {
                        "id": "010504",
                        "name": "班主任\/辅导员",
                        "alias": "banzhuren"
                    },
                    {
                        "id": "010505",
                        "name": "中学教师",
                        "alias": "zhongxuejiaoshi"
                    },
                    {
                        "id": "010506",
                        "name": "小学教师",
                        "alias": "xiaoxuejiaoshi"
                    },
                    {
                        "id": "010507",
                        "name": "幼教\/早教",
                        "alias": "youerlaoshi"
                    },
                    {
                        "id": "010508",
                        "name": "职业技术教师",
                        "alias": "zhiyejishujiaoshi"
                    },
                    {
                        "id": "010509",
                        "name": "家教",
                        "alias": "jiajiao"
                    },
                    {
                        "id": "010510",
                        "name": "兼职教师",
                        "alias": "jianzhijiaoshi"
                    },
                    {
                        "id": "010511",
                        "name": "英语教师",
                        "alias": "yingyujiaoshi"
                    },
                    {
                        "id": "010512",
                        "name": "音乐教师",
                        "alias": "yinyuejiaoshi"
                    },
                    {
                        "id": "010513",
                        "name": "美术教师",
                        "alias": "meishujiaoshi"
                    },
                    {
                        "id": "010514",
                        "name": "舞蹈教师",
                        "alias": "wudaojiaoshi"
                    },
                    {
                        "id": "010515",
                        "name": "体育老师\/教练",
                        "alias": "tiyulaoshi"
                    },
                    {
                        "id": "010516",
                        "name": "托管老师",
                        "alias": "tuoguanlaoshi"
                    },
                    {
                        "id": "010517",
                        "name": "钢琴老师",
                        "alias": "gangqinlaoshi"
                    },
                    {
                        "id": "010599",
                        "name": "其他（教师）",
                        "alias": "qitajiaoshi"
                    }],
                "alias": "jiaoshi"
            },
            {
                "id": "010600",
                "name": "培训",
                "order": "3",
                "sub": [{
                    "id": "010601",
                    "name": "培训讲师",
                    "alias": "jiangshi"
                },
                    {
                        "id": "010602",
                        "name": "培训助理",
                        "alias": "peixunzhuli"
                    },
                    {
                        "id": "010603",
                        "name": "学习管理师",
                        "alias": "xuexiguanlishi"
                    },
                    {
                        "id": "010604",
                        "name": "培训经理\/主管",
                        "alias": "peixunjingli"
                    },
                    {
                        "id": "010699",
                        "name": "其他（培训）",
                        "alias": "qitapeixun"
                    }],
                "alias": "peixun"
            },
            {
                "id": "010700",
                "name": "其他专业服务",
                "order": "4",
                "sub": [{
                    "id": "010701",
                    "name": "外语翻译",
                    "alias": "fanyi"
                },
                    {
                        "id": "010702",
                        "name": "猎头\/人才中介",
                        "alias": "rencaizhongjie"
                    },
                    {
                        "id": "010703",
                        "name": "律师\/法务咨询",
                        "alias": "lvshi"
                    },
                    {
                        "id": "010704",
                        "name": "财务\/会计",
                        "alias": "caiwu"
                    },
                    {
                        "id": "010705",
                        "name": "心理咨询师",
                        "alias": "xinlizixun"
                    },
                    {
                        "id": "010706",
                        "name": "企业管理咨询师",
                        "alias": "qiyeguanlizixunshi"
                    }],
                "alias": "qitazhuanyefuwu"
            }],
        "alias": "jiaoyu"
    },
    {
        "id": "08",
        "name": "能源、化工、服装、环保",
        "sub": [{
            "id": "010800",
            "name": "能源\/电力\/矿产",
            "order": "1",
            "sub": [{
                "id": "010801",
                "name": "电力\/电气工程师",
                "alias": "dianli"
            },
                {
                    "id": "010802",
                    "name": "电气维修技术员",
                    "alias": "dianqiweixiujishuyuan"
                },
                {
                    "id": "010803",
                    "name": "水利\/水电工程师",
                    "alias": "shuili"
                },
                {
                    "id": "010804",
                    "name": "制冷\/暖通工程师",
                    "alias": "nuantonggongchengshi"
                },
                {
                    "id": "010805",
                    "name": "石油\/天然气\/煤炭技术人员",
                    "alias": "shiyou"
                },
                {
                    "id": "010806",
                    "name": "新能源工程师",
                    "alias": "xinnengyuangongchengshi"
                },
                {
                    "id": "010899",
                    "name": "其他（能源\/电力\/矿产）",
                    "alias": "qitanengyuan"
                }],
            "alias": "nengyuandianli"
        },
            {
                "id": "010900",
                "name": "化工",
                "order": "2",
                "sub": [{
                    "id": "010901",
                    "name": "化工工程师",
                    "alias": "huagonggongchengshi"
                },
                    {
                        "id": "010902",
                        "name": "化工实验室研究员",
                        "alias": "huagongshiyanshiyanjiuyuan"
                    },
                    {
                        "id": "010903",
                        "name": "涂料研发工程师",
                        "alias": "tuliaoyanfagongchengshi"
                    },
                    {
                        "id": "010904",
                        "name": "食品\/饮料研发",
                        "alias": "shipin"
                    },
                    {
                        "id": "010905",
                        "name": "安全工程师",
                        "alias": "anquangongchengshi"
                    },
                    {
                        "id": "010999",
                        "name": "其他（化工）",
                        "alias": "qitahuagong"
                    }],
                "alias": "huagong"
            },
            {
                "id": "7800",
                "name": "服装\/纺织",
                "order": "3",
                "sub": [{
                    "id": "7801",
                    "name": "服装设计师",
                    "alias": "fuzhuangshejishi"
                },
                    {
                        "id": "7802",
                        "name": "工艺师",
                        "alias": "gongyishi"
                    },
                    {
                        "id": "7803",
                        "name": "打样\/制版",
                        "alias": "dayang"
                    },
                    {
                        "id": "7804",
                        "name": "电脑放码员",
                        "alias": "diannaofangmayuan"
                    },
                    {
                        "id": "7805",
                        "name": "质量管理",
                        "alias": "fuzhuangzhiliangguanli"
                    },
                    {
                        "id": "7806",
                        "name": "裁床",
                        "alias": "caichuang"
                    },
                    {
                        "id": "7807",
                        "name": "缝纫工",
                        "alias": "fengrengong"
                    },
                    {
                        "id": "7899",
                        "name": "其他（服装\/纺织）",
                        "alias": "qitafuzhuang"
                    }],
                "alias": "fuzhuang"
            },
            {
                "id": "011000",
                "name": "环保",
                "order": "4",
                "sub": [{
                    "id": "011001",
                    "name": "环保工程师",
                    "alias": "huanbaogongchengshi"
                },
                    {
                        "id": "011002",
                        "name": "污水处理工程师",
                        "alias": "shuichuli"
                    },
                    {
                        "id": "011003",
                        "name": "环评工程师",
                        "alias": "huanpinggongchengshi"
                    },
                    {
                        "id": "011099",
                        "name": "其他（环保）",
                        "alias": "qitahuanbao"
                    }],
                "alias": "huanbao"
            }],
        "alias": "nengyuan"
    },
    {
        "id": "10",
        "name": "进出口、采购、物流、司机",
        "sub": [{
            "id": "011100",
            "name": "进出口",
            "order": "1",
            "sub": [{
                "id": "011101",
                "name": "外贸经理\/主管",
                "alias": "waimaojingli"
            },
                {
                    "id": "011102",
                    "name": "外贸业务员",
                    "alias": "waimaoyewuyuan"
                },
                {
                    "id": "011103",
                    "name": "跟单员",
                    "alias": "gendan"
                },
                {
                    "id": "011104",
                    "name": "单证员",
                    "alias": "danzhengyuan"
                },
                {
                    "id": "011105",
                    "name": "报关\/报检员",
                    "alias": "baoguanyuan"
                },
                {
                    "id": "011199",
                    "name": "其他（进出口）",
                    "alias": "qitajinchukou"
                }],
            "alias": "waimao"
        },
            {
                "id": "011200",
                "name": "采购",
                "order": "2",
                "sub": [{
                    "id": "011201",
                    "name": "采购经理\/主管",
                    "alias": "caigoujingli"
                },
                    {
                        "id": "011202",
                        "name": "采购员",
                        "alias": "caigouyuan"
                    },
                    {
                        "id": "011203",
                        "name": "买手",
                        "alias": "maishou"
                    },
                    {
                        "id": "011204",
                        "name": "供应商开发",
                        "alias": "gongyingshangkaifa"
                    },
                    {
                        "id": "011299",
                        "name": "其他（采购）",
                        "alias": "qitacaigou"
                    }],
                "alias": "caigouneiqin"
            },
            {
                "id": "011300",
                "name": "物流\/仓储",
                "order": "3",
                "sub": [{
                    "id": "011301",
                    "name": "物流经理\/主管",
                    "alias": "wuliujingli"
                },
                    {
                        "id": "011302",
                        "name": "物流专员",
                        "alias": "wuliu"
                    },
                    {
                        "id": "011303",
                        "name": "快递员",
                        "alias": "kuaidiyuan"
                    },
                    {
                        "id": "011304",
                        "name": "配货员\/分拣员",
                        "alias": "peihuoyuan"
                    },
                    {
                        "id": "011305",
                        "name": "供应链管理",
                        "alias": "gongyinglianguanli"
                    },
                    {
                        "id": "011306",
                        "name": "调度员",
                        "alias": "diaoduyuan"
                    },
                    {
                        "id": "011307",
                        "name": "货运代理业务",
                        "alias": "huoyundailiyewu"
                    },
                    {
                        "id": "011308",
                        "name": "仓库主管\/经理",
                        "alias": "cangkuzhuguan"
                    },
                    {
                        "id": "011309",
                        "name": "仓库管理员",
                        "alias": "kuguan"
                    },
                    {
                        "id": "011310",
                        "name": "搬运工",
                        "alias": "wuliubanyungong"
                    },
                    {
                        "id": "011311",
                        "name": "船务/空运陆运操作",
                        "alias": "kongyunluyuncaozuo"
                    },
                    {
                        "id": "011312",
                        "name": "安检员",
                        "alias": "anjianyuan"
                    },
                    {
                        "id": "011399",
                        "name": "其他（物流\/仓储）",
                        "alias": "qitawuliu"
                    }],
                "alias": "wuliucangchu"
            },
            {
                "id": "011400",
                "name": "司机",
                "order": "4",
                "sub": [{
                    "id": "011401",
                    "name": "商务司机",
                    "alias": "xingzhensiji"
                },
                    {
                        "id": "011402",
                        "name": "客运司机",
                        "alias": "kechesiji"
                    },
                    {
                        "id": "011403",
                        "name": "货运司机",
                        "alias": "huoyunsiji"
                    },
                    {
                        "id": "011404",
                        "name": "出租车司机",
                        "alias": "chuzuchesiji"
                    },
                    {
                        "id": "011405",
                        "name": "特种车司机",
                        "alias": "tezhongchesiji"
                    },
                    {
                        "id": "011406",
                        "name": "驾校教练\/陪练",
                        "alias": "jiaxiaojiaolian"
                    },
                    {
                        "id": "011407",
                        "name": "代驾",
                        "alias": "daijia"
                    }],
                "alias": "siji"
            }],
        "alias": "jinchukou"
    },
    {
        "id": "13",
        "name": "农林牧渔、其他",
        "sub": [{
            "id": "011500",
            "name": "农林牧渔",
            "order": "1",
            "sub": [{
                "id": "011501",
                "name": "场长",
                "alias": "nonglinchangzhang"
            },
                {
                    "id": "011502",
                    "name": "农艺师",
                    "alias": "nongyishi"
                },
                {
                    "id": "011503",
                    "name": "饲养员",
                    "alias": "yangzhiyuan"
                },
                {
                    "id": "011504",
                    "name": "兽医",
                    "alias": "shouyi"
                },
                {
                    "id": "011599",
                    "name": "其他（农林牧渔）",
                    "alias": "qitanonglinmuyu"
                }],
            "alias": "nonglin"
        },
            {
                "id": "011600",
                "name": "其他",
                "order": "2",
                "sub": [{
                    "id": "011601",
                    "name": "科研人员",
                    "alias": "shiyanyuan"
                },
                    {
                        "id": "011602",
                        "name": "储备干部",
                        "alias": "chubei"
                    },
                    {
                        "id": "011603",
                        "name": "兼职",
                        "alias": "jianzhi"
                    },
                    {
                        "id": "011604",
                        "name": "实习生",
                        "alias": "shixi"
                    },
                    {
                        "id": "011699",
                        "name": "其他（其他职位）",
                        "alias": "qitazhiwei"
                    }],
                "alias": "qita"
            }],
        "alias": "nonglinmuyu"
    }];*/
