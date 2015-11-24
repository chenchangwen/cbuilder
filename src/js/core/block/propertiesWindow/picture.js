﻿(function() {
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