﻿~~include('../../tpl/propertiesWindow.js')
/* 属性窗口 */
var view = {
    selecotr:'.main',
    domCache: function() {
        var $element = $('body');
        $element.append(templates.propertiesWindow);
        /* 全局 */
        $.cbuilder.$pw = view.$pw = $element.find('.cb-propertiesWindow');
        $.cbuilder.$pwcontent = view.$pwcontent = view.$pw.find('.pw-main .pw-body-content');
        $.cbuilder.$pwfooter = view.$pwfooter = view.$pw.find('.pw-main .pw-body-footer');
        $.cbuilder.$pw.AddBtn = function (opts) {
            var $obj = $('#' + opts.id);
            if ($obj.length === 0) {
                var html = '<button type="button" id="' + opts.id + '" class="btn primary">' + opts.text + '</button>';
                $.cbuilder.$pwfooter.append(html);
                if (typeof opts.event === "function") {
                    opts.event($('#' + opts.id));
                }
            }
        }
    },
    pillsEvent: function () {
        function buildList(obj, title, attrlist) {
            var html = templates.bodycontentheader.replace(/#value/, title);
            html += '<table class="pw-body-content-list">';
            for (var i = 0; i < attrlist.length; i++) {
                html += '<tr>';
                html += '<td class="text">' + (attrlist[i].name || attrlist[i]) + ':</td>';
                html += '<td class="input">' + '<input type="text" value="' + (attrlist[i].value || obj.css(attrlist[i])) + '"></input>' + '</td>';
                html += '</tr>';
            }
            html += '</table>';
            html += templates.hr;
            return html;
        }

        view.$pw.find('ul').delegate('li', 'click', function (event, objindex) {
            var $this = $(this);
            var stractive = 'cb-active';
            var index = objindex || $this.index();
            var $selectedobj = view.$pw.$selectedobj;

            view.$pwcontent.html('');
            view.$pwfooter.html('');
            /* 编辑 */
            if (index === 0) {
                var html = '';
                html += buildList($selectedobj, '属性', ['height', 'width']);
                view.$pwcontent.html(html);
                if (view.$pwfooter.html() === '') {
                    view.$pwfooter.append(templates.editbtns);
                    var $savebtn = view.$pwfooter.find('.save');
                    $savebtn.on('click', function () {
                        var $bodylist = view.$pwcontent.find('.pw-body-content-list tr');
                        $bodylist.each(function () {
                            var $this = $(this);
                            var text = $this.find('.text').text().replace(/:/,'');
                            var value = $this.find('.input').find('input').val();
                            if ($selectedobj.css(text)) {
                                $selectedobj.css(text, value);
                            }
                            else if ($selectedobj.prop(text)) {
                                $selectedobj.prop(text, value);
                            }
                        });
                    });
                }
            }
            /* 操作 */
            else if (index === 1) {
                /* 其他按钮 */
                $.cbuilder.$pw.trigger('propertiesWindow:operationShow', $selectedobj);
                /* 通用按钮 */
                view.$pwfooter.append(templates.operationbtns);
                var $btndel = view.$pwfooter.find('.delete');
                $btndel.on('click', function () {
                    layer.confirm('确定删除当前编辑元素?', { icon: 3 }, function (index) {
                        var $deleteobj = '';
                        /* 如果是image */
                        var $pimage = $selectedobj.parent(".cb-image");
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
                        view.$pw.hide();
                        layer.close(index);
                    });
                });
            }
            view.$pw.selectedindex = index;
            $this.parent().find('li').removeClass(stractive).eq(index).addClass(stractive);
            view.$pw.show();
        });
    },
    customEvent: function () {
        /* 属性窗口显示事件 */
        view.$pw.on("propertiesWindow:show", function (event, obj) {
            var $eventobj = $(obj);
            view.$pw.find('.pw-main.pw-header').text('<' + $eventobj.prop('tagName') + '>');
            view.$pw.$selectedobj = $eventobj;
            view.$pw.find('.pw-main .cb-pills li:first').trigger('click', 0 || view.$pw.selectedindex);
        });
        /* 属性窗口页面显示事件 */
        view.$pw.on("propertiesWindow:operationPageShow", function (event, $obj,type) {
            $.cbuilder.$itemtools.hide();
            var headerstr = '';
            /* 区域 */
            if (type === 'area') {
                headerstr = 'DIV';
                view.$pw.$selectedobj = $obj;
                view.$pw.find('.cb-pills').hide();
            }
            view.$pw.find('.pw-header').text('<' + headerstr + '>');
        });
    },
    backEvent: function () {
        view.$pw.find('.close').on('click', function () {
            view.$pw.hide();
        });
    },
    closeEvent: function () {
        view.$pw.find('.back').on('click', function () {
            alert('123123');
        });
    },
    bindEvents: function() {
        view.customEvent();
        view.closeEvent();
        view.backEvent();
        view.pillsEvent();
    },
    struc: function () {
        view.domCache();
        view.bindEvents();
    }
};
view.struc();

//var attrs = [];
//$.each($selectedobj.prop('attributes'), function () {
//    if (this.specified) {
//        if ($selectedobj.prop(this.name) ===undefined)
//        attrs.push({ name: this.name, value: this.value });
//    }
//});
//html += buildList($selectedobj, '属性', attrs);