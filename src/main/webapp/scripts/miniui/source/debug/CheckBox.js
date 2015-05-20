mini.CheckBox = function() {
    mini.CheckBox.superclass.constructor.call(this)
};
mini.extend(mini.CheckBox, mini.Control, {
    formField : true,
    _clearText : false,
    text : "",
    checked : false,
    defaultValue : false,
    trueValue : true,
    falseValue : false,
    uiCls : "mini-checkbox",
    _create : function() {
        var a = this.uid + "$check";
        this.el = document.createElement("span");
        this.el.className = "mini-checkbox";
        this.el.innerHTML = '<input id="' + a + '" name="' + this.id
                + '" type="checkbox" class="mini-checkbox-check"><label for="'
                + a + '" onclick="return false;">' + this.text + "</label>";
        this._checkEl = this.el.firstChild;
        this._labelEl = this.el.lastChild
    },
    destroy : function(a) {
        if (this._checkEl) {
            this._checkEl.onmouseup = null;
            this._checkEl.onclick = null;
            this._checkEl = null
        }
        mini.CheckBox.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini.on(this.el, "click", this.__onClick, this);
            this._checkEl.onmouseup = function() {
                return false
            };
            var a = this;
            this._checkEl.onclick = function() {
                if (a.isReadOnly()) {
                    return false
                }
            }
        }, this)
    },
    setName : function(a) {
        this.name = a;
        mini.setAttr(this._checkEl, "name", this.name)
    },
    setText : function(a) {
        if (this.text !== a) {
            this.text = a;
            this._labelEl.innerHTML = a
        }
    },
    getText : function() {
        return this.text
    },
    setChecked : function(a) {
        if (a === true) {
            a = true
        } else {
            if (a == this.trueValue) {
                a = true
            } else {
                if (a == "true") {
                    a = true
                } else {
                    if (a === 1) {
                        a = true
                    } else {
                        if (a == "Y") {
                            a = true
                        } else {
                            a = false
                        }
                    }
                }
            }
        }
        if (this.checked !== a) {
            this.checked = !!a;
            this._checkEl.checked = this.checked;
            this.value = this.getValue()
        }
    },
    getChecked : function() {
        return this.checked
    },
    setValue : function(a) {
        if (this.checked !== a) {
            this.setChecked(a);
            this.value = this.getValue()
        }
    },
    getValue : function() {
        return String(this.checked == true ? this.trueValue : this.falseValue)
    },
    getFormValue : function() {
        return this.getValue()
    },
    setTrueValue : function(a) {
        this._checkEl.value = a;
        this.trueValue = a
    },
    getTrueValue : function() {
        return this.trueValue
    },
    setFalseValue : function(a) {
        this.falseValue = a
    },
    getFalseValue : function() {
        return this.falseValue
    },
    __onClick : function(a) {
        if (this.isReadOnly()) {
            return
        }
        this.setChecked(!this.checked);
        this.fire("checkedchanged", {
            checked : this.checked
        });
        this.fire("valuechanged", {
            value : this.getValue()
        });
        this.fire("click", a, this)
    },
    getAttrs : function(c) {
        var b = mini.CheckBox.superclass.getAttrs.call(this, c);
        var f = jQuery(c);
        b.text = c.innerHTML;
        mini._ParseString(c, b, [ "text", "oncheckedchanged", "onclick",
                "onvaluechanged" ]);
        mini._ParseBool(c, b, [ "enabled" ]);
        var e = mini.getAttr(c, "checked");
        if (e) {
            b.checked = (e == "true" || e == "checked") ? true : false
        }
        var a = f.attr("trueValue");
        if (a) {
            b.trueValue = a;
            a = parseInt(a);
            if (!isNaN(a)) {
                b.trueValue = a
            }
        }
        var d = f.attr("falseValue");
        if (d) {
            b.falseValue = d;
            d = parseInt(d);
            if (!isNaN(d)) {
                b.falseValue = d
            }
        }
        return b
    }
});
mini.regClass(mini.CheckBox, "checkbox");