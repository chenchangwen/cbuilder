function init(element, basePath, commons) {
    var exports = {
        onLoaded: function() {
            var view = {
                init: function() {
                    var vendors = [
                        'lib/unslider/dist/css/unslider.css',
                        'lib/unslider/dist/css/unslider-dots.css',
                        'lib/unslider/dist/js/unslider-min.js'
                    ];
                    commons.loadFile(vendors);
                },
                _domCache: function() {
                    view.$pw = $('#pwunslider');
                },
                struc: function() {
                    if (typeof $.fn.unslider === "undefined") {
                        this.init();
                    }
                    this._domCache();
                }
            }
            view.struc();
        },
        toolbar: {
            name: "unslider",
            text: "Unslider插件",
            onClick: function() {
                var uid = 'unslider' + new Date().getTime();
                $.cbuilder.append(
                    '<div class="unslider" id="'+ uid +'">' +
                    '<ul>' +
                    '<li><img src=""></li>' +
                    '<li><img src=""></li>' +
                    '<li><img src=""></li>' +
                    '</ul>' +
                    '</div>'
                );
                $.cbuilder.propertiesWindow.$selectedobj = $("#" + uid);
                $.cbuilder.propertiesWindow.show({
                    name: 'pwunslider',
                    pillstitle: '绑定数据'
                });
            }
        }
    }
    return exports;
}