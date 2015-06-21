/**
 * @class
 * @extends mini.ValidatorBase
 * @constructor
 */
mini.ButtonEdit = function() {
    mini.ButtonEdit.superclass.constructor.call(this);
    var a = this.isReadOnly();
    if (a || this.allowInput == false) {
        this._textEl.readOnly = true
    }
    if (this.enabled == false) {
        this.addCls(this._disabledCls)
    }
    if (a) {
        this.addCls(this._readOnlyCls)
    }
    if (this.required) {
        this.addCls(this._requiredCls)
    }
};
mini.extend(mini.ButtonEdit, mini.ValidatorBase, {
    name : "",
    formField : true,
    selectOnFocus : false,
    showClose : false,
    emptyText : "",
    defaultValue : "",
    defaultText : "",
    value : "",
    text : "",
    maxLength : 1000,
    minLength : 0,
    height : 21,
    inputAsValue : false,
    allowInput : true,
    _noInputCls : "mini-buttonedit-noInput",
    _readOnlyCls : "mini-buttonedit-readOnly",
    _disabledCls : "mini-buttonedit-disabled",
    _emptyCls : "mini-buttonedit-empty",
    _focusCls : "mini-buttonedit-focus",
    _buttonCls : "mini-buttonedit-button",
    _buttonHoverCls : "mini-buttonedit-button-hover",
    _buttonPressedCls : "mini-buttonedit-button-pressed",
    _closeCls : "mini-buttonedit-close",
    set : function(b) {
        if (typeof b == "string") {
            return this
        }
        var a = b.value;
        delete b.value;
        var c = b.text;
        delete b.text;
        this._allowUpdate = !(b.enabled == false
                || b.allowInput == false || b.readOnly);
        mini.ButtonEdit.superclass.set.call(this, b);
        if (this._allowUpdate === false) {
            this._allowUpdate = true;
            this.doUpdate()
        }
        if (!mini.isNull(c)) {
            this.setText(c)
        }
        if (!mini.isNull(a)) {
            this.setValue(a)
        }
        return this
    },
    uiCls : "mini-buttonedit",
    _getButtonsHTML : function() {
        var a = '<span class="mini-buttonedit-close"></span>'
                + this._getButtonHtml();
        return '<span class="mini-buttonedit-buttons">' + a
                + "</span>"
    },
    _getButtonHtml : function() {
        var a = "onmouseover=\"mini.addClass(this, '"
                + this._buttonHoverCls
                + "');\" onmouseout=\"mini.removeClass(this, '"
                + this._buttonHoverCls + "');\"";
        return '<span class="mini-buttonedit-button" '
                + a
                + '><span class="mini-buttonedit-icon"></span></span>'
    },
    _create : function() {
        this.el = document.createElement("span");
        this.el.className = "mini-buttonedit";
        var a = this._getButtonsHTML();
        this.el.innerHTML = '<span class="mini-buttonedit-border"><input type="input" class="mini-buttonedit-input" autocomplete="off"/>'
                + a
                + '</span><input name="'
                + this.name
                + '" type="hidden"/>';
        this._borderEl = this.el.firstChild;
        this._textEl = this._borderEl.firstChild;
        this._valueEl = this.el.lastChild;
        this._buttonsEl = this._borderEl.lastChild;
        this._buttonEl = this._buttonsEl.lastChild;
        this._closeEl = this._buttonEl.previousSibling;
        this._doEmpty()
    },
    destroy : function(a) {
        if (this.el) {
            this.el.onmousedown = null;
            this.el.onmousewheel = null;
            this.el.onmouseover = null;
            this.el.onmouseout = null
        }
        if (this._textEl) {
            this._textEl.onchange = null;
            this._textEl.onfocus = null;
            mini.clearEvent(this._textEl);
            this._textEl = null
        }
        mini.ButtonEdit.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "mousedown",
                    this.__OnMouseDown, this);
            mini_onOne(this._textEl, "focus", this.__OnFocus,
                    this);
            mini_onOne(this._textEl, "change",
                    this.__OnInputTextChanged, this);
            var a = this.text;
            this.text = null;
            if (this.el) {
                this.setText(a)
            }
        }, this)
    },
    _inputEventsInited : false,
    _initInputEvents : function() {
        if (this._inputEventsInited) {
            return
        }
        this._inputEventsInited = true;
        mini.on(this.el, "click", this.__OnClick, this);
        mini.on(this._textEl, "blur", this.__OnBlur, this);
        mini.on(this._textEl, "keydown", this.__OnInputKeyDown,
                this);
        mini.on(this._textEl, "keyup", this.__OnInputKeyUp,
                this);
        mini.on(this._textEl, "keypress",
                this.__OnInputKeyPress, this)
    },
    _buttonWidth : 20,
    _closeWidth : 20,
    _doInputLayout : function(b) {
        if (this._closeEl) {
            this._closeEl.style.display = this.showClose ? "inline-block"
                    : "none"
        }
        var a = this._buttonsEl.offsetWidth + 2;
        if (a == 2) {
            this._noLayout = true
        } else {
            this._noLayout = false
        }
        this._borderEl.style.paddingRight = a + "px";
        if (b !== false) {
            this.doLayout()
        }
    },
    doLayout : function() {
        if (this._noLayout) {
            this._doInputLayout(false)
        }
        if (this._doLabelLayout) {
            this._labelLayout()
        }
    },
    setHeight : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.height = a
    },
    focus : function() {
        try {
            this._textEl.focus();
            var a = this;
            setTimeout(function() {
                if (a._focused) {
                    a._textEl.focus()
                }
            }, 10)
        } catch (b) {
        }
    },
    blur : function() {
        try {
            this._textEl.blur()
        } catch (a) {
        }
    },
    selectText : function() {
        this._textEl.select()
    },
    getTextEl : function() {
        return this._textEl
    },
    setName : function(a) {
        this.name = a;
        if (this._valueEl) {
            mini.setAttr(this._valueEl, "name", this.name)
        }
    },
    /**
     * 
     * function setText(text)
     * @member mini.ButtonEdit
     * @param {String} text
     *
     */
    setText : function(b) {
        if (b === null || b === undefined) {
            b = ""
        }
        var a = this.text !== b;
        this.text = b;
        this._textEl.value = b;
        this._doEmpty()
    },
    /**
     * 
     * function getText()
     * @member mini.ButtonEdit
     * @returns {String}
     *
     */
    getText : function() {
        var a = this._textEl.value;
        return a
    },

    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.ButtonEdit
     * @param  value
     *
     */
    setValue : function(b) {
        if (b === null || b === undefined) {
            b = ""
        }
        var a = this.value !== b;
        this.value = b;
        this._valueEl.value = this.getFormValue()
    },
    /**
     * 获取值<br/>
     * function getValue()
     * @member mini.ButtonEdit
     * @returns {String}
     *
     */
    getValue : function() {
        return this.value
    },
    /**
     * 获取表单值<br/>
     * function getFormValue()
     * @member mini.ButtonEdit
     * @returns {String}
     *
     */
    getFormValue : function() {
        var a = this.value;
        if (a === null || a === undefined) {
            a = ""
        }
        return String(a)
    },
    _doEmpty : function() {
        this._textEl.placeholder = this.emptyText;
        if (this.emptyText) {
            mini._placeholder(this._textEl)
        }
    },
    setEmptyText : function(a) {
        if (this.emptyText != a) {
            this.emptyText = a;
            this._doEmpty()
        }
    },
    getEmptyText : function() {
        return this.emptyText
    },
    /**
     * 
     * function setMaxLength(maxLength)
     * @member mini.ButtonEdit
     * @param {Number} maxLength
     *
     */
    setMaxLength : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            return
        }
        this.maxLength = a;
        this._textEl.maxLength = a
    },
    /**
     * 
     * function getMaxLength()
     * @member mini.ButtonEdit
     * @returns {Number}
     *
     */
    getMaxLength : function() {
        return this.maxLength
    },
    /**
     * 
     * function setMinLength(minLength)
     * @member mini.ButtonEdit
     * @param {Number} minLength
     *
     */
    setMinLength : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            return
        }
        this.minLength = a
    },
    /**
     * 
     * function getMinLength()
     * @member mini.ButtonEdit
     * @returns {Number}
     *
     */
    getMinLength : function() {
        return this.minLength
    },
    setEnabled : function(a) {
        mini.ButtonEdit.superclass.setEnabled.call(this, a)
    },
    _doReadOnly : function() {
        var a = this.isReadOnly();
        if (a || this.allowInput == false) {
            this._textEl.readOnly = true
        } else {
            this._textEl.readOnly = false
        }
        if (a) {
            this.addCls(this._readOnlyCls)
        } else {
            this.removeCls(this._readOnlyCls)
        }
        if (this.allowInput) {
            this.removeCls(this._noInputCls)
        } else {
            this.addCls(this._noInputCls)
        }
        if (this.enabled) {
            this._textEl.disabled = false
        } else {
            this._textEl.disabled = true
        }
    },
    /**
     * 
     * function setAllowInput(allowInput)
     * @member mini.ButtonEdit
     * @param {Boolean} allowInput
     *
     */
    setAllowInput : function(a) {
        this.allowInput = a;
        this._doReadOnly()
    },
    /**
     * 
     * function getAllowInput()
     * @member mini.ButtonEdit
     * @returns {Boolean}
     *
     */
    getAllowInput : function() {
        return this.allowInput
    },
    setInputAsValue : function(a) {
        this.inputAsValue = a
    },
    getInputAsValue : function() {
        return this.inputAsValue
    },
    _errorIconEl : null,
    getErrorIconEl : function() {
        if (!this._errorIconEl) {
            this._errorIconEl = mini.append(this.el,
                    '<span class="mini-errorIcon"></span>')
        }
        return this._errorIconEl
    },
    _RemoveErrorIcon : function() {
        if (this._errorIconEl) {
            var a = this._errorIconEl;
            jQuery(a).remove()
        }
        this._errorIconEl = null
    },
    __OnClick : function(b) {
        if (this.enabled == false) {
            return
        }
        this.fire("click", {
            htmlEvent : b
        });
        if (this.isReadOnly()) {
            return
        }
        if (!mini.isAncestor(this._borderEl, b.target)) {
            return
        }
        var a = new Date();
        if (mini.isAncestor(this._buttonEl, b.target)) {
            this._OnButtonClick(b)
        }
        if (mini.findParent(b.target, this._closeCls)) {
            this.fire("closeclick", {
                htmlEvent : b
            })
        }
    },
    __OnMouseDown : function(c) {
        if (this.isReadOnly() || this.enabled == false) {
            return
        }
        if (!mini.isAncestor(this._borderEl, c.target)) {
            return
        }
        if (!mini.isAncestor(this._textEl, c.target)) {
            this._clickTarget = c.target;
            var b = this;
            setTimeout(function() {
                b.focus();
                mini.selectRange(b._textEl, 1000, 1000)
            }, 1);
            if (mini.isAncestor(this._buttonEl, c.target)) {
                var a = mini.findParent(c.target,
                        "mini-buttonedit-up");
                var d = mini.findParent(c.target,
                        "mini-buttonedit-down");
                if (a) {
                    mini.addClass(a, this._buttonPressedCls);
                    this._OnButtonMouseDown(c, "up")
                } else {
                    if (d) {
                        mini
                                .addClass(d,
                                        this._buttonPressedCls);
                        this._OnButtonMouseDown(c, "down")
                    } else {
                        mini.addClass(this._buttonEl,
                                this._buttonPressedCls);
                        this._OnButtonMouseDown(c)
                    }
                }
                mini.on(document, "mouseup",
                        this.__OnDocMouseUp, this)
            }
        }
    },
    __OnDocMouseUp : function(b) {
        this._clickTarget = null;
        var a = this;
        setTimeout(function() {
            var e = a._buttonEl.getElementsByTagName("*");
            for (var d = 0, c = e.length; d < c; d++) {
                mini.removeClass(e[d], a._buttonPressedCls)
            }
            mini.removeClass(a._buttonEl, a._buttonPressedCls);
            mini.removeClass(a.el, a._pressedCls)
        }, 80);
        mini.un(document, "mouseup", this.__OnDocMouseUp, this)
    },
    __OnFocus : function(a) {
        this.doUpdate();
        this._initInputEvents();
        if (this.isReadOnly()) {
            return
        }
        this._focused = true;
        this.addCls(this._focusCls);
        if (this.selectOnFocus) {
            this.selectText()
        }
        this.fire("focus", {
            htmlEvent : a
        })
    },
    __doFocusCls : function() {
        if (this._focused == false) {
            this.removeCls(this._focusCls)
        }
    },
    __fireBlur : function(c) {
        var a = this;
        function b() {
            if (a._focused == false) {
                a.removeCls(a._focusCls);
                if (a.validateOnLeave && a.isEditable()) {
                    a._tryValidate()
                }
                this.fire("blur", {
                    htmlEvent : c
                })
            }
        }
        setTimeout(function() {
            b.call(a)
        }, 2)
    },
    __OnBlur : function(b) {
        var a = this;
        a._focused = false;
        setTimeout(function() {
            a.__fireBlur(b)
        }, 10)
    },
    __OnInputKeyDown : function(d) {
        var a = {
            htmlEvent : d
        };
        this.fire("keydown", a);
        if (d.keyCode == 8
                && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (d.keyCode == 27 || d.keyCode == 13
                || d.keyCode == 9) {
            var c = this;
            c.__OnInputTextChanged(null);
            if (d.keyCode == 13) {
                var b = this;
                b.fire("enter", a)
            }
        }
        if (d.keyCode == 27) {
            d.preventDefault()
        }
    },
    __OnInputTextChanged : function() {
        var a = this._textEl.value;
        if (a == this.text) {
            return
        }
        var b = this.getValue();
        this.setText(a);
        this.setValue(a);
        if (b !== this.getFormValue()) {
            this._OnValueChanged()
        }
    },
    __OnInputKeyUp : function(a) {
        this.fire("keyup", {
            htmlEvent : a
        })
    },
    __OnInputKeyPress : function(a) {
        this.fire("keypress", {
            htmlEvent : a
        })
    },
    _OnButtonClick : function(a) {
        var b = {
            htmlEvent : a,
            cancel : false
        };
        this.fire("beforebuttonclick", b);
        if (b.cancel == true) {
            return
        }
        this.fire("buttonclick", b)
    },
    _OnButtonMouseDown : function(a, b) {
        this.focus();
        this.addCls(this._focusCls);
        this.fire("buttonmousedown", {
            htmlEvent : a,
            spinType : b
        })
    },
    onButtonClick : function(b, a) {
        this.on("buttonclick", b, a)
    },
    onButtonMouseDown : function(b, a) {
        this.on("buttonmousedown", b, a)
    },
    onTextChanged : function(b, a) {
        this.on("textchanged", b, a)
    },
    textName : "",
    /**
     * 
     * function setTextName(textName)
     * @member mini.ButtonEdit
     * @param {String} textName
     *
     */
    setTextName : function(a) {
        this.textName = a;
        if (this._textEl) {
            mini.setAttr(this._textEl, "name", this.textName)
        }
    },
    /**
     * 
     * function getTextName()
     * @member mini.ButtonEdit
     * @returns {String}
     *
     */
    getTextName : function() {
        return this.textName
    },
    /**
     * 
     * function setSelectOnFocus(selectOnFocus)
     * @member mini.ButtonEdit
     * @param {Boolean} selectOnFocus
     *
     */
    setSelectOnFocus : function(a) {
        this.selectOnFocus = a
    },
    /**
     * 
     * function getSelectOnFocus()
     * @member mini.ButtonEdit
     * @returns {Boolean}
     *
     */
    getSelectOnFocus : function(a) {
        return this.selectOnFocus
    },
    /**
     * 
     * function setShowClose(showClose)
     * @member mini.ButtonEdit
     * @param {Boolean} showClose
     *
     */
    setShowClose : function(a) {
        this.showClose = a;
        this._doInputLayout()
    },
    /**
     * 
     * function getShowClose()
     * @member mini.ButtonEdit
     * @returns {Boolean}
     *
     */
    getShowClose : function(a) {
        return this.showClose
    },
    inputStyle : "",
    setInputStyle : function(a) {
        this.inputStyle = a;
        mini.setStyle(this._textEl, a)
    },
    getAttrs : function(b) {
        var a = mini.ButtonEdit.superclass.getAttrs.call(this,
                b);
        var c = jQuery(b);
        mini._ParseString(b, a,
                [ "value", "text", "textName", "emptyText",
                        "inputStyle", "defaultText", "onenter",
                        "onkeydown", "onkeyup", "onkeypress",
                        "onbuttonclick", "onbuttonmousedown",
                        "ontextchanged", "onfocus", "onblur",
                        "oncloseclick", "onclick" ]);
        mini._ParseBool(b, a, [ "allowInput", "inputAsValue",
                "selectOnFocus", "showClose" ]);
        mini._ParseInt(b, a, [ "maxLength", "minLength" ]);
        return a
    }
});
mini.regClass(mini.ButtonEdit, "buttonedit");