/* 图片组件 */
cbuilder['picture'] = function () {
    var serverTime;
    var strimg = 'img';
    /* 倒计时 */
    var countdown = function ($element) {
        this.element = $element;
    };
    countdown.prototype = {
        /* 开始 */
        start: function () {
            this.init();
            this.appendHtml();

            /* 缓存当前时间 */
            var $this = this.element;
            $this.data('time', serverTime);
            var $hour = $this.find(".cdh"),
            $minute = $this.find(".cdm"),
            $tip = $this.find(".cdtip"),
            $second = $this.find(".cds");

            /* 倒计时执行方法 */
            function countDown() {
                var timenow = $this.data('time') * 1000;
                var tip = '';
                var startdate = $this.startdate;
                var enddate = $this.enddate;
                var isdayunit = $this.isdayunit;
                var timeDistance = 0;
                if (startdate > timenow && timenow < enddate || startdate > timenow && enddate == undefined) {
                    tip = '距离开始时间还有:';
                    timeDistance = startdate - timenow;
                }
                else if (startdate == undefined && timenow <= enddate || timenow <= enddate) {
                    tip = '距离结束时间还有:';
                    timeDistance = enddate - timenow;
                }
                var removeCountDown = function () {
                    if (typeof $this['cdtimeout'] != "undefined")
                        clearTimeout($this['cdtimeout']);
                    $this.remove();
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
                    /* 如果剩余天数大于1,并且开启天数转换 */
                    if ($this.format === 'cn') {
                        if (day > 0 && isdayunit === "true" && maxhour >= 24) {
                            $hour.html(day + "天" + hour + '时');
                        } else {
                            $hour.html(maxhour + '时');
                        }
                        $tip.html(tip);
                        $minute.html(minute + '分');
                        $second.html(second + '秒');
                    } else if ($this.format === 'HH:mm:ss') {
                        if (day > 0 && isdayunit === "true" && maxhour >= 24) {
                            $hour.html(day + "天" + hour + ':');
                        } else {
                            $hour.html(maxhour + ':');
                        }
                        $tip.html(tip);
                        $minute.html(minute + ':');
                        $second.html(second);
                    }
                    if (day === 0 && hour === "00" && minute === "00" && second === "00") {
                        removeCountDown();
                    }
                    var time = $this.data('time') + 1;
                    $this.data('time', time);
                    /* 多实例 所以必须 以此命名 */
                    $this['cdtimeout'] = setTimeout(countDown, 1000);

                } else {
                    removeCountDown();
                }
            }
            countDown();
        },
        /* 初始化 */
        init: function () {
            var $this = this.element;
            /* 开始时间 */
            var startdate = $this.attr("startdate");
            /* 结束时间 */
            var enddate = $this.attr("enddate");
            if (startdate != undefined) {
                startdate = new Date(commons.stringToDate(startdate + ':00'));
            }
            if (enddate != undefined) {
                enddate = new Date(commons.stringToDate(enddate + ':00'));
            }
            /* 时间格式 */
            $this.format = $this.attr("format") || 'cn';
            $this.startdate = startdate;
            $this.enddate = enddate;
            /* 是否天为单位 */
            $this.isdayunit = $this.attr("isdayunit");
            /* 移除属性 */
            $this.removeAttr('startdate').removeAttr('enddate').removeAttr('isdayunit').removeAttr('format');
        },
        /* 添加html */
        appendHtml: function () {
            var html = '';
            var $this = this.element;
            html += "<span class='cdtip'></span>";
            html += "<span class='cdh'></span>";
            html += "<span class='cdm'></span>";
            html += "<span class='cds'></span>";
            $this.html(html);
        }
    }
    var view = {
        /* dom缓存 */
        _domCache: function () {
            commons.setObjVariable(view, '.cb-cropwrap', 'cb-');
            view.$imgpos = view.$cropwrap.find('.imgpos');
            serverTime = commons.stringToDate($('div[data-nowtime]').data('nowtime')) / 1000 || new Date().getTime() / 1000;
        },
        _pictureComponent: function () {
            /* 商品数组 */
            var goodIdAry = [],
            /* 需要显示商品的数组 */
                showGoodIdAry = [];
            /* 商品链接正则 */
            var patterns = [/goods_id=\d+/, /\d+.html/ig, /goods-\d+/];
            var area = {
                /* 校验Icon状态 */
                checkIconState: function () {
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
                        /* 如果是最后一个,则显示图片Icon */
                        if (i === (view.$imgpos.length - 1)) {
                            area.showStateIcon();
                        }
                    });
                },
                /* 校验倒计时状态 */
                checkCountDownState: function () {
                    var isshow = false;
                    view.$cropwrap.each(function () {
                        var timenow = serverTime * 1000;
                        var $this = $(this);
                        /* 显示时间 */
                        var showdate = commons.stringToDate($this.attr('showdate') + ':00');
                        /* 结束时间 */
                        var hidedate = commons.stringToDate($this.attr('hidedate') + ':00');
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
                            var $countdown = $this.find(".imgpos[linktype='countdown']");
                            $countdown.each(function () {
                                var cd = new countdown($(this));
                                cd.start();
                                $(this).removeAttr('linktype');
                            });
                        } else {
                            $this.hide();
                            $this.find(strimg).hide();
                        }
                    });
                },
                /* 显示状态Icon*/
                showStateIcon: function () {
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
<<<<<<< HEAD
                                            /* add by yy 临时保存匹配结果 */
=======
>>>>>>> ec37fa8b935fc54bde973fdbfd82bffc48bb881d
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
                init: function () {
                    commons.objectCallFunction(area, 'checkIconState', 'checkCountDownState');
                }
            };
            area.init();
        },
        struc: function () {
            commons.objectCallFunction(view, '_domCache', '_pictureComponent');
        }
    }
    view.struc();
};