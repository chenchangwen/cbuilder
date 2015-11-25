var commons = {
    /* 加载文件 */
    loadFile: function(srcarray) {
        for (var i = 0; i < srcarray.length; i++) {
            var vendor = $.cbuilder.path.root + srcarray[i];
            if (vendor.indexOf('css') >= 0) {
                var cssLink = $("<link rel='stylesheet' type='text/css' href='" + vendor + "'>");
                $("head").append(cssLink);
            } else { 
                $.ajax({
                    async: false,
                    url: vendor
                });
            }
        }
    },
    /* 
     * 设置变量 将指定options转换为obj.$xxx的变量
     * --------通常转换为固定的元素id或一系列的类
     * @param1 {Object} Javascript简单对象
     * @param2 {String} 转换的字符串,号分割  如"a,b,c,d"
     * @param3 {String} 过滤字符串 
                        如:$("#mybutton1") 如果该参数为"my"
                        则:obj.$button1为转换的变量,否则为obj.$mybutton1
     */
    setObjVariable: function (obj,options,filter) {
        if (options != undefined) {
            if (typeof options == "string") {
                options = options.split(',');
                for (var i = 0; i < options.length; i++) {
                    var rpoptoin = options[i];
                    if (filter) {
                        rpoptoin =rpoptoin.replace(filter, '');
                    }
                    var tag = '#';
                    if (options[i].indexOf('.') >= 0) {
                        rpoptoin = rpoptoin.replace(/\./ig, '');
                        tag = '';
                    }
                    obj["$" + rpoptoin] = $(tag + options[i]);
                }
            }
        }
    },
    /* 清理 */
    removeImpos: function () {
        /* jcrop */
        if (typeof (jcrop_api) != "undefined") {
            jcrop_api.destroy();
            jcrop_api.release();
            delete jcrop_api;
        }
        /* 如果是激活的imgpos 则删除,因为此时保存 肯定会新建新的imgpos */
        if ($.cbuilder.propertiesWindow.$selectedobj.hasClass('imgpos-active')) {
            $.cbuilder.propertiesWindow.$selectedobj.remove();
        } 
        /* 删除jcrop 生成的属性 */
        $.cbuilder.active.$element.find('img').css('visibility', '');

        /* 删除临时操作的id */
        $('#tempimgpos').removeAttr('id');
    },
    /**
     * 对象-调用对象自身函数
     * @param1 {Object}
     * @params {arguments}  执行的方法名
     * @return {Array}
     */
    objectCallFunction: function (obj) {
        var fn;
        for (var i = 1; i < arguments.length; i++) {
            fn = obj[arguments[i]];
            if (typeof fn === 'function') {
                fn();
            }
        }
    },
    /* 正则 */
    regex: {
        url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        number: /^[0-9]*[1-9][0-9]*$/
    },
    /* 格式化 */
    formatDate: function(date,format) {
        if (!date) return;
        if (!format) format = "yyyy-MM-dd";
        switch (typeof date) {
            case "string":
                date = new Date(date.replace(/-/, "/"));
                break;
            case "number":
                date = new Date(date);
                break;
        }
        if (!date instanceof Date) return;
        var dict = {
            "yyyy": date.getFullYear(),
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
            return dict[arguments[0]];
        });
    },
    dateTimePicker: {
        /* 减一天 */
        reduceOneDay: function (value) {
            var d = new Date(value);
            var t = d.getTime() - 1000 * 60 * 60 * 24;
            var yesterday = new Date(t);
            return yesterday;
        },
        format: function(value) {
            if (value === '') {
                return false;
            } else {
                return commons.formatDate(value, 'yyyy/MM/dd');
            }
        }
    },
    /* layer */
    layer: {
        msg: function (type, msg,$focuselement) {
            var info = '';
            switch (type) {
                case 'warning':
                    info = '保存失败';
                    break;
                case 'success':
                    info = '保存成功';
                    break;
            }
            if (msg) {
                if (info !== '')
                    info = info + ':' + msg;
                else {
                    info = msg;
                }
            }
            layer.msg(info, {
                time: 1500,
                offset: '400px'
            });
            if (commons.judge.isJquery($focuselement)) {
                $focuselement.focus();
            }
        }
    },
    /* jcrop*/
    jcrop: {
        load: function (obj, type) {
            if (typeof (jcrop_api) != "undefined") {
                jcrop_api.release();
                jcrop_api.animateTo([100, 100, 0, 0]);
                $.cbuilder.areapos = {
                    w: 100,
                    h: 100,
                    x: 0,
                    y: 0
                };
            } else {
                obj.Jcrop({
                    onSelect: function (c) {
                        $.cbuilder.areapos = {
                            w: c.w,
                            h: c.h,
                            x: c.x,
                            y: c.y
                        };
                        $('#cb-area-width').val($.cbuilder.areapos.w);
                        $('#cb-area-height').val($.cbuilder.areapos.h);
                        $('#cb-area-marginleft').val($.cbuilder.areapos.x);
                        $('#cb-area-margintop').val($.cbuilder.areapos.y);
                    },
                    allowSelect: false
                }, function () {
                    jcrop_api = this;
                    if (type === 'edit') {
                        var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                        var left = $obj.position().left;
                        var top = $obj.position().top;
                        var w = $obj.width() + 4;
                        var h = $obj.height() + 4;
                        $obj.addClass('imgpos-active');
                        jcrop_api.setSelect([left, top, left + w, top + h]);
                    } else {
                        /* 默认:创建jcrop */
                        jcrop_api.animateTo([100, 100, 0, 0]);
                        $.cbuilder.areapos = {
                            w: 100,
                            h: 100,
                            x: 0,
                            y: 0
                        };
                    }
                });
            }
        }
    },
    /* 判断 */
    judge: {
        isJquery:function(obj) {
            if (typeof obj !== 'undefined') {
                if (obj instanceof jQuery) {
                    return true;
                }
            }
            return false;
        }
    }
}
