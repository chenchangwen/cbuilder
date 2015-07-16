function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "countdown",
            text: '倒计时',
            onClick: function() {
                var countdown = '<div class="countdown" style="position:absolute">';
                countdown += '<span class="hours"></span>';
                countdown += '<span class="minutes"></span>';
                countdown += '<span class="seconds"></span>';
                countdown += '<div class="tempshow">';
                countdown += '<div>倒计时</div>';
                countdown += '</div>';
                countdown += '</div>';
                element.append(countdown);
            }
        }
    }
    return exports;
}