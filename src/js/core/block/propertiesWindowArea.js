var areaview = {
    bindEvents: function() {
        this.saveBtnEvent();
        this.deleteBtnEvent();
    },
    customEvent: function() {
        /* 属性窗口-页面-显示 */
        view.$pw.on("propertiesWindow:editShowEd", function (event, obj,clsstr) {
            /* 隐藏项工具 */
            $.cbuilder.$itemtools.hide();
            /* 区域 */
            if (clsstr === 'area') {
                view.setPanel('.pw-area');
                var headerstr = '当前区域';
                view.$pwallpanel.hide();
                view.$panel.show();
                view.$pwheader.text('<' + headerstr + '>');
                $("#cropwidth").val($.cbuilder.areapos.w);
                $("#cropheight").val($.cbuilder.areapos.h);
                $("#cropmarginleft").val($.cbuilder.areapos.x);
                $("#cropmargintop").val($.cbuilder.areapos.y);
            }
            view.$panel.find('.cb-pills-title').text($(obj).text());
        });
    },
    deleteBtnEvent: function () {
        $("#area-delete").on('click', function () {
            layer.confirm('确定删除<当前区域>?', { icon: 3 }, function (index) {
                commons.clean();
                view.$pw.hide();
                layer.close(index);
            });
        });
    },
    saveBtnEvent: function() {
        $("#area-save").on('click', function() {
            var cw = parseInt($("#cropwidth").val());
            var ch = parseInt($("#cropheight").val());
            var cx = parseInt($("#cropmarginleft").val());
            var cy = parseInt($("#cropmargintop").val());
            if (typeof (jcrop_api) != "undefined") {
                jcrop_api.animateTo([cw + cx, ch + cy, cx, cy]);
                $.cbuilder.areapos = {
                    w: cw,
                    h: ch,
                    x: cx,
                    y: cy
                };
            }
        });
    },
    struc: function () {
        areaview.customEvent();
        areaview.bindEvents();
    }
};
areaview.struc();