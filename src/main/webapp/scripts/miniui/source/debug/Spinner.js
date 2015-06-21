/**
 * 数字输入框。
 * 
 *     @example
 *     &lt;input id="sp1" class="mini-spinner"  minValue="200" maxValue="250" /&gt;
 * 
 * @class
 * @extends mini.ButtonEdit
 * @constructor
 */
mini.Spinner = function() {
    mini.Spinner.superclass.constructor.call(this);
    this.setValue(this.minValue)
};
mini.extend(mini.Spinner, mini.ButtonEdit, {
    value : 0,
    minValue : 0,
    maxValue : 100,
    increment : 1,
    decimalPlaces : 0,
    changeOnMousewheel : true,
    allowLimitValue : true,
    set : function(b) {
        if (typeof b == "string") {
            return this
        }
        var a = b.value;
        delete b.value;
        mini.Spinner.superclass.set.call(this, b);
        if (!mini.isNull(a)) {
            this.setValue(a)
        }
        return this
    },
    uiCls : "mini-spinner",
    _getButtonHtml : function() {
        var a = "onmouseover=\"mini.addClass(this, '"
                + this._buttonHoverCls
                + "');\" onmouseout=\"mini.removeClass(this, '"
                + this._buttonHoverCls + "');\"";
        return '<span class="mini-buttonedit-button" '
                + a
                + '><span class="mini-buttonedit-up"><span></span></span><span class="mini-buttonedit-down"><span></span></span></span>'
    },
    _initEvents : function() {
        mini.Spinner.superclass._initEvents.call(this);
        mini._BindEvents(function() {
            this.on("buttonmousedown",
                    this.__OnButtonMouseDown, this);
            mini.on(this.el, "mousewheel", this.__OnMousewheel,
                    this)
        }, this)
    },
    _ValueLimit : function() {
        if (this.allowLimitValue == false) {
            return
        }
        if (mini.isNull(this.value) && this.allowNull) {
            return
        }
        if (this.minValue > this.maxValue) {
            this.maxValue = this.minValue + 100
        }
        if (this.value < this.minValue) {
            this.setValue(this.minValue)
        }
        if (this.value > this.maxValue) {
            this.setValue(this.maxValue)
        }
    },
    getFormValue : function() {
        var b = this.value;
        b = parseFloat(b);
        if (this.allowNull && isNaN(b)) {
            return ""
        }
        if (isNaN(b)) {
            b = 0
        }
        var f = String(b).split(".");
        var e = f[0], c = f[1];
        if (!c) {
            c = ""
        }
        if (this.decimalPlaces > 0) {
            for (var d = c.length, a = this.decimalPlaces; d < a; d++) {
                c += "0"
            }
            c = "." + c
        }
        return e + c
    },
    allowNull : false,
    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.Spinner
     * @param  value
     *
     */
    setValue : function(a) {
        a = parseFloat(a);
        if (isNaN(a)) {
            a = this.defaultValue
        }
        a = parseFloat(a);
        if (isNaN(a) && !this.allowNull) {
            a = this.minValue
        }
        if (isNaN(a) && this.allowNull) {
            a = null
        }
        if (a) {
            a = parseFloat(a.toFixed(this.decimalPlaces))
        }
        if (this.value != a) {
            this.value = a;
            this._ValueLimit();
            this._valueEl.value = this.value;
            this.text = this._textEl.value = this
                    .getFormValue()
        } else {
            this.text = this._textEl.value = this
                    .getFormValue()
        }
    },
    /**
     * 
     * function setMaxValue(maxValue)
     * @member mini.Spinner
     * @param {Number} maxValue
     *
     */
    setMaxValue : function(a) {
        a = parseFloat(a);
        if (isNaN(a)) {
            return
        }
        a = parseFloat(a.toFixed(this.decimalPlaces));
        if (this.maxValue != a) {
            this.maxValue = a;
            this._ValueLimit()
        }
    },
    /**
     * 
     * function getMaxValue()
     * @member mini.Spinner
     * @returns {Number}
     *
     */
    getMaxValue : function(a) {
        return this.maxValue
    },
    /**
     * 
     * function setMinValue(minValue)
     * @member mini.Spinner
     * @param {Number} minValue
     *
     */
    setMinValue : function(a) {
        a = parseFloat(a);
        if (isNaN(a)) {
            return
        }
        a = parseFloat(a.toFixed(this.decimalPlaces));
        if (this.minValue != a) {
            this.minValue = a;
            this._ValueLimit()
        }
    },
    /**
     * 
     * function getMinValue()
     * @member mini.Spinner
     * @returns {Number}
     *
     */
    getMinValue : function(a) {
        return this.minValue
    },
    /**
     * 
     * function setIncrement(increment)
     * @member mini.Spinner
     * @param {Number} increment
     *
     */
    setIncrement : function(a) {
        a = parseFloat(a);
        if (isNaN(a)) {
            return
        }
        if (this.increment != a) {
            this.increment = a
        }
    },
    /**
     * 
     * function getIncrement()
     * @member mini.Spinner
     * @returns {Number}
     *
     */
    getIncrement : function(a) {
        return this.increment
    },
    /**
     * 
     * function setDecimalPlaces(decimalPlaces)
     * @member mini.Spinner
     * @param {Number} decimalPlaces
     *
     */
    setDecimalPlaces : function(a) {
        a = parseInt(a);
        if (isNaN(a) || a < 0) {
            return
        }
        this.decimalPlaces = a
    },
    /**
     * 
     * function getDecimalPlaces()
     * @member mini.Spinner
     * @returns {Number}
     *
     */
    getDecimalPlaces : function(a) {
        return this.decimalPlaces
    },
    setChangeOnMousewheel : function(a) {
        this.changeOnMousewheel = a
    },
    getChangeOnMousewheel : function(a) {
        return this.changeOnMousewheel
    },
    setAllowLimitValue : function(a) {
        this.allowLimitValue = a
    },
    getAllowLimitValue : function(a) {
        return this.allowLimitValue
    },
    setAllowNull : function(a) {
        this.allowNull = a
    },
    getAllowNull : function(a) {
        return this.allowNull
    },
    _SpinTimer : null,
    _StartSpin : function(a, f, e) {
        this._StopSpin();
        this.setValue(this.value + a);
        var d = this;
        var c = e;
        var b = new Date();
        this._SpinTimer = setInterval(function() {
            d.setValue(d.value + a);
            d._OnValueChanged();
            e--;
            if (e == 0 && f > 50) {
                d._StartSpin(a, f - 100, c + 3)
            }
            var g = new Date();
            if (g - b > 500) {
                d._StopSpin()
            }
            b = g
        }, f);
        mini.on(document, "mouseup", this._OnDocumentMouseUp,
                this)
    },
    _StopSpin : function() {
        clearInterval(this._SpinTimer);
        this._SpinTimer = null
    },
    __OnButtonMouseDown : function(a) {
        this._DownValue = this.getValue();
        this.__OnInputTextChanged();
        if (a.spinType == "up") {
            this._StartSpin(this.increment, 230, 2)
        } else {
            this._StartSpin(-this.increment, 230, 2)
        }
    },
    __OnInputKeyDown : function(b) {
        mini.Spinner.superclass.__OnInputKeyDown.call(this, b);
        var a = mini.Keyboard;
        switch (b.keyCode) {
        case a.Top:
            this.setValue(this.value + this.increment);
            this._OnValueChanged();
            break;
        case a.Bottom:
            this.setValue(this.value - this.increment);
            this._OnValueChanged();
            break
        }
    },
    __OnMousewheel : function(c) {
        if (this.isReadOnly()) {
            return
        }
        if (this.changeOnMousewheel == false) {
            return
        }
        var b = c.wheelDelta || c.originalEvent.wheelDelta;
        if (mini.isNull(b)) {
            b = -c.detail * 24
        }
        var a = this.increment;
        if (b < 0) {
            a = -a
        }
        this.setValue(this.value + a);
        this._OnValueChanged();
        return false
    },
    _OnDocumentMouseUp : function(a) {
        this._StopSpin();
        mini.un(document, "mouseup", this._OnDocumentMouseUp,
                this);
        if (this._DownValue != this.getValue()) {
            this._OnValueChanged()
        }
    },
    __OnInputTextChanged : function(c) {
        var a = this.getValue();
        var b = parseFloat(this._textEl.value);
        this.setValue(b);
        if (a != this.getValue()) {
            this._OnValueChanged()
        }
    },
    getAttrs : function(b) {
        var a = mini.Spinner.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "minValue", "maxValue",
                "increment", "decimalPlaces" ]);
        mini._ParseBool(b, a, [ "allowLimitValue", "allowNull",
                "changeOnMousewheel" ]);
        return a
    }
});
mini.regClass(mini.Spinner, "spinner");