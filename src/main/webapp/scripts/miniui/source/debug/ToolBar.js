/**
 * 工具栏。
 * 
 *     @example
 *     &lt;div class="mini-toolbar"&gt;
 *         &lt;a class="mini-button" iconCls="icon-add"&gt;增加&lt;/a&gt;
 *         &lt;a class="mini-button" iconCls="icon-edit"&gt;修改&lt;/a&gt;
 *         &lt;a class="mini-button" iconCls="icon-remove"&gt;删除&lt;/a&gt;
 *         &lt;span class="separator"&gt;&lt;/span&gt;
 *         &lt;a class="mini-button" plain="true"&gt;增加&lt;/a&gt;
 *         &lt;a class="mini-button" plain="true"&gt;修改&lt;/a&gt;
 *         &lt;a class="mini-button" plain="true"&gt;删除&lt;/a&gt;
 *         &lt;span class="separator"&gt;&lt;/span&gt;
 *         &lt;input class="mini-textbox" /&gt;      
 *         &lt;a class="mini-button" plain="true"&gt;查询&lt;/a&gt;
 *     &lt;/div&gt;
 * 
 * @class
 * @extends mini.Container
 * @constructor
 */
mini.ToolBar = function() {
    mini.ToolBar.superclass.constructor.call(this)
};
mini.extend(mini.ToolBar, mini.Container, {
    _clearBorder : false,
    style : "",
    uiCls : "mini-toolbar",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-toolbar"
    },
    _initEvents : function() {
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        var b = mini.getChildNodes(this.el, true);
        for (var c = 0, a = b.length; c < a; c++) {
            mini.layout(b[c])
        }
    },
    set_bodyParent : function(a) {
        if (!a) {
            return
        }
        this.el = a;
        this.doLayout()
    },
    getAttrs : function(el) {
        var attrs = {};
        mini._ParseString(el, attrs, [ "id", "borderStyle", "data-options" ]);
        this.el = el;
        this.el.uid = this.uid;
        this.addCls(this.uiCls);
        var options = attrs["data-options"];
        if (options) {
            options = eval("(" + options + ")");
            if (options) {
                mini.copyTo(attrs, options)
            }
        }
        return attrs
    }
});
mini.regClass(mini.ToolBar, "toolbar");