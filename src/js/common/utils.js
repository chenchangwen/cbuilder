
define(['jquery'], function ($) {
    var exports = {};
    //随机数
    exports.rndNum = function rndNum(n) {
        var rnd = "";
        for (var i = 0; i < n; i++)
            rnd += Math.floor(Math.random() * 10);
        return rnd;
    }

    //精确相除
    exports.accDiv = function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }

    //比较是否重复
    exports.isCompareExist = function isCompareExist(value, compareary) {
        var sum = 0;
        for (var i = 0; i < compareary.length - 1; i++) {
            if (value === compareary[i]) {
                sum++;
            }
        }
        if (sum == 0) {
            return false;
        }
        return true;
    }

    //调用所有方法
    exports.callAllFn = function (obj) {
        for (var pfn in obj) {
            for (var i = 1; i < arguments.length; i++) {
                if (pfn !== arguments[i]) {
                    if (typeof (obj[pfn]) == "function") {
                        obj[pfn]();
                    }
                }
            }
        }
    }

    //加载文件
    exports.loadFile = function(arg) {
        for (var i = 0; i < arg.length; i++) {
            var link = arg[i];
            if (link.indexOf('css') >= 0) {
                var css = $("<link rel='stylesheet' type='text/css' href='" + link + "'>");
                $("head").append(css);
            } else {
                $.getScript(link);
            }
        }
    }
    return exports;
});

