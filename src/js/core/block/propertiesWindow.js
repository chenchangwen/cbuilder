/* htmlģ�� */
~~include('../../tpl/propertiesWindow.js')
$('body').append(templates.propertiesWindow);

$("#pwopenner").on('click', function () {
    var right = $.cbuilder.propertiesWindow.$self.css('right');
    if (right !== '0px' || right === '-345px') {
        $.cbuilder.propertiesWindow.show();
    } else {
        $.cbuilder.propertiesWindow.$self.css({ right: '-345px' });
    }
});

$.cbuilder.propertiesWindow = {
    /* ����$���� */
    $self: $('body').find('.cb-propertiesWindow'),
    $panel:$('body').find('.cb-propertiesWindow').find('.pw-panel'),
    /* ��ѡ��Ķ��� */
    $selectedobj:'',
    show: function (name) {
        if (name !== undefined) {
            var $pw = $('#' + name);
            this.$self.find('.pw-panel').hide();
            $pw.show();
            this.$self.css({ right: '0px' });
            $pw.trigger('propertiesWindow:Showing');
        } else {
            this.$self.css({ right: '0px' });
        }
    },
    hide: function() {
        $.cbuilder.propertiesWindow.$self.css({ right: '-385px' });
    }
};
~~include('../block/propertiesWindow/picture.js')

 


 