function init($element, basePath, commons) {
    var exports = {
        isToolbar: false,
        onLoaded: function () {
            var view = {
                init: function() {
                    var vendors = [
                        '../../vendor/jcrop/js/jquery.Jcrop.min.js',
                        '../../vendor/jcrop/css/jquery.Jcrop.min.css'
                    ];
                    commons.loadFile(vendors);
                },
                onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                        /* 图片双击事件 */
                        $('.cb-content').undelegate('dblclick').delegate('.imgpos,img', 'dblclick', function (e) {
                            var $this = $(this);
                            var tagName = $this.prop('tagName');
                            $.cbuilder.$pw.$selectedobj = $this;
                            /* 初始化并没激活,所以必须再次设定激活状态 */
                            $.cbuilder.active = $this.parents('.cb-container').data('cbuilder');
                            e.stopPropagation();
                            /* 移除全选范围(避免chrome双击会全选) */
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            if (tagName === 'IMG') {
                                $.cbuilder.$pw.trigger('propertiesWindow:show');
                            } else {
                                view.loadJcrop($(this).parent().find('img'), 'edit');
                                $.cbuilder.$pw.trigger('propertiesWindow:editShowEd', ['编辑区域', 'area']);
                            }
                        });
                        /* 阻止A点击跳转 */
                        $('.cb-content').undelegate('click').delegate('a', 'click', function () {
                            return false;
                        });
                        console.log('picture: onContentReady');
                    });

                    $element.on('cbuilder:onToolsReady', function (e) {
                        console.log('picture: onToolsReady');
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
                pwEditShowing: function () {
                    $.cbuilder.$pw.on('propertiesWindow:editShowing', function (event, opobj) {
                        /* 将当前选择的对象(img)设为 pw的选择对象 */
                        var $selectedobj = $(opobj);
                        $.cbuilder.$pw.$selectedobj = $selectedobj;
                        if ($selectedobj.prop('tagName') === 'IMG') {
                            var options = {
                                id: 'cb-main-addarea',
                                text: '新建区域',
                                panel: '.pw-main',
                                event: function(obj) {
                                    obj.on('click', function() {
                                        view.loadJcrop($.cbuilder.$pw.$selectedobj, 'create');
                                        $.cbuilder.$pw.trigger('propertiesWindow:editShowEd', ['新建区域', 'area']);
                                    });
                                }
                            };
                            $.cbuilder.$pw.AddBtn(options);
                            $("#cb-main-addarea").show();
                        } else {
                            $("#cb-main-addarea").hide();
                        }
                    });
                },
                /* 载入图像裁剪 */
                loadJcrop: function (obj, type) {
                    if (typeof (jcrop_api) != "undefined") {
                        jcrop_api.release();
                        jcrop_api.animateTo([100, 100, 0, 0]);
                        $.cbuilder.areapos = {
                            w: 100,
                            h: 100,
                            x: 0,
                            y: 0
                        };
                    } else {
                        obj.Jcrop({
                            onSelect: function (c) {
                                $.cbuilder.areapos = {
                                    w: c.w,
                                    h: c.h,
                                    x: c.x,
                                    y: c.y
                                };
                                view.saveJcropPosition();
                            },
                            allowSelect: false
                        }, function () {
                            jcrop_api = this;
                            if (type === 'edit') {
                                var $obj = $.cbuilder.$pw.$selectedobj;
                                var left = $obj.position().left;
                                var top = $obj.position().top;
                                var w = $obj.width() + 6;
                                var h = $obj.height() + 6;
                                $obj.addClass('imgpos-active');
                                jcrop_api.setSelect([left, top, left + w, top + h]);
                            } else {
                                /* 默认:创建jcrop */
                                jcrop_api.animateTo([100, 100, 0, 0]);
                                $.cbuilder.areapos = {
                                    w: 100,
                                    h: 100,
                                    x: 0,
                                    y: 0
                                };
                            }
                        });
                    }
                },
                /* 保存裁剪位置 */
                saveJcropPosition: function () {
                    $('#cb-area-width').val($.cbuilder.areapos.w);
                    $('#cb-area-height').val($.cbuilder.areapos.h);
                    $('#cb-area-marginleft').val($.cbuilder.areapos.x);
                    $('#cb-area-margintop').val($.cbuilder.areapos.y);
                },
                bindEvents: function () {
                    this.onContentReadyEvent();
                    this.onGetContentBeforeEvent();
                },
                struc: function () {
                    if (typeof $.Jcrop === "undefined") {
                        this.init();
                        this.pwEditShowing();
                    }
                    this.bindEvents();
                }
            };
            view.struc();
        }
    }
    return exports;
}