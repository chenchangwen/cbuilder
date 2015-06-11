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
        plugins: ["upload",'mupload','test', 'clean','anchor','preview'],
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
                        '../../vendor/dragula.js/dist/dragula.min.css'

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
                /* 绑定事件 */
                bindEvents: function () {
                    var $cbbody = that.$element.find(clsBody);
                    //onloadContent 事件
                    that.$element.on('onLoadContent', function (e) {
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
                                if (confirm('确定删除?')) {
                                    $(this).parents('.cb-wrap').remove();
                                }
                            });
                            //如果当前元素是"图片",则增加该按钮
                            if ($this.prop('tagName') === 'IMG' || $this.hasClass('cropwrap')) {
                                html = "<a href='javascript:;' class='btn btn-trnspic'>设为切换图片</a>";
                                clsbtnwrap.append(html);
                                clsbtnwrap.find('.btn-trnspic').on('click', function () {
                                    if (confirm('确定设为切换图片?')) {
                                        var pclsWrap = $(this).parents(clsWrap);
                                        var src = pclsWrap.find('img').attr('src');
                                        $.cbuilder.active = that;
                                        if ($.cbuilder.active.trnspic === undefined) {
                                            $.cbuilder.active.trnspic = [];
                                        }
                                        $.cbuilder.active.trnspic.push(src);
                                        pclsWrap.remove();
                                    }
                                });
                            }
                        });

                        //图片双击事件
                        $(clsContent).undelegate('dblclick').delegate('img,.cropwrap', 'dblclick', function () {
                            //初始化并没激活,所以必须再次设定激活状态
                            $.cbuilder.active = $(this).parents('.cb-container');
                            $.cbuilder.activeimg = $(this);
                            $.fancybox.open({
                                href: basePath + 'plugins/picture/plugin.html',
                                type: 'iframe',
                                padding: 5,
                                autoSize: false,
                                width: "95%",
                                height: "95%"
                            });
                        });

                        /* 阻止A点击跳转 */
                        $(clsContent).undelegate('click').delegate('a', 'click', function () {
                            return false;
                        });
                    });

                    //绑定拖拽事件
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
                    that._trigger('onLoadContent');
                },
                /* 构建 */
                struc: function () {
                    /* 便于控制顺序 */
                    this.appendHtml();
                    this.loadVendors();
                    this.loadPlugins();
                    this.bindEvents();
                    this.loadContent();
                }
            };
            view.struc();
        },
        _trigger: function(event, cb) {
            this.$element.trigger(event);
            if (cb) {
                cb.call(this.$element);
            }
        }
    };

    $.cbuilder = {
        append: function (html) {
            $.cbuilder.active.$element.find(clsBody).append(html);
            $.cbuilder.active._trigger('onLoadContent');
        },
        trnspic: [],
        getContent: function () {
            /* 清理 */
            var clean  = function() {
                var html = '';
                var clonecontents = $.cbuilder.active.$element.clone();
                var $contents = clonecontents.find('.cb-content');
                $contents.each(function() {

                    var $this = $(this);
                    var $children = $this.children();
                    $children.each(function() {
                        if ($(this).hasClass('cropwrap')) {
                            $(this).find('.imgpos').css('border', '');
                        }
                        html += $(this).html();
                    });
                });
                return html;
            }
            return '<div class="' + strcbuilder + '">' + clean() + '</div>';
        }
    }

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