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
        toolbar: [ "test", "clean", "tab", "anchor", "preview", "picture", "sourcecode" ],
        tpl: {
            toolbar: "<div class='cb-toolbar'></div>",
            toolbar_button: "<div class='btn-wrap'><button class='btn btn-primary btn-sm {clsname}'>{name}</button></div>",
            body: "<div class='cb-body'></div>",
            body_item: "<div class='cb-item'><div class='cb-content'></div></div>",
            body_item_tool: "<div class='cb-tools'><div class='btn-wrap'></div></div>"
        }
    };
    var clsContainer = ".cb-container", clsToolbar = ".cb-toolbar", clsBody = ".cb-body", clsContent = ".cb-content", clsWrap = ".cb-item", clsTabwrap = ".cb-tabwrap", stroriginhtml = "originhtml", strcbuilder = "cbuilder", jsPath, rootPath;
    (function() {
        var scripts = document.querySelectorAll("script[src]");
        var currentScript = scripts[scripts.length - 1].src;
        var currentScriptChunks = currentScript.split("/");
        var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
        jsPath = currentScript.replace(currentScriptFile, "");
        rootPath = jsPath.replace(/cbuilder\/src\/js\//, "cbuilder/");
        if (jsPath.indexOf("src/js")) {
            rootPath = jsPath.replace(/\/src\/js/, "");
        }
    })();
    var commons = {
        /* 加载文件 */
        loadFile: function(srcarray) {
            for (var i = 0; i < srcarray.length; i++) {
                var vendor = $.cbuilder.path.root + srcarray[i];
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
     * 设置变量 将指定options转换为obj.$xxx的变量
     * --------通常转换为固定的元素id或一系列的类
     * @param1 {Object} Javascript简单对象
     * @param2 {String} 转换的字符串,号分割  如"a,b,c,d"
     * @param3 {String} 过滤字符串 
                        如:$("#mybutton1") 如果该参数为"my"
                        则:obj.$button1为转换的变量,否则为obj.$mybutton1
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
        removeImpos: function() {
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
        /* 正则 */
        regex: {
            url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
            number: /^[0-9]*[1-9][0-9]*$/
        },
        /* 格式化 */
        formatDate: function(date, format) {
            if (!date) return;
            if (!format) format = "yyyy-MM-dd";
            switch (typeof date) {
              case "string":
                date = new Date(date.replace(/-/, "/"));
                break;

              case "number":
                date = new Date(date);
                break;
            }
            if (!date instanceof Date) return;
            var dict = {
                yyyy: date.getFullYear(),
                M: date.getMonth() + 1,
                d: date.getDate(),
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds(),
                MM: ("" + (date.getMonth() + 101)).substr(1),
                dd: ("" + (date.getDate() + 100)).substr(1),
                HH: ("" + (date.getHours() + 100)).substr(1),
                mm: ("" + (date.getMinutes() + 100)).substr(1),
                ss: ("" + (date.getSeconds() + 100)).substr(1)
            };
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
                return dict[arguments[0]];
            });
        },
        dateTimePicker: {
            /* 减一天 */
            reduceOneDay: function(value) {
                var d = new Date(value);
                var t = d.getTime() - 1e3 * 60 * 60 * 24;
                var yesterday = new Date(t);
                return yesterday;
            },
            format: function(value) {
                if (value === "") {
                    return false;
                } else {
                    return commons.formatDate(value, "yyyy/MM/dd");
                }
            }
        },
        /* layer */
        layer: {
            msg: function(type, msg, $focuselement) {
                var info = "";
                switch (type) {
                  case "warning":
                    info = "保存失败";
                    break;

                  case "success":
                    info = "保存成功";
                    break;
                }
                if (msg) {
                    if (info !== "") info = info + ":" + msg; else {
                        info = msg;
                    }
                }
                layer.msg(info, {
                    time: 1500,
                    offset: "400px"
                });
                if (commons.judge.isJquery($focuselement)) {
                    $focuselement.focus();
                }
            }
        },
        /* jcrop*/
        jcrop: {
            load: function(obj, type) {
                if (typeof jcrop_api != "undefined") {
                    jcrop_api.release();
                    jcrop_api.animateTo([ 100, 100, 0, 0 ]);
                    $.cbuilder.areapos = {
                        w: 100,
                        h: 100,
                        x: 0,
                        y: 0
                    };
                } else {
                    obj.Jcrop({
                        onSelect: function(c) {
                            $.cbuilder.areapos = {
                                w: c.w,
                                h: c.h,
                                x: c.x,
                                y: c.y
                            };
                            $("#cb-area-width").val($.cbuilder.areapos.w);
                            $("#cb-area-height").val($.cbuilder.areapos.h);
                            $("#cb-area-marginleft").val($.cbuilder.areapos.x);
                            $("#cb-area-margintop").val($.cbuilder.areapos.y);
                        },
                        allowSelect: false
                    }, function() {
                        jcrop_api = this;
                        if (type === "edit") {
                            var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                            var left = $obj.position().left;
                            var top = $obj.position().top;
                            var w = $obj.width() + 4;
                            var h = $obj.height() + 4;
                            $obj.addClass("imgpos-active");
                            jcrop_api.setSelect([ left, top, left + w, top + h ]);
                        } else {
                            /* 默认:创建jcrop */
                            jcrop_api.animateTo([ 100, 100, 0, 0 ]);
                            $.cbuilder.areapos = {
                                w: 100,
                                h: 100,
                                x: 0,
                                y: 0
                            };
                        }
                    });
                }
            }
        },
        /* 判断 */
        judge: {
            isJquery: function(obj) {
                if (typeof obj !== "undefined") {
                    if (obj instanceof jQuery) {
                        return true;
                    }
                }
                return false;
            }
        }
    };
    var cbuilder = function(element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
    };
    /* 核心块 */
    var coreBlock = {
        /* 工具 */
        itemtools: function() {
            (function() {
                var templates = {
                    itemtools: '<div class="cb-itemtools" id="cb-itemtools"><i class="item-move" href="javascript:;"></i><i class="item-delete" href="javascript:;"></i></div>'
                };
                var view = {
                    clsitemtools: ".cb-itemtools",
                    domCache: function() {
                        var $body = $("body");
                        $body.append(templates.itemtools);
                        /* 全局 */
                        $.cbuilder.$itemtools = view.$itemtools = $("#cb-itemtools");
                        view.$contianer = $(".cb-container");
                        view.$itemdelete = $(".item-delete");
                    },
                    mouseEvent: function() {
                        view.$contianer.mouseover(function(e) {
                            var $target = $(e.target);
                            /* 没添加过则添加itemtools */
                            if ($(view.clsitemtools).length === 0) {
                                $("body").append(templates.itemtools);
                            }
                            /* jcrop 不存在时才作显示 */
                            if ($(".jcrop-holder").length === 0) {
                                /* cb-item */
                                var $content = $target.parents(clsContent);
                                if ($content.length > 0 || $target.hasClass("cb-content")) {
                                    view.append($content);
                                } else {
                                    var $parenttab = $target.parents(clsTabwrap);
                                    /* parent tabwrap */
                                    if ($parenttab.length > 0) {
                                        view.append($parenttab);
                                    } else {
                                        /* cb-tabwrap */
                                        if ($target.hasClass("cb-tabwrap")) {
                                            view.append($target);
                                        }
                                    }
                                }
                            }
                        });
                        view.$contianer.mouseout(function(e) {
                            var $target = $(e.target);
                            var $content = $target.parents(clsContent);
                            var $tabwrap = $target.parent(".cb-tabwrap");
                            if ($content.length === 0 || $tabwrap.length === 0) {
                                $.cbuilder.$itemtools.hide();
                            }
                        });
                    },
                    deleteBtnEvent: function() {
                        view.$contianer.delegate(".item-delete", "click", function() {
                            var that = $(this);
                            layer.confirm("确定删除该项?", {
                                icon: 3
                            }, function(index) {
                                layer.close(index);
                                var $parent = that.parents(clsWrap);
                                if ($parent.length > 0) {
                                    $parent.remove();
                                    return true;
                                }
                                $parent = that.parents(clsTabwrap);
                                if ($parent.length > 0) {
                                    $parent.remove();
                                }
                            });
                        });
                    },
                    append: function($obj) {
                        $obj.append($.cbuilder.$itemtools);
                        $.cbuilder.$itemtools.show();
                    },
                    bindEvents: function() {
                        view.mouseEvent();
                        view.deleteBtnEvent();
                    },
                    struc: function() {
                        $(document).ready(function() {
                            view.domCache();
                            view.bindEvents();
                        });
                    }
                };
                view.struc();
            })();
        },
        /* 属性窗口 */
        propertiesWindow: function() {
            /* htmlģ�� */
            var templates = {
                propertiesWindow: '<!-- 标题面板 --><div id="cb-title-panel"><div class="pw-header"></div><h3 class="cb-pills-title"></h3><hr class="cb-article-divider"></div><div class="cb-propertiesWindow"><div class="cb-pw-openner" id="pwopenner">&#x5C5E;<br>&#x6027;<br>&#x83DC;<br>&#x5355;<br></div><!-- 图片 --><div class="pw-picture pw-panel" id="pwpicture"><div class="pw-body"><div class="pw-body-content"><form class="form-horizontal"><h6 class="pw-body-content-header">&#x5C5E;&#x6027;</h6><div class="form-group"><label for="cb-picture-height" class="col-sm-2 control-label">height:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-height" placeholder="height"></div></div><div class="form-group"><label for="cb-picture-width" class="col-sm-2 control-label">width:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-width" placeholder="width"></div></div><h6 class="pw-body-content-header">&#x663E;&#x793A;&#x65F6;&#x95F4;</h6><div class="form-group"><label for="cb-picture-showdate" class="col-sm-2 control-label">&#x5F00;&#x59CB;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-showdate" placeholder="&#x5F00;&#x59CB;"></div></div><div class="form-group"><label for="cb-picture-hidedate" class="col-sm-2 control-label">&#x7ED3;&#x675F;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-hidedate" placeholder="&#x7ED3;&#x675F;"></div></div></form><hr class="cb-article-divider"></div><div class="pw-body-footer"><button type="button" class="btn btn-primary btn-sm save">&#x4FDD; &#x5B58;</button><button type="button" class="btn btn-danger btn-sm delete">&#x5220; &#x9664;</button><button type="button" id="cb-picture-addarea" class="btn btn-primary btn-sm">&#x65B0; &#x5EFA; &#x533A; &#x57DF;</button></div></div></div><!-- 区域 --><div class="pw-area pw-panel" id="pwarea"><div class="pw-body"><div class="pw-body-content"><h6 class="pw-body-content-header">&#x4F4D;&#x7F6E;</h6><form class="form-horizontal"><div class="form-group"><label for="cb-area-width" class="col-sm-2 control-label">width:</label><div class="col-sm-10"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-width" data-name="width" maxlength="4" placeholder="width"></div></div><div class="form-group"><label for="cb-area-height" class="col-sm-2 control-label">height:</label><div class="col-sm-10"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-height" data-name="height" maxlength="4" placeholder="height"></div></div><div class="form-group"><label for="cb-area-marginleft" class="col-sm-3 control-label">marginleft:</label><div class="col-sm-9"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-marginleft" data-name="left" maxlength="4" placeholder="marginleft"></div></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">margintop:</label><div class="col-sm-9"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-margintop" data-name="top" maxlength="4" placeholder="margintop"></div></div><hr class="cb-article-divider"><h6 class="pw-body-content-header">&#x7C7B;&#x578B;</h6><div class="pw-body-content-controls"><div id="cb-area-type"><label for="cb-area-type1"><input id="cb-area-type1" data-type="link" type="radio" name="areatype">&#x94FE;&#x63A5;</label><label for="cb-area-type2"><input id="cb-area-type2" data-type="anchor" type="radio" name="areatype">&#x951A;&#x70B9;</label><label for="cb-area-type3"><input id="cb-area-type3" data-type="countdown" type="radio" name="areatype">&#x5012;&#x8BA1;&#x65F6;</label><label for="cb-area-type4"><input id="cb-area-type4" data-type="coupon" type="radio" name="areatype">&#x4F18;&#x60E0;&#x5238;</label></div></div><div class="cb-area-type cb-area-type1 pw-controls-panel"><div class="form-group"><label for="cb-area-url" class="col-sm-3 control-label">&#x94FE;&#x63A5;&#x5730;&#x5740;:</label><div class="col-sm-9"><textarea type="text" class="form-control" rows="3" id="cb-area-url" placeholder="&#x94FE;&#x63A5;&#x5730;&#x5740;"></textarea></div></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">&#x6253;&#x5F00;&#x65B9;&#x5F0F;:</label><div class="col-sm-9"><label for="open-type1" class="radio-inline"><input id="open-type1" data-value="_blank" type="radio" name="opentype" checked="checked">&#x65B0;&#x5EFA;&#x7A97;&#x53E3;</label><label for="open-type2" class="radio-inline"><input id="open-type2" data-value="_self" type="radio" name="opentype">&#x5F53;&#x524D;&#x7A97;&#x53E3;</label></div></div></div><div class="cb-area-type cb-area-type2 pw-controls-panel"><select id="cb-area-anchor" class="form-control input-sm"></select></div><div class="cb-area-type cb-area-type3 pw-controls-panel"><div id="cb-area-fontdemo" class="cb-temp cb-area-fontdemo"></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">&#x5B57;&#x4F53;:</label><div class="col-sm-9"><select id="cb-area-fontfamily" class="form-control input-sm"><option value="&#x5B8B;&#x4F53;">&#x5B8B;&#x4F53;</option><option value="&#x6977;&#x4F53;">&#x6977;&#x4F53;</option><option value="&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;">&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;</option></select></div></div><div class="form-group"><label for="cb-area-fontsize" class="col-sm-3 control-label">&#x5B57;&#x4F53;&#x5927;&#x5C0F;:</label><div class="col-sm-9"><select id="cb-area-fontsize" class="form-control input-sm"></select></div></div><div class="form-group"><label for="cb-area-fontcolor" class="col-sm-3 control-label">&#x5B57;&#x4F53;&#x989C;&#x8272;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-fontcolor" placeholder="&#x5B57;&#x4F53;&#x989C;&#x8272;"></div></div><div class="form-group"><label for="cb-area-startdate" class="col-sm-3 control-label">&#x5F00;&#x59CB;&#x65F6;&#x95F4;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-startdate" placeholder="&#x5F00;&#x59CB;&#x65F6;&#x95F4;"></div></div><div class="form-group"><label for="cb-area-enddate" class="col-sm-3 control-label">&#x7ED3;&#x675F;&#x65F6;&#x95F4;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-enddate" placeholder="&#x7ED3;&#x675F;&#x65F6;&#x95F4;"></div></div><div class="form-group"><label for="cb-area-isdayunit" class="col-sm-3 control-label">&#x5929;&#x4E3A;&#x5355;&#x4F4D;:</label><div class="col-sm-9"><div class="checkbox"><label><input type="checkbox" id="cb-area-isdayunit"></label></div></div></div><div class="form-group"><label for="cb-area-enddate" class="col-sm-3 control-label">&#x65F6;&#x95F4;&#x683C;&#x5F0F;:</label><div class="col-sm-9"><select id="cb-area-format" class="form-control input-sm"><option value="cn">&#x65F6;:&#x5206;:&#x79D2;</option><option value="HH:mm:ss">HH:mm:ss</option></select></div></div></div><div class="cb-area-type cb-area-type4 pw-controls-panel"><div class="form-group"><label for="cb-area-url" class="col-sm-3 control-label">&#x4F18;&#x60E0;&#x5238;id</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-couponid" placeholder="&#x4F18;&#x60E0;&#x5238;id,&#x53F7;&#x5206;&#x5272;"></div></div></div></form></div><hr class="cb-article-divider"><div class="pw-body-footer"><div class="pw-body-footer"><button type="button" id="cb-area-save" class="btn btn-primary btn-sm">&#x4FDD; &#x5B58;</button><button type="button" id="cb-area-delete" class="btn btn-danger btn-sm delete">&#x5220; &#x9664;</button></div></div></div></div><!-- 锚点 --><div class="pw-anchor pw-panel" id="pwanchor"><div class="pw-body"><div class="pw-body-content"><form class="form-horizontal"><div class="form-group"><label for="cb-anchor-name" class="col-sm-2 control-label">&#x540D;&#x79F0;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-anchor-name" placeholder="&#x540D;&#x79F0;:"></div></div></form></div><hr class="cb-article-divider"><div class="pw-body-footer"><button type="button" id="cb-anchor-save" class="btn btn-primary btn-sm save">&#x4FDD; &#x5B58;</button><button type="button" id="cb-anchor-delete" class="btn btn-danger btn-sm delete deleteevent">&#x5220; &#x9664;</button></div></div></div><!-- tab --><div class="pw-tab pw-panel" id="pwtab"><div class="pw-body"><div class="pw-body-content"><form class="form-horizontal"><div class="form-group"><label for="cb-anchor-name" class="col-sm-2 control-label">&#x540D;&#x79F0;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-tab-name" placeholder="&#x540D;&#x79F0;:"></div></div></form></div><hr class="cb-article-divider"><div class="pw-body-footer"><button type="button" id="cb-tab-save" class="btn btn-primary btn-sm save">&#x4FDD; &#x5B58;</button><button type="button" id="cb-tab-delete" class="btn btn-danger btn-sm delete deleteevent">&#x5220; &#x9664;</button></div></div></div></div>',
                bodycontentheader: '<h1 class="pw-body-content-header">#value</h1>',
                hr: '<hr class="cb-article-divider">'
            };
            $("body").append(templates.propertiesWindow);
            $("#pwopenner").on("click", function() {
                var right = $.cbuilder.propertiesWindow.$self.css("right");
                if (right !== "0px" || right === "-330px") {
                    $.cbuilder.propertiesWindow.show();
                } else {
                    $.cbuilder.propertiesWindow.$temp.hide();
                    $.cbuilder.propertiesWindow.$self.css({
                        right: "-330px"
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
                    /* ɾ����ʱê�� */
                    var $tempanchor = $("#tempanchor");
                    if ($tempanchor) {
                        $tempanchor.removeAttr("id");
                    }
                    /* ��ʾ��ʱ��ʽ */
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
        },
        struc: function() {
            $(document).ready(function() {
                commons.objectCallFunction(coreBlock, "propertiesWindow", "itemtools");
            });
        }
    };
    coreBlock.struc();
    $.cbuilder = {
        path: {
            root: rootPath,
            js: jsPath
        },
        append: function(html, clstype) {
            var html2 = "";
            if (clstype === "tab") {
                html2 = '<div class="cb-tabwrap">' + html + "</div>";
            } else {
                html2 = '<div class="cb-item"><div class="cb-content">' + html + "</div></div>";
            }
            $.cbuilder.active.$element.find(clsBody).append(html2);
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
        setContent: function(html) {
            $.cbuilder.active.$element.find(".cb-body").html(html);
            $.cbuilder.active._trigger("cbuilder:onWrapContent");
            $.cbuilder.active._trigger("cbuilder:onContentReady");
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
                    var vendors = [ /* bootstrap */
                    "vendor/bootstrap/dist/css/bootstrap.min.css", "vendor/bootstrap/dist/css/bootstrap-theme.css", /* 弹出层 */
                    "vendor/layer/layer.js", "vendor/layer/skin/layer.css", /* 拖拽 */
                    "vendor/dragula.js/dist/dragula.js", "vendor/dragula.js/dist/dragula.min.css", /* 日期 */
                    "vendor/datetimepicker/jquery.datetimepicker.css", "vendor/datetimepicker/jquery.datetimepicker.js" ];
                    commons.loadFile(vendors);
                },
                /* 加载toolbar */
                loadToolbar: function() {
                    /* 校验点击 */
                    var checkOnClick = function() {
                        if ($(".jcrop-holder").length > 0) {
                            commons.layer.msg("", "请先保存区域");
                            return false;
                        } else {
                            return true;
                        }
                    };
                    var len = that.options.toolbar.length;
                    for (var i = 0; i < len; i++) {
                        var name = that.options.toolbar[i];
                        var src = $.cbuilder.path.js + "toolbar/" + name + "/" + "main" + ".js";
                        $.ajax({
                            async: false,
                            type: "get",
                            url: src,
                            success: function() {
                                /* 执行动态函数,并获取module对象 */
                                var module = init(that.$element, commons);
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
                                            if (checkOnClick()) {
                                                var defaults = {
                                                    type: 2,
                                                    title: module.toolbar.text,
                                                    shadeClose: true,
                                                    shade: .3,
                                                    skin: "layui-layer-rim",
                                                    //加上边框
                                                    area: [ width, height ],
                                                    content: $.cbuilder.path.js + "toolbar/" + module.toolbar.name + "/main.html"
                                                };
                                                var options = $.extend({}, defaults, module.options);
                                                layer.open(options);
                                            }
                                        }
                                        if (checkOnClick()) {
                                            that._trigger("", module.toolbar.onClick);
                                        }
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
                    //                    that.$element.on('cbuilder:onWrapContent', function (e) {
                    //                        /* 构建基本元素 */
                    //                        $cbbody.children(":not(" + clsWrap + ")").each(function () {
                    //                            var $this = $(this);
                    //                            /* 增加 cb-item div */
                    //                            $this.wrap(that.options.tpl.body_item);
                    //                            $.cbuilder.active = that;
                    //                        });
                    //                    });
                    /* 拖拽 */
                    that.$element.dragula = dragula([ $cbbody[0] ], {
                        moves: function(el, container, handle) {
                            return handle.className === "item-move";
                        }
                    });
                    $(".pw-body-footer").delegate(".deleteevent", "click", function(e) {
                        var tip = "确定删除&lt;" + $.cbuilder.propertiesWindow.$selectedobj.prop("tagName") + "&gt;?";
                        layer.confirm(tip, {
                            icon: 3
                        }, function(index) {
                            $.cbuilder.propertiesWindow.$selectedobj.parents(".cb-item").remove();
                            $.cbuilder.propertiesWindow.hide();
                            layer.close(index);
                        });
                    });
                    that.$element.delegate(".cb-content", "mouseover", function(event) {
                        $(this).addClass("cb-hover");
                    });
                    that.$element.delegate(".cb-content", "mouseout", function(event) {
                        $(this).removeClass("cb-hover");
                    });
                },
                /* 构建 */
                struc: function() {
                    commons.objectCallFunction(view, "init", "loadVendors", "loadToolbar", "appendHtml", "bindEvents", "triggerCustomEvent");
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