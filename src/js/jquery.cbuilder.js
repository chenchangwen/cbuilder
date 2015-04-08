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
        plugins: ["upload"],
        prefix: "cbuilder",
        tpl: {
            toolbar: "<div class=\"cb-toolbar\"></div>",
            toolbar_button: "<div class=\"cb-button-wrap\"><button class=\"cb-button {clsname}\">{name}</button></div>",
            body: "<div class=\"cb-body\"></div>"
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
            var view = {
                appendHtml: function() {
                    that.$element.addClass('cb-container')
                        .wrap(that.options.tpl.container)
                        .append(that.options.tpl.toolbar + that.options.tpl.body);
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
                        $.get('src/js/plugins/' + name + '/' + 'plugin' + '.js', function () {
                            //执行动态函数,并获取plugin对象
                            var plugin = getCbuilderPlugin();
                            //替换为plugin名字
                            that.$element.find(clsToolbar).
                                append(that.options.tpl.toolbar_button.
                                    replace(/\{name\}/, plugin.name).
                                    replace(/\{clsname\}/, plugin.className)
                                );
                            var pluginbtn = that.$element.find('.' + plugin.className);
                            that._trigger('', plugin.onDomReady);

                            pluginbtn.on('click', function () {
                                if (plugin.type === 'iframe') {
                                    $.fancybox.open({
                                        href: basePath + 'plugins/' + name + '/plugin.html',
                                        type: 'iframe',
                                        padding: 5,
                                        scrolling: 'no',
                                        fitToView: true,
                                        width: plugin.width || 610,
                                        height: plugin.height || 300,
                                        autoSize: false,
                                        closeClick: false
                                    });
                                    that._trigger('', plugin.onClicked);
                                }
                            });
                        });
                    }
                },
                bindEvents: function () {
//                    $(clsContainer).delegate(clsButton, 'click', function () {
//                        $.fancybox.open({
//                            href: 'iframe.html',
//                            type: 'iframe',
//                            padding: 5
//                        });
//                    });
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
        },
        show: function() {

        } 
    };

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