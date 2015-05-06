function getCbuilderPlugin() {
    var exports = {
        name: "test",
        text: '文本域',
        onDomReady: function () {
//            alert('test onDomReady');
        },
        onClick: function () {
            $.cbuilder.append('<textarea class="cb-textarea"></textarea>');
        }
    }
    return exports;
}