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
                },
                onGetContentBeforeEvent: function() {
                    $element.on('cbuilder:onGetContentBefore', function () {
                        /* 清理 */
                        var clean = function () {
                            var html = '';
                            var clonecontents = $.cbuilder.active.$element.clone();
                            var $contents = clonecontents.find('.cb-content');
                            $contents.each(function () {
                                $(this).find('.areapos').css('border', '');
                                html += $(this).html();
                            });
                            return html;
                        }
                        $.cbuilder.active._content = clean();
                    });
                },
                pwOperationShow: function() {
                    $.cbuilder.$pw.on('propertiesWindow:editShowing', function (event, opobj) {
                        /* 将当前选择的对象(img)设为 pw的选择对象 */
                        var $selectedobj = $(opobj);
                        $.cbuilder.$pw.$selectedobj = $selectedobj;
                        if ($selectedobj.prop('tagName') === 'IMG') {
                            var options = {
                                id: 'addarea',
                                text: '新建区域',
                                panel:'.pw-main',
                                event: function(obj) {
                                    obj.on('click', function () {
                                        view.loadJcrop($.cbuilder.$pw.$selectedobj, 'create');
                                        $.cbuilder.$pw.trigger('propertiesWindow:editShowEd', [$(this), 'area']);
                                    });
                                }
                            };
                            $.cbuilder.$pw.AddBtn(options);
                        }
                    });
                },
                /* 载入图像裁剪 */
                loadJcrop: function (obj,type) {
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
                        //修正bug jcrop animateTo方法时, 如果x,y不为0,会造成1px不准确的x,y的bug
                        //根据"原始宽高"与"jcrop宽高"对比来修正.
                        obj.Jcrop({
                            onSelect: function (c) {
                                //console.log('选择后');
                                var $jcropfirst = $(".jcrop-holder").children("div:first");
                                var jcrophheigth = parseInt($jcropfirst.css("height").replace(/px/ig, ""));
                                var jcrophwidth = parseInt($jcropfirst.css("width").replace(/px/ig, ""));
                                //原始宽高定义, 修正jcrop 1px的bug
                                orignwidth = c.w;
                                orginheight = c.h;
                                //jcrop宽高与原始宽高对比, 处理jcrop 1px的bug
                                if (jcrophwidth < orignwidth) {
                                    jcrophwidth = jcrophwidth + (orignwidth - jcrophwidth);
                                }
                                if (jcrophheigth < orginheight) {
                                    jcrophheigth = jcrophheigth + (orginheight - jcrophheigth);
                                }
                                $.cbuilder.areapos = {
                                    w: jcrophwidth,
                                    h: jcrophheigth,
                                    x: c.x,
                                    y: c.y
                                };
                                view.saveJcropPosition();
                            },
                            allowSelect: false
                        }, function () {
                            jcrop_api = this;
                            if (type === 'edit') {
                                var w = obj.width() + 6;
                                var h = obj.height() + 6;
                                obj.css({
                                    'border': "2px dashed red"
                                });
                                var left = obj.position().left;
                                var top = obj.position().top;
                                jcrop_api.animateTo([w + left, h + top, left, top]);
                            } else {
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
                    $("#cropwidth").val($.cbuilder.areapos.w);
                    $("#cropheight").val($.cbuilder.areapos.h);
                    $("#cropmarginleft").val($.cbuilder.areapos.x);
                    $("#cropmargintop").val($.cbuilder.areapos.y);
                },
                bindEvents: function () {
                    this.onContentReadyEvent();
                    this.onGetContentBeforeEvent();
                    this.pwOperationShow();
                },
                struc: function () {
                    if (typeof $.Jcrop === "undefined") {
                        this.init();
                        this.bindEvents();
                    }
                }
            };
            view.struc();
        }
    }
    return exports;
}