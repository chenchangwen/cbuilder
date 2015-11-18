function init($element, basePath, commons) {
    var exports = {
        toolbar: {
            name: "tab",
            text: "tab容器",
            onClick: function () {
                var html = '';
                $.cbuilder.append(html, 'tab');
            }
        },
        onLoaded: function () {
            var view = {
                _domCache: function () {
                    commons.setObjVariable(view, 'cb-tab');
                },
                _onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                        if ($element.find('.cb-tabwrap').length > 0) {
//                            $element.dragula.destroy();
//                            $element.dragula= dragula([$element.find('.cb-body')[0], $element.find('.cb-tabwrap')[0]], {
//                                moves: function(el, container, handle) {
//                                    return handle.className === 'item-move';
//                                } 
//                            });
//                            $element.dragula.on('drag', function (el, source) {
//                                var $el = $(el);
//                                if ($el.parent().hasClass('cb-tabwrap')) {
//                                    console.log(123)
//                                    $('.gu-mirror').html(1111111111)
//                                }
//                            });
                        }
                    });
                    $element.delegate(".cb-tabwrap", "mouseover", function (event) {
                        $(this).addClass('cb-hover');
                    });

                    $element.delegate(".cb-tabwrap", "mouseout", function (event) {
                        $(this).removeClass('cb-hover');
                    });
                },
                struc: function () {
                    commons.objectCallFunction(view, '_domCache', '_onContentReadyEvent');
                }
            };
            view.struc();
        }
    }
    return exports;
}