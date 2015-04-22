define(function () {
    var exports= {
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        hexValue:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/,
        email:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        number: /^[0-9]*$/
    };
    return exports;
});
