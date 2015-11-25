/* 全局定义 */
var cbuilder = {};
(function () {
    /* 通用 */
    var commons = {
        /* 
         * 设置变量 将指定setStr转换为obj.$xxx的变量
         * --------通常转换为固定的元素id或一系列的类
         * @param1 {Object} Javascript简单对象
         * @param2 {String} 转换的字符串,号分割  如"a,b,c,d"
         * @param3 {String} 过滤字符串 
                            如:$("#mybutton1") 如果该参数为"my"
                            则:obj.$button1为转换的变量,否则为obj.$mybutton1
         */
        setObjVariable: function (obj, setStr, filter) {
            if (setStr != undefined) {
                if (typeof setStr == "string") {
                    setStr = setStr.split(',');
                    for (var i = 0; i < setStr.length; i++) {
                        var rpoptoin = setStr[i];
                        if (filter) {
                            rpoptoin = rpoptoin.replace(filter, '');
                        }
                        var tag = '#';
                        if (setStr[i].indexOf('.') >= 0) {
                            rpoptoin = rpoptoin.replace(/\./ig, '');
                            tag = '';
                        }
                        obj["$" + rpoptoin] = $(tag + setStr[i]);
                    }
                }
            }
        },
        /* 字符串转date型 */
        stringToDate: function(sTime) {
            if (sTime && sTime.indexOf('-') >= 4 && sTime.indexOf(':') >= 13) {
                var fullDate = sTime.split(" ")[0].split("-");
                var fullTime = sTime.split(" ")[1].split(":");
                return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], (fullTime[0] !== null ? fullTime[0] : 0), (fullTime[1] !== null ? fullTime[1] : 0), (fullTime[2] !== null ? fullTime[2] : 0));
            } else if (/^\d+$/.test(sTime)) {
                if (sTime.length === 10) { //如果只是10位 则只计算到了秒  Date对象是计算到毫秒
                    sTime = sTime + "000";
                }
                return new Date(parseInt(sTime, 10));
            }
        },
        /**
         * 对象-调用对象自身函数
         * @param1 {Object} 调用的对象
         * @params {arguments} 调用的对象的方法名
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
        /* 请求数据 */
        ajaxData: function (option, cb) {
            var settings = {
                type: "post"
            };
            var options = $.extend({}, settings, option);
            $.ajax({
                url: options.url,
                data: options.data,
                type: options.type,
                success: function (msg) {
                    if (typeof cb == "function") {
                        cb($.parseJSON(msg));
                    }
                }
            });
        }
    }
    var view = {
        /* 初始化 */
        init: function() {
            var $img = $('img');
            var imglen = $img.length;
            var imgcount = 0;
            $img.one("load", function () {
                if (++imgcount === imglen) {
                    view._parseComponents();
                }
            }).each(function () {
                if (this.complete) $(this).load();
            });
        },
        /* 解析组件 */
        _parseComponents: function () {
            for (var fname in cbuilder) {
                var fn = cbuilder[fname];
                if (fname === 'parse')
                    return false;
                if (typeof fn === 'function') {
                    fn();
                }
            }
        }
    }
    ~~include('../parser/component/all.js')
    /**
     * 解析cbuilder
     * @selector {String} 选择器,决定解析DOM的范围,没有该值,则全局解析
     */
    cbuilder.parse = function (selector) {
        if (selector) {
            cbuilder.selector = selector;
        }
        $(document).ready(function () {
            view.init();
        });
    }
})();