/* html模板 */
~~include('../../tpl/propertiesWindow.js')
$('body').append(templates.propertiesWindow);
var _propertiesWindow = {
    show: function() {
        
    },
    hide: function() {
        
    }
}
$.cbuilder.propertiesWindow = {
    /* 自身$对象 */
    $self: $('body').find('.cb-propertiesWindow'),
    /* 当前选择的对象 */
    $selectedobj:'',
    show: function() {
        
    },
    hide: function() {
        
    }
};
~~include('../block/propertiesWindow/picture.js')

 


 