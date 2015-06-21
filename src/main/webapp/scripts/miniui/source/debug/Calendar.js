/**
 * 日期选择器。
 * 
 *     @example
 *     &lt;div id="calendar1" class="mini-calendar" value="2011-12-11" &gt;&lt;/div&gt;
 * 
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.Calendar = function() {
    this.viewDate = new Date();
    this._selectedDates = [];
    mini.Calendar.superclass.constructor.call(this)
};
mini.extend(mini.Calendar, mini.Control, {
    width : 220,
    height : 160,
    monthPicker : false,
    _clearBorder : false,
    viewDate : null,
    _selectedDate : "",
    _selectedDates : [],
    multiSelect : false,
    firstDayOfWeek : 0,
    todayText : "Today",
    clearText : "Clear",
    okText : "OK",
    cancelText : "Cancel",
    daysShort : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
            "Sat" ],
    format : "MMM, yyyy",
    timeFormat : "H:mm",
    showTime : false,
    currentTime : true,
    rows : 1,
    columns : 1,
    headerCls : "",
    bodyCls : "",
    footerCls : "",
    _todayCls : "mini-calendar-today",
    _weekendCls : "mini-calendar-weekend",
    _otherMonthCls : "mini-calendar-othermonth",
    _selectedDateCls : "mini-calendar-selected",
    showHeader : true,
    showFooter : true,
    showWeekNumber : false,
    showDaysHeader : true,
    showMonthButtons : true,
    showYearButtons : true,
    showTodayButton : true,
    showClearButton : true,
    showOkButton : false,
    isWeekend : function(b) {
        var a = b.getDay();
        return a == 0 || a == 6
    },
    getFirstDateOfMonth : function(a) {
        var a = new Date(a.getFullYear(), a.getMonth(), 1);
        return mini.getWeekStartDate(a, this.firstDayOfWeek)
    },
    getShortWeek : function(a) {
        return this.daysShort[a]
    },
    uiCls : "mini-calendar",
    _create : function() {
        var e = '<tr style="width:100%;"><td style="width:100%;"></td></tr>';
        e += '<tr ><td><div class="mini-calendar-footer"><span style="display:inline-block;"><input name="time" class="mini-timespinner" style="width:80px" format="'
                + this.timeFormat
                + '"/><span class="mini-calendar-footerSpace"></span></span><span class="mini-calendar-tadayButton">'
                + this.todayText
                + '</span><span class="mini-calendar-footerSpace"></span><span class="mini-calendar-clearButton">'
                + this.clearText
                + '</span><span class="mini-calendar-okButton">'
                + this.okText
                + '</span><a href="#" class="mini-calendar-focus" style="position:absolute;left:-10px;top:-10px;width:0px;height:0px;outline:none" hideFocus></a></div></td></tr>';
        var b = '<table class="mini-calendar" cellpadding="0" cellspacing="0">'
                + e + "</table>";
        var f = document.createElement("div");
        f.innerHTML = b;
        this.el = f.firstChild;
        var a = this.el.getElementsByTagName("tr");
        var c = this.el.getElementsByTagName("td");
        this._innerEl = c[0];
        this._footerEl = mini.byClass("mini-calendar-footer",
                this.el);
        this.timeWrapEl = this._footerEl.childNodes[0];
        this.todayButtonEl = this._footerEl.childNodes[1];
        this.footerSpaceEl = this._footerEl.childNodes[2];
        this.closeButtonEl = this._footerEl.childNodes[3];
        this.okButtonEl = this._footerEl.childNodes[4];
        this._focusEl = this._footerEl.lastChild;
        mini.parse(this._footerEl);
        this.timeSpinner = mini.getbyName("time", this.el);
        this.doUpdate()
    },
    focus : function() {
        try {
            this._focusEl.focus()
        } catch (a) {
        }
    },
    destroy : function(a) {
        this._innerEl = this._footerEl = this.timeWrapEl = this.todayButtonEl = this.footerSpaceEl = this.closeButtonEl = null;
        mini.Calendar.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        if (this.timeSpinner) {
            this.timeSpinner.on("valuechanged",
                    this.__OnTimeChanged, this)
        }
        mini._BindEvents(function() {
            mini.on(this.el, "click", this.__OnClick, this);
            mini.on(this.el, "mousedown", this.__OnMouseDown,
                    this);
            mini.on(this.el, "keydown", this.__OnKeyDown, this)
        }, this)
    },
    getDateEl : function(a) {
        if (!a) {
            return null
        }
        var b = this.uid + "$" + mini.clearTime(a).getTime();
        return document.getElementById(b)
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        if (this.menuEl
                && mini.isAncestor(this.menuEl, a.target)) {
            return true
        }
        return false
    },
    /**
     * 
     * function setShowHeader(showHeader)
     * @member mini.Calendar
     * @param {Boolean} showHeader
     *
     */
    setShowHeader : function(a) {
        this.showHeader = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowHeader()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowHeader : function() {
        return this.showHeader
    },
    /**
     * 
     * function setShowFooter(showFooter)
     * @member mini.Calendar
     * @param {Boolean} showFooter
     *
     */
    setShowFooter : function(a) {
        this.showFooter = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowFooter()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowFooter : function() {
        return this.showFooter
    },
    /**
     * 
     * function setShowWeekNumber(showWeekNumber)
     * @member mini.Calendar
     * @param {Boolean} showWeekNumber
     *
     */
    setShowWeekNumber : function(a) {
        this.showWeekNumber = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowWeekNumber()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowWeekNumber : function() {
        return this.showWeekNumber
    },
    /**
     * 
     * function setShowDaysHeader(showDaysHeader)
     * @member mini.Calendar
     * @param {Boolean} showDaysHeader
     *
     */
    setShowDaysHeader : function(a) {
        this.showDaysHeader = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowDaysHeader()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowDaysHeader : function() {
        return this.showDaysHeader
    },
    /**
     * 
     * function setShowMonthButtons(showMonthButtons)
     * @member mini.Calendar
     * @param {Boolean} showMonthButtons
     *
     */
    setShowMonthButtons : function(a) {
        this.showMonthButtons = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowMonthButtons()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowMonthButtons : function() {
        return this.showMonthButtons
    },
    /**
     * 
     * function setShowYearButtons(showYearButtons)
     * @member mini.Calendar
     * @param {Boolean} showYearButtons
     *
     */
    setShowYearButtons : function(a) {
        this.showYearButtons = a;
        this.doUpdate()
    },
    /**
     * 
     * function getShowYearButtons()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowYearButtons : function() {
        return this.showYearButtons
    },
    /**
     * 
     * function setShowTodayButton(showTodayButton)
     * @member mini.Calendar
     * @param {Boolean} showTodayButton
     *
     */
    setShowTodayButton : function(a) {
        this.showTodayButton = a;
        this.todayButtonEl.style.display = this.showTodayButton ? ""
                : "none";
        this.doUpdate()
    },
    /**
     * 
     * function getShowTodayButton()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowTodayButton : function() {
        return this.showTodayButton
    },
    /**
     * 
     * function setShowClearButton(showClearButton)
     * @member mini.Calendar
     * @param {Boolean} showClearButton
     *
     */
    setShowClearButton : function(a) {
        this.showClearButton = a;
        this.closeButtonEl.style.display = this.showClearButton ? ""
                : "none";
        this.doUpdate()
    },
    /**
     * 
     * function getShowClearButton()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowClearButton : function() {
        return this.showClearButton
    },
    setShowOkButton : function(a) {
        this.showOkButton = a;
        this.okButtonEl.style.display = this.showOkButton ? ""
                : "none";
        this.doUpdate()
    },
    getShowOkButton : function() {
        return this.showOkButton
    },
    /**
     * 
     * function setViewDate(viewDate)
     * @member mini.Calendar
     * @param {Date} viewDate
     *
     */
    setViewDate : function(a) {
        a = mini.parseDate(a);
        if (!a) {
            a = new Date()
        }
        if (mini.isDate(a)) {
            a = new Date(a.getTime())
        }
        this.viewDate = a;
        this.doUpdate()
    },
    /**
     * 
     * function getViewDate()
     * @member mini.Calendar
     * @returns {Date}
     *
     */
    getViewDate : function() {
        return this.viewDate
    },
    setSelectedDate : function(b) {
        b = mini.parseDate(b);
        if (!mini.isDate(b)) {
            b = ""
        } else {
            b = new Date(b.getTime())
        }
        var a = this.getDateEl(this._selectedDate);
        if (a) {
            mini.removeClass(a, this._selectedDateCls)
        }
        this._selectedDate = b;
        if (this._selectedDate) {
            this._selectedDate = mini
                    .cloneDate(this._selectedDate)
        }
        var a = this.getDateEl(this._selectedDate);
        if (a) {
            mini.addClass(a, this._selectedDateCls)
        }
        this.fire("datechanged")
    },
    setSelectedDates : function(a) {
        if (!mini.isArray(a)) {
            a = []
        }
        this._selectedDates = a;
        this.doUpdate()
    },
    getSelectedDate : function() {
        return this._selectedDate ? this._selectedDate : ""
    },
    setTime : function(a) {
        this.timeSpinner.setValue(a)
    },
    getTime : function() {
        return this.timeSpinner.getFormValue()
    },

    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.Calendar
     * @param  value
     *
     */
    setValue : function(a) {
        this.setSelectedDate(a);
        if (!a) {
            a = new Date()
        }
        this.setTime(a)
    },
    /**
     * 获取值<br/>
     * function getValue()
     * @member mini.Calendar
     *
     */
    getValue : function() {
        var b = this._selectedDate;
        if (b) {
            b = mini.clearTime(b);
            if (this.showTime) {
                var a = this.timeSpinner.getValue();
                if (a) {
                    b.setHours(a.getHours());
                    b.setMinutes(a.getMinutes());
                    b.setSeconds(a.getSeconds())
                }
            }
        }
        return b ? b : ""
    },
    /**
     * 获取表单值<br/>
     * function getFormValue()
     * @member mini.Calendar
     * @returns {String}
     *
     */
    getFormValue : function() {
        var a = this.getValue();
        if (a) {
            return mini.formatDate(a, "yyyy-MM-dd HH:mm:ss")
        }
        return ""
    },
    isSelectedDate : function(a) {
        if (!a || !this._selectedDate) {
            return false
        }
        return mini.clearTime(a).getTime() == mini.clearTime(
                this._selectedDate).getTime()
    },
    setMultiSelect : function(a) {
        this.multiSelect = a;
        this.doUpdate()
    },
    getMultiSelect : function() {
        return this.multiSelect
    },
    /**
     * 
     * function setRows(rows)
     * @member mini.Calendar
     * @param {Number} rows
     *
     */
    setRows : function(a) {
        if (isNaN(a)) {
            return
        }
        if (a < 1) {
            a = 1
        }
        this.rows = a;
        this.doUpdate()
    },
    /**
     * 
     * function getRows()
     * @member mini.Calendar
     * @returns {Number}
     *
     */
    getRows : function() {
        return this.rows
    },
    /**
     * 
     * function setColumns(columns)
     * @member mini.Calendar
     * @param {Number} columns
     *
     */
    setColumns : function(a) {
        if (isNaN(a)) {
            return
        }
        if (a < 1) {
            a = 1
        }
        this.columns = a;
        this.doUpdate()
    },
    /**
     * 
     * function getColumns()
     * @member mini.Calendar
     * @returns {Number}
     *
     */
    getColumns : function() {
        return this.columns
    },
    /**
     * 
     * function setShowTime(showTime)
     * @member mini.Calendar
     * @param {Boolean} showTime
     *
     */
    setShowTime : function(a) {
        if (this.showTime != a) {
            this.showTime = a;
            this.timeWrapEl.style.display = this.showTime ? ""
                    : "none";
            this.doLayout()
        }
    },
    /**
     * 
     * function getShowTime()
     * @member mini.Calendar
     * @returns {Boolean}
     *
     */
    getShowTime : function() {
        return this.showTime
    },
    /**
     * 
     * function setTimeFormat(timeFormat)
     * @member mini.Calendar
     * @param {String} timeFormat
     *
     */
    setTimeFormat : function(a) {
        if (this.timeFormat != a) {
            this.timeSpinner.setFormat(a);
            this.timeFormat = this.timeSpinner.format
        }
    },
    /**
     * 
     * function getTimeFormat()
     * @member mini.Calendar
     * @returns {String}
     *
     */
    getTimeFormat : function() {
        return this.timeFormat
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        this.timeWrapEl.style.display = this.showTime ? ""
                : "none";
        this.todayButtonEl.style.display = this.showTodayButton ? ""
                : "none";
        this.closeButtonEl.style.display = this.showClearButton ? ""
                : "none";
        this.okButtonEl.style.display = this.showOkButton ? ""
                : "none";
        this.footerSpaceEl.style.display = (this.showClearButton && this.showTodayButton) ? ""
                : "none";
        this._footerEl.style.display = this.showFooter ? ""
                : "none";
        var a = this._innerEl.firstChild;
        var b = this.isAutoHeight();
        if (!b) {
            a.parentNode.style.height = "100px";
            h = jQuery(this.el).height();
            h -= jQuery(this._footerEl).outerHeight();
            a.parentNode.style.height = h + "px"
        } else {
            a.parentNode.style.height = ""
        }
        mini.layout(this._footerEl);
        if (this.monthPicker) {
            this._tryShowMenu()
        }
    },
    doUpdate : function() {
        if (!this._allowUpdate) {
            return
        }
        var m = new Date(this.viewDate.getTime());
        var d = this.rows == 1 && this.columns == 1;
        var g = 100 / this.rows;
        var n = '<table class="mini-calendar-views" border="0" cellpadding="0" cellspacing="0">';
        for (var f = 0, b = this.rows; f < b; f++) {
            n += "<tr >";
            for (var e = 0, c = this.columns; e < c; e++) {
                n += '<td style="height:' + g + '%">';
                n += this._CreateView(m, f, e);
                n += "</td>";
                m = new Date(m.getFullYear(), m.getMonth() + 1,
                        1)
            }
            n += "</tr>"
        }
        n += "</table>";
        this._innerEl.innerHTML = n;
        var a = this.el;
        setTimeout(function() {
            mini.repaint(a)
        }, 100);
        this.doLayout()
    },
    _CreateView : function(m, d, a) {
        var x = m.getMonth();
        var w = this.getFirstDateOfMonth(m);
        var o = new Date(w.getTime());
        var c = mini.clearTime(new Date()).getTime();
        var l = this.value ? mini.clearTime(this.value)
                .getTime() : -1;
        var q = this.rows > 1 || this.columns > 1;
        var n = "";
        n += '<table class="mini-calendar-view" border="0" cellpadding="0" cellspacing="0">';
        if (this.showHeader) {
            n += '<tr ><td colSpan="10" class="mini-calendar-header"><div class="mini-calendar-headerInner">';
            if (d == 0 && a == 0) {
                n += '<div class="mini-calendar-prev">';
                if (this.showYearButtons) {
                    n += '<span class="mini-calendar-yearPrev"></span>'
                }
                if (this.showMonthButtons) {
                    n += '<span class="mini-calendar-monthPrev"></span>'
                }
                n += "</div>"
            }
            if (d == 0 && a == this.columns - 1) {
                n += '<div class="mini-calendar-next">';
                if (this.showMonthButtons) {
                    n += '<span class="mini-calendar-monthNext"></span>'
                }
                if (this.showYearButtons) {
                    n += '<span class="mini-calendar-yearNext"></span>'
                }
                n += "</div>"
            }
            n += '<span class="mini-calendar-title">'
                    + mini.formatDate(m, this.format);
            +"</span>";
            n += "</div></td></tr>"
        }
        if (this.showDaysHeader) {
            n += '<tr class="mini-calendar-daysheader"><td class="mini-calendar-space"></td>';
            if (this.showWeekNumber) {
                n += '<td sclass="mini-calendar-weeknumber"></td>'
            }
            for (var t = this.firstDayOfWeek, r = t + 7; t < r; t++) {
                var z = this.getShortWeek(t);
                n += '<td yAlign="middle">';
                n += z;
                n += "</td>";
                w = new Date(w.getFullYear(), w.getMonth(), w
                        .getDate() + 1)
            }
            n += '<td class="mini-calendar-space"></td></tr>'
        }
        w = o;
        for (var u = 0; u <= 5; u++) {
            n += '<tr class="mini-calendar-days"><td class="mini-calendar-space"></td>';
            if (this.showWeekNumber) {
                var f = mini.getWeek(w.getFullYear(), w
                        .getMonth() + 1, w.getDate());
                if (String(f).length == 1) {
                    f = "0" + f
                }
                n += '<td class="mini-calendar-weeknumber" yAlign="middle">'
                        + f + "</td>"
            }
            for (var t = this.firstDayOfWeek, r = t + 7; t < r; t++) {
                var p = this.isWeekend(w);
                var b = mini.clearTime(w).getTime();
                var y = b == c;
                var g = this.isSelectedDate(w);
                if (x != w.getMonth() && q) {
                    b = -1
                }
                var v = this._OnDrawDate(w);
                n += '<td yAlign="middle" id="';
                n += this.uid + "$" + b;
                n += '" class="mini-calendar-date ';
                if (p) {
                    n += " mini-calendar-weekend "
                }
                if (v.allowSelect == false) {
                    n += " mini-calendar-disabled "
                }
                if (x != w.getMonth() && q) {
                } else {
                    if (g) {
                        n += " " + this._selectedDateCls + " "
                    }
                    if (y) {
                        n += " mini-calendar-today "
                    }
                }
                if (x != w.getMonth()) {
                    n += " mini-calendar-othermonth "
                }
                if (v.dateCls) {
                    n += " " + v.dateCls
                }
                n += '" style="';
                if (v.dateStyle) {
                    n += v.dateStyle
                }
                n += '">';
                if (x != w.getMonth() && q) {
                } else {
                    n += v.dateHtml
                }
                n += "</td>";
                w = new Date(w.getFullYear(), w.getMonth(), w
                        .getDate() + 1)
            }
            n += '<td class="mini-calendar-space"></td></tr>'
        }
        n += '<tr class="mini-calendar-bottom" colSpan="10"><td ></td></tr>';
        n += "</table>";
        return n
    },
    _OnDrawDate : function(a) {
        var b = {
            date : a,
            dateCls : "",
            dateStyle : "",
            dateHtml : a.getDate(),
            allowSelect : true
        };
        this.fire("drawdate", b);
        return b
    },
    _OnDateClick : function(a, b) {
        this.hideMenu();
        var c = {
            date : a,
            action : b
        };
        this.fire("dateclick", c);
        this._OnValueChanged()
    },
    menuEl : null,
    menuYear : null,
    menuSelectMonth : null,
    menuSelectYear : null,
    _tryShowMenu : function() {
        if (!this.menuEl) {
            var a = this;
            setTimeout(function() {
                a.showMenu()
            }, 1)
        }
    },
    showMenu : function() {
        this.hideMenu();
        this.menuYear = parseInt(this.viewDate.getFullYear() / 10) * 10;
        this._menuselectMonth = this.viewDate.getMonth();
        this._menuselectYear = this.viewDate.getFullYear();
        var a = '<div class="mini-calendar-menu"></div>';
        this.menuEl = mini.append(document.body, a);
        this.updateMenu(this.viewDate);
        var b = this.getBox();
        if (this.el.style.borderWidth == "0px") {
            this.menuEl.style.border = "0"
        }
        mini.setBox(this.menuEl, b);
        mini.on(this.menuEl, "click", this.__OnMenuClick, this);
        mini.on(document, "mousedown",
                this.__OnBodyMenuMouseDown, this)
    },
    hideMenu : function() {
        if (this.menuEl) {
            mini.un(this.menuEl, "click", this.__OnMenuClick,
                    this);
            mini.un(document, "mousedown",
                    this.__OnBodyMenuMouseDown, this);
            jQuery(this.menuEl).remove();
            this.menuEl = null
        }
    },
    updateMenu : function() {
        var d = '<div class="mini-calendar-menu-months">';
        for (var c = 0, b = 12; c < b; c++) {
            var e = mini.getShortMonth(c);
            var a = "";
            if (this._menuselectMonth == c) {
                a = "mini-calendar-menu-selected"
            }
            d += '<a id="'
                    + c
                    + '" class="mini-calendar-menu-month '
                    + a
                    + '" href="javascript:void(0);" hideFocus onclick="return false">'
                    + e + "</a>"
        }
        d += '<div style="clear:both;"></div></div>';
        d += '<div class="mini-calendar-menu-years">';
        for (var c = this.menuYear, b = this.menuYear + 10; c < b; c++) {
            var e = c;
            var a = "";
            if (this._menuselectYear == c) {
                a = "mini-calendar-menu-selected"
            }
            d += '<a id="'
                    + c
                    + '" class="mini-calendar-menu-year '
                    + a
                    + '" href="javascript:void(0);" hideFocus onclick="return false">'
                    + e + "</a>"
        }
        d += '<div class="mini-calendar-menu-prevYear"></div><div class="mini-calendar-menu-nextYear"></div><div style="clear:both;"></div></div>';
        d += '<div class="mini-calendar-footer"><span class="mini-calendar-okButton">'
                + this.okText
                + '</span><span class="mini-calendar-footerSpace"></span><span class="mini-calendar-cancelButton">'
                + this.cancelText
                + '</span></div><div style="clear:both;"></div>';
        this.menuEl.innerHTML = d
    },
    __OnMenuClick : function(f) {
        var d = f.target;
        var c = mini.findParent(d, "mini-calendar-menu-month");
        var a = mini.findParent(d, "mini-calendar-menu-year");
        if (c) {
            this._menuselectMonth = parseInt(c.id);
            this.updateMenu()
        } else {
            if (a) {
                this._menuselectYear = parseInt(a.id);
                this.updateMenu()
            } else {
                if (mini.findParent(d,
                        "mini-calendar-menu-prevYear")) {
                    this.menuYear = this.menuYear - 1;
                    this.menuYear = parseInt(this.menuYear / 10) * 10;
                    this.updateMenu()
                } else {
                    if (mini.findParent(d,
                            "mini-calendar-menu-nextYear")) {
                        this.menuYear = this.menuYear + 11;
                        this.menuYear = parseInt(this.menuYear / 10) * 10;
                        this.updateMenu()
                    } else {
                        if (mini.findParent(d,
                                "mini-calendar-okButton")) {
                            var b = new Date(
                                    this._menuselectYear,
                                    this._menuselectMonth, 1);
                            if (this.monthPicker) {
                                this.setViewDate(b);
                                this.setSelectedDate(b);
                                this._OnDateClick(b)
                            } else {
                                this.setViewDate(b);
                                this.hideMenu()
                            }
                        } else {
                            if (mini
                                    .findParent(d,
                                            "mini-calendar-cancelButton")) {
                                if (this.monthPicker) {
                                    this._OnDateClick(null,
                                            "cancel")
                                } else {
                                    this.hideMenu()
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    __OnBodyMenuMouseDown : function(a) {
        if (!mini.findParent(a.target, "mini-calendar-menu")) {
            this.hideMenu()
        }
    },
    __OnClick : function(j) {
        var m = this.viewDate;
        if (this.enabled == false) {
            return
        }
        var l = j.target;
        var b = mini
                .findParent(j.target, "mini-calendar-title");
        if (mini.findParent(l, "mini-calendar-monthNext")) {
            m.setMonth(m.getMonth() + 1);
            this.setViewDate(m)
        } else {
            if (mini.findParent(l, "mini-calendar-yearNext")) {
                m.setFullYear(m.getFullYear() + 1);
                this.setViewDate(m)
            } else {
                if (mini.findParent(l,
                        "mini-calendar-monthPrev")) {
                    m.setMonth(m.getMonth() - 1);
                    this.setViewDate(m)
                } else {
                    if (mini.findParent(l,
                            "mini-calendar-yearPrev")) {
                        m.setFullYear(m.getFullYear() - 1);
                        this.setViewDate(m)
                    } else {
                        if (mini.findParent(l,
                                "mini-calendar-tadayButton")) {
                            var k = new Date();
                            this.setViewDate(k);
                            this.setSelectedDate(k);
                            if (this.currentTime) {
                                var i = new Date();
                                this.setTime(i)
                            }
                            this._OnDateClick(k, "today")
                        } else {
                            if (mini
                                    .findParent(l,
                                            "mini-calendar-clearButton")) {
                                this.setSelectedDate(null);
                                this.setTime(null);
                                this
                                        ._OnDateClick(null,
                                                "clear")
                            } else {
                                if (mini
                                        .findParent(l,
                                                "mini-calendar-okButton")) {
                                    this._OnDateClick(null,
                                            "ok")
                                } else {
                                    if (b) {
                                        this.showMenu()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var g = mini.findParent(j.target, "mini-calendar-date");
        if (g && !mini.hasClass(g, "mini-calendar-disabled")) {
            var a = g.id.split("$");
            var f = parseInt(a[a.length - 1]);
            if (f == -1) {
                return
            }
            var c = new Date(f);
            this._OnDateClick(c)
        }
    },
    __OnMouseDown : function(f) {
        if (this.enabled == false) {
            return
        }
        var b = mini.findParent(f.target, "mini-calendar-date");
        if (b && !mini.hasClass(b, "mini-calendar-disabled")) {
            var c = b.id.split("$");
            var d = parseInt(c[c.length - 1]);
            if (d == -1) {
                return
            }
            var a = new Date(d);
            this.setSelectedDate(a)
        }
    },
    __OnTimeChanged : function(a) {
        this.fire("timechanged");
        this._OnValueChanged()
    },
    __OnKeyDown : function(d) {
        if (this.enabled == false) {
            return
        }
        var b = this.getSelectedDate();
        if (!b) {
            b = new Date(this.viewDate.getTime())
        }
        switch (d.keyCode) {
        case 27:
            break;
        case 13:
            break;
        case 37:
            b = mini.addDate(b, -1, "D");
            break;
        case 38:
            b = mini.addDate(b, -7, "D");
            break;
        case 39:
            b = mini.addDate(b, 1, "D");
            break;
        case 40:
            b = mini.addDate(b, 7, "D");
            break;
        default:
            break
        }
        var c = this;
        if (b.getMonth() != c.viewDate.getMonth()) {
            c.setViewDate(mini.cloneDate(b));
            c.focus()
        }
        var a = this.getDateEl(b);
        if (a && mini.hasClass(a, "mini-calendar-disabled")) {
            return
        }
        c.setSelectedDate(b);
        if (d.keyCode == 37 || d.keyCode == 38
                || d.keyCode == 39 || d.keyCode == 40) {
            d.preventDefault()
        }
    },
    _OnValueChanged : function() {
        this.fire("valuechanged")
    },
    getAttrs : function(b) {
        var a = mini.Calendar.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "viewDate", "rows",
                "columns", "ondateclick", "ondrawdate",
                "ondatechanged", "timeFormat", "ontimechanged",
                "onvaluechanged" ]);
        mini
                ._ParseBool(b, a, [ "multiSelect",
                        "showHeader", "showFooter",
                        "showWeekNumber", "showDaysHeader",
                        "showMonthButtons", "showYearButtons",
                        "showTodayButton", "showClearButton",
                        "showTime", "showOkButton" ]);
        return a
    }
});
mini.regClass(mini.Calendar, "calendar");