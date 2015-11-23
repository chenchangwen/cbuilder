(function() {
    /* 图片窗口 */
    var view = {
        /* dom缓存 */
        _domCache: function() {
            var str1 = 'cb-unslider-picker';
            commons.setObjVariable(view, str1, 'cb-unslider-');
        },
        _build: function() {
            console.log(view);
            view.$picker.bind('click', function() {
                var $picker = $('#Picker');
                if (!$picker.length) {
                    $picker = $('<div class="modal fade" id="Picker"></div>');
                    $(document.body).append($picker);
                }
                console.log($picker);
                $picker = $picker.picker('multi_picture', {
                    title: '多图片选择',
                    confirm_text: '确定',
                    cancel_text: '取消',
                    folder_method: 'post',
                    folder_url: '/service/image/getFolder',
                    image_method: 'post',
                    image_url: '/service/image/getImages',
                    rows: 8,
                    onComplete: function(selected) {
                        var $slider = $.cbuilder.propertiesWindow.$selectedobj;
                        var $ul = $('<ul></ul>');
                        $slider.html('').append($ul);
                        for (var i = 0, l = selected.length; i < l; i++) {
                            $ul.append('<li><img src="' + selected[i].src + '" /></li>');
                        }
                        $slider.unslider({
                            speed: 500,               //  The speed to animate each slide (in milliseconds)
                            delay: 3000,
                            arrows: false,
                            fluid: true,
                            dots: true
                        });

                        $picker.modal('hide');
                    }
                });
                $picker.modal('show');
            });
        },
        _struc: function() {
            commons.objectCallFunction(view, '_domCache', '_build');
        }
    };
    view._struc();
})();