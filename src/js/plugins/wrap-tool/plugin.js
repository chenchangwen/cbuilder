function getCbuilderPlugin() {
    var exports = {
        name: "wrap-tool",
        onLoadContent: function () {
            $('.cb-body').delegate('.cb-wrap', 'click', function () {
                alert('123123');
            });
        }
    }
    return exports;
}