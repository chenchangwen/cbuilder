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
                                $(this).find('.imgpos').css('border', '');
                                html += $(this).html();
                            });
                            return html;
                        }
                        $.cbuilder.active._content = clean();
                    });
                },
                pwOperationShow: function() {
                    $.cbuilder.$pw.on('propertiesWindow:operationShow', function (event, obj) {
                        var options = {
                            id: 'addarea',
                            text: '新建区域',
                            event: function (obj) {
                                obj.on('click', function () {
                                    view.loadJcrop(obj);
                                });
                            }
                        };
                        $.cbuilder.$pw.AddBtn(options);
                    });
                },
                loadJcrop: function(obj) {
                    if (typeof (jcrop_api) != "undefined") {
                        jcrop_api.release();
                        jcrop_api.animateTo([100, 100, 0, 0]);
                        imgpos = {
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
                                imgpos = {
                                    w: jcrophwidth,
                                    h: jcrophheigth,
                                    x: c.x,
                                    y: c.y
                                };
                            },
                            allowSelect: false
                        }, function () {
                            jcrop_api = this;
                            if (obj != undefined) {
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
                                imgpos = {
                                    w: 100,
                                    h: 100,
                                    x: 0,
                                    y: 0
                                };
                            }
                        });
                    }
                },
                bindEvents: function () {
                    this.onContentReadyEvent();
                    this.onGetContentBeforeEvent();
                    this.pwOperationShow();
                },
                domCache: function () {
                },
                struc: function () {
                    this.init();
                    this.bindEvents();
                }
            };
            view.struc();
        }
    }
    return exports;
}