//function init(element, basePath,commons) {
//    var exports = {
//        toolbar: {
//            name: "anchor",
//            text: '锚点'
//        },
//        type: 'iframe',
//        width: 600,
//        height: 220
//    }
//    return exports;
//}

function init(element, basePath) {
    var exports = {
        toolbar: {
            name: "anchor",
            text: "锚点",
            onClick: function () {
                var html = '<div cb="cb-anchor">';
                html += '<label>锚点:</label>';
                html += '<input type="text" value="">';
                html+='</div>';
                $.cbuilder.append(html);
            }
        }
    }
    return exports;
}