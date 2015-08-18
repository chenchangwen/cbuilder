~~include('../../tpl/propertiesWindow.js')
var view = {
    domCache: function() {
        var $element = $('body');
        $element.append(templates.propertiesWindow);
        /* 全局 */
        $pw = view.$pw = $element.find('.cb-propertiesWindow');
        view.$pwcontent = view.$pw.find('.pw-body-content');
        view.$pwfooter = view.$pw.find('.pw-body-footer');
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
            view.$pwcontent.html('');
            view.$pwfooter.html('');
            /* 编辑 */
            if (index === 0) {
                var html = '';
                html += buildList(view.$pw.selectedobj, '盒子', ['height', 'width']);
                view.$pwcontent.html(html);
                if (view.$pwfooter.html() === '') {
                    view.$pwfooter.append(templates.bodycontentfooter);
                    var $savebtn = view.$pwfooter.find('.save');
                    $savebtn.on('click', function () {
                        alert('123123')
                    });
                }
            }
            /* 操作 */
            else if (index === 1) {

            }
            view.$pw.selectedindex = index;
            $this.parent().find('li').removeClass(stractive).eq(index).addClass(stractive);
            view.$pw.show();
        });
    },
    customShowEvent: function() {
        view.$pw.on("propertiesWindow:show", function (event, obj) {
            var $eventobj = $(obj);
            view.$pw.find('.pw-header').text('<' + $eventobj.prop('tagName') + '>');
            view.$pw.find('.pw-content');
            view.$pw.selectedobj = $eventobj;
            view.$pw.find('.cb-pills li:first').trigger('click', 0 || view.$pw.selectedindex);
        });
    },
    closeEvent: function () {
        view.$pw.find('.close').on('click', function () {
            view.$pw.hide();
        });
    },
    bindEvents: function() {
        view.customShowEvent();
        view.pillsEvent();
    },
    struc: function () {
        view.domCache();
        view.bindEvents();
    }
};
view.struc();

//var attrs = [];
//$.each(view.$pw.selectedobj.prop('attributes'), function () {
//    if (this.specified) {
//        if (view.$pw.selectedobj.prop(this.name) ===undefined)
//        attrs.push({ name: this.name, value: this.value });
//    }
//});
//html += buildList(view.$pw.selectedobj, '属性', attrs);