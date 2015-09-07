var areaview = {
    bindEvents: function () {
        areaview.cropPosInputEvent();
        areaview.saveBtnEvent();
        areaview.deleteBtnEvent();
        areaview.typeEvent();
    },
    /* 类型 */
    typeEvent: function () {
        areaview.$areatype.delegate('input', 'click', function () {
            var $this = $(this),
                id = $this.attr('id');
            areaview.$selecteType = $this.data('type');
            var controls = view.$panel.find('.pw-controls-panel');
            /* 隐藏所有controls*/
            controls.hide();
            /* 匹配当前id的controls 并显示*/
            view.$panel.find('.pw-controls-panel[class*=' + id + ']').show();
        });
    },
 
    /* 图片裁剪输入 */
    cropPosInputEvent: function () {
        /* 防止非数字输入 */
        areaview.$croppos.on('keypress', function (event) {
            if (isNaN(String.fromCharCode(event.which))) {
                event.preventDefault();
            }
        });
        /* 数字输入则重新定位图片裁剪位置 */
        areaview.$croppos.on('keyup', function (event) {
            var keyCode = event.keyCode;
            if (keyCode === 32) {
                event.returnValue = false;
            }
            else if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode === 8 || keyCode === 46) {
                event.returnValue = true;
                setTimeout(function() {
                    var w = parseInt($("#cropwidth").val());
                    var h = parseInt($("#cropheight").val());
                    var x = parseInt($("#cropmarginleft").val());
                    var y = parseInt($("#cropmargintop").val());
                    var $target = $(event.target);
                    var name = $target.data('name');
                    var value = parseInt(event.target.value) || 0;;
                    if (name === 'width') {
                        w = value;
                    }
                    if (name === 'height') {
                        h = value;
                    }
                    if (name === 'left') {
                        x = value;
                    }
                    if (name === 'top') {
                        y = value;
                    }
                    if (typeof (jcrop_api) != "undefined") {
                        jcrop_api.animateTo([w + x, h + y, x, y]);
                        $.cbuilder.areapos = {
                            w: w,
                            h: h,
                            x: x,
                            y: y
                        };
                    }
                }, 200);
            } else {
                event.returnValue = false;
            }
        });
    },
    customEvent: function() {
        /* 事件:编辑页显示完 */
        view.$pw.on("propertiesWindow:editShowEd", function (event, opname,clsstr) {
            /* 隐藏项工具 */
            $.cbuilder.$itemtools.hide();
            var headerstr = '';
            /* 区域 */
            if (clsstr === 'area') {
                view.setPanel('.pw-area');
                headerstr = '当前区域';
            }
            view.$pwallpanel.hide();
            view.$panel.show();
            view.$pwheader.text('<' + headerstr + '>');
            /* 设置坐标 */
            $("#cropwidth").val($.cbuilder.areapos.w);
            $("#cropheight").val($.cbuilder.areapos.h);
            $("#cropmarginleft").val($.cbuilder.areapos.x);
            $("#cropmargintop").val($.cbuilder.areapos.y);
            /* 改变title */
            view.$panel.find('.cb-pills-title').text(opname);
            $.cbuilder.$pw.trigger('propertiesWindow:areaTypeShow');
            /* 显示属性窗口,因为此时有可能属性窗口被关闭 */
            view.$pw.show();
        });

        /* 事件:显示类型 */
        view.$pw.on("propertiesWindow:areaTypeShow", function () {
            var $obj = $.cbuilder.$pw.$selectedobj;
            var linktype = $obj.attr('linktype');
            if (linktype) {
                areaview.$areatype.find('input[data-type='+$obj.data('type')+']').trigger('click');
            } else {
                areaview.$areatype.find('input:eq(0)').trigger('click');
            }
        });
        /* 事件:保存类型 */
        view.$pw.on("propertiesWindow:areaTypeSave", function () {
            /* 处理当前area */
            var $editarea = $("#editarea");
            var type = areaview.$selecteType;
            switch (type) {
                case 'link':

                    break;
            }
            $editarea.removeAttr('id');
        });
    },
    /* 删除 */
    deleteBtnEvent: function () {
        $("#area-delete").on('click', function () {
            layer.confirm('确定删除<当前区域>?', { icon: 3 }, function (index) {
                commons.clean();
                view.$pw.hide();
                layer.close(index);
            });
        });
    },
    /* 保存 */
    saveBtnEvent: function() {
        $("#area-save").on('click', function () {
            /* jcrop存在才执行保存或编辑 */
            if (typeof (jcrop_api) != "undefined") {
                /* 坐标位置 */
                var width = ($.cbuilder.areapos.w - 6);
                var height = ($.cbuilder.areapos.h - 6);
                var left = $.cbuilder.areapos.x;
                var top = $.cbuilder.areapos.y;
                var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
                /* 默认为a 除了倒计时 */
                var tagname = 'a';
                var editarea = '<' + tagname + ' id="editarea" class="imgpos" style="' + position + '" ></' + tagname + '>';
                /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
                var $parent = $.cbuilder.$pw.$selectedobj.parent();
                $parent.append(editarea);
                $.cbuilder.$pw.trigger('propertiesWindow:areaTypeSave');
                commons.clean();
            }
        });
    },
    domCache: function() {
        areaview.$areatype = $("#area-type");
        areaview.$croppos = $('.croppos');
    },
    struc: function () {
        areaview.domCache();
        areaview.customEvent();
        areaview.bindEvents();
    }
};
areaview.struc();