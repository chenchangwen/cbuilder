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
    (function(win) {
        var Store = {}, DOMCache = {
            get: function(selector, force) {
                if (Store[selector] && !force) {
                    return Store[selector];
                }
                return Store[selector] = $(selector);
            }
        };
        win.DOMCache = DOMCache;
    })(window);
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
        },
        /* 清理 */
        clean: function() {
            /* jcrop */
            if (typeof jcrop_api != "undefined") {
                jcrop_api.destroy();
                jcrop_api.release();
                delete jcrop_api;
            }
            /* 如果是激活的imgpos 则删除,因为此时保存 肯定会新建新的imgpos */
            if ($.cbuilder.$pw.$selectedobj.hasClass("imgpos-active")) {
                $.cbuilder.$pw.$selectedobj.remove();
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
                                var module = init(that.$element, basePath, commons);
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
                triggerCustomEvent: function() {
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
                            $.cbuilder.active = that;
                            that._trigger("cbuilder:onToolsReady");
                        });
                    });
                    /* 拖拽 */
                    dragula($cbbody[0], {
                        moves: function(el, container, handle) {
                            return handle.className === "item-move";
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
                    view.triggerCustomEvent();
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
                selector: ".cb-content img,.cb-content a",
                callback: function(key, options) {
                    $.cbuilder.$pw.$selectedobj = this;
                    $.cbuilder.$pw.trigger("propertiesWindow:show");
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
        /* 工具 */
        itemtools: function() {
            var templates = {
                itemtools: '<div class="cb-itemtools"><i class="item-move" href="javascript:;"></i><i class="item-delete" href="javascript:;"></i></div>'
            };
            var view = {
                domCache: function() {
                    var $element = $("body");
                    $element.append(templates.itemtools);
                    /* 全局 */
                    $.cbuilder.$itemtools = view.$itemtools = $element.find(".cb-itemtools");
                    view.$contianer = $(".cb-container");
                    view.$itemdelete = $(".item-delete");
                },
                mouseOverEvent: function() {
                    view.$contianer.mouseover(function(e) {
                        var $target = $(e.target);
                        var $content = $target.parents(clsContent);
                        if ($(".cb-itemtools").length === 0) {
                            $("body").append(templates.itemtools);
                        }
                        /* jcrop 不存在时才作显示 */
                        if ($(".jcrop-holder").length === 0) {
                            if ($content.length > 0) {
                                $content.append($.cbuilder.$itemtools);
                                $.cbuilder.$itemtools.show();
                            }
                            if ($target.hasClass("cb-content")) {
                                $target.append($.cbuilder.$itemtools);
                                $.cbuilder.$itemtools.show();
                            }
                        }
                    });
                    view.$contianer.mouseout(function(e) {
                        var $target = $(e.target);
                        var $content = $target.parents(clsContent);
                        if ($content.length === 0) {
                            $.cbuilder.$itemtools.hide();
                        }
                    });
                },
                deleteEvent: function() {
                    $(".item-delete").on("click", function() {
                        var that = $(this);
                        layer.confirm("确定删除该项?", {
                            icon: 3
                        }, function(index) {
                            layer.close(index);
                            that.parents(clsContent).detach();
                        });
                    });
                },
                bindEvents: function() {
                    view.mouseOverEvent();
                    view.deleteEvent();
                },
                struc: function() {
                    $(document).ready(function() {
                        view.domCache();
                        view.bindEvents();
                    });
                }
            };
            view.struc();
        },
        /* 属性窗口 */
        propertiesWindow: function() {
            var templates = {
                propertiesWindow: '<div class="cb-propertiesWindow"><!-- 主面板 --><div class="pw-main pw-panel" style="display: block"><div class="pw-header"></div><div class="pw-operate"><a class="close" href="javascript:;"></a></div><div class="pw-body"><hr class="cb-article-divider"><ul class="cb-pills"><li><a href="javascript:;" class="cb-pills-title">&#x7F16;&#x8F91;</a></li></ul><hr class="cb-article-divider"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x5C5E;&#x6027;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">height:</td><td class="input"><input type="text" id="pwheight"></td></tr><tr><td class="text">width:</td><td class="input"><input type="text" id="pwwidth"></td></tr></tbody></table><hr class="cb-article-divider"></div><div class="pw-body-footer"><button type="button" class="btn primary save">&#x4FDD; &#x5B58;</button><button type="button" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div><!-- 区域 --><div class="pw-area pw-panel"><div class="pw-header"></div><div class="pw-operate"><a class="back" href="javascript:;"></a><a class="close" href="javascript:;"></a></div><div class="pw-body"><hr class="cb-article-divider"><ul class="cb-pills"><li class="cb-active"><a href="javascript:;" class="cb-pills-title"></a></li></ul><hr class="cb-article-divider"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x4F4D;&#x7F6E;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">width:</td><td class="input"><input id="cropwidth" class="croppos" data-name="width" maxlength="4" type="text"></td></tr><tr><td class="text">height:</td><td class="input"><input id="cropheight" class="croppos" data-name="height" maxlength="4" type="text"></td></tr><tr><td class="text">margin-left:</td><td class="input"><input id="cropmarginleft" class="croppos" data-name="left" maxlength="4" type="text"></td></tr><tr><td class="text">margin-top:</td><td class="input"><input id="cropmargintop" class="croppos" data-name="top" maxlength="4" type="text"></td></tr></tbody></table><hr class="cb-article-divider"><h1 class="pw-body-content-header">&#x7C7B;&#x578B;</h1><div class="pw-body-content-controls"><div id="area-type"><label for="area-type1"><input id="area-type1" data-type="link" type="radio" name="areatype">&#x94FE;&#x63A5;</label><label for="area-type2"><input id="area-type2" data-type="anchor" type="radio" name="areatype">&#x951A;&#x70B9;</label></div></div><div class="area-type area-type1 pw-controls-panel"><table class="pw-body-content-list"><tbody><tr><td class="text">url:</td><td class="input"><textarea rows="3" cols="30" style="width: 100%"></textarea></td></tr><tr><td class="text">&#x6253;&#x5F00;&#x65B9;&#x5F0F;:</td><td class="input"><label for="open-type1"><input id="open-type1" data-value="_blank" type="radio" name="opentype">&#x65B0;&#x5EFA;&#x7A97;&#x53E3;</label><label for="open-type2"><input id="open-type2" data-value="_self" type="radio" name="opentype">&#x5F53;&#x524D;&#x7A97;&#x53E3;</label></td></tr></tbody></table></div><div class="area-type area-type2 pw-controls-panel"></div><hr class="cb-article-divider"></div><div class="pw-body-footer"><div class="pw-body-footer"><button type="button" id="area-save" class="btn primary ">&#x4FDD; &#x5B58;</button><button type="button" id="area-delete" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div></div></div>',
                bodycontentheader: '<h1 class="pw-body-content-header">#value</h1>',
                hr: '<hr class="cb-article-divider">'
            };
            /* 属性窗口 */
            var view = {
                /* dom缓存 */
                domCache: function() {
                    var $body = $("body");
                    $body.append(templates.propertiesWindow);
                    /* 全局 */
                    $.cbuilder.$pw = view.$pw = $body.find(".cb-propertiesWindow");
                    view.$pwallpanel = view.$pw.find(".pw-panel");
                    /* 添加按钮 */
                    $.cbuilder.$pw.AddBtn = function(opts) {
                        var $obj = $("#" + opts.id);
                        if ($obj.length === 0) {
                            var html = '<button type="button" id="' + opts.id + '" class="btn primary">' + opts.text + "</button>";
                            view.$pw.find(opts.panel + " .pw-body-footer").append(html);
                            if (typeof opts.event === "function") {
                                opts.event($("#" + opts.id));
                            }
                        }
                    };
                },
                btnsEvent: function() {
                    view.setPanel(".pw-main");
                    /* 保存 */
                    var $savebtn = view.$pwfooter.find(".save");
                    $savebtn.on("click", function() {
                        var $selectedobj = $(view.$pw.$selectedobj);
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
                    /* 删除 */
                    var $btndel = view.$pwfooter.find(".delete");
                    $btndel.on("click", function() {
                        var $selectedobj = $(view.$pw.$selectedobj);
                        var tip = "确定删除&lt;" + $selectedobj.prop("tagName") + "&gt;?";
                        layer.confirm(tip, {
                            icon: 3
                        }, function(index) {
                            var $deleteobj = "";
                            /* 如果是image */
                            var $pimage = $selectedobj.parent(".cropwrap");
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
                            $deleteobj.detach();
                            view.$pw.hide();
                            layer.close(index);
                        });
                    });
                },
                pillsEvent: function() {
                    view.$pw.find("ul").delegate("li", "click", function(event, objindex) {
                        var $this = $(this);
                        var stractive = "cb-active";
                        var index = objindex || $this.index();
                        /* 找当前li的 父 panel */
                        var $panel = $this.parents(".pw-panel");
                        var showselector = "";
                        if ($panel.hasClass("pw-main")) {
                            showselector = ".pw-main";
                            view.setPanel(showselector);
                        }
                        /* 事件:编辑页显示中 */
                        $.cbuilder.$pw.trigger("propertiesWindow:editShowing", view.$pw.$selectedobj);
                        $this.parent().find("li").removeClass(stractive).eq(index).addClass(stractive);
                        view.$pw.selectedindex = index;
                        view.$pw.find(showselector).show();
                        view.$pw.show();
                    });
                    view.btnsEvent();
                },
                customEvent: function() {
                    /* 事件:显示 */
                    view.$pw.on("propertiesWindow:show", function(event) {
                        commons.clean();
                        view.$pwallpanel.hide();
                        view.$pw.find(".pw-main .pw-header").text("<" + $.cbuilder.$pw.$selectedobj.prop("tagName") + ">");
                        view.$pw.find(".pw-main .cb-pills li:first").trigger("click", 0 || view.$pw.selectedindex);
                        $("#pwheight").val(view.$pw.$selectedobj.css("height").replace(/px/, ""));
                        $("#pwwidth").val(view.$pw.$selectedobj.css("width").replace(/px/, ""));
                    });
                },
                /* 设置panel */
                setPanel: function(selecotr) {
                    var $panel = $(selecotr);
                    view.$panel = $panel;
                    view.$pwcontent = $panel.find(".pw-body-content");
                    view.$pwfooter = $panel.find(".pw-body-footer");
                    view.$pwheader = $panel.find(".pw-header");
                },
                backEvent: function() {
                    /* 后退按钮 */
                    view.$pw.find(".back").on("click", function() {
                        $.cbuilder.$pw.trigger("propertiesWindow:show");
                    });
                },
                closeEvent: function() {
                    /* 关闭属性窗口 */
                    view.$pw.find(".close").on("click", function() {
                        commons.clean();
                        view.$pw.hide();
                    });
                },
                blockInit: function() {
                    var areaview = {
                        bindEvents: function() {
                            areaview.cropPosInputEvent();
                            areaview.saveBtnEvent();
                            areaview.deleteBtnEvent();
                            areaview.typeEvent();
                        },
                        /* 类型 */
                        typeEvent: function() {
                            areaview.$areatype.delegate("input", "click", function() {
                                var $this = $(this), id = $this.attr("id");
                                areaview.$selecteType = $this.data("type");
                                var controls = view.$panel.find(".pw-controls-panel");
                                /* 隐藏所有controls*/
                                controls.hide();
                                /* 匹配当前id的controls 并显示*/
                                view.$panel.find(".pw-controls-panel[class*=" + id + "]").show();
                            });
                        },
                        /* 图片裁剪输入 */
                        cropPosInputEvent: function() {
                            /* 防止非数字输入 */
                            areaview.$croppos.on("keypress", function(event) {
                                if (isNaN(String.fromCharCode(event.which))) {
                                    event.preventDefault();
                                }
                            });
                            /* 数字输入则重新定位图片裁剪位置 */
                            areaview.$croppos.on("keyup", function(event) {
                                var keyCode = event.keyCode;
                                if (keyCode === 32) {
                                    event.returnValue = false;
                                } else if (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105 || keyCode === 8 || keyCode === 46) {
                                    event.returnValue = true;
                                    setTimeout(function() {
                                        var w = parseInt($("#cropwidth").val());
                                        var h = parseInt($("#cropheight").val());
                                        var x = parseInt($("#cropmarginleft").val());
                                        var y = parseInt($("#cropmargintop").val());
                                        var $target = $(event.target);
                                        var name = $target.data("name");
                                        var value = parseInt(event.target.value) || 0;
                                        if (name === "width") {
                                            w = value;
                                        }
                                        if (name === "height") {
                                            h = value;
                                        }
                                        if (name === "left") {
                                            x = value;
                                        }
                                        if (name === "top") {
                                            y = value;
                                        }
                                        if (typeof jcrop_api != "undefined") {
                                            jcrop_api.animateTo([ w + x, h + y, x, y ]);
                                            $.cbuilder.areapos = {
                                                w: w,
                                                h: h,
                                                x: x,
                                                y: y
                                            };
                                        }
                                    }, 200);
                                } else {
                                    event.returnValue = false;
                                }
                            });
                        },
                        customEvent: function() {
                            /* 事件:编辑页显示完 */
                            view.$pw.on("propertiesWindow:editShowEd", function(event, opname, clsstr) {
                                /* 隐藏项工具 */
                                $.cbuilder.$itemtools.hide();
                                var headerstr = "";
                                /* 区域 */
                                if (clsstr === "area") {
                                    view.setPanel(".pw-area");
                                    headerstr = "当前区域";
                                }
                                view.$pwallpanel.hide();
                                view.$panel.show();
                                view.$pwheader.text("<" + headerstr + ">");
                                /* 设置坐标 */
                                $("#cropwidth").val($.cbuilder.areapos.w);
                                $("#cropheight").val($.cbuilder.areapos.h);
                                $("#cropmarginleft").val($.cbuilder.areapos.x);
                                $("#cropmargintop").val($.cbuilder.areapos.y);
                                /* 改变title */
                                view.$panel.find(".cb-pills-title").text(opname);
                                $.cbuilder.$pw.trigger("propertiesWindow:areaTypeShow");
                                /* 显示属性窗口,因为此时有可能属性窗口被关闭 */
                                view.$pw.show();
                            });
                            /* 事件:显示类型 */
                            view.$pw.on("propertiesWindow:areaTypeShow", function() {
                                var $obj = $.cbuilder.$pw.$selectedobj;
                                var linktype = $obj.attr("linktype");
                                if (linktype) {
                                    areaview.$areatype.find("input[data-type=" + $obj.data("type") + "]").trigger("click");
                                } else {
                                    areaview.$areatype.find("input:eq(0)").trigger("click");
                                }
                            });
                            /* 事件:保存类型 */
                            view.$pw.on("propertiesWindow:areaTypeSave", function() {
                                /* 处理当前area */
                                var $editarea = $("#editarea");
                                var type = areaview.$selecteType;
                                switch (type) {
                                  case "link":
                                    break;
                                }
                                $editarea.removeAttr("id");
                            });
                        },
                        /* 删除 */
                        deleteBtnEvent: function() {
                            $("#area-delete").on("click", function() {
                                layer.confirm("确定删除<当前区域>?", {
                                    icon: 3
                                }, function(index) {
                                    commons.clean();
                                    view.$pw.hide();
                                    layer.close(index);
                                });
                            });
                        },
                        /* 保存 */
                        saveBtnEvent: function() {
                            $("#area-save").on("click", function() {
                                /* jcrop存在才执行保存或编辑 */
                                if (typeof jcrop_api != "undefined") {
                                    /* 坐标位置 */
                                    var width = $.cbuilder.areapos.w - 6;
                                    var height = $.cbuilder.areapos.h - 6;
                                    var left = $.cbuilder.areapos.x;
                                    var top = $.cbuilder.areapos.y;
                                    var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
                                    /* 默认为a 除了倒计时 */
                                    var tagname = "a";
                                    var editarea = "<" + tagname + ' id="editarea" class="imgpos" style="' + position + '" ></' + tagname + ">";
                                    /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
                                    var $parent = $.cbuilder.$pw.$selectedobj.parent();
                                    $parent.append(editarea);
                                    $.cbuilder.$pw.trigger("propertiesWindow:areaTypeSave");
                                    commons.clean();
                                }
                            });
                        },
                        domCache: function() {
                            areaview.$areatype = $("#area-type");
                            areaview.$croppos = $(".croppos");
                        },
                        struc: function() {
                            areaview.domCache();
                            areaview.customEvent();
                            areaview.bindEvents();
                        }
                    };
                    areaview.struc();
                },
                bindEvents: function() {
                    view.customEvent();
                    view.closeEvent();
                    view.backEvent();
                    view.pillsEvent();
                },
                struc: function() {
                    view.domCache();
                    view.bindEvents();
                    view.blockInit();
                }
            };
            view.struc();
        },
        struc: function() {
            $(document).ready(function() {
                onceView.propertiesWindow();
                onceView.contextMenu();
                onceView.itemtools();
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