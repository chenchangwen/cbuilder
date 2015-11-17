function init(element, basePath, commons) {
    var exports = {
        onLoaded: function() {
            var view = {
                init: function() {
                    var vendors = [
                        //'vendor/jcrop/js/jquery.Jcrop.min.js',
                        'lib/Picker/libs/jquery.picker.min.js'
                    ];
                    commons.loadFile(vendors);
                },
                struc: function() {
                    if (typeof $.fn.Picker === "undefined") {
                        this.init();
                    }
                }
            }
            view.struc();
        },
        toolbar: {
            name: "picker",
            text: "Picker插件",
            onClick: function() {
                var $picker = $('#Picker');
                if (!$picker.length) {
                    $picker = $('<div class="modal fade" id="Picker"></div>');
                    $(document.body).append($picker);
                }
                $picker.picker('single_picture', {
                    title: '图片选择',
                    confirm_text: '确定',
                    cancel_text: '取消',
                    folder_method: 'post',
                    folder_url: '/service/image/getFolder',
                    image_method: 'post',
                    image_url: '/img',
                    rows: 10,
                    onComplete: function(selected) {
                        alert('You select: ' + JSON.stringify(selected));
                    }
                }).modal('show');
            }
        }
    }
    return exports;
}