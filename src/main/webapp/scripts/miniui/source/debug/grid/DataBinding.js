mini.DataBinding = function() {
    this._bindFields = [];
    this._bindForms = [];
    mini.DataBinding.superclass.constructor.call(this)
};
mini.extend(mini.DataBinding, mini.Component, {
    bindField : function(d, a, c, e, b) {
        d = mini.get(d);
        a = mini.get(a);
        if (!d || !a || !c) {
            return
        }
        var f = {
            control : d,
            source : a,
            field : c,
            convert : b,
            mode : e
        };
        this._bindFields.push(f);
        a.on("currentchanged", this.__OnCurrentChanged, this);
        d.on("valuechanged", this.__OnValueChanged, this)
    },
    bindForm : function(d, e, h, g) {
        d = mini.byId(d);
        e = mini.get(e);
        if (!d || !e) {
            return
        }
        var d = new mini.Form(d);
        var b = d.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var f = b[c];
            this.bindField(f, e, f.getName(), h, g)
        }
    },
    __OnCurrentChanged : function(g) {
        if (this._doSetting) {
            return
        }
        this._doSetting = true;
        this._currentRecord = g.record;
        var a = g.sender;
        var f = g.record;
        for (var d = 0, b = this._bindFields.length; d < b; d++) {
            var h = this._bindFields[d];
            if (h.source != a) {
                continue
            }
            var c = h.control;
            var k = h.field;
            if (c.setValue) {
                if (f) {
                    var m = f[k];
                    c.setValue(m)
                } else {
                    c.setValue("")
                }
            }
            if (c.setText && c.textName) {
                if (f) {
                    c.setText(f[c.textName])
                } else {
                    c.setText("")
                }
            }
        }
        var j = this;
        setTimeout(function() {
            j._doSetting = false
        }, 10)
    },
    __OnValueChanged : function(g) {
        if (this._doSetting) {
            return
        }
        this._doSetting = true;
        var d = g.sender;
        var m = d.getValue();
        for (var f = 0, b = this._bindFields.length; f < b; f++) {
            var j = this._bindFields[f];
            if (j.control != d || j.mode === false) {
                continue
            }
            var a = j.source;
            var h = this._currentRecord;
            if (!h) {
                continue
            }
            var c = {};
            c[j.field] = m;
            if (d.getText && d.textName) {
                c[d.textName] = d.getText()
            }
            a.updateRow(h, c)
        }
        var k = this;
        setTimeout(function() {
            k._doSetting = false
        }, 10)
    }
});
mini.regClass(mini.DataBinding, "databinding");