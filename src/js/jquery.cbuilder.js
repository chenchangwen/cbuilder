/*
    jQuery cbuilder v1.0 - 2015-4-4 
    (c) Kevin 21108589@qq.com
	license: http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
    var defaults = {
        height: '100%',
        plugins: [],
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
        },
        strucEvents: function () {
            strucPrivateEvents.call(this);
            // this.$element.on('_myclick',function(){
            //     alert($(this).attr('id'))
            // });
        },
        show:function(){
            // this._trigger('_myclick',function(){
            //     alert('after')
            // });
        }
    };
     

    $.fn.cbuilder = function (option) {
        var args = arguments;
        return $(this).each(function() {
            data = $(this).data("cbuilder");
            options = (typeof option !== 'object') ? null : option;
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
