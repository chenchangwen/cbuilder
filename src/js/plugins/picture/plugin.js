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

            element.on('onToolsReady', function (e) {
                var clsWrap = '.cb-wrap';
                var clsbtnwrap = $.cbuilder.active.tools.find('.btn-wrap');
                var html = "<a href='javascript:;' class='btn btn-trnspic'>设为切换图片</a>";
                clsbtnwrap.append(html);
                clsbtnwrap.find('.btn-trnspic').on('click', function () {
                    var $this = $(this);
                    layer.confirm('确定设为切换图片', { icon: 3 }, function (index) {
                        layer.close(index);
                        var pclsWrap = $this.parents(clsWrap);
                        var src = pclsWrap.find('img').attr('src');
                        $.cbuilder.active = $this.parents('.container');
                        if ($.cbuilder.active.trnspic === undefined) {
                            $.cbuilder.active.trnspic = [];
                        }
                        $.cbuilder.active.trnspic.push(src);
                        pclsWrap.remove();
                    });
                });
            });
        }
    }
    return exports;
}