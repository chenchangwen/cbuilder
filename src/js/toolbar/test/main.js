function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "test",
            text: "测试插入图片",
            onClick: function () {
                var html = ' <div class="cb-cropwrap"><img src="https://www.baidu.com/img/bd_logo1.png" style="display: block;width: 540px; height: 258px;"><a class="imgpos" style="color: #ff0000;left: 0px; top: 0px; width: 94px; height: 94px; font-family: 宋体;font-size: 24px;" linktype="countdown" startdate="2015-09-08 14:14:53" enddate="2015-09-08 14:14:53"></a></div>';
                $.cbuilder.append(html);
            }
        }
    }
    return exports;
}