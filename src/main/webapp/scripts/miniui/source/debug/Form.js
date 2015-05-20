mini.Form = function(a) {
    this.el = mini.byId(a);
    if (!this.el) {
        throw new Error("form element not null")
    }
    mini.Form.superclass.constructor.call(this)
};
mini.extend(mini.Form, mini.Component, {
    el : null,
    getFields : function() {
        if (!this.el) {
            return []
        }
        var a = mini.findControls(function(b) {
            if (!b.el || b.formField != true) {
                return false
            }
            if (mini.isAncestor(this.el, b.el)) {
                return true
            }
            return false
        }, this);
        return a
    },
    getFieldsMap : function() {
        var a = this.getFields();
        var e = {};
        for (var c = 0, b = a.length; c < b; c++) {
            var d = a[c];
            if (d.name) {
                e[d.name] = d
            }
        }
        return e
    },
    getField : function(a) {
        if (!this.el) {
            return null
        }
        return mini.getbyName(a, this.el)
    },
    getData : function(c, j) {
        if (mini.isNull(j)) {
            j = true
        }
        var g = c ? "getFormValue" : "getValue";
        var h = this.getFields();
        var d = {};
        for (var e = 0, a = h.length; e < a; e++) {
            var b = h[e];
            var f = b[g];
            if (!f) {
                continue
            }
            if (b.name) {
                if (j == true) {
                    mini._setMap(b.name, f.call(b), d)
                } else {
                    d[b.name] = f.call(b)
                }
            }
            if (b.textName && b.getText) {
                if (j == true) {
                    mini._setMap(b.textName, b.getText(), d)
                } else {
                    d[b.textName] = b.getText()
                }
            }
        }
        return d
    },
    setData : function(d, e, a) {
        if (mini.isNull(a)) {
            a = true
        }
        if (typeof d != "object") {
            d = {}
        }
        var g = this.getFieldsMap();
        for ( var c in g) {
            var f = g[c];
            if (!f) {
                continue
            }
            if (f.setValue) {
                var b = d[c];
                if (a == true) {
                    b = mini._getMap(c, d)
                }
                if (b === undefined && e === false) {
                    continue
                }
                if (b === null) {
                    b = ""
                }
                f.setValue(b)
            }
            if (f.setText && f.textName) {
                var h = d[f.textName];
                if (a == true) {
                    h = mini._getMap(f.textName, d)
                }
                if (mini.isNull(h)) {
                    h = ""
                }
                f.setText(h)
            }
        }
    },
    reset : function() {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setValue) {
                continue
            }
            if (d.setText && d._clearText !== false) {
                var e = d.defaultText;
                if (mini.isNull(e)) {
                    e = ""
                }
                d.setText(e)
            }
            d.setValue(d.defaultValue)
        }
        this.setIsValid(true)
    },
    clear : function() {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setValue) {
                continue
            }
            if (d.setText && d._clearText !== false) {
                d.setText("")
            }
            d.setValue("")
        }
        this.setIsValid(true)
    },
    getValidateFields : function() {
        function c(g) {
            return g.isDisplay(function(h) {
                if (mini.hasClass(h, "mini-tabs-body")) {
                    return true
                }
            })
        }
        var a = [];
        var d = this.getFields();
        for (var e = 0, b = d.length; e < b; e++) {
            var f = d[e];
            if (!f.validate || !f.isDisplay) {
                continue
            }
            if (c(f)) {
                a.push(f)
            }
        }
        return a
    },
    validate : function(e) {
        var c = this.getValidateFields();
        for (var d = 0, b = c.length; d < b; d++) {
            var f = c[d];
            var a = f.validate();
            if (a == false && e === false) {
                break
            }
        }
        return this.isValid()
    },
    isValid : function() {
        var b = this.getValidateFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (d.isValid() == false) {
                return false
            }
        }
        return true
    },
    setIsValid : function(e) {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setIsValid) {
                continue
            }
            d.setIsValid(e)
        }
    },
    getErrorTexts : function() {
        var a = [];
        var e = this.getErrors();
        for (var c = 0, b = e.length; c < b; c++) {
            var d = e[c];
            a.push(d.errorText)
        }
        return a
    },
    getErrors : function() {
        var e = [];
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.isValid) {
                continue
            }
            if (d.isValid() == false) {
                e.push(d)
            }
        }
        return e
    },
    mask : function(a) {
        if (typeof a == "string") {
            a = {
                html : a
            }
        }
        a = a || {};
        a.el = this.el;
        if (!a.cls) {
            a.cls = this._maskCls
        }
        mini.mask(a)
    },
    unmask : function() {
        mini.unmask(this.el)
    },
    _maskCls : "mini-mask-loading",
    loadingMsg : "数据加载中，请稍后...",
    loading : function(a) {
        this.mask(a || this.loadingMsg)
    },
    __OnValueChanged : function(a) {
        this._changed = true
    },
    _changed : false,
    setChanged : function(d) {
        this._changed = d;
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var e = b[c];
            e.on("valuechanged", this.__OnValueChanged, this)
        }
    },
    isChanged : function() {
        return this._changed
    },
    setEnabled : function(d) {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var e = b[c];
            e.setEnabled(d)
        }
    }
});