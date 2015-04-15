require(['../../global.config'], function () {
    require(['jquery', 'Jcrop', 'utils', 'component/all', 'uikitextend', '../../common/regexp', 'spin', '../../../../vendor/tinymce/tinymce.min'], function ($, Jcrop, utils, component, uikitextend, commomregexp,Spinner) {
        $(document).ready(function () {
            //变量声明
            //链接类型对象
            var linktype = {
                link: [],
                button: ["youhui", "login"],
                anchor: [],
                countdown: ["0", "1", "2", "3"]
//                countdown: ["距离开始时间", "距离结束时间", "时间循环", "先开始后结束"]
            };
            //带有$+变量名,均为jquery对象
            var editor = '',
                $content = $("#content"),
                $sidebar = $("#sidebar"),
                $link = $("#link"),
                $linktype = $("#linktype"),
                $linktarget = $("#linktarget"),
                $baritem1 = $("#baritem1"),
                $baritem2 = $("#baritem2"),
                $startdate = $("#startdate"),
                $enddate = $("#enddate"),
                $dayhours = $("#dayhours"),
                $trnsrc = $("#trnsrc"),
                $tblimg = $("#tblimg"),
                $body = $('body'),
                $floatbtn = $('#floatbtn'),
                //是否激活隐藏按钮
                isactivebtnhidden = true,
                $img,
                //图片位置
                imgpos,
                //当前图片的divwrap
                $cropwrap,
                //是否已经新建选择
                isnewselected = false,
                //是否有编辑的Note
                $editnote = null,
                $editmap = null,
                //cropwrap是否已经委托
                isdelegate = false,
                activeImage = parent.$.cbuilder.activeImage;
                
            var fontstyle = "";
            var offsetw = ($(document).width() < $("body").width() ? $(document).width() : $("body").width()),
                  offseth = (document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight);
            $(document).ready(function () {
                loadContent();
                init();
                $sidebar.css("transform", "translateX(-10px)");
            });

            //载入内容
            function loadContent() {
                
                $content.html(activeImage.prop('outerHTML'));
                $cropwrap = $(".cropwrap");

                var opts = {
                    lines: 13, // The number of lines to draw
                    length: 20, // The length of each line
                    width: 10, // The line thickness
                    radius: 30, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: '50%', // Top position relative to parent
                    left: '50%' // Left position relative to parent
                };
                spinner = new Spinner(opts).spin(document.body);
            }

            //重置宽高
            function reWidthHeight() {
                if (parseInt($sidebar.height()) > 523) {
                    $body.css("overflow-y", "scroll");
                }
            }

            //初始化
            function init() {
                $img = $("img");
                var src = $img.attr("src");
                //处理正确路径
                if (src[0] === ".") {
                    $img.attr("src", src.substr(1, src.length));
                    $img.attr("data-mce-src", src);
                }

                var picRealWidth, picRealHeight;
                $img.attr("src", $img.attr("src")).load(function () {
                    picRealWidth = this.width;
                    picRealHeight = this.height;
                    //以下w,h判断,控制宽高和决定是否当前页面是否应该出现滚动条
                    if (picRealHeight > offseth || $baritem1.height() > offseth) {
                        $body.css("overflow-y", "scroll");
                    }
                    if (picRealWidth > offsetw || $baritem1.width() > offsetw) {
                        $body.css("overflow-x", "scroll");
                    }
                    //将content设置为可视宽高
                    $content.css('width', offsetw).css('height', offseth);
                    $content.show();
                    spinner.stop();
                });

                format();
                sidebar.init();
                content.init();
                fixArea(true);
                renderTransitionPic();
                tinymce.init({
                    selector: "#mce1",
                    fontsize_formats: "20px 22px 24px 26px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px 50px",
                    theme: "modern",
                    width: "100%",
                    height: 50,
                    cleanup: true,
                    content_css: utils.tinymcepath + "ccweditor.css",
                    language: "zh_CN",
                    menu: [],
                    force_hex_style_colors: true,
                    plugins: "textcolor colorpicker textpattern",
                    toolbar: [
                        "fontselect fontsizeselect forecolor"
                    ],
                    relative_urls: false,
                    valid_elements: "*[*]",
                    setup: function (editor) {
                        editor.on("init", function (args) {
                            editor.setContent("<p><span style=\"" + fontstyle + "\" data-mce-style=\"" + fontstyle + "\">font-style</span></p>");
                            reWidthHeight();
                        });
                    }

                });
                fontstyle = $img.attr("fontstyle");
                if (fontstyle != undefined) {
                    fontstyle = $img.attr("fontstyle").replace(/\$\$/ig, ";");
                } else {
                    fontstyle = "";
                }
                //倒计时转换小时
                if ($img.attr("dayhours") === "true") {
                    $dayhours.prop("checked", "checked");
                }
            }

            //兼容解决: IE下href永远是最顶层
            function fixArea(isfix) {
                if (isfix) {
                    $("area").each(function () {
                        var $this = $(this);
                        var href = $this.attr("href");
                        var target = $this.attr("target");
                        if (typeof (target) != "undefined") {
                            href = "#" + target.replace(/#/ig, "");
                        }
                        $this.removeAttr("href");
                        $this.attr("ahref", href);
                    });
                } else {
                    $("area").each(function () {
                        var $this = $(this);
                        var href = $this.attr("ahref");
                        if (typeof (target) != "undefined") {
                            href = "#" + target.replace(/#/ig, "");
                        }
                        $this.removeAttr("ahref");
                        $this.attr("href", href);
                    });
                }

            }

            //获得临时行元素html
            function getTempRowHtml(callback, eltype, attr) {
                var html = "<div class=\"uk-form-row temprow \">";
                html += "<div class=\"uk-form-controls\">";
                if (typeof callback == "function") {
                    if (eltype == undefined) {
                        html += callback();
                    } else if (eltype == "select") {
                        attr = attr == undefined ? "" : attr;
                        html += "<select " + attr + ">" + callback() + "</select>";
                    }
                }
                html += "</div>";
                html += "</div>";
                return html;
            }

            //是否第一次处理链接目标
            var isfirstTargetHandle = true;
            //链接目标处理
            function targetHandle(obj, e) {
                var tagName = e.target.tagName;
                var html = "",
                    txt = $.trim(obj.text()),
                    str = linktype["button"][0],
                    value = "";
                value = $editnote.data('id');
                value = value == undefined ? "" : value;
                var linktargetvalue = obj.find("input[type='radio']:checked").val();

                //如果是第一次目标对象处理并且保存的值,或者重新选择的值等于'领取优惠券' 
                if (linktargetvalue === str) {
                    sidebar.temprow.remove();
                    html = getTempRowHtml(function () {
                        return "<input type=\"text\" placeholder=\"输入优惠券id,号分割,最多3个\" value=\"" + value + "\" style=\"width: 100%\">";
                    });
                    obj.parent().parent().after(html);
                }
                    //如果是登陆
                else if (linktargetvalue === linktype["button"][1]) {
                    sidebar.temprow.remove();
                }
                    //如果是倒计时
                else if (sidebar.linktype.getValue() == "countdown") {
                    if (tagName == "OPTION") {
                        var $temprow = $(".temprow");
                        //除了第一个临时行,其他删除
                        for (var i = $temprow.length - 1; i > 0; i--) {
                            if (i != 0) {
                                $temprow.eq(i).remove();
                            }
                        }

                        //循环时间input
                        var cycledate = getTempRowHtml(function () {
                            return "<input type=\"text\" class=\"cycledate\" disabled=\"disabled\" id=\"cycledate\" value=\"" + value + "\" style=\"width: 100%\">";
                        });

                        //如果链接目标是"时间循环"添加以下DOM
                        if (obj.val() == linktype["countdown"][2]) {
                            html = "";
                            html = getTempRowHtml(function () {
                                for (var i = 0; i <= 23; i++) {
                                    html += "<option value=\"" + i + "\">" + i + "</option>";
                                }
                                return html;
                            }, "select", "class=\"circulation\"");
                            $(".temprow:eq(1)").remove();
                            obj.parent().parent().parent().parent().after(html);
                            var $circulation = $(".circulation");
                            var $selectwrap = $circulation.parent();
                            //添加动态内容
                            $circulation.before("<lable class=\"uk-form-label\">小时</lable>");
                            $selectwrap.append("&nbsp;<a class=\"add uk-button uk-button-primary\">添加</a>");
                            $selectwrap.append("&nbsp;<a class=\"clear uk-button uk-button-danger\">清空</a>");
                            $selectwrap.parent().after(cycledate);
                            //绑定事件
                            $selectwrap.delegate("a", "click", function () {
                                var $this = $(this);
                                var $cycledate = $(".cycledate");
                                if ($this.text() == "添加") {
                                    var selecting = $circulation.children("option:selected").val();
                                    var selected = $cycledate.val().split(",");
                                    if (!utils.isCompareExist(selecting, selected)) {
                                        $cycledate.val($cycledate.val() + selecting + ",");
                                    } else {
                                        uikitextend.uikit.notify({ message: "该小时已经存在!" });
                                    }
                                } else {
                                    $cycledate.val("");
                                }
                            });
                        } else {
                            //其他链接目标添加"时间类型"
                            var countdowntype = getTempRowHtml(function () {
                                html += "<option value=\"hour\">时</option>";
                                html += "<option value=\"minute\">分</option>";
                                html += "<option value=\"second\">秒</option>";
                                return html;
                            }, "select", "class=\"countdowntype\" id=\"countdowntype\"");
                            obj.parent().parent().after(countdowntype);
                            //中文后缀
                            var cdsuffixischecked = "";
                            if ($editnote.attr("cdsuffix") == "false") {
                                cdsuffixischecked = "";
                            } else {
                                cdsuffixischecked = "checked=\"checked\"";
                            }
                            var cdsuffixhtml = "&nbsp;<label><input type=\"checkbox\"  " + cdsuffixischecked + " class=\"cdsuffix\"> 保留中文后缀</label>";
                            $("#countdowntype").after(cdsuffixhtml);

                            var $countdowntype = $(".countdowntype");
                            $countdowntype.before("<label class=\"uk-form-label\" for=\"countdowntype\">时间类型</label>");
                        }
                    }
                }
            }

            var trnpic = [], trndate = [];

            //渲染轮换图片
            function renderTransitionPic() {
                var html = "";
                //图片保存
                $("#picsave").on("click", function () {
                    //切换图片
                    var $selecthour = $tblimg.find("select option:selected");
                    trndate.length = 0;
                    trnpic.length = 0;
                    $selecthour.each(function () {
                        var $this = $(this);
                        if ($this.text() != "选择") {
                            trnpic.push($(this).parent().parent().prev().attr("src"));
                            trndate.push($(this).text());
                        }
                    });
                    if (trnpic.length >= 1) {
                        $img.attr("trnpic", trnpic.join(","));
                        $img.attr("trndate", trndate.join(","));
                    }
                    else {
                        $img.removeAttr("trndate");
                        $img.removeAttr("trnpic");
                    }

                    var tempfontstyle = fontstyle.split(";");
                    tempfontstyle.length = 3;
                    //字体
                    var fontfamily = $.trim($("#mceu_0-open").text());
                    var fontsize = $.trim($("#mceu_1-open").text());
                    var fontcolor = $("#mceu_2-preview").attr("style");
                    var font = "";
                    if (fontfamily == "字体") {
                        if (tempfontstyle[0] != undefined) {
                            font += (tempfontstyle[0] || "") + "$$";
                        } else {
                            font += "font-family:" + (tempfontstyle[0] || "") + "$$";
                        }
                    } else {
                        font += "font-family:" + fontfamily + "$$";
                    }
                    if (fontsize == "字号") {
                        if (tempfontstyle[1] != undefined) {
                            font += (tempfontstyle[1] || "") + "$$";
                        } else {
                            font += "font-size:" + (tempfontstyle[1] || "") + "$$";
                        }
                    } else {
                        font += "font-size:" + fontsize + "$$";
                    }
                    if (fontcolor == undefined) {
                        if (tempfontstyle[2] != undefined) {
                            font += (tempfontstyle[2] || "") + "$$";
                        } else {
                            font += "color:" + (tempfontstyle[2] || "") + "$$";
                        }
                    } else {
                        font += "color:" + $("#mceu_2-preview").css("background-color").colorHex() + "$$";
                    }
                    //保存时间
                    $img.attr("startdate", $startdate.val());
                    $img.attr("enddate", $enddate.val());
                    $img.attr("fontstyle", font);
                    //保存倒计时
                    if ($dayhours.prop("checked")) {
                        $img.attr("dayhours", "true");
                    } else {
                        $img.attr("dayhours", "false");
                    }
                    sidebar.show(0);

                });

                var maptrnpic = $img.attr("trnpic") == undefined ? "" : $img.attr("trnpic"), forpic, forpictxt;

                html = "";
                //如果没有图片
                if (editor.transitionPic == "") {
                    var obj = maptrnpic.split(",");
                    if (obj == "") {
                        html = "";
                    }
                    else {
                        for (i = 0; i < obj.length; i++) {
                            forpic = obj[i];
                            forpictxt = forpic.split("/");
                            html += "<li value=\"" + forpic + "\">" + "<a href=\"#\">" + forpictxt[forpictxt.length - 1] + "</a></li>";
                        }
                    }
                } else {
                    for (i = 0; i < editor.transitionPic.length; i++) {
                        forpic = editor.transitionPic[i];
                        forpictxt = forpic.split("/");
                        html += "<li value=\"" + forpic + "\">" + "<a href=\"#\">" + forpictxt[forpictxt.length - 1] + "</a></li>";
                    }
                }
                if (html === "") {
                    $("#trnsrctip").text("没有图片");
                    $trnsrc.remove();
                }
                else {
                    $trnsrc.html(html);
                    $("#wraptrnsrc").after("&nbsp;<a class=\"uk-button uk-button-danger\" id=\"trnsrcclear\">清空</a>");
                }

                $("#trnsrctip").on("click", function () {
                    return false;
                });

                var rendertbl = function (tblsrc) {
                    var html = "<select class=\"\">";
                    for (i = 0; i <= 23; i++) {
                        if (i === 0) {
                            html += "<option value=\"选择\">" + "选择" + "</option>";
                        }
                        html += "<option value=\"" + i + "\">" + i + "</option>";
                    }
                    html += "</select>";
                    var img = "<div class=\"uk-thumbnail uk-thumbnail-small tblimgwrap\">";
                    img += "<a class=\"delete\" href=\"#\">×</a>";
                    if (tblsrc[0] === ".") {
                        tblsrc = tblsrc.substr(1, tblsrc.length);
                    }
                    img += "<img src=\"" + tblsrc + "\" style=\"height:100px;width:100%\" >";
                    img += "<div class=\"uk-thumbnail-caption trnhour\">" + html + "点切换" + "</div>";
                    img += "</div>";
                    return img;
                }

                //切换图片清空
                $("#trnsrcclear").on("click", function () {
                    trnpic = [];
                    trndate = [];
                    $tblimg.html("");
                    //        $fxinput.val('');
                });

                //切换图片预览
                var getPreiviewHtml = function (src) {
                    var html = "<div class=\"uk-thumbnail uk-thumbnail-small trnsrcpreview\" style=\"position:absolute;left:120px;top:65px;opacity:0.8\">";
                    html += "<img src=\"" + src + "\" style=\"height:100px;width:100%\">";
                    html += "</div>";
                    return html;
                }

                $trnsrc.children("li").hover(
                  function () {
                      $("#wraptrnsrc").append(getPreiviewHtml($(this).attr("value")));
                  },
                  function () {
                      $(".trnsrcpreview").remove();
                  }
                );

                $trnsrc.delegate("li", "click", function () {
                    var src = rendertbl($(this).attr("value"));
                    $tblimg.append(src);
                    binddelegate();
                    reWidthHeight();
                });

                //载入已保存的当前图片设定
                var mpic = $img.attr("trnpic");
                if (typeof mpic != "undefined") {
                    mpic = mpic.split(",");
                    mdate = $img.attr("trndate").split(",");
                    for (var j = 0; j < mpic.length; j++) {
                        var src = rendertbl(mpic[j]);
                        $tblimg.append(src);
                        $tblimg.find("select").eq(j).val(mdate[j]);
                    }
                    binddelegate();
                }
            }

            function binddelegate() {
                var $trnhour = $(".trnhour"),
                    $tblimgwrap = $(".tblimgwrap");
                //时间选择委托
                //选择项委托
                $trnhour.delegate("select", "change", function () {
                    var $changethis = $(this);
                    var changeext = $changethis.find("option:selected").text();
                    //清空其他selecting
                    $trnhour.find(".selecting").removeClass("selecting");
                    //添加当前标示
                    $changethis.addClass("selecting");
                    var $hour = $trnhour.find("select[class=\"\"]");
                    // var $hour = $trnhour.find('select[class=""]:not(:hidden)');
                    var tip = "选择";
                    $hour.each(function () {
                        var val = $(this).find("option:selected").text();
                        if (val !== tip && val === changeext) {
                            uikitextend.uikit.notify({ message: "该小时已经存在,请重新选择!" });
                            $changethis.val(tip);
                            return;
                        }
                    });
                });
                //删除委托
                $tblimgwrap.delegate("a", "click", function () {
                    var $this = $(this);
                    $trnhour.undelegate("change");
                    $tblimgwrap.undelegate("click");
                    $this.parent().remove();
                    //重新委托
                    binddelegate();
                });
            }

            //格式化
            function format() {
                //img 如果没有被div包住,则让cropwrap包住,并在里面增加map元素
                if ($img.parent().attr("class") != "cropwrap") {
                    $img.wrap("<div class=\"cropwrap\"  style=\"position:relative\"></div>");
                    $cropwrap = $(".cropwrap");
                }
                if (!isdelegate) {
                    //双击编辑
                    $cropwrap.delegate(".imgpos", "dblclick", function (e) {
                        e.stopPropagation();
                        //移除全选范围(避免chrome双击会全选)
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                        //如果当前状态为"选择了"则返回
                        if (isnewselected) {
                            return false;
                        }
                        $editnote = $(this);
                        //编辑状态有可能会错误(因此需重新设置)
                        var pos = $editnote.position();
                        imgpos = {
                            w: $editnote.width() + 6,
                            h: $editnote.height() + 6,
                            x: pos.left,
                            y: pos.top
                        };

                        sidebar.show();
                        loadJcrop($editnote);
                    });
                    isdelegate = true;
                }
                //        setDate();
            }

            //清理,移除重复
            function clean() {
                var $imgpos = $(".imgpos");
                var $lastimgpost = $imgpos.last();
                for (var i = 0; i < $imgpos.length - 1; i++) {
                    if ($lastimgpost.attr("style") == $imgpos.eq(i).attr("style")) {
                        //删除重复热点div
                        $lastimgpost.remove();
                        //删除对应area
                        $img.children().eq(i).remove();
                        break;
                    }
                }
            }

            //调整滚动位置
            function reScroll() {
                if ($(window).scrollTop() > 100) {
                    $("html body").animate({ scrollTop: 0 }, 200);
                }
            }

            //载入jcrop
            function loadJcrop(obj) {
                isnewselected = true;
                if (typeof (jcrop_api) != "undefined") {
                    jcrop_api.release();
                    jcrop_api.animateTo([100, 100, 0, 0]);
                    imgpos = {
                        w: 100,
                        h: 100,
                        x: 0,
                        y: 0
                    };
                } else {
                    //修正bug jcrop animateTo方法时, 如果x,y不为0,会造成1px不准确的x,y的bug
                    //根据"原始宽高"与"jcrop宽高"对比来修正.
                    $img.Jcrop({
                        onSelect: function (c) {
                            //console.log('选择后');
                            var $jcropfirst = $(".jcrop-holder").children("div:first");
                            var jcrophheigth = parseInt($jcropfirst.css("height").replace(/px/ig, ""));
                            var jcrophwidth = parseInt($jcropfirst.css("width").replace(/px/ig, ""));
                            //原始宽高定义, 修正jcrop 1px的bug
                            orignwidth = c.w;
                            orginheight = c.h;
                            //jcrop宽高与原始宽高对比, 处理jcrop 1px的bug
                            if (jcrophwidth < orignwidth) {
                                jcrophwidth = jcrophwidth + (orignwidth - jcrophwidth);
                            }
                            if (jcrophheigth < orginheight) {
                                jcrophheigth = jcrophheigth + (orginheight - jcrophheigth);
                            }
                            //console.log('处理后:  jcrophwidth:' + jcrophwidth + ' jcrophheigth:' + jcrophheigth);
                            imgpos = {
                                w: jcrophwidth,
                                h: jcrophheigth,
                                x: c.x,
                                y: c.y
                            };
                            sidebar.setSize();
                        },
                        allowSelect: false
                    }, function () {
                        jcrop_api = this;
                        if (obj != undefined) {
                            var w = obj.width() + 6;
                            var h = obj.height() + 6;
                            obj.css({
                                'border': "2px dashed red"
                            });
                            var left = obj.position().left;
                            var top = obj.position().top;
                            //console.log('选择时');
                            //console.log('orignwidth:' + orignwidth + ' orginheight:' + orginheight);
                            //console.log(imgpos);
                            //console.log('width:' + (w + left) + " height:" + (h +top )+ ' left:' + left + ' top:' + top);
                            jcrop_api.animateTo([w + left, h + top, left, top]);
                        } else {
                            jcrop_api.animateTo([100, 100, 0, 0]);
                            imgpos = {
                                w: 100,
                                h: 100,
                                x: 0,
                                y: 0
                            };
                        }
                    });
                }
            }

            var content = {
                init: function () {
                    $content.on("click", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if ($(e.target).css("cursor") === "move" || $(e.target).css("cursor").indexOf("resize") >= 0) {
                            return false;
                        }
                        var valid = sidebar.validCheck();
                        if (valid === 1) {
                            $("#savehotlink").trigger("click");
                        }
                        if (valid === 2) {
                            $("#picsave").trigger("click");
                        }
                    });

                    $(".sizewidth").on("keydown", function (e) {
                        if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    //sidebar.loadDate();

                    $('.imgpos').on("click", function (e) {
                        if (e.target.tagName === 'A') {
                            e.preventDefault();
                        }
                    });
                }
            };


            //sidebar对象
            var sidebar = {
                //显示
                show: function (barindex) {
                    if (barindex != undefined) {
                        $('.baritem').hide().eq(barindex).show();
                        if (isactivebtnhidden) {
                            $sidebar.css("transform", "translateX(100%)");
                            $floatbtn.css({ "transform": "rotate(0deg)", 'visibility': 'visible' });

                        }
                        else {
                            $sidebar.css("transform", "translateX(-10px)");
                            $floatbtn.css({ 'transform': 'rotate(720deg)', 'visibility': 'hidden' });
                        }
                        isactivebtnhidden = !isactivebtnhidden;
                        return false;
                    }
                    $baritem2.show();
                    $baritem1.hide();

                    $floatbtn.css({ "transform": "rotate(720deg)", 'visibility': 'hidden' });
                    isactivebtnhidden = true;

                    sidebar.temprow.remove();
                    $link.val($editnote.attr("href"));
                    $linktype.find("option[value='" + $editnote.attr("linktype") + "']").prop("selected", "selected").trigger("change");
                    $linktarget.find('input[value=' + $editnote.attr("target") + ']').prop("checked", "checked").trigger("click");
                    //锚点/倒计时
                    $linktarget.find("option[value='" + $editnote.attr("target") + "']").prop("selected", "selected").trigger("click");
                    //时间类型
                    $("#countdowntype").find("option[value='" + $editnote.attr("datetype") + "']").prop("selected", "selected");
                    $sidebar.css("transform", "translateX(-10px)");
                    //设置宽高
                    this.setSize();
                    isfirstTargetHandle = false;
                    component.show($editnote);
                },
                //隐藏
                hide: function (pararm) {
                    $link.val("");
                    //类型默认选择第一个
                    $linktype.children("option").eq(0).prop("selected", "selected").trigger("click");
                    $sidebar.css("transform", "translateX(100%)");
                    $floatbtn.css({ "transform": "rotate(0deg)", 'visibility': 'visible' });
                    isactivebtnhidden = false;
                    var msg = '保存成功!';
                    if (pararm === 'delete') {
                        msg = '删除成功!';
                    }
                    uikitextend.uikit.notify({ message: msg, status: 'success' });
                    component.save($cropwrap.children('.imgpos').last());
                },
                //临时行
                temprow: {
                    remove: function () {
                        $(".temprow").remove();
                    }
                },
                //链接类型
                linktype: {
                    getValue: function () {
                        return $linktype.find("option:selected").val();
                    }
                },
                //验证
                validCheck: function () {
                    if ($editnote != null) {
                        if ($linktarget.text() === '没有锚点') {
                            uikitextend.uikit.notify({ message: "没有锚点,保存失败!" });
                            return false;
                        }
                        else
                            if ($baritem1.is(":hidden")) {
                                var re = new RegExp(commomregexp.url, "ig");
                                if ($linktype.val() == 'link') {
                                    if (!re.test($link.val())) {
                                        uikitextend.uikit.notify({ message: "请输入正确的链接地址!" });
                                        return false;
                                    }
                                }
                                return 1;
                            } else {
                                return 2;
                            }
                    }
                    return 3;
                },

                //初始化
                init: function () {
                    $(".btnhidden").on("click", function () {
                        if (typeof (jcrop_api) != "undefined") {
                            sidebar.show(1);
                        } else {
                            sidebar.show(0);
                        }
                    });

                    $("#btnbar").delegate('li', 'click', function () {
                        var $this = $(this);
                        var index = $this.index();
                        if (index === 0) {
                            sidebar.show(1);
                            $("#addhotlink").trigger('click');
                        }
                        else if (index === 1) {
                            isactivebtnhidden = false;
                            sidebar.show(0);
                        }
                        else if (index === 2) {
                            var valid = sidebar.validCheck();
                            if (valid === false) {
                                return false;
                            }
                            $("#save").trigger('click');
                            editor.windowManager.close();
                            //如果父存在DIV,即不是第一次编辑,则删除.
                            if (editor.selection.getNode().parentNode.tagName === "DIV") {
                                editor.dom.remove(editor.selection.getNode().parentNode);
                            }
                            editor.selection.setContent($content.html());
                        }
                        else if (index === 3) {
                            editor.windowManager.close();
                        }
                    });

                    $("#apply").on("click", function () {
                        var w = parseInt($("#width").val());
                        var h = parseInt($("#height").val());
                        var x = parseInt($("#marginleft").val());
                        var y = parseInt($("#margintop").val());
                        if (typeof (jcrop_api) != "undefined") {
                            jcrop_api.animateTo([w + x, h + y, x, y]);
                            imgpos = {
                                w: w,
                                h: h,
                                x: x,
                                y: y
                            };
                        }
                    });

//                    $("#close").on("click", function () {
//                        if (typeof (jcrop_api) != "undefined") {
//                            jcrop_api.release();
//                            jcrop_api.destroy();
//                            delete jcrop_api;
//                            $editnote.css("border", "2px solid blue");
//                            $editnote = null;
//                            isnewselected = false;
////                            sidebar.hide();
//                        }
//                    });

                    $("#addhotlink").on("click", function () {
                        if (typeof (jcrop_api) != "undefined") {
                            jcrop_api.release();
                            jcrop_api.destroy();
                            delete jcrop_api;
                            $editnote.css("border", "2px solid blue");
                            $editnote = null;
                            isnewselected = false;
                        }
                        loadJcrop();
                        reScroll();
                        $("#savehotlink").trigger("click");
                        $(".imgpos:last").trigger("dblclick");
                    });

                    //保存热点
                    $("#savehotlink").on("click", function () {
                        var valid = sidebar.validCheck();
                        if (valid === false) {
                            return false;
                        }
                        //保存时
                        //1.将jcrop对象销毁
                        //2.jcrop_api全局变量删除
                        if (typeof (jcrop_api) != "undefined") {
                            jcrop_api.destroy();
                            delete jcrop_api;
                        } else {
                            return false;
                        }
                        format();
                        //清理
                        clean();
                        //添加dom
                        $cropwrap.append(sidebar.node.get());

                        isnewselected = false;

                        //删除Note
                        sidebar.node.remove();
                        $img.css("border", "0").css('width', '').css('height', '');
                        fixArea(true);
                        isfirstTargetHandle = true;
                    });

                    $("#delete").on("click", function () {
                        sidebar.node.remove('delete');
                        if (typeof (jcrop_api) != "undefined") {
                            jcrop_api.destroy();
                            delete jcrop_api;
                            isnewselected = false;
                        }
                    });

                    $("#save").on("click", function () {
                        //保存关闭时,执行保存热点
                        $("#picsave").trigger("click");
                        $("#savehotlink").trigger("click");
                        fixArea(false);
                    });

                    $("#closesidebar").on("click", function () {
                        $("#savehotlink").trigger("click");
                    });

                    //链接类型点击事件 兼容chrome
                    $linktype.change(function () {
                        //先删除临时行

                        sidebar.temprow.remove();
                        var $this = $(this),
                            linkvalue = linktype[$this.val()],
                            html = "",
                            linkval = $this.val();
                        //如果相等则禁止输入地址
                        if (linkval == "button" || linkval == "anchor" || linkval == "countdown") {
                            $("#linkwrap").hide();
                        } else {
                            $("#linkwrap").show();
                        }

                        //如果是锚点(读取并生成锚点)
                        if (linkval == "anchor") {
                            //锚点只读第一个编辑器的
                            var editor1 = parent.tinymce.editors[0];
                            var $anchor = $(editor1.getBody()).find(".tempanchor");
                            var len = $anchor.length;
                            if (len > 0) {
                                html = getTempRowHtml(function () {
                                    $anchor.each(function () {
                                        var id = $(this).attr("id");
                                        html += "<option value=\"" + id + "\">" + id + "</option>";
                                    });
                                    return html;
                                }, "select");
                            } else {
                                html = getTempRowHtml(function () {
                                    return "<div class=\"uk-alert\">没有锚点</div>";
                                });
                            }
                        }
                        else {
                            if (linkval === 'link') {
                                html = component.link;
                                if ($link.val() === '') {
                                    $link.val('http://');
                                }
                            } else if (linkval === 'button') {
                                html = component.button;
                            } else if (linkval === 'countdown') {
                                html = component.countdown;
                            }
                        }
                        if ($.isPlainObject(html)) {
                            $linktarget.html(html.html);
                            html.init();
                        } else {
                            $linktarget.html(html);
                        }
                    });

                    //链接目标点击事件
                    $linktarget.delegate("select:first", "click", function (e) {
                        targetHandle($(this), e);
                    });

                    $linktarget.delegate("span", "click", function (e) {
                        targetHandle($(this), e);
                    });

                    this.loadDate();
                },

                //加载时间
                loadDate: function () {
                    var startdate = $img.attr("startdate");
                    var enddate = $img.attr("enddate");
                    $startdate.val(startdate);
                    $enddate.val(enddate);
                },

                setSize: function () {
                    $("#width").val(imgpos.w);
                    $("#height").val(imgpos.h);
                    $("#marginleft").val(imgpos.x);
                    $("#margintop").val(imgpos.y);
                },
                //便条区域
                node: {
                    get: function () {
                        var width = (imgpos.w - 6);
                        var height = (imgpos.h - 6);
                        var left = imgpos.x;
                        var top = imgpos.y;
                        var linktarget = $linktarget.find("input[type='radio']:checked").val();
                        var linkvalue = $linktarget.find("select:first").find("option:selected").val();
                        var linktype = sidebar.linktype.getValue();
                        var wraptag = linktype === 'countdown' ? 'div' : 'a';
                        var imgposposition = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + (imgpos.h - 6) + "px;";
                        var html =
                            "<" + wraptag + " contenteditable=\"false\" class=\"imgpos\" style=\"position:absolute;border:2px solid blue;" + imgposposition + "\"";

                        if (linktype === 'link') {
                            html += " href=\"" + $link.val() + "\"";
                        }

                        if (linktype === 'button') {
                            if (linktarget === 'youhui') {
                                html += 'data-id="' + $('.temprow').find('input').val() + '"';
                            }
                        }

                        if (linktype === 'anchor') {
                            html += " href=\"#" + linkvalue + "\"";
                        }
                        if (linktype === "countdown") {
                            html += "datetype=\"" + $("#countdowntype").val() + "\"";
                            if ($(".cycledate").val() != undefined) {
                                html += "data-id=\"" + $(".cycledate").val() + "\"";
                            }
                        }
                        html += " linktype=\"" + linktype + "\"";
                        if (linktype !== 'anchor') {
                            if (linktype === 'countdown') {
                                html += " target=\"" + linkvalue + "\"";
                            }
                            else
                                html += " target=\"" + linktarget + "\"";
                        }
                        if ($("#countdowntype").val() != undefined) {
                            //中文后缀
                            if ($(".cdsuffix").prop("checked")) {
                                html += " cdsuffix=\"true\"";
                            } else {
                                html += " cdsuffix=\"false\"";
                            }
                            html += " datetype=\"" + $("#countdowntype").val() + "\"";
                        }
                        var centerleft = utils.accDiv(width, 2) - 45;
                        var centertop = utils.accDiv(height, 2) - 45;
                        var tipchildstyle = "left:" + centerleft + 'px;top:' + centertop + 'px;';
                        html += ">";
                        if (linktype === 'link') {
                            html += '<b style="' + tipchildstyle + '"></b>';
                        }
                        html += "</" + wraptag + ">";
                        return html;
                    },
                    getIndex: function () {
                        var $imgpos = $(".imgpos");
                        for (var i = 0; i < $imgpos.length; i++) {
                            if ($editnote.attr("style") == $imgpos.eq(i).attr("style")) {
                                return i;
                            }
                        }
                        return 0;
                    },
                    remove: function (pararm) {
                        //如果编辑对象不为null,则删除当前编辑的对象
                        if ($editnote != null) {
                            $editnote.remove();
                            $editnote = null;
                            //移除对应map
                            if ($editmap != null)
                                $editmap.remove();
                            if (typeof (jcrop_api) != "undefined") {
                                jcrop_api.destroy();
                            }
                            isnewselected = false;
                            sidebar.hide(pararm);
                        }
                    }
                }
            };
        });
    });
});