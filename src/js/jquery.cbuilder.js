// *
//    jQuery cbuilder v1.0 - 2015-4-4 
//    (c) Kevin 21108589@qq.com
//	license: http://www.opensource.org/licenses/mit-license.php

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
        width:"100%",
        plugins: ["upload", 'mupload', 'test','countdown','clean', 'anchor', 'preview', 'picture'],
        tpl: {
            toolbar: "<div class=\"cb-toolbar\"></div>",
            toolbar_button: "<div class=\"cb-button-wrap\"><button class=\"cb-btn btn-primary {clsname}\">{name}</button></div>",
            body: "<div class=\"cb-body\"></div>",
            wrap: "<div class=\"cb-wrap\"><div class=\"cb-content\"></div></div>"
        }
    };

    function currentScriptPath() {
        var scripts = document.querySelectorAll('script[src]');
        var currentScript = scripts[scripts.length - 1].src;
        var currentScriptChunks = currentScript.split('/');
        var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
        return currentScript.replace(currentScriptFile, '');
    }

    var clsToolbar = ".cb-toolbar",
        clsBody = ".cb-body",
        clsContent = '.cb-content',
        clsWrap = '.cb-wrap',
        stroriginhtml = 'originhtml',
        strcbuilder = 'cbuilder',
        basePath = currentScriptPath();

    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
    };

    $.cbuilder = {
        append: function (html) {
            $.cbuilder.active.$element.find(clsBody).append(html);
            $.cbuilder.active._trigger('onWrapContent');
            $.cbuilder.active._trigger('onContentReady');
        },
        trnspic: [],
        wraping: {
            tools: {
                addbtn: function (obj) {
                    var html = "<a href='javascript:;' class='btn'>" + obj.text + "</a>";
                    var clsbtnwrap = this.element.parents(clsWrap).find('.btn-wrap');
                    clsbtnwrap.append(html);
                    if (obj.click) {
                        clsbtnwrap.find('.btn:last').on('click', function () {
                            obj.click($(this));
                        });
                    }
                }
            }
        },
        getContent: function () {
            $.cbuilder.active._trigger('onGetContentBefore');
            return '<div class="' + strcbuilder + '">' + $.cbuilder.active._content + '</div>';
        }
    }

    cbuilder.prototype = {
        strucView: function() {
            var that = this;
            var options = that.options;
            var view = {
                /* 附加html */
                appendHtml: function () {
                    var thiselement = that.$element;
                    thiselement.data(stroriginhtml, thiselement.html());
                    thiselement.html('');
                    thiselement.addClass('cb-container')
                        .wrap(options.tpl.container)
                        .append(options.tpl.toolbar + options.tpl.body);
                    thiselement.width(options.width).height(options.height);
                    /* 缓存元素 */
                    this.$body = thiselement.find(clsBody);
                },
                /* 加载vendors */
                loadVendors: function () {
                    var vendors = [

                        '../../vendor/fancybox/source/jquery.fancybox.css',
                        '../../vendor/fancybox/source/jquery.fancybox.pack.js',

                        '../../vendor/dropzone/dist/dropzone.css',
                        '../../vendor/dropzone/dist/dropzone.js',

                        '../../vendor/dragula.js/dist/dragula.min.js',
                        '../../vendor/dragula.js/dist/dragula.min.css',

                        '../../vendor/layer/layer.js',
                        '../../vendor/layer/skin/layer.css'
                    ];
                    for (var i = 0; i < vendors.length; i++) {
                        var vendor = vendors[i];
                        if (vendor.indexOf('css') >= 0) {
                            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + vendor + "'>");
                            $("head").append(cssLink);
                        } else {
                            $.ajax({
                                async: false,
                                url:vendor
                            });
                        }
                    }
                },
                /* 加载plugins */ 
                loadPlugins: function () {
                    var len = that.options.plugins.length;
                    for (var i = 0; i < len; i++) {
                        var name = that.options.plugins[i];
                        var src = 'src/js/plugins/' + name + '/' + 'plugin' + '.js';
                        $.ajax({
                            async: false,
                            type: "get",
                            url: src,
                            success: function () {
                                //执行动态函数,并获取plugin对象
                                var plugin = getCbuilderPlugin(that.$element,basePath);
                                //为真才走以下流程
                                if (plugin.isMenu === false) {
                                    plugin.onLoaded();
                                    return false;
                                }
                                //替换为plugin名字
                                var clsname = 'cb-' + plugin.name;
                                if (plugin.text) {
                                    that.$element.find(clsToolbar).
                                        append(that.options.tpl.toolbar_button.
                                            replace(/\{name\}/, plugin.text).
                                            replace(/\{clsname\}/, clsname)
                                        );
                                    that._trigger('', plugin.onLoaded);
                                    var pluginbtn = that.$element.find('.' + clsname);
                                    pluginbtn.on('click', function () {
                                        $.cbuilder.active = that;
                                        if (plugin.type === 'iframe') {
                                            $.fancybox.open({
                                                href: basePath + 'plugins/' + plugin.name + '/plugin.html',
                                                title: plugin.text,
                                                type: 'iframe',
                                                padding: 5,
                                                scrolling: 'no',
                                                fitToView: true,
                                                width: plugin.width || '95%',
                                                height: plugin.height || '95%',
                                                autoSize: false,
                                                closeClick: false
                                            });
                                        }
                                        that._trigger('', plugin.onClick);
                                        //that._trigger('onWrapContent');
                                    });
                                } else {
                                    if (typeof plugin.onLoaded === "function") {
                                        plugin.onLoaded();
                                    }
                                }
                            }
                        });
                    }
                },
                /* 绑定事件 */
                bindEvents: function () {
                    var $cbbody = that.$element.find(clsBody);
                    /* onWrapContent 事件 */
                    that.$element.on('onWrapContent', function (e) {
                        //构建基本元素
                        $cbbody.children(":not(.cb-wrap)").each(function () {
                            var $this = $(this);
                            //增加 cb-wrap div
                            $this.wrap(that.options.tpl.wrap);
                            //dragula(document.ge('cb-wrap'));
                            var $thisparent = $this.parent();
                            //增加 工具条
                            $thisparent.before("<div class='cb-tools'></div>");
                            var html =
                                "<div class='btn-wrap'>" +
                                    "<a href='javascript:;' class='btn btn-delete'>删除</a>" +
                                    "</div>";
                            $thisparent.prev('.cb-tools').html(html);
                            var clsbtnwrap = $this.parents(clsWrap).find('.btn-wrap');

                            //工具条-删除
                            clsbtnwrap.find('.btn-delete').on('click', function () {
                                var $this = $(this);
                                layer.confirm('确定删除', { icon: 3 }, function (index) {
                                    layer.close(index);
                                    $this.parents('.cb-wrap').remove();
                                });
                            });
                            $.cbuilder.active = that;
                            $.cbuilder.wraping.tools.element = $this;
                            that._trigger('onToolsReady');
                        });
                    });

                    /* 绑定拖拽事件 */
                    dragula($cbbody[0], {
                        moves: function (el, container, handle) {
                            return handle.className === 'cb-tools';
                        }
                    });
                },
                /* 加载内容 */
                loadContent: function () {
                    this.$body.html(that.$element.data(stroriginhtml));
                    that.$element.data(stroriginhtml, '');
                },
                /* 构建 */
                struc: function () {
                    /* 便于控制顺序 */
                    this.appendHtml();
                    this.loadVendors();
                    this.loadPlugins();
                    this.bindEvents();
                    this.loadContent();
                    $(document).ready(function () {
                        that._trigger('onWrapContent');
                        that._trigger('onContentReady');
                    });
                }
            };
            view.struc();
        },
        _trigger: function (event, cb) {
            this.$element.trigger(event);
            if (cb) {
                cb.call(this.$element);
            }
        }
    };


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