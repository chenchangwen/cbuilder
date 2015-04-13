function getCbuilderPlugin() {
    var exports = {
        name: "clean",
        text: "清空",
        onClick: function () {
            $(".cb-body").html("");
        }
    }
    return exports;
}

