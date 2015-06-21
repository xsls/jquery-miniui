/**
 * @class
 * @extends mini.ValidatorBase
 * @constructor
 */
mini.TextBoxList = function() {
    mini.TextBoxList.superclass.constructor.call(this);
    this.data = [];
    this.doUpdate()
};
mini.extend(mini.TextBoxList, mini.ValidatorBase, {
    /**
     * @cfg {Boolean} [formField=true] 是否为表单字段
     * @accessor
     * @member mini.TextBoxList
     */
    formField : true,
    /**
     * @cfg {String} [value=""] 值
     * @accessor
     * @member mini.TextBoxList
     */
    value : "",
    /**
     * @cfg {String} [text=""] 文本
     * @accessor
     * @member mini.TextBoxList
     */
    text : "",
    /**
     * @cfg {String} [valueField="id"] 值字段
     * @accessor
     * @member mini.TextBoxList
     */
    valueField : "id",
    /**
     * @cfg {String} [textField="text"] 文本字段
     * @accessor
     * @member mini.TextBoxList
     */
    textField : "text",
    /**
     * @cfg {String} [data=""] 数据
     * @accessor
     * @member mini.TextBoxList
     */
    data : "",
    /**
     * @cfg {String} [url=""] 数据获取地址
     * @accessor
     * @member mini.TextBoxList
     */
    url : "",
    /**
     * @cfg {Number} [delay=150] 延时毫秒数
     * @accessor
     * @member mini.TextBoxList
     */
    delay : 150,
    /**
     * @cfg {Boolean} [allowInput=true] 允许文本输入
     * @accessor
     * @member mini.TextBoxList
     */
    allowInput : true,
    /**
     * @cfg {Number} [editIndex=0] 
     * @accessor
     * @member mini.TextBoxList
     */
    editIndex : 0,
    _focusCls : "mini-textboxlist-focus",
    _itemHoverClass : "mini-textboxlist-item-hover",
    _itemSelectedClass : "mini-textboxlist-item-selected",
    _closeHoverClass : "mini-textboxlist-close-hover",
    /**
     * @cfg {String} [=""] 
     * @accessor
     * @member mini.TextBoxList
     */
    textName : "",
    setTextName : function(a) {
        this.textName = a
    },
    getTextName : function() {
        return this.textName
    },
    uiCls : "mini-textboxlist",
    _create : function() {
        var a = '<table class="mini-textboxlist" cellpadding="0" cellspacing="0"><tr ><td class="mini-textboxlist-border"><ul></ul><a href="#"></a><input type="hidden"/></td></tr></table>';
        var b = document.createElement("div");
        b.innerHTML = a;
        this.el = b.firstChild;
        var c = this.el.getElementsByTagName("td")[0];
        this.ulEl = c.firstChild;
        this._valueEl = c.lastChild;
        this.focusEl = c.childNodes[1]
    },
    destroy : function(a) {
        if (this.isShowPopup) {
            this.hidePopup()
        }
        mini.un(document, "mousedown", this.__OnDocMouseDown,
                this);
        mini.TextBoxList.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        mini.TextBoxList.superclass._initEvents.call(this);
        mini.on(this.el, "mousemove", this.__OnMouseMove, this);
        mini.on(this.el, "mouseout", this.__OnMouseOut, this);
        mini.on(this.el, "mousedown", this.__OnMouseDown, this);
        mini.on(this.el, "click", this.__OnClick, this);
        mini.on(this.el, "keydown", this.__OnKeyDown, this);
        mini.on(document, "mousedown", this.__OnDocMouseDown,
                this)
    },
    __OnDocMouseDown : function(a) {
        if (this.isReadOnly()) {
            return
        }
        if (this.isShowPopup) {
            if (!mini.isAncestor(this.popup.el, a.target)) {
                this.hidePopup()
            }
        }
        if (this._focused) {
            if (this.within(a) == false) {
                this.select(null, false);
                this.showInput(false);
                this.removeCls(this._focusCls);
                this._focused = false
            }
        }
    },
    errorIconEl : null,
    getErrorIconEl : function() {
        if (!this._errorIconEl) {
            var a = this.el.rows[0];
            var b = a.insertCell(1);
            b.style.cssText = "width:18px;vertical-align:top;";
            b.innerHTML = '<div class="mini-errorIcon"></div>';
            this._errorIconEl = b.firstChild
        }
        return this._errorIconEl
    },
    _RemoveErrorIcon : function() {
        if (this._errorIconEl) {
            jQuery(this._errorIconEl.parentNode).remove()
        }
        this._errorIconEl = null
    },
    doLayout : function() {
        if (this.canLayout() == false) {
            return
        }
        mini.TextBoxList.superclass.doLayout.call(this);
        if (this.isReadOnly() || this.allowInput == false) {
            this._inputEl.readOnly = true
        } else {
            this._inputEl.readOnly = false
        }
    },
    doUpdate : function() {
        if (this._ValueChangeTimer) {
            clearInterval(this._ValueChangeTimer)
        }
        if (this._inputEl) {
            mini.un(this._inputEl, "keydown",
                    this.__OnInputKeyDown, this)
        }
        var g = [];
        var a = this.uid;
        for (var d = 0, c = this.data.length; d < c; d++) {
            var b = this.data[d];
            var j = a + "$text$" + d;
            var h = mini._getMap(this.textField, b);
            if (mini.isNull(h)) {
                h = ""
            }
            g[g.length] = '<li id="' + j
                    + '" class="mini-textboxlist-item">';
            g[g.length] = h;
            g[g.length] = '<span class="mini-textboxlist-close"></span></li>'
        }
        var f = a + "$input";
        g[g.length] = '<li id="'
                + f
                + '" class="mini-textboxlist-inputLi"><input class="mini-textboxlist-input" type="text" autocomplete="off"></li>';
        this.ulEl.innerHTML = g.join("");
        this.editIndex = this.data.length;
        if (this.editIndex < 0) {
            this.editIndex = 0
        }
        this.inputLi = this.ulEl.lastChild;
        this._inputEl = this.inputLi.firstChild;
        mini.on(this._inputEl, "keydown",
                this.__OnInputKeyDown, this);
        var e = this;
        this._inputEl.onkeyup = function() {
            e._syncInputSize()
        };
        e._ValueChangeTimer = null;
        e._LastInputText = e._inputEl.value;
        this._inputEl.onfocus = function() {
            e._ValueChangeTimer = setInterval(function() {
                if (e._LastInputText != e._inputEl.value) {
                    e._startQuery();
                    e._LastInputText = e._inputEl.value
                }
            }, 10);
            e.addCls(e._focusCls);
            e._focused = true;
            e.fire("focus")
        };
        this._inputEl.onblur = function() {
            clearInterval(e._ValueChangeTimer);
            e.fire("blur")
        }
    },
    getItemByEvent : function(c) {
        var b = mini.findParent(c.target,
                "mini-textboxlist-item");
        if (b) {
            var a = b.id.split("$");
            var d = a[a.length - 1];
            return this.data[d]
        }
    },
    getItem : function(a) {
        if (typeof a == "number") {
            return this.data[a]
        }
        if (typeof a == "object") {
            return a
        }
    },
    getItemEl : function(c) {
        var a = this.data.indexOf(c);
        var b = this.uid + "$text$" + a;
        return document.getElementById(b)
    },
    hoverItem : function(b, c) {
        if (this.isReadOnly() || this.enabled == false) {
            return
        }
        this.blurItem();
        var a = this.getItemEl(b);
        mini.addClass(a, this._itemHoverClass);
        if (c
                && mini.hasClass(c.target,
                        "mini-textboxlist-close")) {
            mini.addClass(c.target, this._closeHoverClass)
        }
    },
    blurItem : function() {
        var b = this.data.length;
        for (var d = 0, c = b; d < c; d++) {
            var e = this.data[d];
            var a = this.getItemEl(e);
            if (a) {
                mini.removeClass(a, this._itemHoverClass);
                mini.removeClass(a.lastChild,
                        this._closeHoverClass)
            }
        }
    },
    showInput : function(b) {
        this.select(null);
        if (mini.isNumber(b)) {
            this.editIndex = b
        } else {
            this.editIndex = this.data.length
        }
        if (this.editIndex < 0) {
            this.editIndex = 0
        }
        if (this.editIndex > this.data.length) {
            this.editIndex = this.data.length
        }
        var a = this.inputLi;
        a.style.display = "block";
        if (mini.isNumber(b) && b < this.data.length) {
            var d = this.data[b];
            var c = this.getItemEl(d);
            jQuery(c).before(a)
        } else {
            this.ulEl.appendChild(a)
        }
        if (b !== false) {
            setTimeout(function() {
                try {
                    a.firstChild.focus();
                    mini.selectRange(a.firstChild, 100)
                } catch (f) {
                }
            }, 10)
        } else {
            this.lastInputText = "";
            this._inputEl.value = ""
        }
        return a
    },
    select : function(d) {
        d = this.getItem(d);
        if (this._selected) {
            var a = this.getItemEl(this._selected);
            mini.removeClass(a, this._itemSelectedClass)
        }
        this._selected = d;
        if (this._selected) {
            var a = this.getItemEl(this._selected);
            mini.addClass(a, this._itemSelectedClass)
        }
        var c = this;
        if (this._selected) {
            this.focusEl.focus();
            var b = this;
            setTimeout(function() {
                try {
                    b.focusEl.focus()
                } catch (e) {
                }
            }, 50)
        }
        if (this._selected) {
            c.addCls(c._focusCls);
            c._focused = true
        }
    },
    _doInsertSelectValue : function() {
        var b = this._listbox.getSelected();
        var a = this.editIndex;
        if (b) {
            b = mini.clone(b);
            this.insertItem(a, b)
        }
    },
    insertItem : function(a, b) {
        this.data.insert(a, b);
        var d = this.getText();
        var c = this.getValue();
        this.setValue(c, false);
        this.setText(d, false);
        this._createData();
        this.doUpdate();
        this.showInput(a + 1);
        this._OnValueChanged()
    },
    removeItem : function(b) {
        if (!b) {
            return
        }
        var a = this.getItemEl(b);
        mini.removeNode(a);
        this.data.remove(b);
        var d = this.getText();
        var c = this.getValue();
        this.setValue(c, false);
        this.setText(d, false);
        this._OnValueChanged()
    },
    _createData : function() {
        var f = (this.text ? this.text : "").split(",");
        var c = (this.value ? this.value : "").split(",");
        if (c[0] == "") {
            c = []
        }
        var a = c.length;
        this.data.length = a;
        for (var d = 0, b = a; d < b; d++) {
            var h = this.data[d];
            if (!h) {
                h = {};
                this.data[d] = h
            }
            var g = !mini.isNull(f[d]) ? f[d] : "";
            var e = !mini.isNull(c[d]) ? c[d] : "";
            mini._setMap(this.textField, g, h);
            mini._setMap(this.valueField, e, h)
        }
        this.value = this.getValue();
        this.text = this.getText()
    },
    getInputText : function() {
        return this._inputEl ? this._inputEl.value : ""
    },
    /**
     * 
     * function getText()
     * @member mini.TextBoxList
     * @returns {String}
     *
     */
    getText : function() {
        var e = [];
        for (var c = 0, a = this.data.length; c < a; c++) {
            var d = this.data[c];
            var b = mini._getMap(this.textField, d);
            if (mini.isNull(b)) {
                b = ""
            }
            b = b.replace(",", "，");
            e.push(b)
        }
        return e.join(",")
    },
    /**
     * 获取值<br/>
     * function getValue()
     * @member mini.TextBoxList
     * @returns {String}
     *
     */
    getValue : function() {
        var e = [];
        for (var c = 0, a = this.data.length; c < a; c++) {
            var d = this.data[c];
            var b = mini._getMap(this.valueField, d);
            e.push(b)
        }
        return e.join(",")
    },
    setName : function(a) {
        if (this.name != a) {
            this.name = a;
            this._valueEl.name = a
        }
    },
    /**
     * 设置值，比如："cn,usa,ca"。<br/>
     * function setValue(value)
     * @member mini.TextBoxList
     * @param  value
     *
     */
    setValue : function(a) {
        if (mini.isNull(a)) {
            a = ""
        }
        if (this.value != a) {
            this.value = a;
            this._valueEl.value = a;
            this._createData();
            this.doUpdate()
        }
    },
    /**
     * 设置文本，比如："中国,美国,加拿大"。<br/>
     * function setText(value)
     * @member mini.TextBoxList
     * @param  value
     *
     */
    setText : function(a) {
        if (mini.isNull(a)) {
            a = ""
        }
        if (this.text !== a) {
            this.text = a;
            this._createData();
            this.doUpdate()
        }
    },
    /**
     * 
     * function setValueField(valueField)
     * @member mini.TextBoxList
     * @param {String} valueField
     *
     */
    setValueField : function(a) {
        this.valueField = a;
        this._createData()
    },
    /**
     * 
     * function getValueField()
     * @member mini.TextBoxList
     * @returns {String}
     *
     */
    getValueField : function() {
        return this.valueField
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.TextBoxList
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        this.textField = a;
        this._createData()
    },
    /**
     * 
     * function getTextField()
     * @member mini.TextBoxList
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },

    /**
     * 
     * function setAllowInput(allowInput)
     * @member mini.TextBoxList
     * @param {Boolean} allowInput
     *
     */
    setAllowInput : function(a) {
        this.allowInput = a;
        this.doLayout()
    },
    /**
     * 
     * function getAllowInput()
     * @member mini.TextBoxList
     * @returns {Boolean}
     *
     */
    getAllowInput : function() {
        return this.allowInput
    },
    /**
     * 设置数据获取地址<br/>
     * function setUrl(value)
     * @member mini.TextBoxList
     * @param  value
     *
     */
    setUrl : function(a) {
        this.url = a
    },
    /**
     * 
     * function getUrl()
     * @member mini.TextBoxList
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    setPopupHeight : function(a) {
        this.popupHeight = a
    },
    getPopupHeight : function() {
        return this.popupHeight
    },
    setPopupMinHeight : function(a) {
        this.popupMinHeight = a
    },
    getPopupMinHeight : function() {
        return this.popupMinHeight
    },
    setPopupMaxHeight : function(a) {
        this.popupMaxHeight = a
    },
    getPopupMaxHeight : function() {
        return this.popupMaxHeight
    },
    doQuery : function() {
        this._startQuery(true)
    },
    _syncInputSize : function() {
        if (this.isDisplay() == false) {
            return
        }
        var d = this.getInputText();
        var b = mini.measureText(this._inputEl, d);
        var c = b.width > 20 ? b.width + 4 : 20;
        var a = mini.getWidth(this.el, true);
        if (c > a - 15) {
            c = a - 15
        }
        this._inputEl.style.width = c + "px"
    },
    _startQuery : function(a) {
        var b = this;
        setTimeout(function() {
            b._syncInputSize()
        }, 1);
        this.showPopup("loading");
        this._stopQuery();
        this._loading = true;
        this.delayTimer = setTimeout(function() {
            var c = b._inputEl.value;
            b._doQuery()
        }, this.delay)
    },
    ajaxDataType : "text",
    ajaxContentType : "application/x-www-form-urlencoded; charset=UTF-8",
    _doQuery : function() {
        if (this.isDisplay() == false) {
            return
        }
        var j = this.getInputText();
        var d = this;
        var a = this._listbox.getData();
        var c = {
            value : this.getValue(),
            text : this.getText()
        };
        c[this.searchField] = j;
        var b = this.url;
        var i = typeof b == "function" ? b : window[b];
        if (typeof i == "function") {
            b = i(this)
        }
        if (!b) {
            return
        }
        var g = "post";
        if (b) {
            if (b.indexOf(".txt") != -1
                    || b.indexOf(".json") != -1) {
                g = "get"
            }
        }
        var f = {
            url : b,
            async : true,
            params : c,
            data : c,
            type : this.ajaxType ? this.ajaxType : g,
            cache : false,
            cancel : false
        };
        this.fire("beforeload", f);
        if (f.cancel) {
            return
        }
        var h = this;
        mini.copyTo(f, {
            success : function(n, o, m) {
                delete f.params;
                var l = {
                    text : n,
                    result : null,
                    sender : h,
                    options : f,
                    xhr : m
                };
                var e = null;
                try {
                    mini_doload(l);
                    e = l.result;
                    if (!e) {
                        e = mini.decode(n)
                    }
                } catch (k) {
                    if (mini_debugger == true) {
                        throw new Error(
                                "textboxlist json is error")
                    }
                }
                if (mini.isArray(e)) {
                    e = {
                        data : e
                    }
                }
                if (h.dataField) {
                    e.data = mini._getMap(h.dataField, e)
                }
                if (!e.data) {
                    e.data = []
                }
                d._listbox.setData(e.data);
                d.showPopup();
                d._listbox._focusItem(0, true);
                d.fire("load", {
                    data : e.data,
                    result : e
                });
                d._loading = false;
                if (d._selectOnLoad) {
                    d.__doSelectValue();
                    d._selectOnLoad = null
                }
            },
            error : function(e, l, k) {
                d.showPopup("error")
            }
        });
        d._ajaxer = mini.ajax(f)
    },
    _stopQuery : function() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null
        }
        if (this._ajaxer) {
            this._ajaxer.abort()
        }
        this._loading = false
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        if (this.showPopup && this.popup
                && this.popup.within(a)) {
            return true
        }
        return false
    },
    popupLoadingText : "<span class='mini-textboxlist-popup-loading'>Loading...</span>",
    popupErrorText : "<span class='mini-textboxlist-popup-error'>Error</span>",
    popupEmptyText : "<span class='mini-textboxlist-popup-noresult'>No Result</span>",
    isShowPopup : false,
    popupHeight : "",
    popupMinHeight : 30,
    popupMaxHeight : 150,
    _createPopup : function() {
        if (!this.popup) {
            this.popup = new mini.ListBox();
            this.popup.addCls("mini-textboxlist-popup");
            this.popup
                    .setStyle("position:absolute;left:0;top:0;");
            this.popup.showEmpty = true;
            this.popup.setValueField(this.valueField);
            this.popup.setTextField(this.textField);
            this.popup.render(document.body);
            this.popup.on("itemclick", function(a) {
                this.hidePopup();
                this._doInsertSelectValue()
            }, this)
        }
        this._listbox = this.popup;
        return this.popup
    },
    showPopup : function(d) {
        if (this.isDisplay() == false) {
            return
        }
        this.isShowPopup = true;
        var b = this._createPopup();
        b.el.style.zIndex = mini.getMaxZIndex();
        var e = this._listbox;
        e.emptyText = this.popupEmptyText;
        if (d == "loading") {
            e.emptyText = this.popupLoadingText;
            this._listbox.setData([])
        } else {
            if (d == "error") {
                e.emptyText = this.popupLoadingText;
                this._listbox.setData([])
            }
        }
        this._listbox.doUpdate();
        var c = this.getBox();
        var a = c.x, f = c.y + c.height;
        this.popup.el.style.display = "block";
        mini.setXY(b.el, -1000, -1000);
        this.popup.setWidth(c.width);
        this.popup.setHeight(this.popupHeight);
        if (this.popup.getHeight() < this.popupMinHeight) {
            this.popup.setHeight(this.popupMinHeight)
        }
        if (this.popup.getHeight() > this.popupMaxHeight) {
            this.popup.setHeight(this.popupMaxHeight)
        }
        mini.setXY(b.el, a, f)
    },
    hidePopup : function() {
        this.isShowPopup = false;
        if (this.popup) {
            this.popup.el.style.display = "none"
        }
    },
    __OnMouseMove : function(b) {
        if (this.enabled == false) {
            return
        }
        var a = this.getItemByEvent(b);
        if (!a) {
            this.blurItem();
            return
        }
        this.hoverItem(a, b)
    },
    __OnMouseOut : function(a) {
        this.blurItem()
    },
    __OnClick : function(b) {
        if (this.isReadOnly() || this.enabled == false) {
            return
        }
        if (this.enabled == false) {
            return
        }
        var a = this.getItemByEvent(b);
        if (!a) {
            if (mini.findParent(b.target,
                    "mini-textboxlist-input")) {
            } else {
                this.showInput()
            }
            return
        }
        this.focusEl.focus();
        this.select(a);
        if (b
                && mini.hasClass(b.target,
                        "mini-textboxlist-close")) {
            this.removeItem(a)
        }
    },
    __OnKeyDown : function(d) {
        if (this.isReadOnly() || this.allowInput == false) {
            return false
        }
        var b = this.data.indexOf(this._selected);
        var c = this;
        function a() {
            var e = c.data[b];
            c.removeItem(e);
            e = c.data[b];
            if (!e) {
                e = c.data[b - 1]
            }
            c.select(e);
            if (!e) {
                c.showInput()
            }
        }
        switch (d.keyCode) {
        case 8:
            d.preventDefault();
            a();
            break;
        case 37:
        case 38:
            this.select(null);
            this.showInput(b);
            break;
        case 39:
        case 40:
            b += 1;
            this.select(null);
            this.showInput(b);
            break;
        case 46:
            a();
            break
        }
    },
    __doSelectValue : function() {
        var a = this._listbox.getFocusedItem();
        if (a) {
            this._listbox.setSelected(a)
        }
        this.lastInputText = this.text;
        this.hidePopup();
        this._doInsertSelectValue()
    },
    __OnInputKeyDown : function(h) {
        this._selectOnLoad = null;
        if (this.isReadOnly() || this.allowInput == false) {
            return false
        }
        h.stopPropagation();
        if (this.isReadOnly() || this.allowInput == false) {
            return
        }
        var f = mini.getSelectRange(this._inputEl);
        var a = f[0], b = f[1], i = this._inputEl.value.length;
        var c = a == b && a == 0;
        var d = a == b && b == i;
        if (this.isReadOnly() || this.allowInput == false) {
            h.preventDefault()
        }
        if (h.keyCode == 9) {
            this.hidePopup();
            return
        }
        if (h.keyCode == 16 || h.keyCode == 17
                || h.keyCode == 18) {
            return
        }
        switch (h.keyCode) {
        case 13:
            if (this.isShowPopup) {
                h.preventDefault();
                if (this._loading) {
                    this._selectOnLoad = true;
                    return
                }
                this.__doSelectValue()
            }
            break;
        case 27:
            h.preventDefault();
            this.hidePopup();
            break;
        case 8:
            if (c) {
                h.preventDefault()
            }
        case 37:
            if (c) {
                if (this.isShowPopup) {
                    this.hidePopup()
                } else {
                    if (this.editIndex > 0) {
                        var g = this.editIndex - 1;
                        if (g < 0) {
                            g = 0
                        }
                        if (g >= this.data.length) {
                            g = this.data.length - 1
                        }
                        this.showInput(false);
                        this.select(g)
                    }
                }
            }
            break;
        case 39:
            if (d) {
                if (this.isShowPopup) {
                    this.hidePopup()
                } else {
                    if (this.editIndex <= this.data.length - 1) {
                        var g = this.editIndex;
                        this.showInput(false);
                        this.select(g)
                    }
                }
            }
            break;
        case 38:
            h.preventDefault();
            if (this.isShowPopup) {
                var g = -1;
                var j = this._listbox.getFocusedItem();
                if (j) {
                    g = this._listbox.indexOf(j)
                }
                g--;
                if (g < 0) {
                    g = 0
                }
                this._listbox._focusItem(g, true)
            }
            break;
        case 40:
            h.preventDefault();
            if (this.isShowPopup) {
                var g = -1;
                var j = this._listbox.getFocusedItem();
                if (j) {
                    g = this._listbox.indexOf(j)
                }
                g++;
                if (g < 0) {
                    g = 0
                }
                if (g >= this._listbox.getCount()) {
                    g = this._listbox.getCount() - 1
                }
                this._listbox._focusItem(g, true)
            } else {
                this._startQuery(true)
            }
            break;
        default:
            break
        }
    },
    focus : function() {
        try {
            this._inputEl.focus()
        } catch (a) {
        }
    },
    blur : function() {
        try {
            this._inputEl.blur()
        } catch (a) {
        }
    },
    /**
     * @cfg {String} [searchField="key"] 查询字段
     * @accessor
     * @member mini.TextBoxList
     */
    searchField : "key",
    setSearchField : function(a) {
        this.searchField = a
    },
    getSearchField : function() {
        return this.searchField
    },
    getAttrs : function(b) {
        var a = mini.TextBox.superclass.getAttrs.call(this, b);
        var c = jQuery(b);
        mini._ParseString(b, a, [ "value", "text",
                "valueField", "textField", "url",
                "popupHeight", "textName", "onfocus",
                "onbeforeload", "onload", "searchField" ]);
        mini._ParseBool(b, a, [ "allowInput" ]);
        mini._ParseInt(b, a, [ "popupMinHeight",
                "popupMaxHeight" ]);
        return a
    }
});
mini.regClass(mini.TextBoxList, "textboxlist");