function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "clean",
            text: "清空",
            onClick: function () {
                $.cbuilder.active.$element.find('.cb-body').html('');
            }
        }
    }
    return exports;
}