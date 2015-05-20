mini.Fit = function() {
    mini.Fit.superclass.constructor.call(this)
};
mini.extend(mini.Fit, mini.Container, {
    style : "",
    _clearBorder : false,
    uiCls : "mini-fit",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-fit";
        this._bodyEl = this.el
    },
    _initEvents : function() {
    },
    isFixedSize : function() {
        return false
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        var k = this.el.parentNode;
        var p = mini.getChildNodes(k);
        if (k == document.body) {
            this.el.style.height = "0px"
        }
        var q = mini.getHeight(k, true);
        for (var g = 0, c = p.length; g < c; g++) {
            var b = p[g];
            var a = b.tagName ? b.tagName.toLowerCase() : "";
            if (b == this.el || (a == "style" || a == "script")) {
                continue
            }
            var n = mini.getStyle(b, "position");
            if (n == "absolute" || n == "fixed") {
                continue
            }
            var j = mini.getHeight(b);
            var f = mini.getMargins(b);
            q = q - j - f.top - f.bottom
        }
        var d = mini.getBorders(this.el);
        var o = mini.getPaddings(this.el);
        var f = mini.getMargins(this.el);
        q = q - f.top - f.bottom;
        if (jQuery.boxModel) {
            q = q - o.top - o.bottom - d.top - d.bottom
        }
        if (q < 0) {
            q = 0
        }
        this.el.style.height = q + "px";
        try {
            p = mini.getChildNodes(this.el);
            for (var g = 0, c = p.length; g < c; g++) {
                var b = p[g];
                mini.layout(b)
            }
        } catch (m) {
        }
    },
    set_bodyParent : function(b) {
        if (!b) {
            return
        }
        var a = this._bodyEl;
        var d = b;
        while (d.firstChild) {
            try {
                a.appendChild(d.firstChild)
            } catch (c) {
            }
        }
        this.doLayout()
    },
    getAttrs : function(b) {
        var a = mini.Fit.superclass.getAttrs.call(this, b);
        a._bodyParent = b;
        return a
    }
});
mini.regClass(mini.Fit, "fit");