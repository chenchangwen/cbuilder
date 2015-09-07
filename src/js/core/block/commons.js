var commons= {
    loadFile: function(srcarray) {
        for (var i = 0; i < srcarray.length; i++) {
            var vendor = srcarray[i];
            if (vendor.indexOf('css') >= 0) {
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
    clean: function () {
        /* jcrop */
        if (typeof (jcrop_api) != "undefined") {
            jcrop_api.destroy();
            jcrop_api.release();
            delete jcrop_api;
        }
        /* 如果是激活的imgpos 则删除,因为此时保存 肯定会新建新的imgpos */
        if ($.cbuilder.$pw.$selectedobj.hasClass('imgpos-active')) {
            $.cbuilder.$pw.$selectedobj.remove();
        }
    },
    regex: {
        url: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    },
    layer: {
        msg: function(msg) {
            layer.msg(msg, {
                time: 2000,
                offset: '200px'
            });
        }
    }
}
