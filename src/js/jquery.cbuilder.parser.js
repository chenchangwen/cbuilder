/* 全局定义 */
var cbuilder = {};
(function () {

    var isshow = false,
        serverTime;
    var strimg = 'img';
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
        /* dom缓存 */
        _domCache: function () {
            commons.setObjVariable(view, '.cb-cropwrap','cb-');
            view.$imgpos = view.$cropwrap.find('.imgpos');
            serverTime = commons.stringToDate($('div[data-nowtime]').data('nowtime')) / 1000 || new Date().getTime() / 1000;
        },
        /* 容器事件*/
        tabContainerEvent: function () {
            $(".tabcontainer").each(function () {
                var $this = $(this);
                var $alltab = $('div[tabcontainer="' + $this.attr('id') + '"][tabname]');
                $this.append($alltab);
            });
        },
        /* tab事件 */
        tabEvent: function () {
            var $tabtarget = $('div[tabtarget]');
            $tabtarget.css('display', 'block');
            var clickhover = function (obj) {
                var $this = obj;
                var tabtarget = $this.attr('tabtarget');
                var $tab = $('div[tabname="' + tabtarget + '"]');
                var $tabcontainer = $("#" + $tab.attr('tabcontainer'));
                var $containertab = $tabcontainer.find('div[tabname="' + tabtarget + '"]');
                if ($containertab.length === 0) {
                    $tabcontainer.append($tab);
                }
                $tabcontainer.find('div').hide();
                $tab.show();
                $tab.find('img,div').show();
            }
            $tabtarget.each(function () {
                var $this = $(this);
                var tabaction = $this.attr('tabaction');
                if (tabaction === 'click') {
                    $this.on('click', function () {
                        clickhover($(this));
                    });
                }
                else if (tabaction === 'hover') {
                    $this.on('mouseover', function () {
                        clickhover($(this));
                    });
                }
            });
        },
        /* 优惠券事件 */
        couponEvent: function () {
            $('.cropwrap .imgpos[linktype="button"]').on('click', function () {
                var ids = $(this).data('id');
                if (!ids) {
                    return false;
                }
                var query = {
                    url: "/index.php?act=coupon&op=receiveCoupon",
                    data: {
                        coupon_ids: ids,
                        client: "pc"
                    }
                };
                commons.ajaxData(query, function (response) {
                    var obj = response;
                    /* 没登陆显示登陆框 */
                    if (obj.code === '60004') {
                        sbLib.loginShow(0);
                    } else {
                        /* 显示对应提示 */
                        layer.alert(obj.desc);
                    }
                });
            });
        },
        /* 绑定事件 */
        _bindEvents: function () {
            //ccweditor.objectCallFunction(ccweditor, 'cropWrapEvent', 'tabContainerEvent', 'tabEvent', 'couponEvent');
        },
        /* 热点组件 */
        _HotLinkComponent: function () {
            var goodIdAry = [],
                showGoodIdAry = [];
            var patterns = [/goods_id=\d+/, /\d+.html/ig, /goods-\d+/];
            var hotlink = {
                /* 校验Icon状态 */
                checkIconState: function() {
                    view.$imgpos.each(function (i) {
                        var $this = $(this);
                        var str = $this.attr("href");
                        if (str) {
                            if (str.indexOf("item.shenba.com") >= 0) {
                                for (var k = 0; k < patterns.length; k++) {
                                    if (patterns[k].test(str)) {
                                        str = str.toString();
                                        str = str.match(patterns[k]);
                                    }
                                }
                                if (str != null) {
                                    str = str.toString().match(/\d+/);
                                    if ($this.attr("linkicon") == undefined) {
                                        if (str != null) {
                                            goodIdAry.push(str);
                                        }
                                    }
                                }
                            }
                        }
                        /* 如果是最后一个,则显示图片tip */
                        if (i === (view.$imgpos.length - 1)) {
                            hotlink.showStateIcon();
                        }
                    });  
                },
                /* 校验倒计时状态 */
                checkCountDownState: function() {
                    view.$cropwrap.each(function () {
                        var timenow = serverTime * 1000;
                        var $this = $(this);
                        var showdate = commons.stringToDate($this.attr('showdate'));
                        var hidedate = commons.stringToDate($this.attr('hidedate'));
                        /* 没有设置 开始,结束时间 */
                        if (showdate === undefined && hidedate === undefined) {
                            isshow = true;
                        } else {
                            if (showdate != undefined && hidedate === undefined) {
                                if (new Date(showdate) < timenow) {
                                    isshow = true;
                                }
                            }
                            if (hidedate != undefined && showdate === undefined) {
                                if (timenow < new Date(hidedate)) {
                                    isshow = true;
                                }
                            }
                            if (showdate != undefined && hidedate != undefined) {
                                isshow = new Date(showdate) < timenow && timenow < new Date(hidedate);
                            }
                        }
                        /* 条件正确显示图片 */
                        if (isshow) {
                            $this.find(strimg).show();
                        } else {
                            $this.hide();
                            $this.find(strimg).hide();
                        }
                        //$this.removeAttr('showdate').removeAttr('hidedate');
                        view.countdownEvent($this);
                    });
                },
                /* 显示状态Icon*/
                showStateIcon: function() {
                    /* 商品id都没就不用检测了 */
                    if (goodIdAry.length === 0)
                        return false;
                    var query = {
                        url: "/index.php?act=index&op=getgoods_storage",
                        data: {
                            client: "pc",
                            goods_id: goodIdAry.toString()
                        }
                    };
                    /* 请求是否显示图片id的商品 */
                    commons.ajaxData(query, function (response) {
                        var json = response;
                        if (json.data != undefined) {
                            var jsondata = json.data;
                            if (jsondata.status === 1) {
                                if (jsondata.list != undefined) {
                                    var jsonlist = jsondata.list;
                                    var i = 0, len = 0;
                                    for (i = 0, len = jsonlist.length; i < len; i++) {
                                        /* 如果数量大于1则存储 */
                                        if (jsonlist[i].goods_storage <= 0) {
                                            if (jsonlist[i].goods_id !== "")
                                                showGoodIdAry.push(jsonlist[i].goods_id);
                                        }
                                    };
                                    /* 遍历需要显示的id数组 */
                                    for (i = 0, len = showGoodIdAry.length; i < len; i++) {
                                        $(".imgpos").each(function () {
                                            var $this = $(this);
                                            var href = $this.attr("href");
                                            /* add by yy 临时保存匹配结果 */
                                            var match = '';
                                            if (href) {
                                                for (var j = 0; j < patterns.length; j++) {
                                                    match = href.toString().match(/\d+/);
                                                    if (match && match[0] === showGoodIdAry[i]) {
                                                        $this.children("b").css("display", "block");
                                                    }
                                                }
                                            }
                                        });
                                    };
                                }
                            }
                        }
                    });
                    return false;
                },
                /* 显示倒计时 */
                showCountDown: function (cropwrap) {
                    /* 时间差 */
                    var timeDistance; 
                    var $this = cropwrap;
                    var startdate = $this.attr("startdate");
                    var enddate = $this.attr("enddate");
                    $this.removeAttr('dayhours');
                    if (startdate != undefined) {
                        startdate = new Date(commons.stringToDate(startdate));
                    }
                    if (enddate != undefined) {
                        enddate = new Date(commons.stringToDate(enddate));
                    }
                    $this.data('startdate', startdate).data('enddate', enddate);
                    $this.removeAttr('startdate').removeAttr('enddate');

                    var $countdown = $this.find(".imgpos[linktype='countdown']");
                    $countdown.each(function () {
                        var $this = $(this);
                        var html = '';
                        var iscdsuffix = false;
                        html += "<span class='edtip'></span>";
                        if ($this.attr("cdsuffix") === 'true') {
                            html += "<span class='edh'></span>" + "<span>时</span>";
                            html += "<span class='edm'></span>" + "<span>分</span>";
                            html += "<span class='eds'></span>" + "<span>秒</span>";
                            iscdsuffix = true;
                        } else {
                            html += "<span class='edh'></span>";
                            html += "<span class='edm'></span>";
                            html += "<span class='eds'></span>";
                            $this.data('cdsuffix', 'false');
                        }
                        $this.removeAttr('cdsuffix');
                        $this.html(html);
                        $this.data('cdsuffix', iscdsuffix);
                    });
                    $this.data('time', serverTime);
                    var $hour = $this.find(".edh"),
                    $minute = $this.find(".edm"),
                    $tip = $this.find(".edtip"),
                    $second = $this.find(".eds");

                    function countDown() {
                        var timenow = $this.data('time') * 1000;
                        var cdsuffix = $hour.parent().data("cdsuffix");
                        var tip = '';
                        startdate = $this.data('startdate');
                        enddate = $this.data('enddate');

                        if (startdate > timenow && timenow < enddate || startdate > timenow && enddate == undefined) {
                            tip = '距离开始时间还有: ';
                            timeDistance = startdate - timenow;
                        }
                        else if (startdate == undefined && timenow <= enddate || timenow <= enddate) {
                            tip = '距离结束时间还有: ';
                            timeDistance = enddate - timenow;
                        }

                        var day, hour, minute, second, maxhour;
                        if (timeDistance >= 0) {
                            // 相减的差数换算成天数   
                            day = Math.floor(timeDistance / 86400000);
                            timeDistance -= day * 86400000;
                            // 相减的差数换算成小时
                            hour = Math.floor(timeDistance / 3600000);
                            //alert(intHour)
                            timeDistance -= hour * 3600000;
                            // 相减的差数换算成分钟   
                            minute = Math.floor(timeDistance / 60000);
                            timeDistance -= minute * 60000;
                            // 相减的差数换算成秒数  
                            second = Math.floor(timeDistance / 1000); //判断小时小于10时，前面加0进行占位
                            if (hour < 10)
                                hour = "0" + hour;
                            // 判断分钟小于10时，前面加0进行占位      
                            if (minute < 10)
                                minute = "0" + minute;
                            // 判断秒数小于10时，前面加0进行占位 
                            if (second < 10)
                                second = "0" + second;
                            //转换后:最大小时
                            maxhour = parseInt(hour) + (day * 24);
                            //如果剩余天数大于1,并且开启天数转换
                            //if (day > 0 && dayhours === "true" && maxhour >= 24) {
                            if (day > 0 && maxhour >= 24) {
                                $hour.html(day + "天" + hour);
                                //if (cdsuffix === 'true') {
                                //    $hour.html(day + "天" + hour);
                                //} else {
                                //    $hour.html(day + "天 " + hour + ' ');
                                //}
                            } else {
                                $hour.html(maxhour);
                                //intHour = parseInt(intHour) + (intDay * 24);
                                //if (cdsuffix === 'true') {
                                //    $hour.html(maxhour);
                                //} else {
                                //    $hour.html(maxhour + ':');
                                //}
                            }
                            $tip.html(tip + ' ');
                            $minute.html(minute);
                            $second.html(second);
                            //if (cdsuffix === 'true') {
                            //    $tip.html(tip);
                            //    $minute.html(minute);
                            //    $second.html(second);
                            //} else {
                            //    $tip.html(tip + ' ');
                            //    $minute.html(minute);
                            //    $second.html(second);
                            //}
                            var time = cropwrap.data('time') + 1;
                            cropwrap.data('time', time);
                            /* 多实例 所以必须 以此命名 */
                            cropwrap['cdtimeout'] = setTimeout(countDown, 1000);

                        } else {
                            if (typeof cropwrap['cdtimeout'] != "undefined")
                                clearTimeout(cropwrap['cdtimeout']);
                            $this.find(".imgpos[linktype='countdown']").remove();
                        }
                    }
                    countDown();
                },
                init: function() {
                    commons.objectCallFunction(view, 'checkIconState', 'checkCountDownState');
                }
            };
            hotlink.init();
        },
        /* asdf1234 */
        _ComponentsCustomEvent: function () {
            
        },
        /* 解析组件 */
        _parseComponents: function () {
            commons.objectCallFunction(view, '_domCache', '_HotLinkComponent');
        },
        init: function () {
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
        }
    }

    cbuilder = {
        /**
         * 解析cbuilder
         * @selector {String} 选择器,决定解析DOM的范围,没有该值,则全局解析
         */
        parse: function (selector) {
            if (selector) {
                cbuilder.selector = selector;
            }
            $(document).ready(function () {
                view.init();
            });
        }
    };
    cbuilder.parse();
})();