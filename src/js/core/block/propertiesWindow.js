
~~include('../../tpl/propertiesWindow.js')
$('body').append(templates.propertiesWindow);
var $pw = $('body').find('.cb-propertiesWindow');
var _propertiesWindow = {
    show: function() {
        
    },
    hide: function() {
        $.cbuilder.$pw.hide();
    }
}
$.cbuilder.propertiesWindow = {
    show: function() {
        
    },
    hide: function() {
        
    }
};
~~include('../block/propertiesWindow/main.js')

 


 