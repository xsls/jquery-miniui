/**
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.CheckBox = function() {
    mini.CheckBox.superclass.constructor.call(this)
};
mini.extend(mini.CheckBox, mini.Control, {
    /**
     * @cfg {Boolean} [formField=true] 是否为表单字段
     * @accessor
     * @member mini.CheckBox
     */
    formField : true,
    _clearText : false,
    /**
     * @cfg {String} [text=""] 文本
     * @accessor
     * @member mini.CheckBox
     */
    text : "",
    /**
     * @cfg {Boolean} [checked=false] 是否选中
     * @accessor
     * @member mini.CheckBox
     */
    checked : false,
    /**
     * @cfg {Boolean} [defaultValue=false] 默认值
     * @accessor
     * @member mini.CheckBox
     */
    defaultValue : false,
    /**
     * @cfg {Boolean} [trueValue=true] “真”值
     * @accessor
     * @member mini.CheckBox
     */
    trueValue : true,
    /**
     * @cfg {Boolean} [falseValue=false] “假”值
     * @accessor
     * @member mini.CheckBox
     */
    falseValue : false,
    /**
     * @property {String} [uiCls="mini-checkbox"] 控件样式类
     * @member mini.CheckBox
     */
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
    /**
     * @cfg {String} [value] 值
     * @accessor
     * @member mini.CheckBox
     */
    setValue : function(a) {
        if (this.checked !== a) {
            this.setChecked(a);
            this.value = this.getValue()
        }
    },
    getValue : function() {
        return String(this.checked == true ? this.trueValue : this.falseValue)
    },
    /**
     * 获取表单值
     * @member mini.CheckBox
     * @returns {String} 表单值
     */
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
    
    /**
     * @event checkedchanged 选中变化时发生的事件
     * @param {Object} event 当前事件对象
     * @param {Boolean} event.checked 是否选中
     * @member mini.CheckBox
     */
    
    /**
     * @event valuechanged 值改变时发生的事件
     * @param {Object} event 当前事件对象
     * @param {Object} event.value 改变后的值
     * @member mini.CheckBox
     */
    
    /**
     * @event click 单击事件
     * @param {Object} event 当前事件对象
     * @member mini.CheckBox
     */
    
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