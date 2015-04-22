require.config({
    baseUrl: '../../',
    paths: {
        //vendors
        jquery: '../../vendor/jquery/dist/jquery.min',
        Jcrop: '../../vendor/Jcrop/js/jquery.Jcrop.min',
        "uikit": '../../vendor/uikit/js/uikit.min',
        "spin": '../../lib/spin.min',
        'uikit!upload': '../../uikit!upload',
        //自定义
        jqextend: 'core/jqextend',
        uikitextend: 'core/uikitextend',
        utils: 'core/utils'
    },
    shim: {
        jqextend: ['jquery'],
        uikitextend: ['jquery'],
        utils: ['jquery'],
        "spin": ['jquery'],
        Jcrop: ['jquery'],
        "uikit": ['jquery'],
        "uikit!upload": ['jquery']
    },
    config: {
        "uikit": {
            "base": "../../vendor/uikit/js"
        }
    },
    waitSeconds: 200
});
