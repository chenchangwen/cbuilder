//   jQuery cbuilder v1.0 - 2015-4-4 
//   (c) Kevin 21108589@qq.com
//	 license: http://www.opensource.org/licenses/mit-license.php
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(function($) {
    var defaults = {
        height: "100%",
        width: "99%",
        toolbar: [ "upload", "mupload", "test", "countdown", "clean", "anchor", "preview", "picture" ],
        tpl: {
            toolbar: "<div class='cb-toolbar'></div>",
            toolbar_button: "<div class='btn-wrap'><button class='btn primary {clsname}'>{name}</button></div>",
            body: "<div class='cb-body'></div>",
            body_item: "<div class='cb-item'><div class='cb-content'></div></div>",
            body_item_tool: "<div class='cb-tools'><div class='btn-wrap'></div></div>"
        }
    };
    function currentScriptPath() {
        var scripts = document.querySelectorAll("script[src]");
        var currentScript = scripts[scripts.length - 1].src;
        var currentScriptChunks = currentScript.split("/");
        var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
        return currentScript.replace(currentScriptFile, "");
    }
    var clsContainer = ".cb-container", clsToolbar = ".cb-toolbar", clsBody = ".cb-body", clsContent = ".cb-content", clsWrap = ".cb-item", stroriginhtml = "originhtml", strcbuilder = "cbuilder", basePath = currentScriptPath();
    var commons = {
        loadFile: function(srcarray) {
            for (var i = 0; i < srcarray.length; i++) {
                var vendor = srcarray[i];
                if (vendor.indexOf("css") >= 0) {
                    var cssLink = $("<link rel='stylesheet' type='text/css' href='" + vendor + "'>");
                    $("head").append(cssLink);
                } else {
                    $.ajax({
                        async: false,
                        url: vendor
                    });
                }
            }
        }
    };
    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
    };
    $.cbuilder = {
        append: function(html) {
            $.cbuilder.active.$element.find(clsBody).append(html);
            $.cbuilder.active._trigger("cbuilder:onWrapContent");
            $.cbuilder.active._trigger("cbuilder:onContentReady");
        },
        item: {
            tools: {
                addbtn: function(obj) {
                    var html = "<a href='javascript:;'>" + obj.text + "</a>";
                    var clsbtnwrap = this.element.parents(clsWrap).find(".btn-wrap");
                    clsbtnwrap.append(html);
                    if (obj.click) {
                        clsbtnwrap.find("a:last").on("click", function() {
                            obj.click($(this));
                        });
                    }
                }
            }
        },
        getContent: function() {
            $.cbuilder.active._trigger("cbuilder:onGetContentBefore");
            return '<div class="' + strcbuilder + '">' + $.cbuilder.active._content + "</div>";
        }
    };
    cbuilder.prototype = {
        strucView: function() {
            var that = this;
            var options = that.options;
            that.$element.data("cbuilder", that);
            var view = {
                /* 初始化 */
                init: function() {
                    var thiselement = that.$element;
                    thiselement.data(stroriginhtml, thiselement.html());
                    thiselement.html("");
                    thiselement.addClass("cb-container").wrap(options.tpl.container).append(options.tpl.toolbar + options.tpl.body);
                    thiselement.width(options.width).height(options.height);
                    /* 缓存元素 */
                    view.$body = thiselement.find(clsBody);
                },
                /* 加载vendors */
                loadVendors: function() {
                    var vendors = [ /* 弹出层 */
                    "../../vendor/layer/layer.js", "../../vendor/layer/skin/layer.css", /* 拖拽 */
                    "../../vendor/dragula.js/dist/dragula.min.js", "../../vendor/dragula.js/dist/dragula.min.css", /* 菜单 */
                    "../../vendor/jQuery-contextMenu/src/jquery.contextMenu.js", "../../vendor/jQuery-contextMenu/src/jquery.contextMenu.css" ];
                    commons.loadFile(vendors);
                },
                /* 加载toolbar */
                loadToolbar: function() {
                    var len = that.options.toolbar.length;
                    for (var i = 0; i < len; i++) {
                        var name = that.options.toolbar[i];
                        var src = "src/js/toolbar/" + name + "/" + "main" + ".js";
                        $.ajax({
                            async: false,
                            type: "get",
                            url: src,
                            success: function() {
                                /* 执行动态函数,并获取module对象 */
                                var module = init(that.$element, basePath);
                                if (module.isToolbar === false) {
                                    module.onLoaded();
                                    return false;
                                }
                                /* 替换为module名字 */
                                var clsname = "cb-" + module.toolbar.name;
                                if (module.toolbar.text) {
                                    that.$element.find(clsToolbar).append(that.options.tpl.toolbar_button.replace(/\{name\}/, module.toolbar.text).replace(/\{clsname\}/, clsname));
                                    that._trigger("", module.onLoaded);
                                    var modulebtn = that.$element.find("." + clsname);
                                    modulebtn.on("click", function() {
                                        $.cbuilder.active = that;
                                        if (module.type === "iframe") {
                                            var width = module.width !== undefined ? module.width + "px" : "95%";
                                            var height = module.height !== undefined ? module.height + "px" : "95%";
                                            layer.open({
                                                type: 2,
                                                title: module.toolbar.text,
                                                shadeClose: true,
                                                shade: .3,
                                                area: [ width, height ],
                                                content: basePath + "toolbar/" + module.toolbar.name + "/main.html"
                                            });
                                        }
                                        that._trigger("", module.toolbar.onClick);
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
                appendHtml: function() {
                    view.$body.html(that.$element.data(stroriginhtml));
                    that.$element.data(stroriginhtml, "");
                },
                /* 触发事件 */
                triggerEvent: function() {
                    $(document).ready(function() {
                        that._trigger("cbuilder:onWrapContent");
                        that._trigger("cbuilder:onContentReady");
                    });
                },
                /* 事件 */
                bindEvents: function() {
                    var $cbbody = that.$element.find(clsBody);
                    /* cbuilder:onWrapContent 事件 */
                    that.$element.on("cbuilder:onWrapContent", function(e) {
                        /* 构建基本元素 */
                        $cbbody.children(":not(" + clsWrap + ")").each(function() {
                            var $this = $(this);
                            /* 增加 cb-item div */
                            $this.wrap(that.options.tpl.body_item);
                            /* 增加 工具条 */
                            $this.parent().before(that.options.tpl.body_item_tool);
                            $.cbuilder.active = that;
                            $.cbuilder.item.tools.element = $this;
                            $.cbuilder.item.tools.addbtn({
                                text: "删除",
                                click: function($this) {
                                    layer.confirm("确定删除该项?", {
                                        icon: 3
                                    }, function(index) {
                                        layer.close(index);
                                        $this.parents(clsWrap).remove();
                                    });
                                }
                            });
                            that._trigger("cbuilder:onToolsReady");
                        });
                    });
                    /* 拖拽 */
                    dragula($cbbody[0], {
                        moves: function(el, container, handle) {
                            return handle.className === "cb-tools";
                        }
                    });
                },
                /* 构建 */
                struc: function() {
                    view.init();
                    view.loadVendors();
                    view.loadToolbar();
                    view.bindEvents();
                    view.appendHtml();
                    view.triggerEvent();
                }
            };
            view.struc();
        },
        _trigger: function(event, cb, params) {
            this.$element.trigger(event, params || "");
            if (cb) {
                cb.call(this.$element);
            }
        }
    };
    /* 执行一次 */
    var onceView = {
        /* 菜单 */
        contextMenu: function() {
            var vendors = [ "../../vendor/jQuery-contextMenu/src/jquery.contextMenu.js", "../../vendor/jQuery-contextMenu/src/jquery.contextMenu.css" ];
            commons.loadFile(vendors);
            $.contextMenu({
                selector: ".cb-content *",
                callback: function(key, options) {
                    $.cbuilder.$pw.trigger("propertiesWindow:show", $(this));
                },
                items: {
                    edit: {
                        name: "编辑",
                        icon: "edit"
                    },
                    //"cut": { name: "Cut", icon: "cut" },
                    //"copy": { name: "Copy", icon: "copy" },
                    //"paste": { name: "Paste", icon: "paste" },
                    //"delete": { name: "Delete", icon: "delete" },
                    sep1: "---------",
                    quit: {
                        name: "退出",
                        icon: "quit"
                    }
                }
            });
        },
        /* 属性窗口 */
        propertiesWindow: function() {
            var templates = {
                propertiesWindow: '<div class="cb-propertiesWindow"><div class="pw-header"></div><div class="pw-body"><hr class="cb-article-divider"><ul class="cb-pills"><li><a href="javascript:;">&#x7F16;&#x8F91;</a></li><li><a href="javascript:;">&#x64CD;&#x4F5C;</a></li></ul><div class="pw-operate"><a class="close" href="javascript:;"></a></div><hr class="cb-article-divider"><div class="pw-body-content"></div><div class="pw-body-footer"></div></div></div>',
                bodycontentheader: '<h1 class="pw-body-content-header">#value</h1>',
                hr: '<hr class="cb-article-divider">',
                editbtns: '<button type="button" class="btn primary save">&#x4FDD; &#x5B58;</button>',
                operationbtns: '<button type="button" class="btn primary delete">&#x5220; &#x9664;</button>'
            };
            var view = {
                domCache: function() {
                    var $element = $("body");
                    $element.append(templates.propertiesWindow);
                    /* 全局 */
                    $.cbuilder.$pw = view.$pw = $element.find(".cb-propertiesWindow");
                    $.cbuilder.$pwcontent = view.$pwcontent = view.$pw.find(".pw-body-content");
                    $.cbuilder.$pwfooter = view.$pwfooter = view.$pw.find(".pw-body-footer");
                    $.cbuilder.$pw.AddBtn = function(opts) {
                        var $obj = $("#" + opts.id);
                        if ($obj.length === 0) {
                            var html = '<button type="button" id="' + opts.id + '" class="btn primary">' + opts.text + "</button>";
                            $.cbuilder.$pwfooter.append(html);
                            if (typeof opts.event === "function") {
                                opts.event($("#" + opts.id));
                            }
                        }
                    };
                },
                pillsEvent: function() {
                    function buildList(obj, title, attrlist) {
                        var html = templates.bodycontentheader.replace(/#value/, title);
                        html += '<table class="pw-body-content-list">';
                        for (var i = 0; i < attrlist.length; i++) {
                            html += "<tr>";
                            html += '<td class="text">' + (attrlist[i].name || attrlist[i]) + ":</td>";
                            html += '<td class="input">' + '<input type="text" value="' + (attrlist[i].value || obj.css(attrlist[i])) + '"></input>' + "</td>";
                            html += "</tr>";
                        }
                        html += "</table>";
                        html += templates.hr;
                        return html;
                    }
                    view.$pw.find("ul").delegate("li", "click", function(event, objindex) {
                        var $this = $(this);
                        var stractive = "cb-active";
                        var index = objindex || $this.index();
                        var $selectedobj = view.$pw.$selectedobj;
                        view.$pwcontent.html("");
                        view.$pwfooter.html("");
                        /* 编辑 */
                        if (index === 0) {
                            var html = "";
                            html += buildList($selectedobj, "盒子", [ "height", "width" ]);
                            view.$pwcontent.html(html);
                            if (view.$pwfooter.html() === "") {
                                view.$pwfooter.append(templates.editbtns);
                                var $savebtn = view.$pwfooter.find(".save");
                                $savebtn.on("click", function() {
                                    var $bodylist = view.$pwcontent.find(".pw-body-content-list tr");
                                    $bodylist.each(function() {
                                        var $this = $(this);
                                        var text = $this.find(".text").text().replace(/:/, "");
                                        var value = $this.find(".input").find("input").val();
                                        if ($selectedobj.css(text)) {
                                            $selectedobj.css(text, value);
                                        } else if ($selectedobj.prop(text)) {
                                            $selectedobj.prop(text, value);
                                        }
                                    });
                                });
                            }
                        } else if (index === 1) {
                            /* 其他按钮 */
                            if ($selectedobj.prop("tagName") === "IMG") {
                                $.cbuilder.$pw.trigger("propertiesWindow:operationShow", $selectedobj);
                            }
                            /* 通用按钮 */
                            view.$pwfooter.append(templates.operationbtns);
                            var $btndel = view.$pwfooter.find(".delete");
                            $btndel.on("click", function() {
                                layer.confirm("确定删除当前编辑元素?", {
                                    icon: 3
                                }, function(index) {
                                    var $deleteobj = "";
                                    /* 如果是image */
                                    var $pimage = $selectedobj.parent(".cb-image");
                                    if ($pimage.length !== 0) {
                                        if ($pimage.children().length === 1 || $selectedobj.prop("tagName") === "IMG") {
                                            $deleteobj = $pimage.parents(".cb-item");
                                        } else {
                                            $deleteobj = $selectedobj;
                                        }
                                    } else {
                                        /* 其他元素 */
                                        var $parent = $selectedobj.parents(".cb-content");
                                        var $item = $selectedobj.parents(".cb-item");
                                        if ($parent.children().length === 1) {
                                            $deleteobj = $item;
                                        } else {
                                            $deleteobj = $item;
                                        }
                                    }
                                    $deleteobj.remove();
                                    view.$pw.hide();
                                    layer.close(index);
                                });
                            });
                        }
                        view.$pw.selectedindex = index;
                        $this.parent().find("li").removeClass(stractive).eq(index).addClass(stractive);
                        view.$pw.show();
                    });
                },
                customShowEvent: function() {
                    view.$pw.on("propertiesWindow:show", function(event, obj) {
                        var $eventobj = $(obj);
                        view.$pw.find(".pw-header").text("<" + $eventobj.prop("tagName") + ">");
                        view.$pw.find(".pw-content");
                        view.$pw.$selectedobj = $eventobj;
                        view.$pw.find(".cb-pills li:first").trigger("click", 0 || view.$pw.selectedindex);
                    });
                },
                closeEvent: function() {
                    view.$pw.find(".close").on("click", function() {
                        view.$pw.hide();
                    });
                },
                bindEvents: function() {
                    view.customShowEvent();
                    view.closeEvent();
                    view.pillsEvent();
                },
                struc: function() {
                    view.domCache();
                    view.bindEvents();
                }
            };
            view.struc();
        },
        struc: function() {
            $(document).ready(function() {
                onceView.propertiesWindow();
                onceView.contextMenu();
            });
        }
    };
    onceView.struc();
    $.fn.cbuilder = function(option) {
        var args = arguments;
        return $(this).each(function() {
            var data = $(this).data(strcbuilder);
            var options = typeof option !== "object" ? null : option;
            if (!data) {
                data = new cbuilder(this, options);
                $(this).data(strcbuilder, data);
            }
            if (typeof option === "string") {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
    };
});