function getCbuilderPlugin() {
    var exports = {
        name: "上传图片",
        className: 'cb-upload',
        onDomReady: function() {
            //alert('上传图片callback');
        },
        onClicked: function () {
//            alert('onClicked');
        },
        width: 600,
        height: 300,
        type:'iframe'
    }
    return exports;
}