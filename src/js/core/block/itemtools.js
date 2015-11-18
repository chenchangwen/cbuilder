(function () {
    ~~include("../../tpl/itemtools.js");
    var view = {
        clsitemtools: '.cb-itemtools',
        domCache: function () {
            var $body = $("body");
            $body.append(templates.itemtools);
            /* 全局 */
            $.cbuilder.$itemtools = view.$itemtools = $body.find(view.clsitemtools);
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
                    }
                    /* parent tabwrap */
                    var $parenttab = $target.parents('.cb-tabwrap');
                    if ($parenttab.length > 0) {
                        view.append($parenttab);
                    }
                    /* cb-tabwrap */
                    if ($target.hasClass('cb-tabwrap')) {
                        view.append($target);
                    }
                }
                console.log($target);
            });
            view.$contianer.mouseout(function (e) {
                var $target = $(e.target);
                var $content = $target.parents(clsContent);
                var $tabwrap = $target.parent('.cb-tabwrap');
                if ($content.length === 0) {
                    $.cbuilder.$itemtools.hide();
                }
            });
        },
        deleteBtnEvent: function () {
            view.$contianer.delegate(".item-delete", 'click', function () {
                var that = $(this);
                layer.confirm('确定删除该项?', { icon: 3 }, function (index) {
                    layer.close(index);
                    that.parents(clsContent).detach();
                });
            });
        },
        append: function ($obj) {
            if ($obj.find(view.clsitemtools).length === 0) {
                $obj.append(templates.itemtools);
            }
            $obj.find(view.clsitemtools).show();
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
