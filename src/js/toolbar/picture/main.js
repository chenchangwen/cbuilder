function init($element, basePath, commons) {
    var exports = {
        isToolbar: false,
        onLoaded: function () {
            var view = { 
                init: function() {
                    var vendors = [
                        'vendor/jcrop/js/jquery.Jcrop.min.js',
                        'vendor/jcrop/css/jquery.Jcrop.min.css'
                    ];
                    commons.loadFile(vendors);
                },
                onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                        /* 图片双击事件 */
                        $('.cb-content').undelegate('dblclick').delegate('.imgpos,img', 'dblclick', function (e) {
                            var $this = $(this);
                            var tagName = $this.prop('tagName');
                            $.cbuilder.propertiesWindow.$selectedobj = $this;
                            /* 初始化并没激活,所以必须再次设定激活状态 */
                            $.cbuilder.active = $this.parents('.cb-container').data('cbuilder');
                            e.stopPropagation();
                            /* 移除全选范围(避免chrome双击会全选) */
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            if (tagName === 'IMG') {
                                $.cbuilder.propertiesWindow.show({
                                    name:'pwpicture',
                                    pillstitle:'编辑元素'
                                });
                            } else {
                                commons.jcrop.load($(this).parent().find('img'), 'edit');
                                //$.cbuilder.propertiesWindow.$self.trigger('propertiesWindow:editShowEd', ['编辑区域', 'area']);
                                $.cbuilder.propertiesWindow.show({
                                    name: 'pwarea',
                                    pillstitle: '编辑区域'
                                });
                            }
                        });
                        /* 阻止A点击跳转 */
                        $('.cb-content').undelegate('click').delegate('a', 'click', function () {
                            return false;
                        });
                    });
                },
                onGetContentBeforeEvent: function() {
                    $element.on('cbuilder:onGetContentBefore', function () {
//                        /* 清理 */
//                        var clean = function () {
//                            var html = '';
//                            var $items = $.cbuilder._getItemsObject();
//                            $items.each(function () {
//                                /* 删除border */
//                                $(this).find('.imgpos').css('border', '');
//                                html += $(this).html();
//                            });
//                            return html;
//                        }
//                        $.cbuilder.active._content = $.cbuilder._getItemsObject().html();
                    });
                },
                bindEvents: function () {
                    this.onContentReadyEvent();
                    this.onGetContentBeforeEvent();
                },
                struc: function () {
                    if (typeof $.Jcrop === "undefined") {
                        this.init();
                    }
                    this.bindEvents();
                }
            };
            view.struc();
        }
    }
    return exports;
}