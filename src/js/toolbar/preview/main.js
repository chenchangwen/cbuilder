function init() {
    var exports = {
        toolbar: {
            name: "preview",
            text: '预览',
            onClick: function () {
                window.open($.cbuilder.path.js +'toolbar/preview/main.html');
            }
        }
    }
    return exports;
}