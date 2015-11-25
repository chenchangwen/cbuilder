function init($element, basePath, commons) {
    var exports = {
        toolbar: {
            name: "tab",
            text: "tab容器",
            onClick: function () {
                var html = '';
                $.cbuilder.append(html, 'tab');
            }
        },
        onLoaded: function () {
            var view = {
                _clstab:'.cb-tabwrap',
                _domCache: function () {
                    view.$pw = $('#pwtab');
                    commons.setObjVariable(view, 'cb-tab');
                },
                /* 初始化dragula */
                _initDragula: function() {
                    if ($element.find(view._clstab).length > 0) {
                        /* 销毁所有dragula */
                        if (typeof drake !== "undefined") {
                            drake.destroy();
                        }

                        if (typeof $element.dragula !== "undefined") {
                            $element.dragula.destroy();
                        }
                        /* 定义容器范围 */
                        drake= dragula([$element.find('.cb-body')[0]], {
                            moves: function (el, container, handle) {
                                if ($(el).parent().hasClass('cb-tabwrap') && $(el).hasClass('cb-item') && handle.className === 'item-move') {
                                    /* 销毁一般dragula */
                                    $element.dragula.destroy();
                                    return true;
                                }
                                else
                                    if ($(el).parent().hasClass('cb-tabwrap') && !$(el).hasClass('cb-item') && handle.className === 'item-move') {
                                        return false;
                                    }
                                return handle.className === 'item-move';
                            }
                        });
                        /* 增加容器 */
                        var $cbtabwrap = $element.find(view._clstab);
                        for (var i = 0; i < $cbtabwrap.length; i++) {
                            drake.containers.push($element.find(view._clstab)[i]);
                        }

                        /* drop事件 */
                        drake.on('drop', function (el, target, source, sibling) {
                            if (!$(el).parent().hasClass('cb-tabwrap') && $(el).hasClass('cb-item')) {
                                /* 还原一般dragula */
                                view._buildCommonDrag();
                            }
                        });
                        view._buildCommonDrag();
                    }
                },
                /* 建立通用拖拽 */
                _buildCommonDrag: function () {
                    if (typeof dark !== "undefined") {
                        dark.destory();
                    }
                    $element.dragula = dragula([$element.find('.cb-body')[0]], {
                        moves: function (el, container, handle) {
                            return handle.className === 'item-move';
                        }
                    });
                },
                _showingEvent: function() {
                    view.$pw.on("propertiesWindow:Showing", function (event) {
                        var id = $.cbuilder.propertiesWindow.$selectedobj.attr('id');
                        view.$name.val(id || '');
                    });
                },
                _onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                        view._initDragula();

                        $(view._clstab).on('dblclick', function () {
                            var $this = $(this);
                            $.cbuilder.propertiesWindow.$selectedobj = $this;
                            $.cbuilder.propertiesWindow.show({
                                name: 'pwtab',
                                pillstitle: '编辑tab容器'
                            });
                            return false;
                        });
                    });

                    $element.delegate(view._clstab, "mouseover", function (event) {
                        $(this).addClass('cb-hover');
                    });

                    $element.delegate(".cb-tabwrap", "mouseout", function (event) {
                        $(this).removeClass('cb-hover');
                    });
                },
                struc: function () {
                    commons.objectCallFunction(view, '_domCache', '_onContentReadyEvent', '_showingEvent');
                }
            };
            view.struc();
        }
    }
    return exports;
}