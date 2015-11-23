function init(element, basePath, commons) {
    var exports = {
        onLoaded: function() {
            var view = {
                loadPicker: function() {
                    var vendors = [
                        'lib/Picker/jquery.picker.min.js'
                    ];
                    commons.loadFile(vendors);
                },
                loadSlide: function() {
                    var vendors = [
                        'lib/SuperSlide/SuperSlide.css',
                        'lib/SuperSlide/jquery.SuperSlide.2.1.1.js'
                    ];
                    commons.loadFile(vendors);
                },
                struc: function() {
                    if (typeof $.fn.picker === "undefined") {
                        this.loadPicker();
                    }
                    if (typeof $.fn.slide === "undefined") {
                        this.loadSlide();
                    }
                }
            }
            view.struc();
        },
        toolbar: {
            name: "globalslide",
            text: "全屏轮播插件",
            onClick: function() {
                var uid = 'SuperSlide' + new Date().getTime();
                $.cbuilder.append(
                    '<div class="superslide" id="'+ uid +'">' +
                    '</div>'
                );
                $.cbuilder.propertiesWindow.$selectedobj = $("#" + uid);
                $.cbuilder.propertiesWindow.show({
                    name: 'pwSuperSlide',
                    pillstitle: '绑定数据'
                });
            }
        }
    }
    return exports;
}