mini.Include = function() {
    mini.Include.superclass.constructor.call(this)
};
mini.extend(mini.Include, mini.Control, {
    url : "",
    uiCls : "mini-include",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-include"
    },
    _initEvents : function() {
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        var d = this.el.childNodes;
        if (d) {
            for (var b = 0, a = d.length; b < a; b++) {
                var c = d[b];
                mini.layout(c)
            }
        }
    },
    setUrl : function(a) {
        this.url = a;
        mini.update({
            url : this.url,
            el : this.el,
            async : this.async
        });
        this.doLayout()
    },
    getUrl : function(a) {
        return this.url
    },
    getAttrs : function(b) {
        var a = mini.Include.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "url" ]);
        return a
    }
});
mini.regClass(mini.Include, "include");