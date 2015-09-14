var areaview = {
    /* 类型 */
    typeEvent: function () {
        areaview.$type.delegate('input', 'click', function () {
            var $this = $(this),
                inputid = $this.attr('id');
            var type = areaview.selecteType = $this.data('type');
            var controls = view.$panel.find('.pw-controls-panel');
            var $obj = $.cbuilder.$pw.$selectedobj;
            var html = '';
            /* 默认值 */
            var defaults= {
            }
            /* 隐藏所有controls */
            controls.hide();
            /* 匹配类型显示内容 */
            switch (type) {
                case 'link':
                    defaults= {
                        url: '',
                        opentype:'_blank'
                    }
                    /* 设定 */
                    areaview.$url.val($obj.attr('href') || defaults.url);
                    $.cbuilder.active.$element.find('input[name="opentype"][data-value="' + ($obj.attr('target') || defaults.opentype) + '"]').trigger('click');
                    break;
                case 'anchor':
                    var $anchor = $.cbuilder.active.$element.find(clsContent).find('.cb-anchor');
                    var $areacnhor = areaview.$anchor;
                    if ($anchor.length === 0) {
                        $areacnhor.html('<option>没有锚点</option>');
                    } else {
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
                case 'countdown':
                    /* 初始化字体大小 */
                    for (var i = 14; i < 40; i+=2) {
                        html += '<option value="' + i + '">' + i + 'px' + '</option>';
                    }
                    areaview.$fontsize.html(html);

                    /* 设定字体大小 */
                    if ($obj.prop('style').cssText.toString().match(/font-size/) !== null) {
                        var fontsize = $obj.css("font-size");
                        areaview.$fontsize.find("option[value=" + fontsize.replace(/px/, '') + "]").prop("selected", "selected");
                        areaview.$fontdemo.css("font-size", fontsize);
                    }

                    defaults = {
                        color: '#000',
                        startdate: '',
                        enddate:''
                    }
                    debugger;
                    /* 开始,结束 时间 */
                    areaview.$startdate.val($obj.attr('startdate') || defaults.startdate);
                    areaview.$enddate.val($obj.attr('enddate') || defaults.enddate);

                    /* 字体 */
                    if ($obj.prop('style').cssText.toString().match(/font-family/) !== null) {
                        var fontfamily = $obj.css("font-family");
                        areaview.$fontfamily.find("option[value=\"" + fontfamily + "\"]").prop("selected", "selected");
                        areaview.$fontdemo.css("font-family", fontfamily);
                    }
                    /* 字体颜色 */
                    areaview.$fontcolor.spectrum({
                        showPalette: true,
                        color: $obj.css('color') || defaults.color,
                        showInput: true,
                        preferredFormat: "hex",
                        hideAfterPaletteSelect: true,
                        clickoutFiresChange: true,
                        showButtons: true,
                        chooseText: "选择",
                        cancelText: "取消",
                        palette: [
                           ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                           ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                           ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                           ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                           ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                           ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                           ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                           ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                        ],
                        change: function (color) {
                            areaview.$fontdemo.css('color', color.toHexString());
                        }
                    });
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
                    var w = parseInt(areaview.$width.val());
                    var h = parseInt(areaview.$height.val());
                    var x = parseInt(areaview.$marginleft.val());
                    var y = parseInt(areaview.$margintop.val());
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
            areaview.$width.val($.cbuilder.areapos.w);
            areaview.$height.val($.cbuilder.areapos.h);
            areaview.$marginleft.val($.cbuilder.areapos.x);
            areaview.$margintop.val($.cbuilder.areapos.y);
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
                areaview.$type.find('input[data-type=' + linktype + ']').trigger('click');
            } else {
                areaview.$type.find('input:eq(0)').trigger('click');
            }
        });
        /* 事件:保存类型 */
        view.$pw.on("propertiesWindow:areaTypeSave", function () {
            /* 处理当前area */
            var type = areaview.selecteType;
            var areatypehtml = ''; 
            /* 保存成功回调 */
            var successcb;
            /* 标签:默认为a */
            var tagname = 'a';
            switch (type) {
                case 'link':
                    var url = $.trim(areaview.$url.val()).toString();
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
                    areatypehtml += 'href="#' + areaview.$anchor.val() + '"';
                    break;
                case 'countdown':
                    areaview.startdate = areaview.$startdate.val();
                    areaview.enddate = areaview.$enddate.val();
                    if (areaview.startdate === '') {
                        commons.layer.msg('保存失败:请选择开始时间');
                        return false;
                    }
                    else 
                        if (areaview.enddate === '') {
                        commons.layer.msg('保存失败:请选择结束时间');
                        return false;
                    }
                    successcb = function () {
                        tagname = 'div';
                        var $imgpos = $("#tempimgpos");
                        /* 字体,大小,颜色 */
                        $imgpos.css("font-family", areaview.$fontfamily.val());
                        $imgpos.css("font-size", areaview.$fontsize.val());
                        $imgpos.css("color", areaview.$fontcolor.spectrum("get").toHexString());
                        /* 开始,结束 时间 */
                        $imgpos.attr('startdate', areaview.startdate);
                        $imgpos.attr('enddate', areaview.enddate);
                    }
            }
            /* 全部正确保存类型 */
            areatypehtml += ' linktype="' + type + '"';
            /* 保存坐标位置 */
            var width = ($.cbuilder.areapos.w - 6);
            var height = ($.cbuilder.areapos.h - 6);
            var left = $.cbuilder.areapos.x;
            var top = $.cbuilder.areapos.y;
            var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
            var imgpos = '<' + tagname + ' class="imgpos" id="tempimgpos" style="' + position + '"  ' + areatypehtml + ' ></' + tagname + '>';
            /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
            var $parent = $.cbuilder.$pw.$selectedobj.parent();
            /* 全部正确插入imgpos */
            $parent.append(imgpos);
            if (typeof successcb === 'function') {
                successcb();
            }
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
        areaview.$delete.on('click', function () {
            layer.confirm('确定删除<当前区域>?', { icon: 3 }, function (index) {
                commons.clean();
                view.$pw.hide();
                layer.close(index);
            });
        });
    },
    /* 保存 */
    saveBtnEvent: function () {
        areaview.$save.on('click', function () {
            /* jcrop存在才执行保存或编辑 */
            if (typeof (jcrop_api) != "undefined") {
                $.cbuilder.$pw.trigger('propertiesWindow:areaTypeSave');
            }
        });
    },
    /* 倒计时 */
    countDownEvent: function () {
        /* 字体 */
        areaview.$fontfamily.change(function () {
            areaview.$fontdemo.css('font-family', $(this).val());
        });

        /* 字体大小 */
        areaview.$fontsize.change(function () {
            areaview.$fontdemo.css('font-size', $(this).val() + 'px');
            areaview.$fontdemo.css('line-height', $(this).val() + 'px');
        });
    },
    bindEvents: function () {
        commons.objectCallFunction(areaview, 'cropPosInputEvent', 'saveBtnEvent', 'deleteBtnEvent', 'typeEvent', 'countDownEvent');
    },
    domCache: function () {
        var vmain = 'cb-area-type,cb-area-url,.cb-area-croppos,' +
            'cb-area-width,cb-area-height,cb-area-marginleft,' +
            'cb-area-margintop,cb-area-anchor';
        var vbtn = ',cb-area-save,cb-area-delete';
        var vtypecountdown = ',cb-area-fontfamily,cb-area-fontsize,cb-area-fontdemo,cb-area-fontcolor,cb-area-startdate,cb-area-enddate';
        vmain += vbtn + vtypecountdown;
        commons.setObjVariable(areaview, vmain,'cb-area-');
    },
    struc: function () {
        commons.objectCallFunction(areaview, 'domCache', 'customEvent', 'bindEvents');
    }
};
areaview.struc();