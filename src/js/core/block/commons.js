var commons= {
    loadFile: function(srcarray) {
        for (var i = 0; i < srcarray.length; i++) {
            var vendor = srcarray[i];
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
    regex: {
        url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    },
    layer: {
        msg: function(msg) {
            layer.msg(msg, {
                time: 2000,
                offset: '200px'
            });
        }
    }
}
