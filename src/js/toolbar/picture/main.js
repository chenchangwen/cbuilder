/* 图片组件 */
function init($element, commons) {
    var exports = {
        isToolbar: false,
        onLoaded: function () {
            var view = { 
                init: function() {
                    var vendors = [
                        'vendor/jcrop/js/jquery.Jcrop.min.js',
                        'vendor/jcrop/css/jquery.Jcrop.min.css'
                    ];
                    commons.loadFile(vendors);
                },
                onContentDblclick: function () {
                    $element.on('cbuilder:onContentDblclick', function (e,obj) {
                        var $this = $(obj);
                        var tagName = $this.prop('tagName');
                        if ($this.hasClass('imgpos') || tagName === 'IMG') {
                            $.cbuilder.propertiesWindow.$selectedobj = $this;
                            /* 初始化并没激活,所以必须再次设定激活状态 */
                            $.cbuilder.active = $this.parents('.cb-container').data('cbuilder');
                            e.stopPropagation();
                            /* 移除全选范围(避免chrome双击会全选) */
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            if (tagName === 'IMG') {
                                $.cbuilder.propertiesWindow.show({
                                    name: 'pwpicture',
                                    pillstitle: '编辑元素'
                                });
                            } else {
                                commons.jcrop.load($this.parent().find('img'), 'edit');
                                $.cbuilder.propertiesWindow.show({
                                    name: 'pwarea',
                                    pillstitle: '编辑区域'
                                });
                            }
                        }
                    });
                },
                onContentReadyEvent: function() {
                    /* 阻止A点击跳转 */
                    $('.cb-cropwrap').undelegate('click').delegate('a', 'click', function () {
                        return false;
                    });
                },
                bindEvents: function () {
                    this.onContentReadyEvent();
                    this.onContentDblclick();
                },
                struc: function () {
                    if (typeof $.Jcrop === "undefined") {
                        this.init();
                    }
                    this.bindEvents();
                }
            };
            view.struc();
            /* 图片 */
            (function() {
                /* 图片窗口 */
                var view = {
                    /* dom缓存 */
                    _domCache: function () {
                        var str1 = 'cb-picture-addarea,cb-picture-height,cb-picture-width,cb-picture-showdate,cb-picture-hidedate';
                        view.$pw = $('#pwpicture');
                        view.$savebtn = view.$pw.find('.pw-body-footer .save');
                        view.$deletebtn = view.$pw.find('.pw-body-footer .delete');
                        commons.setObjVariable(view, str1, 'cb-picture-');
                    },
                    /* 新建区域 */
                    _addAreaBtnEvent: function() {
                        view.$addarea.on('click', function() {
                            commons.jcrop.load($.cbuilder.propertiesWindow.$selectedobj, 'create');
                            $.cbuilder.propertiesWindow.show({
                                name: 'pwarea',
                                pillstitle: '新建区域'
                            });
                        });
                    },
                    /* 保存按钮 */
                    _saveBtnEvent: function() {
                        view.$savebtn.on('click', function () {
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                            if (!commons.regex.number.test(view.$height.val())) {
                                commons.layer.msg('', '请输入正确的数字', view.$height);
                                return false;
                            } else {
                                $selectedobj.css('height', view.$height.val());
                            }
            
                            if (!commons.regex.number.test(view.$width.val())) {
                                commons.layer.msg('', '请输入正确的数字', view.$width);
                                return false;
                            } else {
                                $selectedobj.css('width', view.$width.val());
                            }
            
                            var $cropwrap = $selectedobj.parents('.cb-cropwrap');
                            /* 保存显示时间 */
                            /* 开始时间 */
                            var showdate = view.$showdate.val();
                            if (showdate !== '') {
                                $cropwrap.attr('showdate', showdate);
                            } else {
                                $cropwrap.removeAttr('showdate');
                            }
                            /* 结束时间 */
                            var hidedate = view.$hidedate.val();
                            if (hidedate !== '') {
                                $cropwrap.attr('hidedate', hidedate);
                            } else {
                                $cropwrap.removeAttr('hidedate');
                            }
                            commons.layer.msg('success');
                            $.cbuilder.propertiesWindow.hide();
                        });
                    },
                    /* 删除按钮 */
                    _deleteBtnEvent: function () {
                        view.$deletebtn.on('click', function () {
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                            var tip = '确定删除&lt;' + $selectedobj.prop('tagName') + '&gt;?';
                            layer.confirm(tip, { icon: 3 }, function (index) {
                                var $deleteobj = '';
                                /* 如果是image */
                                var $pimage = $selectedobj.parent(".cb-cropwrap");
                                if ($pimage.length !== 0) {
                                    if ($pimage.children().length === 1 || $selectedobj.prop('tagName') === 'IMG') {
                                        $deleteobj = $pimage.parents('.cb-item');
                                    } else {
                                        $deleteobj = $selectedobj;
                                    }
                                } else {
                                    /* 其他元素 */
                                    var $parent = $selectedobj.parents('.cb-content');
                                    var $item = $selectedobj.parents('.cb-item');
                                    if ($parent.children().length === 1) {
                                        $deleteobj = $item;
                                    } else {
                                        $deleteobj = $item;
                                    }
                                }
                                $deleteobj.detach();
                                $.cbuilder.propertiesWindow.hide();
                                layer.close(index);
                            });
                        });
                    },
                    /* 自定义 propertiesWindow:Showing 事件 */
                    _showingEvent: function () {
                        view.$pw.on("propertiesWindow:Showing", function (event) {
                            commons.removeImpos();
                            var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                            view.$height.val($selectedobj.css('height').replace(/px/, ''));
                            view.$width.val($selectedobj.css('width').replace(/px/, ''));
                            var $cropwrap = $selectedobj.parents('.cb-cropwrap');
                            /* 默认值 */
                            var defaults = {
                                showdate: '',
                                hidedate: ''
                            }
                            /* 设定 */
                            view.$showdate.val($cropwrap.attr('showdate') || defaults.showdate);
                            view.$hidedate.val($cropwrap.attr('hidedate') || defaults.hidedate);
                        });
                    },
                    /* 日期事件 */
                    _dateTimeEvent: function () {
                        $(document).ready(function() {
                            /* 图片显示时间 */
                            view.$showdate.datetimepicker({
                                lang: 'ch',
                                format: 'Y-m-d H:i',
                                onShow: function (ct) {
                                    var maxdate = commons.dateTimePicker.format(view.$hidedate.val());
                                    if (maxdate) {
                                        maxdate = commons.dateTimePicker.reduceOneDay(maxdate);
                                    }
                                    this.setOptions({
                                        maxDate: maxdate
                                    });
                                }
                            });
            
                            /* 图片隐藏时间 */
                            view.$hidedate.datetimepicker({
                                lang: 'ch',
                                format: 'Y-m-d H:i',
                                onShow: function (ct) {
                                    this.setOptions({
                                        minDate: commons.dateTimePicker.format(view.$showdate.val())
                                    });
                                }
                            });
                        });
                    },
                    _bindEvents: function () {
                        commons.objectCallFunction(view, '_showingEvent', '_saveBtnEvent', '_addAreaBtnEvent', '_deleteBtnEvent', '_dateTimeEvent');
                    },
                    _init: function () {
                        var vendors = [
                            /* 颜色 */
                            'vendor/spectrum/spectrum.js',
                            'vendor/spectrum/spectrum.css'
                        ];
                        commons.loadFile(vendors);
                    },
                    _struc: function () {
                        commons.objectCallFunction(view, '_init', '_domCache', '_bindEvents');
                    }
                };
                view._struc();
            })();
            /* 区域 */
            (function () {
                var view = {
                    /* 类型 */
                    _typeEvent: function () {
                        view.$type.delegate('input', 'click', function () {
                            var $this = $(this),
                                inputid = $this.attr('id');
                            var type = view.selecteType = $this.data('type');
                            var controls = view.$pw.find('.pw-controls-panel');
                            var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                            var html = '';
                            /* 默认值 */
                            var defaults = {
                            }
                            /* 隐藏所有controls */
                            controls.hide();
                            /* 匹配类型显示内容 */
                            switch (type) {
                                case 'link':
                                    defaults = {
                                        url: '',
                                        opentype: '_blank'
                                    }
                                    /* 设定 */
                                    view.$url.val($obj.attr('href') || defaults.url);
                                    $.cbuilder.active.$element.find('input[name="opentype"][data-value="' + ($obj.attr('target') || defaults.opentype) + '"]').trigger('click');
                                    break;
                                case 'anchor':
                                    var $anchor = $.cbuilder.active.$element.find(clsContent).find('.cb-anchor');
                                    var $areacnhor = view.$anchor;
                                    if ($anchor.length === 0) {
                                        $areacnhor.html('<option>没有锚点</option>');
                                    } else {
                                        $anchor.each(function () {
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
                                    for (var i = 14; i < 40; i += 2) {
                                        html += '<option value="' + i + '">' + i + 'px' + '</option>';
                                    }
                                    view.$fontsize.html(html);

                                    /* 设定字体大小 */
                                    if ($obj.prop('style').cssText.toString().match(/font-size/) !== null) {
                                        var fontsize = $obj.css("font-size");
                                        view.$fontsize.find("option[value=" + fontsize.replace(/px/, '') + "]").prop("selected", "selected");
                                        view.$fontdemo.css("font-size", fontsize);
                                    }
                                    view.$fontsize.trigger('change');


                                    defaults = {
                                        color: '#000',
                                        startdate: '',
                                        enddate: '',
                                        isdayunit: 'true',
                                        format: 'cn'
                                    }

                                    /* 开始,结束 时间 */
                                    view.$startdate.val($obj.attr('startdate') || defaults.startdate);
                                    view.$enddate.val($obj.attr('enddate') || defaults.enddate);

                                    /* 字体 */
                                    if ($obj.prop('style').cssText.toString().match(/font-family/) !== null) {
                                        var fontfamily = $obj.css("font-family");
                                        view.$fontfamily.find("option[value=\"" + fontfamily + "\"]").prop("selected", "selected");
                                        view.$fontdemo.css("font-family", fontfamily);
                                    }

                                    /* 字体颜色 */
                                    view.$fontcolor.spectrum({
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
                                            view.$fontdemo.css('color', color.toHexString());
                                        }
                                    });

                                    /* 是否天为单位 */
                                    var isday = false;
                                    if (typeof $obj.attr("isdayunit") === "undefined") {
                                        isday = true;
                                    }
                                    else if ($obj.attr('isdayunit') === 'true') {
                                        isday = true;
                                    } else {
                                        isday = '';
                                    }
                                    view.$isdayunit.prop('checked', isday);
                                    view.$isdayunit.trigger('change');

                                    /* 时间格式 */
                                    view.$format.val($obj.attr('format') || defaults.format);
                                    break;
                                case 'coupon':
                                    view.$couponid.val($obj.attr('data-id') || '');
                                    break;
                            }
                            /* 匹配当前id的controls 并显示panel*/
                            view.$pw.find('.pw-controls-panel[class*=' + inputid + ']').show();
                        });
                    },
                    /* 图片裁剪输入 */
                    _cropPosInputEvent: function () {
                        /* 防止非数字输入 */
                        view.$croppos.on('keypress', function (event) {
                            if (isNaN(String.fromCharCode(event.which))) {
                                event.preventDefault();
                            }
                        });
                        /* 数字输入则重新定位图片裁剪位置 */
                        view.$croppos.on('keyup', function (event) {
                            var keyCode = event.keyCode;
                            if (keyCode === 32) {
                                event.returnValue = false;
                            }
                            else if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode === 8 || keyCode === 46) {
                                event.returnValue = true;
                                setTimeout(function () {
                                    var w = parseInt(view.$width.val());
                                    var h = parseInt(view.$height.val());
                                    var x = parseInt(view.$marginleft.val());
                                    var y = parseInt(view.$margintop.val());
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
                    /* 显示事件 */
                    _showingEvent: function () {
                        /* 事件:编辑页显示 */
                        view.$pw.on("propertiesWindow:Showing", function () {
                            /* 设置坐标 */
                            view.$width.val($.cbuilder.areapos.w);
                            view.$height.val($.cbuilder.areapos.h);
                            view.$marginleft.val($.cbuilder.areapos.x);
                            view.$margintop.val($.cbuilder.areapos.y);
                            view.$pw.trigger('propertiesWindow:areaTypeShow');
                            /* 显示属性窗口,因为此时有可能属性窗口被关闭 */
                        });
                        /* 事件:显示类型 */
                        view.$pw.on("propertiesWindow:areaTypeShow", function () {
                            var $obj = $.cbuilder.propertiesWindow.$selectedobj;
                            var linktype = $obj.attr('linktype');
                            if (linktype) {
                                view.$type.find('input[data-type=' + linktype + ']').trigger('click');
                            } else {
                                view.$type.find('input:eq(0)').trigger('click');
                            }
                        });
                        /* 事件:保存类型 */
                        view.$pw.on("propertiesWindow:areaTypeSave", function () {
                            /* 处理当前area */
                            var type = view.selecteType;
                            var areatypehtml = '';
                            /* 保存成功回调 */
                            var successcb;
                            /* 标签:默认为a */
                            var tagname = 'a';
                            switch (type) {
                                case 'link':
                                    var url = $.trim(view.$url.val()).toString();
                                    var opentype = $('input[name="opentype"]:checked').data('value');
                                    if (!url.match(commons.regex.url)) {
                                        commons.layer.msg('', '请输入正确的链接地址', view.$url);
                                        return false;;
                                    }
                                    areatypehtml += 'target="' + opentype + '"';
                                    areatypehtml += 'href="' + url + '"';
                                    break;
                                case 'anchor':
                                    var $anchor = $.cbuilder.active.$element.find(clsContent).find('.cb-anchor');
                                    if ($anchor.length === 0) {
                                        commons.layer.msg('', '请添加锚点', $anchor);
                                        return false;
                                    }
                                    areatypehtml += 'href="#' + view.$anchor.val() + '"';
                                    break;
                                case 'countdown':
                                    tagname = 'div';
                                    view.startdate = view.$startdate.val();
                                    view.enddate = view.$enddate.val();
                                    view.format = view.$format.val();
                                    view.isdayunit = view.$isdayunit.prop('checked');
                                    if (view.startdate === '') {
                                        commons.layer.msg('', '请选择开始时间', view.$startdate);
                                        return false;
                                    }
                                    else
                                        if (view.enddate === '') {
                                            commons.layer.msg('', '请选择结束时间', view.$enddate);
                                            return false;
                                        }
                                    successcb = function ($imgpos) {
                                        /* 字体,大小,颜色 */
                                        $imgpos.css("font-family", view.$fontfamily.val());
                                        $imgpos.css("font-size", view.$fontsize.val() + 'px');
                                        $imgpos.css("color", view.$fontcolor.spectrum("get").toHexString());
                                        /* 开始,结束 时间 */
                                        $imgpos.attr('startdate', view.startdate);
                                        $imgpos.attr('enddate', view.enddate);
                                        /* 是否天为单位 */
                                        $imgpos.attr('isdayunit', view.isdayunit);
                                        /* 时间格式 */
                                        $imgpos.attr('format', view.format);
                                    }
                                    break;
                                case 'coupon':
                                    var couponid = view.$couponid.val();
                                    if (couponid === '') {
                                        commons.layer.msg('', '请输入优惠券id', view.$couponid);
                                        return false;
                                    }
                                    if (couponid.indexOf(',') >= 0 || !commons.regex.number.test(couponid)) {
                                        var reg = /^(\d+\,)+\d+$/;
                                        if (!reg.test(couponid)) {
                                            commons.layer.msg('', '优惠券id格式不正确,格式[数字,数字] 如:123,456', view.$couponid);
                                            return false;
                                        }
                                    }
                                    successcb = function ($imgpos) {
                                        /* 优惠券id */
                                        $imgpos.attr('data-id', couponid);
                                    }

                                    break;
                            }
                            /* 全部正确保存类型 */
                            areatypehtml += ' linktype="' + type + '"';
                            /* 保存坐标位置 */
                            var width = ($.cbuilder.areapos.w);
                            var height = ($.cbuilder.areapos.h);
                            var left = $.cbuilder.areapos.x;
                            var top = $.cbuilder.areapos.y;
                            var position = "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
                            var imgpos = '<' + tagname + ' class="imgpos" id="tempimgpos" style="' + position + '"  ' + areatypehtml + ' ></' + tagname + '>';
                            /* 将位置所生成的dom 添加到父,因为父永远有cropwrap */
                            var $parent = $.cbuilder.propertiesWindow.$selectedobj.parent();
                            /* 全部正确插入imgpos */
                            $parent.append(imgpos);
                            if (typeof successcb === 'function') {
                                var $imgpos = $("#tempimgpos");
                                successcb($imgpos);
                            }
                            commons.removeImpos();
                            commons.layer.msg('success');
                            $.cbuilder.propertiesWindow.hide();
                        });
                    },
                    /* 删除 */
                    _deleteBtnEvent: function () {
                        view.$delete.on('click', function () {
                            layer.confirm('确定删除<当前区域>?', { icon: 3 }, function (index) {
                                commons.removeImpos();
                                $.cbuilder.propertiesWindow.hide();
                                layer.close(index);
                            });
                        });
                    },
                    /* 保存 */
                    _saveBtnEvent: function () {
                        view.$save.on('click', function () {
                            /* jcrop存在才执行保存或编辑 */
                            if (typeof (jcrop_api) != "undefined") {
                                view.$pw.trigger('propertiesWindow:areaTypeSave');
                            }
                        });
                    },
                    /* 倒计时 */
                    _countDownEvent: function () {
                        /* 字体 */
                        view.$fontfamily.change(function () {
                            view.$fontdemo.css('font-family', $(this).val());
                        });

                        /* 字体大小 */
                        view.$fontsize.change(function () {
                            view.$fontdemo.css('font-size', $(this).val() + 'px');
                            view.$fontdemo.css('line-height', $(this).val() + 'px');
                        });

                        /* 字体格式 */
                        var demoFontFormat = function () {
                            var isdayunit = view.$isdayunit.prop('checked');
                            var formatval = view.$format.val();
                            var text = '25HH01mm01ss';
                            if (formatval === 'cn') {
                                text = text.replace(/HH/g, '时').replace(/mm/g, '分').replace(/ss/g, '秒');
                            }
                            else if (formatval === 'HH:mm:ss') {
                                text = text.replace(/HH/g, ':').replace(/mm/g, ':').replace(/ss/g, '');
                            }
                            if (isdayunit) {
                                text = text.replace(/25HH/g, '1天01时').replace(/25时/g, '1天01时').replace(/25:/g, '1天 01:');
                            }
                            view.$fontdemo.text(text);
                        }

                        /* 是否天为单位 */
                        view.$isdayunit.change(function () {
                            demoFontFormat();
                        });

                        /* 时间格式 */
                        view.$format.change(function () {
                            demoFontFormat();
                        });
                    },
                    /* 日期事件 */
                    _dateTimeEvent: function () {
                        $(document).ready(function () {
                            /* 倒计时开始时间 */
                            view.$startdate.datetimepicker({
                                lang: 'ch',
                                format: 'Y-m-d H:i',
                                onShow: function (ct) {
                                    var maxdate = commons.dateTimePicker.format(view.$enddate.val());
                                    if (maxdate) {
                                        maxdate = commons.dateTimePicker.reduceOneDay(maxdate);
                                    }
                                    this.setOptions({
                                        maxDate: maxdate
                                    });
                                }
                            });

                            /* 倒计时结束时间 */
                            view.$enddate.datetimepicker({
                                lang: 'ch',
                                format: 'Y-m-d H:i',
                                onShow: function (ct) {
                                    this.setOptions({
                                        minDate: commons.dateTimePicker.format(view.$startdate.val())
                                    });
                                }
                            });
                        });
                    },
                    _bindEvents: function () {
                        commons.objectCallFunction(view, '_cropPosInputEvent', '_saveBtnEvent', '_deleteBtnEvent', '_typeEvent', '_countDownEvent', '_dateTimeEvent');
                    },
                    _domCache: function () {
                        var vmain = 'cb-area-couponid,cb-area-format,cb-area-type,cb-area-url,.cb-area-croppos,' +
                            'cb-area-width,cb-area-height,cb-area-marginleft,' +
                            'cb-area-margintop,cb-area-anchor,pw-area';
                        var vbtn = ',cb-area-save,cb-area-delete';
                        var vtypecountdown = ',cb-area-fontfamily,cb-area-fontsize,cb-area-fontdemo,cb-area-fontcolor,cb-area-startdate,cb-area-enddate,cb-area-isdayunit';
                        vmain += vbtn + vtypecountdown;
                        commons.setObjVariable(view, vmain, 'cb-area-');
                        view.$pw = $("#pwarea");
                    },
                    _struc: function () {
                        commons.objectCallFunction(view, '_domCache', '_showingEvent', '_bindEvents');
                    }
                };
                view._struc();
            })();
        }
    }
    return exports;
}
