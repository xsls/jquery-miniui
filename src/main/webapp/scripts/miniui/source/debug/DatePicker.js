/**
 * 日期选择输入框。
 * 
 *     @example
 *     &lt;input id="date1" class="mini-datepicker" value="2010-01-01" /&gt; 
 * 
 * @class
 * @extends mini.PopupEdit
 * @constructor
 */
mini.DatePicker = function() {
    mini.DatePicker.superclass.constructor.call(this);
    mini.addClass(this.el, "mini-datepicker");
    this.on("validation", this.__OnValidation, this)
};
mini.extend(mini.DatePicker, mini.PopupEdit, {
    valueFormat : "",
    format : "yyyy-MM-dd",
    maxDate : null,
    minDate : null,
    popupWidth : "",
    viewDate : new Date(),
    showTime : false,
    timeFormat : "H:mm",
    showTodayButton : true,
    showClearButton : true,
    showOkButton : false,
    uiCls : "mini-datepicker",
    _getCalendar : function() {
        if (!mini.DatePicker._Calendar) {
            var a = mini.DatePicker._Calendar = new mini.Calendar();
            a.setStyle("border:0;")
        }
        return mini.DatePicker._Calendar
    },
    destroy : function(a) {
        if (this._destroyPopup) {
            mini.DatePicker._Calendar = null
        }
        mini.DatePicker.superclass.destroy.call(this, a)
    },
    _createPopup : function() {
        mini.DatePicker.superclass._createPopup.call(this);
        this._calendar = this._getCalendar()
    },
    _monthPicker : false,
    showPopup : function() {
        var a = {
            cancel : false
        };
        this.fire("beforeshowpopup", a);
        if (a.cancel == true) {
            return
        }
        this._calendar = this._getCalendar();
        this._calendar.beginUpdate();
        this._calendar._allowLayout = false;
        if (this._calendar.el.parentNode != this.popup._contentEl) {
            this._calendar.render(this.popup._contentEl)
        }
        this._calendar.set({
            monthPicker : this._monthPicker,
            showTime : this.showTime,
            timeFormat : this.timeFormat,
            showClearButton : this.showClearButton,
            showTodayButton : this.showTodayButton,
            showOkButton : this.showOkButton,
            showWeekNumber : this.showWeekNumber
        });
        this._calendar.setValue(this.value);
        if (this.value) {
            this._calendar.setViewDate(this.value)
        } else {
            this._calendar.setViewDate(this.viewDate)
        }
        function c() {
            if (this._calendar._target) {
                var d = this._calendar._target;
                this._calendar.un("timechanged", d.__OnTimeChanged, d);
                this._calendar.un("dateclick", d.__OnDateClick, d);
                this._calendar.un("drawdate", d.__OnDrawDate, d)
            }
            this._calendar.on("timechanged", this.__OnTimeChanged, this);
            this._calendar.on("dateclick", this.__OnDateClick, this);
            this._calendar.on("drawdate", this.__OnDrawDate, this);
            this._calendar.endUpdate();
            this._calendar._allowLayout = true;
            this._calendar.doLayout();
            this._calendar.focus();
            this._calendar._target = this
        }
        var b = this;
        c.call(b);
        mini.DatePicker.superclass.showPopup.call(this)
    },
    hidePopup : function() {
        mini.DatePicker.superclass.hidePopup.call(this);
        this._calendar.un("timechanged", this.__OnTimeChanged, this);
        this._calendar.un("dateclick", this.__OnDateClick, this);
        this._calendar.un("drawdate", this.__OnDrawDate, this)
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        if (this._calendar.within(a)) {
            return true
        }
        return false
    },
    __OnPopupKeyDown : function(a) {
        if (a.keyCode == 13) {
            this.__OnDateClick()
        }
        if (a.keyCode == 27) {
            this.hidePopup();
            this.focus()
        }
    },
    minDateErrorText : "",
    maxDateErrorText : "",
    __OnValidation : function(d) {
        if (d.isValid == false) {
            return
        }
        var b = this.value;
        if (!mini.isDate(b)) {
            return
        }
        var g = mini.parseDate(this.maxDate);
        var c = mini.parseDate(this.minDate);
        var a = this.maxDateErrorText || mini.VTypes.maxDateErrorText;
        var f = this.minDateErrorText || mini.VTypes.minDateErrorText;
        if (mini.isDate(g)) {
            if (b.getTime() > g.getTime()) {
                d.isValid = false;
                d.errorText = String.format(a, mini.formatDate(g, this.format))
            }
        }
        if (mini.isDate(c)) {
            if (b.getTime() < c.getTime()) {
                d.isValid = false;
                d.errorText = String.format(f, mini.formatDate(c, this.format))
            }
        }
    },
    __OnDrawDate : function(c) {
        var a = c.date;
        var d = mini.parseDate(this.maxDate);
        var b = mini.parseDate(this.minDate);
        if (mini.isDate(d)) {
            if (a.getTime() > d.getTime()) {
                c.allowSelect = false
            }
        }
        if (mini.isDate(b)) {
            if (a.getTime() < b.getTime()) {
                c.allowSelect = false
            }
        }
        this.fire("drawdate", c)
    },
    __OnDateClick : function(c) {
        if (this.showOkButton && c.action != "ok") {
            return
        }
        var a = this._calendar.getValue();
        var b = this.getFormValue("U");
        this.setValue(a);
        if (b !== this.getFormValue("U")) {
            this._OnValueChanged()
        }
        this.hidePopup();
        this.focus()
    },
    __OnTimeChanged : function(b) {
        if (this.showOkButton) {
            return
        }
        var a = this._calendar.getValue();
        this.setValue(a);
        this._OnValueChanged()
    },
    /**
     * 
     * function setFormat(format)
     * @member mini.DatePicker
     * @param {String} format
     *
     */
    setFormat : function(a) {
        if (typeof a != "string") {
            return
        }
        if (this.format != a) {
            this.format = a;
            this._textEl.value = this._valueEl.value = this.getFormValue()
        }
    },
    /**
     * 
     * function getFormat()
     * @member mini.DatePicker
     * @returns {String}
     *
     */
    getFormat : function() {
        return this.format
    },
    setValueFormat : function(a) {
        if (typeof a != "string") {
            return
        }
        if (this.valueFormat != a) {
            this.valueFormat = a
        }
    },
    getValueFormat : function() {
        return this.valueFormat
    },
    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.DatePicker
     * @param  value
     *
     */
    setValue : function(a) {
        a = mini.parseDate(a);
        if (mini.isNull(a)) {
            a = ""
        }
        if (mini.isDate(a)) {
            a = new Date(a.getTime())
        }
        if (this.value != a) {
            this.value = a;
            this.text = this._textEl.value = this._valueEl.value = this
                    .getFormValue()
        }
    },
    nullValue : "",
    setNullValue : function(a) {
        if (a == "null") {
            a = null
        }
        this.nullValue = a
    },
    getNullValue : function() {
        return this.nullValue
    },
    /**
     * 获取值<br/>
     * function getValue()
     * @member mini.DatePicker
     *
     */
    getValue : function() {
        if (!mini.isDate(this.value)) {
            return this.nullValue
        }
        var a = this.value;
        if (this.valueFormat) {
            a = mini.formatDate(a, this.valueFormat)
        }
        return a
    },
    /**
     * 获取表单值<br/>
     * function getFormValue()
     * @member mini.DatePicker
     * @returns {String}
     *
     */
    getFormValue : function(a) {
        if (!mini.isDate(this.value)) {
            return ""
        }
        a = a || this.format;
        return mini.formatDate(this.value, a)
    },
    /**
     * 
     * function setViewDate(viewDate)
     * @member mini.DatePicker
     * @param {Date} viewDate
     *
     */
    setViewDate : function(a) {
        a = mini.parseDate(a);
        if (!mini.isDate(a)) {
            return
        }
        this.viewDate = a
    },
    /**
     * 
     * function getViewDate()
     * @member mini.DatePicker
     * @returns {Date}
     *
     */
    getViewDate : function() {
        return this._calendar.getViewDate()
    },
    /**
     * 
     * function setShowTime(showTime)
     * @member mini.DatePicker
     * @param {Boolean} showTime
     *
     */
    setShowTime : function(a) {
        if (this.showTime != a) {
            this.showTime = a
        }
    },
    /**
     * 
     * function getShowTime()
     * @member mini.DatePicker
     * @returns {Boolean}
     *
     */
    getShowTime : function() {
        return this.showTime
    },
    /**
     * 
     * function setTimeFormat(timeFormat)
     * @member mini.DatePicker
     * @param {String} timeFormat
     *
     */
    setTimeFormat : function(a) {
        if (this.timeFormat != a) {
            this.timeFormat = a
        }
    },
    /**
     * 
     * function getTimeFormat()
     * @member mini.DatePicker
     * @returns {String}
     *
     */
    getTimeFormat : function() {
        return this.timeFormat
    },
    /**
     * 
     * function setShowTodayButton(showTodayButton)
     * @member mini.DatePicker
     * @param {Boolean} showTodayButton
     *
     */
    setShowTodayButton : function(a) {
        this.showTodayButton = a
    },
    /**
     * 
     * function getShowTodayButton()
     * @member mini.DatePicker
     * @returns {Boolean}
     *
     */
    getShowTodayButton : function() {
        return this.showTodayButton
    },

    /**
     * 
     * function setShowClearButton(showClearButton)
     * @member mini.DatePicker
     * @param {Boolean} showClearButton
     *
     */
    setShowClearButton : function(a) {
        this.showClearButton = a
    },
    /**
     * 
     * function getShowClearButton()
     * @member mini.DatePicker
     * @returns {Boolean}
     *
     */
    getShowClearButton : function() {
        return this.showClearButton
    },
    /**
     * 
     * function setShowOkButton(showOkButton)
     * @member mini.DatePicker
     * @param {Boolean} showOkButton
     *
     */
    setShowOkButton : function(a) {
        this.showOkButton = a
    },
    /**
     * 
     * function getShowOkButton()
     * @member mini.DatePicker
     * @returns {Boolean}
     *
     */
    getShowOkButton : function() {
        return this.showOkButton
    },
    setShowWeekNumber : function(a) {
        this.showWeekNumber = a
    },
    getShowWeekNumber : function() {
        return this.showWeekNumber
    },
    /**
     * 
     * function setMaxDate(maxDate)
     * @member mini.DatePicker
     * @param {Date} maxDate
     *
     */
    setMaxDate : function(a) {
        this.maxDate = a
    },
    /**
     * 
     * function getMaxDate()
     * @member mini.DatePicker
     * @returns {Date}
     *
     */
    getMaxDate : function() {
        return this.maxDate
    },
    /**
     * 
     * function setMinDate(minDate)
     * @member mini.DatePicker
     * @param {Date} minDate
     *
     */
    setMinDate : function(a) {
        this.minDate = a
    },
    /**
     * 
     * function getMinDate()
     * @member mini.DatePicker
     * @returns {Date}
     *
     */
    getMinDate : function() {
        return this.minDate
    },
    setMaxDateErrorText : function(a) {
        this.maxDateErrorText = a
    },
    getMaxDateErrorText : function() {
        return this.maxDateErrorText
    },
    setMinDateErrorText : function(a) {
        this.minDateErrorText = a
    },
    getMinDateErrorText : function() {
        return this.minDateErrorText
    },
    __OnInputTextChanged : function(c) {
        var a = this._textEl.value;
        var f = mini.parseDate(a);
        if (!f || isNaN(f) || f.getFullYear() == 1970) {
            f = null
        }
        var b = this.getFormValue("U");
        this.setValue(f);
        if (f == null) {
            this._textEl.value = ""
        }
        if (b !== this.getFormValue("U")) {
            this._OnValueChanged()
        }
    },
    __OnInputKeyDown : function(c) {
        var a = {
            htmlEvent : c
        };
        this.fire("keydown", a);
        if (c.keyCode == 8 && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (c.keyCode == 9) {
            if (this.isShowPopup()) {
                this.hidePopup()
            }
            return
        }
        if (this.isReadOnly()) {
            return
        }
        switch (c.keyCode) {
        case 27:
            c.preventDefault();
            if (this.isShowPopup()) {
                c.stopPropagation()
            }
            this.hidePopup();
            break;
        case 9:
        case 13:
            if (this.isShowPopup()) {
                c.preventDefault();
                c.stopPropagation();
                this.hidePopup()
            } else {
                this.__OnInputTextChanged(null);
                var b = this;
                setTimeout(function() {
                    b.fire("enter", a)
                }, 10)
            }
            break;
        case 37:
            break;
        case 38:
            c.preventDefault();
            break;
        case 39:
            break;
        case 40:
            c.preventDefault();
            this.showPopup();
            break;
        default:
            break
        }
    },
    getAttrs : function(b) {
        var a = mini.DatePicker.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "format", "viewDate", "timeFormat",
                "ondrawdate", "minDate", "maxDate", "valueFormat", "nullValue",
                "minDateErrorText", "maxDateErrorText" ]);
        mini._ParseBool(b, a, [ "showTime", "showTodayButton",
                "showClearButton", "showOkButton", "showWeekNumber" ]);
        return a
    }
});
mini.regClass(mini.DatePicker, "datepicker");
mini.MonthPicker = function() {
    mini.MonthPicker.superclass.constructor.call(this)
};
mini.extend(mini.MonthPicker, mini.DatePicker, {
    uiCls : "mini-monthpicker",
    valueFormat : "",
    format : "yyyy-MM",
    _monthPicker : true
});
mini.regClass(mini.MonthPicker, "monthpicker");