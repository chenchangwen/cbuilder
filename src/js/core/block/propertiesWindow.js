~~include('../../tpl/propertiesWindow.js')
var $element = $('body');
$element.append(templates.propertiesWindow);
$propertiesWindow = $element.find('.cb-propertiesWindow');
$propertiesWindow.on("propertiesWindow:show", function (event, obj) {
    $propertiesWindow.show();
});

$propertiesWindow.children('ul').delegate('li', 'click', function () {
    var $this = $(this);
    var stractive = 'cb-active';
    if ($this.hasClass(stractive)) {
        return false;
    }
    $this.parent().find('li').removeClass(stractive);
    $this.addClass(stractive);
});

$propertiesWindow.find('.close').on('click', function () {
    $propertiesWindow.hide();
});