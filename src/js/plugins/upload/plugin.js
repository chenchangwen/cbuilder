function getCbuilderPlugin() {
    var exports = {
        name: "upload",
        text:'上传图片',
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