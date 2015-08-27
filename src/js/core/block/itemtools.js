~~include("../../tpl/itemtools.js");
var view = {
    domCache: function() {
        var $element = $("body");
        $element.append(templates.itemtools);
        /* 全局 */
        $.cbuilder.$itemtools = view.$itemtools = $element.find(".cb-itemtools");
        view.$contianer = $(".cb-container");
        view.$itemdelete = $(".item-delete");
    },
    mouseOverEvent: function() {
        view.$contianer.mouseover(function(e) {
            var $target = $(e.target);
            var $content = $target.parents(clsContent);
            if ($('.cb-itemtools').length === 0) {
                $("body").append(templates.itemtools);
            }
            /* jcrop 不存在时才作显示 */
            if ($(".jcrop-holder").length === 0) {
                if ($content.length > 0) {
                    $content.append($.cbuilder.$itemtools);
                    $.cbuilder.$itemtools.show();
                }
                if ($target.hasClass('cb-content')) {
                    $target.append($.cbuilder.$itemtools);
                    $.cbuilder.$itemtools.show();
                }
            }
        });
        view.$contianer.mouseout(function (e) {
            var $target = $(e.target);
            var $content = $target.parents(clsContent);
            if ($content.length === 0) {
                $.cbuilder.$itemtools.hide();
            }
        });
    },
    deleteEvent: function () {
        $(".item-delete").on('click', function () {
            var that = $(this);
            layer.confirm('确定删除该项?', { icon: 3 }, function (index) {
                layer.close(index);
                that.parents(clsContent).detach();
            });
        });
    },
    bindEvents: function() {
        view.mouseOverEvent();
        view.deleteEvent();
    },
    struc: function() {
        $(document).ready(function() {
            view.domCache();
            view.bindEvents();
        });

    }
};
view.struc();
