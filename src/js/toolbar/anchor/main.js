function init($element, commons) {
    var exports = {
        toolbar: {
            name: "anchor",
            text: "锚点",
            onClick: function () {
                var html = '<a class="cb-anchor" id="tempanchor"/>';
                $.cbuilder.append(html);
                $.cbuilder.propertiesWindow.$selectedobj = $("#tempanchor");
                $.cbuilder.propertiesWindow.show({
                    name: 'pwanchor',
                    pillstitle: '编辑锚点'
                });
            }
        },
        onLoaded: function () {
            var view = {
                _domCache: function () {
                    view.$pw = $('#pwanchor');
                    commons.setObjVariable(view, 'cb-anchor-name,cb-anchor-save,cb-anchor-delete', 'cb-anchor-');
                },
<<<<<<< HEAD
                _onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                        $('.cb-content').on('dblclick', function () {
                            var $this = $(this);
                            var $anchor = $this.find('.cb-anchor');
                            if ($anchor.length === 1) {
                                $.cbuilder.propertiesWindow.$selectedobj = $anchor;
                                $.cbuilder.propertiesWindow.show({
                                    name: 'pwanchor',
                                    pillstitle: '编辑锚点'
                                });
                            }
                            return false;
                        });
=======
                _onContentDblclick: function () {
                    $element.on('cbuilder:onContentDblclick', function (e, obj) {
                        var $this = $(obj);
                        var $anchor = $this.find('.cb-anchor');
                        if ($anchor.length === 1 || $this.hasClass('cb-anchor')) {
                            $.cbuilder.propertiesWindow.$selectedobj = $anchor;
                            $.cbuilder.propertiesWindow.show({
                                name: 'pwanchor',
                                pillstitle: '编辑锚点'
                            });
                        }
                        return false;
>>>>>>> ec37fa8b935fc54bde973fdbfd82bffc48bb881d
                    });
                },
                _saveBtnEvent: function() {
                    view.$save.on('click', function() {
                        var name = view.$name.val();
                        if (name === '') {
                            commons.layer.msg('', '请输入名称');
                            view.$name.focus();
                            return false;
                        }
          
                        if ($("#" + name).length > 0) {
                            if ($('#' + name)[0] !== $.cbuilder.propertiesWindow.$selectedobj[0]) {
                                commons.layer.msg('', '锚点[' + name + ']已存在,请重新输入');
                                return false;
                            }
                        }
                        commons.layer.msg('success');
                        $.cbuilder.propertiesWindow.$selectedobj.attr('id', name);
                        $.cbuilder.propertiesWindow.hide();
                    });
                },
                /* 显示事件 */
                _showingEvent: function () {
                    view.$pw.on("propertiesWindow:Showing", function (event) {
                        var id = $.cbuilder.propertiesWindow.$selectedobj.attr('id');
                        view.$name.val(id || '');
                    });
                },
                struc: function () {
<<<<<<< HEAD
                    commons.objectCallFunction(view, '_domCache', '_onContentReadyEvent', '_saveBtnEvent', '_showingEvent');
=======
                    commons.objectCallFunction(view, '_domCache', '_onContentDblclick', '_saveBtnEvent', '_showingEvent');
>>>>>>> ec37fa8b935fc54bde973fdbfd82bffc48bb881d
                }
            };
            view.struc();
        }
    }
    return exports;
}