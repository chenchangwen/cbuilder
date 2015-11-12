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
    var rootPath = currentScriptPath().replace(/src\/js/, "");
    var clsContainer = ".cb-container", clsToolbar = ".cb-toolbar", clsBody = ".cb-body", clsContent = ".cb-content", clsWrap = ".cb-item", stroriginhtml = "originhtml", strcbuilder = "cbuilder", basePath = currentScriptPath();
    var commons = {
        loadFile: function(srcarray) {
            for (var i = 0; i < srcarray.length; i++) {
                var vendor = rootPath + srcarray[i];
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
            if ($.cbuilder.propertiesWindow.$selectedobj.hasClass("imgpos-active")) {
                $.cbuilder.propertiesWindow.$selectedobj.remove();
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
            url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        },
        layer: {
            msg: function(msg) {
                layer.msg(msg, {
                    time: 1e3,
                    offset: "200px"
                });
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
                    "vendor/layer/layer.js", "vendor/layer/skin/layer.css", /* 拖拽 */
                    "vendor/dragula.js/dist/dragula.min.js", "vendor/dragula.js/dist/dragula.min.css", /* 菜单 */
                    "vendor/jQuery-contextMenu/src/jquery.contextMenu.js", "vendor/jQuery-contextMenu/src/jquery.contextMenu.css" ];
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
            /* htmlģ�� */
            var templates = {
                propertiesWindow: '<!-- 标题面板 --><div id="cb-title-panel"><div class="pw-header"></div><hr class="cb-article-divider"><ul class="cb-pills"><li class="cb-active"><a href="javascript:;" class="cb-pills-title"></a></li></ul><hr class="cb-article-divider"></div><div class="cb-propertiesWindow"><div class="cb-pw-openner" id="pwopenner">&#x5C5E;<br>&#x6027;<br>&#x83DC;<br>&#x5355;<br></div><!-- 图片 --><div class="pw-picture pw-panel" id="pwpicture"><div class="pw-body"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x5C5E;&#x6027;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">height:</td><td class="input"><input type="text" id="cb-main-height"></td></tr><tr><td class="text">width:</td><td class="input"><input type="text" id="cb-main-width"></td></tr></tbody></table><h1 class="pw-body-content-header">&#x663E;&#x793A;&#x65F6;&#x95F4;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">&#x5F00;&#x59CB;:</td><td class="input"><input type="text" id="cb-main-showdate" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', maxDate: \'#F{$dp.$D(\\\'cb-main-hidedate\\\')||\\\'2030-10-01\\\'}\' }) "></td></tr><tr><td class="text">&#x7ED3;&#x675F;:</td><td class="input"><input type="text" id="cb-main-hidedate" onfocus=" WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', minDate: \'#F{$dp.$D(\\\'cb-main-showdate\\\')}\', maxDate: \'2030-10-01\' }) "></td></tr></tbody></table><hr class="cb-article-divider"></div><div class="pw-body-footer"><button type="button" class="btn primary save">&#x4FDD; &#x5B58;</button><button type="button" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div><!-- 区域 --><div class="pw-area pw-panel" id="pwarea"><div class="pw-body"><div class="pw-body-content"><h1 class="pw-body-content-header">&#x4F4D;&#x7F6E;</h1><table class="pw-body-content-list"><tbody><tr><td class="text">width:</td><td class="input"><input id="cb-area-width" class="cb-area-croppos" data-name="width" maxlength="4" type="text"></td></tr><tr><td class="text">height:</td><td class="input"><input id="cb-area-height" class="cb-area-croppos" data-name="height" maxlength="4" type="text"></td></tr><tr><td class="text">margin-left:</td><td class="input"><input id="cb-area-marginleft" class="cb-area-croppos" data-name="left" maxlength="4" type="text"></td></tr><tr><td class="text">margin-top:</td><td class="input"><input id="cb-area-margintop" class="cb-area-croppos" data-name="top" maxlength="4" type="text"></td></tr></tbody></table><hr class="cb-article-divider"><h1 class="pw-body-content-header">&#x7C7B;&#x578B;</h1><div class="pw-body-content-controls"><div id="cb-area-type"><label for="cb-area-type1"><input id="cb-area-type1" data-type="link" type="radio" name="areatype">&#x94FE;&#x63A5;</label><label for="cb-area-type2"><input id="cb-area-type2" data-type="anchor" type="radio" name="areatype">&#x951A;&#x70B9;</label><label for="cb-area-type3"><input id="cb-area-type3" data-type="countdown" type="radio" name="areatype">&#x5012;&#x8BA1;&#x65F6;</label></div></div><div class="cb-area-type cb-area-type1 pw-controls-panel"><table class="pw-body-content-list"><tbody><tr><td class="text">&#x94FE;&#x63A5;&#x5730;&#x5740;:</td><td class="input"><textarea id="cb-area-url" rows="3" cols="30" style="width: 100%"></textarea></td></tr><tr><td class="text">&#x6253;&#x5F00;&#x65B9;&#x5F0F;:</td><td class="input"><label for="open-type1"><input id="open-type1" data-value="_blank" type="radio" name="opentype" checked="checked">&#x65B0;&#x5EFA;&#x7A97;&#x53E3;</label><label for="open-type2"><input id="open-type2" data-value="_self" type="radio" name="opentype">&#x5F53;&#x524D;&#x7A97;&#x53E3;</label></td></tr></tbody></table></div><div class="cb-area-type cb-area-type2 pw-controls-panel"><select id="cb-area-anchor"></select></div><div class="cb-area-type cb-area-type3 pw-controls-panel"><div id="cb-area-fontdemo" class="cb-temp cb-area-fontdemo">08&#x65F6;08&#x5206;08&#x79D2;</div><table class="pw-body-content-list"><tbody><!--<tr>--><!--<td class="input" colspan="2">--><!--<div id="cb-area-fontdemo">--><!--08时08分08秒--><!--</div>--><!--</td>--><!--</tr>--><tr><td class="text">&#x5B57;&#x4F53;:</td><td class="input"><select id="cb-area-fontfamily"><option value="&#x5B8B;&#x4F53;">&#x5B8B;&#x4F53;</option><option value="&#x6977;&#x4F53;">&#x6977;&#x4F53;</option><option value="&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;">&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;</option></select></td></tr><tr><td class="text">&#x5B57;&#x4F53;&#x5927;&#x5C0F;:</td><td class="input"><select id="cb-area-fontsize"></select></td></tr><tr><td class="text">&#x5B57;&#x4F53;&#x989C;&#x8272;:</td><td class="input"><input type="text" id="cb-area-fontcolor" style="display: none"></td></tr><tr><td class="text">&#x5F00;&#x59CB;&#x65F6;&#x95F4;:</td><td class="input"><input type="text" id="cb-area-startdate" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', maxDate: \'#F{$dp.$D(\\\'cb-area-enddate\\\')||\\\'2030-10-01\\\'}\' }) "></td></tr><tr><td class="text">&#x7ED3;&#x675F;&#x65F6;&#x95F4;:</td><td class="input"><input type="text" id="cb-area-enddate" onfocus=" WdatePicker({ dateFmt: \'yyyy-MM-dd HH:mm:ss\', minDate: \'#F{$dp.$D(\\\'cb-area-startdate\\\')}\', maxDate: \'2030-10-01\' }) "></td></tr><tr><td class="text">&#x662F;&#x5426;&#x5929;&#x4E3A;&#x5355;&#x4F4D;:</td><td class="input"><input type="checkbox" id="cb-area-isdayunit"></td></tr><tr><td class="text">&#x65F6;&#x95F4;&#x683C;&#x5F0F;:</td><td class="input"><select id="cb-area-format"><option value="cn">&#x65F6;:&#x5206;:&#x79D2;</option><option value="HH:mm:ss">HH:mm:ss</option></select></td></tr></tbody></table></div><hr class="cb-article-divider"></div><div class="pw-body-footer"><div class="pw-body-footer"><button type="button" id="cb-area-save" class="btn primary">&#x4FDD; &#x5B58;</button><button type="button" id="cb-area-delete" class="btn primary delete">&#x5220; &#x9664;</button></div></div></div></div></div>',
                bodycontentheader: '<h1 class="pw-body-content-header">#value</h1>',
                hr: '<hr class="cb-article-divider">'
            };
            $("body").append(templates.propertiesWindow);
            $("#pwopenner").on("click", function() {
                var right = $.cbuilder.propertiesWindow.$self.css("right");
                if (right !== "0px" || right === "-345px") {
                    $.cbuilder.propertiesWindow.show();
                } else {
                    $.cbuilder.propertiesWindow.$temp.hide();
                    $.cbuilder.propertiesWindow.$self.css({
                        right: "-345px"
                    });
                }
            });
            $.cbuilder.propertiesWindow = {
                /* ����$���� */
                $self: $("body").find(".cb-propertiesWindow"),
                $panel: $("body").find(".cb-propertiesWindow").find(".pw-panel"),
                $titlepanel: $("#cb-title-panel"),
                $temp: $("body").find(".cb-temp"),
                /* ��ѡ���Ķ��� */
                $selectedobj: "",
                /* ��ǰ���Դ��� */
                $currentpw: "",
                /* ��ʾ */
                show: function(options) {
                    /* ������� */
                    $.cbuilder.$itemtools.hide();
                    this.$temp.show();
                    if (options !== undefined) {
                        this.$currentpw = $("#" + options["name"]);
                        this.$self.find(".pw-panel").hide();
                        /* ����Ԫ��Title */
                        this.$titlepanel.find(".pw-header").text("<" + this.$selectedobj.prop("tagName") + ">");
                        this.$titlepanel.find(".cb-pills-title").text(options["pillstitle"]);
                        this.$currentpw.prepend(this.$titlepanel);
                        this.$currentpw.show();
                        this.$self.css({
                            right: "0px"
                        });
                        this.$currentpw.trigger("propertiesWindow:Showing");
                    } else {
                        this.$self.css({
                            right: "0px"
                        });
                    }
                },
                /* ���� */
                hide: function() {
                    $.cbuilder.propertiesWindow.$self.css({
                        right: "-385px"
                    });
                    this.$temp.hide();
                }
            };
            (function() {
                /* 图片窗口 */
                var view = {
                    /* dom缓存 */
                    _domCache: function() {
                        var str1 = "cb-main-height,cb-main-width,cb-main-showdate,cb-main-hidedate";
                        view.$pw = $("#pwpicture");
                        view.$pw.savebtn = view.$pw.find(".pw-body-footer .save");
                        view.$pw.deletebtn = view.$pw.find(".pw-body-footer .delete");
                        commons.setObjVariable(view, str1, "cb-main-");
                    },
                    /* 保存按钮 */
                    _saveBtnEvent: function() {
                        view.$pw.savebtn.on("click", function() {
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                            var $bodylist = view.$pw.find(".pw-body-content-list tr");
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
                            var $cropwrap = $selectedobj.parents(".cb-cropwrap");
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
                            $.cbuilder.propertiesWindow.hide();
                        });
                    },
                    /* 删除按钮 */
                    _deleteBtnEvent: function() {
                        view.$pw.deletebtn.on("click", function() {
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
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
                                $.cbuilder.propertiesWindow.hide();
                                layer.close(index);
                            });
                        });
                    },
                    /* 自定义 propertiesWindow:Showing 事件 */
                    _showingEvent: function() {
                        view.$pw.on("propertiesWindow:Showing", function(event) {
                            commons.clean();
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                            view.$height.val($selectedobj.css("height").replace(/px/, ""));
                            view.$width.val($selectedobj.css("width").replace(/px/, ""));
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
                    _bindEvents: function() {
                        commons.objectCallFunction(view, "_showingEvent", "_saveBtnEvent", "_deleteBtnEvent");
                    },
                    _init: function() {
                        var vendors = [ /* 日期 */
                        "lib/My97DatePicker/WdatePicker.js", /* 颜色 */
                        "vendor/spectrum/spectrum.js", "vendor/spectrum/spectrum.css" ];
                        commons.loadFile(vendors);
                    },
                    _struc: function() {
                        commons.objectCallFunction(view, "_init", "_domCache", "_bindEvents");
                    }
                };
                view._struc();
            })();
            (function() {
                var view = {
                    /* 类型 */
                    _typeEvent: function() {
                        view.$type.delegate("input", "click", function() {
                            var $this = $(this), inputid = $this.attr("id");
                            var type = view.selecteType = $this.data("type");
                            var controls = view.$pw.find(".pw-controls-panel");
                            var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                            var html = "";
                            /* 默认值 */
                            var defaults = {};
                            /* 隐藏所有controls */
                            controls.hide();
                            /* 匹配类型显示内容 */
                            switch (type) {
                              case "link":
                                defaults = {
                                    url: "",
                                    opentype: "_blank"
                                };
                                /* 设定 */
                                view.$url.val($obj.attr("href") || defaults.url);
                                $.cbuilder.active.$element.find('input[name="opentype"][data-value="' + ($obj.attr("target") || defaults.opentype) + '"]').trigger("click");
                                break;

                              case "anchor":
                                var $anchor = $.cbuilder.active.$element.find(clsContent).find(".cb-anchor");
                                var $areacnhor = view.$anchor;
                                if ($anchor.length === 0) {
                                    $areacnhor.html("<option>没有锚点</option>");
                                } else {
                                    $anchor.each(function() {
                                        var anchorid = $(this).attr("id");
                                        html += "<option value=" + anchorid + ">" + anchorid + "</option>";
                                    });
                                    $areacnhor.html(html);
                                    /* 设定 */
                                    if ($obj.attr("href")) {
                                        $areacnhor.find("option[value='" + $obj.attr("href").replace(/#/, "") + "']").prop("selected", "selected");
                                    }
                                }
                                break;

                              case "countdown":
                                /* 初始化字体大小 */
                                for (var i = 14; i < 40; i += 2) {
                                    html += '<option value="' + i + '">' + i + "px" + "</option>";
                                }
                                view.$fontsize.html(html);
                                /* 设定字体大小 */
                                if ($obj.prop("style").cssText.toString().match(/font-size/) !== null) {
                                    var fontsize = $obj.css("font-size");
                                    view.$fontsize.find("option[value=" + fontsize.replace(/px/, "") + "]").prop("selected", "selected");
                                    view.$fontdemo.css("font-size", fontsize);
                                }
                                view.$fontsize.trigger("change");
                                defaults = {
                                    color: "#000",
                                    startdate: "",
                                    enddate: "",
                                    isdayunit: "true",
                                    format: "cn"
                                };
                                /* 开始,结束 时间 */
                                view.$startdate.val($obj.attr("startdate") || defaults.startdate);
                                view.$enddate.val($obj.attr("enddate") || defaults.enddate);
                                /* 字体 */
                                if ($obj.prop("style").cssText.toString().match(/font-family/) !== null) {
                                    var fontfamily = $obj.css("font-family");
                                    view.$fontfamily.find('option[value="' + fontfamily + '"]').prop("selected", "selected");
                                    view.$fontdemo.css("font-family", fontfamily);
                                }
                                /* 字体颜色 */
                                view.$fontcolor.spectrum({
                                    showPalette: true,
                                    color: $obj.css("color") || defaults.color,
                                    showInput: true,
                                    preferredFormat: "hex",
                                    hideAfterPaletteSelect: true,
                                    clickoutFiresChange: true,
                                    showButtons: true,
                                    chooseText: "选择",
                                    cancelText: "取消",
                                    palette: [ [ "#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff" ], [ "#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f" ], [ "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc" ], [ "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd" ], [ "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0" ], [ "#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79" ], [ "#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47" ], [ "#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130" ] ],
                                    change: function(color) {
                                        view.$fontdemo.css("color", color.toHexString());
                                    }
                                });
                                /* 是否天为单位 */
                                var isday = false;
                                if (typeof $obj.attr("isdayunit") === "undefined") {
                                    isday = true;
                                } else if ($obj.attr("isdayunit") === "true") {
                                    isday = true;
                                } else {
                                    isday = "";
                                }
                                view.$isdayunit.prop("checked", isday);
                                view.$isdayunit.trigger("change");
                                /* 时间格式 */
                                view.$format.val($obj.attr("format") || defaults.format);
                                break;
                            }
                            /* 匹配当前id的controls 并显示panel*/
                            view.$pw.find(".pw-controls-panel[class*=" + inputid + "]").show();
                        });
                    },
                    /* 图片裁剪输入 */
                    _cropPosInputEvent: function() {
                        /* 防止非数字输入 */
                        view.$croppos.on("keypress", function(event) {
                            if (isNaN(String.fromCharCode(event.which))) {
                                event.preventDefault();
                            }
                        });
                        /* 数字输入则重新定位图片裁剪位置 */
                        view.$croppos.on("keyup", function(event) {
                            var keyCode = event.keyCode;
                            if (keyCode === 32) {
                                event.returnValue = false;
                            } else if (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105 || keyCode === 8 || keyCode === 46) {
                                event.returnValue = true;
                                setTimeout(function() {
                                    var w = parseInt(view.$width.val());
                                    var h = parseInt(view.$height.val());
                                    var x = parseInt(view.$marginleft.val());
                                    var y = parseInt(view.$margintop.val());
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
                    /* 显示事件 */
                    _showingEvent: function() {
                        /* 事件:编辑页显示 */
                        view.$pw.on("propertiesWindow:Showing", function() {
                            /* 设置坐标 */
                            view.$width.val($.cbuilder.areapos.w);
                            view.$height.val($.cbuilder.areapos.h);
                            view.$marginleft.val($.cbuilder.areapos.x);
                            view.$margintop.val($.cbuilder.areapos.y);
                            view.$pw.trigger("propertiesWindow:areaTypeShow");
                        });
                        /* 事件:显示类型 */
                        view.$pw.on("propertiesWindow:areaTypeShow", function() {
                            var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                            var linktype = $obj.attr("linktype");
                            if (linktype) {
                                view.$type.find("input[data-type=" + linktype + "]").trigger("click");
                            } else {
                                view.$type.find("input:eq(0)").trigger("click");
                            }
                        });
                        /* 事件:保存类型 */
                        view.$pw.on("propertiesWindow:areaTypeSave", function() {
                            /* 处理当前area */
                            var type = view.selecteType;
                            var areatypehtml = "";
                            /* 保存成功回调 */
                            var successcb;
                            /* 标签:默认为a */
                            var tagname = "a";
                            switch (type) {
                              case "link":
                                var url = $.trim(view.$url.val()).toString();
                                var opentype = $('input[name="opentype"]:checked').data("value");
                                if (!url.match(commons.regex.url)) {
                                    commons.layer.msg("保存失败:请输入正确的链接地址");
                                    return false;
                                }
                                areatypehtml += 'target="' + opentype + '"';
                                areatypehtml += 'href="' + url + '"';
                                break;

                              case "anchor":
                                var $anchor = $.cbuilder.active.$element.find(clsContent).find(".cb-anchor");
                                if ($anchor.length === 0) {
                                    commons.layer.msg("保存失败:请添加锚点");
                                    return false;
                                }
                                areatypehtml += 'href="#' + view.$anchor.val() + '"';
                                break;

                              case "countdown":
                                tagname = "div";
                                view.startdate = view.$startdate.val();
                                view.enddate = view.$enddate.val();
                                view.format = view.$format.val();
                                view.isdayunit = view.$isdayunit.prop("checked");
                                if (view.startdate === "") {
                                    commons.layer.msg("保存失败:请选择开始时间");
                                    return false;
                                } else if (view.enddate === "") {
                                    commons.layer.msg("保存失败:请选择结束时间");
                                    return false;
                                }
                                successcb = function() {
                                    var $imgpos = $("#tempimgpos");
                                    /* 字体,大小,颜色 */
                                    $imgpos.css("font-family", view.$fontfamily.val());
                                    $imgpos.css("font-size", view.$fontsize.val() + "px");
                                    $imgpos.css("color", view.$fontcolor.spectrum("get").toHexString());
                                    /* 开始,结束 时间 */
                                    $imgpos.attr("startdate", view.startdate);
                                    $imgpos.attr("enddate", view.enddate);
                                    /* 是否天为单位 */
                                    $imgpos.attr("isdayunit", view.isdayunit);
                                    /* 时间格式 */
                                    $imgpos.attr("format", view.format);
                                };
                            }
                            /* 全部正确保存类型 */
                            areatypehtml += ' linktype="' + type + '"';
                            /* 保存坐标位置 */
                            var width = $.cbuilder.areapos.w - 6;
                            var height = $.cbuilder.areapos.h - 6;
                            var left = $.cbuilder.areapos.x;
                            var top = $.cbuilder.areapos.y;
                            var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
                            var imgpos = "<" + tagname + ' class="imgpos" id="tempimgpos" style="' + position + '"  ' + areatypehtml + " ></" + tagname + ">";
                            /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
                            var $parent = $.cbuilder.propertiesWindow.$selectedobj.parent();
                            /* 全部正确插入imgpos */
                            $parent.append(imgpos);
                            if (typeof successcb === "function") {
                                successcb();
                            }
                            commons.clean();
                            layer.msg("保存成功", {
                                offset: "200px",
                                time: 1e3
                            });
                            $.cbuilder.propertiesWindow.hide();
                        });
                    },
                    /* 删除 */
                    _deleteBtnEvent: function() {
                        view.$delete.on("click", function() {
                            layer.confirm("确定删除<当前区域>?", {
                                icon: 3
                            }, function(index) {
                                commons.clean();
                                commons.propertiesWindow.hide();
                                layer.close(index);
                            });
                        });
                    },
                    /* 保存 */
                    _saveBtnEvent: function() {
                        view.$save.on("click", function() {
                            /* jcrop存在才执行保存或编辑 */
                            if (typeof jcrop_api != "undefined") {
                                view.$pw.trigger("propertiesWindow:areaTypeSave");
                            }
                        });
                    },
                    /* 倒计时 */
                    _countDownEvent: function() {
                        /* 字体 */
                        view.$fontfamily.change(function() {
                            view.$fontdemo.css("font-family", $(this).val());
                        });
                        /* 字体大小 */
                        view.$fontsize.change(function() {
                            view.$fontdemo.css("font-size", $(this).val() + "px");
                            view.$fontdemo.css("line-height", $(this).val() + "px");
                        });
                        /* 字体格式 */
                        var demoFontFormat = function() {
                            var isdayunit = view.$isdayunit.prop("checked");
                            var formatval = view.$format.val();
                            var text = "25HH01mm01ss";
                            if (formatval === "cn") {
                                text = text.replace(/HH/g, "时").replace(/mm/g, "分").replace(/ss/g, "秒");
                            } else if (formatval === "HH:mm:ss") {
                                text = text.replace(/HH/g, ":").replace(/mm/g, ":").replace(/ss/g, "");
                            }
                            if (isdayunit) {
                                text = text.replace(/25HH/g, "1天01时").replace(/25时/g, "1天01时").replace(/25:/g, "1天 01:");
                            }
                            view.$fontdemo.text(text);
                        };
                        /* 是否天为单位 */
                        view.$isdayunit.change(function() {
                            demoFontFormat();
                        });
                        /* 时间格式 */
                        view.$format.change(function() {
                            demoFontFormat();
                        });
                    },
                    _bindEvents: function() {
                        commons.objectCallFunction(view, "_cropPosInputEvent", "_saveBtnEvent", "_deleteBtnEvent", "_typeEvent", "_countDownEvent");
                    },
                    _domCache: function() {
                        var vmain = "cb-area-format,cb-area-type,cb-area-url,.cb-area-croppos," + "cb-area-width,cb-area-height,cb-area-marginleft," + "cb-area-margintop,cb-area-anchor,pw-area";
                        var vbtn = ",cb-area-save,cb-area-delete";
                        var vtypecountdown = ",cb-area-fontfamily,cb-area-fontsize,cb-area-fontdemo,cb-area-fontcolor,cb-area-startdate,cb-area-enddate,cb-area-isdayunit";
                        vmain += vbtn + vtypecountdown;
                        commons.setObjVariable(view, vmain, "cb-area-");
                        view.$pw = $("#pwarea");
                    },
                    _struc: function() {
                        commons.objectCallFunction(view, "_domCache", "_showingEvent", "_bindEvents");
                    }
                };
                view._struc();
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