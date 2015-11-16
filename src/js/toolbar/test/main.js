function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "test",
            text: "测试插入图片",
            onClick: function () {
                var html = ' <h1>aaa</h1><h1>bbb</h1><h1>ccc</h1>';
                $.cbuilder.append(html);
            }
        }
    }
    return exports;
}