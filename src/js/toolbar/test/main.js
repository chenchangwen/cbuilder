function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "test",
            text: "文本域",
            onClick: function () {
                $.cbuilder.append('<textarea class="cb-textarea"></textarea>');
            }
        }
    }
    return exports;
}