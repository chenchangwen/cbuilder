require(["../../global.config"], function () {
    require(["jquery", "uikit", "uikitextend", "uikit!upload"], function ($, UI, uikitextend) {

        var $width = $("#width"),
            $height = $("#height"),
            $url = $("#url");
        function save(imgsrc) {
            var pattern = /^[0-9]*[1-9][0-9]*$/;
            if ($width.val() !== "0") {
                if (!pattern.test($width.val())) {
                    uikitextend.uikit.notify({ message: "宽度:请输入正确的数字!" });
                    return false;
                }
                width = $width.val();
            }
            if ($height.val() !== "0") {
                if (!pattern.test($height.val())) {
                    uikitextend.uikit.notify({ message: "高度:请输入正确的数字!" });
                    return false;
                }
                height = $height.val();
            }
        }

        var plugin = {
            appendHtml: function () {
                var progressbar = $("#progressbar"),
                    bar = progressbar.find(".uk-progress-bar"),
                    settings = {
                        action: "/m.php?m=File&a=do_upload_img_2", // upload url
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
