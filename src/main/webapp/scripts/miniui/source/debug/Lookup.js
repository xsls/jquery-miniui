mini.Lookup = function() {
    this.data = [];
    mini.Lookup.superclass.constructor.call(this);
    mini.on(this._textEl, "mouseup", this.__OnMouseUp, this);
    this.on("showpopup", this.__OnShowPopup, this)
};
mini.extend(mini.Lookup, mini.PopupEdit, {
    allowInput : true,
    valueField : "id",
    textField : "text",
    delimiter : ",",
    multiSelect : false,
    data : [],
    grid : null,
    _destroyPopup : false,
    uiCls : "mini-lookup",
    destroy : function(a) {
        if (this.grid) {
            this.grid.un("rowclick", this.__OnGridRowClickChanged, this);
            this.grid.un("load", this.__OnGridLoad, this);
            this.grid = null
        }
        mini.Lookup.superclass.destroy.call(this, a)
    },
    setMultiSelect : function(a) {
        this.multiSelect = a;
        if (this.grid) {
            this.grid.setMultiSelect(a)
        }
    },
    setGrid : function(a) {
        if (typeof a == "string") {
            mini.parse(a);
            a = mini.get(a)
        }
        this.grid = mini.getAndCreate(a);
        if (this.grid) {
            this.grid.setMultiSelect(this.multiSelect);
            this.grid.setCheckSelectOnLoad(false);
            this.grid.on("rowclick", this.__OnGridRowClickChanged, this);
            this.grid.on("load", this.__OnGridLoad, this);
            this.grid.on("checkall", this.__OnGridRowClickChanged, this)
        }
    },
    getGrid : function() {
        return this.grid
    },
    setValueField : function(a) {
        this.valueField = a
    },
    getValueField : function() {
        return this.valueField
    },
    setTextField : function(a) {
        this.textField = a
    },
    getTextField : function() {
        return this.textField
    },
    deselectAll : function() {
        this.data = [];
        this.setValue("");
        this.setText("");
        if (this.grid) {
            this.grid.deselectAll()
        }
    },
    getItemValue : function(a) {
        return String(a[this.valueField])
    },
    getItemText : function(b) {
        var a = b[this.textField];
        return mini.isNull(a) ? "" : String(a)
    },
    getValueAndText : function(d) {
        if (mini.isNull(d)) {
            d = []
        }
        var c = [];
        var f = [];
        for (var e = 0, b = d.length; e < b; e++) {
            var a = d[e];
            if (a) {
                c.push(this.getItemValue(a));
                f.push(this.getItemText(a))
            }
        }
        return [ c.join(this.delimiter), f.join(this.delimiter) ]
    },
    _createData : function() {
        this.value = mini.isNull(this.value) ? "" : String(this.value);
        this.text = mini.isNull(this.text) ? "" : String(this.text);
        var d = [];
        var g = this.value.split(this.delimiter);
        var b = this.text.split(this.delimiter);
        var f = g.length;
        if (this.value) {
            for (var e = 0, c = f; e < c; e++) {
                var j = {};
                var a = g[e];
                var h = b[e];
                j[this.valueField] = a ? a : "";
                j[this.textField] = h ? h : "";
                d.push(j)
            }
        }
        this.data = d
    },
    _getValueMaps : function(c) {
        var f = {};
        for (var b = 0, a = c.length; b < a; b++) {
            var d = c[b];
            var e = d[this.valueField];
            f[e] = d
        }
        return f
    },
    setValue : function(a) {
        mini.Lookup.superclass.setValue.call(this, a);
        this._createData()
    },
    setText : function(a) {
        mini.Lookup.superclass.setText.call(this, a);
        this._createData()
    },
    __OnGridRowClickChanged : function(g) {
        var k = this._getValueMaps(this.grid.getData());
        var d = this._getValueMaps(this.grid.getSelecteds());
        var j = this._getValueMaps(this.data);
        if (this.multiSelect == false) {
            j = {};
            this.data = []
        }
        var h = {};
        for ( var a in j) {
            var b = j[a];
            if (k[a]) {
                if (d[a]) {
                } else {
                    h[a] = b
                }
            }
        }
        for (var f = this.data.length - 1; f >= 0; f--) {
            var b = this.data[f];
            var a = b[this.valueField];
            if (h[a]) {
                this.data.removeAt(f)
            }
        }
        for ( var a in d) {
            var b = d[a];
            if (!j[a]) {
                this.data.push(b)
            }
        }
        var c = this.getValueAndText(this.data);
        this.setValue(c[0]);
        this.setText(c[1]);
        this._OnValueChanged()
    },
    __OnGridLoad : function(a) {
        this.__OnShowPopup(a)
    },
    __OnShowPopup : function(g) {
        var c = String(this.value).split(this.delimiter);
        var j = {};
        for (var f = 0, b = c.length; f < b; f++) {
            var h = c[f];
            j[h] = 1
        }
        var m = this.grid.getData();
        var d = [];
        for (var f = 0, b = m.length; f < b; f++) {
            var k = m[f];
            var a = k[this.valueField];
            if (j[a]) {
                d.push(k)
            }
        }
        this.grid.selects(d)
    },
    doUpdate : function() {
        mini.Lookup.superclass.doUpdate.call(this);
        this._textEl.readOnly = true;
        this.el.style.cursor = "default"
    },
    __OnInputKeyDown : function(a) {
        mini.Lookup.superclass.__OnInputKeyDown.call(this, a);
        switch (a.keyCode) {
        case 46:
        case 8:
            break;
        case 37:
            break;
        case 39:
            break
        }
    },
    __OnMouseUp : function(d) {
        if (this.isReadOnly()) {
            return
        }
        var c = mini.getSelectRange(this._textEl);
        var f = c[0], a = c[1];
        var b = this._findTextIndex(f)
    },
    _findTextIndex : function(g) {
        var c = -1;
        if (this.text == "") {
            return c
        }
        var e = String(this.text).split(this.delimiter);
        var a = 0;
        for (var d = 0, b = e.length; d < b; d++) {
            var f = e[d];
            if (a < g && g <= a + f.length) {
                c = d;
                break
            }
            a = a + f.length + 1
        }
        return c
    },
    getAttrs : function(b) {
        var a = mini.Lookup.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "grid", "valueField", "textField" ]);
        mini._ParseBool(b, a, [ "multiSelect" ]);
        return a
    }
});
mini.regClass(mini.Lookup, "lookup");