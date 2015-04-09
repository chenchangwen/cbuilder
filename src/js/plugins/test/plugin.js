function getCbuilderPlugin() {
    var exports = {
        name: "test",
        text: '测试-插入内容',
        onDomReady: function () {
//            alert('test onDomReady');
        },
        onClick: function () {
            $('.cb-body').append('<textarea class="cb-textarea"></textarea>');
        }
    }
    return exports;
}