var areaview = {
    bindEvents: function () {
        this.cropPosInputEvent();
        this.saveBtnEvent();
        this.deleteBtnEvent();
    },
    /* 图片裁剪输入事件 */
    cropPosInputEvent: function () {
        /* 防止非数字输入 */
        $('.croppos').on('keypress', function(event) {
            if (isNaN(String.fromCharCode(event.which))) {
                event.preventDefault();
            }
        });
        /* 数字输入则重新定位图片裁剪位置 */
        $('.croppos').on('keyup', function (event) {
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
            /* 区域 */
            debugger;
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
            /* 改变title */
            view.$panel.find('.cb-pills-title').text(opname);
            /* 显示属性窗口,因为此时有可能属性窗口被关闭 */
            view.$pw.show();
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
            /* 坐标位置 */
            var width = ($.cbuilder.areapos.w - 6);
            var height = ($.cbuilder.areapos.h - 6);
            var left = $.cbuilder.areapos.x;
            var top = $.cbuilder.areapos.y;
            var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
            /* 默认为a 除了倒计时 */
            var tagname = 'a';
            var temparea = '<' + tagname + ' id="temparea" class="imgpos" style="' + position + '" ></' + tagname + '>';
            /* 将位置所生成的dom 添加到父,因为我父永远有cropwrap */
            var $parent = $.cbuilder.$pw.$selectedobj.parent();
            $parent.append(temparea);
            /* 处理temparea 结构 */
            var $temparea = $("#temparea");
            $temparea.removeAttr('id');
            commons.clean();
        });
    },
    struc: function () {
        areaview.customEvent();
        areaview.bindEvents();
    }
};
areaview.struc();