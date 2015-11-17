function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "test",
            text: "测试插入图片",
            onClick: function () {
                var html = '<div class="cb-cropwrap"><img src="https://www.baidu.com/img/bd_logo1.png" style="display: block; height: 258px; width:540px;"><a class="imgpos" style="height: 94px; left: 225px; top: 90px; width: 94px;" target="_blank" href="http://www.qq.com" linktype="link"></a><div class="imgpos" style="left: 45px; top: 7px; width: 437px; height: 65px; font-family: 宋体; font-size: 14px; color: rgb(51, 51, 51);" linktype="countdown" startdate="2015-11-05 14:00" enddate="2015-11-20 16:00" isdayunit="true" format="cn"></div></div>';
                $.cbuilder.append(html);
            }
        }
    }
    return exports;
}