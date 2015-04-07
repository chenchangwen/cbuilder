/*
    jQuery cbuilder v1.0 - 2015-4-4 
    (c) Kevin 21108589@qq.com
	license: http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
    var defaults = {
        height: '100%',
        plugins: ['upload', 'preview'],
        prefix: 'cbuilder',
        clsToolbar: '.cb-toolbar',
        clsBody: '.cb-body',
        tpl: {
            toolbar: '<div class="cb-toolbar"></div>',
            toolbar_button: '<div class="cb-button-wrap"><button class="cb-button">111</button></div>',
            body: '<div class="cb-body"></div>'
        },
        onComplete: false
    };

    var cbuilder = function (element, options) {
        this.options = $.extend({}, defaults, options);
        this.$element = $(element);
        this.strucView();
        this.strucEvents();
    };

    //private Method
    function strucPrivateEvents(){
        this._trigger=function(event, callback){
            this.$element.trigger(event);
            if (callback) {
                callback.call(this.$element);
            }
        };
    }

    cbuilder.prototype = {
        strucView: function () {
            var that = this;
            var view= {
                appendHtml: function() {
                    that.$element.addClass('cb-container')
                        .wrap(that.options.tpl.container)
                        .append(that.options.tpl.toolbar + that.options.tpl.body);
                },
                loadPlugins: function() {
                    for (var i = 0; i < that.options.plugins.length; i++) {
                        that.$element.find(that.options.clsToolbar).append(that.options.tpl.toolbar_button);
                    }
                },
                bindEvents: function() {
                    that.$element.on('click', function() {
                        //alert('123');
                    });
                },
                struc: function() {
                    this.appendHtml();
                    this.loadPlugins();         
                    this.bindEvents();
                }
            }
            view.struc();
        },
        strucEvents: function () {
            strucPrivateEvents.call(this);
        },
        show:function(){
//            this._trigger('_myclick',function(){
//                alert('after')
//            });
        }
    };
     

    $.fn.cbuilder = function (option) {
        var args = arguments;
        return $(this).each(function() {
            var data = $(this).data("cbuilder");
            var options = (typeof option !== 'object') ? null : option;
            if (!data) {
                data = new cbuilder(this, options);
                $(this).data("cbuilder",data);
            }
            if (typeof option === 'string') {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
    }; 
   
}(window.jQuery));
