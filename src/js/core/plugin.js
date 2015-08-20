//   jQuery cbuilder v1.0 - 2015-4-4 
//   (c) Kevin 21108589@qq.com
//	 license: http://www.opensource.org/licenses/mit-license.php

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    } 
}(function($) {
    var defaults = {
        height: "100%",
        width:"99%",
        toolbar: ["upload", 'mupload', 'test','countdown','clean', 'anchor', 'preview', 'picture'],
        tpl: {
            toolbar: "<div class='cb-toolbar'></div>",
            toolbar_button: "<div class='btn-wrap'><button class='btn primary {clsname}'>{name}</button></div>",
            body: "<div class='cb-body'></div>",
            body_item: "<div class='cb-item'><div class='cb-content'></div></div>",
            body_item_tool: "<div class='cb-tools'><div class='btn-wrap'></div></div>"
        }
    };

    function currentScriptPath() {
        var scripts = document.querySelectorAll('script[src]');
        var currentScript = scripts[scripts.length - 1].src;
        var currentScriptChunks = currentScript.split('/');
        var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
        return currentScript.replace(currentScriptFile, '');
    }

    var clsContainer = ".cb-container",
        clsToolbar = ".cb-toolbar",
        clsBody = ".cb-body",
        clsContent = '.cb-content',
        clsWrap = '.cb-item',
        stroriginhtml = 'originhtml',
        strcbuilder = 'cbuilder',
        basePath = currentScriptPath();
        
    ~~include('./block/commons.js')


    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
    };

    $.cbuilder = {
        append: function (html) {
            $.cbuilder.active.$element.find(clsBody).append(html);
            $.cbuilder.active._trigger('cbuilder:onWrapContent');
            $.cbuilder.active._trigger('cbuilder:onContentReady');
        },
        item: {
            tools: {
                addbtn: function (obj) {
                    var html = "<a href='javascript:;'>" + obj.text + "</a>";
                    var clsbtnwrap = this.element.parents(clsWrap).find('.btn-wrap');
                    clsbtnwrap.append(html);
                    if (obj.click) {
                        clsbtnwrap.find('a:last').on('click', function () {
                            obj.click($(this));
                        });
                    }
                }
            }
        },
        getContent: function () {
            $.cbuilder.active._trigger('cbuilder:onGetContentBefore');
            return '<div class="' + strcbuilder + '">' + $.cbuilder.active._content + '</div>';
        }
    }

    cbuilder.prototype = {
        strucView: function() {
            var that = this;
            var options = that.options;
            that.$element.data('cbuilder', that);
            var view = {
                /* 初始化 */
                init: function () {
                    var thiselement = that.$element;
                    thiselement.data(stroriginhtml, thiselement.html());
                    thiselement.html('');
                    thiselement.addClass('cb-container')
                        .wrap(options.tpl.container)
                        .append(options.tpl.toolbar + options.tpl.body);
                    thiselement.width(options.width).height(options.height);
                    /* 缓存元素 */
                    view.$body = thiselement.find(clsBody);
                },
                /* 加载vendors */
                loadVendors: function () {
                    var vendors = [
                        /* 弹出层 */
                        '../../vendor/layer/layer.js',
                        '../../vendor/layer/skin/layer.css',

                        /* 拖拽 */
                        '../../vendor/dragula.js/dist/dragula.min.js',
                        '../../vendor/dragula.js/dist/dragula.min.css',

                        /* 菜单 */
                        '../../vendor/jQuery-contextMenu/src/jquery.contextMenu.js',
                        '../../vendor/jQuery-contextMenu/src/jquery.contextMenu.css'
                    ];
                    commons.loadFile(vendors);
                },
                /* 加载toolbar */ 
                loadToolbar: function () {
                    var len = that.options.toolbar.length;
                    for (var i = 0; i < len; i++) {
                        var name = that.options.toolbar[i];
                        var src = 'src/js/toolbar/' + name + '/' + 'main' + '.js';
                        $.ajax({
                            async: false,
                            type: "get",
                            url: src,
                            success: function () {
                                /* 执行动态函数,并获取module对象 */
                                var module = init(that.$element, basePath, commons);
                                if (module.isToolbar === false) {
                                    module.onLoaded();
                                    return false;
                                }
                                /* 替换为module名字 */
                                var clsname = 'cb-' + module.toolbar.name;
                                if (module.toolbar.text) {
                                    that.$element.find(clsToolbar).
                                        append(that.options.tpl.toolbar_button.
                                            replace(/\{name\}/, module.toolbar.text).
                                            replace(/\{clsname\}/, clsname)
                                        );
                                    that._trigger('', module.onLoaded);
                                    var modulebtn = that.$element.find('.' + clsname);
                                    modulebtn.on('click', function () {
                                        $.cbuilder.active = that;
                                        if (module.type === 'iframe') {
                                            var width = module.width !== undefined ? module.width + 'px' : '95%';
                                            var height = module.height !== undefined ? module.height + 'px' : '95%';
                                            layer.open({
                                                type: 2,
                                                title: module.toolbar.text,
                                                shadeClose: true,
                                                shade: 0.3,
                                                area: [width,height],
                                                content: basePath + 'toolbar/' + module.toolbar.name + '/main.html'
                                            });
                                        }
                                        that._trigger('', module.toolbar.onClick);
                                    });
                                } else {
                                    if (typeof module.onLoaded === "function") {
                                        module.onLoaded();
                                    }
                                }
                            }
                        });
                    }
                },
                /* 建立内容 */
                appendHtml: function () {
                    view.$body.html(that.$element.data(stroriginhtml));
                    that.$element.data(stroriginhtml, '');
                },
                /* 触发事件 */
                triggerCustomEvent: function() {
                    $(document).ready(function () {
                        that._trigger('cbuilder:onWrapContent');
                        that._trigger('cbuilder:onContentReady');
                    });
                },
                /* 事件 */
                bindEvents: function () {
                    var $cbbody = that.$element.find(clsBody);
                    /* cbuilder:onWrapContent 事件 */
                    that.$element.on('cbuilder:onWrapContent', function (e) {
                        /* 构建基本元素 */
                        $cbbody.children(":not(" + clsWrap + ")").each(function () {
                            var $this = $(this);
                            /* 增加 cb-item div */
                            $this.wrap(that.options.tpl.body_item);
                            /* 增加 工具条 */
//                            $this.parent().before(that.options.tpl.body_item_tool);
                            $.cbuilder.active = that;
//                            $.cbuilder.item.tools.element = $this;
//                            $.cbuilder.item.tools.addbtn({
//                                text: '删除',
//                                click: function ($this) {
//                                    layer.confirm('确定删除该项?', { icon: 3 }, function (index) {
//                                        layer.close(index);
//                                        $this.parents(clsWrap).remove();
//                                    });
//                                } 
//                            }); 

                            that._trigger('cbuilder:onToolsReady');
                        });
                    });
                    /* 拖拽 */
                    dragula($cbbody[0], {
                        moves: function (el, container, handle) {
                            return handle.className === 'item-move';
                        }
                    });
                },
                /* 构建 */
                struc: function () {
                    view.init();
                    view.loadVendors();
                    view.loadToolbar();
                    view.bindEvents();
                    view.appendHtml();
                    view.triggerCustomEvent();
                }
            };
            view.struc();
        },
        _trigger: function (event, cb, params) {
            this.$element.trigger(event, params || '');
            if (cb) {
                cb.call(this.$element);
            }
        }
    };

    /* 执行一次 */
    var onceView = {
        /* 菜单 */
        contextMenu: function () {
            var vendors = [
                '../../vendor/jQuery-contextMenu/src/jquery.contextMenu.js',
                '../../vendor/jQuery-contextMenu/src/jquery.contextMenu.css'
            ];
            commons.loadFile(vendors);
            $.contextMenu({
                selector: '.cb-content *',
                callback: function (key, options) {
                    $.cbuilder.$pw.trigger('propertiesWindow:show', $(this));
                },
                items: {
                    "edit": { name: "编辑", icon: "edit" },
                    //"cut": { name: "Cut", icon: "cut" },
                    //"copy": { name: "Copy", icon: "copy" },
                    //"paste": { name: "Paste", icon: "paste" },
                    //"delete": { name: "Delete", icon: "delete" },
                    "sep1": "---------",
                    "quit": { name: "退出", icon: "quit" }
                }
            });
        },
        /* 工具 */
        itemtools: function() {
            ~~include('./block/itemtools.js')
        },
        /* 属性窗口 */
        propertiesWindow: function () {
            ~~include('./block/propertiesWindow.js')
        },
        struc: function () {
            $(document).ready(function() {
                onceView.propertiesWindow();
                onceView.contextMenu();
                onceView.itemtools();
            });
        }
    }
    onceView.struc();


    $.fn.cbuilder = function(option) {
        var args = arguments;
        return $(this).each(function() {
            var data = $(this).data(strcbuilder);
            var options = (typeof option !== "object") ? null : option;
            if (!data) {
                data = new cbuilder(this, options);
                $(this).data(strcbuilder, data);
            }
            if (typeof option === "string") {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
    };
}));