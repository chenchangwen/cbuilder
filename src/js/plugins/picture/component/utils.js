define(function() {
    var exports= {
        tempRow: function (opts) {
            var html = "<div class=\"uk-form-row temprow extendrow\">";
            html += "<div class=\"uk-form-controls\">";
            if (opts.lable != undefined) {
                html += '<label class="uk-form-label">' + opts.lable + '</label>';
            }
            if (typeof opts.callback == "function") {
                html += opts.callback();
            }
            html += "</div>";
            html += "</div>";
            return html;
        }
    };
    return exports;
});