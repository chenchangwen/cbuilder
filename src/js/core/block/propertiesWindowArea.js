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
                inputid = $this.attr('id');
            var type = areaview.selecteType = $this.data('type');
            var controls = view.$panel.find('.pw-controls-panel');
            var $obj = $.cbuilder.$pw.$selectedobj;
            /* 隐藏所有controls*/
            controls.hide();
            /* 匹配类型显示内容 */
            switch (type) {
                case 'link':
                    /* 默认值 */
                    var defaults= {
                        url: '',
                        opentype:'_blank'
                    }
                    /* 设定 */
                    areaview.$areaurl.val($obj.attr('href') || defaults.url);
                    $.cbuilder.active.$element.find('input[name="opentype"][data-value="' + ($obj.attr('target') || defaults.opentype) + '"]').trigger('click');
                    break;
                case 'anchor':
                    var $anchor = $.cbuilder.active.$element.find(clsContent).find('.cb-anchor');
                    var $areacnhor = $("#area-anchor");
                    if ($anchor.length === 0) {
                        $areacnhor.html('<option>没有锚点</option>');
                    } else {
                        var html = '';
                        $anchor.each(function() {
                            var anchorid = $(this).attr('id');
                            html += '<option value=' + anchorid + '>' + anchorid + '</option>';
                        });
                        $areacnhor.html(html);
                        /* 设定 */
                        if ($obj.attr('href')) {
                            $areacnhor.find("option[value='" + $obj.attr('href').replace(/#/, '') + "']").prop("selected", "selected");
                        }
                    }
                    break;
            }
            /* 匹配当前id的controls 并显示panel*/
            view.$panel.find('.pw-controls-panel[class*=' + inputid + ']').show();
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
        view.$pw.on("propertiesWindow:editShowEd", function (event, opname, clsstr) {
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
                areaview.$areatype.find('input[data-type=' + linktype + ']').trigger('click');
            } else {
                areaview.$areatype.find('input:eq(0)').trigger('click');
            }
        });
        /* 事件:保存类型 */
        view.$pw.on("propertiesWindow:areaTypeSave", function () {
            /* 处理当前area */
            var type = areaview.selecteType;
            var areatypehtml = '';
            switch (type) {
                case 'link':
                    var url = $.trim(areaview.$areaurl.val()).toString();
                    var opentype = $('input[name="opentype"]:checked').data('value');
                    if (!url.match(commons.regex.url)) {
                        commons.layer.msg('保存失败:请输入正确的链接地址');
                        return false;
                    }
                    areatypehtml += 'target="' + opentype + '"';
                    areatypehtml += 'href="' + url + '"';
                    break;
                case 'anchor':
                    var $anchor = $.cbuilder.active.$element.find(clsContent).find('.cb-anchor');
                    if ($anchor.length === 0) {
                        commons.layer.msg('保存失败:请添加锚点');
                        return false;
                    }
                    areatypehtml += 'href="#' + $("#area-anchor").val() + '"';
                    break;
            }
            /* 全部正确保存类型 */
            areatypehtml += 'linktype="' + type + '"';
            /* 保存坐标位置 */
            var width = ($.cbuilder.areapos.w - 6);
            var height = ($.cbuilder.areapos.h - 6);
            var left = $.cbuilder.areapos.x;
            var top = $.cbuilder.areapos.y;
            var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
            /* 默认为a 除了倒计时 */
            var tagname = 'a';
            var imgpos = '<' + tagname + ' class="imgpos" style="' + position + '"  ' + areatypehtml + ' ></' + tagname + '>';
            /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
            var $parent = $.cbuilder.$pw.$selectedobj.parent();
            /* 全部正确插入imgpos */
            $parent.append(imgpos);
            commons.clean();
            layer.msg('保存成功', {
                offset: '200px',
                time: 1000
            });
            view.$pw.hide();
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
                $.cbuilder.$pw.trigger('propertiesWindow:areaTypeSave');
            }
        });
    },
    domCache: function() {
        areaview.$areatype = $("#area-type");
        areaview.$areaurl = $("#area-url");
        areaview.$croppos = $('.croppos');
    },
    struc: function () {
        areaview.domCache();
        areaview.customEvent();
        areaview.bindEvents();
    }
};
areaview.struc();