#cbuilder
####快速简单构建你的单页面

#目录
* 组件功能
* 结构
* 安装插件
* 使用
* API
* 开发独立组件


#组件功能
#####图片区域(toolbar/picture)
   给图片插入矩阵区域并附上功能    
   目前包括:超链接,锚点,倒计时,优惠券
#####锚点(toolbar/anchor)
   插入锚点
#####预览(toolbar/preview)
   预览html内容
#####源代码(toolbar/sourcecode)
   编辑html源代码,支持格式化
#####tab容器(toolbar/tab)(开发中)
   插入tab容器    
   容纳同级元素
#####清空(toolbar/clean)
   清空html内容
#结构
![项目结构图](https://raw.githubusercontent.com/chenchangwen/cbuilder/master/screenshots/structure.jpg)

**蓝色箭头为目录生成方向**
#安装插件
初始化npm
```
npm install
```
初始化bower
```
bower install 
```
安装完,可以直接运行cbuilder.html查看示例.

#使用

###编辑html
```html
<script src="src/js/jquery.cbuilder.js"></script>
<link href="src/css/cbuilder.css" rel="stylesheet"/>
<body>
    <div id="test1"></div>
    <div id="test2"></div>
</body>
```
```javascript
<script type="text/javascript">
    $(document).ready(function () {
        var options = {
            height: '800px'
        };
        $('#test1,#test2').cbuilder(options);
    });
</script>
```
jquery.cbuilder.js会构建你的html


###展示html
```html
<script src="/cbuilder/dist/cbuilder_parser.min.js"></script>
<script src="/cbuilder/dist/cbuilder_parser.min.css"></script>
```
cbuilder_parse.min.js会解析你的html




#API
##$(selector).cbuilder(options)
初始化cbuilder
###selector
用于筛选的选择器
###options
* optoins.height *String*  高度,默认"100%"
* optoins.width *String* 高度,默认"100%"
* optoins.toolbar *Array* 工具条,默认[ "clean", "anchor", "preview", "picture"],每个数组索引对应每个独立功能(工具条项目)的文件夹名

### $.cbuilder
```javascript
 $.cbuilder = {
        /* 路径 */
        path: {
            /* 当前根目录路径 */
            root: rootPath,
            /* 当前js目录路径 */
            js: jsPath
        },
        /**
         * 添加内容
         * @html {String} 
         * @clstype {String} tab|item  tab:容器元素,item:一般元素
         */
        append: function (html,clstype) {
        },
        /* 获取内容 */
        getContent: function () {
        },
        /**
         * 设置内容
         * @html {String}
         */
        setContent: function (html) {
        },
        /* 当前激活的cbuilder */
        active,
        /* 工具项 */
        $itemtools:{
            /* 显示工具项 */
            show:function(){
            },
            /* 隐藏工具项 */
            hide:function(){
            }
        },
        /* 属性窗口 */
        propertiesWindow:{
            /* 当前选择的对象 */
            $selectedobj,
            /**
             * 显示属性窗口
             * @obj {Object}
             * obj.name          名称
             * obj.pillstitle    标题
             */
            show:function(obj){
            }
        }
    }
```

### 事件
| 事件        |说明 |
| --------   | -----:  |
| cbuilder:onWrapContent     | 当cbuilder要包住新建的内容时   |
| cbuilder:onContentReady        |  当cbuilder内容已经准备好时   |
| cbuilder:onGetContentBefore        |    当cbuilder获取内容之前   |
| propertiesWindow:Showing  |     属性窗口显示时执行   |


#开发独立组件
**一般情况是基于toolbar(工具条),即点击工具条任意一个按钮执行相关方法 以下主要以anchor/main.js 作为示例**
###开发时,cbuilder根目录运行gulp命令.
```
gulp
```
###1. 创建你的组件
路径:cbuilder/src/js/toolbar/**/main.js,它会被cbuilder初始化时执行(被引用时).
```javascript
/**
 * 初始化插件 所有main.js文件只有这个方法会被cbuilder调用
 * @element {Object} 当前cbuilder的元素,也可以说当前的容器
 * @commons {Object} 通用对象 详细请看/core/block/commons.js
 * @exports {Object} 返回当前工具条配置
 */
function init(element,commons) {
    /*导出对象*/
    var exports = {
        /*
         *是否一个工具条 
         *如果为true则其余属性不会被执行
         *默认不填写该属性
         *该属性主要为了处理加载文件做的事情并不是一个按钮的情况
         */
        isToolbar: false,
        /*
         *当此文件加载完毕
         *只有当isToolbar: false 才有效
         */
        onLoaded:function(){
        },
        /*工具条*/
        toolbar: {
            /*名字 应该和文件夹名一致*/
            name: "preview",
            /*文本*/
            text: '预览'
            /*点击事件 */
            onClick: function () {
            }
        },
        /*
         *类型 
         *类型为iframe则执行layer弹窗,
         *默认不填该属性
         */
        type: 'iframe'
    }
    return exports;
}
```

###2. 修改你的propertiesWindow
路径:cbuilder/src/tplhtml/propertiesWindow.html    
html遵循bootstrap规范,pw为propertiesWindow的缩写,根div的id为以后调用所写的,**id必填**.    
基本结构如下

```html
<div class="pw-anchor pw-panel" id="pwanchor">
    <div class="pw-body">
        <div class="pw-body-content">
            <form class="form-horizontal">
                <div class="form-group">
                    <label for="cb-anchor-name" class="col-sm-2 control-label">名称:</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control input-sm" id="cb-anchor-name" placeholder="名称:">
                    </div>
                </div>
            </form>
        </div>
        <hr class="cb-article-divider">
        <div class="pw-body-footer">
            <button type="button" id="cb-anchor-save" class="btn btn-primary btn-sm save">保 存</button>
            <button type="button" id="cb-anchor-delete" class="btn btn-danger btn-sm delete deleteevent">删 除</button>
        </div>
    </div>
</div>
```

###3. 定义propertiesWindow事件
路径:cbuilder/src/js/toolbar/anchor/main.js
```
$element.on('cbuilder:onContentReady', function (e) {
    /* 双击时显示属性窗口 */
    $('.cb-content').on('dblclick', function () {
        var $this = $(this);
        var $anchor = $this.find('.cb-anchor');
        if ($anchor.length === 1) {
            $.cbuilder.propertiesWindow.$selectedobj = $anchor;
            $.cbuilder.propertiesWindow.show({
                /* 这个pwanchor 就是刚第二步创建html所定义的 */
                name: 'pwanchor',
                pillstitle: '编辑锚点'
            });
        }
        return false;
    });
});
```

```javascript
_showingEvent: function () {
    /* 显示属性窗口时要做的事情 */
    view.$pw.on("propertiesWindow:Showing", function (event) {
        var id = $.cbuilder.propertiesWindow.$selectedobj.attr('id');
        view.$name.val(id || '');
    });
},
```
 
###4. 引用你的组件    
路径:cbuilder/src/js/core/plugin.js     
**plugin.js是插件的基础核心文件,只有一个,最终合并为jquery.cbuilder.js**
```javascript
var defaults = {
        height: "100%",
        width:"99%",
        toolbar: ['anchor', 'preview', 'picture'], //引用处
        tpl: {
            toolbar: "<div class='cb-toolbar'></div>",
            toolbar_button: "<div class='btn-wrap'><button class='btn primary {clsname}'>{name}</button></div>",
            body: "<div class='cb-body'></div>",
            body_item: "<div class='cb-item'><div class='cb-content'></div></div>",
            body_item_tool: "<div class='cb-tools'><div class='btn-wrap'></div></div>"
        }
    };
```


###5. 撰写你的解析方法
路径:cbuilder/src/js/parser/main.js    
**parser/main.js是前端解析cbuilder的文件,只有一个,最终合并为/dist/cbuilder_parser.min.js**
```
...
/* 我的组件 */
myComponent:function(){
    //....
},
/* 解析组件 */
_parseComponents: function () {
    commons.objectCallFunction(view, 'myComponent');
},
...
```
在_parseComponents方法里,调用"myComponent"
