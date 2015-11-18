(function () {
    ~~include("../../tpl/itemtools.js");
    var view = {
        clsitemtools: '.cb-itemtools',
        domCache: function () {
            var $body = $("body");
            $body.append(templates.itemtools);
            /* 全局 */
            $.cbuilder.$itemtools = view.$itemtools = $('#cb-itemtools');
            view.$contianer = $(".cb-container");
            view.$itemdelete = $(".item-delete");
        },
        mouseEvent: function () {
            view.$contianer.mouseover(function (e) {
                var $target = $(e.target);
                /* 没添加过则添加itemtools */
                if ($(view.clsitemtools).length === 0) {
                    $("body").append(templates.itemtools);
                }
                /* jcrop 不存在时才作显示 */
                if ($(".jcrop-holder").length === 0) {
                    /* cb-item */
                    var $content = $target.parents(clsContent);
                    if ($content.length > 0 || $target.hasClass('cb-content')) {
                        view.append($content);
                    } else {
                        var $parenttab = $target.parents(clsTabwrap);
                        /* parent tabwrap */
                        if ($parenttab.length > 0) {
                            view.append($parenttab);
                        } else {
                            /* cb-tabwrap */
                            if ($target.hasClass('cb-tabwrap')) {
                                view.append($target);
                            }
                        }
                    }
                }
            });
            view.$contianer.mouseout(function (e) {
                var $target = $(e.target);
                var $content = $target.parents(clsContent);
                var $tabwrap = $target.parent('.cb-tabwrap');
                if ($content.length === 0 || $tabwrap.length ===0 ) {
                    $.cbuilder.$itemtools.hide();
                }
            });
        },
        deleteBtnEvent: function () {
            view.$contianer.delegate(".item-delete", 'click', function () {
                var that = $(this);
                layer.confirm('确定删除该项?', { icon: 3 }, function (index) {
                    layer.close(index);
                    var $parenttab = that.parents(clsTabwrap);
                    if ($parenttab.length > 0) {
                        $parenttab.remove();
                    } else {
                        that.parents(clsWrap).detach();
                    }
                });
            });
        },
        append: function ($obj) {
            $obj.append($.cbuilder.$itemtools);
            $.cbuilder.$itemtools.show();
        },
        bindEvents: function () {
            view.mouseEvent();
            view.deleteBtnEvent();
        },
        struc: function () {
            $(document).ready(function () {
                view.domCache();
                view.bindEvents();
            });
        }
    };
    view.struc();
})();
