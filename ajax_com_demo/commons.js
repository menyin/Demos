(function (win,$) {

    $.fn.extend({
        ajaxDisabled:function (settings) {
            var $this=$(this);
            var oriClass = $this.attr('class');
            $this.click(function () {
                var options =cloneObj(settings);
                $this.prop('disabled',true).attr('class','btn');
                if(options.data&&options.data.constructor.name=='Function'){
                    options.data = options.data.call(this);
                }
                if(options.success) {
                    var callback0=options.success;
                    options.success=function (data) {
                        if($this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }

                        callback0(data);
                    }
                }
                if(options.error) {
                    var callback1=options.error;
                    options.error=function (e) {

                        if($this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }
                        callback1(e);
                    }
                }
                if(options.beforeSend) {
                    var callback2=options.beforeSend;
                    options.beforeSend=function (XMLHttpRequest) {
                        /*
                            if(data.status<0) {
                                // $this.prop('disabled',false).removeClass('btn_disabled');
                                $this.prop('disabled',false).attr('class',oriClass);
                            }else {
                                // $this.prop('disabled',true).addClass('btn_disabled');
                                $this.prop('disabled',true).attr('class','btn');
                            }
                        */
                        var beforeSendResult=callback2(XMLHttpRequest);
                        if(!beforeSendResult&&$this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }
                        return beforeSendResult;
                    }
                }
                $.ajax(options);
            });

        },
        submitDisabled: function (settings) {
            var $this=$(this);
            var oriClass = $this.attr('class');
            $this.click(function () {
                var options =cloneObj(settings);
                $this.prop('disabled',true).attr('class','btn');
                var form = $this.closest('form');
                if(options.data&&options.data.constructor.name=='Function'){
                    options.data = options.data.call(this);
                }
                if(options.success) {
                    var callback0=options.success;
                    options.success=function (data) {
                        if($this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }
                        /*
                            if(data.status<0) {
                                // $this.prop('disabled',false).removeClass('btn_disabled');
                                $this.prop('disabled',false).attr('class',oriClass);
                            }else {
                                // $this.prop('disabled',true).addClass('btn_disabled');
                                $this.prop('disabled',true).attr('class','btn');
                            }
                        */
                        callback0(data);
                    }
                }
                if(options.error) {
                    var callback1=options.error;
                    options.error=function (e) {
                        /* // if($this.hasClass('btn_disabled')){
                         if($this.prop('disabled')){
                             debugger;
                             // $this.prop('disabled',false).removeClass('btn_disabled');
                             $this.prop('disabled',false).attr('class',oriClass);
                         }*/
                        if($this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }
                        callback1(e);
                    }
                }
                if(options.beforeSubmit) {
                    var callback2=options.beforeSubmit;
                    options.beforeSubmit=function (data) {
                        /*
                            if(data.status<0) {
                                // $this.prop('disabled',false).removeClass('btn_disabled');
                                $this.prop('disabled',false).attr('class',oriClass);
                            }else {
                                // $this.prop('disabled',true).addClass('btn_disabled');
                                $this.prop('disabled',true).attr('class','btn');
                            }
                        */
                        var beforeSubmitResult=callback2(data);
                        if(!beforeSubmitResult&&$this.prop('disabled')&&$this.attr('class')=='btn'){
                            $this.prop('disabled',false).attr('class',oriClass);
                        }
                        return beforeSubmitResult;
                    }
                }
                form.ajaxSubmit(options);
            });
        }
    });

    //深复制对象方法
    var cloneObj = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
            newObj[key] = typeof val === 'object' ? cloneObj(val): val;
        }
        return newObj;
    };
    /* win.CS = {
         ajax:$.ajax,
         get:$.get,
         post:$.post,
         ajaxDisabled:function ($this,options) {
             var oriClass = $this.attr('class');
             $this.click(function () {
                 $this.prop('disabled',true).attr('class','btn');
                 if(options.success) {
                     var callback0=options.success;
                     options.success=function (data) {
                         if($this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }

                         callback0(data);
                     }
                 }
                 if(options.error) {
                     var callback1=options.error;
                     options.error=function (e) {

                         if($this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }
                         callback1(e);
                     }
                 }
                 if(options.beforeSend) {
                     var callback2=options.beforeSend;
                     options.beforeSend=function (XMLHttpRequest) {
                         /!*
                             if(data.status<0) {
                                 // $this.prop('disabled',false).removeClass('btn_disabled');
                                 $this.prop('disabled',false).attr('class',oriClass);
                             }else {
                                 // $this.prop('disabled',true).addClass('btn_disabled');
                                 $this.prop('disabled',true).attr('class','btn');
                             }
                         *!/
                         var beforeSendResult=callback2(XMLHttpRequest);
                         if(!beforeSendResult&&$this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }
                         return beforeSendResult;
                     }
                 }
                 $.ajax(options);
             });

         },
         submitDisabled: function ($this,options) {
             var oriClass = $this.attr('class');
             $this.click(function () {
                 $this.prop('disabled',true).attr('class','btn');
                 var form = $this.closest('form');

                 if(options.success) {
                     var callback0=options.success;
                     options.success=function (data) {
                         if($this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }
                         /!*
                             if(data.status<0) {
                                 // $this.prop('disabled',false).removeClass('btn_disabled');
                                 $this.prop('disabled',false).attr('class',oriClass);
                             }else {
                                 // $this.prop('disabled',true).addClass('btn_disabled');
                                 $this.prop('disabled',true).attr('class','btn');
                             }
                         *!/
                         callback0(data);
                     }
                 }
                 if(options.error) {
                     var callback1=options.error;
                     options.error=function (e) {
                         /!* // if($this.hasClass('btn_disabled')){
                          if($this.prop('disabled')){
                              debugger;
                              // $this.prop('disabled',false).removeClass('btn_disabled');
                              $this.prop('disabled',false).attr('class',oriClass);
                          }*!/
                         if($this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }
                         callback1(e);
                     }
                 }
                 if(options.beforeSubmit) {
                     var callback2=options.beforeSubmit;
                     options.beforeSubmit=function (data) {
                         /!*
                             if(data.status<0) {
                                 // $this.prop('disabled',false).removeClass('btn_disabled');
                                 $this.prop('disabled',false).attr('class',oriClass);
                             }else {
                                 // $this.prop('disabled',true).addClass('btn_disabled');
                                 $this.prop('disabled',true).attr('class','btn');
                             }
                         *!/
                         var beforeSubmitResult=callback2(data);
                         if(!beforeSubmitResult&&$this.prop('disabled')&&$this.attr('class')=='btn'){
                             $this.prop('disabled',false).attr('class',oriClass);
                         }
                         return beforeSubmitResult;
                     }
                 }
                 form.ajaxSubmit(options);
             });
         }

     }*/
})(window,jQuery||$);