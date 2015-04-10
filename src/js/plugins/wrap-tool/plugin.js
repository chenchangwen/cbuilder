function getCbuilderPlugin() {
    var exports = {
        name: "wrap-tool",
        onLoadContent: function () {      
            $('.cb-body').on('DOMNodeInserted', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('cb-tools')) {
                    var html =
                    "<div class='btn-wrap'>" +
                    "<a href='javascript:;' class='btn btn-delete'>删除</a>" +
                    "</div>";
                    $target.html(html);
                    $target.find('.btn-delete').on('click', function() {
                        $(this).parents('.cb-wrap').remove();
                    });
                }
            });
        }
    }
    return exports;
}