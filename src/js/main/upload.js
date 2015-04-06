require(['../global.config'], function () {
    require(["jquery", 'uikit', 'uikitextend', 'uikit!upload'], function ($, UI, uikitextend) {
        var editor = parent.tinymce.activeEditor,
            editorimg = $(editor.selection.getNode()),
            $width = $("#width"),
            $height = $("#height"),
            $url = $("#url"),
            mcequery = parent.tinymce.dom.DomQuery;

        $(document).ready(function () {
            init();
            bindEvent();
        });

        function bindEvent() {
            $("#save").on("click", function () {
                save();
            });
        }
        function save(imgsrc) {
            var imgstr = "", style = "", tabindex = $(".uk-active").index();
            var width;
            var height;
            var cloneimg;
            if (tabindex == 1) {
                var pattern = /^[0-9]*[1-9][0-9]*$/;
                if ($width.val() != "0") {
                    if (!pattern.test($width.val())) {
                        uikitextend.uikit.notify({ message: "宽度:请输入正确的数字!" });
                        return false;
                    }
                    //style += " width='" + $width.val() + "'";
                    width = $width.val();
                }
                if ($height.val() != "0") {
                    if (!pattern.test($height.val())) {
                        uikitextend.uikit.notify({ message: "高度:请输入正确的数字!" });
                        return false;
                    }
                    //style += " height='" + $height.val() + "'";
                    height = $height.val();
                }
            }
            if (imgsrc == undefined) {
                imgsrc = $url.val();
            }
            if (editor.selection.getNode().tagName === "IMG") {
                cloneimg = mcequery(editor.selection.getNode());
                cloneimg.attr("src", imgsrc).attr("data-mce-src", imgsrc);
                cloneimg.attr("width", width || "");
                cloneimg.attr("height", height || "");
            } else {
                imgstr += " src=\"" + imgsrc + "\" data-mce-src=\"" + imgsrc + "\"";
                var str = "<img style=\"display:block\"" + imgstr + style + "/>";
                var contentp = "<p style=\"display:inline\" data-mce-style=\"display:inline\">" + str + "</p>";
                var el, insertnode;
                //如果当前编辑器没有选择任何焦点
                if (editor.selection.getSel() == null) {
                    parent.tinymce.editors[editor.fsindex].execCommand("mceInsertContent", false, contentp);
                } else {
                    var focusNode = editor.selection.getSel().focusNode;
                    var selectNode = editor.selection.getNode();
                    //如果是一个cropwrap
                    if (mcequery(selectNode).hasClass("cropwrap")) {
                        //在后面插入图片
                        el = editor.dom.create("p", { style: "display:inline" }, str);
                        if (selectNode.parentNode.tagName === "P") {
                            insertnode = selectNode.parentNode;
                        } else {
                            insertnode = editor.selection.getNode();
                        }
                        editor.dom.insertAfter(el, insertnode);
                    } else if (focusNode.tagName === "P" || selectNode.tagName === "P" || selectNode.tagName === "BODY") {
                        parent.tinymce.editors[editor.fsindex].execCommand("mceInsertContent", false, contentp);
                    }
                        //如果当前是一个P,并且没有图片,并且父亲是一个BODY
                    else if (focusNode.tagName === "P") {
                        if ($(focusNode).find("img").length <= 0) {
                            if (focusNode.parentNode.tagName === "BODY") {
                                editor.dom.remove(focusNode);
                                editor.selection.setContent(contentp);
                            }
                        } else {
                            //在后面插入图片
                            el = editor.dom.create("p", { style: "display:inline" }, str);
                            editor.dom.insertAfter(el, editor.selection.getNode());
                        }
                    }
                }
            }
            editor.windowManager.close();
        }

        function init() {
            var w = 0;
            var h = 0;
            if (editorimg[0].tagName == "IMG") {
                w = editorimg.width();
                h = editorimg.height();
            }
            $width.val(w);
            $height.val(h);
            $url.val(editorimg.attr("src"));
            buildupload();
        }

        function buildupload() {
            var progressbar = $("#progressbar"),
                bar = progressbar.find(".uk-progress-bar"),
                settings = {
                    action: "/m.php?m=File&a=do_upload_img_2", // upload url
                    //action : 'http://admin.ve.cn/m.php?m=File&a=do_upload_img_2',
                    allow: "*.(jpg|png)", // allow only images
                    loadstart: function () {
                        bar.css("width", "0%").text("0%");
                        progressbar.removeClass("uk-hidden");
                    },
                    progress: function (percent) {
                        percent = Math.ceil(percent);
                        bar.css("width", percent + "%").text(percent + "%");
                    },
                    allcomplete: function (response) {
                        response = JSON.parse(response);
                        if (response.status ==="1") {
                            bar.css("width", "100%").text("100%");
                            setTimeout(function () {
                                progressbar.addClass("uk-hidden");
                            }, 250);
                            save(response.msg);
                        } else {
                            uikitextend.uikit.notify({ message: response.msg || '上传失败!' });
                        }
                    }
                };
            var select = UI.uploadSelect($("#upload-select"), settings),
                drop = UI.uploadDrop($("#upload-drop"), settings);
        }
    });

});