function init(element, basePath) {
    var exports = {
        isToolbar: false,
        onLoaded: function () {
            element.on('cbuilder:onGetContentBefore', function () {
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

            element.on('cbuilder:onContentReady', function (e) {
                /* 图片双击事件 */
                //$('.cb-content').undelegate('dblclick').delegate('img,.cropwrap', 'dblclick', function () {
                //    /* 初始化并没激活,所以必须再次设定激活状态 */
                //    $.cbuilder.active = $(this).parents('.cb-container');
                //    $.cbuilder.activeimg = $(this);
                //    layer.open({
                //        type: 2,
                //        title: '编辑图片',
                //        shadeClose: true,
                //        shade: 0.3,
                //        area: ['95%', '95%'],
                //        content: basePath + 'modules/picture/main.html'
                //    });
                //});
                /* 阻止A点击跳转 */
                $('.cb-content').undelegate('click').delegate('a', 'click', function () {
                    return false;
                });
            });

            element.on('cbuilder:onToolsReady', function () {
                var clsWrap = '.cb-wrap';
                var $this = $.cbuilder.item.tools.element;
                if ($this.prop('tagName') === 'IMG' || $this.hasClass('cropwrap')) {
                    //$.cbuilder.item.tools.addbtn({
                    //    text: '新建热点',
                    //    click: function($this) {
                    //        alert(123123);
                    //    }
                    //});

                    //$.cbuilder.item.tools.addbtn({
                    //    text: '设为切换图片',
                    //    click: function($this) {
                    //        layer.confirm('确定设为切换图片', { icon: 3 }, function(index) {
                    //            layer.close(index);
                    //            var pclsWrap = $this.parents(clsWrap);
                    //            var src = pclsWrap.find('img').attr('src');
                    //            $.cbuilder.active = $this.parents('.container');
                    //            if ($.cbuilder.active.trnspic === undefined) {
                    //                $.cbuilder.active.trnspic = [];
                    //            }
                    //            $.cbuilder.active.trnspic.push(src);
                    //            pclsWrap.remove();
                    //        });
                    //    }
                    //});
                }
            });

            $.cbuilder.$pw.on('propertiesWindow:operationShow', function (event, obj) {
                var options = {
                    id:'addarea',
                    text: '新建区域',
                    event: function(obj) {
                        obj.on('click', function () {
                            alert('新建区域');
                        });
                    }
                };
                $.cbuilder.$pw.AddBtn(options);
            });
        }
    }
    return exports;
}