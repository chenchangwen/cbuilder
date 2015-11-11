/* htmlģ�� */
~~include('../../tpl/propertiesWindow.js')
$('body').append(templates.propertiesWindow);

$("#pwopenner").on('click', function () {
    var right = $.cbuilder.propertiesWindow.$self.css('right');
    if (right !== '0px' || right === '-345px') {
        $.cbuilder.propertiesWindow.show();
    } else {
        $.cbuilder.propertiesWindow.$temp.hide();
        $.cbuilder.propertiesWindow.$self.css({ right: '-345px' });
    }
});

$.cbuilder.propertiesWindow = {
    /* ����$���� */
    $self: $('body').find('.cb-propertiesWindow'),
    $panel: $('body').find('.cb-propertiesWindow').find('.pw-panel'),
    $titlepanel: $('#cb-title-panel'),
    $temp: $('body').find('.cb-temp'),
    /* ��ѡ��Ķ��� */
    $selectedobj: '',
    /* ��ǰ���Դ��� */
    $currentpw: '',
    /* ��ʾ */
    show: function (options) {
        /* ������� */
        $.cbuilder.$itemtools.hide();
        this.$temp.show();
        if (options !== undefined) {
            this.$currentpw = $('#' + options['name']);
            this.$self.find('.pw-panel').hide();
            /* ����Ԫ��Title */
            this.$titlepanel.find('.pw-header').text('<' + this.$selectedobj.prop('tagName') + '>');
            this.$titlepanel.find('.cb-pills-title').text(options['pillstitle']);
            this.$currentpw.prepend(this.$titlepanel);
            this.$currentpw.show();
            this.$self.css({ right: '0px' });
            this.$currentpw.trigger('propertiesWindow:Showing');
        } else {
            this.$self.css({ right: '0px' });
        }
    },
    /* ���� */
    hide: function() {
        $.cbuilder.propertiesWindow.$self.css({ right: '-385px' });
        this.$temp.hide();
    }
};
~~include('../block/propertiesWindow/picture.js')
~~include('../block/propertiesWindow/area.js')


 


 