require.config({
    baseUrl: '../../',
    paths: {
        //vendors
        jquery: '../../vendor/jquery/dist/jquery.min',
        Jcrop: '../../vendor/Jcrop/js/jquery.Jcrop.min',
        spectrum: '../../vendor/spectrum/spectrum',
        "uikit": '../../vendor/uikit/js/uikit.min',
        "spin": '../../lib/spin.min',
        'uikit!upload': '../../uikit!upload',
        dropzone: '../../vendor/dropzone/dist/min/dropzone.min',
        //common
        uikitextend: 'common/uikitextend',
        utils: 'common/utils'
    },
    shim: {
        jqextend: ['jquery'],
        uikitextend: ['jquery'],
        utils: ['jquery'],
        "spin": ['jquery'],
        Jcrop: ['jquery'],
        "uikit": ['jquery'],
        "uikit!upload": ['jquery'],
        spectrum: ['jquery'],
        dropzone: ['jquery']
    },
    config: {
        "uikit": {
            "base": "../../vendor/uikit/js"
        }
    },
    waitSeconds: 200
});
