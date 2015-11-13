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
     * 设置变量 
     * 将指定options转换为obj.$xxx的变量
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
    clean: function () {
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
        url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
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
        msg: function(msg) {
            layer.msg(msg, {
                time: 1000,
                offset: '200px'
            });
        }
    }
}
