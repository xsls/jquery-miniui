mini.Box = function() {
    mini.Box.superclass.constructor.call(this)
};
mini.extend(mini.Box, mini.Container, {
    style : "",
    borderStyle : "",
    bodyStyle : "",
    uiCls : "mini-box",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-box";
        this.el.innerHTML = '<div class="mini-box-border"></div>';
        this._bodyEl = this._borderEl = this.el.firstChild;
        this._contentEl = this._bodyEl
    },
    _initEvents : function() {
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        var b = this.isAutoHeight();
        var g = this.isAutoWidth();
        var f = mini.getPaddings(this._bodyEl);
        var e = mini.getMargins(this._bodyEl);
        if (!b) {
            var d = this.getHeight(true);
            if (jQuery.boxModel) {
                d = d - f.top - f.bottom
            }
            d = d - e.top - e.bottom;
            if (d < 0) {
                d = 0
            }
            this._bodyEl.style.height = d + "px"
        } else {
            this._bodyEl.style.height = ""
        }
        var a = this.getWidth(true);
        var c = a;
        a = a - e.left - e.right;
        if (jQuery.boxModel) {
            a = a - f.left - f.right
        }
        if (a < 0) {
            a = 0
        }
        this._bodyEl.style.width = a + "px";
        mini.layout(this._borderEl);
        this.fire("layout")
    },
    setBody : function(c) {
        if (!c) {
            return
        }
        if (!mini.isArray(c)) {
            c = [ c ]
        }
        for (var b = 0, a = c.length; b < a; b++) {
            mini.append(this._bodyEl, c[b])
        }
        mini.parse(this._bodyEl);
        this.doLayout()
    },
    set_bodyParent : function(b) {
        if (!b) {
            return
        }
        var a = this._bodyEl;
        var c = b;
        while (c.firstChild) {
            a.appendChild(c.firstChild)
        }
        this.doLayout()
    },
    setBodyStyle : function(a) {
        mini.setStyle(this._bodyEl, a);
        this.doLayout()
    },
    getAttrs : function(b) {
        var a = mini.Box.superclass.getAttrs.call(this, b);
        a._bodyParent = b;
        mini._ParseString(b, a, [ "bodyStyle" ]);
        return a
    }
});
mini.regClass(mini.Box, "box");