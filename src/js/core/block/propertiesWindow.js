~~include('../../tpl/propertiesWindow.js')
var $element = $('body');
$element.append(templates.propertiesWindow);
$pw = $element.find('.cb-propertiesWindow');
$pwcontent = $pw.find('.pw-body-content');
$pw.on("propertiesWindow:show", function (event, obj) {
    var $eventobj = $(obj);
    $pw.find('.pw-heading').text('<' + $eventobj.prop('tagName') +'>');
    $pw.find('.pw-content');
    $pw.selectedobj = $eventobj;
    $pw.find('.cb-pills li:first').trigger('click', 0 || $pw.selectedindex);
    $pw.show();
});

function buildList(obj, title, attrlist) {
    var html = templates.bodycontentheading.replace(/#value/, title);
    html += '<table class="pw-body-content-list">';
    for (var i = 0; i < attrlist.length; i++) {
        html += '<tr>';
        html += '<td class="text">' + attrlist[i] + ':</td>';
        html += '<td class="input">' + '<input type="text" value="' + obj.css(attrlist[i]) + '"></input>' + '</td>';
        html +='</tr>';
    }
    html += '</table>';
    html += templates.hr;
    return html;
}

$pw.find('ul').delegate('li', 'click', function (event, objindex) {
    var $this = $(this);
    var stractive = 'cb-active';
    var index = objindex || $this.index();
    $pwcontent.html('');
    /* 编辑 */
    if (index === 0) {
        var html = '';
        html += buildList($pw.selectedobj, '盒子', ['height', 'width']);
        html += buildList($pw.selectedobj, '颜色 & 背景', ['color', 'background-position', 'background-color']);
        html += buildList($pw.selectedobj, '字体 & 文本', ['font-size', 'font-weight', 'font-family', 'line-height', 'word-spacing']);
        $pwcontent.html(html);
    }
    /* 操作 */
    else if (index === 1) {
       
    }
    $pw.selectedindex = index;
    $this.parent().find('li').removeClass(stractive).eq(index).addClass(stractive);
});

$pw.find('.close').on('click', function () {
    $pw.hide();
});