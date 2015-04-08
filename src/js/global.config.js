require.config({
    paths: {
        //vendors
        jquery: '../../../../vendor/jquery/dist/jquery.min',
        Jcrop: '../../../vendor/Jcrop/js/jquery.Jcrop.min',
        "uikit": '../../../../vendor/uikit/js/uikit.min',
        "spin": '../../../../vendor/spin.min',
        'uikit!upload': '../../../../uikit!upload',
        //自定义
        jqextend: '../../core/jqextend',
        uikitextend: '../../core/uikitextend',
        utils: '../../core/utils',
        component: '../../component/all'
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
            "base": "../../../../vendor/uikit/js"
        }
    },
    waitSeconds: 200
});
