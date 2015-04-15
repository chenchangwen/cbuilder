require.config({
    paths: {
        link: "component/link",
        button: "component/button",
        regexp: "component/regexp",
        countdown: "component/countdown",
        componentutils: "component/utils"
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