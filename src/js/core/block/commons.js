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
    },
}
