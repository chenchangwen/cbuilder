define(function () {
    var html = "<span>";
    html += '<input id="type0" value="youhui" type="radio" name="radio">';
    html += '<label for="type0">领取优惠券</label>';
    html += '</span>';
    html += '<span>';
    html += '<input id="type1" checked="checked" value="login" type="radio" name="radio">';
    html += '<label for="type1">登录</label>';
    html += '</span>';
    return html;
});
