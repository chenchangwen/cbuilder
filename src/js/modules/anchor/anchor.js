require(["../../global.config"], function () {
    require(['jquery', 'uikitextend'], function ($,uikitextend) {
        $(document).ready(function() {
            $('#confirm').on('click', function () {
                var val = $.trim($("#name").val());
                if (val === "") {
                    uikitextend.uikit.notify({ message: "名称不能为空!" });
                    return false;
                } 
                var html = '<a class="cb-anchor" id="' + val + '"/>';
                parent.$.cbuilder.append(html);
                parent.layer.closeAll();
            });
        });
    });
});