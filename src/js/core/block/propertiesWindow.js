~~include('../../tpl/propertiesWindow.js')
/* 属性窗口 */
var view = {
    /* dom缓存 */
    domCache: function() {
        var $body = $('body');
        $body.append(templates.propertiesWindow);
        /* 全局 */
        $.cbuilder.$pw = view.$pw = $body.find('.cb-propertiesWindow');
        view.$pwallpanel = view.$pw.find('.pw-panel');
        /* 添加按钮 */
        $.cbuilder.$pw.AddBtn = function (opts) {
            var $obj = $('#' + opts.id);
            if ($obj.length === 0) {
                var html = '<button type="button" id="' + opts.id + '" class="btn primary">' + opts.text + '</button>';
                view.$pw.find(opts.panel+ ' .pw-body-footer').append(html);
                if (typeof opts.event === "function") {
                    opts.event($('#' + opts.id));
                }
            }
        }
    },
    btnsEvent: function() {
        view.setPanel('.pw-main');
        /* 保存 */
        var $savebtn = view.$pwfooter.find('.save');
        $savebtn.on('click', function () {
            var $selectedobj = $(view.$pw.$selectedobj);
            var $bodylist = view.$pwcontent.find('.pw-body-content-list tr');
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
        });
        /* 删除 */
        var $btndel = view.$pwfooter.find('.delete');
        $btndel.on('click', function () {
            var $selectedobj = $(view.$pw.$selectedobj);
            var tip = '确定删除&lt;' + $selectedobj.prop('tagName') + '&gt;?';
            layer.confirm(tip, { icon: 3 }, function (index) {
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
    },
    pillsEvent: function () {
        view.$pw.find('ul').delegate('li', 'click', function (event, objindex) {
            var $this = $(this);
            var stractive = 'cb-active';
            var index = objindex || $this.index();
            /* 找当前li的 父 panel */
            var $panel = $this.parents('.pw-panel');
            var showselector = '';
            if ($panel.hasClass('pw-main')) {
                showselector = '.pw-main';
                view.setPanel(showselector);
                //if (index === 0) {
                //    view.$pwfooter.find('.btn').hide();
                //    view.$pwfooter.find('.delete,.btn[id]').show();
                //}
                //else
                ///* 操作 */
                //if (index === 1) {
                //    /* 其他按钮 */
                //    view.$pwfooter.find('.btn').hide();
                //    view.$pwfooter.find('.delete,.btn[id]').show();
                //}
            }
            /* 显示属性窗口 */
            $.cbuilder.$pw.trigger('propertiesWindow:editShowing', view.$pw.$selectedobj);
            $this.parent().find('li').removeClass(stractive).eq(index).addClass(stractive);
            view.$pw.selectedindex = index;
            view.$pw.find(showselector).show();
            view.$pw.show();
        });
        view.btnsEvent();

    },
    customEvent: function () {
        /* 属性窗口-主面板-显示 */
        view.$pw.on("propertiesWindow:show", function (event) {
            commons.clean();
            view.$pwallpanel.hide();
            view.$pw.find('.pw-main .pw-header').text('<' + $.cbuilder.$pw.$selectedobj.prop('tagName') + '>');
            view.$pw.find('.pw-main .cb-pills li:first').trigger('click', 0 || view.$pw.selectedindex);
        });
    },
    /* 设置panel */
    setPanel: function(selecotr) {
        var $panel = $(selecotr);
        view.$panel = $panel;
        view.$pwcontent = $panel.find('.pw-body-content');
        view.$pwfooter = $panel.find('.pw-body-footer');
        view.$pwheader = $panel.find('.pw-header');
    },
    backEvent: function () {
        /* 后退按钮 */
        view.$pw.find('.back').on('click', function () {
            $.cbuilder.$pw.trigger('propertiesWindow:show');
        });
    },
    closeEvent: function () {
        /* 关闭属性窗口 */
        view.$pw.find('.close').on('click', function () {
            commons.clean();
            view.$pw.hide();
        });
    },
    blockInit: function() {
        ~~include('../../core/block/propertiesWindowArea.js')
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
        view.blockInit();
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