﻿define(function () {
    var exports= {
        url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/,
        number: /^[0-9]*$/
    }
    return exports;
});
