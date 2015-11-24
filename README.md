#cbuilder
####cbuilder是一个集成各种优秀插件的"html内容生产器"的jquery插件

---
> ## 目录
> 1.结构图
> 2.使用
> 3.事件
> 4.方法
> 5.开发单独功能
> 6.元素的主要规范
> 7.样式
> 8.主要参数


#1.结构图

---

###工程目录
![此处输入图片的描述][1]

###主界面
![此处输入图片的描述][2]


#2.使用

---

###javascript
```javascript
<script src="vendor/jquery/dist/jquery.min.js"></script>
<script src="src/js/jquery.cbuilder.js"></script>
<script type="text/javascript">
        $(document).ready(function () {
            var options = {
                height: '800px'
            };
            $('#test1,#test2').cbuilder(options);
        });
</script>
```

###html
```html
<div id="test1">
</div>
<div id="test2">
</div>
```

#3.事件

---

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
| propertiesWindow:editShowEd    |    属性窗口编辑页显示完时   |



#4.方法
---
##$(selector).cbuilder(options)
初始化cbuilder
###selector
用于筛选的选择器
###options
* optoins.height *String*  高度,默认"100%"
* optoins.width *String* 高度,默认"100%"
* optoins.toolbar *Array* 工具条,默认[ "upload", "mupload", "test", "countdown", "clean", "anchor", "preview", "picture" ],每个数组索引对应每个独立功能(工具条项目)的文件夹名


#5.开发单独功能
---
**一般情况是基于toolbar(工具条),即点击工具条任意一个按钮产生相关功能,以下是示例.**

>1.toolbar下建立preview文件夹
>2.preview文件夹下建立main.js
>3.plugin.js下引用preview
>4.撰写端解析该工具条的js

##plugin.js 示例
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

##main.js 示例
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
**main.js只有init()会被cbuilder调用**

##前端解析JS(此文件还没建立,应名为cbuilder.js)

**后端解析和前端解析可能有点点不一样,可使用cbuilder:onGetContentBefore方法进行处理**

```javascript
    var cbuilder={
        something:function(){
        },
        struc:function(){
        }
    }
    cbuilder.struc();
```

#6.元素的主要规范
---
**其他就不在赘述,由于独立对象较多重点描述一下以下**

##main.js picture工具条规范编码示例

```javascript
function init($element, basePath, commons) {
    var exports = {
        isToolbar: false,
        onLoaded: function () {
            /*
             *view对象 
             *如果某个对象/某系类需要做的事情比较多,建议定义一个view对象,非分散定义各种function
            */
            var view = {
                /*初始化*/
                init: function() {
                },
                /*
                 *事件
                 *cbuilder内容准备完事件
                 *建议后缀都为Event
                 */
                onContentReadyEvent: function() {
                    $element.on('cbuilder:onContentReady', function (e) {
                       
                    });
                },
                /*
                 *方法
                 *载入图像裁剪 
                 *动宾结构当前上下文直接写在view里,通用的写在/core/block/commons.js里
                 */
                loadJcrop: function (obj, type) {
                    
                },
                onGetContentBeforeEvent: function() {
                    $element.on('cbuilder:onGetContentBefore', function () {
                       
                    });
                },
                /*
                 *自定义事件
                 *直接写自定义事件的简写
                 */
                pwEditShowing: function () {
                    $.cbuilder.$pw.on('propertiesWindow:editShowing', function (event, opobj) {
                        
                    });
                },
                /* 保存裁剪位置 */
                saveJcropPosition: function () {
                   
                },
                bindEvents: function () {
                    /* 调用各种事件 */
                    this.onContentReadyEvent();
                    this.onGetContentBeforeEvent();
                },
                /* 构造 */
                struc: function () {
                    if (typeof $.Jcrop === "undefined") {
                        this.init();
                        this.pwEditShowing();
                    }
                    this.bindEvents();
                }
            };
            view.struc();
        }
    }
    return exports;
}
```

#7.样式
**/less目录下建立相关模块文件**
| 名称        |说明 |
| --------   | -----:  |
| body     | 主体   |
| cbuilder.less        |  cbuilder   |
| cssreset.less        |   重置   |
| global.less        |    全局   |
| itemtools.less        |    项目工具   |
| propertiesWindow.less        |    属性窗口   |
| toobar.less        |    工具条   |

#8.主要参数


  [1]: https://raw.githubusercontent.com/chenchangwen/cbuilder/master/screenshots/pic.png
  [2]: https://raw.githubusercontent.com/chenchangwen/cbuilder/master/screenshots/ui.png
  