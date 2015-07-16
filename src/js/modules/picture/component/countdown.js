define(['jquery', 'componentutils'], function ($, utils) {
    var text = ["距离开始时间", "距离结束时间", "先开始后结束"];
    var value = ["0", "1", "2"];
    var html = '<select>';
    for (var i = 0; i < value.length; i++) {
        html += "<option value=\"" + value[i] + "\">" + text[i] + "</option>";
    }
    html += '</select>';

    var opts = {
        callback: function () {
            return html;
        }
    };
    html = utils.tempRow(opts);

    var exports = {
        html: html,
        init: function () {
            if ($(".temprow").length === 1) {
                $(".temprow").find("select").children("option").eq(0).prop("selected", "selected").trigger("click");
            }
        },
        show: function (el) {
            if (el !== undefined)
                if (el.attr('linkicon') !== undefined) {
                    $('.linkicon').prop("checked", "checked");
                }
        },
        save: function (el) {

        }
    };
    return exports;
});