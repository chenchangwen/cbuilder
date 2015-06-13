﻿function getCbuilderPlugin(element,basePath) {
    var exports = {
        isMenu: false,
        onLoaded: function () {
            element.on('onGetContentBefore', function() {
                /* 清理 */
                var clean = function() {
                    var html = '';
                    var clonecontents = $.cbuilder.active.$element.clone();
                    var $contents = clonecontents.find('.cb-content');
                    $contents.each(function() {
                        $(this).find('.imgpos').css('border', '');
                        html += $(this).html();
                    });
                    return html;
                }
                $.cbuilder.active._content = clean();
            });
            element.on('onContentReady', function (e) {
                /* 图片双击事件 */
                $('.cb-content').undelegate('dblclick').delegate('img,.cropwrap', 'dblclick', function () {
                    /* 初始化并没激活,所以必须再次设定激活状态 */
                    $.cbuilder.active = $(this).parents('.cb-container');
                    $.cbuilder.activeimg = $(this);
                    $.fancybox.open({
                        href: basePath + 'plugins/picture/plugin.html',
                        type: 'iframe',
                        padding: 5,
                        autoSize: false,
                        width: "95%",
                        height: "95%"
                    });
                });
                /* 阻止A点击跳转 */
                $('.cb-content').undelegate('click').delegate('a', 'click', function () {
                    return false;
                });
            });
        }
    }
    return exports;
}