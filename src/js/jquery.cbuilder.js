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
        clsToolbar: ".cb-toolbar",
        clsBody: ".cb-body",
        tpl: {
            toolbar: "<div class=\"cb-toolbar\"></div>",
            toolbar_button: "<div class=\"cb-button-wrap\"><button class=\"cb-button\">{name}</button></div>",
            body: "<div class=\"cb-body\"></div>"
        },
        onComplete: false
    };


    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
        this.strucEvents();
    };

    //private Method
    function strucPrivateEvents() {
        this._trigger = function(event, callback) {
            this.$element.trigger(event);
            if (callback) {
                callback.call(this.$element);
            }
        };
    }
    

    cbuilder.prototype = {
        strucView: function() {
            var that = this;
            var view = {
                appendHtml: function() {
                    that.$element.addClass("cb-container")
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
                        $.getScript(vendors[i]);
                    }
                },
                //加载插件
                loadPlugins: function () {
                    var len = that.options.plugins.length;
                    for (var i = 0; i < len; i++) {
                        var name = that.options.plugins[i];
                        $.getScript('src/js/plugins/' + name + '/' + 'plugin' + '.js', function () {
                            var plugin = cbuilderPluginObj();
                            that.$element.find(that.options.clsToolbar).append(that.options.tpl.toolbar_button.replace(/\{name\}/, plugin.name));
                        });
                        //按需加载插件
                        //that.$element.find(that.options.clsToolbar).append(that.options.tpl.toolbar_button.replace(/\{name\}/,'asdf'));
                    }
                },
                bindEvents: function() {
                    that.$element.find('.cb-button').on("click", function () {
                        alert('123');
                        //alert('123213');
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
        strucEvents: function() {
            strucPrivateEvents.call(this);
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