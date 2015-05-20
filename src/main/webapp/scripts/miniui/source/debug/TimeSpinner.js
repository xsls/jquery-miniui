mini.TimeSpinner = function() {
    mini.TimeSpinner.superclass.constructor.call(this);
    this.setValue("00:00:00")
};
mini
        .extend(
                mini.TimeSpinner,
                mini.ButtonEdit,
                {
                    value : null,
                    format : "H:mm:ss",
                    uiCls : "mini-timespinner",
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
                        mini.TimeSpinner.superclass._initEvents.call(this);
                        mini._BindEvents(function() {
                            this.on("buttonmousedown",
                                    this.__OnButtonMouseDown, this);
                            mini.on(this.el, "mousewheel", this.__OnMousewheel,
                                    this);
                            mini.on(this._textEl, "keydown", this.__OnKeyDown,
                                    this)
                        }, this)
                    },
                    setFormat : function(b) {
                        if (typeof b != "string") {
                            return
                        }
                        var a = [ "H:mm:ss", "HH:mm:ss", "H:mm", "HH:mm", "H",
                                "HH", "mm:ss" ];
                        if (this.format != b) {
                            this.format = b;
                            this.text = this._textEl.value = this
                                    .getFormattedValue()
                        }
                    },
                    getFormat : function() {
                        return this.format
                    },
                    setValue : function(a) {
                        a = mini.parseTime(a, this.format);
                        if (!a) {
                            a = null
                        }
                        if (mini.isDate(a)) {
                            a = new Date(a.getTime())
                        }
                        this.value = a;
                        this.text = this._textEl.value = this
                                .getFormattedValue();
                        this._valueEl.value = this.getFormValue()
                    },
                    getValue : function() {
                        return this.value == null ? null : new Date(this.value
                                .getTime())
                    },
                    getFormValue : function() {
                        if (!this.value) {
                            return ""
                        }
                        return mini.formatDate(this.value, this.format)
                    },
                    getFormattedValue : function() {
                        if (!this.value) {
                            return ""
                        }
                        return mini.formatDate(this.value, this.format)
                    },
                    _ChangeValue : function(a, e) {
                        var d = this.getValue();
                        if (d) {
                            switch (e) {
                            case "hours":
                                var b = d.getHours() + a;
                                if (b > 23) {
                                    b = 23
                                }
                                if (b < 0) {
                                    b = 0
                                }
                                d.setHours(b);
                                break;
                            case "minutes":
                                var c = d.getMinutes() + a;
                                if (c > 59) {
                                    c = 59
                                }
                                if (c < 0) {
                                    c = 0
                                }
                                d.setMinutes(c);
                                break;
                            case "seconds":
                                var f = d.getSeconds() + a;
                                if (f > 59) {
                                    f = 59
                                }
                                if (f < 0) {
                                    f = 0
                                }
                                d.setSeconds(f);
                                break
                            }
                        } else {
                            d = "00:00:00"
                        }
                        this.setValue(d)
                    },
                    _SpinTimer : null,
                    _StartSpin : function(a, f, e) {
                        this._StopSpin();
                        this._ChangeValue(a, this._timeType);
                        var d = this;
                        var c = e;
                        var b = new Date();
                        this._SpinTimer = setInterval(function() {
                            d._ChangeValue(a, d._timeType);
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
                        this._DownValue = this.getFormValue();
                        this._timeType = "hours";
                        if (a.spinType == "up") {
                            this._StartSpin(1, 230, 2)
                        } else {
                            this._StartSpin(-1, 230, 2)
                        }
                    },
                    _OnDocumentMouseUp : function(a) {
                        this._StopSpin();
                        mini.un(document, "mouseup", this._OnDocumentMouseUp,
                                this);
                        if (this._DownValue != this.getFormValue()) {
                            this._OnValueChanged()
                        }
                    },
                    __OnInputTextChanged : function(b) {
                        var a = this.getFormValue();
                        this.setValue(this._textEl.value);
                        if (a != this.getFormValue()) {
                            this._OnValueChanged()
                        }
                    },
                    getAttrs : function(b) {
                        var a = mini.TimeSpinner.superclass.getAttrs.call(this,
                                b);
                        mini._ParseString(b, a, [ "format" ]);
                        return a
                    }
                });
mini.regClass(mini.TimeSpinner, "timespinner");