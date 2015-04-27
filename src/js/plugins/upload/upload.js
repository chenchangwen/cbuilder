require(["../../global.config"], function () {
    require(["jquery", "uikit", "uikitextend", 'common/regexp',"uikit!upload"], function ($, UI, uikitextend, commomregexp) {
        var $width = $("#width"),
            $height = $("#height"),
            $url = $("#url");
        function save(imgsrc) {
            var regexp = new RegExp(commomregexp.number);
            var attr = '', width, height;
            if ($width.val() !== "0") {
                if (!regexp.test($width.val())) {
                    uikitextend.uikit.notify({ message: "宽度:请输入正确的数字!" });
                    return false;
                }
                width = $width.val() || "";
                if (width!=="")
                attr = ' width="' + width + '"';
            }
            if ($height.val() !== "0") {
                if (!regexp.test($height.val())) {
                    uikitextend.uikit.notify({ message: "高度:请输入正确的数字!" });
                    return false;
                }
                height = $height.val()|| "";
                if (height !== "")
                attr += ' height="' + height + '"';
            }
            regexp = new RegExp(commomregexp.url);
            if (!regexp.test($url.val())) {
                uikitextend.uikit.notify({ message: "地址:请输入正确的url地址!" });
                return false;
            }
            var img = '<img src ="' + $url.val() + '"  ' + attr + '></img>';

            parent.$.cbuilder.append(img);
            parent.$.fancybox.close();
        }

        var plugin = {
            appendHtml: function () {
                var progressbar = $("#progressbar"),
                    bar = progressbar.find(".uk-progress-bar"),
                    settings = {
                        action: "", // upload url
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
                            if (response.status === "1") {
                                bar.css("width", "100%").text("100%");
                                setTimeout(function () {
                                    progressbar.addClass("uk-hidden");
                                }, 250);
                                save(response.msg);
                            } else {
                                uikitextend.uikit.notify({ message: response.msg || "上传失败!" });
                            }
                        }
                    };
                UI.uploadSelect($("#upload-select"), settings),
                UI.uploadDrop($("#upload-drop"), settings);
            },
            bindEvents: function () {
                $("#save").on("click", function () {
                    save();
                });
            },
            struc: function () {
                this.appendHtml();
                this.bindEvents();
            }
        };

        $(document).ready(function () {
            plugin.struc();
        });

    });
});
