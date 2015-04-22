require.config({
    paths: {
        link: "plugins/picture/component/link",
        button: "plugins/picture/component/button",
        regexp: "plugins/picture/component/regexp",
        countdown: "plugins/picture/component/countdown",
        componentutils: "plugins/picture/component/utils"
    }
});
define(["link", "button", "countdown"], function (ccwlink, ccwbutton, ccwcountdown) {
    var exports = {
        link: ccwlink,
        button: ccwbutton,
        countdown:ccwcountdown,
        show: function (el) {
            callFn('show',el);
        },
        save: function (el) {
            callFn('save',el);
        }
    };
    
    function callFn(fnname, el) {
        for (var pfn in exports) {
            if (pfn !== 'show' && pfn !== 'save') {
                var fn = exports[pfn][fnname];
                if (typeof (fn) == "function") {
                    fn(el);
                }
            }
        }
    }

    return exports;
});