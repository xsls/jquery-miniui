/**
 * @class
 * @extends mini.PopupEdit
 * @constructor
 */
mini.ComboBox = function() {
    this.data = [];
    this.columns = [];
    mini.ComboBox.superclass.constructor.call(this);
    var a = this;
    if (isFirefox) {
        this._textEl.oninput = function() {
            a._tryQuery()
        }
    }
};
mini.extend(mini.ComboBox, mini.PopupEdit, {
    text : "",
    value : "",
    valueField : "id",
    textField : "text",
    dataField : "",
    delimiter : ",",
    multiSelect : false,
    data : [],
    url : "",
    columns : [],
    allowInput : false,
    valueFromSelect : false,
    popupMaxHeight : 200,
    set : function(d) {
        if (typeof d == "string") {
            return this
        }
        var c = d.value;
        delete d.value;
        var a = d.url;
        delete d.url;
        var b = d.data;
        delete d.data;
        mini.ComboBox.superclass.set.call(this, d);
        if (!mini.isNull(b)) {
            this.setData(b);
            d.data = b
        }
        if (!mini.isNull(a)) {
            this.setUrl(a);
            d.url = a
        }
        if (!mini.isNull(c)) {
            this.setValue(c);
            d.value = c
        }
        return this
    },
    uiCls : "mini-combobox",
    _createPopup : function() {
        mini.ComboBox.superclass._createPopup.call(this);
        this._listbox = new mini.ListBox();
        this._listbox.setBorderStyle("border:0;");
        this._listbox.setStyle("width:100%;height:auto;");
        this._listbox.render(this.popup._contentEl);
        this._listbox.on("itemclick", this.__OnItemClick, this);
        this._listbox.on("drawcell", this.__OnItemDrawCell, this);
        var a = this;
        this._listbox.on("beforeload", function(b) {
            a.fire("beforeload", b)
        }, this);
        this._listbox.on("preload", function(b) {
            a.fire("preload", b)
        }, this);
        this._listbox.on("load", function(b) {
            a.fire("load", b)
        }, this);
        this._listbox.on("loaderror", function(b) {
            a.fire("loaderror", b)
        }, this)
    },
    showPopup : function() {
        var a = {
            cancel : false
        };
        this.fire("beforeshowpopup", a);
        this._firebeforeshowpopup = false;
        if (a.cancel == true) {
            return
        }
        this._listbox.setHeight("auto");
        mini.ComboBox.superclass.showPopup.call(this);
        var b = this.popup.el.style.height;
        if (b == "" || b == "auto") {
            this._listbox.setHeight("auto")
        } else {
            this._listbox.setHeight("100%")
        }
        this._listbox.setValue(this.value)
    },
    /**
     * 选择项
     * @param {Number} index
     * @member mini.ComboBox
     *
     */
    select : function(index) {
        this._listbox.deselectindexll();
        index = this.getItem(index);
        if (index) {
            this._listbox.select(index);
            this.__OnItemClick({
                item : index
            })
        }
    },
    selects : function(a) {
        if (!a) {
            return
        }
        var b = this._listbox.getValueAndText(a);
        this.setValue(b[0])
    },
    getItem : function(a) {
        return typeof a == "object" ? a : this.data[a]
    },
    indexOf : function(a) {
        return this.data.indexOf(a)
    },
    getAt : function(a) {
        return this.data[a]
    },

    /**
     * 加载数据<br/>
     * function load(url)
     * @member mini.ComboBox
     * @param  url
     *
     */
    load : function(a) {
        if (typeof a == "string") {
            this.setUrl(a)
        } else {
            this.setData(a)
        }
    },
    _eval : function(_) {
        return eval("(" + _ + ")")
    },
    /**
     * 
     * function setData(data)
     * @member mini.ComboBox
     * @param {Array} data
     *
     */
    setData : function(b) {
        if (typeof b == "string") {
            b = this._eval(b)
        }
        if (!mini.isArray(b)) {
            b = []
        }
        this._listbox.setData(b);
        this.data = this._listbox.data;
        var a = this._listbox.getValueAndText(this.value);
        this.text = this._textEl.value = a[1]
    },
    /**
     * 
     * function getData()
     * @member mini.ComboBox
     * @returns {Array}
     *
     */
    getData : function() {
        return this.data
    },
    /**
     * 
     * function setUrl(url)
     * @member mini.ComboBox
     * @param {String} url
     *
     */
    setUrl : function(a) {
        this.getPopup();
        this._listbox.setUrl(a);
        this.url = this._listbox.url;
        this.data = this._listbox.data;
        var b = this._listbox.getValueAndText(this.value);
        this.text = this._textEl.value = b[1]
    },
    /**
     * 
     * function getUrl()
     * @member mini.ComboBox
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    /**
     * 
     * function setValueField(valueField)
     * @member mini.ComboBox
     * @param {String} valueField
     *
     */
    setValueField : function(a) {
        this.valueField = a;
        if (this._listbox) {
            this._listbox.setValueField(a)
        }
    },
    /**
     * 
     * function getValueField()
     * @member mini.ComboBox
     * @returns {String}
     *
     */
    getValueField : function() {
        return this.valueField
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.ComboBox
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        if (this._listbox) {
            this._listbox.setTextField(a)
        }
        this.textField = a
    },
    /**
     * 
     * function getTextField()
     * @member mini.ComboBox
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },
    pinyinField : "tag",
    setPinyinField : function(a) {
        this.pinyinField = a
    },
    getPinyinField : function() {
        return this.pinyinField
    },
    setDisplayField : function(a) {
        this.setTextField(a)
    },
    setDataField : function(a) {
        if (this._listbox) {
            this._listbox.setDataField(a)
        }
        this.dataField = a
    },
    getDataField : function() {
        return this.dataField
    },
    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.ComboBox
     * @param  value
     *
     */
    setValue : function(b) {
        if (this.value !== b) {
            var a = this._listbox.getValueAndText(b);
            this.value = b;
            this._valueEl.value = this.value;
            this.text = this._textEl.value = a[1];
            this._doEmpty()
        } else {
            var a = this._listbox.getValueAndText(b);
            this.text = this._textEl.value = a[1]
        }
    },
    /**
     * 
     * function setMultiSelect(multiSelect)
     * @member mini.ComboBox
     * @param {Boolean} multiSelect
     *
     */
    setMultiSelect : function(a) {
        if (this.multiSelect != a) {
            this.multiSelect = a;
            if (this._listbox) {
                this._listbox.setMultiSelect(a);
                this._listbox.setShowCheckBox(a)
            }
        }
    },
    /**
     * 
     * function getMultiSelect()
     * @member mini.ComboBox
     * @returns {Boolean}
     *
     */
    getMultiSelect : function() {
        return this.multiSelect
    },
    /**
     * 
     * function setColumns(columns)
     * @member mini.ComboBox
     * @param {Array} columns
     *
     */
    setColumns : function(a) {
        if (!mini.isArray(a)) {
            a = []
        }
        this.columns = a;
        this._listbox.setColumns(a)
    },
    /**
     * 
     * function getColumns()
     * @member mini.ComboBox
     * @returns {Array}
     *
     */
    getColumns : function() {
        return this.columns
    },
    showNullItem : false,
    /**
     * 
     * function setShowNullItem(showNullItem)
     * @member mini.ComboBox
     * @param {Boolean} showNullItem
     *
     */
    setShowNullItem : function(a) {
        if (this.showNullItem != a) {
            this.showNullItem = a;
            this._listbox.setShowNullItem(a)
        }
    },
    /**
     * 
     * function getShowNullItem()
     * @member mini.ComboBox
     * @returns {Boolean}
     *
     */
    getShowNullItem : function() {
        return this.showNullItem
    },
    /**
     * 
     * function setNullItemText(nullItemText)
     * @member mini.ComboBox
     * @param {String} nullItemText
     *
     */
    setNullItemText : function(a) {
        if (this.nullItemText != a) {
            this.nullItemText = a;
            this._listbox.setNullItemText(a)
        }
    },
    /**
     * 
     * function getNullItemText()
     * @member mini.ComboBox
     * @returns {String}
     *
     */
    getNullItemText : function() {
        return this.nullItemText
    },
    /**
     * 
     * function setValueFromSelect(valueFromSelect)
     * @member mini.ComboBox
     * @param {Boolean} valueFromSelect
     *
     */
    setValueFromSelect : function(a) {
        this.valueFromSelect = a
    },
    /**
     * 
     * function getValueFromSelect()
     * @member mini.ComboBox
     * @returns {Boolean}
     *
     */
    getValueFromSelect : function() {
        return this.valueFromSelect
    },
    _OnValueChanged : function() {
        if (this.validateOnChanged) {
            this._tryValidate()
        }
        var d = this.getValue();
        var b = this.getSelecteds();
        var a = b[0];
        var c = this;
        c.fire("valuechanged", {
            value : d,
            selecteds : b,
            selected : a
        })
    },
    getSelecteds : function() {
        return this._listbox.findItems(this.value)
    },
    getSelected : function() {
        return this.getSelecteds()[0]
    },
    __OnItemDrawCell : function(a) {
        this.fire("drawcell", a)
    },
    __OnItemClick : function(g) {
        var c = {
            item : g.item,
            cancel : false
        };
        this.fire("beforeitemclick", c);
        if (c.cancel) {
            return
        }
        var a = this._listbox.getSelecteds();
        var f = this._listbox.getValueAndText(a);
        var d = this.getValue();
        this.setValue(f[0]);
        this.setText(f[1]);
        if (g) {
            if (d != this.getValue()) {
                var b = this;
                setTimeout(function() {
                    b._OnValueChanged()
                }, 1)
            }
            if (!this.multiSelect) {
                this.hidePopup()
            }
            this.focus();
            this.fire("itemclick", {
                item : g.item
            })
        }
    },
    __OnInputKeyDown : function(i, g) {
        var c = {
            htmlEvent : i
        };
        this.fire("keydown", c);
        if (i.keyCode == 8 && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (i.keyCode == 9) {
            if (this.isShowPopup()) {
                this.hidePopup()
            }
            return
        }
        if (this.isReadOnly()) {
            return
        }
        switch (i.keyCode) {
        case 27:
            i.preventDefault();
            if (this.isShowPopup()) {
                i.stopPropagation()
            }
            this.hidePopup();
            this.focus();
            break;
        case 13:
            if (this.isShowPopup()) {
                i.preventDefault();
                i.stopPropagation();
                var b = this._listbox.getFocusedIndex();
                if (b != -1) {
                    var f = this._listbox.getAt(b);
                    var d = {
                        item : f,
                        cancel : false
                    };
                    this.fire("beforeitemclick", d);
                    if (d.cancel == false) {
                        if (this.multiSelect) {
                        } else {
                            this._listbox.deselectAll();
                            this._listbox.select(f)
                        }
                        var a = this._listbox.getSelecteds();
                        var h = this._listbox.getValueAndText(a);
                        this.setValue(h[0]);
                        this.setText(h[1]);
                        this._OnValueChanged()
                    }
                }
                this.hidePopup();
                this.focus()
            } else {
                this.fire("enter", c)
            }
            break;
        case 37:
            break;
        case 38:
            i.preventDefault();
            var b = this._listbox.getFocusedIndex();
            if (b == -1) {
                b = 0;
                if (!this.multiSelect) {
                    var f = this._listbox.findItems(this.value)[0];
                    if (f) {
                        b = this._listbox.indexOf(f)
                    }
                }
            }
            if (this.isShowPopup()) {
                if (!this.multiSelect) {
                    b -= 1;
                    if (b < 0) {
                        b = 0
                    }
                    this._listbox._focusItem(b, true)
                }
            }
            break;
        case 39:
            break;
        case 40:
            i.preventDefault();
            var b = this._listbox.getFocusedIndex();
            if (b == -1) {
                b = 0;
                if (!this.multiSelect) {
                    var f = this._listbox.findItems(this.value)[0];
                    if (f) {
                        b = this._listbox.indexOf(f)
                    }
                }
            }
            if (this.isShowPopup()) {
                if (!this.multiSelect) {
                    b += 1;
                    if (b > this._listbox.getCount() - 1) {
                        b = this._listbox.getCount() - 1
                    }
                    this._listbox._focusItem(b, true)
                }
            } else {
                this.showPopup();
                if (!this.multiSelect) {
                    this._listbox._focusItem(b, true)
                }
            }
            break;
        default:
            if (this.allowInput == false) {
            } else {
                this._tryQuery(this._textEl.value)
            }
            break
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
    _tryQuery : function(a) {
        var b = this;
        setTimeout(function() {
            var c = b._textEl.value;
            if (c != a) {
                b._doQuery(c)
            }
        }, 10)
    },
    _doQuery : function(h) {
        if (this.multiSelect == true) {
            return
        }
        var g = [];
        h = h.toUpperCase();
        for (var c = 0, b = this.data.length; c < b; c++) {
            var a = this.data[c];
            var j = mini._getMap(this.textField, a);
            var d = mini._getMap(this.pinyinField, a);
            j = j ? String(j).toUpperCase() : "";
            d = d ? String(d).toUpperCase() : "";
            if (j.indexOf(h) != -1 || d.indexOf(h) != -1) {
                g.push(a)
            }
        }
        this._listbox.setData(g);
        this._filtered = true;
        if (h !== "" || this.isShowPopup()) {
            this.showPopup();
            var e = 0;
            if (this._listbox.getShowNullItem()) {
                e = 1
            }
            var f = this;
            f._listbox._focusItem(e, true)
        }
    },
    __OnPopupHide : function(a) {
        if (this._filtered) {
            this._filtered = false;
            if (this._listbox.el) {
                this._listbox.setData(this.data)
            }
        }
        this.__doFocusCls();
        this.fire("hidepopup")
    },
    findItems : function(a) {
        return this._listbox.findItems(a)
    },
    __OnInputTextChanged : function(h) {
        if (this.multiSelect == false) {
            var n = this._textEl.value;
            var d = this.getData();
            var c = null;
            for (var f = 0, b = d.length; f < b; f++) {
                var o = d[f];
                var k = o[this.textField];
                if (k == n) {
                    c = o;
                    break
                }
            }
            if (c) {
                this._listbox.setValue(c ? c[this.valueField] : "");
                var m = this._listbox.getValue();
                var a = this._listbox.getValueAndText(m);
                var j = this.getValue();
                this.setValue(m);
                this.setText(a[1])
            } else {
                if (this.valueFromSelect) {
                    this.setValue("");
                    this.setText("")
                } else {
                    this.setValue(n);
                    this.setText(n)
                }
            }
            if (j != this.getValue()) {
                var g = this;
                g._OnValueChanged()
            }
        }
    },
    setAjaxData : function(a) {
        this.ajaxData = a;
        this._listbox.setAjaxData(a)
    },
    setAjaxType : function(a) {
        this.ajaxType = a;
        this._listbox.setAjaxType(a)
    },
    getAttrs : function(b) {
        var m = mini.ComboBox.superclass.getAttrs.call(this, b);
        mini._ParseString(b, m, [ "url", "data", "textField", "valueField",
                "displayField", "nullItemText", "pinyinField", "ondrawcell",
                "onbeforeload", "onpreload", "onload", "onloaderror",
                "onitemclick", "onbeforeitemclick" ]);
        mini._ParseBool(b, m, [ "multiSelect", "showNullItem",
                "valueFromSelect" ]);
        if (m.displayField) {
            m.textField = m.displayField
        }
        var n = m.valueField || this.valueField;
        var d = m.textField || this.textField;
        if (b.nodeName.toLowerCase() == "select") {
            var f = [];
            for (var g = 0, e = b.length; g < e; g++) {
                var h = b.options[g];
                var a = {};
                a[d] = h.text;
                a[n] = h.value;
                f.push(a)
            }
            if (f.length > 0) {
                m.data = f
            }
        } else {
            var j = mini.getChildNodes(b);
            for (var g = 0, e = j.length; g < e; g++) {
                var c = j[g];
                var k = jQuery(c).attr("property");
                if (!k) {
                    continue
                }
                k = k.toLowerCase();
                if (k == "columns") {
                    m.columns = mini._ParseColumns(c)
                } else {
                    if (k == "data") {
                        m.data = c.innerHTML
                    }
                }
            }
        }
        return m
    }
});
mini.regClass(mini.ComboBox, "combobox");