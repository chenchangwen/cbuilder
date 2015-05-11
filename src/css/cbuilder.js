//start by ccw
var goodIdAry = [],
    showGoodIdAry = [];
$(document).ready(function () {
    var serverTime = new Date().getTime() / 1000;
    //领取优惠卷事件
    $('a[target="youhui"],.youhui').on('click', function () {
        var data = $(this).data('id') || '';
        data = data.toString().split(',');

        //最大对象参数长度
        var maxlen = 3;
        //请求接口的对象
        var query = {
            ajax: 1
        };
        var len = data.length <= maxlen ? data.length : maxlen;
        for (var i = 1; i <= len; i++) {
            query['cid' + i] = data[i - 1];
        }
        $.ajax({
            url: AJAX_URL,
            data: query,
            type: 'post',
            success: function (obj) {
                var data = eval('(' + obj + ')');
                if (data.status == 2) {
                    easyLogin.ajax_login();
                    return;
                } else if (data.status == 1) {
                    layer.alert(data.desc, 9);
                    return;
                } else {
                    layer.alert(data.desc);
                    return;
                }
            },
            error: function () {
                layer.alert("领取失败，请稍后重试！");
            }
        });
    });
    //$('.imgpos').remove();

    //登陆事件
    $('a[target="login"],.login').on('click', function () {
        easyLogin.ajax_login();
    });

    //    $('.cropwrap').delegate('b','click', function() {
    //        var $this = $(this),
    //            thishref = $this.attr('href');
    //        if (thishref !== '') {
    //            window.open(thishref);
    //        }
    //    });

    //brand-banner事件
    $('.brand-banner').delegate('area', 'click', function (e) {
        var $this = $(this);
        if ($this.attr('linktype') == 'countdown') {
            e.preventDefault();
        }
    });

    //右侧导航事件
    $('.brand_lift').delegate('area', 'click', function () {
        var $this = $(this),
            //获得当前点击锚点的索引
            index = $('.tempanchor').index($('.tempanchor[id="' + $this.attr('linktarget') + '"]')),
            $allImg = $('.brand_lift img');
        //如果超过1个img
        if ($allImg.length > 1) {
            var $img = $allImg.eq(index);
            //当前area父亲的同级前一个元素('img')改变src
            $this.parent().prev().attr('src', $img.attr('src'));
        }
    });
    //切换图片,显示商品图片tip,处理
    var imgposLen = $('.imgpos').length;
    $('.imgpos').each(function (i) {
        var $this = $(this);
        var $img = $this.prev();

        if ($this.attr('trnpic') != undefined) {
            //切换图片src
            var trnpic = $this.attr('trnpic').split(',');
            //切换图片时间
            var trndate = $this.attr('trndate').split(',');
            if (trndate != '') {
                $img.hide();
                var timeNow = serverTime * 1000;
                var timeNowDate = new Date(timeNow);
                var timeNowHour = timeNowDate.getHours();
                for (var i = 0; i < trnpic.length; i++) {
                    //如果设定的小时等于当前的小时 并且 当前图片src不等于切换图片的src
                    if (parseInt(trndate[i]) == timeNowHour && $img.attr('src') != trnpic[i]) {
                        $img.attr('src', trnpic[i]);
                    }
                }
                $img.show();
            }
        }
        //显示a标签,兼容map
        if ($this[0].tagName === 'A' || $this.attr('linktype') === 'countdown') {
            var style = $this.attr('style') + 'display:block!important';
            $this.css('cssText', style);
        } else {
            $this.css('display', 'none');
        }

        var str = $this.attr('href');
        if (str != undefined) {
            str = str.toString();
            str = str.match(/goods-\d+/);
            if (str != null) {
                str = str.toString().match(/\d+/);
                if ($this.attr('linkicon') == undefined) {
                    if (str != null) {
                        goodIdAry.push(str);
                    }
                }
            }
        }
        //如果是最后一个,则显示图片tip
        if (i == (imgposLen - 1)) {
            showGoodPicTip();
        }
    });

    //倒计时
    (function () {
        var timeEnd, //结束时间
            timeDistance, //时间差
            cycleTimeEnd; //循环时间
        var $countdown = $('.imgpos[linktype="countdown"]:first');
        var $map = $countdown.parent().children('img');
        var startdate = $map.attr('startdate');
        var enddate = $map.attr('enddate');
        var dayhours = $map.attr('dayhours');

        if (startdate != undefined) {
            startdate = new Date($map.attr('startdate').replace(/-/ig, '/'));
        }
        if (enddate != undefined) {
            enddate = new Date($map.attr('enddate').replace(/-/ig, '/'));
        }

        var fontstyle = $map.attr('fontstyle');
        if (fontstyle != undefined) {
            fontstyle = $map.attr('fontstyle').replace(/\$\$/ig, ';');
        }

        //倒计时对象
        $('.imgpos[linktype="countdown"]').each(function () {
            var $this = $(this);
            var linktarget = $this.attr('target') || $this.attr('linktarget'),
                datetype = $this.attr('datetype'),
                cdsuffix = $this.attr('cdsuffix');
            //替换'-'为能被Date对象所处理的字符串
            date = $this.data('id') == undefined ? '0' : $this.data('id').replace(/-/ig, '/');
            if (linktarget === '2' || linktarget === '时间循环') {
                cycleTimeEnd = date.split(',');
            } else if (linktarget === '0' || linktarget === '距离开始时间') {
                timeEnd = startdate;
            } else if (linktarget === '1' || linktarget === '距离结束时间') {
                timeEnd = enddate;
            }

            var style = $this.attr('style') + fontstyle;
            $this.attr('style', style);
            if ($this.css('font-size') != '') {
                style += 'line-height:' + $this.css('font-size');
            }
            $this.attr('style', style);
            var html = '';
            //            var html = '<div class="timesContainer" style="' + fontstyle + '">';
            var issuffix = cdsuffix == "true" ? true : '';
            switch (datetype) {
                case 'hour':
                    if (issuffix) {
                        issuffix = '时';
                    }
                    html += '<span class="timeHour"></span>' + '<span>' + issuffix + '</span>';
                    break;
                case 'minute':
                    if (issuffix) {
                        issuffix = '分';
                    }
                    html += '<span class="timeMinute"></span>' + '<span>' + issuffix + '</span>';
                    break;
                case 'second':
                    if (issuffix) {
                        issuffix = '秒';
                    }
                    html += '<span class="timeSecond"></span>' + '<span>' + issuffix + '</span>';
                    break;
            }
            //            html += "</div>";
            //            html += "</div>";
            $this.html(html);
            //            $this.removeAttr('linktarget');
        });
        var
            timeHour = $(".timeHour"),
            timeMinute = $(".timeMinute"),
            timeSecond = $(".timeSecond");

        countDown();


        function countDown() {
            //获取当前服务器时间
            //时间循环类型
            var timeNow = serverTime * 1000;
            if (cycleTimeEnd != undefined) {
                for (var i = 0; i < cycleTimeEnd.length - 1; i++) {
                    //活动未开始
                    if (timeNow <= startdate) {
                        timeDistance = startdate - timeNow;
                    }
                        //活动开始
                    else if (timeNow > startdate) {
                        //开始根据循环时间(小时)处理
                        var timeNowDate = new Date(timeNow);
                        var timeNowHour = timeNowDate.getHours();
                        var year = timeNowDate.getFullYear();
                        var month = timeNowDate.getMonth() + 1;
                        var day = timeNowDate.getDate();
                        var cycleHour = parseInt(cycleTimeEnd[i]);
                        //如果当前时间小于循环时间
                        //时间循环只要不超过结束时间,用cycleHour构建的时间减去当前时间即可
                        if (timeNowHour < cycleHour) {
                            var edate = year + '/' + month + '/' + day + ' ' + cycleHour + ':00:00';
                            timeDistance = new Date(edate) - timeNow;
                            break;
                        }
                    }
                }
            }
                //距离开始时间, 距离结束时间类型
            else if (timeEnd != undefined) {
                timeDistance = timeEnd - timeNow;
                //console.log(timeDistance)
            } else {
                //先开始后结束类型
                if (timeNow <= startdate) {
                    timeDistance = startdate - timeNow;
                } else if (timeNow > startdate) {
                    timeDistance = enddate - timeNow;
                }
            }
            var intDay, intHour, intMinute, intSecond, maxintHour;
            if (timeDistance >= 0) {
                // 相减的差数换算成天数   
                intDay = Math.floor(timeDistance / 86400000);
                timeDistance -= intDay * 86400000;
                // 相减的差数换算成小时
                intHour = Math.floor(timeDistance / 3600000);
                //alert(intHour)
                timeDistance -= intHour * 3600000;
                // 相减的差数换算成分钟   
                intMinute = Math.floor(timeDistance / 60000);
                timeDistance -= intMinute * 60000;
                // 相减的差数换算成秒数  
                intSecond = Math.floor(timeDistance / 1000); //判断小时小于10时，前面加0进行占位
                if (intHour < 10)
                    intHour = "0" + intHour;
                // 判断分钟小于10时，前面加0进行占位      
                if (intMinute < 10)
                    intMinute = "0" + intMinute;
                // 判断秒数小于10时，前面加0进行占位 
                if (intSecond < 10)
                    intSecond = "0" + intSecond;
                //转换后:最大小时
                maxintHour = parseInt(intHour) + (intDay * 24);
                //如果剩余天数大于1,并且开启天数转换
                if (intDay > 0 && dayhours == 'true' && maxintHour >= 24) {
                    timeHour.html(intDay + '天 ' + intHour);
                } else {
                    //intHour = parseInt(intHour) + (intDay * 24);
                    timeHour.html(maxintHour);
                }

                timeMinute.html(intMinute);
                timeSecond.html(intSecond);

                cdtimeout = setTimeout(countDown, 1000);
                serverTime += 1;
            } else {
                //活动结束
                if (typeof cdtimeout != "undefined")
                    clearTimeout(cdtimeout);
                $(".imgpos[linktype='countdown']").remove();
            }
        }
    })();
});

//请求数据 version1
function requestData(option, callback) {
    var settings = {
        type: 'post'
    };
    var options = $.extend({}, settings, option)
    $.ajax({
        url: options.url,
        data: options.data,
        type: options.type,
        success: function (msg) {
            if (typeof callback == 'function') {
                callback(msg);
            }
        }
    });
}

//显示商品图片提示
function showGoodPicTip() {
    if (goodIdAry.length == 0)
        return false;
    var query = {
        url: '/index.php?ctl=brandcate&act=get_brandcate_deal_stock',
        data: {
            deal_ids: goodIdAry.toString()
        }
    };
    //请求是否显示图片id的商品
    requestData(query, function (msg) {
        msg = $.parseJSON(msg);
        if (msg.status == 1) {
            if (msg.data != undefined) {
                if (msg.data.deal_amount != undefined) {
                    var dealmount = msg.data.deal_amount;
                    for (var i = 0, len = msg.data.deal_amount.length; i < len; i++) {
                        //如果数量大于1则存储
                        if (dealmount[i].amount <= 0) {
                            if (dealmount[i].id != '')
                                showGoodIdAry.push(dealmount[i].id);
                        }
                    };
                    //遍历需要显示的id数组
                    for (var i = 0, len = showGoodIdAry.length; i < len; i++) {
                        $('.imgpos').each(function () {
                            var $this = $(this);
                            var href = $this.attr('href');
                            if (href != undefined) {
                                if (href.indexOf(showGoodIdAry[i]) >= 0) {
                                    $this.children('b').css('display', 'block');
                                }
                            }
                        });
                    };
                }
            }
        }
    });
}
//end by ccw