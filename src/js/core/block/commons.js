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
    }
}
