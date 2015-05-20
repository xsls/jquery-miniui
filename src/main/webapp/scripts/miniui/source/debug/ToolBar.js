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