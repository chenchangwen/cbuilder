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
        plugins: ["upload", 'test', 'clean'],
        prefix: "cbuilder",
        tpl: {
            toolbar: "<div class=\"cb-toolbar\"></div>",
            toolbar_button: "<div class=\"cb-button-wrap\"><button class=\"cb-button {clsname}\">{name}</button></div>",
            body: "<div class=\"cb-body\"></div>",
            content: "<div class=\"cb-wrap\"><div class=\"cb-content\"></div></div>"
        },
        onComplete: false
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
        clsButton = '.cb-button',
        clsContainer = '.cb-container',
        basePath = currentScriptPath();



    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
    };

    cbuilder.prototype = {
        strucView: function() {
            var that = this;
            var options = that.options;
            var view = {
                appendHtml: function () {
                    that.$element.addClass('cb-container')
                        .wrap(options.tpl.container)
                        .append(options.tpl.toolbar + options.tpl.body);

                    that.$element.width(options.width).height(options.height);
                },
                //加载vendors
                loadVendors: function () {
                    var vendors = [
                        '../../vendor/fancybox/source/jquery.fancybox.pack.js',
                        '../../vendor/fancybox/source/jquery.fancybox.css',
                        '../../vendor/dropzone/dist/dropzone.js'
                    ];
                    for (var i = 0; i < vendors.length; i++) {
                        var vendor = vendors[i];
                        if (vendor.indexOf('css') >= 0) {
                            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + vendor + "'>");
                            $("head").append(cssLink);
                        } else {
                            $.getScript(vendor);
                        }
                    }
                },
                //加载plugin
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
                                var plugin = getCbuilderPlugin();
                                //替换为plugin名字
                                var clsname = 'cb-' + plugin.name;
                                if (plugin.text) {
                                    that.$element.find(clsToolbar).
                                        append(that.options.tpl.toolbar_button.
                                            replace(/\{name\}/, plugin.text).
                                            replace(/\{clsname\}/, clsname)
                                        );
                                    that._trigger('', plugin.onDomReady);
                                    var pluginbtn = that.$element.find('.' + clsname);
                                    pluginbtn.on('click', function () {
                                        $.cbuilder.active = that;
                                        if (plugin.type === 'iframe') {
                                            $.fancybox.open({
                                                href: basePath + 'plugins/' + plugin.name + '/plugin.html',
                                                type: 'iframe',
                                                padding: 5,
                                                scrolling: 'no',
                                                fitToView: true,
                                                width: plugin.width || 610,
                                                height: plugin.height || 300,
                                                autoSize: false,
                                                closeClick: false
                                            });
                                        }
                                        that._trigger('', plugin.onClick);
                                        that._trigger('onLoadContent');
                                    });
                                } else {
                                    if (typeof plugin.onLoadContent === "function") {
                                        plugin.onLoadContent();
                                    }
                                }
                            }
                        });
                    }
                },
                bindEvents: function () {
                    //onloadContent 事件
                    that.$element.on('onLoadContent', function (e) {
                        that.$element.find(clsBody).children(":not(.cb-wrap)").each(function () {
                            var $this = $(this);
                            $this.wrap(that.options.tpl.content);
                            var $thisparent = $this.parent();
                            $thisparent.before("<div class='cb-tools'></div>");
                            var html =
                                "<div class='btn-wrap'>" +
                                    "<a href='javascript:;' class='btn btn-delete'>删除</a>" +
                                    "</div>";
                            var tools = $thisparent.prev('.cb-tools');
                            tools.html(html);
                            tools.find('.btn-delete').on('click', function () {
                                $(this).parents('.cb-wrap').remove();
                            });
                        });
                    });
                },
                struc: function() {
                    this.appendHtml();
                    this.loadVendors();
                    this.loadPlugins();
                    this.bindEvents();
                }
            };
            view.struc();
        },
        _trigger: function(event, callback) {
            this.$element.trigger(event);
            if (callback) {
                callback.call(this.$element);
            }
        }
    };

    $.cbuilder = {
        append: function (html) {
            $.cbuilder.active.$element.find(clsBody).append(html);
            $.cbuilder.active._trigger('onLoadContent');
        }
    }

    $.fn.cbuilder = function(option) {
        var args = arguments;
        return $(this).each(function() {
            var data = $(this).data("cbuilder");
            var options = (typeof option !== "object") ? null : option;
            if (!data) {
                data = new cbuilder(this, options);
                $(this).data("cbuilder", data);
            }
            if (typeof option === "string") {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
    };
}));