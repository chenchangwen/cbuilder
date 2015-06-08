define(['uikit!notify'], function (UI) {
    var exports = {
        uikit: {
            notify: function (option) {
                var defaultopt = {
                    message: '',
                    status: 'danger',
                    timeout: 800
                };
                var opt = $.extend({}, defaultopt, option);
                if (opt.status === 'success') {
                    opt.message = '<i class="uk-icon-check"></i>' + opt.message;
                } else {
                    opt.message = '<i class="uk-icon-warning"></i>' + opt.message;
                }
                UI.notify(opt);
            }
        }
    };
    return exports;
});