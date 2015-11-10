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
        toolbar: [ "upload", "mupload", "test", "clean", "anchor", "preview", "picture" ],
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
        },
        /* 
     * 设置变量 
     * 将指定options转换为obj.$xxx的变量
     */
        setObjVariable: function(obj, options, filter) {
            if (options != undefined) {
                if (typeof options == "string") {
                    options = options.split(",");
                    for (var i = 0; i < options.length; i++) {
                        var rpoptoin = options[i];
                        if (filter) {
                            rpoptoin = rpoptoin.replace(filter, "");
                        }
                        var tag = "#";
                        if (options[i].indexOf(".") >= 0) {
                            rpoptoin = rpoptoin.replace(/\./gi, "");
                            tag = "";
                        }
                        obj["$" + rpoptoin] = $(tag + options[i]);
                    }
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
            /* 删除jcrop 生成的属性 */
            $.cbuilder.active.$element.find("img").css("visibility", "");
            /* 删除临时操作的id */
            $("#tempimgpos").removeAttr("id");
        },
        /**
     * 对象-调用对象自身函数
     * @param1 {Object}
     * @params {arguments}  执行的方法名
     * @return {Array}
     */
        objectCallFunction: function(obj) {
            var fn;
            for (var i = 1; i < arguments.length; i++) {
                fn = obj[arguments[i]];
                if (typeof fn === "function") {
                    fn();
                }
            }
        },
        regex: {
            url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/
        },
        layer: {
            msg: function(msg) {
                layer.msg(msg, {
                    time: 2e3,
                    offset: "200px"
                });
            }
        },
        propertiesWindow: {
            show: function() {
                var $pw = $("body").find(".cb-propertiesWindow");
                $pw.css({
                    right: "0px"
                });
            },
            hide: function(pixel) {
                var $pw = $("body").find(".cb-propertiesWindow");
                if (pixel !== undefined) {
                    $pw.css({
                        right: pixel
                    });
                } else {
                    $pw.css({
                        right: "-385px"
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
            var html = "";
            if ($.cbuilder.active._content) {
                html = '<div class="' + strcbuilder + '">' + $.cbuilder.active._content + "</div>";
            } else {
                html = this._getItemsObject().html();
            }
            return html;
        },
        _getItemsObject: function() {
            var clonecontents = $.cbuilder.active.$element.clone();
            var $items = clonecontents.find(".cb-body");
            return $items;
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
                        });
                    });
                    /* 拖拽 */
                    dragula($cbbody[0], {
                        moves: function(el, container, handle) {
                            return handle.className === "item-move";
                        }
                    });
                    /* 内容加载完毕 */
                    that.$element.on("cbuilder:onContentReady", function(e) {});
                },
                /* 构建 */
                struc: function() {
                    commons.objectCallFunction(view, "init", "loadVendors", "loadToolbar", "bindEvents", "appendHtml", "triggerCustomEvent");
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
        /* 工具 */
        itemtools: function() {
            var templates = {
                itemtools: '<div class="cb-itemtools"><i class="item-move" href="javascript:;"></i><i class="item-delete" href="javascript:;"></i></div>'
            };
            var itemtoolsview = {
                domCache: function() {
                    var $element = $("body");
                    $element.append(templates.itemtools);
                    /* 全局 */
                    $.cbuilder.$itemtools = itemtoolsview.$itemtools = $element.find(".cb-itemtools");
                    itemtoolsview.$contianer = $(".cb-container");
                    itemtoolsview.$itemdelete = $(".item-delete");
                },
                mouseOverEvent: function() {
                    itemtoolsview.$contianer.mouseover(function(e) {
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
                    itemtoolsview.$contianer.mouseout(function(e) {
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
                    itemtoolsview.mouseOverEvent();
                    itemtoolsview.deleteEvent();
                },
                struc: function() {
                    $(document).ready(function() {
                        itemtoolsview.domCache();
                        itemtoolsview.bindEvents();
                    });
                }
            };
            itemtoolsview.struc();
        },
        /* 属性窗口 */
        propertiesWindow: function() {
            var templates = {
                propertiesWindow: '<div class="cb-propertiesWindow"><div class="cb-pw-openner">&#x5C5E;<br>&#x6027;<br>&#x83DC;<br>&#x5355;<br></div><!-- 图片 --><div class="pw-main pw-panel" id="pwpicture" style="display: block"><div class="pw-header"></div><div class="pw-operate"></div><div class="pw-body"><hr class="cb-article-divider"><ul class="cb-pills"><li><a href="javascript:;" class="cb-pills-title">&#x7F16;&#x8F91;</a></li></ul><hr class="cb-article-divider"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x5C5E;&#x6027;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">height:</td><td class="input"><input type="text" id="cb-main-height"></td></tr><tr><td class="text">width:</td><td class="input"><input type="text" id="cb-main-width"></td></tr></tbody></table><h1 class="pw-body-content-header">&#x663E;&#x793A;&#x65F6;&#x95F4;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">&#x5F00;&#x59CB;:</td><td class="input"><input type="text" id="cb-main-showdate" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', maxDate: \'#F{$dp.$D(\\\'cb-main-hidedate\\\')||\\\'2030-10-01\\\'}\' }) "></td></tr><tr><td class="text">&#x7ED3;&#x675F;:</td><td class="input"><input type="text" id="cb-main-hidedate" onfocus=" WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', minDate: \'#F{$dp.$D(\\\'cb-main-showdate\\\')}\', maxDate: \'2030-10-01\' }) "></td></tr></tbody></table><hr class="cb-article-divider"></div><div class="pw-body-footer"><button type="button" class="btn primary save">&#x4FDD; &#x5B58;</button><button type="button" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div><!-- 区域 --><div class="pw-area pw-panel"><div class="pw-header"></div><div class="pw-operate"></div><div class="pw-body"><hr class="cb-article-divider"><ul class="cb-pills"><li class="cb-active"><a href="javascript:;" class="cb-pills-title"></a></li></ul><hr class="cb-article-divider"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x4F4D;&#x7F6E;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">width:</td><td class="input"><input id="cb-area-width" class="cb-area-croppos" data-name="width" maxlength="4" type="text"></td></tr><tr><td class="text">height:</td><td class="input"><input id="cb-area-height" class="cb-area-croppos" data-name="height" maxlength="4" type="text"></td></tr><tr><td class="text">margin-left:</td><td class="input"><input id="cb-area-marginleft" class="cb-area-croppos" data-name="left" maxlength="4" type="text"></td></tr><tr><td class="text">margin-top:</td><td class="input"><input id="cb-area-margintop" class="cb-area-croppos" data-name="top" maxlength="4" type="text"></td></tr></tbody></table><hr class="cb-article-divider"><h1 class="pw-body-content-header">&#x7C7B;&#x578B;</h1><div class="pw-body-content-controls"><div id="cb-area-type"><label for="cb-area-type1"><input id="cb-area-type1" data-type="link" type="radio" name="areatype">&#x94FE;&#x63A5;</label><label for="cb-area-type2"><input id="cb-area-type2" data-type="anchor" type="radio" name="areatype">&#x951A;&#x70B9;</label><label for="cb-area-type3"><input id="cb-area-type3" data-type="countdown" type="radio" name="areatype">&#x5012;&#x8BA1;&#x65F6;</label></div></div><div class="cb-area-type cb-area-type1 pw-controls-panel"><table class="pw-body-content-list"><tbody><tr><td class="text">&#x94FE;&#x63A5;&#x5730;&#x5740;:</td><td class="input"><textarea id="cb-area-url" rows="3" cols="30" style="width: 100%"></textarea></td></tr><tr><td class="text">&#x6253;&#x5F00;&#x65B9;&#x5F0F;:</td><td class="input"><label for="open-type1"><input id="open-type1" data-value="_blank" type="radio" name="opentype" checked="checked">&#x65B0;&#x5EFA;&#x7A97;&#x53E3;</label><label for="open-type2"><input id="open-type2" data-value="_self" type="radio" name="opentype">&#x5F53;&#x524D;&#x7A97;&#x53E3;</label></td></tr></tbody></table></div><div class="cb-area-type cb-area-type2 pw-controls-panel"><select id="cb-area-anchor"></select></div><div class="cb-area-type cb-area-type3 pw-controls-panel"><table class="pw-body-content-list"><tbody><tr><td class="input" colspan="2"><div id="cb-area-fontdemo">8&#x5929;08&#x65F6;08&#x5206;08&#x79D2;</div></td></tr><tr><td class="text">&#x5B57;&#x4F53;:</td><td class="input"><select id="cb-area-fontfamily"><option value="&#x5B8B;&#x4F53;">&#x5B8B;&#x4F53;</option><option value="&#x6977;&#x4F53;">&#x6977;&#x4F53;</option><option value="&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;">&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;</option></select></td></tr><tr><td class="text">&#x5B57;&#x4F53;&#x5927;&#x5C0F;:</td><td class="input"><select id="cb-area-fontsize"></select></td></tr><tr><td class="text">&#x5B57;&#x4F53;&#x989C;&#x8272;:</td><td class="input"><input type="text" id="cb-area-fontcolor" style="display: none"></td></tr><tr><td class="text">&#x5F00;&#x59CB;&#x65F6;&#x95F4;:</td><td class="input"><input type="text" id="cb-area-startdate" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', maxDate: \'#F{$dp.$D(\\\'cb-area-enddate\\\')||\\\'2030-10-01\\\'}\' }) "></td></tr><tr><td class="text">&#x7ED3;&#x675F;&#x65F6;&#x95F4;:</td><td class="input"><input type="text" id="cb-area-enddate" onfocus=" WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', minDate: \'#F{$dp.$D(\\\'cb-area-startdate\\\')}\', maxDate: \'2030-10-01\' }) "></td></tr><tr><td class="text">&#x662F;&#x5426;&#x5929;&#x4E3A;&#x5355;&#x4F4D;:</td><td class="input"><input type="checkbox" id="cb-area-isdayunit"></td></tr><!--<tr>--><!--<td class="text">是否显示时分秒:</td>--><!--<td class="input">--><!--<input type=\'checkbox\' id="cb-area-issuffix"/>--><!--</td>--><!--</tr>--></tbody></table></div><hr class="cb-article-divider"></div><div class="pw-body-footer"><div class="pw-body-footer"><button type="button" id="cb-area-save" class="btn primary ">&#x4FDD; &#x5B58;</button><button type="button" id="cb-area-delete" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div></div></div>',
                bodycontentheader: '<h1 class="pw-body-content-header">#value</h1>',
                hr: '<hr class="cb-article-divider">'
            };
            $("body").append(templates.propertiesWindow);
            var $pw = $("body").find(".cb-propertiesWindow");
            var _propertiesWindow = {
                show: function() {},
                hide: function() {
                    $.cbuilder.$pw.hide();
                }
            };
            $.cbuilder.propertiesWindow = {
                show: function() {},
                hide: function() {}
            };
            (function() {
                /* 属性窗口 */
                var view = {
                    /* dom缓存 */
                    domCache: function() {
                        view.$pwallpanel = view.$pw.find(".pw-panel");
                        var str1 = "cb-main-height,cb-main-width,cb-main-showdate,cb-main-hidedate";
                        commons.setObjVariable(view, str1, "cb-main-");
                    },
                    btnsEvent: function() {
                        view.setPanel(".pw-main");
                        /* 保存 */
                        var $savebtn = view.$pwfooter.find(".save");
                        $savebtn.on("click", function() {
                            var $selectedobj = $(view.$pw.$selectedobj);
                            var $bodylist = view.$pwcontent.find(".pw-body-content-list tr");
                            var $cropwrap = $selectedobj.parents(".cb-cropwrap");
                            $bodylist.each(function() {
                                var $this = $(this);
                                var text = $this.find(".text").text().replace(/:/, "");
                                var value = $this.find(".input").find("input").val();
                                if ($selectedobj.css(text)) {
                                    $selectedobj.css(text, value);
                                } else if ($selectedobj.prop(text)) {
                                    $selectedobj.prop(text, value);
                                }
                                /* 保存显示时间 */
                                /* 开始时间 */
                                var showdate = view.$showdate.val();
                                if (showdate !== "") {
                                    $cropwrap.attr("showdate", showdate);
                                }
                                /* 结束时间 */
                                var hidedate = view.$hidedate.val();
                                if (hidedate !== "") {
                                    $cropwrap.attr("hidedate", hidedate);
                                }
                                commons.layer.msg("保存成功");
                                commons.propertiesWindow.hide();
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
                                var $pimage = $selectedobj.parent(".cb-cropwrap");
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
                                commons.propertiesWindow.hide();
                                layer.close(index);
                            });
                        });
                    },
                    /* 收放按钮 */
                    opennerEvent: function() {
                        view.$pw.find(".cb-pw-openner").on("click", function() {
                            if (view.$pw.css("right") !== "0px") {
                                commons.propertiesWindow.show();
                            } else {
                                commons.propertiesWindow.hide("-345px");
                            }
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
                            commons.propertiesWindow.show();
                        });
                        view.btnsEvent();
                    },
                    customEvent: function() {
                        /* 事件:显示 */
                        view.$pw.on("propertiesWindow:show", function(event) {
                            commons.clean();
                            view.$pwallpanel.hide();
                            var $selectedobj = $(view.$pw.$selectedobj);
                            view.$pw.find(".pw-main .pw-header").text("<" + $selectedobj.prop("tagName") + ">");
                            view.$pw.find(".pw-main .cb-pills li:first").trigger("click", 0 || view.$pw.selectedindex);
                            view.$height.val(view.$pw.$selectedobj.css("height").replace(/px/, ""));
                            view.$width.val(view.$pw.$selectedobj.css("width").replace(/px/, ""));
                            var $cropwrap = $selectedobj.parents(".cb-cropwrap");
                            /* 默认值 */
                            var defaults = {
                                showdate: "",
                                hidedate: ""
                            };
                            /* 设定 */
                            view.$showdate.val($cropwrap.attr("showdate") || defaults.showdate);
                            view.$hidedate.val($cropwrap.attr("hidedate") || defaults.hidedate);
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
                    /* 公开方法 */
                    publicFunction: function() {
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
                    blockInit: function() {},
                    bindEvents: function() {
                        commons.objectCallFunction(view, "customEvent", "opennerEvent", "pillsEvent");
                    },
                    init: function() {
                        var vendors = [ /* 日期 */
                        "../../../../lib/My97DatePicker/WdatePicker.js", /* 颜色 */
                        "../../../../vendor/spectrum/spectrum.js", "../../../../vendor/spectrum/spectrum.css" ];
                        commons.loadFile(vendors);
                    },
                    struc: function() {
                        commons.objectCallFunction(view, "init", "domCache", "publicFunction", "bindEvents", "blockInit");
                    }
                };
                $.cbuilder.propertiesWindow.pwpicture = view;
            })();
        },
        struc: function() {
            $(document).ready(function() {
                commons.objectCallFunction(onceView, "propertiesWindow", "itemtools");
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