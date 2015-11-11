(function() {
    /* 图片窗口 */
    var view = {
        /* dom缓存 */
        _domCache: function () {
            var str1 = 'cb-main-height,cb-main-width,cb-main-showdate,cb-main-hidedate';
            view.$pw = $('#pwpicture');
            view.$pw.savebtn = view.$pw.find('.pw-body-footer .save');
            view.$pw.deletebtn = view.$pw.find('.pw-body-footer .delete');
            commons.setObjVariable(view, str1, 'cb-main-');
        },
        /* 保存按钮 */
        _saveBtnEvent: function() {
            view.$pw.savebtn.on('click', function () {
                var $selectedobj = $.cbuilder.propertiesWindow.$selectedobj;
                var $bodylist = view.$pw.find('.pw-body-content-list tr');
                $bodylist.each(function () {
                    var $this = $(this);
                    var text = $this.find('.text').text().replace(/:/, '');
                    var value = $this.find('.input').find('input').val();
                    if ($selectedobj.css(text)) {
                        $selectedobj.css(text, value);
                    } else if ($selectedobj.prop(text)) {
                        $selectedobj.prop(text, value);
                    }
                });
                var $cropwrap = $selectedobj.parents('.cb-cropwrap');
                /* 保存显示时间 */
                /* 开始时间 */
                var showdate = view.$showdate.val();
                if (showdate !== '') {
                    $cropwrap.attr('showdate', showdate);
                }
                /* 结束时间 */
                var hidedate = view.$hidedate.val();
                if (hidedate !== '') {
                    $cropwrap.attr('hidedate', hidedate);
                }
                commons.layer.msg('保存成功');
                $.cbuilder.propertiesWindow.hide();
            });
        },
        /* 删除按钮 */
        _deleteBtnEvent: function () {
            view.$pw.deletebtn.on('click', function () {
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
                commons.clean();
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
        _bindEvents: function () {
            commons.objectCallFunction(view, '_showingEvent', '_saveBtnEvent', '_deleteBtnEvent');
        },
        _init: function () {
            var vendors = [
                /* 日期 */
                '../../../../lib/My97DatePicker/WdatePicker.js',
                /* 颜色 */
                '../../../../vendor/spectrum/spectrum.js',
                '../../../../vendor/spectrum/spectrum.css'
            ];
            commons.loadFile(vendors);
        },
        _struc: function () {
            commons.objectCallFunction(view, '_init', '_domCache', '_bindEvents');
        }
    };
    view._struc();
})();