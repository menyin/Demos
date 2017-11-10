// JavaScript Document

define('module.verifier', function(require, exports, module){

	var util = require('base.util'),
		//$ = require('jquery'),
		$ = require('jquery'),
		isIE = !!window.ActiveXObject;

	exports.required = function(element){
		element = normalizeDom(element);
		var el = element[0];
		switch (el.nodeName.toLowerCase()){
			case 'select':
				var options = $("option:selected", el);
				return options.length > 0 &&
					(el.type == "select-multiple" || (isIE && !(options[0].attributes['value'].specified) ?
						options[0].text : options[0].value).length > 0);
			case 'input':
				return getLength(element) > 0;
			case 'textarea':
				return getLength(element) > 0;
			default:
				return null;
		}
	}
	exports.min = function(element, param) {
		return !exports.required(element) || getLength(element) >= param;
	}
	exports.max = function(element, param) {
		return !exports.required(element) || getLength(element) <= param;
	}
	exports.range = function(element, param) {
		var length = getLength(element);
		return !exports.required(element) || (length >= param[0] && length <= param[1]);
	}
	exports.minNum = function(element, param){
		return !exports.required(element) || normalizeDom(element).val() >= param;
	}
	exports.maxNum = function(element, param){
		return !exports.required(element) || normalizeDom(element).val() <= param;
	}
	exports.rangeNum = function(element, param){
		var value = normalizeDom(element).val();
		return !exports.required(element) || value >= param[0] && value <= param[1];
	}
	exports.equalTo = function(element, param) {
		param = normalizeDom(param).val();
		return elementValue(element) === param;
	}
	exports.number = function(element){
		var value = normalizeDom(element).val();
		return !exports.required(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
	}
	exports.email = function(element){
		var value = normalizeDom(element).val();
		return !exports.required(element) || /^[a-z0-9]([a-z0-9]*[-_.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z0-9]+([\.][a-z0-9]+)?([\.][a-z0-9]{2,3})?$/i.test(value);
	}
	exports.mobile = function(element){
		var value = normalizeDom(element).val();
		return !exports.required(element) || (/^(13[0-9]{9,9}|18[0-9]{9,9}|15[0-9]{9,9}|17[0-9]{9,9}|14[0-9]{9,9})$/.test(value));
	}
	exports.price = function(element){
		var value = normalizeDom(element).val();
		if(value == 0) return false;
		return !exports.required(element) || exports.required(element) && /^(\d+\.\d+|\d+)$/.test(value);
	}
	exports.url = function(element){
		var value = normalizeDom(element).val(),
			urlReg = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		return !exports.required(element) || urlReg.test(value);
	}
	exports.idcard = (function(){
		var powers = ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],
			parityBits = ["1","0","X","9","8","7","6","5","4","3","2"];
		function validId15(val){
			var id = val + "";
			for(var i = 0; i < id.length; i++){
				if(id.charAt(i) < '0' || id.charAt(i) > '9'){
					return false;
				}
			}
			var year = id.substr(6, 2),
				month = id.substr(8, 2),
				day = id.substr(10, 2),
				sexBit = id.substr(14);
			if(year < '01' || year > '90')
				return false;
			if(month < '01' || month > '12')
				return false;
			if(day < '01' || day > '31')
				return false;

			return true;
		}
		function validId18(val){
			var id = val + "";
			num = id.substr(0, 17),
				parityBit = id.substr(17),
				power = 0;

			for(var i = 0; i < 17; i++){
				if(num.charAt(i) < '0' || num.charAt(i) > '9'){
					return false;
				} else {
					power += parseInt(num.charAt(i)) * parseInt(powers[i]);
				}
			}
			var mod = parseInt(power) % 11;
			if(parityBits[mod] == parityBit.toUpperCase()){
				return true;
			}
			return false;
		}
		return function(element){
			var value = normalizeDom(element).val();
			if($.trim(value) === ''){
				return true;
			}
			if(value.length === 15){
				return validId15(value);
			}else if(value.length === 18){
				return validId18(value);
			}
			return false;
		}
	})();
	exports.pop = function(element){
		var value = normalizeDom(element).val(),
			reg = /^(pop|pop3|imap|smtp)\.\w+\.\w+(.\w+)*$/i;
		return !exports.required(element) || reg.test(value);
	}
	exports.tel = function(element){
		var value = normalizeDom(element).val();
		return !exports.required(element) || /^.{0,30}\d{5}.{0,30}$/.test(value);
	}
	exports.match = function(element, param){
		var value = normalizeDom(element).val();
		return param.test(value);
	}
	exports.format = function(source, params){
		if(arguments.length == 1)
			return function(){
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.format.apply(this, args);
			};
		if(arguments.length > 2 && params.constructor != Array){
			params = $.makeArray(arguments).slice(1);
		}
		if(params.constructor != Array){
			params = [params];
		}
		$.each(params, function(i, n){
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	exports.getLength = getLength;
	exports.checkable = checkable;
	exports.selectable = selectable;
	exports.elementValue = elementValue;

	function getLength(element) {
		element = normalizeDom(element);
		var el = element[0];
		switch( el.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( checkable( el ) ){
					return element.filter(':checked').length;
				} else {
					var len = 0;
					element.each(function(){
						len += $.trim($(this).val()).length;
					});
					return len;
				}
			case 'textarea':
				return $.trim(element.val()).length;
			default:
				return null;
		}
	}
	function normalizeDom(el){
		if(util.type.isString(el) || el.nodeName){
			el = $(el);
		}
		if(el.length){
			return el;
		}
		throw new Error('module.verifier: 找不到dom目标');
	}
	function checkable( element ){
		return element && /radio|checkbox/i.test(element.type);
	}
	function selectable( element ){
		return element.nodeName.toLowerCase() === 'select';
	}
	function elementValue(element, spliter){
		element = normalizeDom(element);
		var el = element[0], ret = [], type;
		if( checkable(el) ) {
			type = ":checked";
		} else if( selectable(el) ){
			type = ":selected";
		}
		element.each(function(){
			if(type && $(this).is(type)){
				ret.push($(this).val());
			} else {
				if(getLength($(this))){
					ret.push($(this).val().replace(/\r/i, ''));
				}
			}
		});
		spliter = util.type.isString(spliter) ? spliter : ',';
		return ret.join(spliter);
	}
	return exports;
});// JavaScript Document

define('widge.validator.rule', function(require, exports, module){

	var util = require('base.util'),
		$ = require('jquery'),
		whiteReg = /\s/;

	var rule = function(form){
		this._rules = {};
		this._groups = {};
		this._errorGroups = {};
		this._errorGroupsCache = {};
		this._customErrorMsgs = {};
		this._errorMsgs = {};
		this._validMsgs = {};
		this._methods = {};
		this._setForm(form);
	};

	rule.prototype._setForm = function(form){
		this._form = form || this;
	}
	rule.prototype.setRules = function(rules, cover){
		this._rules = $.extend(this._rules, this._normalizeRules(rules, cover));
	};
	rule.prototype.removeRules = function(rules, value){
		var f = false;
		if(util.type.isString(rules)){
			var self = this;
			$.each(rules.split(whiteReg), function(index, val) {
				if(value){
					if(self._rules[val]){
						self.removeErrorMessages(val, value);
						self.removeValidMessages(val, value);
						self._rules[val][value] = null;
						delete self._rules[val][value];
						f = true;
					}
				} else {
					self.removeErrorMessages(val);
					self.removeValidMessages(val);
					self._rules[val] = null;
					delete self._rules[val];
					f = true;
				}
			});
		}
		return f;
	};
	rule.prototype.setGroup = function(group){
		if(util.type.isPlainObject(group)){
			var self = this,
				isEvent = this._keepGroupEvent;

			$.each(group, function(key, val){
				$.each(val.split(whiteReg), function(index, name){
					self._groups[name] = key;
					if((util.type.isBoolean(isEvent) && !isEvent) ||
						util.type.isObject(isEvent) && !!isEvent[key] === false){
						self._errorGroups[key] = self._errorGroups[key] || [];
						self._errorGroups[key].push(name);
						self._errorGroupsCache[key] = [];
					}
				});
			});
		}
	};
	rule.prototype.removeGroup = function(group){
		if(util.type.isString(group)){
			var self = this, value;
			$.each(group.split(whiteReg), function(index, val){
				for(var key in self._groups){
					value = self._groups[key];
					if(value && val === value){
						self._form.removeRules(key);
						delete self._groups[key];
					}
				}

				delete self._errorGroups[val];
				delete self._errorGroupsCache[val];
			});
		}
	};
	rule.prototype._normalizeRules = function(rules, cover){
		var self = this;
		$.each(rules, function(name, val){
			if(cover){
				rules[name] = self._normalizeRule(val);
			} else {
				rules[name] = $.extend(self._rules[name] || {}, self._normalizeRule(val));
			}
			if(util.type.isObject(val)){
				$.each(val, function(key, val){
					if (val === false){
						delete rules[name][key];
						return;
					}
				});
			}
		});
		return rules;
	};
	rule.prototype._normalizeRule = function(rules){
		if(util.type.isString(rules)) {
			var transformed = {};
			$.each(rules.split(whiteReg), function(index, val) {
				transformed[val] = true;
			});
			rules = transformed;
		}
		return rules;
	};
	rule.prototype.setMethod = function(methods){
		if(util.type.isPlainObject(methods)){
			var self = this;
			$.each(methods, function(key, val){
				self._methods[key] = val;
			});
		}
	};
	rule.prototype.removeMethod = function(methods){
		if(util.type.isString(methods)){
			var self = this;
			$.each(methods.split(whiteReg), function(index, val) {
				delete self._methods[val];
			});
		}
	};
	rule.prototype.setCustomErrorMessages = function(message){
		if(util.type.isPlainObject(message)){
			this._customErrorMsgs = $.extend(this._customErrorMsgs, message);
		}
	};
	rule.prototype.removeCustomErrorMessages = function(message){
		if(util.type.isString(message)){
			var self = this;
			$.each(message.split(whiteReg), function(index, val) {
				delete self._customErrorMsgs[val];
			});
		}
	}
	rule.prototype.setErrorMessages = function(message){
		if(util.type.isPlainObject(message)){
			this._errorMsgs = util.merge(this._errorMsgs, message);
		}
	};
	rule.prototype.removeErrorMessages = function(message, value){
		if(util.type.isString(message)){
			var self = this;
			$.each(message.split(whiteReg), function(index, val) {
				if(value){
					if(self._errorMsgs[val]){
						delete self._errorMsgs[val][value];
					}
				} else {
					delete self._errorMsgs[val];
				}
			});
		}
	}
	rule.prototype.setValidMessages = function(message){
		if(util.type.isPlainObject(message)){
			this._validMsgs = util.merge(this._validMsgs, message);
		}
	}
	rule.prototype.removeValidMessages = function(message, value){
		if(util.type.isString(message)){
			var self = this;
			$.each(message.split(whiteReg), function(index, val) {
				if(value){
					if(self._validMsgs[val]){
						delete self._validMsgs[val][value];
					}
				} else {
					delete self._validMsgs[val];
				}
			});
		}
	}

	exports.rules = rule;
});+// JavaScript Document

	define('widge.validator.item', 'module.verifier', function(require, exports, module){

		var util = require('base.util'),
			verifier = require('module.verifier'),
			$ =  require('jquery'),
			elementsList = {
				element: "input, select, textarea",
				notElement: ":submit, :reset, :image, [disabled]"
			};

		exports.clean = function(element){
			if(!element) return;
			if(element.getAttribute && element.getAttribute('data-for')) {
				return $("[data-for='" + element.getAttribute('data-for') + "']", this.get('element'));
			} else if(util.type.isString(element) || util.type.isString(element.name)){
				return $("[name='" + (element.name || element) + "']", this.get('element'));
			} else {
				return $(element, this.get('element'));
			}
		};
		exports.targetFor = function(element){
			if (verifier.checkable(element)) {
				this._targetCache[element.name] = element = exports.clean.call(this, element)[0];
			}
			return element;
		};
		exports.getTargetCache = function(element){

			if(!element){ return; }

			if(!util.type.isString(element) && !element.nodeName){
				element = element[0];
			}
			var name = util.type.isString(element) ? element : element.name,
				cache = this._targetCache[name];
			if(!cache || (cache && !cache.length)){
				this._targetCache[name] = exports.clean.call(this, name);
			}
			return this._targetCache[name];
		}
		exports.getLabelCache = function(element){
			if(!util.type.isString(element) && !element.nodeName){
				element = element[0];
			}
			var name = util.type.isString(element) ? element : element.name,
				cache = this._labelCache[name];

			if(!cache || (cache && !cache.length)){
				this._labelCache[name] = exports.errorsFor.call(this, name);
			}
			return this._labelCache[name];
		}
		exports.idOrName = function(element) {

			if(!element){ return; }

			var name = util.type.isString(element) ? element : element.name;
			return this._rule._groups[name] || name;
		};
		exports.errors = function(){
			return $( this.get('errorElement') + "[data-for]", this.get('element') );
		};
		exports.errorsFor = function(element) {
			element = exports.idOrName.call(this, element);
			return exports.errors.call(this).filter("[data-for='" + element + "']");
		};
		exports.prepareElement = function(element){
			this._reset();
			this.toHide = exports.errorsFor.call(this, element);
		}
		exports.prepareForm = function(){
			this._reset();
			this.toHide = exports.errors.call(this);
		}
		exports.validElements = function(){
			return this.currentElements.not(exports.invalidElements.call(this)).not(exports.emptyElements.call(this));
		};
		exports.emptyElements = function(){
			return $(this.emptyList).map(function(){
				return this;
			});
		},
			exports.invalidElements = function(){
				return $(this.errorList).map(function(){
					return this.element;
				});
			};
		exports.defaultMessage = function(element, method){
			var rule = this._rule,
				m = rule._errorMsgs[element.name];
			if(m){
				if(util.type.isString(m)){
					return m;
				} else if(m[method]){
					return m[method] || '';
				} else {
					return rule._customErrorMsgs[method] || '';
				}
			} else {
				return rule._customErrorMsgs[method] || '';
			}
			return '';
		};
		exports.objectLength = function(obj){
			var count = 0;
			for (var i in obj){
				count++;
			}
			return count;
		};
		exports.highlight = function(element, errorClass, validClass){
			element = exports.getTargetCache.call(this, element);
			element && element.addClass(errorClass).removeClass(validClass);
			return element;
		};
		exports.unhighlight = function(element, errorClass, validClass) {
			element = exports.getTargetCache.call(this, element);
			element && element.addClass(validClass).removeClass(errorClass);
			return element;
		};
		exports.showErrors = function(errors){
			if (errors){
				for (var name in errors){
					this.errorList.push({
						message: errors[name].message,
						element: errors[name].element,
						errorClass: this.get('errorClass'),
						ruleType: errors[name].ruleType
					});
				}
				$.extend(this.errorMap, errors);
				this.successList = $.grep(this.successList, function(element){
					return !(element.name in errors);
				});
			}

			exports.defaultShowErrors.call(this);
		};
		exports.defaultShowErrors = function(){
			var errorClass = this.get('errorClass'),
				validClass = this.get('validClass'),
				ruleGroups = this._rule._groups,
				groups = {},
				record = {},
				i, group, error, target, label;
			for (i = 0; this.errorList[i]; i++){
				error = this.errorList[i];
				group = ruleGroups[error.element.name];
				if(record[group]){
					continue;
				}
				target = exports.highlight.call(this, error.element, errorClass, validClass);
				label = exports.showLabel.call(this, false, error.element, error.message, error.errorClass);
				this.trigger('invalid', {
					type: 'invalid',
					ruleType: error.ruleType,
					target: target,
					name: error.element.name,
					label: label,
					errorClass: errorClass,
					validClass: validClass,
					message: error.message
				});
				if(group){
					record[group] = 1;
					groups[group] = true;
				}
				if(this.get('isFind')) return;
			}
			for (i = 0; this.successList[i]; i++){
				var success = this.successList[i],
					group = this._rule._groups[success.element.name];
				if(group && groups[group]){
					continue;
				}
				label = exports.showLabel.call(this, true, success.element, success.message);
				this.trigger('pass', {
					type: 'pass',
					target: exports.getTargetCache.call(this, success.element),
					name: success.element.name,
					label: label,
					errorClass: errorClass,
					validClass: validClass,
					message:success.message
				});
			}
			for (i = 0, elements = exports.validElements.call(this); elements[i]; i++){
				exports.unhighlight.call(this, elements[i], errorClass, validClass);
			}
			this.toHide = this.toHide.not(this.toShow);
		};
		exports.showLabel = function(b, element, message, errorClass){
			var label = exports.getLabelCache.call(this, element),
				errorClass = errorClass || this.get('errorClass'),
				validClass = this.get('validClass');
			if(!label.length) return;
			label.html(message);
			if(validClass || errorClass){
				if(b){
					exports.unhighlight.call(this, label[0], errorClass, validClass);
				} else {
					exports.unhighlight.call(this, label[0], validClass, errorClass);
				}
			}
			this.toShow = this.toShow.add(label);
			return label;
		};
		exports.check = function(element, isGroup){
			element = exports.targetFor.call(this, element);

			if(!element) return;

			var el = exports.getTargetCache.call(this, element),
				rules = this._rule._rules[element.name],
				method;

			if(rules == undefined) {
				this.emptyList.push(element);
				return;
			} else {
				$.grep(this.emptyList, function(index, val){
					return val != element;
				});
			}
			for (method in rules){
				if(!this._rule._methods[method]) continue;
				var rule = {method: method, value: rules[method]};
				var result = this._rule._methods[method].call(
					this, el, rule.value
				);
				if ( /pending/.test(result) ){
					this.toHide = this.toHide.not( exports.errorsFor.call(this, element) );
					var type = result === "pending" ? 'remote' : result;
					this.trigger(type, {
						type: type,
						target: exports.getTargetCache.call(this, element),
						name: element.name,
						label: exports.getLabelCache.call(this, element),
						errorClass: this.get('errorClass')
					});
					return result;
				}
				if (!result){
					if(isGroup){
						this.errorList = util.array.filter(this.errorList, function(n){
							return name !== n.element.name;
						});
					}
					exports.formatAndAdd.call(this, element, rule);
					exports.addGroupCache.call(this, element);
					return false;
				}
			}
			if (exports.objectLength(rules)){
				this.successList.push({
					message: this._rule._validMsgs[element.name] || '',
					element: element
				});
			}
			return exports.getResult.call(this, element);
		}
		exports.getResult = function(element){
			var name = element.name,
				rule = this._rule,
				val;

			if(val = rule._errorGroups[rule._groups[name]]){
				var i = 0, g,
					group = val,
					cache = rule._errorGroupsCache[rule._groups[name]];

				cache.push(name);
				cache = util.array.unique(cache);

				$.each(cache, function(index, val){
					group = util.array.filter(group, function(value){
						return val !== value;
					});
				});
				rule._errorGroupsCache[rule._groups[name]] = cache;
				if(group.length){
					for(; group[i]; i++){
						g = exports.getTargetCache.call(this, group[i]);
						if(!exports.check.call(this, g[0], true)){
							this.successList = util.array.filter(this.successList, function(n){
								return n.element.name !== name;
							});
							return false;
						}
					}
				}
			}
			return true;
		}
		exports.formatAndAdd = function(element, rule){
			var errorClass = this.get('errorClass'),
				message = exports.defaultMessage.call(this, element, rule.method);
			if (util.type.isFunction(message)){
				message = message.call(this, element, rule.result);
			}
			this.errorList.push({
				message: message,
				element: element,
				errorClass: errorClass,
				ruleType: rule.method
			});
			this.errorMap[element.name] = message;
		}
		exports.addGroupCache = function(element){
			var name = element.name,
				rule = this._rule;

			if(rule._errorGroups[rule._groups[name]]){
				rule._errorGroupsCache[rule._groups[name]] = util.array.filter(rule._errorGroupsCache[rule._groups[name]], function(n){
					return n !== name;
				});
			}
		}
		exports.allElements = function(){
			var rulesCache = {},
				rule = this._rule;
			return this.get('element').find(elementsList.element).not(elementsList.notElement).filter(function() {
				if ( this.name in rulesCache || !exports.objectLength(rule._rules[this.name]) )
					return false;
				return rulesCache[this.name] = true;
			});
		}
		exports.focusInvalid = function() {
			if( this.get('isFocus')) {
				var i = 0;
				if(this._keepErrorFocus === true){return;}
				for(len = this.errorList.length; i < len; i++){
					var element = this.errorList[i].element,
						name = element && element.name;
					if(!name || (this._keepErrorFocus && this._keepErrorFocus[name])){
						break;
					}
					$(element || []).filter(":visible").focus();
					break;
				}
			}
		}
	});// JavaScript Document

define('widge.validator.handler',
	'widge.validator.item, module.verifier',
	function(require, exports, module){

		var util = require('base.util'),
			item = require('widge.validator.item'),
			verifier = require('module.verifier'),
			$ = require('jquery'), timer;

		exports.checkPreviousValue = function(element){
			if(this._keepKey === true || (this.keepKey[element.name])){
				return false;
			}
			return verifier.required(element) && this._previousValue[element.name] === element.value;
		}
		exports.onfocusin = function(element, event){
			item.unhighlight.call(this, element, this.get('errorClass'));
			this.trigger('focus', normalizeObj(this, element, event));
		}
		exports.onfocusout = function(element, event){
			if(exports.checkPreviousValue.call(this, element)){
				return;
			}
			if(this.formSubmitted || this._keepBlur === true ||
				(this._keepBlur && this._keepBlur[element.name])){
				return;
			}
			this.trigger('beforeBlur', normalizeObj(this, element, event));
			if (!verifier.checkable(element)){
				this._previousValue[element.name] = element.value;
				this.checkElement(element);
			}
			this.trigger('blur', normalizeObj(this, element, event));
		}
		exports.onkeyup = function(element, event){
			if(exports.checkPreviousValue.call(this, element)){
				return;
			}
			if((this.formSubmitted || this._keepKey === true ||
				(this._keepKey && this._keepKey[element.name]))){
				return;
			}
			var self = this;
			timer && clearTimeout(timer);
			timer = setTimeout(function(){
				self._previousValue[element.name] = element.value;
				self.trigger('beforeKeyup', normalizeObj(self, element, event));
				self.checkElement(element);
				self.trigger('keyup', normalizeObj(self, element, event));
			}, 1);
		}
		exports.onchange = function(element, event){
			if(this.formSubmitted) return;
			this.trigger('beforeChange', normalizeObj(this, element, event));
			this.checkElement(element);
			this.trigger('change', normalizeObj(this, element, event));
		}
		function normalizeObj(context, element, event){
			var target = item.getTargetCache.call(context, element),
				label = item.getLabelCache.call(context, element);
			return {
				type: event.type,
				target: target,
				label: label,
				name: element.name,
				errorClass: context.get('errorClass'),
				validClass: context.get('validClass')
			}
		}

	});// JavaScript Document

define('widge.validator.form',
	'widge.validator.rule, widge.validator.handler, widge.validator.item, module.verifier, module.dataSource'
	, function(require, exports, module){

		var util = require('base.util'),
			rules = require('widge.validator.rule').rules,
			item = require('widge.validator.item'),
			handler = require('widge.validator.handler'),
			dataSource = require('module.dataSource').dataSource,
			$ = require('jquery'),
			shape = require('base.shape'),
			verifier = require('module.verifier'),
			doc = document,
			template = {
				"element": [
					":text, :password, :file, select, textarea",
					"focusin focusout keyup"
				],
				"select": [
					":radio, :checkbox, select",
					"change"
				]
			};

		var form = shape(function(o){
			form.parent().call(this, util.merge({
				element: $('form'),
				rules: {},
				groups: {},
				keepGroupEvent: true,
				errorMessages: null,
				validMessages: null,
				errorClass: null,
				validClass: null,
				errorElement: "label",
				isFocus: true,
				isFind: false,
				keepBlur: null,
				keepKey: null,
				keepErrorFocus: null,
				isCache: true
			}, o));
			if(!this.get('element')[0]){
				throw new Error('无法找到指定的表单');
			}
			this.init();
		});

		form.implement({
			_reset: function(){
				this.successList = [];
				this.errorList = [];
				this.emptyList = [];
				this.errorCache = {};
				this.errorMap = {};
				this.currentElements = $([]);
				this.toShow = $([]);
				this.toHide = $([]);
				this.pendingRequest = 0;
			},
			addDomCache: function(f){
				this.set('isCache', f);
				if(!this.get('isCache')){
					return;
				}
				var e = this._rule._rules;
				for(var key in e){
					if(this._labelCache[key] || this._targetCache[key]){
						continue;
					}
					item.getTargetCache.call(this, key);
					item.getLabelCache.call(this, key);
				}
			},
			removeDomCache: function(e){
				if(!e) return;
				delete this._labelCache[e];
				delete this._targetCache[e];
			},
			init: function(){
				this._previousValue = {};
				this._targetCache = {};
				this._labelCache = {};
				this._reset();
				this.keepBlur();
				this.keepKey();
				this.keepErrorFocus();
				this.after('addRules', function(e){
					if(this.get('isCache')){
						this.addDomCache(true);
					}
				});
				this.after('removeRules', util.bind(this.removeDomCache, this));
				this._initRules();
				var self = this;
				function delegate(event) {
					var eventType = "on" + event.type;
					handler[eventType].call(self, this[0], event);
				}
				$.each(template, function(key, val){
					self._delegate(val[0], val[1], delegate);
				});
			},
			_initRules: function(){
				this._rule = new rules(this);
				this.addRules(this.get('rules'));
				this.keepGroupEvent();
				this.addGroup(this.get('groups'));
				this._initMethod();
				this._addCustomMethod();
				this.addErrorMessages(this.get('errorMessages'));
				this.addValidMessages(this.get('validMessages'));
			},
			_addCustomMethod: function(){
				this._remoteTime = {};
				this._remoteDataSource = {};
				this.addMethod('remote', function(element, param){
					element = element[0];
					var result = 'pending',
						options = {},
						callback = null,
						url, status;

					if(util.type.isString(param)){
						url = param;
						timeout = 100;
					} else if(util.type.isObject(param)){
						options = $.extend({}, param);
						url = param.url;
						timeout = options.timeout || 0;
						callback = options.callback;
						status = options.status;
						delete options.timeout;
						delete options.status;
						delete options.url;
						delete options.callback;
					} else {
						throw new Error('widge.validator.form: remote参数不正确');
					}
					options['isCache'] = true;
					try {
						var self = this,
							value = verifier.elementValue(element),
							remoteDataSource = this._remoteDataSource[element.name] || new dataSource(),
							dataCache = remoteDataSource.getCache(value);

						function passed(element, f){
							self.errorCache && delete self.errorCache[element.name];
							if(!f){
								self.successList.push({
									element: element,
									message: self._rule._validMsgs[element.name] || ''
								});
								item.showErrors.call(self);
							}
							return true;
						}
						function errored(element, f){
							self.errorCache && (self.errorCache[element.name] = true);
							var message = status || item.defaultMessage.call(self, element, 'remote' );
							if(!f){
								var errors = {};
								errors[element.name] = {
									message: util.type.isFunction(message) ? message(value) : message,
									element: element,
									ruleType: 'remote'
								};
								item.showErrors.call(self, errors);
							}
							return false;
						}
						function execture(e){
							if(util.type.isFunction(callback)){
								result = callback.call(this, e);
							} else if(util.type.isBoolean(callback)){
								result = callback;
							} else {
								status = status && e[status];
								result = status || !e;
							}
							return result;
						}

						if(dataCache !== undefined){
							result = execture.call(this, dataCache);
							return result ? passed(element, true) : errored(element, true);
						} else {
							remoteDataSource.setOptions(options);
							remoteDataSource.setData(url);
							remoteDataSource.clearAllCache();
							remoteDataSource.getData(value);
							this.formSubmitted && this.pendingRequest++;
						}

						if(!this._remoteDataSource[element.name]){
							this._remoteDataSource[element.name] = remoteDataSource;
							remoteDataSource.on('data', function(e){
								self._remoteTime[element.name] && clearTimeout(self._remoteTime[element.name]);
								self._remoteTime[element.name] = setTimeout(function(){
									result = execture.call(self, e);
									result ? passed(element) : errored(element);
									if(self.formSubmitted){
										self.pendingRequest--;
										if(self.pendingRequest <= 0){
											self.pendingRequest = 0;
										}
										if(!self.pendingRequest){
											if(util.type.isEmptyObject(self.errorCache)){
												self._submitResult.call(self, true);
											}
											self.formSubmitted = false;
											delete self._submitResult;
										}
									}

								}, timeout);
							});
						}
					} catch (ex) {
						throw new Error('widge.validator.form:' + ex);
					}
					return result;
				});
			},
			/**
			 * 字面上看是清除远程缓存 ？？待研究
			 * @param element 可以是验证的元素dom或其name或[dom]
			 */
			clearRemoteCache: function(element){
				var name;
				if(element.nodeType){
					name = element.name;
				} else if(util.type.isString(element)){
					name = element;
				} else {
					name = element[0].name;
				}
				this._remoteDataSource[name] && this._remoteDataSource[name].clearAllCache();
			},
			keepGroupEvent: function(){
				var isEvent = this.get('keepGroupEvent'),
					self = this;
				if(util.type.isBoolean(isEvent) || util.type.isObject(isEvent)){
					this._rule._keepGroupEvent = isEvent;
				} else if(util.type.isString(isEvent)){
					this._rule._keepGroupEvent = {};
					$.each(isEvent.split(/\s/), function(index, val){
						self._rule._keepGroupEvent[val] = true;
					});
				}
			},
			keepBlur: function(blur){
				this._keepEvent('keepBlur', blur);
			},
			keepKey: function(key){
				this._keepEvent('keepKey', key);
			},
			keepErrorFocus: function(focus){
				this._keepEvent('keepErrorFocus', focus);
			},
			_keepEvent: function(type, value){
				value != undefined && this.set(type, value);
				var result = this.get(type);
				if(util.type.isBoolean(result)){
					this['_' + type] = result;
				} else if(util.type.isString(result)){
					this['_' + type] = {};
					var self = this;
					$.each(result.split(/\s/), function(key, val){
						self['_' + type][val] = true;
					});
				}
			},
			_initMethod: function(){
				var self = this, methods = {};
				$.each(verifier, function(key, value){
					if(/getLength|checkable|selectable|elementValue/.test(key)){
						return;
					}
					methods[key] = value;
				});
				if(!util.type.isEmptyObject(methods)){
					this._rule.setMethod(methods);
				}
			},
			_delegate: function(delegate, type, handler){
				return this.get('element').on(type, function(event) {
					var target = $(event.target);
					if (target.is(delegate)) {
						return handler.apply(target, arguments);
					}
				});
			},
			addMethod: function(name, method, message){
				if(util.type.isFunction(method)){
					var m = {}
					m[name] = method;
					this._rule.setMethod(m);

					if(message){
						var e = {};
						e[name] = message;
						this._rule.setCustomErrorMessages(e);
					}
				}
			},
			removeMethod: function(name){
				this._rule.removeMethod(name);
				this._rule.removeCustomErrorMessages(name);
			},
			addRules: function(rule, value, cover){
				if(!rule) return;
				if(util.type.isObject(rule)){
					this._rule.setRules(rule, value);
				} else if(util.type.isString(rule)){
					var e = {};
					e[rule] = value;
					this._rule.setRules(e, cover);
				}
			},
			removeRules: function(rule, value){
				if(!rule) return;
				var f = this._rule.removeRules(rule, value);
				if(f){
					if((!value || value === "remote") && this._remoteDataSource[rule]){
						if(this._remoteDataSource[rule]){
							this._remoteDataSource[rule].destory(true);
							delete this._remoteDataSource[rule];
						}
					}
				}
			},
			getRules: function(){
				return this._rule._rules;
			},
			addErrorMessages: function(message, value){
				if(util.type.isObject(message)){
					this._rule.setErrorMessages(message);
				} else if(util.type.isString(message)){
					var e = {};
					e[message] = value;
					this._rule.setErrorMessages(e);
				}
			},
			removeErrorMessages: function(message, value){
				this._rule.removeErrorMessages(message, value);
			},
			addValidMessages: function(message, value){
				if(util.type.isObject(message)){
					this._rule.setValidMessages(message);
				} else if(util.type.isString(message)){
					var e = {};
					e[message] = value;
					this._rule.setValidMessages(e);
				}
			},
			removeValidMessages: function(message, value){
				this._rule.removeValidMessages(message, value);
			},
			addGroup: function(group){
				if(util.type.isObject(group)){
					this._rule.setGroup(group);
				} else if(util.type.isString(group)){
					var e = {};
					e[group] = value;
					this._rule.setGroup(e);
				}
			},
			removeGroup: function(group){
				this._rule.removeGroup(group);
			},
			checkForm: function(isFind){
				isFind && this.set('isFind', isFind);
				var f = this.isValid();
				this.errorCache = $.extend({}, this.errorMap);
				item.showErrors.call(this);
				return f;
			},
			isValid: function(){
				var result, f = true;
				item.prepareForm.call(this);
				for ( var i = 0, elements = (this.currentElements = item.allElements.call(this)); elements[i]; i++ ) {
					result = item.check.call(this, elements[i]);
					if(/pending/.test(result)){
						f = false;
						this._isRemote = true;
					}
				}

				item.focusInvalid.call(this);
				return f && this.errorList.length === 0;
			},
			resetFormSubmitted: function(){
				this.formSubmitted = false;
			},
			isFormSubmitted: function(){
				return this.formSubmitted;
			},
			submit: function(callback, errorback){
				if(this.formSubmitted){
					return;
				}
				delete this._isRemote;
				this.formSubmitted = true;
				var isFind = this.get('isFind'),
					result;

				if(util.type.isObject(callback)){
					var opts = callback;
					callback = opts.callback;
					errorback = opts.errorback;
					isFind = opts.isFind || isFind;
				}

				this._submitResult = callback || (this.getElement() && this.getElement().submit);
				if(result = this.checkForm(isFind)){
					callback ? callback.call(this, result) : this.getElement().submit();
				} else {
					errorback && errorback.call(this, result);
				}
				if(!this._isRemote){
					this.formSubmitted = false;
				}
			},
			getElement: function(){
				var element = this.get('element');
				if(element && element[0].nodeName.toLowerCase === "form"){
					return element;
				} else if(element.closest('form').length) {
					return element.closest('form');
				} else if(element.find('form').length){
					return element.find('form');
				}
				return null;
			},
			checkElement: function(element){
				element = element.nodeName ? element : element[0];
				element = item.targetFor.call(this, element);
				item.prepareElement.call(this, element);
				this.currentElements = item.getTargetCache.call(this, element) || $([]);
				var result = item.check.call(this, element);
				if(/pending/.test(result)){
					return false;
				}
				item.showErrors.call(this);
				return result;
			},
			resetElement: function(element, f){
				var allClass = this.get('errorClass') + ' ' + this.get('validClass');
				element = element.nodeName ? element : element[0];
				item.prepareElement.call(this, element);
				this.currentElements = item.getTargetCache.call(this, element);
				var label = item.getLabelCache.call(this, element);
				label.removeClass(allClass).html('');
				this.currentElements.removeClass(allClass);
				if(!f){
					if(verifier.checkable(element)){
						this.currentElements.prop('checked', false);
					} else if(verifier.selectable(element)){
						this.currentElements.prop('selectedIndex', 0);
					} else {
						this.currentElements.val('');
					}
				}
				this.trigger('clearItem', {
					label: label,
					element: this.currentElements
				});
			},
			resetForm: function(f){
				var allClass = this.get('errorClass') + ' ' + this.get('validClass');
				item.prepareForm.call(this);
				this.formSubmitted = false;
				this.toHide.removeClass(allClass).html('');
				this.toShow.removeClass(allClass).html('');
				var allElements = item.allElements.call(this);
				allElements.removeClass(allClass);
				f && this.getElement() && this.getElement()[0].reset();
				this.trigger('clear', {
					hideElements: this.toHide,
					showElements: this.toShow,
					allElements: allElements
				});
			}
		});

		if (!$.event.special.focusin && !$.event.special.focusout && doc.addEventListener) {
			$.each({
				focus: 'focusin',
				blur: 'focusout'
			}, function( original, fix ){
				$.event.special[fix] = {
					setup:function() {
						this.addEventListener( original, handler, true );
					},
					teardown:function() {
						this.removeEventListener( original, handler, true );
					},
					handler: function(e) {
						arguments[0] = $.event.fix(e);
						arguments[0].type = fix;
						return $.event.handle.apply(this, arguments);
					}
				};
				function handler(e) {
					e = $.event.fix(e);
					e.type = fix;
					return $.event.handle.call(this, e);
				}
			});
		};

		return form;
	});// JavaScript Document

define('product.resume.editResume',
	'widge.validator.form',
	function(require, exports, module) {

		var $ = require('jquery'),
			shape = require('base.shape'),
			util = require('base.util'),
			validator = require('widge.validator.form'),
			inputElement = "[name={name}]",
			labelElement = "[data-for={name}]",
			nameReg = /\{name\}/;

		var editResume = shape(function(o){
			editResume.parent().call(this, util.merge({
				element: $('#baseinfor'),
				trigger: '.edit',
				formName: 'form',
				normalName: '.res-infor',
				editName: '.edit-status-box',
				validators: null,
				classes: {
					successLabel: 'success-msg',
					successText: 'success-text',
					errorLabel: 'error-msg',
					errorText: 'error-text',
					warningLabel: 'warning-msg',
					warningText: 'warning-text'
				},
				remoteInputClass: false,
				submitButton: '.saveBtn',
				cancelButton: '.cancelBtn'
			}, o));
			this.init();
		});

		editResume.implement({
			init: function(){
				this._initElements();
				this._isInit = true;
				this._initValidator();
				this._initEvent();
			},
			_initElements: function(){
				this._trigger = this.getDom(this.get('trigger'));
				this._normal = this.getDom(this.get('normalName'));
				this._edit = this.getDom(this.get('editName'));
				this._submitButton = this.getDom(this.get('submitButton')),
					this._cancelButton = this.getDom(this.get('cancelButton'));
			},
			_initValidator: function(){
				var v = this.get('validators');
				if(v){
					if(util.type.isObject(v)){
						this._validator = [new validator($.extend(v, {
							element: this.getDom(this.get('formName'))
						}))];
						check(0, this._validator[0]);
					} else if(util.type.isArray(v)){
						this._validator = [];
						for(var i = 0, len = v.length; i < len; i++){
							this._validator.push(new validator(
								$.extend(v[i], {
										element: this.getDom(this.get('formName')).eq(i)
									}
								)));
							check(i, this._validator[i]);
						}
					}
				}
				var self = this;
				function check(index, val){
					val.on('focus', function(e){
						e.index = index;
						self.trigger('focus',e);
					});
					val.on('blur', function(e){
						e.index = index;
						self.trigger('blur',e);
					});
					val.on('invalid', function(e){
						e.index = index;
						self._invalid(e);
					});
					val.on('remote', function(e){
						e.index = index;
						self._remote(e);
					});
					val.on('pass', function(e){
						e.index = index;
						self._pass(e);
					});
					val.on('clear', function(e){
						e.index = index;
						self._clear(e);
					});
					val.on('clearItem', function(e){
						self._clearItem(e);
					});
				}
			},
			_initEvent: function(){
				var element = this.get('element'),
					self = this;
				setTimeout(function(){
					self.trigger('render');
				}, 1);
				this.before('_handler', function(){
					if(this._isInit){
						var self = this;
						setTimeout(function(){
							self.trigger('init');
							delete self._isInit;
						}, 2);
					}
				});
				element.on('click', this.get('trigger'), util.bind(this._handler, this));
				element.on('click', this.get('submitButton'), util.bind(this._submit, this));
				element.on('click', this.get('cancelButton'), util.bind(this._cancel, this));
			},
			_invalid: function(e){
				var classes = this.get('classes'),
					successText = e.successTextClass = classes.successText,
					successLabel = e.successLabelClass = classes.successLabel,
					warningText = e.warningTextClass = classes.warningText,
					warningLabel = e.warningLabelClass = classes.warningLabel,
					errorText = e.errorTextClass = classes.errorText,
					errorLabel = e.errorLabelClass = classes.errorLabel;
				e.target.removeClass(successText + ' ' + warningText).addClass(errorText);
				e.label.removeClass(successLabel + ' ' + warningLabel).addClass(errorLabel);
				e.errorLabelClass = errorLabel;
				e.errorTextClass = errorText;

				this.trigger('invalid', e);
			},
			_pass: function(e){
				e.target.removeClass(this.allClass('text'));
				e.label.removeClass(this.allClass('label'));

				var classes = this.get('classes');
				e.successTextClass = classes.successText,
					e.successLabelClass = classes.successLabel,
					e.warningTextClass = classes.warningText,
					e.warningLabelClass = classes.warningLabel,
					e.errorTextClass = classes.errorText,
					e.errorLabelClass = classes.errorLabel;

				this.trigger('pass', e);
			},
			_remote: function(e){
				var classes = this.get('classes'),
					successText = e.successTextClass = classes.successText,
					successLabel = e.successLabelClass = classes.successLabel,
					warningText = e.warningTextClass = classes.warningText,
					warningLabel = e.warningLabelClass = classes.warningLabel,
					errorText = e.errorTextClass = classes.errorText,
					errorLabel = e.errorLabelClass = classes.errorLabel;

				if(this.get('remoteInputClass')){
					e.target.removeClass(successText + ' ' + errorText).addClass(warningText);
					e.label.removeClass(successLabel + ' ' + errorLabel).addClass(warningLabel)
				}
				this.trigger('remote', e);
			},
			_clear: function(e){
				e.allElements.removeClass(this.allClass('text'));
				e.hideElements.removeClass(this.allClass('label'));
				e.showElements.removeClass(this.allClass('label'));
			},
			_clearItem: function(e){
				e.label.removeClass(this.allClass('label'));
				e.element.removeClass(this.allClass('text'));
			},
			_handler: function(e){
				if(this._edit.is(':hidden')){
					e.status = true;
					this._toggle(e);
					var self = this;
					setTimeout(function(){
						self._trigger.hide();
						self.trigger('modify', e);
					},1);
				}
			},
			_submit: function(e){
				this.trigger('submit', e);
			},
			_cancel: function(e){
				var target = $(e.currentTarget);
				e.index = this._cancelButton.index(target);
				this._toggle(e);
				this.resetForm();
				this.trigger('cancel', e);
			},
			resetForm: function(f){
				if(this._validator){
					for(var i=0, len=this._validator.length; i<len; i++){
						this._validator[i].resetForm(f);
					}
				}
			},
			_toggle: function(e){
				if(e.status){
					this._trigger.hide();
					this.hide();
				} else {
					this._trigger.show();
					this.show();
				}
			},
			show: function(){
				if(this._trigger.is(':hidden')){
					this._trigger.show();
				}
				this._edit.hide();
				this._normal.show();
			},
			hide: function(){
				this._edit.show();
				this._normal.hide();
			},
			allClass: function(name){
				var classes = this.get('classes'),
					success = classes['success' + ucFirst(name)],
					warning = classes['warning' + ucFirst(name)],
					error = classes['error' + ucFirst(name)];
				return success + ' ' + warning + ' ' + error;
			},
			getElement: function(name, index){
				return $(inputElement.replace(nameReg, name), this.get('element'));
			},
			getLabel: function(name, index){
				return $(labelElement.replace(nameReg, name), this.get('element'));
			},
			getDom: function(name, index){
				return $(name, this.get('element'));
			},
			getValidator: function(index){
				return this._validator[index || 0];
			},
			isEditor: function(){
				return this._edit.is(':visible');
			}
		});

		function ucFirst(str) {
			return str.charAt(0).toUpperCase() + str.substring(1);
		}

		return editResume;

	});// JavaScript Document

define('product.resume.editMutilResume',
	'product.resume.editResume',
	function(require, exports, module) {

		var $ = require('jquery'),
			Class = require('base.class').Class,
			util = require('base.util'),
			editResume = require('product.resume.editResume');

		var editMutilResume = Class(function(o){
			editMutilResume.parent().call(this, util.merge({
				element: $('#workInfor'),
				trigger: '.edt',
				addTrigger: '.edit',
				delTrigger: '.del',
				normalName: '.workRows',
				editName: '.edit-status-box',
				submitAddButton: '.saveAddBtn',
				isAll: false
			}, o));
		}).extend(editResume);

		editMutilResume.implement({
			_initElements: function(){
				editMutilResume.parent('_initElements').call(this);
				this._addTrigger = this.getDom(this.get('addTrigger'));
				this._delTrigger = this.getDom(this.get('delTrigger'));
				this._submitAddButton = this.getDom(this.get('submitAddButton'));
				if(this.get('isAll')){
					this._normalItem = this._normal.children();
				}
			},
			_initEvent: function(){
				editMutilResume.parent('_initEvent').call(this);
				var element = this.get('element'),
					self = this;
				this.before('_add', function(){
					this._edit.hide();
					if(this._isInit){
						setTimeout(function(){
							self.trigger('init');
							delete self._isInit;
						}, 2);
					}
				});
				element.on('click', this.get('submitAddButton'), function(e){
					e.otherEvent = "submitAdd";
					e.otherSubmitButton = self._submitAddButton;
					self._submit(e);
				});
				element.on('click', this.get('delTrigger'), util.bind(this._delete, this));
				element.on('click', this.get('addTrigger'), util.bind(this._add, this));
			},
			_toggle: function(e){
				var target = $(e.currentTarget),
					index = this._trigger.index(target);

				if(e.status){
					this._oldIndex = index;
					if(this._normalItem){
						this._normalItem.show().eq(index).hide();
						this._edit.show();
					} else {
						this._normal.show();
						this._normal.eq(index).hide().after(this._edit.show());
					}
				} else {
					this._edit.hide();
					if(this._oldIndex != undefined){
						if(this._normalItem){
							this._normalItem.eq(this._oldIndex).show();
						} else {
							this._normal.eq(this._oldIndex).show();
						}
					}
				}
				if(e.isCancel) return;
				var self = this;
				this._submitAddButton.hide();
				setTimeout(function(){
					self._addTrigger.show();
					self.trigger('modify', e);
				},1);
			},
			getIndex: function(){
				return this._oldIndex;
			},
			_delete: function(e){
				e.target = $(e.currentTarget);
				var index = e.index = this._delTrigger.index(e.target);
				this.trigger('delete', e);
			},
			deleteList: function(index){
				if(index == undefined) return;
				if(this._normalItem){
					this._normalItem.eq(index).remove();
				} else {
					this._normal.show().eq(index).remove();
				}
				this._edit.hide();
				this._addTrigger.show();
				this.update();
				delete this._oldIndex;
				delete this._isAdd;
			},
			_handler: function(e){
				delete this._isAdd;
				e.status = true;
				this._toggle(e);
			},
			_cancel: function(e){
				delete this._isAdd;
				e.isCancel = true;
				this._addTrigger.show();
				editMutilResume.parent('_cancel').call(this, e);
			},
			_add: function(e){
				this.add();
				this.trigger('add', e);
			},
			add: function(){
				if(this._normalItem){
					this._edit.show();
					if(this._oldIndex != undefined)
						this._normalItem.eq(this._oldIndex).show();
				} else {
					this._normal.eq(0).before(this._edit.show());
					if(this._oldIndex != undefined)
						this._normal.eq(this._oldIndex).show();
				}
				delete this._oldIndex;
				if(this._isAdd) return;
				this._isAdd = true;
				this._addTrigger.hide();
				this._submitAddButton.show();
			},
			_submit: function(e){
				editMutilResume.parent('_submit').call(this, e);
			},
			update: function(){
				this._normal = this.getDom(this.get('normalName'));
				this._trigger = this.getDom(this.get('trigger'));
				this._delTrigger = this.getDom(this.get('delTrigger'));
				if(this.get('isAll')){
					this._normalItem = this._normal.children();
				}
			},
			show: function(){
				if(this._normalItem){
					this._normalItem.show();
				}
				if(this._isAdd && this._addTrigger.is(':hidden')){
					this._addTrigger.show();
				}
				editMutilResume.parent('show').call(this);
			}
		});

		return editMutilResume;

	});// JavaScript Document

define('widge.checkBoxer', function(require, exports, module){

	var shape = require('base.shape'),
		$ = require('jquery'),
		util = require('base.util'),
		name = 'ui_checkbox',
		attrName = 'data-name',
		valueName = 'data-value',
		statusName = 'data-status',
		disabledName = 'data-disabled',
		uid = 0,
		template = '<input name="{name}" type="{type}" value="{value}" {status} {disabled}/>',
		doc = document;

	var checkBoxer = shape(function(o){
		checkBoxer.parent().call(this, util.merge({
			element: $('.pos'),
			multiple: true,
			maxLength: 999,
			className: 'pos_yes',
			hoverClassName: null,
			disabledClassName: null,
			disabledSelClassName: null,
			isDocClick: true
		}, o));
		this.init();
	});

	checkBoxer.implement({
		init: function(){
			this._status = [];
			this._param = [];
			this._disabled = [];
			this._initConfig();
			this._initElements();
			this._initEvents();
			this.get('isDocClick') && checkBoxer.allCheck.push(this);
		},
		_initConfig: function(){
			var mutil = this.get('multiple');
			if(!mutil){
				this.set('maxLength', 1);
			}
			this.set('type', getType(mutil));
		},
		_initElements: function(){
			var element = this.get('element'),
				name = this.get('name');

			initTemplate.call(this, element);
		},
		isHoverClass: function(){
			return !!this.get('hoverClassName');
		},
		_initEvents: function(){
			var items = this.get('element'),
				itemsName = getNodeName(items),
				container = this.get('container') || items.parent() || $(doc),
				self = this;
			if(this.isHoverClass()){
				container.on('mouseenter', itemsName, function(e){
					var index = items.index($(this));
					self.hover(index, true);
				}).
					on('mouseleave', itemsName, function(e){
						var index = items.index($(this));
						self.hover(index, false);
					});
			}
		},
		hover: function(index, b){
			if(!this.isHoverClass)
				return;

			if(this._disabled[index]){
				return;
			}
			var items = this.get('element'),
				item = items.eq(index),
				status = this._status[index];
			hoverClass = this.get('hoverClassName');

			items.removeClass(hoverClass);
			if(!status){
				b ? item.addClass(hoverClass) : item.removeClass(hoverClass);
			}
		},
		setStatus: function(index, isStatus, isEvent){
			var e = {},
				items = this.get('element'),
				item = e.trigger = items.eq(index),
				checkbox = e.target = this.get('children').eq(index),
				status = true;

			e.index = index;
			if(this._status[index] === undefined || this._disabled[index]){
				return;
			}
			if(this.get('multiple')){
				status = this._status[index];
				status = isStatus != undefined ? isStatus : !status;
				e.status = status;
			} else {
				e.oldIndex = this._oldIndex != undefined ? this._oldIndex : -1;
				this._oldIndex = index;
			}
			this.render(index, status);
			isEvent && this.trigger('select', e);
		},
		render: function(index, status){
			if(this.get('multiple')){
				renderCheckbox.call(this, index, status);
			} else {
				renderRadio.call(this, index, status);
			}
		},
		isChecked: function(index){
			index === undefined && (index = 0);
			return this._status[index];
		},
		isDisabled: function(index){
			index === undefined && (index = 0);
			return this._disabled[index];
		},
		isAll: function(count){
			var status = this._status.slice(count || 0, this._status.length),
				ret = util.array.filter(status, function(val){
					return val === true;
				}, this);
			return ret.length >= status.length;
		},
		setDisabled: function(index, status, fn){
			this._disabled[index] = status;
			var items = this.get('element'),
				item = items.eq(index),
				classNames = [
					this.get('disabledClassName'),
					this.get('disabledSelClassName'),
					this.get('hoverClassName'),
					this.get('className')
				],
				elStatus;

			if(!util.type.isFunction(fn)){
				if(elStatus = this._status[index]){
					renderClass(item, status, classNames[1]);
				} else {
					renderClass(item, status, classNames[0]);
				}
				item.attr(disabledName, status);
				this.get('children').eq(index).prop('disabled', status);
				this.render(index, elStatus);
			} else {
				fn.call(this, index, item, classNames);
			}
		},
		allDisabled: function(status, fn){
			this.all(status, function(index){
				this.setDisabled(index, status, fn);
			});
		},
		all: function(status, fn){
			if(status === undefined){
				status = true;
			}
			var element = this.get('element');
			element.each(util.bind(function(index){
				index = this.get('multiple') ? index : null;
				fn ? fn.call(this, index) : this.setStatus(index, status);
			}, this));

			this.trigger('selectAll', {
				trigger: element,
				target: this.get('children'),
				index: 'all',
				status: status
			});
		},
		isMaxLength: function(){
			return this.getLength() < this.get('maxLength');
		},
		getLength: function(){
			return this.get('children').filter(':checked').length;
		},
		destory: function(){
			delete this._index;
			delete this._status;
			destory(this, checkBoxer.allCheck);
			checkBoxer.parent('destory').call(this);
		},
		getLabel: function(){
			var ret = util.array.filter(this._param, function(val, index){
					return $.trim(val.value) != "";
				}),
				label = [];
			$.each(ret, function(index, val){
				label.push(val.label);
			});
			return label.join(',');
		},
		getValue: function(b){
			var result = normalizeValue.call(this, b);
			if(b){
				return util.string.unparam(result);
			}
			return result;
		},
		getParam: function(name){
			return this.getValue(true)[name] || undefined;
		},
		getElement: function(){
			return this.get('element');
		}
	});
	checkBoxer.allCheck = [];

	function destory(target, array){
		for(var i=0; i < array.length; i++) {
			if (target === array[i]) {
				array.splice(i, 1);
				return array;
			}
		}
	}
	function normalizeValue(b){
		var param = this._param,
			ret = util.array.filter(param, function(val, index){
				return $.trim(val.value) != "";
			}),
			result = [],
			b = b ? '[]' : '';
		$(ret).each(function(index, val){
			result.push(val.name + b + '=' + val.value);
			result.push('&');
		});
		result.pop();
		return result.join('');
	}
	function renderCheckbox(index, status){
		var items = this.get('element'),
			item = items.eq(index),
			checkbox = this.get('children').eq(index),
			className = this.get('className');

		if(!this.isMaxLength() && status){
			this.trigger('maxLimit', {
				trigger: item,
				target: checkbox,
				index: index
			});
			return;
		}

		renderClass(item, status, className);
		item.attr(statusName, status);
		checkbox.prop('checked', status);
		this._status[index] = status;
		this._param[index] = {
			name: item.attr(attrName),
			value: status ? checkbox.val() : '',
			label: status ? item.text() : ''
		};
	}
	function renderRadio(index, status){
		var items = this.get('element'),
			checkboxs = this.get('children'),
			className = this.get('className'),
			self = this;

		$(this._status).each(function(index, val){
			val = false;
			self._param[index] = {
				name: items.eq(index).attr(attrName),
				value: ''
			};
		});

		items.removeClass(className);
		checkboxs.prop('checked', false);

		if(index != undefined){
			var item = items.eq(index),
				checkbox = checkboxs.eq(index);

			renderClass(item, status, className);
			item.attr(statusName, status);
			checkbox.prop('checked', status);
			this._status[index] = status;
			this._param[index] = {
				name: item.attr(attrName),
				value: checkbox.val()
			};
		}
	}

	function renderClass(item, status, className){
		if(status){
			item.addClass(className);
		} else {
			item.removeClass(className);
		}
	}
	function initTemplate(element){
		var self = this,
			className = this.get('className'),
			disabledClassName = this.get('disabledClassName'),
			disabledSelClassName = this.get('disabledSelClassName'),
			index = 0,
			i = uid++,
			type = this.get('type'),
			html;

		element.each(function(id){
			var _this = $(this),
				value = _this.attr(valueName) || id,
				data = {
					name: _this.attr(attrName) || name + i,
					type: type,
					value: value,
					status: '',
					disabled: ''
				},
				undef,
				s =  _this.attr(statusName) && _this.attr(statusName) === "true",
				d =  _this.attr(disabledName) && _this.attr(disabledName) === "true";

			if(s){
				if(index < self.get('maxLength')){
					data.status = 'checked';
					self._status[id] = s;
					self._param[id] = {
						name: _this.attr(attrName),
						value: value
					};
					if(d){
						data.disabled = "disabled";
						renderClass(_this, false, disabledClassName);
						renderClass(_this, true, disabledSelClassName);
					} else {
						renderClass(_this, true, className);
					}

					index++;
				} else {
					undef = true;
				}
			}
			if(!s || undef) {
				self._status[id] = false;
				self._param[id] = {
					name: _this.attr(attrName),
					value: ''
				};
				_this.attr(statusName, 'false');

				if(d){
					renderClass(_this, false, disabledSelClassName);
					renderClass(_this, true, disabledClassName);
				} else {
					renderClass(_this, false, className);
				}
			}

			_this.attr(disabledName, d);
			self._disabled[id] = d;

			html = util.string.replace(template, data);
			$(html).appendTo(_this).hide();
		});
		this.set('children', element.children('input'));
	}

	function getNodeName(items){
		return items[0] && items[0].nodeName.toLowerCase();
	}
	function getType(mutil){
		return mutil ? 'checkbox' : 'radio';
	}
	function toggleCheckBoxs(e){
		$(checkBoxer.allCheck).each(function(index, item) {
			var element = item.get('element');
			element.each(function(i){
				var el = $(this)[0];
				if (el === e.target || $.contains(el, e.target)){
					e.preventDefault();
					item.setStatus(i, null, true);
				}
			});
		});
	}

	$(doc).on('click', function(e){
		toggleCheckBoxs(e);
	});

	return checkBoxer;
});
// JavaScript Document

define('widge.multipleSelect',
	'widge.select, widge.checkBoxer',
	function(require, exports, module){

		var $ = require('jquery'),
			util = require('base.util'),
			Class = require('base.class').Class,
			select = require('widge.select'),
			checkBoxer = require('widge.checkBoxer'),
			clearBtnName = '.clearBtn',
			template = {
				list: '<ul></ul>',
				item: '<li><a data-name="{name}" data-value="{value}" href="javascript:" ><em></em>{label}</a></li>',
				header: '<div><a class="clearBtn" href="javascript:">清除所选</a></div>'
			},
			delay = 70;

		var multipleSelect = Class(function(o){
			multipleSelect.parent().call(this, util.merge({
				trigger: $('#select'),
				target: 'label',
				menu: 'ul',
				selectName: null,
				template: template.item,
				checkedClassName: 'checked',
				defaultText: null,
				maxLength: 3,
				isClear: true
			}, o));
		}).extend(select);

		multipleSelect.implement({
			_renderTemplate: function(){
				if(this._checkBoxer){
					this._checkBoxer.destory();
					this._checkBoxer = null;
				}
				if(this.get('isClear')){
					if(this._clearAllBox){
						this._clearAllBox.remove();
					}
					this._clearAllBox = $(template.header).prependTo(this.get('element'));
				}
				if(!this._isInit){
					this.clearText();
				}
				multipleSelect.parent('_renderTemplate').call(this);
				this._checkBoxer = new checkBoxer({
					element: this.get('items'),
					className : this.get('checkedClassName'),
					maxLength: this.get('maxLength')
				});
				this._defaultText = this.get('defaultText') || '请选择';
				var self = this;
				this._checkBoxer.on('select', function(e){
					self.setSelectedIndex(e.index, e.status);
				});
				this._checkBoxer.on('maxLimit', function(e){
					self.trigger('maxLimit', e);
				});
				this._updateScroll();
			},
			getCheckBoxer: function(){
				return this._checkBoxer;
			},
			_createItems: function(){
				this.set('items', this.get('menu').find('a'));
				this.set('itemName', getNodeName(this.get('items')));
			},
			destory: function(){
				if(this._checkBoxer){
					this._checkBoxer.destory();
				}
				multipleSelect.parent('destory').call(this);
			},
			clearText: function(){
				var trigger = this.get('target')[0] ? this.get('target') : this.get('trigger');
				trigger.html(this._defaultText);
				this.get('selectName').val('');
				this._changeColor();
			},
			clearAll: function(){
				var e = {};

				this._checkBoxer.all(false);
				e.label = this._defaultText;
				e.status = false;
				this.get('items').removeClass(this.get('selectClassName'));
				this.clearText();
				this.set('selectedIndex', e.index = -1);
				this.trigger('change', e);
			},
			setSelectedIndex: function(index, status, isEvent){
				var items = this.get('items'),
					input, len;
				if(!items) return;
				if(len = items.length){
					if(index < 0) return;
					var selClass = this.get('selectClassName'),
						trigger = this.get('target')[0] ? this.get('target') : this.get('trigger'),
						index = range(index, len);
					e = {};
					items.removeClass(selClass);
					items = items.eq(index);
					if(input = this.get('selectName')){
						var values = this._checkBoxer.getValue(true),
							joinName = "";
						for(var key in values){
							joinName += values[key] + ',';
						}
						joinName = joinName.substring(0, joinName.length - 1);
						input.val(joinName);
						e.value = joinName;
					}
					e.label = this._checkBoxer.getLabel() || this._defaultText;
					trigger.html(e.label);
					e.status = status;
					this.set('selectedIndex', e.index = index);
					items.addClass(selClass);
					this._changeColor();
					!isEvent && this.trigger('change', e);
				}
			},
			addElement: function( data ){
				if(!this.get('items').length && this.get('isClear')){
					$(template.header).prependTo(this.get('element'));
				}
				multipleSelect.parent('addElement').call(this, data);
			},
			removeElement: function(index){
				var len = this.get('items').length;
				multipleSelect.parent('removeElement').call(this, index);
				if(!len){
					this.removeAllElements();
				}
			},
			removeAllElements: function(){
				var trigger = this.get('target')[0] ? this.get('target') : this.get('trigger');
				this.get('element').empty();
				this.set('menu', null);
				trigger.html(this._defaultText);
				this.get('selectName').val('');
				if(this._checkBoxer){
					this._checkBoxer.destory();
					this._checkBoxer = null;
				}
				this._changeColor();
				this.set('selectedIndex', -1);
			},
			_changeColor: function(){
				var sc = this.get('selectCallback');
				if(util.type.isObject(sc)){
					var target = this.get('target');
					if(this._checkBoxer && this._checkBoxer.getLength()){
						sc.lightColor && target.css('color', sc.lightColor);
					} else {
						sc.defaultColor && target.css('color', sc.defaultColor);
					}
				}
			},
			_initEvents: function(){
				var self = this,
					trigger = this.get('trigger'),
					element = this.get('element'),
					itemName = this.get('itemName');

				trigger.on('click', function(){
					if(!self.get('menu') || !self.get('items') || !self.get('items').length)
						return;
					util.bind(self.toggle, self)();
				});
				this.get('element').on('click', clearBtnName, function(){
					self.clearAll();
				});
				this._blurHide(trigger);
				this.on('change:visible', util.bind(this._onChangeVisible, this));

				function enterHandler(e){
					self.get('visible') && hideTimer && clearTimeout(hideTimer);
				}
				function leaveHandler(e){
					if(self.get('visible')){
						hideTimer && clearTimeout(hideTimer);
						hideTimer = setTimeout(function(){
							self.hide();
						}, delay);
					}
				}
			}
		});

		function range(index, length){
			return index <= 0 ? 0 : index >= length ? length - 1 : index;
		}
		function isClick(type){
			return type === 'click';
		}
		function getNodeName(node){
			return node[0] && node[0].nodeName.toLowerCase();
		}

		return multipleSelect;
	});define('product.jpCommon', function(require, exports, module) {

	var $ = require('jquery'),
		doc = document,
		win = win;
	$.fn.extend({
		bgiframe:function(s){
			//因发现ie7也出现这个问题，所以不管什么浏览器都加上
			//if ($.browser.msie && /6.0/.test(navigator.userAgent))
			try
			{
				s = $.extend({ top: 'auto', left: 'auto', width: 'auto', height: 'auto', opacity: true, src: 'javascript:void(0);'
				}, s || {});

				var prop = function(n)
				{
					return n && n.constructor == Number ? n + 'px' : n;
				};
				var width = this.outerWidth(true);
				var height = this.outerHeight(true);
				var html = this.find('.bgiframe');
				if (html.length > 0)
				{
					html.remove();
				}
				html = '<iframe class="bgiframe" frameborder="0" tabindex="-1" src="about:blank"' + 'style="display:block;position:absolute;z-index:-1;' + (s.opacity !== false ? 'filter:Alpha(Opacity=\'0\');' : '') + 'top:' + (s.top == 'auto' ? '0px' : prop(s.top)) + ';' + 'left:' + (s.left == 'auto' ? '0px' : prop(s.left)) + ';' + 'width:' + prop(width) + ';' + 'height:' + prop(height) + ';' + ' overflow:hidden;"/>';
				this.prepend(html);
			} catch (e) { }
			return this;
		},
		textDefault: function(dclass,iclass){
			this.each(function(){
				var _this = $(this),
					_dText = _this.find(dclass || ".def-text"),
					_input = _this.find(iclass || "input[type='text']");
				_this.click(function(){
					_dText.hide();
					_input.focus();
				});
				_input.blur(function(){
					if(/^[　\s]*$/.test($(this).val())){
						_dText.show();
					}
				});
			});
		},
		backTop:function(){
			var target = $(this);
			$(win).scroll(function(){
				if ($(doc).scrollTop() > 120){
					target.find('a.backTop').css({'display':'inline-block'});
				}else{
					target.find('a.backTop').css({'display':'none'});
				}
			});
			target.find('a.backTop').click(function(){
				$('html,body').animate({ scrollTop: 0 });
			});
		},
		watermark: function(){
			var getVal = function(el){
					if (el.length == 0) return '';
					if (el[0].type.toLowerCase() == 'a' || el[0].type.toLowerCase() == 'span'){
						return el.html();
					} else {
						return el.val();
					}
				},
				txtLabel = "txtLabel",
				createLabel = function(id, txt){
					return '<label class="' + txtLabel + '" for="'+ id +'" style="display: none;">' + txt + '</label>';
				},
				status = '',
				attr = 'watermark',
				label, txt;
			var self = this;

			function toggleLabel(el, label){
				if(getVal(el) === ''){
					label.show();
				} else {
					label.hide();
				}
			}

			$.fn.resetWatermark = function(){
				$(this).each(function(){
					var _this = $(this),
						label = _this.parent().find('.' + txtLabel);
					toggleLabel(_this, label);
				});
			}

			return $(this).each(function(){
				var _this = $(this);
				if(txt = _this.attr(attr)){
					var label = _this.parent().find('.' + txtLabel);
					if(!label.length){
						label = $(createLabel(_this.attr('id'), txt)).prependTo(_this.parent());
					}
					toggleLabel(_this, label);
					_this.on('focus blur', function(e){
						var _this = $(this);

						if(e.type === 'focus'){
							label.hide();
						} else {
							toggleLabel(_this, label);
						}
					});
				}
			});
		},
		placeHolder: function(options){
			isPlaceHolder = "placeholder" in document.createElement('input');
			if(isPlaceHolder){
				$.fn.resetReplaceHolder = function(){}
				return $(this);
			}

			var getVal = function(el){
					if (el.length == 0) return '';
					if (el[0].type.toLowerCase() == 'a' || el[0].type.toLowerCase() == 'span'){
						return el.html();
					} else {
						return el.val();
					}
				},
				txtLabel = "txtLabel",
				createLabel = function(id, txt){
					return '<label class="' + txtLabel + '" for="'+ id +'" style="display: none;">' + txt + '</label>';
				},
				status = '',
				attr = 'placeHolder',
				label,
				self = this;

			function toggleLabel(el, label){
				if(getVal(el) === ''){
					label.show();
				} else {
					label.hide();
				}
			}

			$.fn.resetPlaceHolder = function(){
				$(this).each(function(){
					var _this = $(this),
						label = _this.parent().find('.' + txtLabel);
					toggleLabel(_this, label);
				});
			}

			return $(this).each(function(){
				var _this = $(this),
					txt = _this.attr(attr);
				if(txt = _this.attr(attr)){
					var label = _this.parent().find('.' + txtLabel);
					if(!label.length){
						label = $(createLabel(_this.attr('id'), txt)).prependTo(_this.parent());
					}
					toggleLabel(_this, label);
					if(!options || (options && !options.isLabelClick)){
						label.on('click', function(e){
							_this.trigger(options && options.eventType || 'focus');
						});
					}
					_this.on('focus blur click keyup', function(e){
						var _this = $(this);
						toggleLabel(_this, label);
						options && options[e.type] && options[e.type].call(null, _this, label, !!_this.val());
					});
				}
			});
		}
	});
	$.fn.bgIframe = $.fn.bgiframe;

	var zindex = 100,
		getZIndex = function() {
			return zindex++;
		};
	//照片显示插件
	$.showPhotoHD = function(node, photo, hdPhoto) {
		var el = $(node);
		var doc = $(document);
		var wnd = $(window);
		var offset = el.offset();
		var top = 0;
		var left = 0;
		var fix = 2;
		var isHd = false;
		var toTop = function(el, con) {
			top = offset.top - con.height() - fix - 3;
			left = offset.left + el.width() + fix;
			if (left + con.outerWidth() > wnd.scrollLeft() + wnd.width()) {
				left -= left + con.outerWidth() - wnd.scrollLeft() - wnd.width();
			}
			return top >= wnd.scrollTop();
		}

		var toBottom = function(el, con) {
			top = offset.top + el.height() + fix;
			left = offset.left - con.outerWidth() - fix;
			if (left < wnd.scrollLeft()) {
				left += wnd.scrollLeft() - left;
			}
			return top + con.outerHeight() <= wnd.scrollTop() + wnd.height();
		}
		//定位
		var pos = function(el, con) {
			//如果是高清照直接定位在左边
			if (isHd) {
				top = offset.top;
				//310为小图的宽度度+大图的宽度+白色的间距部分
				left = offset.left - con.outerWidth() + 310;
			} else {
				if (!toTop(el, con)) toBottom(el, con);
			}
			con.css({ top: top, left: left, 'z-index': getZIndex() });
			con.show();
			el.mouseout(function() {
				con.hide();
			});
		}

		if (hdPhoto) {
			var hdImg = $('img[src="' + hdPhoto + '"]');
			if (hdImg.length > 0) {
				isHd = true;
				pos(el, hdImg.closest('div.floatlayer_pic'));
				return;
			}
		} else {
			var norImg = $('img[src="' + photo + '"]');
			if (norImg.length > 0) {
				pos(el, norImg.closest('div.floatlayer_pic'));
				return;
			}
		}
		var src = null;
		var width = 0;
		var height = 0;
		if (hdPhoto) {
			isHd = true;
			src = hdPhoto;
			width = 180;
			height = 225;
		} else if (photo) {
			src = photo;
			width = 120;
			height = 150;
		}
		var img = $('<div class="" style="position:absolute;top:-1000px;left:-1000px;"><img width="'+width+'" height="'+height+'" src="' + src + '"/></div>');
		var div = $('<div style="position:absolute;overflow:hidden;" class="floatlayer_pic"></div>');
		div.append(img);
		div.css({ width: width + 4, height: height + 4 });
		div.appendTo('body');
		var failNotify = setTimeout(function() {
			div.addClass(isHd ? 'floatlayer_error2' : 'floatlayer_error').html('照片加载失败');
		}, 10000);
		img.find('img').load(function() {
			clearTimeout(failNotify);
			$(this).closest('div').css({ left: 0, top: 0 });
			$(this).closest('div').parent().bgIframe();
		});
		pos(el, div);
		el.mouseout(function() {
			div.hide();
		});
	}


	return $;
});// JavaScript Document
define('jpjob.jobDater', function(require, exports, module){

	var numberReg = /\d+/,
		globalDater = {};
	var $ = require('jquery'),
		v = (function() {
			// j:索引,k:id ， l:编号 m:类型，n:显示个数,o:最小年 p:最大年,q:年编号, r:月编号,s：月日对象
			var u = function(j, k, l, m, n, o, p, q, r, s,evt, noSel) {
				var t = null,
					self = this,
					_index = j,
					_keyword = k,
					_id = l,
					_input = $("#" + _id),
					_div = null,
					_type = m,
					_size = n||20,
					_min = o,
					_max = p,
					_now = p,
					_next = s,
					_identity =true,
					_event = evt,
					_isLeapYear = function(a) {
						// 瑞年判断
						if (a) {
							a = parseInt(a);
							if (a % 400 == 0 || (a % 4 == 0 && a % 100 != 0)) {
								return true;
							}
						}
						return false;
					},
					_hideAlert = function() {
						// 隐藏弹窗
						var a = $("#sp" + _keyword + "Info");
						if (a[0]) {
							a.hide();
						}
					},
					_filter = function() {
						// 过滤
						var a = 0,
							stop = 0;
						if ("y" == _type) {
							stop = _now;
							a = _now - _size + 1;
							if (3 == _index) {
								var b = $("#" + _id.replace("End", "Start")).val();
								if (b != "") {
									b = parseInt(b);
									if (b > a) {
										a = b;
										if (stop - a < _size) {
											stop = a + _size - 1;
											if (stop > _max) {
												stop = _max
											}
										}
									}
								}
							}
							var c = new Array();
							for (var i = a; i <= stop; ++i) {
								c.push('<li><a href="javascript:;">' + i + '</a></li>');
							}
							_div.find("ul").html(c.join(''));
							_div.find("ul a").click(t.onSelect)
						} else if ("d" == _type) {
							var d = 31;
							var e = _id.replace("Date", "");
							var f = $("#" + e + "Year").val();
							var g = $("#" + e + "Month").val();
							if ("4" == g || "6" == g || "9" == g || "11" == g) {
								d = 30
							} else {
								if (_isLeapYear(f)) {
									// 瑞年29天
									if ("2" == g) {
										d = 29
									}
								} else {
									if ("2" == g) {
										d = 28
									}
								}
							}
							//alert(d);
							var h = _div.find("ul");
							h.find("li:gt(27)").show();
							h.find("li:gt(" + (d - 1) + ")").hide();
						}
					},
					_arrow = function() {
						//箭头指示
						var a = _min;
						if (3 == _index) {
							var b = $("#" + _id.replace("End", "Start")).val();
							if (b != "") {
								b = parseInt(b);
								a = b
							}
						}
						//alert(_max - a < _size);
						if (_max - a < _size) {
							_div.find("[class^=box]").hide();
							return;
						} else {
							if (_now - a < _size) {
								_div.find(".pro").hide();
							} else {
								_div.find(".pro").show();
							}
							if (_now >= _max) {
								_div.find(".next").hide();
							} else {
								_div.find(".next").show();
							}
						}
					},
					_hideAll = function() {
						$('.dateDrop').hide();
					};
				this.onFocus = function(e) {
					_identity = false;
					_hideAlert();
					_hideAll();
					_filter();
					_arrow();
					_div.show();
				};
				this.onPreNext = function() {
					var a = $(this).attr("class");
					if ("pro" == a) {
						// 年的上一页，下一页
						_now -= _size;
						if (_now < _min + _size) {
							_now = _min + _size - 1
						}
					} else if ("next" == a) {
						_now += _size;
						if (_now > _max) {
							_now = _max
						}
					}
					_filter();
					_arrow();
					return this;
				};
				this.onSelect = function() {
					//选中
					_input.val($(this).text());
					self.render();
					_hideAll();
					if (_next) {
						if(!_next.is(':disabled')) {
							// 判断下一个日期输入框是否有值，如果么有，自动获取焦点，显示选择项
							if (_next.val() == ""||(parseInt(_next.val())>12&&parseInt(_next.val())<32)||!numberReg.test(_next.val())) {
								if (3 == _index) {
									_input.parent().next().show();
								}
								_next.focus();
								if(window.getSelection != null){
									range = getSelection();
									if(range.empty)
										range.empty();
									else if(range.removeAllRanges)
										range.removeAllRanges();
								}
							}
						}
					}
					if(_event) {
						_event({
							name: '.dateDrop',
							target: _input,
							next: _next
						});
					}
					return this;
				};
				this.onNowClear = function() {
					_div.hide();
					var a = _id.replace("inp", "sp").replace("Year", "");  // 当在选年的时候选择至今项时，隐藏月的控件
					var b = $(this).text();
					if ("至今" == b) {
						_input.val("至今");
						$("#" + a).hide();
						_next.val("")
					} else {
						_input.val("");
						$("#" + a).show();
						_next.val("")
					}
				};
				this.render = function(){
					if(numberReg.test(_input.val())){
						_input.css('color', '#333');
					} else {
						_input.css('color', '#ccc');
					}
				};
				this.init = function() {
					t = this;
					var a = {
						y: "year",
						m: "month",
						d: "date"
					};
					var elID = 'divsel'+ a[_type];
					var b = '<div style="display:none;" class="dateDrop dateYear" id="' + elID + '" i="' + _index + '"><ul class="yearLst">';
					var c = _min;
					var d = _max;
					if ("d" == _type) {
						b = '<div style="display:none;" class="dateDrop dateDay" id="' + elID + '" i="' + _index + '"><ul class="yearLst">';
						c = 1;
						d = 31
					} else if ("m" == _type) {
						b = '<div style="display:none;" class="dateDrop dateMon" id="' + elID + '" i="' + _index + '"><ul class="yearLst">';
						c = 1;
						d = 12
					}
					for (var i = c; i <= d && _type != "y"; ++i) {
						b += '<li><a href="javascript:;">' + i + '</a></li>';
					}
					b += '</ul>';
					if ("y" == _type) {
						b += '<div class="pro" i="' + _index + '"><a href="javascript:;"><i class="jpFntWes">&#xf053;</i></a></div><div class="next" i="' + _index + '"><a href="javascript:;"><i class="jpFntWes">&#xf054;</i></a></div>';
						if(_input.val()!=''&&_input.val()!=null) {
							var year = ((new Date()).getFullYear() <= _max) ? (new Date()).getFullYear() : _max;
							_now = parseInt(_input.val()) || year;
						}
					}
					b += '</div>';
					_input.after(b);
					_div = _input.next();
					_input.focus(this.onFocus);
					_div.find("ul a").click(this.onSelect);
					/*
					 if (3 == _index) {
					 _div.find("ul").after('<div style="height:25px; margin-bottom:2px; text-align:center;">[<a href="javascript:void(0);" class="nowclear">至今</a>][<a href="javascript:void(0);" class="nowclear">清除</a>]</div>');
					 _div.find(".nowclear").click(t.onNowClear)
					 }*/
					_div.find("div[class^=pro]").click(this.onPreNext);
					_div.find("div[class^=next]").click(this.onPreNext);
					// body click event

					$('body').click(function(e){
						// 检测发生在body中的点击事件，隐藏日历控件
						var cell = $(e.target);
						if (cell)
						{

							var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
							var inID = $(_input).attr('id');
							var isTagert = false;
							try
							{
								// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
								isTagert = (tgID != inID) && ($(cell).closest('#' + elID).length <= 0) && (tgID != elID);
							}
							catch (e){
								isTagert = false;
							}
							if (_identity && isTagert){
								var target = cell.closest('.dateDrop');
								if(_div.is(':visible') && !target.length){
									noSel && noSel({
										name: '.dateDrop',
										target: _input,
										next: _next
									});
								}
								_div.hide();
							}
							_identity = true;
						}
					});
					return this;
				}
			};
			u.update = function(id){
				if(globalDater[id]){
					$.each(globalDater[id], function(index, val){
						val.render();
					});
				}
			}
			u.bind = function(p) {
				var a = [{
					id: "StartYear",
					t: "y"
				},
					{
						id: "StartMonth",
						t: "m"
					},
					{
						id: "StartDate",
						t: "d"
					},
					{
						id: "EndYear",
						t: "y"
					},
					{
						id: "EndMonth",
						t: "m"
					},
					{
						id: "EndDate",
						t: "d"
					}];
				var b = p.dateEntry,
					c = p.id;
				if(globalDater[c] && globalDater[c].length){
					globalDater[c].splice(0, globalDater[c].length);
				}
				for (var i = 0, len = b.length; i < len; ++i) {
					var f = b[i];
					var d = "inp" + p.id + a[f].id;
					if (len < 4) {
						d = d.replace("Start", "").replace("End", "");// 编号
					}
					var e = a[f].t;  // type类型
					var g = ((i % 3 == 2) && p["onajiyear"]) ? $("#inp" + p.id + a[i - 2].id) : null;
					var h = ((i % 3 == 2) && p["onajimonth"]) ? $("#inp" + p.id + a[i - 1].id) : null;
					var j = "";
					if (i != len - 1) {
						// 不是最后一个
						j = "inp" + p.id + a[b[i + 1]].id;
						if (len < 4) {
							//  设置id
							j = j.replace("Start", "").replace("End", "")

						}
					}
					var k = (i != len - 1) ? $("#" + j) : null;
					var l = (new Date()).getFullYear();// (new Date()).getFullYear();  // 当前年
					var m = (e == "y") ? p.size: 0;  //类型年 控制显示的个数
					p.min = p.min||-50;
					p.max = p.max||0;
					var n = l + p.min + 1;  // 最小年
					var o = l + p.max;  //最大年
					globalDater[c] = globalDater[c] || [];
					globalDater[c].push(new v(f, c, d, e, m, n, o, g, h, k, p.onSelect,  p.noSelect));
					// j:索引,k:id ， l:编号 m:类型，n:显示个数,p:最大年,q:年编号, r:月编号,s：月日对象
					globalDater[c][i].render();
					globalDater[c][i].init();
				}
			};
			return u
		})();
	return v;
});/**
 *   jQuery  area.js
 *   Copyright (c)  Jon Gates
 */
define('jpjob.areaSimple', function(require, exports, module){

	var $ = require('jquery'),
		util = require('base.util'),
		area = function(element,option) {
			this.isProvince =true;
			this.level = 1;
			this.province= null;
			this.city = null;
			this.area = null;
			this.tradingarea = null;
			this.$element = null;
			this.options = null;
			this.hiddenElement = null,
				this.selectAreas = null;
			this.isGanged = true;
			this.init(element,option);
		};
	area.Default = {
		provinceStructure:['<div class="drop addFstDrop formText" style="width:100px;"><b class="jpFntWes dropIco">&#xf0d7;</b>',
			' <input type="text" class="city text textGray" value="省/直辖市" style="width:100px;" readonly />',
			'<div class="dropLst">',
			'<div class="dropLstCon">',
			'<div class="dir clearfix">',
			'<ul></ul></div><div class="lst"><ul></ul>',
			'</div></div></div></div>',
		].join(''),
		cityStructure:['<div class="drop addSndDrop formText" style="width:100px;"><b class="jpFntWes dropIco">&#xf0d7;</b>',
			' <input type="text" class="county text textGray" value="市" style="width:100px;" readonly />',
			'<div class="dropLst"><div class="dropLstCon"><ul></ul>',
			'</div></div></div>'].join(''),
		areaStructure:['<div class="drop addThrdDrop formText" style="width:100px"><b class="jpFntWes dropIco">&#xf0d7;</b>',
			' <input type="text" class="county text textGray" value="区/县"  style="width:100px;" readonly />',
			'<div class="dropLst"><div class="dropLstCon"><ul></ul>',
			'</div></div></div>'].join(''),
		tradingareaStructure:['<div class="drop addFourDrop formText"><b class="jpFntWes dropIco">&#xf0d7;</b>',
			' <input type="text" class="county text textGray" value="商圈/乡镇"  style="width:100px;" />',
			'<div class="dropLst">',
			'<div class="dropLstCon"><ul></ul>',
			'</div></div></div>'].join(''),
		space:'<span class="tipTxt">&nbsp;</span>',
		hddName:'area',
		provinceName:'province',
		cityName:'city',
		areaName:'area',
		tradingareaName:'tradingarea',
		selectArea:null,
		controlClass:null,
		municipality:['1100','1200','3100','5000'],  //直辖市编号
		provinceUrl:'/api/web/region.api?id=1',   //省／直辖市　ｕｒｌ地址
		areaUrl:'/api/web/region.api?act=path&id=',// 获取当前地区及父级地区信息url地址　　
		subAreaUrl:'/api/web/region.api?id=',     // 获取子级地区信息Url地址
		showLevel:2,
		textDesc:['省/直辖市', '市', '区/县', '商圈/乡镇'],
		tipClass:'textGray',
		onSelect:null,
		noSelect:null
	};
	area.prototype = {
		init:function(element,option) {
			this.initOptions(option);
			this.initContent(element);
			this.initEvent();
		},
		initOptions:function(option) {
			this.options = $.extend({},area.Default, option);
		},
		initContent:function(element) {
			this.$element = $(element);
			this.hiddenElement = $('<input type="hidden" id="'+this.options.hddName+'" name="'+this.options.hddName+'" />').appendTo(this.$element);
			// 省/直辖市
			var provinceElement = $(this.options.provinceStructure).appendTo(this.$element).hide();
			this.province= {id:null,span:null,div:null,pid: null,input: null,level:1,areasLen:0};
			this.province.id = this.options.provinceName;
			this.province.span = provinceElement;
			this.province.div = provinceElement.find('.dropLst');
			this.province.input = provinceElement.find('input[type="text"]');

			// 市
			$(this.options.space).appendTo(this.$element);
			var cityElement = $(this.options.cityStructure).appendTo(this.$element).hide();
			this.city = {id:null,span:null,div:null,pid: null,input: null,level:2,areasLen:0};
			this.city.id = this.options.cityName;
			this.city.span = cityElement;
			this.city.div = cityElement.find('.dropLst');
			this.city.input = cityElement.find('input[type="text"]');

			// 区/县
			$(this.options.space).appendTo(this.$element);
			this.area = {id:null,span:null,div:null,pid: null,input: null,level:3,areasLen:0};
			var areaElement = $(this.options.areaStructure).appendTo(this.$element).hide();
			this.area.id = this.options.areaName;
			this.area.span = areaElement;
			this.area.div = areaElement.find('.dropLst');
			this.area.input = areaElement.find('input[type="text"]');

			// 商圈/乡镇
			$(this.options.space).appendTo(this.$element);
			this.tradingarea = {id:null,span:null,div:null,pid: null,input: null,level:4,areasLen:0};
			var tradingareaElement = $(this.options.tradingareaStructure).appendTo(this.$element).hide();
			this.tradingarea.id = this.options.tradingareaName;
			this.tradingarea.span = tradingareaElement;
			this.tradingarea.div = tradingareaElement.find('.dropLst');
			this.tradingarea.input = tradingareaElement.find('input[type="text"]');

			if(this.options.controlClass!=null) {
				provinceElement.addClass(this.options.controlClass);
				cityElement.addClass(this.options.controlClass);
				areaElement.addClass(this.options.controlClass);
				tradingareaElement.addClass(this.options.controlClass);
			}
			// 加载省/直辖市
			var provinceUrl = this.options.provinceUrl;
			this.loadArea(provinceUrl, util.bind(this.updateProvinces, this));

			// 初始化地区信息
			if(this.options.selectArea != null){
				//  var url =this.options.areaUrl+this.options.selectArea;
				//	this.loadArea(url,this.setAreaControl.bind(this));
				this.setArea(this.options.selectArea);
			}


			this.selectAreas = ['0','0','0','0'];
			// 控制显示的级数 
			if(this.options.showLevel>=1) {
				provinceElement.show();
			}
			if(this.options.showLevel>=2) {
				cityElement.show();
			}
			if(this.options.showLevel>=3) {
				areaElement.show();
			}
			if(this.options.showLevel>=4) {
				tradingareaElement.show();
			}
		},
		initEvent:function() {
			var self  = this;
			self.province.input.bind('focus',function(){
				self.city.div.hide();
				self.area.div.hide();
				self.tradingarea.div.hide();
				self.province.div.show();
				self.province.span.css({'box-shadow':'0 0 5px #93ddec'});
			});
			self.province.div.find('ul').click(function(e){
				var target = $(e.target);
				if(target.is('a')) {
					self.level = 1;
					self.isGanged = true;
					var v = target.attr('v').split(','),
						area_id = v[0],
						area_name = v[1];
					self.province.div.hide();
					self.selectArea(area_id,area_name);
					self.province.span.css({'box-shadow':'none'});
					self.city.input.focus();
					// self.city.div.show();
					if(typeof self.options.onSelect =='function') {
						self.options.onSelect(area_name);
					}
					e.preventDefault();
				}
			});
			self.city.input.bind('focus',function(){
				self.province.div.hide();
				self.area.div.hide();
				self.tradingarea.div.hide();
				self.city.span.css({'box-shadow':'0 0 5px #93ddec'});
				if(self.city.areasLen > 0) {
					self.city.div.show();
				}
			});
			self.city.div.find('ul').click(function(e){
				var target = $(e.target);
				if(target.is('a')) {
					self.level = 2;
					self.isGanged = true;
					var v = target.attr('v').split(','),
						area_id = v[0],
						area_name = v[1];
					self.city.div.hide();
					self.selectArea(area_id,area_name);
					self.city.span.css({'box-shadow':'none'});
					self.area.input.focus();
					e.preventDefault();
				}
			});

			self.area.input.bind('focus',function(){
				self.province.div.hide();
				self.city.div.hide();
				self.tradingarea.div.hide();
				self.area.span.css({'box-shadow':'0 0 5px #93ddec'});
				if(self.area.areasLen > 0) {
					self.area.div.show();
				}
			});
			self.area.div.find('ul').click(function(e){
				var target = $(e.target);
				if(target.is('a')) {
					self.level = 3;
					self.isGanged = true;
					var v = target.attr('v').split(','),
						area_id = v[0],
						area_name = v[1];
					self.area.div.hide();
					self.selectArea(area_id,area_name);
					self.area.span.css({'box-shadow':'none'});
					self.tradingarea.input.focus();
					e.preventDefault();
				}
			});

			self.tradingarea.input.bind('focus',function(){
				self.province.div.hide();
				self.city.div.hide();
				self.area.div.hide();
				self.tradingarea.span.css({'box-shadow':'0 0 5px #93ddec'});
				if(self.tradingarea.areasLen > 0) {
					self.tradingarea.div.show();
				}
			});
			self.tradingarea.div.find('ul').click(function(e){
				var target = $(e.target);
				if(target.is('a')) {
					self.level = 4;
					self.isGanged = true;
					var v = target.attr('v').split(','),
						area_id = v[0],
						area_name = v[1];
					self.province.div.hide();
					self.tradingarea.span.css({'box-shadow':'none'});
					self.selectArea(area_id,area_name);
					e.preventDefault();
				}
			});

			$('body').click(function(e){
				// 检测发生在body中的点击事件，隐藏日历控件
				var cell = $(e.target);
				if (cell)
				{
					var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
					var inID = self.$element.attr('id');
					var isTagert = false;
					try
					{
						// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
						isTagert = tgID != inID && $(cell).closest('#' + inID).length <= 0;
					}
					catch (e)
					{
						isTagert = true;
					}
					var target = cell.closest('.drop');
					if(!target.length &&
						(self.province.div.is(':visible') || self.city.div.is(':visible') ||
						self.area.div.is(':visible') || self.tradingarea.div.is(':visible'))){
						self.options.noSelect && self.options.noSelect(inID);
					}
					if (isTagert){
						self.hidden_area();
						self.province.span.css({'box-shadow':'none'});
						self.city.span.css({'box-shadow':'none'});
						self.area.span.css({'box-shadow':'none'});
						self.tradingarea.span.css({'box-shadow':'none'});
					}
				}
			});
		},
		selectArea:function(area_id, area_name) {
			var url = this.options.subAreaUrl+area_id;
			var _self = this;
			// 根据选择的地区信息 加载下级地区信息
			if(area_id!='0') {
				if(this.level == 1) {
					this.changeCity(area_id);
					this.province.input.val(area_name).removeClass(this.options.tipClass);
					this.loadArea(url, util.bind(this.updateCity, this));
				}else if(this.level == 2) {
					this.city.input.val(area_name).removeClass(this.options.tipClass);
					this.loadArea(url, util.bind(this.updateArea, this));
				}else if(this.level == 3) {
					this.area.input.val(area_name).removeClass(this.options.tipClass);
					this.loadArea(url, util.bind(this.updateTradingarea, this));
				}else {
					this.tradingarea.input.val(area_name).removeClass(this.options.tipClass);
				}
			}else {
				if(this.level == 1) {
					this.province.input.val(area_name).removeClass(this.options.tipClass);
				}else if(this.level == 2) {
					this.city.input.val(area_name).removeClass(this.options.tipClass);
				}else if(this.level == 3) {
					this.area.input.val(area_name).removeClass(this.options.tipClass);
				}else {
					this.tradingarea.input.val(area_name).removeClass(this.options.tipClass);
				}
			}
			// 重新选择不同的地区信息时，更新控件信息
			if(this.selectAreas[this.level-1] != area_id&&this.selectAreas[this.level-1]!="0") {
				var index = this.level;
				if(1>index) {
					this.province.input.val(this.options.textDesc[0]).addClass(this.options.tipClass);
				}
				if(this.isProvince){
					if(2>index) {
						this.city.input.val(this.options.textDesc[1]).addClass(this.options.tipClass);
						this.city.areasLen = 0;
					}
					if(3>index) {
						this.area.input.val(this.options.textDesc[2]).addClass(this.options.tipClass);
						this.area.areasLen = 0;
					}
					if(4>index) {
						this.tradingarea.input.val(this.options.textDesc[3]).addClass(this.options.tipClass);
						this.tradingarea.areasLen = 0;
					}
				}else {
					if(2>index) {
						this.city.input.val(this.options.textDesc[2]).addClass(this.options.tipClass);
						this.city.areasLen = 0;
					}
					if(3>index) {
						this.area.input.val(this.options.textDesc[3]).addClass(this.options.tipClass);
						this.area.areasLen = 0;
					}
				}
			}

			// 重置了地区信息时，更新控件记录
			if(this.selectAreas[this.level-1] != area_id) {
				this.selectAreas[this.level-1] = area_id;

				// 设置hidden 值
				if(area_id=='0') {
					this.hiddenElement.val(this.selectAreas[this.level-2]);
				}else
				{
					this.hiddenElement.val(area_id);
				}
				for(var i = this.level,len = this.selectAreas.length;i<len;i+=1 ) {
					this.selectAreas[i] == '0';
				}
			}
		},
		hidden_area:function() {
			this.province.div.hide();
			this.city.div.hide();
			this.area.div.hide();
			this.tradingarea.div.hide();

		},
		loadArea:function(url,callback) {
			$.ajax({
				url: url,
				type: "get",
				dataType: "jsonp",
				async:false,
				success: function(data) {
					if(typeof callback == 'function'){
						callback(data);
					}
				},
				error:function (XMLHttpRequest, textStatus, errorThrown) {
					if(typeof callback == 'function'){
						callback([]);
					}
				}
			});
		},
		getAreaNames:function() {
			var province = this.province.input.val(),
				city = this.city.input.val(),
				area = this.area.input.val(),
				tradingarea =this.tradingarea.input.val();
			var areanames = new Array();
			if(!this.options.textDesc.contains(province)) {
				areanames.push(province);
			}
			if(!this.options.textDesc.contains(city)) {
				areanames.push(city);
			}
			if(!this.options.textDesc.contains(area)) {
				areanames.push(area);
			}
			if(!this.options.textDesc.contains(tradingarea)) {
				areanames.push(tradingarea);
			}
			return areanames;
		},
		updateProvinces:function(data) {// 省/直辖市
			var self = this;
			var municipality = new Array();
			var c =new Array();
			$.each(data,function(i,n){
				// +n.area_id+			 
				if(self.options.municipality.contains(n.area_id)) {
					municipality.push('<li><a href="#" v="'+n.area_id+','+n.area_name+'">'+n.area_name+'</a></li>');
				}else {
					c.push('<li><a href="#" v="'+n.area_id+','+n.area_name+'">'+n.area_name+'</a></li>');
				}
			});
			this.province.div.find('.dir ul').empty().html(municipality.join(''));
			this.province.div.find('.lst ul').empty().html(c.join(''));
			if((municipality.length<0&&c.length<0)||self.options.showLevel<1) {
				this.province.span.hide();
			}
			if(municipality.length>0||c.length>0||!self.isGanged||self.options.showLevel<1) {
				this.province.div.hide();
				//this.province.span.hide();				
			}
			else {
				this.province.div.show();
				this.province.span.show();
			}
		},
		updateCity:function(data) { // 更新市
			var self = this;
			var c =new Array(),
				bool = true;
			$.each(data,function(i,n){
				if(bool) {
					bool = false;
					//c.push('<li><a href="javascript:void(0)" v="0,不限">[不限]</a></li>');
				}
				c.push('<li><a href="#" v="'+n.area_id+','+n.area_name+'">'+n.area_name+'</a></li>');
			});
			self.city.areasLen = c.length;
			self.city.div.find('ul').empty().html(c.join(''));
			if(self.city.areasLen == 0||self.options.showLevel<2) {
				self.city.span.hide();
			}
			if(self.city.areasLen == 0||!self.isGanged||self.options.showLevel<2) {
				self.city.div.hide();
				//self.city.span.hide();
			}else {
				self.city.div.show();
				self.city.span.show();
			}

		},
		updateArea:function(data) { // 更新区/县
			var self = this;
			var c =new Array(),
				bool = true;
			$.each(data,function(i,n){
				if(bool) {
					bool = false;
					// c.push('<li><a href="javascript:void(0)" v="0,不限">[不限]</a></li>');
				}
				c.push('<li><a href="#" v="'+n.area_id+','+n.area_name+'">'+n.area_name+'</a></li>');
			});
			self.area.areasLen = c.length;
			self.area.div.find('ul').empty().html(c.join(''));
			if(self.area.areasLen == 0||self.options.showLevel<3) {
				self.area.span.hide();
			}
			if(self.area.areasLen == 0||!self.isGanged||self.options.showLevel<3) {
				self.area.div.hide();
				//self.area.span.hide();				
			}else {
				self.area.span.show();
				self.area.div.show();
			}
		},
		updateTradingarea:function(data) { // 更新商圈
			var self = this;
			var c =new Array(),
				bool = true;
			$.each(data,function(i,n){
				if(bool) {
					bool = false;
					//c.push('<li><a href="javascript:void(0)" v="0,不限">[不限]</a></li>');
				}
				c.push('<li><a href="#" v="'+n.area_id+','+n.area_name+'">'+n.area_name+'</a></li>');
			});
			self.tradingarea.areasLen = c.length;
			self.tradingarea.div.find('ul').empty().html(c.join(''));
			if(self.tradingarea.areasLen == 0||self.options.showLevel<4) {
				self.tradingarea.span.hide();
			}
			if(self.tradingarea.areasLen == 0||!self.isGanged||self.options.showLevel<4) {
				self.tradingarea.div.hide();
				//self.tradingarea.span.hide();				
			}else {
				self.tradingarea.span.show();
				self.tradingarea.div.show();
			}
		},
		changeCity:function(area_id) {  // 切换直辖市和省
			var self = this;
			if(self.options.municipality.contains(area_id)) {
				//直辖市
				self.isProvince = false;
				if(self.selectAreas[0] != area_id) {
					self.city.input.val(self.options.textDesc[2]).addClass(self.options.tipClass);
					self.area.input.val(self.options.textDesc[3]).addClass(self.options.tipClass);
					self.tradingarea.span.hide();
				}
			}else {
				// 省
				self.isProvince = true;
				if(self.selectAreas[0] != area_id) {
					self.city.input.val(self.options.textDesc[1]).addClass(self.options.tipClass);
					self.area.input.val(self.options.textDesc[2]).addClass(self.options.tipClass);
					if(self.options.showLevel>=4) {
						self.tradingarea.span.show();
					}
					self.tradingarea.input.val(self.options.textDesc[3]).addClass(self.options.tipClass);
				}
			}
		},
		setArea:function(areaid) {
			var url =this.options.areaUrl+areaid;
			this.loadArea(url, util.bind(this.setAreaControl, this));
		},
		setAreaControl:function(data) {
			if(data&&data.length>0) {
				var self = this,
					result = data.reverse(),
					len = result.length,
					province = result[0],
					lastArea = result[len-1];
				self.changeCity(province.area_id);
				self.selectAreas[0] = lastArea.area_id;
				self.selectAreas = ['0','0','0','0'];
				self.isGanged = false;
				if(len>=1) {
					self.level = 1 ;
					self.selectArea(result[0].area_id,result[0].area_name);
					self.province.input.val(result[0].area_name).removeClass(self.options.tipClass);
				}
				if(len>=2) {
					self.level = 2;
					self.selectArea(result[1].area_id,result[1].area_name);
					self.city.input.val(result[1].area_name).removeClass(self.options.tipClass);
				}
				if(len>=3) {
					self.level = 3;
					self.selectArea(result[2].area_id,result[2].area_name);
					self.area.input.val(result[2].area_name).removeClass(self.options.tipClass);
				}
				if(len>=4) {
					self.level = 4 ;
					self.tradingarea.input.val(result[3].area_name).removeClass(self.options.tipClass);
				}

			}
		}
	};
	var o = $.fn.singleArea;
	$.fn.singleArea = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.singlearea');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('bs.singlearea', (data = new area(this, options)));
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	};

	$.fn.setArea = function(areaid) {
		var singleArea = $(this).data('bs.singlearea');
		singleArea.setArea(areaid);
	};
	$.fn.getAreaNames = function() {
		var singleArea = $(this).data('bs.singlearea');
		return singleArea.getAreaNames();
	};
	$.fn.singleArea.Constructor = area;
	// 取消冲突
	$.fn.singleArea.noConflict = function () {
		$.fn.singleArea = o;
		return this;
	};
	return $;
});/**
 *  dialog.js
 */

define('jpjob.jobDialog', function(require, exports, module){

	var $ = require('jquery');
	var contextData = '_dialog';
	var cachedata = {};
	var arrweebox = new Array();
	var dialogID = 0;
	var getID = function() { return dialogID++; }
	var getElement = function(obj)
	{
		if ($.isPlainObject(obj)) return obj;
		if (typeof (obj) == 'string') return $(obj);
		return obj;
	}
	var zindex = 10000;
	var getZIndex = function() {
		return zindex++;
	};
	var errorHtml =
		'            	<div class="dialogError">' +
		'            		非常抱歉，数据加载失败' +
		'                </div>' +
		'               <div class="dialogErrBtn"><a class="btn1 btnsF12" onclick="$(this).closeDialog();" href="javascript:void(0)">关闭</a></div>';
	var weebox = function(opt)
	{
		this.id = '';
		this.dh = null;
		this.mh = null;
		this.dc = null;
		this.dt = null;
		this.header = null; //窗口头部，包括关闭按钮
		this.dw = null; //窗口内部装内容的部分，设置宽度时就设置这个
		this.db = null;
		this._dragging = false;
		this.cachedContent = null;
		this.options = null;
		this.contentInited = false;
		this._defaults = {
			src: null, //当弹出confirm对话框时引用的原Jquery对象，在事件函数的时候会以参数传回去
			cache: false,
			type: 'dialog', //类型 message confirm dialog model hover anchor等
			title: '',
			width: 0,
			height: 0,
			maskClass: 'dialogMask', //遮罩层的class名称
			timeout: 0,
			draggable: true,
			modal: true,    //是否模态
			focus: null,
			blur: null,
			left: 0,
			top: 0,
			position: 'center',
			anchorPosition: true, //是否始终定位在某一位置，只在某些状态下有效
			dependElement: null,
			keepHover: null, //要保持浮动窗口的节点，当点击在这些节点内时不会关闭浮动窗口
			overlay: 30,
			icon: '',
			showBackground: true,
			showBorder: true,
			showHeader: true,
			showButton: true,
			showCancel: true,
			showClose: true,
			showOk: true,
			showMask: false, //是否显示遮罩
			okBtnName: '确定',
			cancelBtnName: '取消',
			content: '',
			contentType: 'text',
			contentChange: false,
			clickClose: false,
			animate: '',
			showAnimate: '',
			hideAnimate: '',
			onclose: null, //事件
			onopen: null,
			oncancel: null,
			onok: null
			//select: { url: '', type: 'radio', tele: '', vele: '', width: 120, search: false, fn: null }
		};

		var self = this;
		//初始化选项
		this.initOptions = function()
		{
			var tempOpt = opt || {};
			tempOpt.animate = tempOpt.animate || '';
			tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
			tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
			self.options = $.extend({}, this._defaults, tempOpt);
		};

		//初始化弹窗Box
		this.initBox = function()
		{
			if (self.options.id)
			{
				self.id = self.options.id;
			} else
			{
				self.id = getID();
			}

			var html = '';
			switch (self.options.type)
			{
				case 'anchor': //定位于屏幕某一位置的窗口
					var iconFont  = ''; //字体图标
					var typeClass = ''; //字体class
					switch (self.options.icon)
					{
						case 'success':
							iconFont = '&#xf058;';
							typeClass = 'prtSuccess';
							break;
						case 'fail':
							iconFont = '&#xf057;';
							typeClass = 'prtFail';
							break;
						case 'warning':
							iconFont = '&#xf06a;';
							typeClass = 'prtWarning';
							break;
						case 'question':
							iconFont = '&#xf059;';
							typeClass = 'prtQuestion';
							break;
						case 'info':
							iconFont = '&#xf06a;';
							typeClass = 'prt prtInfo';
							break;
					}
					html = '<div class="_dialog" id="_dialog' + self.id + '">' +
						'	<div class="prt ' + typeClass + '">' +
						'    	<div class="prtCon">'+
						'    		<i class="jpFntWes">' + iconFont +'</i><span class="_dialogContent prtTxt"></span><span class="clear"></span>' +
						'    	</div>' +
						'    </div>' +
						'</div>';
					break;
				case 'message': //提示窗口
				case 'confirm': //确认窗口
					html = '<div class="_dialog dialog" id="_dialog' + self.id + '">' +
						'	<div class="dialogCon">' +
						'    <div class="dialogHead _dialogHeader"><span class="_title">系统消息</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="关闭">×</a></div> ' +
						'	<table border="0" cellspacing="0" cellpadding="0">' +
						'		<tr>' +
						'			<td class="dialog-cl"></td>' +
						'			<td>' +
						'				<div class="_container dialogContent"><div class="_dialogContent popTxt"></div>' +
						'				<div class="_dialog-button dialogBtn">' +
						'					<a href="javascript:void(0)" class="btn1 btnsF12 _dialogOk">确&nbsp;定</a>' +
						'					<a href="javascript:void(0)" class="btn3 btnsF12 _dialogCancel">取&nbsp;消</a>' +
						'				</div>' +
						'</div>' +
						'			</td>' +
						'			<td class="dialog-cr"></td>' +
						'		</tr>' +
						'	</table>' +
						'	</div>' +
						'</div>';
					break;
				case 'modal': //模式窗口
				case 'dialog': //非模式窗口
					html = '<div class="_dialog dialog" id="_dialog' + self.id + '">' +
						'<div class="dialogCon">' +
						'	<div class="dialogHead _dialogHeader"><span class="_title">系统消息</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="关闭">×</a></div> ' +
						'	<table border="0" cellspacing="0" cellpadding="0">' +
						'		<tr>' +
						'			<td class="dialog-cl"></td>' +
						'			<td>' +
						'				<div class="_container _dialogContent dialogContent"></div>' +
						'			</td>' +
						'			<td class="dialog-cr"></td>' +
						'		</tr>' +
						'	</table>' +
						'</div>' +
						'</div>';
					break;
				case 'running':
					html = '<div class="_dialog dialog" id="_dialog' + self.id + '" style="padding:0;">' +
						'<div class="dialogCon"  style="background:none;_overflow:hidden;">' +
						'	<div class="dialogHead _dialogHeader"><span class="_title">系统消息</span><a href="javascript:void(0)" class="dialogClose _dialogClose" title="关闭"></a></div> ' +
						'	<table border="0" cellspacing="0" cellpadding="0">' +
						'		<tr>' +
						'			<td class="dialog-cl"></td>' +
						'			<td>' +
						'				<div class="_container _dialogContent dialogContent" style="padding:0;overflow:inherit"></div>' +
						'			</td>' +
						'			<td class="dialog-cr"></td>' +
						'		</tr>' +
						'	</table>' +
						'</div>' +
						'</div>';
					break;
				case 'img': //图片
					html = '<div class="_dialog" id="_dialog' + self.id + '"></div>';
					break;
			}
			self.dh = $(html).appendTo('body').css({
				position: 'absolute',
				//    overflow: 'hidden',
				zIndex: getZIndex(),
				left: -10000,
				top: -10000
			});

			// 初始化样式和元素
			if (self.options.type == 'message' || self.options.type == 'confirm')
			{
				self.dh.addClass('dialogSel');
			}
			self.dc = self.find('._dialogContent');
			self.dt = self.find('._title');
			self.dw = self.find('._container');
			self.header = self.find('._dialogHeader');
			self.db = self.find('._dialogButton');

			if (self.options.boxclass)
			{
				self.dh.addClass(self.options.boxclass);
			}
			if (self.options.height > 0)
			{
				self.dc.css('height', self.options.height);
			}
			if (self.options.width > 0)
			{
				self.dw.css('width', self.options.width);
			}
			if (self.options.position == 'anchorRight')
			{
				self.dh.addClass('anchorRight');
			}
			self.dh.data(contextData, self);
		}

		//初始化遮照
		this.initMask = function()
		{
			if (self.options.showMask)
			{
				// 是否显示遮罩层
				var pos = function() {
					var h, w;
					var wnd = $(window);
					var doc = $(document);
					if (doc.height() > wnd.height())
					{
						h = doc.height() - 5; //self.bheight();
						w = doc.width() - 21;
					} else
					{
						h = doc.height() - 5; //self.bheight();
						w = doc.width() - 5;
					}
					return {height:h,width:w};
				}

				//临时用于type=modeal的遮罩层样式
				if(self.options.type == 'modal') {
					self.options.maskClass='dialogMask';
				}
				var isIE6=$.browser.msie&&($.browser.version=="6.0");
				if(isIE6)
				{
					// 解决Ie 6bug
					var a = pos();
					self.mh = $('<div id="_mask' + self.id + '" class="' + self.options.maskClass + '"></div>')
						.appendTo('body').show().css(
						{
							width: a.width,
							height: a.height,
							position:'absolute',
							zIndex: getZIndex()
						}).bgiframe();
					//.animate({opacity: 0.5},500)
					$(window).resize(function()
					{
						var a = pos();
						self.mh.css({ height: a.height, width: a.width });
					});
				}
				else
				{
					self.mh = $('<div id="_mask' + self.id + '" class="' + self.options.maskClass + '"></div>')
						.appendTo('body').show().css(
						{
							zIndex: getZIndex()
						});
					//.animate({opacity: 0.5},500)		    
				}
			}
		}
		// 设置title
		this.setTitle = function(title)
		{
			if (title == '')
			{
				self.dt.html('&nbsp;');
			} else
			{
				self.dt.html(title);
			}
		}

		//初始化弹窗内容
		this.initContent = function(content)
		{
			// 设置title 
			self.setTitle(self.options.title);
			self.dh.find("._dialogOk").val(self.options.okBtnName);
			self.dh.find("._dialogCancel").val(self.options.cancelBtnName);

			// 是否显示header
			if (!self.options.showHeader)
			{
				self.header.hide();
			}
			// 是否显示边框
			if (!self.options.showBorder)
			{
				self.dh.css({ border: 'none' });
				self.dc.css({ border: 'none' });
			}
			// 背景颜色
			if (!self.options.showBackground)
			{
				self.dh.css({ background: 'none' });
				self.dc.css({ background: 'none' });
			}
			// 显示按钮
			if (!self.options.showButton)
			{
				self.dh.find('._dialogButton').hide();
			}
			// 是否显示取消按钮
			if (!self.options.showCancel)
			{
				self.dh.find('._dialogCancel').hide();
			}
			//是否显示关闭按钮
			if (!self.options.showClose)
			{
				self.dh.find('._dialogClose').hide();
			}
			// 是否显示ok按钮
			if (!self.options.showOk)
			{
				self.dh.find("._dialogOk").hide();
			}

			//如果没有图标内容不偏移
			/*
			 if (!self.options.icon)
			 {
			 //self.dc.css({padding:0});
			 }
			 */
			if (self.options.contentType == "selector")
			{
				// 如果是选择一个元素
				var content = getElement(self.options.content).clone(true);
				content.show();
				content.css('display', 'block');
				self.setContent(content);
				self.contentInited = true;
				self.onopen();
			} else if (self.options.contentType == "ajax")
			{
				// 加载一个页面到窗口
				self.setLoading();
				//return;
				var stop = self.stopLoading;
				setTimeout(stop, 8000);
				var url = self.options.content;
				$.ajax(
					{
						url: url,
						dataType: 'html',
						isWindow: true,
						success: function(data)
						{
							self.stopLoading();
							self.setContent(data);
							self.innerShow(true);
							if (self.options.cache)
							{
								self.cachedContent = data;
							}
							self.contentInited = true;
							self.onopen();
						},
						error: function(XMLHttpRequest, textStatus, errorThrown)
						{
							self.stopLoading();
							self.setContent(errorHtml);
							self.innerShow(true);
							if (self.options.cache)
							{
								self.cachedContent = data;
							}
							self.contentInited = true;
							self.onopen();
						}
					});
			} else if (self.options.contentType == "iframe")
			{
				/*加入iframe使程序可以直接引用其它页面 by ePim*/
				var html = '<style type="text/css">';
				html += ('\n.dialog-box .dialogContent{padding:0px;}');
				html += ('\n</style>');
				html += ('<iframe class="dialogIframe" src="' + self.options.content + '" width="100%" height="100%" frameborder="0"></iframe>');
				self.setContent(html);
				self.contentInited = true;
				self.onopen();
				//self.show();
			} else if (self.options.contentType == 'img')
			{
				var html = '<div class="floatlayer_pic"><img src="' + self.options.content + '" /></div>';
				self.setContent(html);
				self.contentInited = true;
				self.onopen();
			} else
			{
				self.setContent(self.options.content);
				self.contentInited = true;
				self.onopen();
			}
		}

		//初始化弹窗事件
		this.initEvent = function()
		{
			self.dh.find("._dialogClose, ._dialogCancel, ._dialogOk")
				.unbind('click').click(function() {
					$(this).closeDialog();
					return false;
				});
			//当用户按下键盘按钮时触取消按钮
			self.dh.keydown(function(event)
			{
				var e = $.event.fix(event);
				//esc键， 等效于退出按钮
				if (e.keyCode == 27)
				{
					var cancell = self.dh.find('._dialogCancel');
					if (cancell.is(':visible'))
					{
						cancell.click();
					} else if (self.dh.find('._dialogClose').is(':visible'))
					{
						self.dh.find('._dialogClose').click();
					}
				}
			});
			self.dh.mousedown( function() { self.dh.css('z-index', getZIndex()) });
			if (self.options.onok)
			{
				self.setOnok(self.options.onok);
			}

			if (self.options.oncancel)
			{
				self.setOncancel(self.options.oncancel);
			}

			if (self.options.timeout > 0)
			{
				window.setTimeout(self.close, (self.options.timeout * 1000));
			}
			if (self.options.type == 'hover') {
				$('body').mousedown(function(event) {
					var e = $.event.fix(event);
					var src = e.target;
					var keep = false;
					if (self.dh[0] == src || $.contains(self.dh[0], src)){
						keep = true;
					}
					//如果是在模式窗口内也不关闭
					$('._dialog').each(function() {
						if ($.contains(this, src)) {
							keep = true;
						}
					});
					if (!keep && self.options.keepHover) {
						if ($.isArray(self.options.keepHover)) {
							try{
								for (var i in self.options.keepHover){
									if (typeof self.options.keepHover[i] == 'string'){
										$(self.options.keepHover[i]).each(function(){
											if (this == src || $.contains(this, src)){
												keep = true;
											}
										});
									} else{
										var el = self.options.keepHover[i][0];
										if (el == src || $.contains(el, src)){
											keep = true;
										}
									}

								}
							} catch (e) { }
						} else
						{
							try
							{
								if (typeof self.options.keepHover == 'string') {
									$(self.options.keepHover).each(function(){
										if (this == src || $.contains(this, src)){
											keep = true;
										}
									});
								} else{
									var el = self.options.keepHover[0];
									if (el == src || $.contains(el, src)){
										keep = true;
									}
								}
							} catch (e) { }
						}
					}
					if (!keep) {
						self.close();
					}
				});

				self.dh.find('tr').each(function(){
					$(this).mouseover(function() { $(this).addClass('cu'); }).mouseout(function() { $(this).removeClass('cu'); });
				});
			}
			self.drag();
		}

		//设置onok事件
		this.setOnok = function(fn)
		{
			//self.dh.find(".dialog-ok").unbind('click');
			if (typeof (fn) == "function")
			{
				var src = self.options.src;
				self.dh.find("._dialogOk").click(function() { fn(src); });
			} else if (typeof fn == 'number')
			{
				self.dh.find("._dialogOk").click(function()
				{
					window.history.go(fn);
				});
			} else if (typeof fn == 'string')
			{
				self.dh.find("._dialogOk").click(function()
				{
					window.location = fn;
				});
			}
		}
		//设置onOncancel事件
		this.setOncancel = function(fn)
		{
			//self.dh.find(".dialog-cancel").unbind('click');
			if (typeof (fn) == "function")
			{
				var src = self.options.src;
				self.dh.find("._dialogClose,._dialogCancel").click(function() { fn(src) });
			} else if (typeof (fn) == "number")
			{
				self.dh.find("._dialogClose,._dialogCancel").click(function() { window.history.go(fn); });
			} else if (typeof (fn) == "function")
			{
				self.dh.find("._dialogClose,._dialogCancel").click(function() { window.location = fn; });
			}
		}

		//打开前的回弹函数
		this.onopen = function()
		{
			if (typeof (self.options.onopen) == "function")
			{
				self.options.onopen(self);
			}
		}

		//关闭事件
		this.onclose = function()
		{
			//如果是加载的页面，清空高亮显示的行
			/*
			 if (self.options.contentType == 'ajax' && (self.options.type == 'modal' || self.options.type == 'dialog'))
			 {
			 // clearHighLight();
			 }*/
			if (typeof self.options.onclose == 'number')
			{
				window.history.go(self.options.onclose);
			} else if (typeof self.options.onclose == 'string')
			{
				setTimeout('window.location = "' + self.options.onclose + '";', 100);

			} else if (typeof (self.options.onclose) == "function")
			{
				var src = self.options.src;
				return self.options.onclose(src);
			}
		}

		//弹窗拖拽
		this.drag = function()
		{
			//取消拖动效果，因为加上了iframe后拖动不了
			return;
			if (self.options.draggable && self.options.showHeader)
			{
				var header = self.dh.find('._dialogHeader');
				header.css('cursor', 'move');
				var mouseMove = function(event)
				{
					var h = self;
					//var o = document;
					var width = h.dh.width();
					var height = h.dh.height();
					if (window.getSelection){
						window.getSelection().removeAllRanges();
					} else{
						document.selection.empty();
					}
					var left = event.clientX - h.mx; // Math.max(event.clientX - h.mx, 0);
					var top = event.clientY - h.my; //Math.max(event.clientY - h.my, 0);
					h.dh.css({ left: left, top: top });
				};
				var mouseUp = function(){
					var h = self;
					if (h.releaseCapture)
					{
						h.releaseCapture();
					}
					$(document).unbind('mousemove');
					$(document).unbind('mouseup');
				};
				var mouseDown = function(event){
					var dhleft = parseInt(self.dh.css('left').replace('px'));
					var dhtop = parseInt(self.dh.css('top').replace('px'));
					self.mx = event.clientX - dhleft; // event.clientX;
					self.my = event.clientY - dhtop; //event.clientY;
					if (self.setCapture)
					{
						self.setCapture();
					}

					$(document).mousemove(mouseMove).mouseup(mouseUp);
				};
				header.mousedown(mouseDown);
			}
		}
		//增加一个按钮
		this.addButton = function(opt){
			opt = opt || {};
			opt.title = opt.title || 'OK';
			opt.bclass = opt.bclass || 'dialog-btn1';
			opt.fn = opt.fn || null;
			opt.index = opt.index || 0;
			var btn = $('<input type="button" class="' + opt.bclass + '" value="' + opt.title + '">').click(function()
			{
				if (typeof opt.fn == "function") opt.fn(self);
			});
			if (opt.index < self.db.find('input').length)
			{
				self.db.find('input:eq(' + opt.index + ')').before(btn);
			} else
			{
				self.db.append(opt);
			}
		}
		this.hide = function(fn){
			if (typeof self.options.hideAnimate == "string")
			{
				self.dh.hide(self.options.animate, fn);
			} else
			{

				self.dh.animate(self.options.hideAnimate.animate, self.options.hideAnimate.speed, "", fn);
			}
		}
		//设置弹窗焦点
		this.focus = function()
		{/*
		 if (self.options.focus)
		 {
		 self.dh.find(self.options.focus).focus(); //TODO IE中要两次
		 self.dh.find(self.options.focus).focus();
		 } else
		 {
		 self.dh.find('._dialogCancel').focus();
		 }*/
		}
		//在弹窗内查找元素
		this.find = function(selector)
		{
			return self.dh.find(selector);
		}
		//设置加载加状态
		this.setLoading = function(){
			self.setContent('<div class="dialogLoading">加载中，请稍后</div>');
		}
		//停止加载状态
		this.stopLoading = function(){
			try
			{
				if(self.loading&&typeof self.loading != "undefined")
				{
					self.loading.remove();
				}
			} catch (e) { } finally
			{
				self.loading = null;
				return;
			}
		}

		this.setWidth = function(width){
			self.dw.width(width);
		}
		//取得标题
		this.getTitle = function()
		{
			return self.dt.html();
		}

		//设置内容
		this.setContent = function(content) {
			if (typeof content == 'string'){
				self.dc.html(content);
			} else
			{
				self.dc.append(content);
			}
			if (self.options.height > 0)
			{
				self.dc.css('height', self.options.height);
			} else
			{
				self.dc.css('height', '');
			}
			if (self.options.width > 0)
			{
				//self.dh.css('width', self.options.width);
			} else
			{
				self.dh.css('width', '');
			}
			if (self.options.showButton)
			{
				self.dh.find("._dialog-button").show();
			}
		}

		//取得内容
		this.getContent = function()
		{
			return self.dc.html();
		}

		//启用按钮
		this.disabledButton = function(btname, state)
		{
			self.dh.find('._dialog' + btname).attr("disabled", state);
		}
		//隐藏按钮
		this.hideButton = function(btname)
		{
			self.dh.find('._dialog' + btname).hide();
		}
		//显示按钮
		this.showButton = function(btname)
		{
			self.dh.find('._dialog' + btname).show();
		}
		//设置按钮标题
		this.setButtonTitle = function(btname, title)
		{
			self.dh.find('._dialog' + btname).val(title);
		}
		//操作完成
		this.next = function(opt)
		{
			opt = opt || {};
			opt.title = opt.title || self.getTitle();
			opt.content = opt.content || "";
			opt.okname = opt.okname || "确定";
			opt.width = opt.width || 260;
			opt.onok = opt.onok || self.close;
			opt.onclose = opt.onclose || null;
			opt.oncancel = opt.oncancel || null;
			opt.hideCancel = opt.hideCancel || true;
			self.setTitle(opt.title);
			self.setButtonTitle("ok", okname);
			self.setWidth(width);
			self.setOnok(opt.onok);
			if (opt.content != "") self.setContent(opt.content);
			if (opt.hideCancel) self.hideButton("cancel");
			if (typeof (opt.onclose) == "function") self.setOnclose(opt.onclose);
			if (typeof (opt.oncancel) == "function") self.setOncancel(opt.oncancel);
			self.show();
		}

		this.toggle = function()
		{
			if (self.options.id && self.dh && self.dh.length > 0)
			{
				try
				{
					var d = self; //$('#_dialog' + self.options.id).data(contextData);
					if (d.dh.is(':visible'))
					{
						d.close();
					} else
					{
						d.show();
					}
				} catch (e) { alert('toggle:' + e.message); }
			} else
			{
				if (self.dh && self.dh.length && self.dh.is(':visible'))
				{
					self.close();
				} else
				{
					self.show();
				}
			}
		}

		//显示弹窗
		this.show = function()
		{
			//关闭现有的层
			if (self.options.id)
			{
				try
				{
					//有错
					var d = $('#_dialog' + self.options.id); //.data(contextData);
					//d.close();
					if (d.size() > 0) return;
				} catch (e) { }
			}

			var dialog = self.options.id ? self : $.extend({}, self);
			dialog.initMask();
			dialog.initBox();
			dialog.initContent();
			// if (dialog.options.contentType != 'ajax')
			{
				dialog.innerShow();
			}
			return false;
		}

		this.innerShow = function(isComplete)
		{
			var dialog = self;
			dialog.initEvent();
			dialog.initPosition();
			if (dialog.mh)
			{
				dialog.mh.show();
			}
			if (dialog.options.showAnimate == "toggle" || dialog.options.showAnimate == "slide" || dialog.options.showAnimate == "fade")
			{
				switch (dialog.options.animate)
				{
					case 'toggle':
						dialog.dh.hide().show(400);
						break;
					case 'slide':
						dialog.dh.hide().slideDown(400);
						break;
					case 'fade':
						dialog.dh.hide().fadeIn(400, function()
						{
							//聚集到确定或关闭按钮
							var ok = self.dh.find('._dialogOk');
							if (ok.is(':visible'))
							{
								ok.focus();
							} else
							{
								self.dh.find('._dialogClose').focus();
							}
						});
						break;
				}
			} else if (dialog.options.showAnimate)
			{
				dialog.dh.animate(dialog.options.showAnimate.animate, dialog.options.showAnimate.speed, function()
				{
					//聚集到确定或关闭按钮
					var ok = self.dh.find('._dialogOk');
					if (ok.is(':visible'))
					{
						ok.focus();
					} else
					{
						self.dh.find('._dialogClose').focus();
					}
				});
			} else
			{
				dialog.dh.show();
				//聚集到确定或关闭按钮
				var ok = self.dh.find('._dialogOk');
				if (ok.is(':visible'))
				{
					ok.focus();
				} else
				{
					self.dh.find('._dialogClose').focus();
				}
			}
			if(self.options.showMask)self.dh.bgiframe();
		}

		//关闭弹窗
		this.close = function(n)
		{
			var result = self.onclose(result);
			if(typeof result !='undefined' && !result){
				return;
			}

			//设置关闭后的焦点
			if (self.options.blur)
			{
				$(self.options.blur).focus();
			}
			//从数组中删除
			for (i = 0; i < arrweebox.length; i++)
			{
				if (arrweebox[i].dh.get(0) == self.dh.get(0))
				{
					arrweebox.splice(i, 1);
					break;
				}
			}
			//关闭回调，用于移除对象
			var closeCallback = function()
			{
				self.dh.remove();
				if (self.mh)
				{
					/*
					 self.mh.animate({opacity:0},{complete:function()
					 {
					 self.mh.remove();
					 }});
					 */
					self.mh.remove();
				}
			};
			if (self.options.showAnimate == "toggle" || self.options.showAnimate == "slide" || self.options.showAnimate == "fade")
			{
				switch (self.options.animate)
				{
					case 'toggle':
						self.dh.hide(400, closeCallback);
						break;
					case 'slide':
						self.dh.slideUp(400, closeCallback);
						break;
					case 'fade':
						self.dh.fadeOut(400, closeCallback);
						break;
				}
			} else if (self.options.showAnimate)
			{
				self.dh.animate(self.options.showAnimate.animate, self.options.showAnimate.speed, closeCallback);
			} else
			{
				//self.dh.hide();
				closeCallback();
			}
		}
		//取得遮照高度
		this.bheight = function()
		{
			if ($.browser.msie && $.browser.version < 7)
			{
				var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
				var offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);

				if (scrollHeight < offsetHeight)
				{
					return $(window).height();
				} else
				{
					return scrollHeight;
				}
			} else
			{
				return $(document).height();
			}
		}
		//取得遮照宽度
		this.bwidth = function()
		{
			if ($.browser.msie && $.browser.version < 7)
			{
				var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
				var offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

				if (scrollWidth < offsetWidth)
				{
					return $(window).width();
				} else
				{
					return scrollWidth;
				}
			} else
			{
				return $(document).width();
			}
		}
		//初始化窗口位置
		this.initPosition = function(obj)
		{
			var src = obj || self.dh;
			if (self.options.position == 'center' || self.options.type == 'modal' || self.options.position == 'anchor' || self.options.position == 'anchorRight')//绝对定位于某个位置
			{
				self.anchorToPos(src);
				if (self.options.anchorPosition)
				{
					var anchor = function(s)
					{
						return function() { self.anchorToPos(s); };
					} (src);

					anchor = $.proxy(anchor, self);
				}
				return;
			} else {
				var depend = getElement(self.options.dependElement);
				var offset = depend.offset();
				var wnd = $(window);
				var doc = $(document);
				var left = 0, top = 0;

				var toDepend = function()
				{
					left = depend.offset().left;
					if (offset.left + self.dh.outerWidth() > doc.width())
					{
						left = doc.width() - src.outerWidth() - 10;
					}
					top = offset.top - src.outerHeight();
					if (offset.top + self.dh.outerHeight() > doc.height())
					{
						top = doc.height() - src.outerHeight() - 10;
					}
				}

				var toTop = function()
				{
					var dependTop = 0;
					if (self.options.type == 'menu' && self.options.container)
					{
						offset = depend.position();
						dependTop = depend.offset().top;
					}

					left = offset.left;
					top = offset.top - src.outerHeight();
					if (left + self.dh.outerWidth() > wnd.scrollLeft() + wnd.width()) left -= left + self.dh.outerWidth() - wnd.scrollLeft() - wnd.width()

					if (self.options.type == 'menu') top++;
					return top + dependTop >= wnd.scrollTop();
				}

				var toUnder = function()
				{
					var dependTop = 0;
					if (self.options.type == 'menu' && self.options.container)
					{
						offset = depend.position();
						//下面的修正是针对简历助手进行的调整，只有简历助手才需要相对于父容器进行定位，其它的是相对于document
						offset.top += 3;
						offset.left += 10;
						dependTop = depend.offset().top;
					}
					left = offset.left;
					top = offset.top + depend.outerHeight();
					if (self.options.type == 'menu') top--;
					return top + dependTop + self.dh.outerHeight() <= wnd.scrollTop() + wnd.height();
				}
				var toAuto = function()
				{
					try
					{
						var offset = depend.offset();
						left = offset.left + depend.outerWidth();
						top = offset.top - src.outerHeight();
					} catch (e) { }
				}

				if (self.options.position == 'depend')
				{
					toDepend();
				} else if (self.options.position == 'top')//定位于某元素上面
				{
					if (!toTop()) toUnder();
				}
				else if (self.options.position == 'under')//定位于某元素下面
				{
					if (!toUnder()) toTop();
				} else if (self.options.position == 'auto')
				{
					toAuto();
				}
			}
			src.css({ left: Math.max(left, 0), top: Math.max(top, 0) });
		}

		// 定位
		self.anchorToPos = function(obj)
		{
			var src = obj || self.dh;
			/*
			 if (!$.support.fixed)
			 {
			 top = doc.scrollTop();
			 left = doc.scrollLeft();
			 } 
			 */
			// 2013-07-25 momo 根据代码效果进行调整

			// 居中定位
			var pos = function(obj) {
				var wnd = $(window);
				var doc = $(document);
				var top = 0;
				var left = 0;
				top = doc.scrollTop();
				left = doc.scrollLeft();
				top += (wnd.height() - obj.outerHeight()) / 2;
				left += (wnd.width() - obj.outerWidth()) / 2;
				return {t:top,l:left};
			};
			var postion  = pos(src);
			src.css({left: postion.l, top: postion.t });
		}

		// 初始化参数	
		self.initOptions();
	}

	this.singleID = '';
	this._onbox = false;
	this._opening = false;
	this.zIndex = 999;
	var length = function()
	{
		return arrweebox.length;
	}

	//关闭唯一对话框
	$.fn.closeSingleDialog = function()
	{
		try
		{
			var container = $('#_dialog' + this.singleID);
			var context = container.data(contextData);
			context.close();
		} catch (e) { }
	}

	//关闭当前对话框
	$.fn.closeDialog = function()
	{
		try
		{
			var container = this.getDialog();

			var context = container.data(contextData);
			context.close();
		} catch (e) { alert(e.message); }
	}

	//获取当前对话框
	$.fn.getDialog = function()
	{
		return this.closest('._dialog');
	}

	//获取当前对话框的实例对象
	$.fn.getDialogItem = function()
	{
		var container = this.getDialog();
		return container.data(contextData);
	}

	//获取内容属性以构造dialog对象
	var getContentOption = function(content)
	{
		var contentType = 'html';
		if (/^#/.test(content))
		{
			contentType = 'selector';
		} else if (/\.(png|aspx|ashx|html|htm|asp)/i.test(content))
		{
			contentType = 'ajax';
		} else if (/\.(jpg|png|gif)$/i.test(content))
		{
			contentType = 'img';
		}
		else// if(/^(http:)|(https:)/.test(href))
		{
			contentType = 'html';
		}
		return { content: content, contentType: contentType };
	}

	//消息框
	$.message = function(msg, options)
	{
		var opt = {};
		if (typeof options == 'function' || typeof options == 'string' || typeof options == 'number')
		{
			opt.onclose = options;
		} else
		{
			opt = $.extend(opt, options);
		}
		opt.type = 'message';
		opt.position = 'center';
		opt.contentType = 'html';
		opt.showMask = opt.showMask || true;
		opt.icon = opt.icon || 'success';
		opt.content = msg;
		//opt.animate = 'fade';
		opt.title = opt.title || '系统提示';
		opt.draggable = false;
		opt.id = '_tooltip' + getID();
		opt.showCancel = false;
		//opt.animate='slow';
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//消息框
	$.fn.message = function(msg, options)
	{
		var opt = {};
		if (typeof options == 'function' || typeof options == 'string' || typeof options == 'number')
		{
			opt.onclose = options;
		} else
		{
			opt = $.extend(opt, options);
		}
		opt.type = 'message';
		opt.position = 'center';
		opt.contentType = 'html';
		opt.icon = opt.icon || 'success';
		opt.content = msg;
		opt.showMask = opt.showMask || true;
		//opt.animate = 'fade';
		opt.title = opt.title || '系统提示';
		opt.draggable = false;
		opt.id = '_tooltip' + getID();
		opt.showCancel = false;
		//opt.animate='slow';
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//确认框
	$.confirm = function(msg, title, ok, cancell)
	{
		var opt = {};
		opt.src = this;
		opt.type = 'confirm';
		opt.position = 'center';
		opt.contentType = 'html';
		opt.icon = 'question';
		opt.content = msg;
		opt.showMask = true;
		//opt.animate = 'fade';
		opt.draggable = false;
		opt.id = '_tooltip' + getID();
		//opt.okBtnName='是';
		//opt.cancelBtnName='否';
		if (typeof title == 'function')
		{
			opt.onok = title;
			opt.oncancell = ok;
		} else
		{
			opt.title = title;
			opt.onok = ok;
			opt.oncancel = cancell;
		}
		opt.title = opt.title || '系统提示';
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//确认框
	$.fn.confirm = function(msg, title, ok, cancell)
	{
		var opt = {};
		opt.src = this;
		opt.type = 'confirm';
		opt.position = 'center';
		opt.contentType = 'html';
		opt.icon = 'question';
		opt.content = msg;
		//opt.animate = 'fade';
		opt.draggable = false;
		opt.showMask = true;
		opt.id = '_tooltip' + getID();
		//opt.okBtnName='是';
		//opt.cancelBtnName='否';
		if (typeof title == 'function')
		{
			opt.onok = title;
			opt.oncancell = ok;
		} else
		{
			opt.title = title;
			opt.onok = ok;
			opt.oncancel = cancell;
		}
		opt.title = opt.title || '系统提示';
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//打开指定的url并显示对话框
	$.showDialog = function(url, options)
	{
		var opt = options || {};
		opt.content = url;
		opt.contentType = opt.contentType || 'ajax';
		//if (typeof opt.animate == 'undefined') opt.animate = 'fade';
		opt.type = opt.type || 'dialog';
		opt.position = opt.depend || 'depend';
		opt.dependElement = $($.event.fix(event).target);
		opt.showButton = opt.showButton || false;
		opt.draggable = true;
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//打开指定的url并以模式窗口显示对话框draggable
	$.showModal = function(url, options)
	{
		var opt = options || {};
		opt.content = url;
		opt.contentType = opt.contentType || 'ajax';
		//if (typeof opt.animate == 'undefined') opt.animate = 'fade';
		opt.showMask = opt.showMask || true;
		opt.type = 'modal';
		opt.showButton = opt.showButton || false;
		//opt.draggable = opt.draggable || false;
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//提供定位于屏幕的某个位置的窗口显示
	$.anchor = function(msg, options)
	{
		var opt = options || {};
		opt.type = 'anchor';
		opt.position = opt.position || 'center';
		opt.content = msg;
		//opt.animate = 'fade';
		opt.contentType = 'html';
		opt.timeout = opt.timeout || 2;
		if (typeof opt.icon == 'undefined') opt.icon = 'success';
		opt.draggable = false;
		opt.showMask = false;
		opt.id = '_anchor' + getID();
		opt.showButton = false;
		var box = new weebox(opt);
		box.show();
		return box;
	}

	//显示一个消息提示，2秒钟消失
	$.anchorMsg = function(msg, opt)
	{
		opt = opt || {};
		if (typeof opt.timeout == 'undefined') opt.timeout = 2;
		//opt.timeout = 0;
		$.anchor(msg, opt);
	}

	$.showError = function(msg)
	{
		msg = msg || '非常抱歉，数据加载失败';
		var errorHtml =
			'            	<div class="dialogError">' +
			'            		' + msg +
			'                </div>' +
			'               <div class="dialogPopBtn"></div>';

		$.showModal(errorHtml, { conentType: 'html'});
	}
	//设置按钮状态为正在运行状态
	$.fn.running = function(msg, opt)
	{
		if ($.isPlainObject(msg))
		{
			opt = msg;
			msg = null;
		}
		msg = msg || '正在处理，请稍候';
		opt = $.extend({}, opt);
		opt.type = 'dialog';
		opt.position = 'auto';
		opt.dependElement = this;
		opt.contentType = 'html';
		opt.content = '<div class="tipLoad"><div class="tipLoadTxt">' + msg + '</div></div>';
		//opt.animate = 'fade';
		opt.showHeader = false;
		opt.showBorder = false;
		opt.showBackground = false;
		opt.draggable = false;
		opt.showButton = false;
		opt.id = new Date().getTime();
		var box = new weebox(opt);
		box.show();
		this.data('running', box);
		return box;
	}

	//恢复正在运行状态的按钮为正常状态
	$.fn.stopRunning = function()
	{
		var running = this.data('running');
		try
		{
			running.close();
		} catch (e)
		{ }
	}

	return $;

});

/**
 *  jQuery  jort.js
 *  Copyright (c)  jon
 */

define('jpjob.jobsort', 'jpjob.jobDialog', function(require, exports, module){
	var $ = require('jquery'),
		dialog = require('jpjob.jobDialog');

	var jobsort = function(element,opt) {
		this.id = '';
		this.dh = null; //
		this.dc = null; // 内容       
		this.df = null; // 底部 
		this.$element = $(element),
			this.options = null; //参数信息
		this.hd = null;
		this.currLevel = 1;
		this.lastSelectItem = ['NULL','不限'];
		this._defaults ={
			url: '/api/web/jobclass.api?id=0',
			multipleUrl:'/api/web/jobclass.api?act=multiple&id=',
			allSubUrl:'/api/web/jobclass.api?id=',
			isLimit:false,
			max:5,
			tipClass:'tipClass',
			hddName:'hddName',
			inputName:'jobSortName',
			selectItems:[],
			selectClass:'cu',
			type:'multiple', // single|multiple 
			unLimitedLevel:3,
			onSelect:null
		};

		var self = this;
		//初始化选项
		this.initOptions = function(){
			var tempOpt = opt || {};
			tempOpt.animate = tempOpt.animate || '';
			tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
			tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
			self.options = $.extend({}, this._defaults, tempOpt);
		};

		this.initHtml= function(type) {
			// 初始化控件
			var html =' <span><div class="dropSet"> '+
				' <b class="jpFntWes dropIco">&#xf03a;</b>'+
				'    <input type="text" class="text JobCay">'+
				'  </div>'+
				' <div class="dropLst">'+
				' <div class="dropLstHead"><a href="javascript:void(0)" class="unlimited btn1 btnsF12">类别不限</a><p>最多可选择<em></em>项</p><a class="closeDrop" href="javascript:void(0)">×</a></div>'+
				' <div class="dropLstCon">'+
				'     <div class="lst lst1">'+
				'        <ul>'+
				'        </ul>'+
				'     </div>'+
				'    <div class="lst lst2">'+
				'    	<ul>'+
				'       </ul>'+
				'    </div>'+
				'    <div class="lst lst3">'+
				'     	<ul>'+
				'       </ul>'+
				'    </div>'+
				'    <div class="clear"></div>'+
				' </div> '+
				' </div></span>';
			self.dh =$(html).appendTo(self.$element).find('.dropLst').hide();
			self.tipElement = self.dh.find('.dropLstHead');
			self.hd =self.$element.find('.dropSet').show();
			self.hc = self.$element.find('.dropLstCon');
			self.hddElement = $('<input type="hidden" name="'+self.options.hddName+'"/>').appendTo(self.$element);
			// 是否限制
			if(self.options.isLimit){
				self.tipElement.find('.unlimited').hide();
			}

			// 加载一级类别
			var url = self.options.url;
			self.loadData(url,self.selectItem);
			if(self.isSingle()) {
				self.tipElement.find('.unlimited').hide().end().find('p').html('请选择分类；重新选择即可修改当前选项');
				// self.hd.find('.JobCay').hide();
				self.hd.find('.dropIco').html('&#xf0d7;');
				self.hd.removeClass('dropSet').addClass('dropRdSet');
			}else {
				self.tipElement.find('em').html(self.options.max);
			}
			if(self.options.selectItems.length>0) {
				var jobsorturl = self.options.multipleUrl+self.options.selectItems.join(',');
				self.options.selectItems = [];
				self.loadData(jobsorturl,self.setControl);
			}
		};

		// 初始化事件
		this.initEvent = function() {
			self.dh.find('.closeDrop').click(function() {
				self.dh.hide();
			});
			self.dh.find('.unlimited').click(function(){
				self.dh.hide();
				self.reset();
				self.hd.find('input[type="text"]').before($('<span class="seled" d="null,不限">不限<i class="delSel">×</i></span>'));
			});
			self.hd.click(function(e) {
				var target = $(e.target);
				if(target.is('.delSel')) {
					self.lastSelectItem = target.parent().attr('d').split(',');
					self.checkItem(false);
					e.stopPropagation();
					return;
				}
				self.dh.show();
			});
			// 选择一级大类
			self.dh.find('.lst1 ul').click(function(e) {
				var target = $(e.target);
				if(target.is('input')) {
				}else if(target.is('label')) {
					target = target.closest('li');
					self.currLevel = 2;
					$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
					self.lastSelectItem = $(target).attr('d').split(',');
					self.isChecked = $(target).find('input').is(':checked');
					self.isDisabled = $(target).find('input').is(':disabled');
					var url = self.options.url+self.lastSelectItem[0];
					self.loadData(url,self.selectItem);

				}
			});

			// 选择二级大类
			self.dh.find('.lst2 ul').click(function(e) {
				var target = $(e.target);
				self.lastSelectItem = $(target).closest('li').attr('d').split(',');
				if(target.is('input')) {
					self.checkItem(target.is(':checked'));
				}else if(target.is('label')) {
					target = target.closest('li');
					if(target.is('li[isParent]')) {
						var target = target.closest('li');
						var input = $(target).find('input:visible');
						if(input.length<=0) {
							return;
						}
						var disabled = $(target).find('input').is(':disabled');
						var checked = $(target).find('input').is(':checked');
						if($(target).find('input').is(':radio')&&checked) {
							return;
						}
						if(disabled) {
							return;
						}
						if(checked) {
							$(target).find('input').removeAttr('checked');
						}else {
							$(target).find('input').attr('checked','checked');
						}
						self.checkItem(!checked);
						return;
					}
					self.currLevel = 3;
					$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
					self.isChecked = $(target).find('input').is(':checked');
					self.isDisabled = $(target).find('input').is(':disabled');
					var url = self.options.url+self.lastSelectItem[0];
					self.loadData(url,self.selectItem);

				}
			});

			// 选择三级类
			self.dh.find('.lst3 ul').click(function(e) {
				var target = $(e.target);
				self.lastSelectItem = $(target).closest('li').attr('d').split(',');
				if(target.is('input')) {
					self.checkItem(target.is(':checked'));
				}else if(target.is('label')) {
					var target = target.closest('li');
					var input = $(target).find('input:visible');
					if(input.length<=0) {
						return;
					}
					var disabled = $(target).find('input').is(':disabled');
					var checked = $(target).find('input').is(':checked');
					if($(target).find('input').is(':radio')&&checked) {
						return;
					}
					if(disabled) {
						return;
					}
					if(checked) {
						$(target).find('input').removeAttr('checked');
					}else {
						$(target).find('input').attr('checked','checked');
					}
					self.checkItem(!checked);
				}
			});

			self.hc.mouseover(function(e){
				var target = $(e.target);
				if(target.is('li')){
					self.hc.find('li').removeClass('hov');
					target.addClass('hov');
				}
				else if(target.closest('li').length>0) {
					self.hc.find('li').removeClass('hov');
					target.closest('li').addClass('hov');
				}
			});

		};

		this.show =function () {
			this.initOptions();
			this.initHtml();
			this.initEvent();
		};

		// 删除项
		this.delItems = function(data) {
			$.each(data,function(i,n){
				if(self.options.selectItems.contains(n.jobsort)) {
					self.del(n.jobsort,n.jobsort_name);
				}
			});
		};

		// 删除已选项
		this.del = function(id,name) {
			self.hd.find('.seled[d="'+id+','+name+'"]').remove();
			self.options.selectItems.remove(id);
			self.hddElement.val(self.options.selectItems.join(','));
			self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');

		};
		this.add = function(id,name) {
			if(self.isSingle()) {
				self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'</span>'));
			}else {
				self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'<i class="delSel">×</i></span>'));
			}
			if(!self.options.selectItems.contains(id)) {
				self.options.selectItems.push(id);
			}
			self.hddElement.val( self.options.selectItems.join(','));
		};

		// 选择事件
		this.loadData = function(url,callback) {
			// 选择项时	
			$.ajax({
				url: url,
				type: "get",
				dataType: "jsonp",
				success: function(data) {
					if(typeof callback == 'function') {
						callback(data);
					}
				}
			});
		};

		// 单选选中
		this.checkRadio = function() {
			var id = self.lastSelectItem[0],
				name = self.lastSelectItem[1],
				url = self.options.url+ id;
			/*	 取消禁用
			 self.loadData(url,function(data){
			 $.each(data,function(i,n){
			 self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').attr('disabled','disabled');
			 });					  
			 });*/
			if(self.isExists(id)) {
				return;
			}
			// 删除之前的
			self.hd.find('.seled[d]').each(function(){
				var obj = $(this).attr('d').split(','),
					delurl = self.options.url+ obj[0];
				self.del(obj[0],obj[1]);
			});
			// 如果有子类之前有选中的，移除Inupt中的项，并删除控件中的记录		 
			self.loadData(url,self.delItems);
			// 新增当前项到inPut中 
			self.add(id,name);
			self.dh.hide();
		};

		this.checkMultiple = function() {
			var isLimit = false;
			if(self.options.selectItems.length+1>self.options.max) {
				//self.tipElement.addClass(self.options.tipClass);
				isLimit = true;
			}else {
				//self.tipElement.removeClass(self.options.tipClass);
				isLimit = false;
			}
			return isLimit;
		};

		// check项
		this.checkItem = function(isChecked) {
			var id = self.lastSelectItem[0],
				name = self.lastSelectItem[1],
				url = self.options.allSubUrl+ id,
				isSingle = self.isSingle();
			if(isChecked) {
				self.hd.find('.seled[d="null,不限"]').remove();
				if(isSingle) {
					self.checkRadio(id);
				}else {
					if(self.checkMultiple()) {
						self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
						$.anchor('最多可以选择'+self.options.max+'项',{icon:'info'});
						return;
					}
					// 选中当前类
					self.dh.find('li[d="'+id+','+name+'"]').find('input').attr('checked','checked');
					self.loadData(url,function(data){
						// 如果有子类之前有选中的，移除Inupt中的项，并删除控件中的记录	 
						self.delItems(data);
						// 如果有禁用并选中所有的子类
						$.each(data,function(i,n){
							self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').attr('checked','checked').attr('disabled','disabled');
						});
					});
					// 新增当前项到中 
					self.add(id,name);
				}
			}else {
				self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
				self.loadData(url,function(data){
					$.each(data,function(i,n){
						self.dh.find('li[d="'+n.jobsort+','+n.jobsort_name+'"]').find('input').removeAttr('checked').removeAttr('disabled');
					});
				});
				self.del(id,name);
				// self.checkMultiple();
			}
			if(typeof self.options.onSelect =='function') {
				self.options.onSelect();
			}
		};


		// 是否存在
		this.isExists = function(id) {
			return self.options.selectItems.contains(id);
		};
		// 是否单选
		this.isSingle = function(id) {
			return self.options.type=='single';
		};
		this.selectItem= function(data) {
			var arr = new Array(),
				pid = self.lastSelectItem[0],
				pname = self.lastSelectItem[1],
				isSingle = self.isSingle(),
				createItem = function(isSigle,pid,id,name,isdisabled,isChecked,isParent,isFirst,isShowControl) {
					var s = new StringBuilder();
					s.Append('<li d="'+id+','+name+'"');
					if(isFirst) {
						s.Append(' class="ths"');
					}
					if(isParent) {
						s.Append(' isParent="true"');
					}
					s.Append('>');

					if(isSigle) {
						s.Append('<input type="radio" class="rdo" name="'+self.options.inputName+'" ');
					}else {
						s.Append('<input type="checkbox"  class="chb" name="'+self.options.inputName+'" ');
					}
					if(isdisabled) {
						if(!self.isSingle()) {
							s.Append(' disabled="disabled"');
							s.Append(' checked="checked"');
						}
					}
					else if(isChecked) {
						s.Append(' checked="checked"');
					}
					if(!isShowControl) {
						s.Append(' style="display:none;"');
					}
					s.Append(' />');
					if(isParent) {
						s.Append('<label>全部('+name+')</label>');
					}else {
						s.Append('<label>'+name+'</label>');
					}
					s.Append('</li>');
					return s.toString();
				};

			//&&!isSingle	
			if(self.currLevel>=self.options.unLimitedLevel) { // 是否在子类中显示当前类  
				arr.push(createItem(isSingle,pid,pid,pname,self.isDisabled,self.isChecked,true,true,true));
			}

			if(self.currLevel == 1) {
				// 一级职位类别
				$.each(data,function(i,n){
					arr.push('<li d="'+n.jobsort+','+n.jobsort_name+'"><label>'+n.jobsort_name+'</label></li>');
				});
				self.dh.find('.lst1 ul').empty().html(arr.join(''));
			}else if(self.currLevel == 2) {
				self.dh.find('.lst2 ul').empty();
				self.dh.find('.lst3 ul').empty();
				var bool = false;
				$.each(data,function(i,n){
					bool = true;
					var item = createItem(isSingle,pid,n.jobsort,n.jobsort_name,self.isChecked,self.isExists(n.jobsort),false,false,false);
					arr.push(item);
				});
				if(bool) {
					self.dh.find('.lst2 ul').html(arr.join(''));
				}
			}else {
				self.dh.find('.lst3 ul').empty();
				var bool = false;
				$.each(data,function(i,n){
					bool = true;
					var item = createItem(isSingle,pid,n.jobsort,n.jobsort_name,self.isChecked,self.isExists(n.jobsort),false,false,true);
					arr.push(item);
				});
				if(bool) {
					self.dh.find('.lst3 ul').html(arr.join(''));
				}
			}
		};

		this.setControl = function(data) {
			$.each(data,function(i,n){
				self.lastSelectItem[0] = n.jobsort;
				self.lastSelectItem[1] = n.jobsort_name;
				//TODO:父级项是否被选中
				self.checkItem(true);
			});
		}
		this.reset = function() {
			self.options.selectItems = [ ];
			//  this.hc.find('.lst2 ul li').remove();
			//  this.hc.find('.lst3 ul li').remove();
			this.hc.find('input[type="checkbox"],input[type="radio"]').removeAttr('checked').removeAttr('disabled');
			this.hd.find('.seled').remove();
			this.$element.find('input[name="'+this.options.hddName+'"]').val(' ');
		}

		// 设置值
		this.setValue = function(items) {
			var values = items.split(','),
				newArr = new Array(),
				isSingle = self.isSingle();
			if(isSingle) {
				var jobsorturl = self.options.multipleUrl+items;
				self.loadData(jobsorturl,self.setControl);
			}else {
				for(var i =0,len = values.length;i<len;i+=1) {
					if(!self.isExists(values[i])) {
						//self.options.selectItems.push(values[i]);
						newArr.push(values[i]);
					}
				}
				if(newArr.length>0) {
					var jobsorturl = self.options.multipleUrl+newArr.join(',');
					self.loadData(jobsorturl,self.setControl);
				}
			}


		};

		// 获取数据
		this.getValue = function() {
			var v=new Array();
			this.hd.find('.seled').each(function(){
				var area = $(this).attr('d');
				v.push(area);
			});
			return v;
		};
		$('body').click(function(e){
			// 检测发生在body中的点击事件，隐藏日历控件
			var cell = $(e.target);
			if (cell)
			{
				var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
				var inID = self.$element.attr('id');
				var isTagert = false;
				try
				{
					// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
					isTagert = tgID != inID && $(cell).closest('#' + inID).length <= 0;
				}
				catch (e)
				{
					isTagert = true;
				}
				if (isTagert)
				{
					self.dh.hide();
				}
			}
		});
	};

	var old = $.fn.jobsort;

	$.fn.jobsort = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.jobsort');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('bs.jobsort', (data = new jobsort(this, options)));
				data.show();
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	}
	$.fn.setJobSortValue = function(ids) {
		var jobsort = $(this).data('bs.jobsort');
		jobsort.setValue(ids);
	};

	$.fn.getJobSortValue = function() {
		var jobsort = $(this).data('bs.jobsort');
		return jobsort.getValue();
	};

	$.fn.removeJobSortValue = function(id,name) {
		var jobsort = $(this).data('bs.jobsort');
		return jobsort.del(id,name);
	};
	$.fn.resetJobsortValue = function() {
		var jobsort = $(this).data('bs.jobsort');
		jobsort.reset();
	};

	$.fn.jobsort.Constructor = jobsort;
	// 解决冲突	
	$.fn.jobsort.noConflict = function () {
		$.fn.jobsort = old;
		return this;
	}

	return $;
});// JavaScript Document
/*
 * jQuery validation plug-in 1.5.2
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6243 2009-02-19 11:40:49Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

define('jpjob.jobValidate', function(require, exports, module){

	var $ = require('jquery');
	(function($){
		$.extend($.fn, {
			// http://docs.jquery.com/Plugins/Validation/validate
			validate: function(options)
			{

				// if nothing is selected, return nothing; can't chain anyway
				if (!this.length)
				{
					options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
					return;
				}

				// check if a validator for this form was already created
				var validator = $.data(this[0], 'validator');
				if (validator)
				{
					return validator;
				}

				validator = new $.validator(options, this[0]);
				$.data(this[0], 'validator', validator);

				if (validator.settings.onsubmit)
				{

					// allow suppresing validation by adding a cancel class to the submit button
					this.find("input, button").filter(".cancel").click(function()
					{
						validator.cancelSubmit = true;
					});

					// validate the form on submit
					this.submit(function(event)
					{
						if (validator.settings.debug)
						// prevent form submit to be able to see console output
							event.preventDefault();

						function handle()
						{
							if (validator.settings.submitHandler)
							{
								validator.settings.submitHandler.call(validator, validator.currentForm);
								return false;
							}
							return true;
						}

						// prevent submit for invalid forms or custom submit handlers
						if (validator.cancelSubmit)
						{
							validator.cancelSubmit = false;
							return handle();
						}
						if (validator.form())
						{
							if (validator.pendingRequest)
							{
								validator.formSubmitted = true;
								return false;
							}
							return handle();
						} else
						{
							validator.focusInvalid();
							return false;
						}
					});
				}

				return validator;
			},
			// http://docs.jquery.com/Plugins/Validation/valid
			valid: function()
			{
				if ($(this[0]).is('form'))
				{
					return this.validate().form();
				} else
				{
					var valid = false;
					var validator = $(this[0].form).validate();
					this.each(function()
					{
						valid |= validator.element(this);
					});
					return valid;
				}
			},
			// attributes: space seperated list of attributes to retrieve and remove
			removeAttrs: function(attributes)
			{
				var result = {},
					$element = this;
				$.each(attributes.split(/\s/), function(index, value)
				{
					result[value] = $element.attr(value);
					$element.removeAttr(value);
				});
				return result;
			},
			// http://docs.jquery.com/Plugins/Validation/rules
			rules: function(command, argument)
			{
				var element = this[0];

				if (command)
				{
					var settings = $.data(element.form, 'validator').settings;
					var staticRules = settings.rules;
					var existingRules = $.validator.staticRules(element);
					switch (command)
					{
						case "add":
							$.extend(existingRules, $.validator.normalizeRule(argument));
							staticRules[element.name] = existingRules;
							if (argument.messages)
								settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
							break;
						case "remove":
							if (!argument)
							{
								delete staticRules[element.name];
								return existingRules;
							}
							var filtered = {};
							$.each(argument.split(/\s/), function(index, method)
							{
								filtered[method] = existingRules[method];
								delete existingRules[method];
							});
							return filtered;
					}
				}

				var data = $.validator.normalizeRules(
					$.extend(
						{},
						$.validator.metadataRules(element),
						$.validator.classRules(element),
						$.validator.attributeRules(element),
						$.validator.staticRules(element)
					), element);

				// make sure required is at front
				if (data.required)
				{
					var param = data.required;
					delete data.required;
					data = $.extend({ required: param }, data);
				}
				if (data.dependTo)
				{
					var param = data.dependTo;
					delete data.dependTo;
					data = $.extend({ dependTo: param }, data);
				}

				return data;
			}
		});

		// Custom selectors
		$.extend($.expr[":"], {
			// http://docs.jquery.com/Plugins/Validation/blank
			blank: function(a) { return !$.trim(a.value); },
			// http://docs.jquery.com/Plugins/Validation/filled
			filled: function(a) { return !!$.trim(a.value); },
			// http://docs.jquery.com/Plugins/Validation/unchecked
			unchecked: function(a) { return !a.checked; }
		});


		$.format = function(source, params)
		{
			if (arguments.length == 1)
				return function()
				{
					var args = $.makeArray(arguments);
					args.unshift(source);
					return $.format.apply(this, args);
				};
			if (arguments.length > 2 && params.constructor != Array)
			{
				params = $.makeArray(arguments).slice(1);
			}
			if (params.constructor != Array)
			{
				params = [params];
			}
			$.each(params, function(i, n)
			{
				source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
			});
			return source;
		};

		// constructor for validator
		$.validator = function(options, form)
		{
			this.settings = $.extend({}, $.validator.defaults, options);
			this.currentForm = form;
			this.init();
		};

		// validator　属性　方法
		$.extend($.validator, {

			defaults: {
				messages: {},
				errorClasses:{},
				tips:{},
				tipClass:'tips',
				tipClasses:{},
				groups: {},
				rules: {},
				errorClass: "error",
				errorElement: "label",
				focusInvalid: true,
				errorContainer: $([]),
				errorLabelContainer: $([]),
				onsubmit: true,
				ignore: [],
				ignoreTitle: false,
				onfocusin: function(element)
				{
					this.lastActive = element;

					// hide error label and remove error class on focus if enabled
					if (this.settings.focusCleanup && !this.blockFocusCleanup)
					{
						this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass);
						this.errorsFor(element).css('display','none');
					}
					// show tips label on focus if enabled
					this.showTip(element);

					var rules = $(element).rules();
					for (var method in rules)
					{
						if ($(element).is('input[type=text],textarea,input[type=password]'))
						{
							$(element).addClass('focus');
						}
						break;
					}
				},
				onfocusout: function(element)
				{
					this.hideTip(element);
					if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element)))
					{
						this.element(element);
					}
					var rules = $(element).rules();

					for (var method in rules)
					{
						if ($(element).is('input[type=text],textarea,input[type=password]'))
						{
							$(element).removeClass('focus');
						}
						break;
					}
				},
				onkeyup: function(element)
				{
					if (element.name in this.submitted || element == this.lastElement)
					{
						this.element(element);
					}
				},
				onclick: function(element)
				{
					if (element.name in this.submitted)
						this.element(element);
				},
				highlight: function(element, errorClass)
				{
					$(element).addClass(errorClass);
				},
				unhighlight: function(element, errorClass)
				{
					$(element).removeClass(errorClass);
				}
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
			setDefaults: function(settings)
			{
				$.extend($.validator.defaults, settings);
			},

			messages: {
				required: "This field is required.",
				remote: "Please fix this field.",
				email: "Please enter a valid email address.",
				url: "Please enter a valid URL.",
				date: "Please enter a valid date.",
				dateISO: "Please enter a valid date (ISO).",
				dateDE: "Bitte geben Sie ein gültiges Datum ein.",
				number: "Please enter a valid number.",
				numberDE: "Bitte geben Sie eine Nummer ein.",
				digits: "Please enter only digits",
				creditcard: "Please enter a valid credit card number.",
				equalTo: "Please enter the same value again.",
				accept: "Please enter a value with a valid extension.",
				maxlength: $.format("Please enter no more than {0} characters."),
				minlength: $.format("Please enter at least {0} characters."),
				rangelength: $.format("Please enter a value between {0} and {1} characters long."),
				range: $.format("Please enter a value between {0} and {1}."),
				max: $.format("Please enter a value less than or equal to {0}."),
				min: $.format("Please enter a value greater than or equal to {0}.")
			},

			autoCreateRanges: false,

			prototype: {

				init: function()
				{
					this.labelContainer = $(this.settings.errorLabelContainer);
					this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
					this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
					this.submitted = {};
					this.valueCache = {};
					this.pendingRequest = 0;
					this.pending = {};
					this.invalid = {};
					this.reset();

					var groups = (this.groups = {});
					$.each(this.settings.groups, function(key, value)
					{
						$.each(value.split(/\s/), function(index, name)
						{
							groups[name] = key;
						});
					});
					var rules = this.settings.rules;
					$.each(rules, function(key, value)
					{
						rules[key] = $.validator.normalizeRule(value);
					});

					function delegate(event)
					{
						var validator = $.data(this[0].form, "validator");
						validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0]);
					}
					$(this.currentForm)
						.validDelegate("focusin focusout keyup", ":text, :password, :file, select, textarea", delegate)
						.validDelegate("click", ":radio, :checkbox", delegate);

					if (this.settings.invalidHandler)
						$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
				},

				// http://docs.jquery.com/Plugins/Validation/Validator/form
				form: function()
				{
					this.checkForm();
					$.extend(this.submitted, this.errorMap);
					this.invalid = $.extend({}, this.errorMap);
					if (!this.valid())
						$(this.currentForm).triggerHandler("invalid-form", [this]);
					this.showErrors();
					//自动聚集并滚动到第一个失败的位置
					this.focusInvalid();
					return this.valid();
				},
				checkForm: function()
				{
					this.prepareForm();
					for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++)
					{
						this.check(elements[i]);
					}
					return this.valid();
				},
				showTip:function(element) {
					if(this.settings.tips[element.name]){
						this.showLabel(element,this.settings.tips[element.name],this.settings.tipClasses[element.name]||this.settings.tipClass);
						this.errorsFor(element).css('display','block');
					}
				},
				hideTip:function(element) {
					if(this.settings.tips[element.name]){
						this.errorsFor(element).css('display','none');
					}
				},
				// http://docs.jquery.com/Plugins/Validation/Validator/element
				element: function(element)
				{
					element = this.clean(element);
					this.lastElement = element;
					this.prepareElement(element);
					this.currentElements = $(element);
					var result = this.check(element);
					if (result)
					{
						delete this.invalid[element.name];
					} else
					{
						this.invalid[element.name] = true;
					}
					if (!this.numberOfInvalids())
					{
						// Hide error containers on last error
						this.toHide = this.toHide.add(this.containers);
					}
					this.showErrors();
					return result;
				},

				// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
				showErrors: function(errors)
				{
					if (errors)
					{
						// add items to error list and map
						$.extend(this.errorMap, errors);
						this.errorList = [];
						for (var name in errors)
						{
							this.errorList.push({
								message: errors[name][name],
								element: this.findByName(name)[0],
								errorClass:errors[name]['errorClass']
							});
							/*
							 * this.errorList.push({
							 message: errors[name][0],
							 element: this.findByName(name)[0],
							 errorClass:errors['errorClass']
							 });
							 */
						}
						// remove items from success list
						this.successList = $.grep(this.successList, function(element)
						{
							return !(element.name in errors);
						});
					}
					this.settings.showErrors
						? this.settings.showErrors.call(this, this.errorMap, this.errorList)
						: this.defaultShowErrors();
				},

				// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
				resetForm: function()
				{
					if ($.fn.resetForm)
						$(this.currentForm).resetForm();
					this.submitted = {};
					this.prepareForm();
					this.hideErrors();
					this.elements().removeClass(this.settings.errorClass);
				},

				numberOfInvalids: function()
				{
					return this.objectLength(this.invalid);
				},

				objectLength: function(obj)
				{
					var count = 0;
					for (var i in obj)
						count++;
					return count;
				},

				hideErrors: function()
				{
					this.addWrapper(this.toHide).css('display','none');
				},

				valid: function()
				{
					return this.size() == 0;
				},

				size: function()
				{
					return this.errorList.length;
				},

				focusInvalid: function()
				{
					if (this.settings.focusInvalid)
					{
						try
						{
							//this.findLastActive() ||
							$( this.errorList.length && this.errorList[0].element || []).filter(":visible").focus();
						} catch (e)
						{
							// ignore IE throwing errors when focusing hidden elements
						}
					}
				},

				findLastActive: function()
				{
					var lastActive = this.lastActive;
					return lastActive && $.grep(this.errorList, function(n)
						{
							return n.element.name == lastActive.name;
						}).length == 1 && lastActive;
				},

				elements: function()
				{
					var validator = this,
						rulesCache = {};

					// select all valid inputs inside the form (no submit or reset buttons)
					// workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
					/* 
					 return $([]).add(this.currentForm.elements)
					 .filter(":input")
					 .not(":submit, :reset, :image, [disabled]")
					 .not(this.settings.ignore)
					 .filter(function()
					 {
					 !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this);

					 // select only the first element for each name, and only those with rules specified
					 if (this.name in rulesCache || !validator.objectLength($(this).rules()))
					 return false;

					 rulesCache[this.name] = true;
					 return true;
					 });*/
					return $(':input',this.currentForm)
						.not(":submit, :reset, :image, [disabled]")
						.not(this.settings.ignore)
						.filter(function(){
							!this.name&&validator.settings.debug&&window.console&&console.error("%o has no name assigned",this);
							if(this.name in rulesCache||!validator.objectLength($(this).rules()))
								return false;
							rulesCache[this.name]=true;
							return true;
						});
				},

				clean: function(selector)
				{
					return $(selector)[0];
				},

				errors: function()
				{
					// 2013-08-23  update  jon  
					return $(this.settings.errorElement+'[for]', this.errorContext);
					//  return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
				},

				reset: function()
				{
					this.successList = [];
					this.errorList = [];
					this.errorMap = {};
					this.toShow = $([]);
					this.toHide = $([]);
					this.formSubmitted = false;
					this.currentElements = $([]);
				},

				prepareForm: function()
				{
					this.reset();
					this.toHide = this.errors().add(this.containers);
				},

				prepareElement: function(element)
				{
					this.reset();
					this.toHide = this.errorsFor(element);
				},

				check: function(element)
				{
					element = this.clean(element);

					// if radio/checkbox, validate first element in group instead
					if (this.checkable(element))
					{
						element = this.findByName(element.name)[0];
					}

					var rules = $(element).rules();
					var dependencyMismatch = false;
					for (method in rules)
					{
						var rule = { method: method, parameters: rules[method] };
						try
						{
							var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
							//dependTo
							if (method == 'dependTo')
							{
								if (!result) return true;
							}

							// if a method indicates that the field is optional and therefore valid,
							// don't mark it as valid when there are no other rules
							if (result == "dependency-mismatch")
							{
								dependencyMismatch = true;
								continue;
							}
							dependencyMismatch = false;

							if (result == "pending")
							{
								this.toHide = this.toHide.not(this.errorsFor(element));
								return;
							}

							if (!result)
							{
								// 添加错误
								this.formatAndAdd(element, rule);
								return false;
							}
						} catch (e)
						{
							this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
								+ ", check the '" + rule.method + "' method");
							throw e;
						}
					}
					if (dependencyMismatch)
						return;
					if (this.objectLength(rules))
						this.successList.push(element);
					return true;
				},

				// return the custom message for the given element and validation method
				// specified in the element's "messages" metadata
				customMetaMessage: function(element, method)
				{
					if (!$.metadata)
						return;

					var meta = this.settings.meta
						? $(element).metadata()[this.settings.meta]
						: $(element).metadata();

					return meta && meta.messages && meta.messages[method];
				},

				// return the custom message for the given element name and validation method
				customMessage: function(name, method)
				{
					var m = this.settings.messages[name];
					return m && (m.constructor == String
							? m
							: m[method]);
				},
				// add  momo   新增自定义方法错误class
				customErrorClass:function(name,method) {
					var m = this.settings.errorClasses[name];
					return m && (typeof m[method] =='undefined'
							? this.settings.errorClass
							: m[method]);
				},
				// return the first defined argument, allowing empty strings
				findDefined: function()
				{
					for (var i = 0; i < arguments.length; i++)
					{
						if (arguments[i] !== undefined)
							return arguments[i];
					}
					return undefined;
				},

				defaultMessage: function(element, method)
				{
					return this.findDefined(
						this.customMessage(element.name, method),
						this.customMetaMessage(element, method),
						// title is never undefined, so handle empty string as undefined
						!this.settings.ignoreTitle && element.title || undefined,
						$.validator.messages[method],
						"<strong>Warning: No message defined for " + element.name + "</strong>"
					);
				},
				formatAndAdd: function(element, rule)
				{
					// add  momo 
					var errorClass = this.customErrorClass(element.name,rule.method);
					var message = this.defaultMessage(element, rule.method);
					if (typeof message == "function")
						message = message.call(this, rule.parameters, element);
					this.errorList.push({
						message: message,
						element: element,
						errorClass:errorClass
					});
					this.errorMap[element.name] = message;
					this.submitted[element.name] = message;
				},

				addWrapper: function(toToggle)
				{
					if (this.settings.wrapper)
						toToggle = toToggle.add(toToggle.parents(this.settings.wrapper));
					return toToggle;
				},

				defaultShowErrors: function()
				{
					if (this.settings.success)
					{
						for (var i = 0; this.successList[i]; i++)
						{
							this.showLabel(this.successList[i]);
						}
					}
					for (var i = 0; this.errorList[i]; i++)
					{
						var error = this.errorList[i];
						this.settings.highlight && this.settings.highlight.call(this, error.element,/*error.errorClass||*/this.settings.errorClass);
						this.showLabel(error.element, error.message,error.errorClass);
					}
					if (this.errorList.length)
					{
						this.toShow = this.toShow.add(this.containers);
					}

					if (this.settings.unhighlight)
					{
						for (var i = 0, elements = this.validElements(); elements[i]; i++)
						{
							this.settings.unhighlight.call(this, elements[i], this.settings.errorClass);
						}
					}
					this.toHide = this.toHide.not(this.toShow);
					this.hideErrors();
					this.addWrapper(this.toShow).css('display','block');
				},

				validElements: function()
				{
					return this.currentElements.not(this.invalidElements());
				},

				invalidElements: function()
				{
					return $(this.errorList).map(function()
					{
						return this.element;
					});
				},

				showLabel: function(element, message,errorClass)
				{
					var label = this.errorsFor(element);
					if (label.length)
					{
						// refresh error/success class

						label.removeClass().addClass(errorClass||this.settings.errorClass);
						// check if we have a generated label, replace the message then
						label.attr("generated") && label.html(message);
					} else
					{
						// create label
						label = $("<" + this.settings.errorElement + "/>")
							.attr({ "for": this.idOrName(element), generated: true })
							.addClass(errorClass||this.settings.errorClass)
							.html(message || "");
						if (this.settings.wrapper)
						{
							// make sure the element is visible, even in IE
							// actually showing the wrapped element is handled elsewhere
							label = label.css('display','none').css('display','block').wrap("<" + this.settings.wrapper + "/>").parent();
						}
						if (!this.labelContainer.append(label).length)
							this.settings.errorPlacement
								? this.settings.errorPlacement(label, $(element))
								: label.insertAfter(element);
					}
					if (!message && this.settings.success)
					{
						label.text("");
						typeof this.settings.success == "string"
							? label.addClass(this.settings.success)
							: this.settings.success(label);
					}
					this.toShow = this.toShow.add(label);
				},

				errorsFor: function(element)
				{
					return this.errors().filter("[for='" + this.idOrName(element) + "']");
				},

				idOrName: function(element)
				{
					return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
				},

				checkable: function(element)
				{
					return /radio|checkbox/i.test(element.type);
				},

				findByName: function(name)
				{
					// select by name and filter by form for performance over form.find("[name=...]")
					var form = this.currentForm;
					return $(document.getElementsByName(name)).map(function(index, element)
					{
						return element.form == form && element.name == name && element || null;
					});
				},

				getLength: function(value, element)
				{
					switch (element.nodeName.toLowerCase())
					{
						case 'select':
							return $("option:selected", element).length;
						case 'input':
							if (this.checkable(element))
								return this.findByName(element.name).filter(':checked').length;
					}
					return value.length;
				},

				depend: function(param, element)
				{
					return this.dependTypes[typeof param]
						? this.dependTypes[typeof param](param, element)
						: true;
				},

				dependTypes: {
					"boolean": function(param, element)
					{
						return param;
					},
					"string": function(param, element)
					{
						return !!$(param, element.form).length;
					},
					"function": function(param, element)
					{
						return param(element);
					}
				},

				optional: function(element)
				{
					return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
				},

				startRequest: function(element)
				{
					if (!this.pending[element.name])
					{
						this.pendingRequest++;
						this.pending[element.name] = true;
					}
				},

				stopRequest: function(element, valid)
				{
					this.pendingRequest--;
					// sometimes synchronization fails, make sure pendingRequest is never < 0
					if (this.pendingRequest < 0)
						this.pendingRequest = 0;
					delete this.pending[element.name];
					if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form())
					{
						$(this.currentForm).submit();
					} else if (!valid && this.pendingRequest == 0 && this.formSubmitted)
					{
						$(this.currentForm).triggerHandler("invalid-form", [this]);
					}
				},

				previousValue: function(element)
				{
					return $.data(element, "previousValue") || $.data(element, "previousValue", previous = {
							old: null,
							valid: true,
							message: this.defaultMessage(element, "remote")
						});
				}

			},

			classRuleSettings: {
				required: { required: true },
				email: { email: true },
				url: { url: true },
				date: { date: true },
				dateISO: { dateISO: true },
				dateDE: { dateDE: true },
				number: { number: true },
				numberDE: { numberDE: true },
				digits: { digits: true },
				creditcard: { creditcard: true }
			},

			addClassRules: function(className, rules)
			{
				className.constructor == String ?
					this.classRuleSettings[className] = rules :
					$.extend(this.classRuleSettings, className);
			},

			classRules: function(element)
			{
				var rules = {};
				var classes = $(element).attr('class');
				classes && $.each(classes.split(' '), function()
				{
					if (this in $.validator.classRuleSettings)
					{
						$.extend(rules, $.validator.classRuleSettings[this]);
					}
				});
				return rules;
			},

			attributeRules: function(element)
			{
				var rules = {};
				var $element = $(element);

				for (method in $.validator.methods)
				{
					var value = $element.attr(method);
					if (value)
					{
						rules[method] = value;
					}
				}

				// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
				if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength))
				{
					delete rules.maxlength;
				}

				return rules;
			},

			metadataRules: function(element)
			{
				if (!$.metadata) return {};

				var meta = $.data(element.form, 'validator').settings.meta;
				return meta ?
					$(element).metadata()[meta] :
					$(element).metadata();
			},

			staticRules: function(element)
			{
				var rules = {};
				var validator = $.data(element.form, 'validator');
				if (validator.settings.rules)
				{
					rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
				}
				return rules;
			},

			normalizeRules: function(rules, element)
			{
				// handle dependency check
				$.each(rules, function(prop, val)
				{
					// ignore rule when param is explicitly false, eg. required:false
					if (val === false)
					{
						delete rules[prop];
						return;
					}
					if (val.param || val.depends)
					{
						var keepRule = true;
						switch (typeof val.depends)
						{
							case "string":
								keepRule = !!$(val.depends, element.form).length;
								break;
							case "function":
								keepRule = val.depends.call(element, element);
								break;
						}
						if (keepRule)
						{
							rules[prop] = val.param !== undefined ? val.param : true;
						} else
						{
							delete rules[prop];
						}
					}
				});

				// evaluate parameters
				$.each(rules, function(rule, parameter)
				{
					rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
				});

				// clean number parameters
				$.each(['minlength', 'maxlength', 'min', 'max'], function()
				{
					if (rules[this])
					{
						rules[this] = Number(rules[this]);
					}
				});
				$.each(['rangelength', 'range'], function()
				{
					if (rules[this])
					{
						rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
					}
				});

				if ($.validator.autoCreateRanges)
				{
					// auto-create ranges
					if (rules.min && rules.max)
					{
						rules.range = [rules.min, rules.max];
						delete rules.min;
						delete rules.max;
					}
					if (rules.minlength && rules.maxlength)
					{
						rules.rangelength = [rules.minlength, rules.maxlength];
						delete rules.minlength;
						delete rules.maxlength;
					}
				}

				// To support custom messages in metadata ignore rule methods titled "messages"
				if (rules.messages)
				{
					delete rules.messages
				}

				return rules;
			},

			// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
			normalizeRule: function(data)
			{
				if (typeof data == "string")
				{
					var transformed = {};
					$.each(data.split(/\s/), function()
					{
						transformed[this] = true;
					});
					data = transformed;
				}
				return data;
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
			addMethod: function(name, method, message)
			{
				$.validator.methods[name] = method;
				$.validator.messages[name] = message;
				if (method.length < 3)
				{
					$.validator.addClassRules(name, $.validator.normalizeRule(name));
				}
			},

			methods: {

				// http://docs.jquery.com/Plugins/Validation/Methods/required
				required: function(value, element, param)
				{
					// check if dependency is met
					if (!this.depend(param, element))
						return "dependency-mismatch";
					switch (element.nodeName.toLowerCase())
					{
						case 'select':
							var options = $("option:selected", element);
							return options.length > 0 && (element.type == "select-multiple" || ($.browser.msie && !(options[0].attributes['value'].specified) ? options[0].text : options[0].value).length > 0);
						case 'input':
							if (this.checkable(element))
								return this.getLength(value, element) > 0;
						default:
							return $.trim(value).length > 0;
					}
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/remote
				remote: function(value, element, param)
				{
					if (this.optional(element))
						return "dependency-mismatch";

					var previous = this.previousValue(element);

					if (!this.settings.messages[element.name])
						this.settings.messages[element.name] = {};
					this.settings.messages[element.name].remote = typeof previous.message == "function" ? previous.message(value) : previous.message;

					param = typeof param == "string" && { url: param} || param;
					if (previous.old !== value)
					{
						previous.old = value;
						var validator = this;
						this.startRequest(element);
						var data = {};
						data[element.name] = value;
						$.ajax($.extend(true, {
							url: param,
							mode: "abort",
							port: "validate" + element.name,
							dataType: "json",
							data: data,
							success: function(response)
							{
								if (response)
								{
									var submitted = validator.formSubmitted;
									validator.prepareElement(element);
									validator.formSubmitted = submitted;
									validator.successList.push(element);
									validator.showErrors();
								} else
								{
									var errors = {};
									errors[element.name] = [];
									errors[element.name][element.name]= response || validator.defaultMessage(element, "remote");
									// add jon   增加远程远程是的错误样式
									errors[element.name]['errorClass'] = validator.customErrorClass(element.name, "remote");
									validator.showErrors(errors);
								}
								previous.valid = response;
								validator.stopRequest(element, response);
							}
						}, param));
						return "pending";
					} else if (this.pending[element.name])
					{
						return "pending";
					}
					return previous.valid;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/minlength
				minlength: function(value, element, param)
				{
					return this.optional(element) || this.getLength($.trim(value), element) >= param;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
				maxlength: function(value, element, param)
				{
					return this.optional(element) || this.getLength($.trim(value), element) <= param;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
				rangelength: function(value, element, param)
				{
					var length = this.getLength($.trim(value), element);
					return this.optional(element) || (length >= param[0] && length <= param[1]);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/min
				min: function(value, element, param)
				{
					return this.optional(element) || value >= param;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/max
				max: function(value, element, param)
				{
					return this.optional(element) || value <= param;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/range
				range: function(value, element, param)
				{
					return this.optional(element) || (value >= param[0] && value <= param[1]);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/email
				email: function(value, element)
				{
					// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
					// return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
					return this.optional(element) || /^[a-z0-9]([a-z0-9]*[-_.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z0-9]+([\.][a-z0-9]+)?([\.][a-z0-9]{2,3})?$/i.test(value);
				},

				//telphone 验证
				tel: function(value, element)
				{
					//return this.optional(element) || /^(\d{11})$|^(\d{5})$|^((\d{7,8}$)|(\d{4}|\d{3})-(\d{7,8}$)|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}$)|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})(-\d+)?$)$/.test(value);
					return this.optional(element) || /^.{0,30}\d{5}.{0,30}$/.test(value);
				},
				// http://docs.jquery.com/Plugins/Validation/Methods/url
				url: function(value, element)
				{
					// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
					return this.optional(element) || /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/date
				date: function(value, element)
				{
					return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
				dateISO: function(value, element)
				{
					return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/dateDE
				dateDE: function(value, element)
				{
					return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
				},

				//验证是否大于(等于)指定的表单的值 param 例： ['#minDate',true]
				greatThan: function(value, element, param)
				{
					if (this.optional(element)) return "dependency-mismatch";
					var isDate = /^\d{4}[\/-]\d{1,2}([\/-]\d{1,2})?$/.test(value);
					var otherEl = param;
					var containsEqual = false;
					if ($.isArray(param))
					{
						otherEl = param[0];
						if (param.length > 1) containsEqual = param[1];
					}
					var val = $(otherEl).val();
					if (val == '') return true;
					if (isDate)
					{
						val = val.replace(/-/g, '/');
						value = value.replace(/-/g, '/');
						if (/^\d{4}\/\d{1,2}$/.test(val)) val = val + '/01';
						if (/^\d{4}\/\d{1,2}$/.test(value)) value = value + '/01';
						var thisDate = Date.parse(value);
						var otherDate = Date.parse(val);
						if (containsEqual)
						{
							return thisDate >= otherDate;
						} else
						{
							return thisDate > otherDate;
						}
					} else
					{
						var val = $(otherEl).val();
						var thisNumber = parseFloat(value);
						var otherNumber = parseFloat(val);
						if (containsEqual)
						{
							return thisNumber >= otherNumber;
						} else
						{
							return thisNumber > otherNumber;
						}
					}
				},

				//验证是否小于(等于)指定的表单的值 param 例： ['#maxDate',true]
				smallThan: function(value, element, param)
				{
					if (this.optional(element)) return "dependency-mismatch";
					var isDate = /^\d{4}[\/-]\d{1,2}([\/-]\d{1,2})?$/.test(value);
					var otherEl = param;
					var containsEqual = false;
					if ($.isArray(param))
					{
						otherEl = param[0];
						if (param.length > 1) containsEqual = param[1];
					}

					var val = $(otherEl).val();
					if (val == '') return true;
					if (isDate)
					{
						val = val.replace(/-/g, '/');
						value = value.replace(/-/g, '/');
						if (/^\d{4}\/\d{1,2}$/.test(val)) val = val + '/01';
						if (/^\d{4}\/\d{1,2}$/.test(value)) value = value + '/01';
						var thisDate = Date.parse(value);
						var otherDate = Date.parse(val);
						if (containsEqual)
						{
							return thisDate <= otherDate;
						} else
						{
							return thisDate < otherDate;
						}
					} else
					{
						var val = $(otherEl).val();
						var thisNumber = parseFloat(value);
						var otherNumber = parseFloat(val);
						if (containsEqual)
						{
							return thisNumber <= otherNumber;
						} else
						{
							return thisNumber < otherNumber;
						}
					}
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/number
				number: function(value, element)
				{
					return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/numberDE
				numberDE: function(value, element)
				{
					return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/digits
				digits: function(value, element)
				{
					return this.optional(element) || /^\d+$/.test(value);
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
				// based on http://en.wikipedia.org/wiki/Luhn
				creditcard: function(value, element)
				{
					if (this.optional(element))
						return "dependency-mismatch";
					// accept only digits and dashes
					if (/[^0-9-]+/.test(value))
						return false;
					var nCheck = 0,
						nDigit = 0,
						bEven = false;

					value = value.replace(/\D/g, "");

					for (n = value.length - 1; n >= 0; n--)
					{
						var cDigit = value.charAt(n);
						var nDigit = parseInt(cDigit, 10);
						if (bEven)
						{
							if ((nDigit *= 2) > 9)
								nDigit -= 9;
						}
						nCheck += nDigit;
						bEven = !bEven;
					}

					return (nCheck % 10) == 0;
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/accept
				accept: function(value, element, param)
				{
					param = typeof param == "string" ? param : "png|jpe?g|gif";
					return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
				},

				// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
				equalTo: function(value, element, param)
				{
					return value == $(param).val();
				},
				bigTo: function(value, element, param)
				{
					return value >= $(param).val();
				},
				//依赖于某个元素的值
				dependTo: function(value, element, param)
				{
					var el = null;
					var val = true;
					var not = false; //是否取反，表示当值不等于指定的值时才验证
					if ($.isArray(param))
					{
						if (param.length <= 0) return false;
						el = param[0];
						if (param.length > 1) val = param[1];
						if (param.length > 2) not = (param[2] == 'not');
					} else
					{
						var temp = param.split('|');
						if (temp.length <= 0) return false;
						el = temp[0];
						if (temp.length > 1)
						{
							val = temp[1];
							if (val == 'true' || val == 'True')
							{
								val = true;
							} else if (val == 'false' || val == 'False')
							{
								val = false;
							}
						}
						if (temp.length > 2) not = (temp[2] == 'not');
					}
					var jel = $(el);

					if (jel.length > 0)
					{
						var e = jel[0];
						if (e.type == 'checkbox' || e.type == 'radio')
						{
							result = jel.attr('checked') == val;
						} else
						{
							result = jel.val() == val;
						}
					}
					if (not) result = !result;
					return result;
				},
				//判断是否匹配于指定的正则表达式
				match: function(value, element, param)
				{
					if (this.optional(element)) return "dependency-mismatch";
					var reg = param;
					if (typeof param == 'string')
					{
						reg = new RegExp(param);
					}
					return reg.test(value);
				}

			}

		});

	})($);

	// ajax mode: abort
	// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
	// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort() 
	; (function($)
	{
		var ajax = $.ajax;
		var pendingRequests = {};
		$.ajax = function(settings)
		{
			// create settings for compatibility with ajaxSetup
			settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
			var port = settings.port;
			if (settings.mode == "abort")
			{
				if (pendingRequests[port])
				{
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	})($);

	// provides cross-browser focusin and focusout events
	// IE has native support, in other browsers, use event caputuring (neither bubbles)

	// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
	// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target 

	// provides triggerEvent(type: String, target: Element) to trigger delegated events
	; (function($)
	{
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function(original, fix)
		{

			$.event.special[fix] = {
				setup: function()
				{
					if ($.browser.msie) return false;
					this.addEventListener(original, $.event.special[fix].handler, true);
				},
				teardown: function()
				{
					if ($.browser.msie) return false;
					this.removeEventListener(original,
						$.event.special[fix].handler, true);
				},
				handler: function(e)
				{
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
		});
		$.extend($.fn, {
			validDelegate: function(type, delegate, handler)
			{
				return this.bind(type, function(event)
				{
					var target = $(event.target);
					if (target.is(delegate))
					{
						return handler.apply(target, arguments);
					}
				});
			},
			triggerEvent: function(type, target)
			{
				return this.triggerHandler(type, [$.event.fix({ type: type, target: target })]);
			}
		})
	})($);

	return $;
});
/*!
 * jQuery Form Plugin
 * version: 3.50.0-2014.02.05
 * Requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
/*global ActiveXObject */

// AMD support
(function (factory) {
	"use strict";
	/*
	 if (typeof define === 'function' && define.amd) {
	 // using AMD; register as anon module
	 define(['jquery'], factory);
	 } */
	if (typeof define === 'function'){
		define('jpjob.jobForm', factory);
	} else {
		// no AMD; invoke directly
		factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
	}
}

//(function($) {
(function(require, exports, module){
	"use strict";

	var $ = require('jquery');

	/*
	 Usage Note:
	 -----------
	 Do not use both ajaxSubmit and ajaxForm on the same form.  These
	 functions are mutually exclusive.  Use ajaxSubmit if you want
	 to bind your own submit handler to the form.  For example,

	 $(document).ready(function() {
	 $('#myForm').on('submit', function(e) {
	 e.preventDefault(); // <-- important
	 $(this).ajaxSubmit({
	 target: '#output'
	 });
	 });
	 });

	 Use ajaxForm when you want the plugin to manage all the event binding
	 for you.  For example,

	 $(document).ready(function() {
	 $('#myForm').ajaxForm({
	 target: '#output'
	 });
	 });

	 You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
	 form does not have to exist when you invoke ajaxForm:

	 $('#myForm').ajaxForm({
	 delegation: true,
	 target: '#output'
	 });

	 When using ajaxForm, the ajaxSubmit function will be invoked for you
	 at the appropriate time.
	 */

	/**
	 * Feature detection
	 */
	var feature = {};
	feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
	feature.formdata = window.FormData !== undefined;

	var hasProp = !!$.fn.prop;

// attr2 uses prop when it can but checks the return type for
// an expected string.  this accounts for the case where a form 
// contains inputs with names like "action" or "method"; in those
// cases "prop" returns the element
	$.fn.attr2 = function() {
		if ( ! hasProp ) {
			return this.attr.apply(this, arguments);
		}
		var val = this.prop.apply(this, arguments);
		if ( ( val && val.jquery ) || typeof val === 'string' ) {
			return val;
		}
		return this.attr.apply(this, arguments);
	};

	/**
	 * ajaxSubmit() provides a mechanism for immediately submitting
	 * an HTML form using AJAX.
	 */
	$.fn.ajaxSubmit = function(options) {
		/*jshint scripturl:true */

		// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
		if (!this.length) {
			log('ajaxSubmit: skipping submit process - no element selected');
			return this;
		}

		var method, action, url, $form = this;

		if (typeof options == 'function') {
			options = { success: options };
		}
		else if ( options === undefined ) {
			options = {};
		}

		method = options.type || this.attr2('method');
		action = options.url  || this.attr2('action');

		url = (typeof action === 'string') ? $.trim(action) : '';
		url = url || window.location.href || '';
		if (url) {
			// clean url (don't include hash vaue)
			url = (url.match(/^([^#]+)/)||[])[1];
		}

		options = $.extend(true, {
			url:  url,
			success: $.ajaxSettings.success,
			type: method || $.ajaxSettings.type,
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
		}, options);

		// hook for manipulating the form data before it is extracted;
		// convenient for use with rich editors like tinyMCE or FCKEditor
		var veto = {};
		this.trigger('form-pre-serialize', [this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
			return this;
		}

		// provide opportunity to alter form data before it is serialized
		if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSerialize callback');
			return this;
		}

		var traditional = options.traditional;
		if ( traditional === undefined ) {
			traditional = $.ajaxSettings.traditional;
		}

		var elements = [];
		var qx, a = this.formToArray(options.semantic, elements);
		if (options.data) {
			options.extraData = options.data;
			qx = $.param(options.data, traditional);
		}

		// give pre-submit callback an opportunity to abort the submit
		if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSubmit callback');
			return this;
		}

		// fire vetoable 'validate' event
		this.trigger('form-submit-validate', [a, this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
			return this;
		}

		var q = $.param(a, traditional);
		if (qx) {
			q = ( q ? (q + '&' + qx) : qx );
		}
		if (options.type.toUpperCase() == 'GET') {
			options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
			options.data = null;  // data is null for 'get'
		}
		else {
			options.data = q; // data is the query string for 'post'
		}

		var callbacks = [];
		if (options.resetForm) {
			callbacks.push(function() { $form.resetForm(); });
		}
		if (options.clearForm) {
			callbacks.push(function() { $form.clearForm(options.includeHidden); });
		}

		// perform a load on the target only if dataType is not provided
		if (!options.dataType && options.target) {
			var oldSuccess = options.success || function(){};
			callbacks.push(function(data) {
				var fn = options.replaceTarget ? 'replaceWith' : 'html';
				$(options.target)[fn](data).each(oldSuccess, arguments);
			});
		}
		else if (options.success) {
			callbacks.push(options.success);
		}

		options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
			var context = options.context || this ;    // jQuery 1.4+ supports scope context
			for (var i=0, max=callbacks.length; i < max; i++) {
				callbacks[i].apply(context, [data, status, xhr || $form, $form]);
			}
		};

		if (options.error) {
			var oldError = options.error;
			options.error = function(xhr, status, error) {
				var context = options.context || this;
				oldError.apply(context, [xhr, status, error, $form]);
			};
		}

		if (options.complete) {
			var oldComplete = options.complete;
			options.complete = function(xhr, status) {
				var context = options.context || this;
				oldComplete.apply(context, [xhr, status, $form]);
			};
		}

		// are there files to upload?

		// [value] (issue #113), also see comment:
		// https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
		var fileInputs = $('input[type=file]:enabled', this).filter(function() { return $(this).val() !== ''; });

		var hasFileInputs = fileInputs.length > 0;
		var mp = 'multipart/form-data';
		var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

		var fileAPI = feature.fileapi && feature.formdata;
		log("fileAPI :" + fileAPI);
		var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

		var jqxhr;

		// options.iframe allows user to force iframe mode
		// 06-NOV-09: now defaulting to iframe mode if file input is detected
		if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
			// hack to fix Safari hang (thanks to Tim Molendijk for this)
			// see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
			if (options.closeKeepAlive) {
				$.get(options.closeKeepAlive, function() {
					jqxhr = fileUploadIframe(a);
				});
			}
			else {
				jqxhr = fileUploadIframe(a);
			}
		}
		else if ((hasFileInputs || multipart) && fileAPI) {
			jqxhr = fileUploadXhr(a);
		}
		else {
			jqxhr = $.ajax(options);
		}

		$form.removeData('jqxhr').data('jqxhr', jqxhr);

		// clear element array
		for (var k=0; k < elements.length; k++) {
			elements[k] = null;
		}

		// fire 'notify' event
		this.trigger('form-submit-notify', [this, options]);
		return this;

		// utility fn for deep serialization
		function deepSerialize(extraData){
			var serialized = $.param(extraData, options.traditional).split('&');
			var len = serialized.length;
			var result = [];
			var i, part;
			for (i=0; i < len; i++) {
				// #252; undo param space replacement
				serialized[i] = serialized[i].replace(/\+/g,' ');
				part = serialized[i].split('=');
				// #278; use array instead of object storage, favoring array serializations
				result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
			}
			return result;
		}

		// XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
		function fileUploadXhr(a) {
			var formdata = new FormData();

			for (var i=0; i < a.length; i++) {
				formdata.append(a[i].name, a[i].value);
			}

			if (options.extraData) {
				var serializedData = deepSerialize(options.extraData);
				for (i=0; i < serializedData.length; i++) {
					if (serializedData[i]) {
						formdata.append(serializedData[i][0], serializedData[i][1]);
					}
				}
			}

			options.data = null;

			var s = $.extend(true, {}, $.ajaxSettings, options, {
				contentType: false,
				processData: false,
				cache: false,
				type: method || 'POST'
			});

			if (options.uploadProgress) {
				// workaround because jqXHR does not expose upload property
				s.xhr = function() {
					var xhr = $.ajaxSettings.xhr();
					if (xhr.upload) {
						xhr.upload.addEventListener('progress', function(event) {
							var percent = 0;
							var position = event.loaded || event.position; /*event.position is deprecated*/
							var total = event.total;
							if (event.lengthComputable) {
								percent = Math.ceil(position / total * 100);
							}
							options.uploadProgress(event, position, total, percent);
						}, false);
					}
					return xhr;
				};
			}

			s.data = null;
			var beforeSend = s.beforeSend;
			s.beforeSend = function(xhr, o) {
				//Send FormData() provided by user
				if (options.formData) {
					o.data = options.formData;
				}
				else {
					o.data = formdata;
				}
				if(beforeSend) {
					beforeSend.call(this, xhr, o);
				}
			};
			return $.ajax(s);
		}

		// private function for handling file uploads (hat tip to YAHOO!)
		function fileUploadIframe(a) {
			var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
			var deferred = $.Deferred();

			// #341
			deferred.abort = function(status) {
				xhr.abort(status);
			};

			if (a) {
				// ensure that every serialized input is still enabled
				for (i=0; i < elements.length; i++) {
					el = $(elements[i]);
					if ( hasProp ) {
						el.prop('disabled', false);
					}
					else {
						el.removeAttr('disabled');
					}
				}
			}

			s = $.extend(true, {}, $.ajaxSettings, options);
			s.context = s.context || s;
			id = 'jqFormIO' + (new Date().getTime());
			if (s.iframeTarget) {
				$io = $(s.iframeTarget);
				n = $io.attr2('name');
				if (!n) {
					$io.attr2('name', id);
				}
				else {
					id = n;
				}
			}
			else {
				$io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
				$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
			}
			io = $io[0];


			xhr = { // mock object
				aborted: 0,
				responseText: null,
				responseXML: null,
				status: 0,
				statusText: 'n/a',
				getAllResponseHeaders: function() {},
				getResponseHeader: function() {},
				setRequestHeader: function() {},
				abort: function(status) {
					var e = (status === 'timeout' ? 'timeout' : 'aborted');
					log('aborting upload... ' + e);
					this.aborted = 1;

					try { // #214, #257
						if (io.contentWindow.document.execCommand) {
							io.contentWindow.document.execCommand('Stop');
						}
					}
					catch(ignore) {}

					$io.attr('src', s.iframeSrc); // abort op in progress
					xhr.error = e;
					if (s.error) {
						s.error.call(s.context, xhr, e, status);
					}
					if (g) {
						$.event.trigger("ajaxError", [xhr, s, e]);
					}
					if (s.complete) {
						s.complete.call(s.context, xhr, e);
					}
				}
			};

			g = s.global;
			// trigger ajax global events so that activity/block indicators work like normal
			if (g && 0 === $.active++) {
				$.event.trigger("ajaxStart");
			}
			if (g) {
				$.event.trigger("ajaxSend", [xhr, s]);
			}

			if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
				if (s.global) {
					$.active--;
				}
				deferred.reject();
				return deferred;
			}
			if (xhr.aborted) {
				deferred.reject();
				return deferred;
			}

			// add submitting element to data if we know it
			sub = form.clk;
			if (sub) {
				n = sub.name;
				if (n && !sub.disabled) {
					s.extraData = s.extraData || {};
					s.extraData[n] = sub.value;
					if (sub.type == "image") {
						s.extraData[n+'.x'] = form.clk_x;
						s.extraData[n+'.y'] = form.clk_y;
					}
				}
			}

			var CLIENT_TIMEOUT_ABORT = 1;
			var SERVER_ABORT = 2;

			function getDoc(frame) {
				/* it looks like contentWindow or contentDocument do not
				 * carry the protocol property in ie8, when running under ssl
				 * frame.document is the only valid response document, since
				 * the protocol is know but not on the other two objects. strange?
				 * "Same origin policy" http://en.wikipedia.org/wiki/Same_origin_policy
				 */

				var doc = null;

				// IE8 cascading access check
				try {
					if (frame.contentWindow) {
						doc = frame.contentWindow.document;
					}
				} catch(err) {
					// IE8 access denied under ssl & missing protocol
					log('cannot get iframe.contentWindow document: ' + err);
				}

				if (doc) { // successful getting content
					return doc;
				}

				try { // simply checking may throw in ie8 under ssl or mismatched protocol
					doc = frame.contentDocument ? frame.contentDocument : frame.document;
				} catch(err) {
					// last attempt
					log('cannot get iframe.contentDocument: ' + err);
					doc = frame.document;
				}
				return doc;
			}

			// Rails CSRF hack (thanks to Yvan Barthelemy)
			var csrf_token = $('meta[name=csrf-token]').attr('content');
			var csrf_param = $('meta[name=csrf-param]').attr('content');
			if (csrf_param && csrf_token) {
				s.extraData = s.extraData || {};
				s.extraData[csrf_param] = csrf_token;
			}

			// take a breath so that pending repaints get some cpu time before the upload starts
			function doSubmit() {
				// make sure form attrs are set
				var t = $form.attr2('target'),
					a = $form.attr2('action'),
					mp = 'multipart/form-data',
					et = $form.attr('enctype') || $form.attr('encoding') || mp;

				// update form attrs in IE friendly way
				form.setAttribute('target',id);
				if (!method || /post/i.test(method) ) {
					form.setAttribute('method', 'POST');
				}
				if (a != s.url) {
					form.setAttribute('action', s.url);
				}

				// ie borks in some cases when setting encoding
				if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
					$form.attr({
						encoding: 'multipart/form-data',
						enctype:  'multipart/form-data'
					});
				}

				// support timout
				if (s.timeout) {
					timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
				}

				// look for server aborts
				function checkState() {
					try {
						var state = getDoc(io).readyState;
						log('state = ' + state);
						if (state && state.toLowerCase() == 'uninitialized') {
							setTimeout(checkState,50);
						}
					}
					catch(e) {
						log('Server abort: ' , e, ' (', e.name, ')');
						cb(SERVER_ABORT);
						if (timeoutHandle) {
							clearTimeout(timeoutHandle);
						}
						timeoutHandle = undefined;
					}
				}

				// add "extra" data to form if provided in options
				var extraInputs = [];
				try {
					if (s.extraData) {
						for (var n in s.extraData) {
							if (s.extraData.hasOwnProperty(n)) {
								// if using the $.param format that allows for multiple values with the same name
								if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
									extraInputs.push(
										$('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value)
											.appendTo(form)[0]);
								} else {
									extraInputs.push(
										$('<input type="hidden" name="'+n+'">').val(s.extraData[n])
											.appendTo(form)[0]);
								}
							}
						}
					}

					if (!s.iframeTarget) {
						// add iframe to doc and submit the form
						$io.appendTo('body');
					}
					if (io.attachEvent) {
						io.attachEvent('onload', cb);
					}
					else {
						io.addEventListener('load', cb, false);
					}
					setTimeout(checkState,15);

					try {
						form.submit();
					} catch(err) {
						// just in case form has element with name/id of 'submit'
						var submitFn = document.createElement('form').submit;
						submitFn.apply(form);
					}
				}
				finally {
					// reset attrs and remove "extra" input elements
					form.setAttribute('action',a);
					form.setAttribute('enctype', et); // #380
					if(t) {
						form.setAttribute('target', t);
					} else {
						$form.removeAttr('target');
					}
					$(extraInputs).remove();
				}
			}

			if (s.forceSync) {
				doSubmit();
			}
			else {
				setTimeout(doSubmit, 10); // this lets dom updates render
			}

			var data, doc, domCheckCount = 50, callbackProcessed;

			function cb(e) {
				if (xhr.aborted || callbackProcessed) {
					return;
				}

				doc = getDoc(io);
				if(!doc) {
					log('cannot access response document');
					e = SERVER_ABORT;
				}
				if (e === CLIENT_TIMEOUT_ABORT && xhr) {
					xhr.abort('timeout');
					deferred.reject(xhr, 'timeout');
					return;
				}
				else if (e == SERVER_ABORT && xhr) {
					xhr.abort('server abort');
					deferred.reject(xhr, 'error', 'server abort');
					return;
				}

				if (!doc || doc.location.href == s.iframeSrc) {
					// response not received yet
					if (!timedOut) {
						return;
					}
				}
				if (io.detachEvent) {
					io.detachEvent('onload', cb);
				}
				else {
					io.removeEventListener('load', cb, false);
				}

				var status = 'success', errMsg;
				try {
					if (timedOut) {
						throw 'timeout';
					}

					var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
					log('isXml='+isXml);
					if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
						if (--domCheckCount) {
							// in some browsers (Opera) the iframe DOM is not always traversable when
							// the onload callback fires, so we loop a bit to accommodate
							log('requeing onLoad callback, DOM not available');
							setTimeout(cb, 250);
							return;
						}
						// let this fall through because server response could be an empty document
						//log('Could not access iframe DOM after mutiple tries.');
						//throw 'DOMException: not available';
					}

					//log('response detected');
					var docRoot = doc.body ? doc.body : doc.documentElement;
					xhr.responseText = docRoot ? docRoot.innerHTML : null;
					xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
					if (isXml) {
						s.dataType = 'xml';
					}
					xhr.getResponseHeader = function(header){
						var headers = {'content-type': s.dataType};
						return headers[header.toLowerCase()];
					};
					// support for XHR 'status' & 'statusText' emulation :
					if (docRoot) {
						xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
						xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
					}

					var dt = (s.dataType || '').toLowerCase();
					var scr = /(json|script|text)/.test(dt);
					if (scr || s.textarea) {
						// see if user embedded response in textarea
						var ta = doc.getElementsByTagName('textarea')[0];
						if (ta) {
							xhr.responseText = ta.value;
							// support for XHR 'status' & 'statusText' emulation :
							xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
							xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
						}
						else if (scr) {
							// account for browsers injecting pre around json response
							var pre = doc.getElementsByTagName('pre')[0];
							var b = doc.getElementsByTagName('body')[0];
							if (pre) {
								xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
							}
							else if (b) {
								xhr.responseText = b.textContent ? b.textContent : b.innerText;
							}
						}
					}
					else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
						xhr.responseXML = toXml(xhr.responseText);
					}

					try {
						data = httpData(xhr, dt, s);
					}
					catch (err) {
						status = 'parsererror';
						xhr.error = errMsg = (err || status);
					}
				}
				catch (err) {
					log('error caught: ',err);
					status = 'error';
					xhr.error = errMsg = (err || status);
				}

				if (xhr.aborted) {
					log('upload aborted');
					status = null;
				}

				if (xhr.status) { // we've set xhr.status
					status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
				}

				// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
				if (status === 'success') {
					if (s.success) {
						s.success.call(s.context, data, 'success', xhr);
					}
					deferred.resolve(xhr.responseText, 'success', xhr);
					if (g) {
						$.event.trigger("ajaxSuccess", [xhr, s]);
					}
				}
				else if (status) {
					if (errMsg === undefined) {
						errMsg = xhr.statusText;
					}
					if (s.error) {
						s.error.call(s.context, xhr, status, errMsg);
					}
					deferred.reject(xhr, 'error', errMsg);
					if (g) {
						$.event.trigger("ajaxError", [xhr, s, errMsg]);
					}
				}

				if (g) {
					$.event.trigger("ajaxComplete", [xhr, s]);
				}

				if (g && ! --$.active) {
					$.event.trigger("ajaxStop");
				}

				if (s.complete) {
					s.complete.call(s.context, xhr, status);
				}

				callbackProcessed = true;
				if (s.timeout) {
					clearTimeout(timeoutHandle);
				}

				// clean up
				setTimeout(function() {
					if (!s.iframeTarget) {
						$io.remove();
					}
					else { //adding else to clean up existing iframe response.
						$io.attr('src', s.iframeSrc);
					}
					xhr.responseXML = null;
				}, 100);
			}

			var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
					if (window.ActiveXObject) {
						doc = new ActiveXObject('Microsoft.XMLDOM');
						doc.async = 'false';


						doc.loadXML(s);
					}
					else {
						doc = (new DOMParser()).parseFromString(s, 'text/xml');
					}
					return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
				};
			var parseJSON = $.parseJSON || function(s) {
					/*jslint evil:true */
					return window['eval']('(' + s + ')');
				};

			var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

				var ct = xhr.getResponseHeader('content-type') || '',
					xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
					data = xml ? xhr.responseXML : xhr.responseText;

				if (xml && data.documentElement.nodeName === 'parsererror') {
					if ($.error) {
						$.error('parsererror');
					}
				}
				if (s && s.dataFilter) {
					data = s.dataFilter(data, type);
				}
				if (typeof data === 'string') {
					if (type === 'json' || !type && ct.indexOf('json') >= 0) {
						data = parseJSON(data);
					} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
						$.globalEval(data);
					}
				}
				return data;
			};

			return deferred;
		}
	};

	/**
	 * ajaxForm() provides a mechanism for fully automating form submission.
	 *
	 * The advantages of using this method instead of ajaxSubmit() are:
	 *
	 * 1: This method will include coordinates for <input type="image" /> elements (if the element
	 *    is used to submit the form).
	 * 2. This method will include the submit element's name/value data (for the element that was
	 *    used to submit the form).
	 * 3. This method binds the submit() method to the form for you.
	 *
	 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
	 * passes the options argument along after properly binding events for submit elements and
	 * the form itself.
	 */
	$.fn.ajaxForm = function(options) {
		options = options || {};
		options.delegation = options.delegation && $.isFunction($.fn.on);

		// in jQuery 1.3+ we can fix mistakes with the ready state
		if (!options.delegation && this.length === 0) {
			var o = { s: this.selector, c: this.context };
			if (!$.isReady && o.s) {
				log('DOM not ready, queuing ajaxForm');
				$(function() {
					$(o.s,o.c).ajaxForm(options);
				});
				return this;
			}
			// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
			log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
			return this;
		}

		if ( options.delegation ) {
			$(document)
				.off('submit.form-plugin', this.selector, doAjaxSubmit)
				.off('click.form-plugin', this.selector, captureSubmittingElement)
				.on('submit.form-plugin', this.selector, options, doAjaxSubmit)
				.on('click.form-plugin', this.selector, options, captureSubmittingElement);
			return this;
		}

		return this.ajaxFormUnbind()
			.bind('submit.form-plugin', options, doAjaxSubmit)
			.bind('click.form-plugin', options, captureSubmittingElement);
	};

// private event handlers
	function doAjaxSubmit(e) {
		/*jshint validthis:true */
		var options = e.data;
		if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
			e.preventDefault();
			$(e.target).ajaxSubmit(options); // #365
		}
	}

	function captureSubmittingElement(e) {
		/*jshint validthis:true */
		var target = e.target;
		var $el = $(target);
		if (!($el.is("[type=submit],[type=image]"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest('[type=submit]');
			if (t.length === 0) {
				return;
			}
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX !== undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') {
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
	$.fn.ajaxFormUnbind = function() {
		return this.unbind('submit.form-plugin click.form-plugin');
	};

	/**
	 * formToArray() gathers form element data into an array of objects that can
	 * be passed to any of the following ajax functions: $.get, $.post, or load.
	 * Each object in the array has both a 'name' and 'value' property.  An example of
	 * an array for a simple login form might be:
	 *
	 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
	 *
	 * It is this array that is passed to pre-submit callback functions provided to the
	 * ajaxSubmit() and ajaxForm() methods.
	 */
	$.fn.formToArray = function(semantic, elements) {
		var a = [];
		if (this.length === 0) {
			return a;
		}

		var form = this[0];
		var formId = this.attr('id');
		var els = semantic ? form.getElementsByTagName('*') : form.elements;
		var els2;

		if (els && !/MSIE [678]/.test(navigator.userAgent)) { // #390
			els = $(els).get();  // convert to standard array
		}

		// #386; account for inputs outside the form which use the 'form' attribute
		if ( formId ) {
			els2 = $(':input[form=' + formId + ']').get();
			if ( els2.length ) {
				els = (els || []).concat(els2);
			}
		}

		if (!els || !els.length) {
			return a;
		}

		var i,j,n,v,el,max,jmax;
		for(i=0, max=els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n || el.disabled) {
				continue;
			}

			if (semantic && form.clk && el.type == "image") {
				// handle image inputs on the fly when semantic == true
				if(form.clk == el) {
					a.push({name: n, value: $(el).val(), type: el.type });
					a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
				}
				continue;
			}

			v = $.fieldValue(el, true);
			if (v && v.constructor == Array) {
				if (elements) {
					elements.push(el);
				}
				for(j=0, jmax=v.length; j < jmax; j++) {
					a.push({name: n, value: v[j]});
				}
			}
			else if (feature.fileapi && el.type == 'file') {
				if (elements) {
					elements.push(el);
				}
				var files = el.files;
				if (files.length) {
					for (j=0; j < files.length; j++) {
						a.push({name: n, value: files[j], type: el.type});
					}
				}
				else {
					// #180
					a.push({ name: n, value: '', type: el.type });
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				if (elements) {
					elements.push(el);
				}
				a.push({name: n, value: v, type: el.type, required: el.required});
			}
		}

		if (!semantic && form.clk) {
			// input type=='image' are not found in elements array! handle it here
			var $input = $(form.clk), input = $input[0];
			n = input.name;
			if (n && !input.disabled && input.type == 'image') {
				a.push({name: n, value: $input.val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
		}
		return a;
	};

	/**
	 * Serializes form data into a 'submittable' string. This method will return a string
	 * in the format: name1=value1&amp;name2=value2
	 */
	$.fn.formSerialize = function(semantic) {
		//hand off to jQuery.param for proper encoding
		return $.param(this.formToArray(semantic));
	};

	/**
	 * Serializes all field elements in the jQuery object into a query string.
	 * This method will return a string in the format: name1=value1&amp;name2=value2
	 */
	$.fn.fieldSerialize = function(successful) {
		var a = [];
		this.each(function() {
			var n = this.name;
			if (!n) {
				return;
			}
			var v = $.fieldValue(this, successful);
			if (v && v.constructor == Array) {
				for (var i=0,max=v.length; i < max; i++) {
					a.push({name: n, value: v[i]});
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				a.push({name: this.name, value: v});
			}
		});
		//hand off to jQuery.param for proper encoding
		return $.param(a);
	};

	/**
	 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
	 *
	 *  <form><fieldset>
	 *      <input name="A" type="text" />
	 *      <input name="A" type="text" />
	 *      <input name="B" type="checkbox" value="B1" />
	 *      <input name="B" type="checkbox" value="B2"/>
	 *      <input name="C" type="radio" value="C1" />
	 *      <input name="C" type="radio" value="C2" />
	 *  </fieldset></form>
	 *
	 *  var v = $('input[type=text]').fieldValue();
	 *  // if no values are entered into the text inputs
	 *  v == ['','']
	 *  // if values entered into the text inputs are 'foo' and 'bar'
	 *  v == ['foo','bar']
	 *
	 *  var v = $('input[type=checkbox]').fieldValue();
	 *  // if neither checkbox is checked
	 *  v === undefined
	 *  // if both checkboxes are checked
	 *  v == ['B1', 'B2']
	 *
	 *  var v = $('input[type=radio]').fieldValue();
	 *  // if neither radio is checked
	 *  v === undefined
	 *  // if first radio is checked
	 *  v == ['C1']
	 *
	 * The successful argument controls whether or not the field element must be 'successful'
	 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
	 * The default value of the successful argument is true.  If this value is false the value(s)
	 * for each element is returned.
	 *
	 * Note: This method *always* returns an array.  If no valid value can be determined the
	 *    array will be empty, otherwise it will contain one or more values.
	 */
	$.fn.fieldValue = function(successful) {
		for (var val=[], i=0, max=this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldValue(el, successful);
			if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
				continue;
			}
			if (v.constructor == Array) {
				$.merge(val, v);
			}
			else {
				val.push(v);
			}
		}
		return val;
	};

	/**
	 * Returns the value of the field element.
	 */
	$.fieldValue = function(el, successful) {
		var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
		if (successful === undefined) {
			successful = true;
		}

		if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
			(t == 'checkbox' || t == 'radio') && !el.checked ||
			(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
			tag == 'select' && el.selectedIndex == -1)) {
			return null;
		}

		if (tag == 'select') {
			var index = el.selectedIndex;
			if (index < 0) {
				return null;
			}
			var a = [], ops = el.options;
			var one = (t == 'select-one');
			var max = (one ? index+1 : ops.length);
			for(var i=(one ? index : 0); i < max; i++) {
				var op = ops[i];
				if (op.selected) {
					var v = op.value;
					if (!v) { // extra pain for IE...
						v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
					}
					if (one) {
						return v;
					}
					a.push(v);
				}
			}
			return a;
		}
		return $(el).val();
	};

	/**
	 * Clears the form data.  Takes the following actions on the form's input fields:
	 *  - input text fields will have their 'value' property set to the empty string
	 *  - select elements will have their 'selectedIndex' property set to -1
	 *  - checkbox and radio inputs will have their 'checked' property set to false
	 *  - inputs of type submit, button, reset, and hidden will *not* be effected
	 *  - button elements will *not* be effected
	 */
	$.fn.clearForm = function(includeHidden) {
		return this.each(function() {
			$('input,select,textarea', this).clearFields(includeHidden);
		});
	};

	/**
	 * Clears the selected form elements.
	 */
	$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
		return this.each(function() {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (re.test(t) || tag == 'textarea') {
				this.value = '';
			}
			else if (t == 'checkbox' || t == 'radio') {
				this.checked = false;
			}
			else if (tag == 'select') {
				this.selectedIndex = -1;
			}
			else if (t == "file") {
				if (/MSIE/.test(navigator.userAgent)) {
					$(this).replaceWith($(this).clone(true));
				} else {
					$(this).val('');
				}
			}
			else if (includeHidden) {
				// includeHidden can be the value true, or it can be a selector string
				// indicating a special test; for example:
				//  $('#myForm').clearForm('.special:hidden')
				// the above would clean hidden inputs that have the class of 'special'
				if ( (includeHidden === true && /hidden/.test(t)) ||
					(typeof includeHidden == 'string' && $(this).is(includeHidden)) ) {
					this.value = '';
				}
			}
		});
	};

	/**
	 * Resets the form data.  Causes all form elements to be reset to their original value.
	 */
	$.fn.resetForm = function() {
		return this.each(function() {
			// guard against an input with the name of 'reset'
			// note that IE reports the reset function as an 'object'
			if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
				this.reset();
			}
		});
	};

	/**
	 * Enables or disables any matching elements.
	 */
	$.fn.enable = function(b) {
		if (b === undefined) {
			b = true;
		}
		return this.each(function() {
			this.disabled = !b;
		});
	};

	/**
	 * Checks/unchecks any matching checkboxes or radio buttons and
	 * selects/deselects and matching option elements.
	 */
	$.fn.selected = function(select) {
		if (select === undefined) {
			select = true;
		}
		return this.each(function() {
			var t = this.type;
			if (t == 'checkbox' || t == 'radio') {
				this.checked = select;
			}
			else if (this.tagName.toLowerCase() == 'option') {
				var $sel = $(this).parent('select');
				if (select && $sel[0] && $sel[0].type == 'select-one') {
					// deselect all other options
					$sel.find('option').selected(false);
				}
				this.selected = select;
			}
		});
	};

// expose debug var
	$.fn.ajaxSubmit.debug = false;

//从按钮ajax提交按钮所在的表单
	$.fn.submitForm = function(options)
	{
		var opt = options || {};
		opt.dataType = opt.dataType || 'json';
		//
		if (typeof opt.showRunning == 'undefined') opt.showRunning = true;
		opt.success = function(fn, btn)
		{
			return function(data, frm)
			{
				if (opt.showRunning) btn.stopRunning();
				try
				{
					if (fn)
					{
						return fn(data, frm);
					}
				} catch (e) {}
			};
		} (opt.success, this);

		var btn = this;
		opt.complete = function(XMLHttpRequest, textStatus, errorThrown)
		{
			if (textStatus != 'success')
			{
				//alert('Request status:' + XMLHttpRequest.status + '\n' + 'Text status:' + textStatus + '\nerrorThrown:' + errorThrown);
				$.showError();
			}
			if (opt.showRunning) btn.stopRunning();
		}

		opt.beforeSubmit = function(fn, btn)
		{
			return function(data, frm)
			{
				var willSubmit = false;
				//try
				//{
				if (typeof fn !== "boolean")
				{
					willSubmit = fn(data, frm);
				} else
				{
					willSubmit = true;
				}
				// } catch (e) { throw new Error(e); }
				if (willSubmit && opt.showRunning){
					btn.running()
				};
				return willSubmit;
			};
		} (opt.beforeSubmit, this);

		var form =opt.formID?$('#'+opt.formID):this.closest('form');// var form = this.closest('form');
		form.ajaxSubmit(opt);
		return this;
	}

//给表单中可能出现的文本框绑定回车事件，当回车时执行某个方法，并返回false以阻止提交表单
	$.fn.liveEnter = function(fn)
	{
		this.live(':text').keydown(function(event)
		{
			var e = $.event.fix(event);
			if (e.keyCode == 13)
			{
				if ($.isFunction(fn))
				{
					try
					{
						fn();
					} catch (e) { }
				}
				return false;
			}
			return true;
		});
	}

//给表单中的文本框绑定回车事件，当回车时执行某个方法，并返回false以阻止提交表单
	$.fn.bindEnter = function(fn)
	{
		this.find(':text').keydown(function(event)
		{

			var e = $.event.fix(event);
			if (e.keyCode == 13)
			{
				try
				{
					if ($.isFunction(fn))
					{
						fn();
					}
				} catch (e) { }
				return false;
			}
			return true;
		});
	};

	$.fn.proxyClick = function(btn)
	{
		try
		{
			if (typeof btn == 'string')
			{
				btn = $(btn);
			}
			btn.click();
		} catch (e) { }
		return false;
	};

	$.fn.selectedText = function()
	{
		return this.find('option[value=' + this.val() + ']').text();
	}

//调用 $.getJSON方法去获取数据
//url--请求的地址
//data--要传递的参数
//callback成功的回调
//error--失败的回调
	$.fn.getJSON = function(url, data, callback, error, async)
	{
		var success = callback;
		var errorFn = null;
		var complete = null;
		var d = data;
		if (typeof data == 'function')
		{
			success = data;
			error = callback;
			async = error;
			d = {};
		}
		if (typeof error == 'boolean')
		{
			async = error;
		}
		if (async == 'undefined')
		{
			async = true;
		}
		success = function(fn, btn)
		{
			return function(json)
			{
				btn.stopRunning();
				try
				{
					if (fn)
					{
						return fn(json);
					}
				} catch (e)
				{
					//alert(e.message); 
				}
			};
		} (success, this);
		complete = function(btn)
		{
			return function(XMLHttpRequest, textStatus)
			{
				btn.stopRunning();
			};
		} (this);
		errorFn = function(XMLHttpRequest, textStatus, errorThrown)
		{
			if (textStatus == 'error')
			{
				//alert(XMLHttpRequest.status);
			}
			if (error)
			{
				error(XMLHttpRequest, textStatus, errorThrown);
			} else
			{
				$.showError();
			}
		};
		this.running();
		$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			data: d,
			async: async,
			success: success,
			error: errorFn,
			complete: complete
		});
	};



//调用 $.get方法去获取数据
//url--请求的地址
//data--要传递的参数
//callback成功的回调
//error--失败的回调
	$.fn.getHTML = function(url, data, callback, error)
	{
		var success = callback;
		var errorFn = null;
		var complete = null;
		var d = data;
		if (typeof data == 'function')
		{
			success = data;
			error = callback;
			d = {};
		}
		success = function(fn, btn)
		{
			return function(json)
			{
				btn.stopRunning();
				try
				{
					if (fn)
					{
						return fn(json);
					}
				} catch (e) { alert(e.message); }
			};
		} (success, this);
		complete = function(btn)
		{
			return function(XMLHttpRequest, textStatus)
			{
				btn.stopRunning();
			};
		} (this);
		errorFn = function(XMLHttpRequest, textStatus, errorThrown)
		{
			if (textStatus == 'error')
			{
				alert(XMLHttpRequest.status);
			}
			if (error)
			{
				error(XMLHttpRequest, textStatus, errorThrown);
			}
		};
		this.running();
		$.ajax({
			type: "GET",
			url: url,
			dataType: "html",
			data: d,
			success: success,
			error: errorFn,
			complete: complete
		});
	}
// helper fn for console logging
	function log() {
		if (!$.fn.ajaxSubmit.debug) {
			return;
		}
		var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
		if (window.console && window.console.log) {
			window.console.log(msg);
		}
		else if (window.opera && window.opera.postError) {
			window.opera.postError(msg);
		}
	}
	return $;

}));


/**
 *  jQuery  ui_calling.js
 *  Copyright (c)  jon
 */
define('jpjob.calling', function(require, exports, module){
	var $ = require('jquery'),
		calling = function(element,opt){
			this.id = '';
			this.dh = null; //
			this.dc = null; // 内容       
			this.df = null; // 底部 
			this.$element = $(element),
				this.options = null; //参数信息
			this.hd = null;
			this.currLevel = 1;
			this.lastSelectItem = ['NULL','不限'];
			this._defaults = {
				url: '/api/web/industry.api?id=0',
				multipleUrl:'/api/web/industry.api?act=multiple&id=',
				isLimit:false,
				max: 3,
				tipClass:'tipClass',
				hddName:'hddName',
				inputName:'callingName',
				selectItems:[],
				selectClass:'cu',
				type:'multiple', // single|multiple 
				unLimitedLevel:2,
				singlelimit:true,
				onSelect:null
			};
			var self = this;
			//初始化选项
			this.initOptions = function(){
				var tempOpt = opt || {};
				tempOpt.animate = tempOpt.animate || '';
				tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
				tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
				self.options = $.extend({}, this._defaults, tempOpt);
			};
			this.initHtml= function(type) {
				// 初始化控件
				var html =' <span><div class="dropSet"> '+
					' <b class="jpFntWes dropIco">&#xf03a;</b>'+
					'    <input type="text" class="text JobCay">'+
					'  </div>'+
					' <div class="dropLst">'+
					' <div class="dropLstHead"><a href="javascript:void(0)" class="unlimited btn1 btnsF12">类别不限</a><p>最多可选择<em></em>项</p><a class="closeDrop" href="javascript:void(0)">×</a></div>'+
					' <div class="dropLstCon">'+
					'     <div class="lst lst1">'+
					'        <ul>'+
					'        </ul>'+
					'     </div>'+
					'    <div class="lst lst2">'+
					'    	<ul>'+
					'       </ul>'+
					'    </div>'+
					'    <div class="clear"></div>'+
					' </div> '+
					' </div></span>';

				self.dh =$(html).appendTo(self.$element).find('.dropLst').hide();
				self.tipElement = self.dh.find('.dropLstHead');
				self.hd =self.$element.find('.dropSet').show();
				self.hc = self.$element.find('.dropLstCon');
				self.hddElement = $('<input type="hidden" name="'+self.options.hddName+'"/>').appendTo(self.$element);
				if(self.isSingle()) {
					self.tipElement.find('.unlimited').hide().end().find('p').html('请选择行业分类；重新选择即可修改当前选项');
					if(!self.options.singlelimit){
						self.tipElement.find('.unlimited').show(); // XXX: 临时解决 校园招聘首页 单选行业，可以指定类别不限
					}
					self.hd.find('.dropIco').html('&#xf0d7;');
					self.hd.removeClass('dropSet').addClass('dropRdSet');
				} else {
					self.tipElement.find('em').html(self.options.max);
				}
				// 是否限制
				if(self.options.isLimit){
					self.tipElement.find('.unlimited').hide();
				}
				// 加载一级类别
				var url = self.options.url;
				self.loadData(url,self.selectItem);
				if(self.options.selectItems.length>0) {
					var callingurl = self.options.multipleUrl+self.options.selectItems.join(',');
					self.options.selectItems = [];
					self.loadData(callingurl,self.setControl);
				}
			};
			// 初始化事件
			this.initEvent = function() {
				self.dh.find('.closeDrop').click(function() {
					self.dh.hide();
				});
				self.dh.find('.unlimited').click(function(){
					self.dh.hide();
					self.reset();
					if(self.isSingle()){
						// XXX:校园招聘首页
						self.hd.find('input[type="text"]').before($('<span class="seled" d=",不限">类别不限</span>'));
					}else {
						self.hd.find('input[type="text"]').before($('<span class="seled" d="null,不限">不限<i class="delSel">×</i></span>'));
					}

				});

				self.hd.click(function(e) {
					var target = $(e.target);
					if(target.is('.delSel')) {
						self.lastSelectItem = target.parent().attr('d').split(',');
						self.checkItem(false);
						e.stopPropagation();
						return;
					}
					self.dh.show();
				});

				// 选择一级大类
				self.dh.find('.lst1 ul').click(function(e) {
					var target = $(e.target);
					if(target.is('input')) {
					}else if(target.is('label')) {
						target = target.closest('li');
						self.currLevel = 2;
						$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
						self.lastSelectItem = $(target).attr('d').split(',');
						var url = self.options.url+self.lastSelectItem[0];
						self.loadData(url,self.selectItem);

					}
				});

				// 选择二级大类
				self.dh.find('.lst2 ul').click(function(e) {
					var target = $(e.target);
					self.lastSelectItem = $(target).closest('li').attr('d').split(',');
					if(target.is('input')) {
						self.checkItem(target.is(':checked'));
					}else if(target.is('label')) {
						target = target.closest('li');
						var target = target.closest('li');
						var input = $(target).find('input:visible');
						if(input.length<=0) {
							return;
						}
						var disabled = $(target).find('input').is(':disabled');
						var checked = $(target).find('input').is(':checked');

						if(disabled) {
							return;
						}
						if($(target).find('input').is(':radio')&&checked) {
							return;
						}
						if(checked) {
							$(target).find('input').removeAttr('checked');
						}else {
							$(target).find('input').attr('checked','checked');
						}
						self.checkItem(!checked);
						if(target.is('li[isParent]')) {
							return;
						}
						//self.currLevel = 3;
						//$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
						//var url = self.options.url+self.lastSelectItem[0];
						//self.loadData(url,self.selectItem);

					}
				});
				self.hc.mouseover(function(e){
					var target = $(e.target);
					if(target.is('li')){
						self.hc.find('li').removeClass('hov');
						target.addClass('hov');
					}
					else if(target.closest('li').length>0) {
						self.hc.find('li').removeClass('hov');
						target.closest('li').addClass('hov');
					}
				});

			};
			this.show =function () {
				this.initOptions();
				this.initHtml();
				this.initEvent();
			};
			//删除项
			this.delItems = function(data) {
				$.each(data,function(i,n){
					if(self.options.selectItems.contains(n.calling_id)) {
						self.del(n.calling_id,n.calling_name);
					}
				});
			};
			// 删除已选项
			this.del = function(id,name) {
				self.hd.find('.seled[d="'+id+','+name+'"]').remove();
				self.options.selectItems.remove(id);
				self.hddElement.val(self.options.selectItems.join(','));
			};
			this.add = function(id,name) {
				if(self.isSingle()) {
					self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'</span>'));
				}else {
					self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'<i class="delSel">×</i></span>'));
				}
				if(!self.options.selectItems.contains(id)) {
					self.options.selectItems.push(id);
				}
				self.hddElement.val( self.options.selectItems.join(','));
			};
			this.add = function(id,name) {
				if(self.isSingle()) {
					self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'</span>'));
				}else {
					self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'<i class="delSel">×</i></span>'));
				}
				if(!self.options.selectItems.contains(id)) {
					self.options.selectItems.push(id);
				}
				self.hddElement.val( self.options.selectItems.join(','));
			};

			// 选择事件
			this.loadData = function(url,callback) {
				// 选择项时	
				$.ajax({
					url: url,
					type: "get",
					dataType: "jsonp",
					success: function(data) {
						if(typeof callback == 'function') {
							callback(data);
						}
					}
				});
			};

			// 单选选中
			this.checkRadio = function() {
				var id = self.lastSelectItem[0],
					name = self.lastSelectItem[1],
					url = self.options.url+ id;
				/*
				 self.loadData(url,function(data){
				 $.each(data,function(i,n){
				 self.dh.find('li[d="'+n.calling_id+','+n.calling_name+'"]').find('input').attr('disabled','disabled');
				 });
				 });
				 */
				if(self.isExists(id)) {
					return;
				}
				// 删除之前的
				self.hd.find('.seled[d]').each(function(){
					var obj = $(this).attr('d').split(','),
						delurl = self.options.url+ obj[0];
					self.del(obj[0],obj[1]);
				});
				// 如果有子类之前有选中的，移除Inupt中的项，并删除控件中的记录	
				self.loadData(url,self.delItems);
				// 新增当前项到inPut中
				self.add(id,name);
				self.dh.hide();
			};

			this.checkMultiple = function() {
				var isLimit = false;
				if(self.options.selectItems.length+1>self.options.max) {
					//self.tipElement.addClass(self.options.tipClass);
					isLimit = true;
				} else {
					//self.tipElement.removeClass(self.options.tipClass);
					isLimit = false;
				}
				return isLimit;
			};

			// check项
			this.checkItem = function(isChecked) {
				var id = self.lastSelectItem[0],
					name = self.lastSelectItem[1],
					url = self.options.url+ id,
					isSingle = self.isSingle();

				if(isChecked) {
					self.hd.find('.seled[d="null,不限"]').remove();
					if(isSingle) {
						self.hd.find('.seled[d$="不限"]').remove();
						self.checkRadio(id);
					} else {
						if(self.checkMultiple()) {
							self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
							$.anchor('最多可以选择'+self.options.max+'项',{icon:'info'});
							return;
						}
						// 如果有将子类中的当前类选中
						self.dh.find('li[d="'+id+','+name+'"]').find('input').attr('checked','checked');
						// 如果有禁用并选中所有的子类
						self.loadData(url,function(data){
							self.delItems(data);
							$.each(data,function(i,n){
								self.dh.find('li[d="'+n.calling_id+','+n.calling_name+'"]').find('input').attr('checked','checked').attr('disabled','disabled');
							});
						});
						// 新增当前项到inPut中
						self.add(id,name);
					}
				} else {
					self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
					self.loadData(url,function(data){
						$.each(data,function(i,n){
							self.dh.find('li[d="'+n.calling_id+','+n.calling_name+'"]').find('input').removeAttr('checked').removeAttr('disabled');
						});
					});
					self.del(id,name);
				}
				if(typeof self.options.onSelect =='function') {
					self.options.onSelect();
				}
			};
			// 是否存在
			this.isExists = function(id) {
				return self.options.selectItems.contains(id);
			};
			// 是否单选
			this.isSingle = function(id) {
				return self.options.type=='single';
			};
			this.selectItem= function(data) {
				var arr = new Array(),
					pid = self.lastSelectItem[0],
					pname = self.lastSelectItem[1],
					isSingle = self.isSingle(),
					createItem = function(isSigle,pid,id,name,isdisabled,isChecked,isParent,isFirst,isShowControl) {
						var s = new StringBuilder();
						s.Append('<li d="'+id+','+name+'"');
						if(isParent) {
							s.Append(' isParent="true"');
						}
						if(isFirst) {
							s.Append(' class="ths" ');
						}
						s.Append('>');
						if(isSigle) {
							s.Append('<input type="radio" class="chb" name="'+self.options.inputName+'" ');
						} else {
							s.Append('<input type="checkbox"  class="chb" name="'+self.options.inputName+'" ');
						}
						if(isdisabled) {
							s.Append('disabled="disabled"');
							if(!self.isSingle()) {
								s.Append(' checked="checked"');
							}
						} else if (isChecked) {
							s.Append(' checked="checked"');
						}
						if(!isShowControl) {
							s.Append(' style="display:none;"');
						}

						s.Append(' />');
						if(isParent) {
							s.Append('<label>全部('+name+')</label>');
						} else {
							s.Append('<label>'+name+'</label>');
						}
						s.Append('</li>');
						return s.toString();
					};
				if(self.currLevel>=self.options.unLimitedLevel) { // 是否在子类中显示当前类
					arr.push(createItem(isSingle,pid,pid,pname,false,self.isExists(pid),true,true,true));
				}
				if(self.currLevel == 1) {
					// 一级职位类别
					$.each(data,function(i,n){
						arr.push('<li d="'+n.calling_id+','+n.calling_name+'"><label>'+n.calling_name+'</label></li>');
					});
					self.dh.find('.lst1 ul').empty().html(arr.join(''));
				} else if (self.currLevel == 2) {
					self.dh.find('.lst2 ul').empty();
					self.dh.find('.lst3 ul').empty();
					var bool = false;
					$.each(data,function(i,n){
						bool = true;
						var item = createItem(isSingle,pid,n.calling_id,n.calling_name,self.isExists(pid),self.isExists(n.calling_id),false,false,true);
						arr.push(item);
					});
					if(bool) {
						self.dh.find('.lst2 ul').html(arr.join(''));
					}
				}
				/*
				 else {
				 self.dh.find('.lst3 ul').empty();
				 var bool = false;
				 $.each(data,function(i,n){
				 bool = true;
				 var item = createItem(isSingle,pid,n.calling_id,n.calling_name,self.isExists(pid),self.isExists(n.calling_id));	
				 arr.push(item);
				 });
				 if(bool) {
				 self.dh.find('.lst3 ul').html(arr.join(''));
				 }	
				 }*/
			};

			this.setControl = function(data) {
				$.each(data,function(i,n){
					self.lastSelectItem[0] = n.calling_id;
					self.lastSelectItem[1] = n.calling_name;
					self.checkItem(true);
				});
			}
			this.reset = function() {
				self.options.selectItems = [];
				// this.hc.find('.lst2 ul li').remove();
				// this.hc.find('.lst3 ul li').remove();
				this.hc.find('input[type="checkbox"],input[type="radio"]').removeAttr('checked').removeAttr('disabled');
				this.hd.find('.seled').remove();
				this.$element.find('input[name="'+this.options.hddName+'"]').val(' ');
			}

			// 设置值
			this.setValue = function(items) {
				var values = items.split(','),
					newArr = new Array(),
					isSingle = self.isSingle();
				if(isSingle) {
					var callingurl = self.options.multipleUrl + items;
					self.loadData(callingurl,self.setControl);
				} else {
					for(var i =0,len = values.length;i<len;i+=1) {
						if(!self.isExists(values[i])) {
							//self.options.selectItems.push(values[i]);
							newArr.push(values[i]);
						}
					}
					if(newArr.length>0) {
						var callingurl = self.options.multipleUrl+newArr.join(',');
						self.loadData(callingurl,self.setControl);
					}
				}
			};
			// 获取数据
			this.getValue = function() {
				var v = new Array();
				this.hd.find('.seled').each(function(){
					var area = $(this).attr('d');
					v.push(area);
				});
				return v;
			};
			$('body').click(function(e){
				// 检测发生在body中的点击事件，隐藏日历控件
				var cell = $(e.target);
				if (cell)
				{
					var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
					var inID = self.$element.attr('id');
					var isTagert = false;
					try{
						// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
						isTagert = tgID != inID && $(cell).closest('#' + inID).length <= 0;
					}catch (e){
						isTagert = true;
					} if (isTagert){
					self.dh.hide();
				}
				}
			});
		};
	var old = $.fn.calling;
	$.fn.calling= function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('bs.calling');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('bs.calling', (data = new calling(this, options)));
				data.show();
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	}
	$.fn.setCallingValue = function(ids) {
		var calling= $(this).data('bs.calling');
		calling.setValue(ids);
	};
	$.fn.getCallingValue = function() {
		var calling= $(this).data('bs.calling');
		return calling.getValue();
	};
	$.fn.resetCallingValue = function() {
		var calling= $(this).data('bs.calling');
		calling.reset();
	};
	$.fn.calling.Constructor = calling;
	// 解决冲突
	$.fn.calling.noConflict = function () {
		$.fn.calling = old;
		return this;
	}
	return $;
});/**
 *  jQuery  mulitiplearea.js
 *  Copyright (c)  jon
 */

define('jpjob.areaMulitiple', function(require, exports, module){

	var $ = require('jquery');
	var Helper = function(){
		this.arr = [];
	};
	Helper.prototype.getDescendant=function(a){
		if(typeof a == 'undefined') {
			return;
		}
		var i = 0;
		this.arr = this.arr.concat(a);
		while(i <a.length) {
			arguments.callee.call(this,a[i].subAreas);
			i++;
		}
	};
	var area = function(element,opt) {
		this.id = '';
		this.dh = null; //
		this.dc = null; // 内容       
		this.df = null; // 底部 
		this.$element = $(element),
			this.options = null; //参数信息
		this.hd = null;
		this.currLevel = 1
		this.lastSelectItem = ['NULL','不限'];
		this.isChecked = false;
		this.isDisabled =false;
		this._defaults ={
			url: '/api/web/region.api?id=',
			multipleUrl:'/api/web/region.api?id=',
			allSubUrl:'/api/web/region.api?id=',
			singleUrl:'/api/web/region.api?act=multipleList&id=',
			isLimit:false,
			max: 3,
			tipClass:'tipClass',
			hddName:'hddName',
			inputName:'areaName',
			selectItems:[],
			selectClass:'cu',
			type:'multiple',
			unLimitedLevel:2,
			onSelect:null,
			specialNumber:['030','031','010','011','020','021','040','041'],
			_area:[{"area_id":"0300","parent_ID":"","area_name":"重庆","subAreas":[{"area_id":"030","parent_ID":"0300","area_name":"重庆-主城区","subAreas":[{"area_id":"0301","parent_ID":"030","area_name":"渝中区"},{"area_id":"0302","parent_ID":"030","area_name":"江北区"},{"area_id":"0303","parent_ID":"030","area_name":"九龙坡区"},{"area_id":"0304","parent_ID":"030","area_name":"沙坪坝区"},{"area_id":"0305","parent_ID":"030","area_name":"南岸区"},{"area_id":"0306","parent_ID":"030","area_name":"大渡口区"},{"area_id":"0307","parent_ID":"030","area_name":"渝北区"},{"area_id":"0308","parent_ID":"030","area_name":"巴南区"},{"area_id":"0309","parent_ID":"030","area_name":"北碚区"},{"area_id":"0342","parent_ID":"030","area_name":"北部新区"}]},{"area_id":"031","parent_ID":"0300","area_name":"重庆-周边区县","subAreas":[{"area_id":"0310","parent_ID":"031","area_name":"万州区"},{"area_id":"0311","parent_ID":"031","area_name":"涪陵区"},{"area_id":"0312","parent_ID":"031","area_name":"万盛区"},{"area_id":"0313","parent_ID":"031","area_name":"黔江区"},{"area_id":"0314","parent_ID":"031","area_name":"长寿区"},{"area_id":"0315","parent_ID":"031","area_name":"双桥区"},{"area_id":"0316","parent_ID":"031","area_name":"江津区"},{"area_id":"0317","parent_ID":"031","area_name":"合川区"},{"area_id":"0318","parent_ID":"031","area_name":"永川区"},{"area_id":"0319","parent_ID":"031","area_name":"南川区"},{"area_id":"0320","parent_ID":"031","area_name":"綦江县"},{"area_id":"0321","parent_ID":"031","area_name":"潼南县"},{"area_id":"0322","parent_ID":"031","area_name":"铜梁县"},{"area_id":"0323","parent_ID":"031","area_name":"大足县"},{"area_id":"0324","parent_ID":"031","area_name":"荣昌县"},{"area_id":"0325","parent_ID":"031","area_name":"璧山县"},{"area_id":"0326","parent_ID":"031","area_name":"梁平县"},{"area_id":"0327","parent_ID":"031","area_name":"城口县"},{"area_id":"0328","parent_ID":"031","area_name":"丰都县"},{"area_id":"0329","parent_ID":"031","area_name":"垫江县"},{"area_id":"0330","parent_ID":"031","area_name":"武隆县"},{"area_id":"0331","parent_ID":"031","area_name":"忠县"},{"area_id":"0332","parent_ID":"031","area_name":"开县"},{"area_id":"0333","parent_ID":"031","area_name":"云阳县"},{"area_id":"0334","parent_ID":"031","area_name":"奉节县"},{"area_id":"0335","parent_ID":"031","area_name":"巫山县"},{"area_id":"0336","parent_ID":"031","area_name":"巫溪县"},{"area_id":"0337","parent_ID":"031","area_name":"石柱县"},{"area_id":"0338","parent_ID":"031","area_name":"酉阳县"},{"area_id":"0339","parent_ID":"031","area_name":"彭水县"},{"area_id":"0340","parent_ID":"031","area_name":"秀山县"}]}]},{"area_id":"0100","parent_ID":"","area_name":"北京","subAreas":[{"area_id":"010","parent_ID":"0100","area_name":"北京-五环以内","subAreas":[{"area_id":"0101","parent_ID":"010","area_name":"东城区"},{"area_id":"0102","parent_ID":"010","area_name":"西城区"},{"area_id":"0105","parent_ID":"010","area_name":"朝阳区"},{"area_id":"0106","parent_ID":"010","area_name":"丰台区"},{"area_id":"0108","parent_ID":"010","area_name":"海淀区"}, {"area_id":"0107","parent_ID":"010","area_name":"石景山区"},{"area_id":"0103","parent_ID":"010","area_name":"崇文区"},{"area_id":"0104","parent_ID":"010","area_name":"宣武区"}]}, {"area_id":"011","parent_ID":"0100","area_name":"北京-五环以外","subAreas":[{"area_id":"0109","parent_ID":"011","area_name":"门头沟区"},{"area_id":"0110","parent_ID":"011","area_name":"房山区"},{"area_id":"0111","parent_ID":"011","area_name":"通州区"},{"area_id":"0112","parent_ID":"011","area_name":"顺义区"},{"area_id":"0113","parent_ID":"011","area_name":"昌平区"},{"area_id":"0114","parent_ID":"011","area_name":"大兴区"},{"area_id":"0115","parent_ID":"011","area_name":"怀柔区"},{"area_id":"0116","parent_ID":"011","area_name":"平谷区"},{"area_id":"0117","parent_ID":"011","area_name":"密云县"},{"area_id":"0118","parent_ID":"011","area_name":"延庆县"}]}]},{"area_id":"0200","parent_ID":"","area_name":"上海","subAreas":[{"area_id":"020","parent_ID":"0200","area_name":"上海-外环以内","subAreas":[{"area_id":"0201","parent_ID":"020","area_name":"黄浦区"},{"area_id":"0202","parent_ID":"020","area_name":"卢湾区 "},{"area_id":"0203","parent_ID":"020","area_name":"徐汇区"},{"area_id":"0204","parent_ID":"020","area_name":"长宁区"},{"area_id":"0205","parent_ID":"020","area_name":"静安区"},{"area_id":"0206","parent_ID":"020","area_name":"普陀区"},{"area_id":"0207","parent_ID":"020","area_name":"闸北区"},{"area_id":"0208","parent_ID":"020","area_name":"虹口区"},{"area_id":"0209","parent_ID":"020","area_name":"杨浦区"},{"area_id":"0213","parent_ID":"020","area_name":"浦东新区"}]},{"area_id":"021","parent_ID":"0200","area_name":"上海-郊区/县","subAreas":[{"area_id":"0210","parent_ID":"021","area_name":"闵行区"},{"area_id":"0211","parent_ID":"021","area_name":"宝山区"},{"area_id":"0212","parent_ID":"021","area_name":"嘉定区"},{"area_id":"0214","parent_ID":"021","area_name":"金山区"},{"area_id":"0215","parent_ID":"021","area_name":"松江区"},{"area_id":"0216","parent_ID":"021","area_name":"青浦区"},{"area_id":"0217","parent_ID":"021","area_name":"奉贤区"},{"area_id":"0218","parent_ID":"021","area_name":"崇明县"}]}]},{"area_id":"0400","parent_ID":"","area_name":"天津","subAreas":[{"area_id":"040","parent_ID":"0400","area_name":"天津-主城区","subAreas":[ {"area_id":"0401","parent_ID":"040","area_name":"和平区"},{"area_id":"0402","parent_ID":"040","area_name":"河东区"},{"area_id":"0403","parent_ID":"040","area_name":"河西区"},{"area_id":"0404","parent_ID":"040","area_name":"南开区"},{"area_id":"0405","parent_ID":"040","area_name":"河北区"},{"area_id":"0406","parent_ID":"040","area_name":"红桥区"},{"area_id":"0407","parent_ID":"040","area_name":"东丽区"},{"area_id":"0408","parent_ID":"040","area_name":"西青区"},{"area_id":"0409","parent_ID":"040","area_name":"津南区"},{"area_id":"0410","parent_ID":"040","area_name":"北辰区"}]},{"area_id":"041","parent_ID":"0400","area_name":"天津-周边区县","subAreas":[ {"area_id":"0412","parent_ID":"041","area_name":"宝坻区"},{"area_id":"0413","parent_ID":"041","area_name":"滨海新区"},{"area_id":"0414","parent_ID":"041","area_name":"宁河县"},{"area_id":"0415","parent_ID":"041","area_name":"静海县"},{"area_id":"0416","parent_ID":"041","area_name":"蓟县"},{"area_id":"0411","parent_ID":"041","area_name":"武清区"}]}]}]};
		var self = this;
		//初始化选项
		this.initOptions = function(){
			var tempOpt = opt || {};
			tempOpt.animate = tempOpt.animate || '';
			tempOpt.showAnimate = tempOpt.showAnimate || tempOpt.animate;
			tempOpt.hideAnimate = tempOpt.hideAnimate || tempOpt.animate;
			self.options = $.extend({}, this._defaults, tempOpt);
		};
		// 获取地区级别
		this.getAreaLevel = function (id){
			var arr = new Array();
			if (id == '' || typeof id == 'undefined') return [];
			if (/\d{2}00/.test(id) && id.length==4) return [id];
			arr.push(id.substr(0, 2) + '00');
			if(id.length==4)arr.push(id.substr(0, 3));
			arr.push(id);
			return arr;
		}
		// 获取地区信息
		this.getArea = function(id){
			/*
			 var level = self.getAreaLevel(id);
			 var l = self.options._area;
			 var area = null;
			 for (var i in level)
			 {

			 var id = level[i];
			 for (var j in l)
			 {
			 if (l[j].area_id == id)
			 {
			 area = l[j];
			 l = l[j].subAreas;
			 break;
			 }
			 }
			 }*/
			var l = self.options._area;
			for(var i = 0,len = l.length;i<len;i+=1) {
				if(l[i].area_id ==id) {
					return l[i];
				}
				if(l[i].subAreas) {
					for(var j = 0,subLen = l[i].subAreas.length;j<subLen;j+=1 ) {
						if(l[i].subAreas[j].area_id ==id) {
							return l[i].subAreas[j];
						}
						if(l[i].subAreas[j].subAreas) {
							for(var k,partLen = l[i].subAreas[j].subAreas;k<partLen;k+=1) {
								if(l[i].subAreas[j].subAreas[k].area_id ==id) {
									return l[i].subAreas[j].subAreas[k];
								}
							}
						}

					}
				}
			}
			return null;
		}
		// 获取地区名称
		this.getAreaName = function(id){
			var area = self.getArea(id);
			if (area)
			{
				return area.area_name;
			} else
			{
				return '';
			}
		}
		this.initHtml= function(type) {
			// 初始化控件
			var html =' <span><div class="dropSet"> '+
				' <b class="jpFntWes dropIco">&#xf03a;</b>'+
				'    <input type="text" class="text JobCay">'+
				'    <div class="clear"></div>'+
				'  </div>'+
				' <div class="dropLst">'+
				' <div class="dropLstHead"><a href="javascript:void(0)" class="unlimited btn1 btnsF12">类别不限</a><p>最多可选择<em></em>项</p><a class="closeDrop" href="javascript:void(0)">×</a></div>'+
				' <div class="dropLstCon">'+
				'     <div class="lst lst1">'+
				'        <ul>'+
				'        </ul>'+
				'     </div>'+
				'    <div class="lst lst2">'+
				'    	<ul>'+
				'       </ul>'+
				'    </div>'+
				'    <div class="lst lst3">'+
				'     	<ul>'+
				'       </ul>'+
				'    </div>'+
				'    <div class="clear"></div>'+
				' </div> '+
				' </div></span>';
			self.dh =$(html).appendTo(self.$element).find('.dropLst').hide();
			self.dh.find('.dropLstHead em').html(self.options.max);
			self.tipElement = self.dh.find('.dropLstHead');
			self.hd =self.$element.find('.dropSet').show();
			self.hc = self.$element.find('.dropLstCon');
			self.hddElement = $('<input type="hidden" name="'+self.options.hddName+'"/>').appendTo(self.$element);

			// 是否限制
			if(self.options.isLimit){
				self.tipElement.find('.unlimited').hide();
			}
			// 加载一级类别
			var url = self.options.url;
			self.loadData(url, function(data){
				self.selectItem(data);
				self.dh.find('.lst1 ul').find('li[d="0300,重庆"]').find('label').click();
			});
			if(self.options.selectItems.length>0) {
				var ids = self.checkSpecialNumber(self.options.selectItems);
				self.options.selectItems = [];
				for(var i =0; i<ids.length;i+=1) {
					var areaurl = self.options.singleUrl+ids[i];
					self.lastSelectItem =[ids[i],' '];
					self.loadData(areaurl,self.setControl,false,true);
				}

			}

		};
		/*
		 * 检测特殊编号
		 */
		this.checkSpecialNumber = function(ids) {
			var arr = ids;
			for(var i = 0,len = self.options.specialNumber.length;i<len;i+=1) {
				var d = self.getArea(self.options.specialNumber[i]);
				if(d.subAreas) {
					var isExists = true;
					var a = new Array();
					for(var j = 0,areLen = d.subAreas.length;j<areLen;j+=1) {
						a.push(d.subAreas[j].area_id)
						if(!ids.contains(d.subAreas[j].area_id)) {
							isExists = false;
							break;
						}
					}
					if(isExists) {
						for(var k = 0;k<a.length;k+=1) {
							arr.remove(a[k]);
						}
						arr.push(d.area_id);
					}

				}
			}
			return arr;
		};
		// 初始化事件
		this.initEvent = function() {
			self.dh.find('.closeDrop').click(function() {
				self.dh.hide();
			});
			self.dh.find('.unlimited').click(function(){
				self.dh.hide();
				self.reset();
				self.hd.find('input[type="text"]').before($('<span class="seled" d="null,不限">不限<i class="delSel">×</i></span>'));
			});

			self.hd.click(function(e) {
				var target = $(e.target);
				if(target.is('.delSel')) {
					self.lastSelectItem = target.parent().attr('d').split(',');
					self.checkItem(false);
					e.stopPropagation();
					return;
				}
				self.dh.show();
			});

			// 选择一级大类
			self.dh.find('.lst1 ul').click(function(e) {
				var target = $(e.target);
				self.lastSelectItem = $(target).closest('li').attr('d').split(',');
				if(target.is('input')) {
					self.checkItem(target.is(':checked'));
				}else if(target.is('label')) {
					target = target.closest('li');
					self.currLevel = 2;
					$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
					self.lastSelectItem = $(target).attr('d').split(',');
					self.isChecked = $(target).find('input').is(':checked');
					self.isDisabled = $(target).find('input').is(':disabled');
					var url = self.options.url+self.lastSelectItem[0];
					if(self.lastSelectItem[0]==5000||self.lastSelectItem[0]==1100||self.lastSelectItem[0]==3100||self.lastSelectItem[0]==1200){
						url='/api/web/region.api?act=multiple&area='+self.lastSelectItem[0];
					}
					self.loadData(url,self.selectItem);

				}
			});
			// 选择二级大类
			self.dh.find('.lst2 ul').click(function(e) {
				var target = $(e.target);
				self.lastSelectItem = $(target).closest('li').attr('d').split(',');
				if(target.is('input')) {
					self.checkItem(target.is(':checked'));
				}else if(target.is('label')) {
					target = target.closest('li');
					if(target.is('li[isParent]')) {
						var target = target.closest('li');
						var input = $(target).find('input:visible');
						if(input.length<=0) {
							return;
						}
						var disabled = $(target).find('input').is(':disabled');
						var checked = $(target).find('input').is(':checked');

						if(disabled) {
							return;
						}
						if(checked) {
							$(target).find('input').removeAttr('checked');
						}else {
							$(target).find('input').attr('checked','checked');
						}
						self.checkItem(!checked);
						return;
					}
					self.currLevel = 3;
					$(target).siblings().removeClass(self.options.selectClass).end().addClass(self.options.selectClass);
					var url = self.options.url+self.lastSelectItem[0];
					self.isChecked = $(target).find('input').is(':checked');
					self.isDisabled = $(target).find('input').is(':disabled');
					self.loadData(url,self.selectItem);

				}
			});

			// 选择三级类
			self.dh.find('.lst3 ul').click(function(e) {
				var target = $(e.target);
				self.lastSelectItem = $(target).closest('li').attr('d').split(',');
				if(target.is('input')) {
					self.checkItem(target.is(':checked'));
				}else if(target.is('label')) {
					var target = target.closest('li');
					var input = $(target).find('input:visible');
					if(input.length<=0) {
						return;
					}
					var disabled = $(target).find('input').is(':disabled');
					var checked = $(target).find('input').is(':checked');

					if(disabled) {
						return;
					}
					if(checked) {
						$(target).find('input').removeAttr('checked');
					}else {
						$(target).find('input').attr('checked','checked');
					}
					self.checkItem(!checked);
				}
			});

			self.hc.mouseover(function(e){
				var target = $(e.target);
				if(target.is('li')){
					self.hc.find('li').removeClass('hov');
					target.addClass('hov');
				}
				else if(target.closest('li').length>0) {
					self.hc.find('li').removeClass('hov');
					target.closest('li').addClass('hov');
				}
			});

		};
		this.show =function () {
			this.initOptions();
			this.initHtml();
			this.initEvent();
		};
		this.getSelectValue = function() {
			var s  = new Array();
			for(var i= 0;i<self.options.selectItems.length;i+=1) {
				var id = self.options.selectItems[i];
				if(self.options.specialNumber.contains(id)) {
					var data =self.getArea(id);
					if(data!=null&&data.subAreas) {
						$.each(data.subAreas,function(i,n){
							s.push(n.area_id);
						});
					}
				}else{
					s.push(id);
				}
			}
			return s;
		};
		// 删除项
		this.delItems = function(data) {
			$.each(data,function(i,n){
				if(self.options.selectItems.contains(n.area_id)) {
					self.del(n.area_id,n.area_name);
				}
			});
		};

		// 删除已选项
		this.del = function(id,name) {
			self.hd.find('.seled[d="'+id+','+name+'"]').remove();
			self.options.selectItems.remove(id);
			self.hddElement.val(this.getSelectValue().join(','));
		};
		this.add = function(id,name) {
			self.hd.find('input[type="text"]').before($('<span class="seled" d="'+id+','+name+'">'+name+'<i class="delSel">×</i></span>'));
			if(!self.options.selectItems.contains(id)) {
				self.options.selectItems.push(id);
			}
			self.hddElement.val(this.getSelectValue().join(','));
		};
		// 选择事件
		this.loadData = function(url,callback,isAll,isSelf) {
			var data = self.getArea(self.lastSelectItem[0]);
			if(data!= null) {
				if(typeof callback == 'function') {
					if(isAll&&typeof data.subAreas !='undefined'){
						var helper = new Helper();
						helper.getDescendant(data.subAreas);
						callback(helper.arr);
					} else {
						if(isSelf) {
							var a = new Array();
							a.push(data);
							callback(a);
						} else if(typeof data.subAreas !='undefined'){
							callback(data.subAreas);
						}
					}
				}
			} else {
				// 选择项时	
				$.ajax({
					url: url,
					type: "get",
					dataType: "jsonp",
					success: function(data) {
						if(typeof callback == 'function') {
							callback(data);
						}
					}
				});
			}
		};

		this.checkMultiple = function() {
			var isLimit = false;
			if(self.options.selectItems.length+1>self.options.max) {
				//self.tipElement.addClass(self.options.tipClass);
				isLimit = true;
			}else {
				//self.tipElement.removeClass(self.options.tipClass);
				isLimit = false;
			}
			return isLimit;
		};

		// check项
		this.checkItem = function(isChecked) {
			var id = self.lastSelectItem[0],
				name = self.lastSelectItem[1],
				url = self.options.allSubUrl+ id,
				isSingle = self.isSingle();
			if(isChecked) {
				self.hd.find('.seled[d="null,不限"]').remove();
				if(self.checkMultiple()) {
					$.anchor('最多可以选择'+self.options.max+'项',{icon:'info'});
					self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
					return;
				}
				// 如果有将子类中的当前类选中
				self.dh.find('li[d="'+id+','+name+'"]').find('input').attr('checked','checked');
				// 如果有禁用并选中所有的子类
				self.loadData(url,function(data){
					self.delItems(data,true);
					$.each(data,function(i,n){
						self.dh.find('li[d="'+n.area_id+','+n.area_name+'"]').find('input').attr('checked','checked').attr('disabled','disabled');
					});
				},true);
				// 新增当前项到inPut中 
				self.add(id,name);

			} else {
				self.dh.find('li[d="'+id+','+name+'"]').find('input').removeAttr('checked');
				self.loadData(url,function(data){
					$.each(data,function(i,n){
						self.dh.find('li[d="'+n.area_id+','+n.area_name+'"]').find('input').removeAttr('checked').removeAttr('disabled');
					});
				},true);
				self.del(id,name);
			}
			if(typeof self.options.onSelect =='function') {
				self.options.onSelect();
			}
		};


		// 是否存在
		this.isExists = function(id) {
			return self.options.selectItems.contains(id);
		};
		// 是否单选
		this.isSingle = function(id) {
			return self.options.type=='single';
		};
		this.selectItem= function(data) {
			var arr = new Array(),
				pid = self.lastSelectItem[0],
				pname = self.lastSelectItem[1],
				isSingle = self.isSingle(),
				createItem = function(isSigle,pid,id,name,isdisabled,isChecked,isParent,addClass,hasControl) {
					var s = new StringBuilder();
					s.Append('<li d="'+id+','+name+'"');
					if(addClass) {
						s.Append(' class= "ths" ');
					}
					if(isParent) {
						s.Append(' isParent="true"');
					}
					s.Append('>');
					if(isSigle) {
						s.Append('<input type="radio" class="chb" name="'+self.options.inputName+'" ');
					} else {
						s.Append('<input type="checkbox"  class="chb" name="'+self.options.inputName+'" ');
					}
					if(isdisabled) {
						s.Append('disabled="disabled"');
						if(!self.isSingle()) {
							s.Append(' checked="checked"');
						}
					} else if (isChecked) {
						s.Append(' checked="checked"');
					}
					if(hasControl){
						s.Append('style="display:none;"');
					}
					s.Append(' />');

					if(isParent) {
						s.Append('<label>全选</label>');
					} else {
						s.Append('<label>'+name+'</label>');
					}
					s.Append('</li>');
					return s.toString();
				}

			if(self.currLevel>=self.options.unLimitedLevel&&!isSingle) { // 是否在子类中显示当前类
				arr.push(createItem(isSingle,pid,pid,pname,self.isDisabled,self.isChecked,true,true,false));
			}
			if(self.currLevel == 1) {
				// 一级
				self.dh.find('.lst1 ul').empty();
				arr= [];
				var bool = false;
				$.each(data,function(i,n){
					bool = true;
					var item = createItem(isSingle,pid,n.area_id,n.area_name,false,self.isExists(n.area_id),false,false,true);
					arr.push(item);
				});
				if(bool) {
					self.dh.find('.lst1 ul').html(arr.join(''));
				} else {
					self.dh.find('.lst1 ul').html(arr.join(''));
				}
			} else if(self.currLevel == 2) {
				self.dh.find('.lst3 ul').empty();
				var bool = false;
				$.each(data,function(i,n){
					bool = true;
					var item = createItem(isSingle,pid,n.area_id,n.area_name,self.isChecked,self.isExists(n.area_id),false,false,true);
					arr.push(item);
				});
				if(bool) {
					self.dh.find('.lst2 ul').html(arr.join(''));
				} else {
					self.dh.find('.lst2 ul').html(arr.join(''));
				}
			} else {
				self.dh.find('.lst3 ul').empty();
				var bool = false;
				$.each(data,function(i,n){
					bool = true;
					var item = createItem(isSingle,pid,n.area_id,n.area_name,self.isChecked,self.isExists(n.area_id),false,false,false);
					arr.push(item);
				});
				if(bool) {
					self.dh.find('.lst3 ul').html(arr.join(''));
				} else {
					self.dh.find('.lst3 ul').html(arr.join(''));
				}
			}
		};

		this.setControl = function(data) {
			$.each(data,function(i,n){
				self.lastSelectItem[0] = n.area_id;
				self.lastSelectItem[1] = n.area_name;
				self.checkItem(true,self.isExists(n.parent_id),self.isExists(n.area_id));
			});
		}
		this.reset = function() {
			self.options.selectItems = [];
			// this.hc.find('.lst2 ul li').remove();
			// this.hc.find('.lst3 ul li').remove();	
			this.hc.find('input[type="checkbox"]').removeAttr('checked').removeAttr('disabled');
			this.hd.find('.seled').remove();
			this.$element.find('input[name="'+this.options.hddName+'"]').val(' ');

		}

		// 设置值
		this.setValue = function(items) {
			var values = items.split(','),
				newArr = new Array();
			var ids = values.concat(self.options.selectItems);
			values = self.checkSpecialNumber(ids);
			for(var i =0,len = values.length;i<len;i+=1) {
				if(!self.isExists(values[i])) {
					//self.options.selectItems.push(values[i]);
					newArr.push(values[i]);
				}
			}
			for(var i =0; i<newArr.length;i+=1) {
				self.lastSelectItem =[newArr[i],' '];
				//self.options.selectItems = [];
				var areaurl = self.options.singleUrl+newArr[i];
				self.loadData(areaurl,self.setControl,false,true);
			}
		};

		// 获取数据
		this.getValue = function() {
			var v=new Array();
			var specialV = new Array();
			this.hd.find('.seled').each(function(){
				var area = $(this).attr('d');
				var id = area.split(',')[0];
				if(self.options.specialNumber.contains(id)) {
					var data =self.getArea(id);
					var jsonSpecialArea = [];
					if(data!=null&&data.subAreas) {
						//var jsonSpecialArea = {name:data.area_id,ids:[]};
						$.each(data.subAreas,function(i,n){
							jsonSpecialArea.push(n.area_id);
						});
					}
					v.push({name:area.split(',')[1],ids:jsonSpecialArea})
				} else {
					v.push({name:area.split(',')[1],ids:[area.split(',')[0]]});
				}
			});
			return v;
		};

		$('body').click(function(e){
			// 检测发生在body中的点击事件，隐藏日历控件
			var cell = $(e.target);
			if (cell){
				var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
				var inID = self.$element.attr('id');
				var isTagert = false;
				try{
					// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
					isTagert = tgID != inID && $(cell).closest('#' + inID).length <= 0;
				}
				catch (e){
					isTagert = true;
				}
				if (isTagert){
					self.dh.hide();
				}
			}
		});
	}

	var old = $.fn.multiplearea;
	$.fn.multiplearea = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.multiplearea');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('bs.multiplearea', (data = new area(this, options)));
				data.show();
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	}
	$.fn.setMultipleAreaValue = function(ids) {
		var area = $(this).data('bs.multiplearea');
		area.setValue(ids);
	};
	$.fn.getMultipleareaValue = function() {
		var area = $(this).data('bs.multiplearea');
		return area.getValue();
	};
	$.fn.resetMultipleareaValue =function() {
		var area = $(this).data('bs.multiplearea');
		return area.reset();
	};
	$.fn.multiplearea.Constructor = area;
	// 解决冲突	
	$.fn.multiplearea.noConflict = function () {
		$.fn.multiplearea = old;
		return this;
	}

	return $;
});/**
 *  jquery certificate plug-in  1.1
 *  Copyright (c)  2013 jon
 */
define('jpjob.jobCertificate', function(require, exports, module){

	var $ = require('jquery');
	var Cert = function (element,opt) {
		this.$element = element;
		this._defaults = {
			template:'    <div class="dropLst">'+
			'	  <div class="dropLstCon">'+
			'		<div class="dipTab">'+
			'		  <div class="dipTabL"><a class="jpFntWes" href="#"></a></div>'+
			'		  <div class="con">'+
			'			<div class="scroll">'+
			'			</div>'+
			'		  </div>'+
			'		  <div class="dipTabR"><a class="jpFntWes" href="#"></a></div>'+
			'		</div>'+
			'		<div class="dipTabC">'+
			'		</div>'+
			'	  </div>'+
			'	</div>',
			cerName:null
		};
		this.options = $.extend({}, this._defaults,opt);
		this.wrap = $(this.options.template).appendTo(this.$element);
		this.left = this.$element.find('.dipTabL a.jpFntWes');
		this.right = this.$element.find('.dipTabR a.jpFntWes');
		this.header = this.$element.find('.scroll');
		this.content = this.$element.find('.dipTabC');
		var self = this;

		return {
			init: function (category) {
				var header = ['热门证书','服务行业','普工类','驾照/操作证','建筑/工程类','计算机证书','语言证书','财务/审计','商务类','教师/律师','医疗/卫生','职称证书'];
				var b = ["大学英语四级~C1驾照~健康证~秘书资格证~房地产经纪人~全国计算机二级证书~C2驾照~护工证~会计从业资格证~期货从业资格证~CAD绘图师~导游证~家政员资格证~助理工程师~企业培训师~一级建造师~厨师证~教师资格证~项目管理师~消防中控证~二级建造师~美容师资格证~早教资格证~物业管理师~安全员资格证", "导游证~厨师证~月嫂证~育婴师资格证~家政员资格证~早教资格证~护工证~宠物美容师资格证~发型师资格证~美容师资格证~化妆师资格证~按摩师资格证~美甲师资格证~救生员证~潜水证~公共营养师~调酒师资格证~音响调音师~放映师资格证~播音员主持人资格证", "制冷工上岗证~水暖工上岗证~防水工上岗证~管道工上岗证~锅炉工上岗证~司炉工上岗证~直燃机操作员上岗证~电工上岗证~水电工上岗证~空调工上岗证~焊工上岗证~装配钳工上岗证~机修钳工上岗证~木工上岗证~绿化工上岗证~车工上岗证~铣工上岗证~磨工上岗证~镗工上岗证~冷作钣金工上岗证~涂装工上岗证~砌筑工上岗证~电梯工上岗证~家电维修工上岗证", "A1驾照~A2驾照~A3驾照~B1驾照~B2驾照~C1驾照~C2驾照~C3驾照~客运资格证~货运资格证~机动车驾驶员资格证~危险物品运输证~特种车操作证~吊车操作证~叉车操作证~铲车操作证~挖掘机操作证", "一级建造师~建设工程造价员~造价工程师~建筑弱电工程师~注册咨询工程师~二级建造师~建筑施工员~注册建筑师~房地产估价师~质检工程师~CAD绘图师~建筑预算员~注册土木工程师~物业管理师~消防中控证~项目经理资格证~建筑材料员~注册结构工程师~装饰预算员~安全工程师~注册监理工程师~建筑安全员~电气工程师~设备监理师~园艺师资格证", "全国计算机软件证书~全国计算机一级证书~全国计算机二级证书~全国计算机三级证书~全国计算机四级证书~计算机初级证书~程序员证书~系统分析员证~MCSE~MCDST~MCAD~MCP~MCSA~MCSD~MCDBA~CCIE~CCNA~CCNP~CCCP~CCIP~CAD绘图师~MCT", "大学英语四级~中级口译证书~托业~全国公共英语~日语五级~大学英语六级~高级口译证书~GRE~俄语四级~日语四级~普通话一级乙等~英语专业四级~GMAT~法语四级~日语三级~普通话一级甲等~英语专业八级~雅思~法语六级~日语二级~普通话二级甲等~托福~剑桥商务英语~德语六级~日语一级", "会计上岗证~会计从业资格证~注册会计师~注册税务师~审计师资格证~国际财务会计", "秘书资格证~保险经纪人~保险代理人~精算师资格证~房地产经纪人~心理咨询师~企业法律顾问资格证~企业培训师~职业经理人~理财规划师~项目管理师~人力资源管理师~二手车评估师~汽车美容师~物流师资格证~策划师资格证~期货从业资格证~证券投资分析师~注册拍卖师~安全员资格证~报关员资格证~报检员资格证~单证员资格证", "教师~教师资格证~幼师资格证~亲子教师资格证~蒙氏教师资格证|律师~律师资格证~高级律师~副高级律师~中级律师~初级律师", "护士资格证~护师资格证~临床执业医师~临床助理医师~中医执业医师~中医助理医师~中西医执业医师~中西医助理医师~口腔执业医师~口腔助理医师~公共执业医师~公共助理医师~执业药师资格证~中医师资格证~主管护师资格证~检验师资格证", "会计~助理会计师~会计师~高级会计师|工程师~助理工程师~初级工程师~中级工程师~高级工程师|医师~医师~主治医师~副主任医师~主任医师|经济~助理经济师~初级经济师~中级经济师~高级经济师|统计~助理统计师~统计师~高级统计师"];
				var h = new Array(),
					index = 0;
				for(var k = 0,lenk = header.length;k<lenk;++k) {
					var p = '';
					/*
					 if(k ==0 )
					 {
					 p='cu';
					 }
					 h.push('<a href="javascript:void(0);" class="'+p+'">'+header[k]+'</a>');
					 */
					if(typeof category =='string') {
						if(header[k]==category) {
							index = k;
							p='cu';
						}

					}else
					{
						if(k ==0 )
						{
							index = k ;
							p='cu';
						}
					}
					h.push('<a href="javascript:void(0);" class="'+p+'">'+header[k]+'</a>');
				}
				self.header.append(h.join(''));
				var c = '';
				for (var i = 0, len = b.length; i < len; ++i) {
					var d = b[i];
					if (i != 9 && i != 11) {
						//var e = (i == 0) ? '' : ' none';
						var e = (i == index) ? '' : ' none';
						c += '<div class="dipTabCon pt '+e+'"><ul>';
						var f = d.split('~');
						for (var j = 0, lenj = f.length; j < lenj; ++j) {
							c += '<li><a href="javascript:;" incTag="false">' + f[j] + '</a></li>'
						}
						c += '</ul><div class="clear"></div></div>'
					} else {
						c += '<div class="dipTabCon oth none">';
						var g = d.split('|');
						for (var j = 0, lenj = g.length; j < lenj; ++j) {
							var h = g[j].split('~');
							c += '<dl><dt>' + h[0] + '</dt><dd><ul>';
							for (var k = 1, lenk = h.length; k < lenk; ++k) {
								c += '<li><a href="javascript:;">' + h[k] + '</a></li>'
							}
							c += '</ul><div class="clear"></div></dd></dl>'
						}
						c += '</div>'
					}
				}
				self.content.append(c);
				self.left.mouseover(function () {
					var a = $(this);
					self.header.animate({
						left: "0"
					}, 50);
				});
				self.right.mouseover(function () {
					var a = $(this);
					self.header.animate({
						left: "-587px"
					}, 50);
				});

				self.header.find('a').click(function() {
					var index = $(this).siblings('a.cu').removeClass('cu').end().addClass('cu').index();
					self.content.find('.dipTabCon ').eq(index).siblings().addClass('none').end().removeClass('none');

				});

				// 选择事件
				self.content.find("a").click(function () {
					$('#'+self.options.cerName).val($(this).text()).focus();
					self.wrap.hide();
					self.options.select && self.options.select();
				});

				// 显示隐藏
				var cerInput = $('#'+self.options.cerName),
					cerBtn = cerInput.prev();
				if(self.options.isBtn && cerBtn.length){
					cerBtn.click(toggleWrap);
				} else {
					cerInput.click(toggleWrap);
				}
				cerInput.on('keyup', function(){
					if(self.options.isBtn){
						if(self.wrap.is(':visible')){
							self.wrap.hide();
						}
					} else {
						if($(this).val()!='') {
							self.wrap.hide();
						} else {
							self.wrap.show();
						}
					}
				}).on('blur', function(){
					self.options.blur && self.options.blur();
				});

				function toggleWrap(){
					if (!self.wrap.is(':hidden')) {
						self.wrap.hide();
					} else {
						self.wrap.show();
					}
				}

				var inID = self.$element.attr('id');
				$('body').click(function(e){
					// 检测发生在body中的点击事件，隐藏日历控件
					var cell = $(e.target);
					if (cell)
					{
						var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
						var isTagert = false;
						try
						{
							// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
							isTagert = (tgID != inID) && ($(cell).closest('#' + inID).length <= 0);
						}
						catch (e)
						{
							isTagert = true;
						}
						if (isTagert)
						{
							self.wrap.hide();
						}
					}
				});
			}
		}
	};
	$.fn.certificate = function (option) {
		var $this   = $(this);
		var data    = $this.data('bs.cer');
		var options = typeof option == 'object' && option;
		if (!data) {
			data = new Cert($this, options);
			data.init(options.category);
			$this.data('bs.cer', data);
		}
	}
	return $;
});
/**
 *   jQuery  skill plug-in 1.1
 *   Copyright (c)  2013 jon
 */

define('jpjob.jobSkill', function(require, exports, module){

	var $ = require('jquery');
	var Skill = function(element,opt) {
		this.$element = element;
		this._defaults = {
			template:' <div class="dropLst" >'+
			'	<div class="dropLstCon">'+
			'		<div class="tecTab">'+
			'		</div>'+
			'		<div class="tecTabC">'+
			'		</div>'+
			'	</div>'+
			' </div>',
			skillName:null
		};
		this.options = $.extend({}, this._defaults,opt);
		this.wrap = $(this.options.template).appendTo(this.$element);
		this.header = this.$element.find('.tecTab');
		this.content = this.$element.find('.tecTabC');
		var self = this;
		return {
			init: function() {
				var header = ['IT/计算机','家政/安保','美容/美发','健身/保健','烹饪/餐饮','影视/娱乐','汽车美容','物业维修'];
				var m = [{
					u: [{
						n: "Word",
						v: 0
					},
						{
							n: "Excel",
							v: 0
						},
						{
							n: "PowerPoint",
							v: 0
						},
						{
							n: "Visio",
							v: 0
						},
						{
							n: "Oracle ERP",
							v: 0
						},
						{
							n: "Photoshop",
							v: 0
						},
						{
							n: "CorelDraw",
							v: 0
						},
						{
							n: "Illustrator",
							v: 0
						},
						{
							n: "3DMAX",
							v: 0
						},
						{
							n: "Flash",
							v: 0
						},
						{
							n: "Java",
							v: 0
						},
						{
							n: "C",
							v: 0
						},
						{
							n: "C#",
							v: 0
						},
						{
							n: "C++",
							v: 0
						},
						{
							n: "PHP",
							v: 0
						},
						{
							n: "HTML ",
							v: 0
						},
						{
							n: "Dreamweaver",
							v: 0
						},
						{
							n: "JavaScript",
							v: 0
						},
						{
							n: "Fireworks",
							v: 0
						},
						{
							n: "AutoCAD",
							v: 0
						},
						{
							n: "Pro/E",
							v: 0
						},
						{
							n: "AutoCAD",
							v: 0
						},
						{
							n: "Solidworks",
							v: 0
						},
						{
							n: "UG",
							v: 0
						},
						{
							n: "单片机",
							v: 0
						}],
					s: [],
					m: [{
						n: "办公/企业管理",
						v: [{
							n: "Word",
							v: 0
						},
							{
								n: "Excel",
								v: 0
							},
							{
								n: "PowerPoint",
								v: 0
							},
							{
								n: "Outlook",
								v: 0
							},
							{
								n: "用友财务管理软件",
								v: 0
							},
							{
								n: "SAP",
								v: 0
							},
							{
								n: "SAS",
								v: 0
							},
							{
								n: "Visio",
								v: 0
							},
							{
								n: "Oracle ERP",
								v: 0
							},
							{
								n: "金蝶财务管理软件",
								v: 0
							}]
					},
						{
							n: "程序设计",
							v: [{
								n: "Java",
								v: 0
							},
								{
									n: "PHP",
									v: 0
								},
								{
									n: "Lisp",
									v: 0
								},
								{
									n: "Lua",
									v: 0
								},
								{
									n: "JPA",
									v: 0
								},
								{
									n: "C",
									v: 0
								},
								{
									n: "VB",
									v: 0
								},
								{
									n: "Delphi",
									v: 0
								},
								{
									n: "Ada",
									v: 0
								},
								{
									n: "IOS",
									v: 0
								},
								{
									n: "C#",
									v: 0
								},
								{
									n: "Python",
									v: 0
								},
								{
									n: "VB .net",
									v: 0
								},
								{
									n: "PL/SQL",
									v: 0
								},
								{
									n: "Android",
									v: 0
								},
								{
									n: "C++",
									v: 0
								},
								{
									n: "Perl",
									v: 0
								},
								{
									n: "Transact-SQL",
									v: 0
								},
								{
									n: "MATLAB",
									v: 0
								},
								{
									n: "SSH三大框架",
									v: 0
								},
								{
									n: "Objective-C",
									v: 0
								},
								{
									n: "Ruby",
									v: 0
								},
								{
									n: "Pascal",
									v: 0
								},
								{
									n: "VC++",
									v: 0
								},
								{
									n: "Ibatis",
									v: 0
								},
								{
									n: "Ajax",
									v: 0
								},
								{
									n: "ASP",
									v: 0
								},
								{
									n: "JSP",
									v: 0
								},
								{
									n: "MFC",
									v: 0
								},
								{
									n: "Qt",
									v: 0
								}]
						},
						{
							n: "电子/硬件设计类",
							v: [{
								n: "FPGA",
								v: 0
							},
								{
									n: "VHDL",
									v: 0
								},
								{
									n: "Protel",
									v: 0
								},
								{
									n: "DSP",
									v: 0
								},
								{
									n: "嵌入式系统",
									v: 0
								},
								{
									n: "PLC",
									v: 0
								},
								{
									n: "CPLD",
									v: 0
								},
								{
									n: "ARM",
									v: 0
								},
								{
									n: "单片机",
									v: 0
								},
								{
									n: "MCGS触屏软件",
									v: 0
								},
								{
									n: "仿真软件",
									v: 0
								}]
						},
						{
							n: "数据库类",
							v: [{
								n: "Access",
								v: 0
							},
								{
									n: "MySQL ",
									v: 0
								},
								{
									n: "SQLServer",
									v: 0
								},
								{
									n: "Oracle",
									v: 0
								},
								{
									n: "SPSS",
									v: 0
								},
								{
									n: "DB2",
									v: 0
								}]
						},
						{
							n: "操作系统类",
							v: [{
								n: "Linux",
								v: 0
							},
								{
									n: "Unix",
									v: 0
								},
								{
									n: "Windows",
									v: 0
								},
								{
									n: "Shell 编程",
									v: 0
								},
								{
									n: "Socket编程",
									v: 0
								},
								{
									n: "多线程编程",
									v: 0
								}]
						},
						{
							n: "网页技术类",
							v: [{
								n: "HTML ",
								v: 0
							},
								{
									n: "SOAP",
									v: 0
								},
								{
									n: "CSS+DIV",
									v: 0
								},
								{
									n: "JavaScript",
									v: 0
								},
								{
									n: "Fireworks",
									v: 0
								},
								{
									n: "jquery",
									v: 0
								},
								{
									n: "XML",
									v: 0
								},
								{
									n: "VBscript",
									v: 0
								},
								{
									n: "Web Service",
									v: 0
								},
								{
									n: "Dreamweaver",
									v: 0
								}]
						},
						{
							n: "工程制图类",
							v: [{
								n: "AutoCAD",
								v: 0
							},
								{
									n: "Solidworks",
									v: 0
								},
								{
									n: "UG",
									v: 0
								},
								{
									n: "3DMAX",
									v: 0
								},
								{
									n: "PFD/PID",
									v: 0
								},
								{
									n: "Pro/E",
									v: 0
								},
								{
									n: "NavisWorks",
									v: 0
								},
								{
									n: "Catia",
									v: 0
								},
								{
									n: "Plant 3D",
									v: 0
								},
								{
									n: "天正",
									v: 0
								},
								{
									n: "LabVIEW",
									v: 0
								},
								{
									n: "chemoffice",
									v: 0
								},
								{
									n: "origin",
									v: 0
								},
								{
									n: "ASPEN",
									v: 0
								},
								{
									n: "chemCAD",
									v: 0
								}]
						},
						{
							n: "设计类软件",
							v: [{
								n: "Photoshop",
								v: 0
							},
								{
									n: "Premiere",
									v: 0
								},
								{
									n: "Axure",
									v: 0
								},
								{
									n: "Pagemaker",
									v: 0
								},
								{
									n: "Illustrator",
									v: 0
								},
								{
									n: "CorelDraw",
									v: 0
								},
								{
									n: "After Effect",
									v: 0
								},
								{
									n: "3DMAX",
									v: 0
								},
								{
									n: "Painter",
									v: 0
								},
								{
									n: "Fireworks",
									v: 0
								},
								{
									n: "InDesign",
									v: 0
								},
								{
									n: "Edius",
									v: 0
								},
								{
									n: "Flash",
									v: 0
								},
								{
									n: "方正飞腾",
									v: 0
								},
								{
									n: "Rhino",
									v: 0
								},
								{
									n: "Authorware",
									v: 0
								},
								{
									n: "MAYA",
									v: 0
								}]
						},
						{
							n: "影视/后期",
							v: [{
								n: "After Effect",
								v: 0
							},
								{
									n: "Edius",
									v: 0
								},
								{
									n: "视频格式转换软件",
									v: 0
								},
								{
									n: "DS",
									v: 0
								},
								{
									n: "FinalCutPro",
									v: 0
								},
								{
									n: "AvidXpressPro",
									v: 0
								},
								{
									n: "Avid",
									v: 0
								},
								{
									n: "VCD/DVD光盘制作",
									v: 0
								},
								{
									n: "DPS",
									v: 0
								},
								{
									n: "Fire/Srnoke系统",
									v: 0
								},
								{
									n: "暗房技术",
									v: 0
								},
								{
									n: "DVStorm",
									v: 0
								}]
						}]
				},
					{
						u: [],
						s: [{
							n: "家政保洁",
							v: [{
								n: "早教",
								v: 0
							},
								{
									n: "烹饪",
									v: 0
								},
								{
									n: "催乳",
									v: 0
								},
								{
									n: "干洗",
									v: 0
								},
								{
									n: "婴儿抚触",
									v: 0
								},
								{
									n: "营养辅食",
									v: 0
								},
								{
									n: "产妇护理",
									v: 0
								},
								{
									n: "熨烫",
									v: 0
								},
								{
									n: "教婴儿游泳",
									v: 0
								},
								{
									n: "做月子餐",
									v: 0
								},
								{
									n: "心理疏导",
									v: 0
								},
								{
									n: "中医按摩",
									v: 0
								}]
						},
							{
								n: "安保",
								v: [{
									n: "散打",
									v: 0
								},
									{
										n: "擒拿",
										v: 0
									}]
							}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "美发",
							v: [{
								n: "染烫",
								v: 0
							},
								{
									n: "吹风造型",
									v: 0
								},
								{
									n: "接发",
									v: 0
								},
								{
									n: "头发护理",
									v: 0
								}]
						},
							{
								n: "美容/美体",
								v: [{
									n: "刮痧",
									v: 0
								},
									{
										n: "眼部护理",
										v: 0
									},
									{
										n: "胃肠排毒",
										v: 0
									},
									{
										n: "八髎保养",
										v: 0
									},
									{
										n: "拔罐",
										v: 0
									},
									{
										n: "手部护理",
										v: 0
									},
									{
										n: "淋巴排毒",
										v: 0
									},
									{
										n: "乳腺保养（丰胸）",
										v: 0
									},
									{
										n: "针清粉刺",
										v: 0
									},
									{
										n: "脱毛护理",
										v: 0
									},
									{
										n: "美容沙龙",
										v: 0
									},
									{
										n: "卵巢保养",
										v: 0
									},
									{
										n: "问题性皮肤治疗",
										v: 0
									},
									{
										n: "美腿护理",
										v: 0
									},
									{
										n: "SPA熏香美体",
										v: 0
									}]
							},
							{
								n: "化妆师",
								v: [{
									n: "艺术写真造型",
									v: 0
								},
									{
										n: "舞台妆",
										v: 0
									},
									{
										n: "特效妆",
										v: 0
									},
									{
										n: "新娘妆",
										v: 0
									},
									{
										n: "立体矫正化术",
										v: 0
									},
									{
										n: "影视妆",
										v: 0
									},
									{
										n: "主持人妆",
										v: 0
									},
									{
										n: "时尚生活妆",
										v: 0
									}]
							},
							{
								n: "美甲师",
								v: [{
									n: "基础甲护理",
									v: 0
								},
									{
										n: "水晶美甲",
										v: 0
									},
									{
										n: "延长贴片",
										v: 0
									},
									{
										n: "嫁接睫毛",
										v: 0
									},
									{
										n: "手足营养护理",
										v: 0
									},
									{
										n: "光疗美甲",
										v: 0
									},
									{
										n: "艺术雕花",
										v: 0
									},
									{
										n: "蜜蜡脱毛",
										v: 0
									}]
							}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "运动/健身教练",
							v: [{
								n: "营养学",
								v: 0
							},
								{
									n: "有氧训练",
									v: 0
								},
								{
									n: "抗阻力训练",
									v: 0
								},
								{
									n: "体适能基本技能",
									v: 0
								},
								{
									n: "急救",
									v: 0
								},
								{
									n: "拉伸技术",
									v: 0
								},
								{
									n: "运动损伤处理",
									v: 0
								},
								{
									n: "",
									v: 0
								}]
						},
							{
								n: "瑜伽/舞蹈老师",
								v: [{
									n: "街舞",
									v: 0
								},
									{
										n: "有氧派对",
										v: 0
									},
									{
										n: "动感单车",
										v: 0
									},
									{
										n: "时尚踏板操",
										v: 0
									},
									{
										n: "肚皮舞",
										v: 0
									},
									{
										n: "有氧舞蹈",
										v: 0
									},
									{
										n: "身心平衡",
										v: 0
									},
									{
										n: "极限搏击操",
										v: 0
									},
									{
										n: "尊巴",
										v: 0
									},
									{
										n: "有氧拉丁",
										v: 0
									},
									{
										n: "普拉提",
										v: 0
									},
									{
										n: "现代爵士舞",
										v: 0
									}]
							},
							{
								n: "推拿按摩/足疗",
								v: [{
									n: "拔罐",
									v: 0
								},
									{
										n: "中医美容",
										v: 0
									},
									{
										n: "乳腺保养",
										v: 0
									},
									{
										n: "嫁接睫毛",
										v: 0
									},
									{
										n: "针灸",
										v: 0
									},
									{
										n: "芳香SPA",
										v: 0
									},
									{
										n: "卵巢保养",
										v: 0
									},
									{
										n: "蜜蜡脱毛",
										v: 0
									},
									{
										n: "中医按摩",
										v: 0
									},
									{
										n: "胃肠排毒",
										v: 0
									},
									{
										n: "腰部保养",
										v: 0
									},
									{
										n: "手足营养护理",
										v: 0
									},
									{
										n: "中医减肥",
										v: 0
									},
									{
										n: "淋巴排毒",
										v: 0
									},
									{
										n: "八髎保养",
										v: 0
									},
									{
										n: "推十四经络",
										v: 0
									}]
							}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "厨师/厨师长",
							v: [{
								n: "川菜",
								v: 0
							},
								{
									n: "湘菜",
									v: 0
								},
								{
									n: "鲁菜",
									v: 0
								},
								{
									n: "粤菜",
									v: 0
								},
								{
									n: "苏菜",
									v: 0
								},
								{
									n: "闽菜",
									v: 0
								},
								{
									n: "浙菜",
									v: 0
								},
								{
									n: "徽菜",
									v: 0
								},
								{
									n: "北京菜",
									v: 0
								},
								{
									n: "东北菜",
									v: 0
								},
								{
									n: "上海菜",
									v: 0
								},
								{
									n: "陕西菜",
									v: 0
								},
								{
									n: "台湾菜",
									v: 0
								},
								{
									n: "清真",
									v: 0
								},
								{
									n: "海鲜",
									v: 0
								},
								{
									n: "面点",
									v: 0
								}]
						},
							{
								n: "茶艺师",
								v: [{
									n: "准备与演示",
									v: 0
								},
									{
										n: "茶饮服务",
										v: 0
									},
									{
										n: "茶叶保健服务",
										v: 0
									},
									{
										n: "茶艺馆布局设计",
										v: 0
									},
									{
										n: "茶艺表演",
										v: 0
									},
									{
										n: "茶会组织",
										v: 0
									},
									{
										n: "茶艺创新",
										v: 0
									}]
							}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "影视/娱乐",
							v: [{
								n: "电视主持",
								v: 0
							},
								{
									n: "车展主持",
									v: 0
								},
								{
									n: "婚宴主持",
									v: 0
								},
								{
									n: "展会主持",
									v: 0
								},
								{
									n: "广播主持",
									v: 0
								},
								{
									n: "年会主持",
									v: 0
								},
								{
									n: "拍卖会主持",
									v: 0
								}]
						}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "汽车美容",
							v: [{
								n: "抛光",
								v: 0
							},
								{
									n: "清洗发动",
									v: 0
								},
								{
									n: "封釉",
									v: 0
								},
								{
									n: "精细镀膜",
									v: 0
								},
								{
									n: "打蜡",
									v: 0
								},
								{
									n: "内饰清洗",
									v: 0
								}]
						}],
						m: []
					},
					{
						u: [],
						s: [{
							n: "物业维修",
							v: [{
								n: "门窗维修",
								v: 0
							},
								{
									n: "电梯维修",
									v: 0
								},
								{
									n: "管道维修",
									v: 0
								},
								{
									n: "弱电维修",
									v: 0
								},
								{
									n: "空调维修",
									v: 0
								},
								{
									n: "电焊维修",
									v: 0
								},
								{
									n: "暖气维修",
									v: 0
								},
								{
									n: "给排水维修",
									v: 0
								}]
						}],
						m: []
					}];
				var k = new Array();
				for(var ij = 0,len = header.length; ij<len;++ij)　{
					var p = '';
					if(ij ==0 )
					{
						p='cu';
					}
					k.push('<a href="javascript:void(0);" noclose="3" class="'+p+'">'+header[ij]+'</a>');
				}
				self.header.append(k.join(''));
				var content = new Array();;
				for (var i = 0,
						 len = m.length; i < len; ++i) {
					var n ='<div class="tecTabCon #class">';
					var s = m[i];
					if (s.u.length > 0) {
						n = n.replace('#class','cpt');
						n += '<div class="tecComUse">';
						n += '<ul>';
						for (var j = 0,
								 lenj = s.u.length; j < lenj; ++j) {
							n += '<li><a href="javascript:;" noclose="0">' + s.u[j].n + '</a></li>'
						}
						n += '</ul><div class="clear"></div></div>'
					}
					if (s.s.length > 0) {
						n = n.replace('#class','same none');
						for (var j = 0,
								 lenj = s.s.length; j < lenj; ++j) {
							var o = s.s[j];
							n += '<dl><dt>' + o.n + '</dt><dd><ul>';
							for (var k = 0,
									 lenk = o.v.length; k < lenk; ++k) {
								n += '<li><a href="javascript:;" noclose="0">' + o.v[k].n + '</a></li>'
							}
							n += '</ul></dd></dl>'
						}
					}
					if (s.m.length > 0) {
						n += '<div class="tecComType"><ul>';
						for (var j = 0,
								 lenj = s.m.length; j < lenj; ++j) {
							var q = s.m[j];
							n += '<li i="' + j + '"><a href="javascript:;" noclose="1">' + q.n + '<i class="jpFntWes">&#xf0d7;</i></a></li>';
							if (j % 5 == 4 || j == lenj - 1) {
								n += '<li style="display:none;" class="divJobCate3"></li>';
							}
							//n += '<li style="display:none;" class="divJobCate3"></li>';
						}
						n += '</ul></div>'
					}
					n += '</div>';
					content.push(n);
				}
				self.content.append(content.join(''));

				var skillInput = $('#'+self.options.skillName),
					skillBtn = skillInput.prev();

				if(self.options.isBtn && skillBtn.length){
					skillBtn.click(toggleWrap);
				} else {
					skillInput.click(toggleWrap);
				}
				skillInput.on('keyup', function(){
					if(self.options.isBtn){
						if(self.wrap.is(':visible')){
							self.wrap.hide();
						}
					} else {
						if($(this).val()!='') {
							self.wrap.hide();
						} else {
							self.wrap.show();
						}
					}
				}).on('blur', function(){
					self.options.blur && self.options.blur();
				});

				function toggleWrap(){
					if (!self.wrap.is(':hidden')) {
						self.wrap.hide();
					} else {
						self.wrap.show();
					}
				}

				var r = function() {
					var a = $(this);
					var b = a.attr("noclose");
					var c = self.wrap;
					var d = $('#'+self.options.skillName);
					switch (b) {
						case "0":
							d.val(a.text());
							c.hide();
							break;
						case "1":
							var e = a.parent();
							var f = e.attr("i");
							var g = e.hasClass("cu");
							if (g) {
								e.removeClass("cu");
								e.siblings(".divJobCate3").hide();
								return;
							}
							e.addClass("cu").siblings(".cu").removeClass("cu");
							var h = e.next();
							for (var i = 0; i < 4 && !h.hasClass("divJobCate3"); ++i) {
								if (h.next()) {
									h = h.next()
								}
							}
							var j = m[0].m[f].v;
							var k = '';
							for (var i = 0,
									 len = j.length; i < len; ++i) {
								var l = j[i];
								k += '<div><a href="javascript:;" noclose="2">' + l.n + '</a></div>'
							}
							h.html(k).show().siblings(".divJobCate3").hide();
							h.find("a").bind("click", r);
							break;
						case "2":
							d.val(a.text());
							c.hide();
							a.parents(".divJobCate3").hide();
							a.parents("li").siblings(".cu").removeClass("cu");
						case "3":
							var index = a.siblings('a').removeClass('cu').end().addClass('cu').index();
							self.content.find('.tecTabCon ').eq(index).siblings().addClass('none').end().removeClass('none');
							break;
						default:
							break
					}
					self.options.select && self.options.select();
				};
				self.wrap.find('a').click(r);
				$('body').click(function(e){
					// 检测发生在body中的点击事件，隐藏日历控件
					var cell = $(e.target);
					if (cell)
					{
						var tgID = $(cell).attr('id') == '' ? "string" : $(cell).attr('id');
						var inID = self.$element.attr('id');
						var isTagert = false;
						try
						{
							// 如果事件触发元素不是Input元素 并且不是发生在时间控件区域
							isTagert = (tgID != inID) && ($(cell).closest('#' + inID).length <= 0);
						}
						catch (e)
						{
							isTagert = true;
						}
						if (isTagert)
						{
							self.wrap.hide();
							self.options.noSelect && self.options.noSelect();
						}
					}
				});
			}
		}
	}
	$.fn.skill = function (option) {
		var $this   = $(this);
		var data    = $this.data('bs.skill');
		var options = typeof option == 'object' && option;
		if (!data) {
			data = new Skill($this, options);
			data.init();
			$this.data('bs.skill', data);
		}
	}
	return $;
});/*
 SWFObject v2.2 <http://code.google.com/p/swfobject/> 
 is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
 */
window.swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;
	if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;
		X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);
		ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0;}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");
		if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)];}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac};
}(),k=function(){if(!M.w3){return;}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f();
}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false);}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);
	f();}});if(O==top){(function(){if(J){return;}try{j.documentElement.doScroll("left");}catch(X){setTimeout(arguments.callee,0);return;}f();})();}}if(M.wk){(function(){if(J){return;
}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return;}f();})();}s(f);}}();function f(){if(J){return;}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));
	Z.parentNode.removeChild(Z);}catch(aa){return;}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]();}}function K(X){if(J){X();}else{U[U.length]=X;}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false);
}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false);}else{if(typeof O.attachEvent!=D){i(O,"onload",Y);}else{if(typeof O.onload=="function"){var X=O.onload;
	O.onload=function(){X();Y();};}else{O.onload=Y;}}}}}function h(){if(T){V();}else{H();}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);
	aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");
		M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)];}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return;}}X.removeChild(aa);Z=null;H();
	})();}else{H();}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);
	if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa);}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;
		ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class");}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align");
		}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value");
		}}P(ai,ah,Y,ab);}else{p(ae);if(ab){ab(aa);}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z;}ab(aa);}}}}}function z(aa){var X=null;
	var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y;}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z;}}}return X;}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312);
}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null;}else{l=ae;Q=X;}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310";
}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137";}j.title=j.title.slice(0,47)+" - Flash Player Installation";
	var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac;
	}else{ab.flashvars=ac;}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";
		(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae);}else{setTimeout(arguments.callee,10);}})();}u(aa,ab,X);}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");
	Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y);}else{setTimeout(arguments.callee,10);
	}})();}else{Y.parentNode.replaceChild(g(Y),Y);}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML;}else{var Y=ab.getElementsByTagName(r)[0];
	if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true));
	}}}}}return aa;}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X;}if(aa){if(typeof ai.id==D){ai.id=Y;}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae];
}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"';}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"';}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />';
}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id);}else{var Z=C(r);Z.setAttribute("type",q);
	for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac]);}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac]);
	}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab]);}}aa.parentNode.replaceChild(Z,aa);X=Z;}}return X;}function e(Z,X,Y){var aa=C("param");
	aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa);}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";
	(function(){if(X.readyState==4){b(Y);}else{setTimeout(arguments.callee,10);}})();}else{X.parentNode.removeChild(X);}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null;
}}Y.parentNode.removeChild(Y);}}function c(Z){var X=null;try{X=j.getElementById(Z);}catch(Y){}return X;}function C(X){return j.createElement(X);}function i(Z,X,Y){Z.attachEvent(X,Y);
	I[I.length]=[Z,X,Y];}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false;
}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return;}var aa=j.getElementsByTagName("head")[0];if(!aa){return;}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;
	G=null;}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1];
}G=X;}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y);}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"));
}}}function w(Z,X){if(!m){return;}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y;}else{v("#"+Z,"visibility:"+Y);}}function L(Y){var Z=/[\\\"<>\.;]/;
	var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y;}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;
	for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2]);}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa]);}for(var Y in M){M[Y]=null;}M=null;for(var X in swfobject){swfobject[X]=null;
	}swfobject=null;});}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;
	w(ab,false);}else{if(Z){Z({success:false,id:ab});}}},getObjectById:function(X){if(M.w3){return z(X);}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};
	if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al];}}aj.data=ab;
		aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak];}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai];
		}else{am.flashvars=ai+"="+Z[ai];}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true);}X.success=true;X.ref=an;}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);
			return;}else{w(ah,true);}}if(ac){ac(X);}});}else{if(ac){ac(X);}}},switchOffAutoHideShow:function(){m=false;},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]};
},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X);}else{return undefined;}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y);
}},removeSWF:function(X){if(M.w3){y(X);}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X);}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;
	if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1];}if(aa==null){return L(Z);}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)));
	}}}return"";},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block";
}}if(E){E(B);}}a=false;}}};}();

/*
 SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com

 mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/

 SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilzén and Mammon Media and is released under the MIT License:
 http://www.opensource.org/licenses/mit-license.php

 SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 http://www.opensource.org/licenses/mit-license.php
 */

;if(window.SWFUpload==undefined){window.SWFUpload=function(a){this.initSWFUpload(a)}}SWFUpload.prototype.initSWFUpload=function(b){try{this.customSettings={};this.settings=b;this.eventQueue=[];this.movieName="SWFUpload_"+SWFUpload.movieCount++;this.movieElement=null;SWFUpload.instances[this.movieName]=this;this.initSettings();this.loadFlash();this.displayDebugInfo()}catch(a){delete SWFUpload.instances[this.movieName];throw a}};SWFUpload.instances={};SWFUpload.movieCount=0;SWFUpload.version="2.2.0 2009-03-25";SWFUpload.QUEUE_ERROR={QUEUE_LIMIT_EXCEEDED:-100,FILE_EXCEEDS_SIZE_LIMIT:-110,ZERO_BYTE_FILE:-120,INVALID_FILETYPE:-130};SWFUpload.UPLOAD_ERROR={HTTP_ERROR:-200,MISSING_UPLOAD_URL:-210,IO_ERROR:-220,SECURITY_ERROR:-230,UPLOAD_LIMIT_EXCEEDED:-240,UPLOAD_FAILED:-250,SPECIFIED_FILE_ID_NOT_FOUND:-260,FILE_VALIDATION_FAILED:-270,FILE_CANCELLED:-280,UPLOAD_STOPPED:-290};SWFUpload.FILE_STATUS={QUEUED:-1,IN_PROGRESS:-2,ERROR:-3,COMPLETE:-4,CANCELLED:-5};SWFUpload.BUTTON_ACTION={SELECT_FILE:-100,SELECT_FILES:-110,START_UPLOAD:-120};SWFUpload.CURSOR={ARROW:-1,HAND:-2};SWFUpload.WINDOW_MODE={WINDOW:"window",TRANSPARENT:"transparent",OPAQUE:"opaque"};SWFUpload.completeURL=function(a){if(typeof(a)!=="string"||a.match(/^https?:\/\//i)||a.match(/^\//)){return a}var c=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:"");var b=window.location.pathname.lastIndexOf("/");if(b<=0){path="/"}else{path=window.location.pathname.substr(0,b)+"/"}return path+a};SWFUpload.prototype.initSettings=function(){this.ensureDefault=function(b,a){this.settings[b]=(this.settings[b]==undefined)?a:this.settings[b]};this.ensureDefault("upload_url","");this.ensureDefault("preserve_relative_urls",false);this.ensureDefault("file_post_name","Filedata");this.ensureDefault("post_params",{});this.ensureDefault("use_query_string",false);this.ensureDefault("requeue_on_error",false);this.ensureDefault("http_success",[]);this.ensureDefault("assume_success_timeout",0);this.ensureDefault("file_types","*.*");this.ensureDefault("file_types_description","All Files");this.ensureDefault("file_size_limit",0);this.ensureDefault("file_upload_limit",0);this.ensureDefault("file_queue_limit",0);this.ensureDefault("flash_url","swfupload.swf");this.ensureDefault("prevent_swf_caching",true);this.ensureDefault("button_image_url","");this.ensureDefault("button_width",1);this.ensureDefault("button_height",1);this.ensureDefault("button_text","");this.ensureDefault("button_text_style","color: #000000; font-size: 16pt;");this.ensureDefault("button_text_top_padding",0);this.ensureDefault("button_text_left_padding",0);this.ensureDefault("button_action",SWFUpload.BUTTON_ACTION.SELECT_FILES);this.ensureDefault("button_disabled",false);this.ensureDefault("button_placeholder_id","");this.ensureDefault("button_placeholder",null);this.ensureDefault("button_cursor",SWFUpload.CURSOR.ARROW);this.ensureDefault("button_window_mode",SWFUpload.WINDOW_MODE.WINDOW);this.ensureDefault("debug",false);this.settings.debug_enabled=this.settings.debug;this.settings.return_upload_start_handler=this.returnUploadStart;this.ensureDefault("swfupload_loaded_handler",null);this.ensureDefault("file_dialog_start_handler",null);this.ensureDefault("file_queued_handler",null);this.ensureDefault("file_queue_error_handler",null);this.ensureDefault("file_dialog_complete_handler",null);this.ensureDefault("upload_start_handler",null);this.ensureDefault("upload_progress_handler",null);this.ensureDefault("upload_error_handler",null);this.ensureDefault("upload_success_handler",null);this.ensureDefault("upload_complete_handler",null);this.ensureDefault("debug_handler",this.debugMessage);this.ensureDefault("custom_settings",{});this.customSettings=this.settings.custom_settings;if(!!this.settings.prevent_swf_caching){this.settings.flash_url=this.settings.flash_url+(this.settings.flash_url.indexOf("?")<0?"?":"&")+"preventswfcaching="+new Date().getTime()}if(!this.settings.preserve_relative_urls){this.settings.upload_url=SWFUpload.completeURL(this.settings.upload_url);this.settings.button_image_url= this.settings.button_image_url? SWFUpload.completeURL(this.settings.button_image_url):this.settings.button_image_url}delete this.ensureDefault};SWFUpload.prototype.loadFlash=function(){var a,b;if(document.getElementById(this.movieName)!==null){throw"ID "+this.movieName+" is already in use. The Flash Object could not be added"}a=document.getElementById(this.settings.button_placeholder_id)||this.settings.button_placeholder;if(a==undefined){throw"Could not find the placeholder element: "+this.settings.button_placeholder_id}b=document.createElement("div");b.innerHTML=this.getFlashHTML();a.parentNode.replaceChild(b.firstChild,a);if(window[this.movieName]==undefined){window[this.movieName]=this.getMovieElement()}};SWFUpload.prototype.getFlashHTML=function(){return['<object id="',this.movieName,'" type="application/x-shockwave-flash" data="',this.settings.flash_url,'" width="',this.settings.button_width,'" height="',this.settings.button_height,'" class="swfupload">','<param name="wmode" value="',this.settings.button_window_mode,'" />','<param name="movie" value="',this.settings.flash_url,'" />','<param name="quality" value="high" />','<param name="menu" value="false" />','<param name="allowScriptAccess" value="always" />','<param name="flashvars" value="'+this.getFlashVars()+'" />',"</object>"].join("")};SWFUpload.prototype.getFlashVars=function(){var b=this.buildParamString();var a=this.settings.http_success.join(",");return["&amp;uploadURL=",encodeURIComponent(this.settings.upload_url),"&amp;movieName=",encodeURIComponent(this.movieName),"&amp;useQueryString=",encodeURIComponent(this.settings.use_query_string),"&amp;requeueOnError=",encodeURIComponent(this.settings.requeue_on_error),"&amp;httpSuccess=",encodeURIComponent(a),"&amp;assumeSuccessTimeout=",encodeURIComponent(this.settings.assume_success_timeout),"&amp;params=",encodeURIComponent(b),"&amp;filePostName=",encodeURIComponent(this.settings.file_post_name),"&amp;fileTypes=",encodeURIComponent(this.settings.file_types),"&amp;fileTypesDescription=",encodeURIComponent(this.settings.file_types_description),"&amp;fileSizeLimit=",encodeURIComponent(this.settings.file_size_limit),"&amp;fileUploadLimit=",encodeURIComponent(this.settings.file_upload_limit),"&amp;fileQueueLimit=",encodeURIComponent(this.settings.file_queue_limit),"&amp;debugEnabled=",encodeURIComponent(this.settings.debug_enabled),"&amp;buttonImageURL=",encodeURIComponent(this.settings.button_image_url),"&amp;buttonWidth=",encodeURIComponent(this.settings.button_width),"&amp;buttonHeight=",encodeURIComponent(this.settings.button_height),"&amp;buttonText=",encodeURIComponent(this.settings.button_text),"&amp;buttonTextTopPadding=",encodeURIComponent(this.settings.button_text_top_padding),"&amp;buttonTextLeftPadding=",encodeURIComponent(this.settings.button_text_left_padding),"&amp;buttonTextStyle=",encodeURIComponent(this.settings.button_text_style),"&amp;buttonAction=",encodeURIComponent(this.settings.button_action),"&amp;buttonDisabled=",encodeURIComponent(this.settings.button_disabled),"&amp;buttonCursor=",encodeURIComponent(this.settings.button_cursor)].join("")};SWFUpload.prototype.getMovieElement=function(){if(this.movieElement==undefined){this.movieElement=document.getElementById(this.movieName)}if(this.movieElement===null){throw"Could not find Flash element"}return this.movieElement};SWFUpload.prototype.buildParamString=function(){var c=this.settings.post_params;var b=[];if(typeof(c)==="object"){for(var a in c){if(c.hasOwnProperty(a)){b.push(encodeURIComponent(a.toString())+"="+encodeURIComponent(c[a].toString()))}}}return b.join("&amp;")};SWFUpload.prototype.destroy=function(){try{this.cancelUpload(null,false);var a=null;a=this.getMovieElement();if(a&&typeof(a.CallFunction)==="unknown"){for(var c in a){try{if(typeof(a[c])==="function"){a[c]=null}}catch(e){}}try{a.parentNode.removeChild(a)}catch(b){}}window[this.movieName]=null;SWFUpload.instances[this.movieName]=null;delete SWFUpload.instances[this.movieName];this.movieElement=null;this.settings=null;this.customSettings=null;this.eventQueue=null;this.movieName=null;return true}catch(d){return false}};SWFUpload.prototype.displayDebugInfo=function(){this.debug(["---SWFUpload Instance Info---\n","Version: ",SWFUpload.version,"\n","Movie Name: ",this.movieName,"\n","Settings:\n","\t","upload_url:               ",this.settings.upload_url,"\n","\t","flash_url:                ",this.settings.flash_url,"\n","\t","use_query_string:         ",this.settings.use_query_string.toString(),"\n","\t","requeue_on_error:         ",this.settings.requeue_on_error.toString(),"\n","\t","http_success:             ",this.settings.http_success.join(", "),"\n","\t","assume_success_timeout:   ",this.settings.assume_success_timeout,"\n","\t","file_post_name:           ",this.settings.file_post_name,"\n","\t","post_params:              ",this.settings.post_params.toString(),"\n","\t","file_types:               ",this.settings.file_types,"\n","\t","file_types_description:   ",this.settings.file_types_description,"\n","\t","file_size_limit:          ",this.settings.file_size_limit,"\n","\t","file_upload_limit:        ",this.settings.file_upload_limit,"\n","\t","file_queue_limit:         ",this.settings.file_queue_limit,"\n","\t","debug:                    ",this.settings.debug.toString(),"\n","\t","prevent_swf_caching:      ",this.settings.prevent_swf_caching.toString(),"\n","\t","button_placeholder_id:    ",this.settings.button_placeholder_id.toString(),"\n","\t","button_placeholder:       ",(this.settings.button_placeholder?"Set":"Not Set"),"\n","\t","button_image_url:         ",this.settings.button_image_url.toString(),"\n","\t","button_width:             ",this.settings.button_width.toString(),"\n","\t","button_height:            ",this.settings.button_height.toString(),"\n","\t","button_text:              ",this.settings.button_text.toString(),"\n","\t","button_text_style:        ",this.settings.button_text_style.toString(),"\n","\t","button_text_top_padding:  ",this.settings.button_text_top_padding.toString(),"\n","\t","button_text_left_padding: ",this.settings.button_text_left_padding.toString(),"\n","\t","button_action:            ",this.settings.button_action.toString(),"\n","\t","button_disabled:          ",this.settings.button_disabled.toString(),"\n","\t","custom_settings:          ",this.settings.custom_settings.toString(),"\n","Event Handlers:\n","\t","swfupload_loaded_handler assigned:  ",(typeof this.settings.swfupload_loaded_handler==="function").toString(),"\n","\t","file_dialog_start_handler assigned: ",(typeof this.settings.file_dialog_start_handler==="function").toString(),"\n","\t","file_queued_handler assigned:       ",(typeof this.settings.file_queued_handler==="function").toString(),"\n","\t","file_queue_error_handler assigned:  ",(typeof this.settings.file_queue_error_handler==="function").toString(),"\n","\t","upload_start_handler assigned:      ",(typeof this.settings.upload_start_handler==="function").toString(),"\n","\t","upload_progress_handler assigned:   ",(typeof this.settings.upload_progress_handler==="function").toString(),"\n","\t","upload_error_handler assigned:      ",(typeof this.settings.upload_error_handler==="function").toString(),"\n","\t","upload_success_handler assigned:    ",(typeof this.settings.upload_success_handler==="function").toString(),"\n","\t","upload_complete_handler assigned:   ",(typeof this.settings.upload_complete_handler==="function").toString(),"\n","\t","debug_handler assigned:             ",(typeof this.settings.debug_handler==="function").toString(),"\n"].join(""))};SWFUpload.prototype.addSetting=function(b,c,a){if(c==undefined){return(this.settings[b]=a)}else{return(this.settings[b]=c)}};SWFUpload.prototype.getSetting=function(a){if(this.settings[a]!=undefined){return this.settings[a]}return""};SWFUpload.prototype.callFlash=function(functionName,argumentArray){argumentArray=argumentArray||[];var movieElement=this.getMovieElement();var returnValue,returnString;try{returnString=movieElement.CallFunction('<invoke name="'+functionName+'" returntype="javascript">'+__flash__argumentsToXML(argumentArray,0)+"</invoke>");returnValue=eval(returnString)}catch(ex){throw"Call to "+functionName+" failed"}if(returnValue!=undefined&&typeof returnValue.post==="object"){returnValue=this.unescapeFilePostParams(returnValue)}return returnValue};SWFUpload.prototype.selectFile=function(){this.callFlash("SelectFile")};SWFUpload.prototype.selectFiles=function(){this.callFlash("SelectFiles")};SWFUpload.prototype.startUpload=function(a){this.callFlash("StartUpload",[a])};SWFUpload.prototype.cancelUpload=function(a,b){if(b!==false){b=true}this.callFlash("CancelUpload",[a,b])};SWFUpload.prototype.stopUpload=function(){this.callFlash("StopUpload")};SWFUpload.prototype.getStats=function(){return this.callFlash("GetStats")};SWFUpload.prototype.setStats=function(a){this.callFlash("SetStats",[a])};SWFUpload.prototype.getFile=function(a){if(typeof(a)==="number"){return this.callFlash("GetFileByIndex",[a])}else{return this.callFlash("GetFile",[a])}};SWFUpload.prototype.addFileParam=function(a,b,c){return this.callFlash("AddFileParam",[a,b,c])};SWFUpload.prototype.removeFileParam=function(a,b){this.callFlash("RemoveFileParam",[a,b])};SWFUpload.prototype.setUploadURL=function(a){this.settings.upload_url=a.toString();this.callFlash("SetUploadURL",[a])};SWFUpload.prototype.setPostParams=function(a){this.settings.post_params=a;this.callFlash("SetPostParams",[a])};SWFUpload.prototype.addPostParam=function(a,b){this.settings.post_params[a]=b;this.callFlash("SetPostParams",[this.settings.post_params])};SWFUpload.prototype.removePostParam=function(a){delete this.settings.post_params[a];this.callFlash("SetPostParams",[this.settings.post_params])};SWFUpload.prototype.setFileTypes=function(a,b){this.settings.file_types=a;this.settings.file_types_description=b;this.callFlash("SetFileTypes",[a,b])};SWFUpload.prototype.setFileSizeLimit=function(a){this.settings.file_size_limit=a;this.callFlash("SetFileSizeLimit",[a])};SWFUpload.prototype.setFileUploadLimit=function(a){this.settings.file_upload_limit=a;this.callFlash("SetFileUploadLimit",[a])};SWFUpload.prototype.setFileQueueLimit=function(a){this.settings.file_queue_limit=a;this.callFlash("SetFileQueueLimit",[a])};SWFUpload.prototype.setFilePostName=function(a){this.settings.file_post_name=a;this.callFlash("SetFilePostName",[a])};SWFUpload.prototype.setUseQueryString=function(a){this.settings.use_query_string=a;this.callFlash("SetUseQueryString",[a])};SWFUpload.prototype.setRequeueOnError=function(a){this.settings.requeue_on_error=a;this.callFlash("SetRequeueOnError",[a])};SWFUpload.prototype.setHTTPSuccess=function(a){if(typeof a==="string"){a=a.replace(" ","").split(",")}this.settings.http_success=a;this.callFlash("SetHTTPSuccess",[a])};SWFUpload.prototype.setAssumeSuccessTimeout=function(a){this.settings.assume_success_timeout=a;this.callFlash("SetAssumeSuccessTimeout",[a])};SWFUpload.prototype.setDebugEnabled=function(a){this.settings.debug_enabled=a;this.callFlash("SetDebugEnabled",[a])};SWFUpload.prototype.setButtonImageURL=function(a){if(a==undefined){a=""}this.settings.button_image_url=a;this.callFlash("SetButtonImageURL",[a])};SWFUpload.prototype.setButtonDimensions=function(c,a){this.settings.button_width=c;this.settings.button_height=a;var b=this.getMovieElement();if(b!=undefined){b.style.width=c+"px";b.style.height=a+"px"}this.callFlash("SetButtonDimensions",[c,a])};SWFUpload.prototype.setButtonText=function(a){this.settings.button_text=a;this.callFlash("SetButtonText",[a])};SWFUpload.prototype.setButtonTextPadding=function(b,a){this.settings.button_text_top_padding=a;this.settings.button_text_left_padding=b;this.callFlash("SetButtonTextPadding",[b,a])};SWFUpload.prototype.setButtonTextStyle=function(a){this.settings.button_text_style=a;this.callFlash("SetButtonTextStyle",[a])};SWFUpload.prototype.setButtonDisabled=function(a){this.settings.button_disabled=a;this.callFlash("SetButtonDisabled",[a])};SWFUpload.prototype.setButtonAction=function(a){this.settings.button_action=a;this.callFlash("SetButtonAction",[a])};SWFUpload.prototype.setButtonCursor=function(a){this.settings.button_cursor=a;this.callFlash("SetButtonCursor",[a])};SWFUpload.prototype.queueEvent=function(b,c){if(c==undefined){c=[]}else{if(!(c instanceof Array)){c=[c]}}var a=this;if(typeof this.settings[b]==="function"){this.eventQueue.push(function(){this.settings[b].apply(this,c)});setTimeout(function(){a.executeNextEvent()},0)}else{if(this.settings[b]!==null){throw"Event handler "+b+" is unknown or is not a function"}}};SWFUpload.prototype.executeNextEvent=function(){var a=this.eventQueue?this.eventQueue.shift():null;if(typeof(a)==="function"){a.apply(this)}};SWFUpload.prototype.unescapeFilePostParams=function(c){var e=/[$]([0-9a-f]{4})/i;var f={};var d;if(c!=undefined){for(var a in c.post){if(c.post.hasOwnProperty(a)){d=a;var b;while((b=e.exec(d))!==null){d=d.replace(b[0],String.fromCharCode(parseInt("0x"+b[1],16)))}f[d]=c.post[a]}}c.post=f}return c};SWFUpload.prototype.testExternalInterface=function(){try{return this.callFlash("TestExternalInterface")}catch(a){return false}};SWFUpload.prototype.flashReady=function(){var a=this.getMovieElement();if(!a){this.debug("Flash called back ready but the flash movie can't be found.");return}this.cleanUp(a);this.queueEvent("swfupload_loaded_handler")};SWFUpload.prototype.cleanUp = function (f) {try {if (this.movieElement && typeof (f.CallFunction) === "unknown") {this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");for (var h in f) {try {if (typeof (f[h]) === "function" && h[0] >= 'A' && h[0] <= 'Z') {f[h] = null;}} catch (e) {}}}} catch (g) { } window.__flash__removeCallback = function (c, b) { try { if (c) { c[b] = null; } } catch (a) { } };}; SWFUpload.prototype.fileDialogStart=function(){this.queueEvent("file_dialog_start_handler")};SWFUpload.prototype.fileQueued=function(a){a=this.unescapeFilePostParams(a);this.queueEvent("file_queued_handler",a)};SWFUpload.prototype.fileQueueError=function(a,c,b){a=this.unescapeFilePostParams(a);this.queueEvent("file_queue_error_handler",[a,c,b])};SWFUpload.prototype.fileDialogComplete=function(b,c,a){this.queueEvent("file_dialog_complete_handler",[b,c,a])};SWFUpload.prototype.uploadStart=function(a){a=this.unescapeFilePostParams(a);this.queueEvent("return_upload_start_handler",a)};SWFUpload.prototype.returnUploadStart=function(a){var b;if(typeof this.settings.upload_start_handler==="function"){a=this.unescapeFilePostParams(a);b=this.settings.upload_start_handler.call(this,a)}else{if(this.settings.upload_start_handler!=undefined){throw"upload_start_handler must be a function"}}if(b===undefined){b=true}b=!!b;this.callFlash("ReturnUploadStart",[b])};SWFUpload.prototype.uploadProgress=function(a,c,b){a=this.unescapeFilePostParams(a);this.queueEvent("upload_progress_handler",[a,c,b])};SWFUpload.prototype.uploadError=function(a,c,b){a=this.unescapeFilePostParams(a);this.queueEvent("upload_error_handler",[a,c,b])};SWFUpload.prototype.uploadSuccess=function(b,a,c){b=this.unescapeFilePostParams(b);this.queueEvent("upload_success_handler",[b,a,c])};SWFUpload.prototype.uploadComplete=function(a){a=this.unescapeFilePostParams(a);this.queueEvent("upload_complete_handler",a)};SWFUpload.prototype.debug=function(a){this.queueEvent("debug_handler",a)};SWFUpload.prototype.debugMessage=function(c){if(this.settings.debug){var a,d=[];if(typeof c==="object"&&typeof c.name==="string"&&typeof c.message==="string"){for(var b in c){if(c.hasOwnProperty(b)){d.push(b+": "+c[b])}}a=d.join("\n")||"";d=a.split("\n");a="EXCEPTION: "+d.join("\nEXCEPTION: ");SWFUpload.Console.writeLine(a)}else{SWFUpload.Console.writeLine(c)}}};SWFUpload.Console={};SWFUpload.Console.writeLine=function(d){var b,a;try{b=document.getElementById("SWFUpload_Console");if(!b){a=document.createElement("form");document.getElementsByTagName("body")[0].appendChild(a);b=document.createElement("textarea");b.id="SWFUpload_Console";b.style.fontFamily="monospace";b.setAttribute("wrap","off");b.wrap="off";b.style.overflow="auto";b.style.width="700px";b.style.height="350px";b.style.margin="5px";a.appendChild(b)}b.value+=d+"\n";b.scrollTop=b.scrollHeight-b.clientHeight}catch(c){alert("Exception: "+c.name+" Message: "+c.message)}};

define('uploadify', function(require, exports, module){
	/*
	 Uploadify v3.2.1
	 Copyright (c) 2012 Reactive Apps, Ronnie Garcia
	 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
	 */
	var $=require('jquery');
	(function($) {

		// These methods can be called by adding them as the first argument in the uploadify plugin call
		var methods = {

			init : function(options, swfUploadOptions) {

				return this.each(function() {

					// Create a reference to the jQuery DOM object
					var $this = $(this);

					// Clone the original DOM object
					var $clone = $this.clone();

					// Setup the default options
					var settings = $.extend({
						// Required Settings
						id       : $this.attr('id'), // The ID of the DOM object
						swf      : 'http://localhost:8006/js/uploadify/uploadify.swf',  // The path to the uploadify SWF file
						uploader : 'http://localhost:8006/js/uploadify/uploadify.php',  // The path to the server-side upload script

						// Options
						auto            : true,               // Automatically upload files when added to the queue
						buttonClass     : '',                 // A class name to add to the browse button DOM object
						buttonCursor    : 'hand',             // The cursor to use with the browse button
						buttonImage     : null,               // (String or null) The path to an image to use for the Flash browse button if not using CSS to style the button
						buttonText      : 'SELECT FILES',     // The text to use for the browse button
						checkExisting   : false,              // The path to a server-side script that checks for existing files on the server
						debug           : false,              // Turn on swfUpload debugging mode
						fileObjName     : 'Filedata',         // The name of the file object to use in your server-side script
						fileSizeLimit   : 0,                  // The maximum size of an uploadable file in KB (Accepts units B KB MB GB if string, 0 for no limit)
						fileTypeDesc    : 'All Files',        // The description for file types in the browse dialog
						fileTypeExts    : '*.*',              // Allowed extensions in the browse dialog (server-side validation should also be used)
						height          : 30,                 // The height of the browse button
						itemTemplate    : false,              // The template for the file item in the queue
						method          : 'post',             // The method to use when sending files to the server-side upload script
						multi           : true,               // Allow multiple file selection in the browse dialog
						formData        : {},                 // An object with additional data to send to the server-side upload script with every file upload
						preventCaching  : true,               // Adds a random value to the Flash URL to prevent caching of it (conflicts with existing parameters)
						progressData    : 'percentage',       // ('percentage' or 'speed') Data to show in the queue item during a file upload
						queueID         : false,              // The ID of the DOM object to use as a file queue (without the #)
						queueSizeLimit  : 999,                // The maximum number of files that can be in the queue at one time
						removeCompleted : true,               // Remove queue items from the queue when they are done uploading
						removeTimeout   : 3,                  // The delay in seconds before removing a queue item if removeCompleted is set to true
						requeueErrors   : false,              // Keep errored files in the queue and keep trying to upload them
						successTimeout  : 30,                 // The number of seconds to wait for Flash to detect the server's response after the file has finished uploading
						uploadLimit     : 0,                  // The maximum number of files you can upload
						width           : 120,                // The width of the browse button

						// Events
						overrideEvents  : []             // (Array) A list of default event handlers to skip
						/*
						 onCancel         // Triggered when a file is cancelled from the queue
						 onClearQueue     // Triggered during the 'clear queue' method
						 onDestroy        // Triggered when the uploadify object is destroyed
						 onDialogClose    // Triggered when the browse dialog is closed
						 onDialogOpen     // Triggered when the browse dialog is opened
						 onDisable        // Triggered when the browse button gets disabled
						 onEnable         // Triggered when the browse button gets enabled
						 onFallback       // Triggered is Flash is not detected    
						 onInit           // Triggered when Uploadify is initialized
						 onQueueComplete  // Triggered when all files in the queue have been uploaded
						 onSelectError    // Triggered when an error occurs while selecting a file (file size, queue size limit, etc.)
						 onSelect         // Triggered for each file that is selected
						 onSWFReady       // Triggered when the SWF button is loaded
						 onUploadComplete // Triggered when a file upload completes (success or error)
						 onUploadError    // Triggered when a file upload returns an error
						 onUploadSuccess  // Triggered when a file is uploaded successfully
						 onUploadProgress // Triggered every time a file progress is updated
						 onUploadStart    // Triggered immediately before a file upload starts
						 */
					}, options);

					// Prepare settings for SWFUpload
					var swfUploadSettings = {
						assume_success_timeout   : settings.successTimeout,
						button_placeholder_id    : settings.id,
						button_width             : settings.width,
						button_height            : settings.height,
						button_text              : null,
						button_text_style        : null,
						button_text_top_padding  : 0,
						button_text_left_padding : 0,
						button_action            : (settings.multi ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE),
						button_disabled          : false,
						button_cursor            : (settings.buttonCursor == 'arrow' ? SWFUpload.CURSOR.ARROW : SWFUpload.CURSOR.HAND),
						button_window_mode       : SWFUpload.WINDOW_MODE.TRANSPARENT,
						debug                    : settings.debug,
						requeue_on_error         : settings.requeueErrors,
						file_post_name           : settings.fileObjName,
						file_size_limit          : settings.fileSizeLimit,
						file_types               : settings.fileTypeExts,
						file_types_description   : settings.fileTypeDesc,
						file_queue_limit         : settings.queueSizeLimit,
						file_upload_limit        : settings.uploadLimit,
						flash_url                : settings.swf,
						prevent_swf_caching      : settings.preventCaching,
						post_params              : settings.formData,
						upload_url               : settings.uploader,
						use_query_string         : (settings.method == 'get'),

						// Event Handlers 
						file_dialog_complete_handler : handlers.onDialogClose,
						file_dialog_start_handler    : handlers.onDialogOpen,
						file_queued_handler          : handlers.onSelect,
						file_queue_error_handler     : handlers.onSelectError,
						swfupload_loaded_handler     : settings.onSWFReady,
						upload_complete_handler      : handlers.onUploadComplete,
						upload_error_handler         : handlers.onUploadError,
						upload_progress_handler      : handlers.onUploadProgress,
						upload_start_handler         : handlers.onUploadStart,
						upload_success_handler       : handlers.onUploadSuccess
					}

					// Merge the user-defined options with the defaults
					if (swfUploadOptions) {
						swfUploadSettings = $.extend(swfUploadSettings, swfUploadOptions);
					}
					// Add the user-defined settings to the swfupload object
					swfUploadSettings = $.extend(swfUploadSettings, settings);

					// Detect if Flash is available
					var playerVersion  = swfobject.getFlashPlayerVersion();
					var flashInstalled = (playerVersion.major >= 9);

					if (flashInstalled) {
						// Create the swfUpload instance
						window['uploadify_' + settings.id] = new SWFUpload(swfUploadSettings);
						var swfuploadify = window['uploadify_' + settings.id];

						// Add the SWFUpload object to the elements data object
						$this.data('uploadify', swfuploadify);

						// Wrap the instance
						var $wrapper = $('<div />', {
							'id'    : settings.id,
							'class' : 'uploadify',
							'css'   : {
								'height'   : settings.height + 'px',
								'width'    : settings.width + 'px'
							}
						});
						$('#' + swfuploadify.movieName).wrap($wrapper);

						// Recreate the reference to wrapper
						$wrapper = $('#' + settings.id);

						$('#' + swfuploadify.movieName).wrap($('<div class="swfUploadBtn" />'));
						// Add the data object to the wrapper 
						$wrapper.data('uploadify', swfuploadify);

						// Create the button
						var $button = $('<div />', {
							'id'    : settings.id + '-button',
							'class' : 'uploadify-button ' + settings.buttonClass
						});
						if (settings.buttonImage) {
							$button.css({
								'background-image' : "url('" + settings.buttonImage + "')",
								'text-indent'      : '-9999px'
							});
						}
						$button.html('<span class="uploadify-button-text">' + settings.buttonText + '</span>')
							.css({
								'height'      : settings.height + 'px',
								'line-height' : settings.height + 'px',
								'width'       : settings.width + 'px'
							});
						// Append the button to the wrapper
						$wrapper.append($button);

						// Adjust the styles of the movie
						$('#' + swfuploadify.movieName).css({

						});

						// Create the file queue
						if (!settings.queueID) {
							var $queue = $('<div />', {
								'id'    : settings.id + '-queue',
								'class' : 'uploadify-queue'
							});
							$wrapper.after($queue);
							swfuploadify.settings.queueID      = settings.id + '-queue';
							swfuploadify.settings.defaultQueue = true;
						}

						// Create some queue related objects and variables
						swfuploadify.queueData = {
							files              : {}, // The files in the queue
							filesSelected      : 0, // The number of files selected in the last select operation
							filesQueued        : 0, // The number of files added to the queue in the last select operation
							filesReplaced      : 0, // The number of files replaced in the last select operation
							filesCancelled     : 0, // The number of files that were cancelled instead of replaced
							filesErrored       : 0, // The number of files that caused error in the last select operation
							uploadsSuccessful  : 0, // The number of files that were successfully uploaded
							uploadsErrored     : 0, // The number of files that returned errors during upload
							averageSpeed       : 0, // The average speed of the uploads in KB
							queueLength        : 0, // The number of files in the queue
							queueSize          : 0, // The size in bytes of the entire queue
							uploadSize         : 0, // The size in bytes of the upload queue
							queueBytesUploaded : 0, // The size in bytes that have been uploaded for the current upload queue
							uploadQueue        : [], // The files currently to be uploaded
							errorMsg           : 'Some files were not added to the queue:'
						};

						// Save references to all the objects
						swfuploadify.original = $clone;
						swfuploadify.wrapper  = $wrapper;
						swfuploadify.button   = $button;
						swfuploadify.queue    = $queue;

						// Call the user-defined init event handler
						if (settings.onInit) settings.onInit.call($this, swfuploadify);

					} else {

						// Call the fallback function
						if (settings.onFallback) settings.onFallback.call($this);

					}
				});

			},

			// Stop a file upload and remove it from the queue 
			cancel : function(fileID, supressEvent) {
				var args = arguments;

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify'),
						settings     = swfuploadify.settings,
						delay        = -1;

					if (args[0]) {
						// Clear the queue
						if (args[0] == '*') {
							var queueItemCount = swfuploadify.queueData.queueLength;
							$('#' + settings.queueID).find('.uploadify-queue-item').each(function() {
								delay++;
								if (args[1] === true) {
									swfuploadify.cancelUpload($(this).attr('id'), false);
								} else {
									swfuploadify.cancelUpload($(this).attr('id'));
								}
								$(this).find('.data').removeClass('data').html(' - Cancelled');
								$(this).find('.uploadify-progress-bar').remove();

								$(this).remove();
								//由原来的逐渐消失，改为立即消失
//							$(this).delay(1000 + 100 * delay).fadeOut(500, function() {
//								$(this).remove();
//							});
							});
							swfuploadify.queueData.queueSize   = 0;
							swfuploadify.queueData.queueLength = 0;
							// Trigger the onClearQueue event
							if (settings.onClearQueue) settings.onClearQueue.call($this, queueItemCount);
						} else {

							for (var n = 0; n < args.length; n++) {
								if (settings.onCancel) settings.onCancel.call(this, args[n]);

								swfuploadify.cancelUpload(args[n]);
								$('#' + args[n]).find('.data').removeClass('data').html(' - Cancelled');
								$('#' + args[n]).find('.uploadify-progress-bar').remove();
								$('#' + args[n]).remove();
//							$('#' + args[n]).delay(1000 + 100 * n).fadeOut(500, function() {
//								$(this).remove();
//							});

								delete swfuploadify.queueData.files[args[n]];
							}
						}
					} else {
						var item = $('#' + settings.queueID).find('.uploadify-queue-item').get(0);
						$item = $(item);
						if (settings.onCancel) settings.onCancel.call(this, $item.attr('id'));

						swfuploadify.cancelUpload($item.attr('id'));
						$item.find('.data').removeClass('data').html(' - Cancelled');
						$item.find('.uploadify-progress-bar').remove();
						$item.remove();
//					$item.delay(1000).fadeOut(500, function() {
//						$(this).remove();
//					});

						delete swfuploadify.queueData.files[$item.attr('id')];
					}

				});

			},

			// Revert the DOM object back to its original state
			destroy : function() {

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify'),
						settings     = swfuploadify.settings;

					// Destroy the SWF object and 
					swfuploadify.destroy();

					// Destroy the queue
					if (settings.defaultQueue) {
						$('#' + settings.queueID).remove();
					}

					// Reload the original DOM element
					$('#' + settings.id).replaceWith(swfuploadify.original);

					// Call the user-defined event handler
					if (settings.onDestroy) settings.onDestroy.call(this);

					delete swfuploadify;
				});

			},

			// Disable the select button
			disable : function(isDisabled) {

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify'),
						settings     = swfuploadify.settings;

					// Call the user-defined event handlers
					if (isDisabled) {
						swfuploadify.button.addClass('disabled');
						if (settings.onDisable) settings.onDisable.call(this);
					} else {
						swfuploadify.button.removeClass('disabled');
						if (settings.onEnable) settings.onEnable.call(this);
					}

					// Enable/disable the browse button
					swfuploadify.setButtonDisabled(isDisabled);
				});

			},

			// Get or set the settings data
			settings : function(name, value, resetObjects) {

				var args        = arguments;
				var returnValue = value;

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify'),
						settings     = swfuploadify.settings;

					if (typeof(args[0]) == 'object') {
						for (var n in value) {
							setData(n,value[n]);
						}
					}
					if (args.length === 1) {
						returnValue =  settings[name];
					} else {
						switch (name) {
							case 'uploader':
								swfuploadify.setUploadURL(value);
								break;
							case 'formData':
								if (!resetObjects) {
									value = $.extend(settings.formData, value);
								}
								swfuploadify.setPostParams(settings.formData);
								break;
							case 'method':
								if (value == 'get') {
									swfuploadify.setUseQueryString(true);
								} else {
									swfuploadify.setUseQueryString(false);
								}
								break;
							case 'fileObjName':
								swfuploadify.setFilePostName(value);
								break;
							case 'fileTypeExts':
								swfuploadify.setFileTypes(value, settings.fileTypeDesc);
								break;
							case 'fileTypeDesc':
								swfuploadify.setFileTypes(settings.fileTypeExts, value);
								break;
							case 'fileSizeLimit':
								swfuploadify.setFileSizeLimit(value);
								break;
							case 'uploadLimit':
								swfuploadify.setFileUploadLimit(value);
								break;
							case 'queueSizeLimit':
								swfuploadify.setFileQueueLimit(value);
								break;
							case 'buttonImage':
								swfuploadify.button.css('background-image', settingValue);
								break;
							case 'buttonCursor':
								if (value == 'arrow') {
									swfuploadify.setButtonCursor(SWFUpload.CURSOR.ARROW);
								} else {
									swfuploadify.setButtonCursor(SWFUpload.CURSOR.HAND);
								}
								break;
							case 'buttonText':
								$('#' + settings.id + '-button').find('.uploadify-button-text').html(value);
								break;
							case 'width':
								swfuploadify.setButtonDimensions(value, settings.height);
								break;
							case 'height':
								swfuploadify.setButtonDimensions(settings.width, value);
								break;
							case 'multi':
								if (value) {
									swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
								} else {
									swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
								}
								break;
						}
						settings[name] = value;
					}
				});

				if (args.length === 1) {
					return returnValue;
				}

			},

			// Stop the current uploads and requeue what is in progress
			stop : function() {

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify');

					// Reset the queue information
					swfuploadify.queueData.averageSpeed  = 0;
					swfuploadify.queueData.uploadSize    = 0;
					swfuploadify.queueData.bytesUploaded = 0;
					swfuploadify.queueData.uploadQueue   = [];

					swfuploadify.stopUpload();
				});

			},

			// Start uploading files in the queue
			upload : function() {

				var args = arguments;

				this.each(function() {
					// Create a reference to the jQuery DOM object
					var $this        = $(this),
						swfuploadify = $this.data('uploadify');

					// Reset the queue information
					swfuploadify.queueData.averageSpeed  = 0;
					swfuploadify.queueData.uploadSize    = 0;
					swfuploadify.queueData.bytesUploaded = 0;
					swfuploadify.queueData.uploadQueue   = [];

					// Upload the files
					if (args[0]) {
						if (args[0] == '*') {
							swfuploadify.queueData.uploadSize = swfuploadify.queueData.queueSize;
							swfuploadify.queueData.uploadQueue.push('*');
							swfuploadify.startUpload();
						} else {
							for (var n = 0; n < args.length; n++) {
								swfuploadify.queueData.uploadSize += swfuploadify.queueData.files[args[n]].size;
								swfuploadify.queueData.uploadQueue.push(args[n]);
							}
							swfuploadify.startUpload(swfuploadify.queueData.uploadQueue.shift());
						}
					} else {
						swfuploadify.startUpload();
					}

				});

			}

		}

		// These functions handle all the events that occur with the file uploader
		var handlers = {

			// Triggered when the file dialog is opened
			onDialogOpen : function() {
				// Load the swfupload settings
				var settings = this.settings;

				// Reset some queue info
				this.queueData.errorMsg       = 'Some files were not added to the queue:';
				this.queueData.filesReplaced  = 0;
				this.queueData.filesCancelled = 0;
				// Call the user-defined event handler
				if (settings.onDialogOpen) settings.onDialogOpen.call(this);
			},

			// Triggered when the browse dialog is closed
			onDialogClose :  function(filesSelected, filesQueued, queueLength) {
				// Load the swfupload settings
				var settings = this.settings;

				// Update the queue information
				this.queueData.filesErrored  = filesSelected - filesQueued;
				this.queueData.filesSelected = filesSelected;
				this.queueData.filesQueued   = filesQueued - this.queueData.filesCancelled;
				this.queueData.queueLength   = queueLength;

				// Run the default event handler
				if ($.inArray('onDialogClose', settings.overrideEvents) < 0) {
					if (this.queueData.filesErrored > 0) {
						//alert(this.queueData.errorMsg);
					}
				}

				// Call the user-defined event handler
				if (settings.onDialogClose) settings.onDialogClose.call(this, this.queueData);

				// Upload the files if auto is true
				if (settings.auto) $('#' + settings.id).uploadify('upload', '*');
			},

			// Triggered once for each file added to the queue
			onSelect : function(file) {
				// Load the swfupload settings
				var settings = this.settings;

				this.queueData.queueSize += file.size;
				//增加了机制   根据自定的onselect返回值，判断是否取消上传该选中文件，当无返回值或返回为false时，该选中文件被清除出队列
				// Call the user-defined event handler
				var result = true;
				if (settings.onSelect) result= settings.onSelect.apply(this, arguments);
				if(typeof result != 'undefined' && !result){
					//this.cancelUpload(file.id);
					return;
				}



				// Check if a file with the same name exists in the queue
				var queuedFile = {};
				for (var n in this.queueData.files) {
					queuedFile = this.queueData.files[n];
					if (queuedFile.uploaded != true && queuedFile.name == file.name) {
						var replaceQueueItem = confirm('文件 "' + file.name + '" 已经存在队列当中.\n是否重复上传此图片?');
						if (!replaceQueueItem) {
							this.cancelUpload(file.id);
							this.queueData.filesCancelled++;
							return false;
						} else {
							//$('#' + queuedFile.id).remove();
							this.cancelUpload(queuedFile.id);
							this.queueData.filesReplaced++;
						}
					}
				}

				// Get the size of the file
				var fileSize = Math.round(file.size / 1024);
				var suffix   = 'KB';
				if (fileSize > 1000) {
					fileSize = Math.round(fileSize / 1000);
					suffix   = 'MB';
				}
				var fileSizeParts = fileSize.toString().split('.');
				fileSize = fileSizeParts[0];
				if (fileSizeParts.length > 1) {
					fileSize += '.' + fileSizeParts[1].substr(0,2);
				}
				fileSize += suffix;

				// Truncate the filename if it's too long
				var fileName = file.name;
				if (fileName.length > 25) {
					fileName = fileName.substr(0,25) + '...';
				}

				//去掉后续名
				if(file.type.length>0){
					fileName = fileName.substr(0,fileName.length-file.type.length);
				}

				// Create the file data object
				itemData = {
					'fileID'     : file.id,
					'instanceID' : settings.id,
					'fileName'   : fileName,
					'fileSize'   : fileSize
				}

				// Create the file item template
				if (settings.itemTemplate == false) {
					settings.itemTemplate = '<div id="${fileID}" class="uploadify-queue-item">\
					<div class="cancel">\
						<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\
					</div>\
					<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\
					<div class="uploadify-progress">\
						<div class="uploadify-progress-bar"><!--Progress Bar--></div>\
					</div>\
				</div>';
				}

				// Run the default event handler
				if ($.inArray('onSelect', settings.overrideEvents) < 0) {

					// Replace the item data in the template
					itemHTML = settings.itemTemplate;
					for (var d in itemData) {
						itemHTML = itemHTML.replace(new RegExp('\\$\\{' + d + '\\}', 'g'), itemData[d]);
					}
					// Add the file item to the queue
					$('#' + settings.queueID).append(itemHTML);
				}

				this.queueData.files[file.id] = file;
			},

			// Triggered when a file is not added to the queue
			onSelectError : function(file, errorCode, errorMsg) {
				// Load the swfupload settings
				var settings = this.settings;
				// Run the default event handler
				if ($.inArray('onSelectError', settings.overrideEvents) < 0) {
					switch(errorCode) {
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							if (settings.queueSizeLimit > errorMsg) {
								this.queueData.errorMsg += '\nThe number of files selected exceeds the remaining upload limit (' + errorMsg + ').';
							} else {
								this.queueData.errorMsg += '\nThe number of files selected exceeds the queue size limit (' + settings.queueSizeLimit + ').';
							}
							break;
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							this.queueData.errorMsg += '\nThe file "' + file.name + '" exceeds the size limit (' + settings.fileSizeLimit + ').';
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							this.queueData.errorMsg += '\nThe file "' + file.name + '" is empty.';
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							this.queueData.errorMsg += '\nThe file "' + file.name + '" is not an accepted file type (' + settings.fileTypeDesc + ').';
							break;
					}
				}
				if (errorCode != SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
					delete this.queueData.files[file.id];
				}
				// Call the user-defined event handler
				if (settings.onSelectError) settings.onSelectError.apply(this, arguments);
			},

			// Triggered when all the files in the queue have been processed
			onQueueComplete : function() {
				if (this.settings.onQueueComplete) this.settings.onQueueComplete.call(this, this.settings.queueData);
			},

			// Triggered when a file upload successfully completes
			onUploadComplete : function(file) {
				// Load the swfupload settings
				var settings     = this.settings,
					swfuploadify = this;

				// Check if all the files have completed uploading
				var stats = this.getStats();
				this.queueData.queueLength = stats.files_queued;
				if (this.queueData.uploadQueue[0] == '*') {
					if (this.queueData.queueLength > 0) {
						this.startUpload();
					} else {
						this.queueData.uploadQueue = [];

						// Call the user-defined event handler for queue complete
						if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
					}
				} else {
					if (this.queueData.uploadQueue.length > 0) {
						this.startUpload(this.queueData.uploadQueue.shift());
					} else {
						this.queueData.uploadQueue = [];

						// Call the user-defined event handler for queue complete
						if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
					}
				}

				// Call the default event handler
				if ($.inArray('onUploadComplete', settings.overrideEvents) < 0) {
					if (settings.removeCompleted) {
						switch (file.filestatus) {
							case SWFUpload.FILE_STATUS.COMPLETE:
								setTimeout(function() {
									if ($('#' + file.id)) {
										swfuploadify.queueData.queueSize   -= file.size;
										swfuploadify.queueData.queueLength -= 1;
										delete swfuploadify.queueData.files[file.id];
										$('#' + file.id).fadeOut(500, function() {
											$(this).remove();
										});
									}
								}, settings.removeTimeout * 1000);
								break;
							case SWFUpload.FILE_STATUS.ERROR:
								if (!settings.requeueErrors) {
									setTimeout(function() {
										if ($('#' + file.id)) {
											swfuploadify.queueData.queueSize   -= file.size;
											swfuploadify.queueData.queueLength -= 1;
											delete swfuploadify.queueData.files[file.id];
											$('#' + file.id).fadeOut(500, function() {
												$(this).remove();
											});
										}
									}, settings.removeTimeout * 1000);
								}
								break;
						}
					} else {
						file.uploaded = true;
					}
				}

				// Call the user-defined event handler
				if (settings.onUploadComplete) settings.onUploadComplete.call(this, file);
			},

			// Triggered when a file upload returns an error
			onUploadError : function(file, errorCode, errorMsg) {
				// Load the swfupload settings
				var settings = this.settings;

				// Set the error string
				var errorString = 'Error';
				switch(errorCode) {
					case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
						errorString = 'HTTP Error (' + errorMsg + ')';
						break;
					case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
						errorString = 'Missing Upload URL';
						break;
					case SWFUpload.UPLOAD_ERROR.IO_ERROR:
						errorString = 'IO Error';
						break;
					case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
						errorString = 'Security Error';
						break;
					case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
						alert('The upload limit has been reached (' + errorMsg + ').');
						errorString = 'Exceeds Upload Limit';
						break;
					case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
						errorString = 'Failed';
						break;
					case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
						break;
					case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
						errorString = 'Validation Error';
						break;
					case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
						errorString = 'Cancelled';
						this.queueData.queueSize   -= file.size;
						this.queueData.queueLength -= 1;
						if (file.status == SWFUpload.FILE_STATUS.IN_PROGRESS || $.inArray(file.id, this.queueData.uploadQueue) >= 0) {
							this.queueData.uploadSize -= file.size;
						}
						// Trigger the onCancel event
						//if (settings.onCancel) settings.onCancel.call(this, file);
						delete this.queueData.files[file.id];
						break;
					case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
						errorString = 'Stopped';
						break;
				}

				// Call the default event handler
				if ($.inArray('onUploadError', settings.overrideEvents) < 0) {

					if (errorCode != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED && errorCode != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
						$('#' + file.id).addClass('uploadify-error');
					}

					// Reset the progress bar
					$('#' + file.id).find('.uploadify-progress-bar').css('width','1px');

					// Add the error message to the queue item
					if (errorCode != SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND && file.status != SWFUpload.FILE_STATUS.COMPLETE) {
						$('#' + file.id).find('.data').html(' - ' + errorString);
					}
				}

				var stats = this.getStats();
				this.queueData.uploadsErrored = stats.upload_errors;

				// Call the user-defined event handler
				if (settings.onUploadError) settings.onUploadError.call(this, file, errorCode, errorMsg, errorString);
			},

			// Triggered periodically during a file upload
			onUploadProgress : function(file, fileBytesLoaded, fileTotalBytes) {
				// Load the swfupload settings
				var settings = this.settings;

				// Setup all the variables
				var timer            = new Date();
				var newTime          = timer.getTime();
				var lapsedTime       = newTime - this.timer;
				if (lapsedTime > 500) {
					this.timer = newTime;
				}
				var lapsedBytes      = fileBytesLoaded - this.bytesLoaded;
				this.bytesLoaded     = fileBytesLoaded;
				var queueBytesLoaded = this.queueData.queueBytesUploaded + fileBytesLoaded;
				var percentage       = Math.round(fileBytesLoaded / fileTotalBytes * 100);

				// Calculate the average speed
				var suffix = 'KB/s';
				var mbs = 0;
				var kbs = (lapsedBytes / 1024) / (lapsedTime / 1000);
				kbs = Math.floor(kbs * 10) / 10;
				if (this.queueData.averageSpeed > 0) {
					this.queueData.averageSpeed = Math.floor((this.queueData.averageSpeed + kbs) / 2);
				} else {
					this.queueData.averageSpeed = Math.floor(kbs);
				}
				if (kbs > 1000) {
					mbs = (kbs * .001);
					this.queueData.averageSpeed = Math.floor(mbs);
					suffix = 'MB/s';
				}

				// Call the default event handler
				if ($.inArray('onUploadProgress', settings.overrideEvents) < 0) {
					if (settings.progressData == 'percentage') {
						$('#' + file.id).find('.data').html(' - ' + percentage + '%');
					} else if (settings.progressData == 'speed' && lapsedTime > 500) {
						$('#' + file.id).find('.data').html(' - ' + this.queueData.averageSpeed + suffix);
					}
					$('#' + file.id).find('.uploadify-progress-bar').css('width', percentage + '%');
				}

				// Call the user-defined event handler
				if (settings.onUploadProgress) settings.onUploadProgress.call(this, file, fileBytesLoaded, fileTotalBytes, queueBytesLoaded, this.queueData.uploadSize);
			},

			// Triggered right before a file is uploaded
			onUploadStart : function(file) {
				// Load the swfupload settings
				var settings = this.settings;

				var timer        = new Date();
				this.timer       = timer.getTime();
				this.bytesLoaded = 0;
				if (this.queueData.uploadQueue.length == 0) {
					this.queueData.uploadSize = file.size;
				}
				if (settings.checkExisting) {
					$.ajax({
						type    : 'POST',
						async   : false,
						url     : settings.checkExisting,
						data    : {filename: file.name},
						success : function(data) {
							if (data == 1) {
								var overwrite = confirm('A file with the name "' + file.name + '" already exists on the server.\nWould you like to replace the existing file?');
								if (!overwrite) {
									this.cancelUpload(file.id);
									$('#' + file.id).remove();
									if (this.queueData.uploadQueue.length > 0 && this.queueData.queueLength > 0) {
										if (this.queueData.uploadQueue[0] == '*') {
											this.startUpload();
										} else {
											this.startUpload(this.queueData.uploadQueue.shift());
										}
									}
								}
							}
						}
					});
				}

				// Call the user-defined event handler
				if (settings.onUploadStart) settings.onUploadStart.call(this, file);
			},

			// Triggered when a file upload returns a successful code
			onUploadSuccess : function(file, data, response) {
				// Load the swfupload settings
				var settings = this.settings;
				var stats    = this.getStats();
				this.queueData.uploadsSuccessful = stats.successful_uploads;
				this.queueData.queueBytesUploaded += file.size;

				// Call the default event handler
				if ($.inArray('onUploadSuccess', settings.overrideEvents) < 0) {
					$('#' + file.id).find('.data').html(' - Complete');
				}

				// Call the user-defined event handler
				if (settings.onUploadSuccess) settings.onUploadSuccess.call(this, file, data, response);
			}

		}

		$.fn.uploadify = function(method) {

			if (methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof method === 'object' || !method) {
				return methods.init.apply(this, arguments);
			} else {
				$.error('The method ' + method + ' does not exist in $.uploadify');
			}

		}

	})($);
	return $;
});
// JavaScript Document

define('tools.dateFormat', function(require, exports){

	var util = require('base.util'),
		dateRegExp = /([yMdHms])(\1*)/g,
		dateFormatReg = 'yyyy-MM-dd',
		timeFormatReg = 'HH:mm:ss',
		comboFormatReg = dateFormatReg + ' ' + timeFormatReg,
		hasOwnProp = Object.prototype.hasOwnProperty,
		cloneDate = function(pDate, callback){
			var vDate = new Date(pDate.getTime()),
				year = vDate.getFullYear(),
				month = vDate.getMonth(),
				date = vDate.getDate(),
				hours = vDate.getHours(),
				minutes = vDate.getMinutes(),
				seconds = vDate.getSeconds();
			callback && callback(vDate, year, month, date, hours, minutes, seconds);
			return vDate;
		},
		parseDate = function(dateString, pattern){
			try{
				var matchs1 = (pattern || (dateString.length === 10 ? dateFormatReg : comboFormatReg)).match(dateRegExp),
					matchs2 = dateString.match(/(\d)+/g);
				var d = new Date();
				for (var i = 0; i < matchs1.length; i++) {
					var j = parseInt(matchs2[i], 10);
					if(matchs2[i]){
						switch (matchs1[i].charAt(0) || '') {
							case 'y':
								d.setFullYear(j || d.getFullYear());
								break;
							case 'M' :
								j = j - 1;
								d.setMonth(util.type.isNumber(j) ? j : d.getMonth());
								break;
							case 'd' :
								d.setDate(j || d.getDate());
								break;
							case 'H' :
								d.setHours(j || d.getHours());
								break;
							case 'm' :
								d.setMinutes(j || d.getMinutes());
								break;
							case 's' :
								d.setSeconds(j || d.getSeconds());
								break;
							default :
								break;
						}
					}
				}
				return d;
			} catch (ex) {
				throw new Error('tools.dateFormat: Time Conf Incorrect');
			}
		},
		formatDate = (function() {
			function padding(s, len) {
				var len = len - (s + "").length;
				for (var i = 0; i < len; i++) {
					s = "0" + s;
				}
				return s;
			}
			return function(value, pattern){
				if (!util.type.isDate(value)) {
					return '';
				}
				try {
					pattern = pattern || comboFormatReg;
					return pattern.replace(dateRegExp, function(all) {
						switch (all.charAt(0)) {
							case 'y' :
								return padding(value.getFullYear(), all.length);
							case 'M' :
								return padding(value.getMonth() + 1, all.length);
							case 'd' :
								return padding(value.getDate(), all.length);
							case 'w' :
								return value.getDay() + 1;
							case 'H' :
								return padding(value.getHours(), all.length);
							case 'm' :
								return padding(value.getMinutes(), all.length);
							case 's' :
								return padding(value.getSeconds(), all.length);
							default :
								return '';
						}
					});
				} catch (ex){
					return '';
				}
				return null;
			}
		})(),
		getActualMaximum = function(date) {
			var vDate = new Date(date.getTime());
			vDate.setMonth(vDate.getMonth() + 1);
			vDate.setDate(0);
			return vDate.getDate();
		},
		dateFormat = function() {
			var p0 = arguments[0],
				p1 = arguments[1];
			if (util.type.isNumber(p0)) {
				this.vDate = new Date(p0);
			} else if (util.type.isDate(p0)) {
				this.vDate = new Date(p0.getTime());
			} else if (util.type.isString(p0)) {
				if (util.type.isString(p1) || typeof p1 === 'undefined') {
					this.vDate = parseDate(p0, p1);
				}
			} else if (arguments.length == 0) {
				this.vDate = new Date();
			} else {
				throw new Error('tools.dateFormat: Unable To Create Time Object');
			}
		};
	dateFormat.isDate = function(obj){
		return obj instanceof dateFormat || (obj != null && hasOwnProp.call(obj, 'plusYear'));
	}
	dateFormat.prototype = {
		plusYear : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setFullYear(year + value);
			}));
		},
		plusMonth : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setMonth(month + value);
			}));
		},
		plusDate : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setDate(date + value);
			}));
		},
		plusHours : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setHours(hours + value);
			}));
		},
		plusMinutes : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setMinutes(minutes + value);
			}));
		},
		plusSeconds : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setSeconds(seconds + value);
			}));
		},
		minusYear : function(value) {
			return this.plusYear(-value);
		},
		minusMonth : function(value) {
			return this.plusMonth(-value);
		},
		minusDate : function(value) {
			return this.plusDate(-value);
		},
		minusHours : function(value) {
			return this.plusHours(-value);
		},
		minusMinutes : function(value) {
			return this.plusMinutes(-value);
		},
		minusSeconds : function(value) {
			return this.plusSeconds(-value);
		},
		setYear : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setFullYear(value);
			}));
		},
		setMonth : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setMonth(value);
			}));
		},
		setDate : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setDate(value);
			}));
		},
		setHours : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setHours(value);
			}));
		},
		setMinutes : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setMinutes(value);
			}));
		},
		setSeconds : function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setSeconds(value);
			}));
		},
		setMillisecond: function(value) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				vDate.setMilliseconds(value);
			}));
		},
		getYear : function() {
			return this.vDate.getFullYear();
		},
		getMonth : function() {
			return this.vDate.getMonth();
		},
		getDate : function() {
			return this.vDate.getDate();
		},
		getHours : function() {
			return this.vDate.getHours();
		},
		getMinutes : function() {
			return this.vDate.getMinutes();
		},
		getSeconds : function() {
			return this.vDate.getSeconds();
		},
		getMilliseconds: function() {
			return this.vDate.getMilliseconds();
		},
		getDay : function() {
			return this.vDate.getDay();
		},
		toDate : function() {
			return cloneDate(this.vDate);
		},
		clone : function() {
			return new dateFormat(cloneDate(this.vDate));
		},
		getBegin : function(field) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				switch (field) {
					case 'yyyy' ://year
						vDate.setMonth(0);
						vDate.setDate(1);
						vDate.setHours(0);
						vDate.setMinutes(0);
						vDate.setSeconds(0);
						vDate.setMilliseconds(0);
						break;
					case 'MM' ://month
						vDate.setDate(1);
						vDate.setHours(0);
						vDate.setMinutes(0);
						vDate.setSeconds(0);
						vDate.setMilliseconds(0);
					case 'dd' ://date
						vDate.setHours(0);
						vDate.setMinutes(0);
						vDate.setSeconds(0);
						vDate.setMilliseconds(0);
						break;
					default :
					//Ignore
				}
			}));
		},
		getEnd: function(field) {
			return new dateFormat(cloneDate(this.vDate, function(vDate, year, month, date, hours, minutes, seconds) {
				switch (field) {
					case 'yyyy' :
						vDate.setMonth(11);
						vDate.setDate(31);
						vDate.setHours(23);
						vDate.setMinutes(59);
						vDate.setSeconds(59);
						vDate.setMilliseconds(999);
						break;
					case 'MM' :
						vDate.setDate(getActualMaximum(vDate));
						vDate.setHours(23);
						vDate.setMinutes(59);
						vDate.setSeconds(59);
						vDate.setMilliseconds(999);
					case 'dd' :
						vDate.setHours(23);
						vDate.setMinutes(59);
						vDate.setSeconds(59);
						vDate.setMilliseconds(999);
						break;
					default :
					//Ignore
				}
			}));
		},
		toString: function(pattern) {
			return formatDate(this.vDate, pattern);
		},
		diffMonth: function(end){
			end = end.replace(/-/g, '/');
			var date = new Date(end);
			if(isNaN(date.getTime())){
				return '';
			}
			end = new dateFormat(formatDate(date, 'yyyy-MM-dd'));
			var endMonth = end.getMonth() + 1,
				endYear = end.getYear() * 12,
				startMonth = this.getMonth() + 1,
				startYear = this.getYear() * 12,
				diffMonth = (startYear + startMonth) - (endYear + endMonth);
			return diffMonth;
		}
	};
	return dateFormat;

});