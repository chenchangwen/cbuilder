#cbuilder
####快速简单的构建你的html页面

#目录
* 目录结构
* 安装插件
* 使用
* 事件
* 方法
* 开发独立功能

#目录结构
![Alt text](https://raw.githubusercontent.com/chenchangwen/cbuilder/master/screenshots/structure.jpg)

#安装插件

```
bower i 
npm i
```
安装完,可以直接运行cbuilder.html查看示例.

#使用

##编辑html时
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


##展示html时
```html
<script src="/cbuilder/dist/cbuilder_parser.min.js"></script>
<script src="/cbuilder/dist/cbuilder_parser.min.css"></script>
```
cbuilder_parse.min.js会解析你的html



#事件
###cbuilder

| 名称        |说明 |
| --------   | -----:  |
| cbuilder:onWrapContent     | 当cbuilder要包住新建的内容时   |
| cbuilder:onContentReady        |  当cbuilder内容已经准备好时   |
| cbuilder:onToolsReady        |   当工具条准备好时   |
| cbuilder:onGetContentBefore        |    当cbuilder获取内容之前   |


###propertiesWindow(属性窗口)


| 名称        |说明   |
| --------   | -----:  |
| propertiesWindow:show     | 显示属性窗口   |
| propertiesWindow:editShowing  |     属性窗口编辑页显示时    |



#方法
##$(selector).cbuilder(options)
初始化cbuilder
###selector
用于筛选的选择器
###options
* optoins.height *String*  高度,默认"100%"
* optoins.width *String* 高度,默认"100%"
* optoins.toolbar *Array* 工具条,默认[ "clean", "anchor", "preview", "picture"],每个数组索引对应每个独立功能(工具条项目)的文件夹名


#开发独立功能
**一般情况是基于toolbar(工具条),即点击工具条任意一个按钮执行相关方法**
###1. cbuilder根目录运行gulp命令.
###2. 创建你的main.js
路径:cbuilder/src/js/toolbar/priview/main.js,它会被cbuilder初始化时执行(被引用时).
```javascript
/**
 * 初始化插件 所有main.js文件只有这个方法会被cbuilder调用
 * @element {Object} 当前cbuilder的元素,也可以说当前的容器
 * @basePath {String} 当前工具条路径
 * @commons {Object} 通用对象 详细请看/core/block/commons.js
 * @exports {Object} 返回当前工具条配置
 */
function init(element, basePath,commons) {
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
###3. 引用你的main.js
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
###4. 撰写你的解析方法
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
