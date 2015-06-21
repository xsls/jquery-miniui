/**
 * 自动补全下拉列表输入框
 * @class
 * @extends mini.ComboBox
 * @constructor
 */
mini.AutoComplete = function() {
    mini.AutoComplete.superclass.constructor.call(this);
    var a = this;
    a._ValueChangeTimer = null;
    this._textEl.onfocus = function() {
        a._LastInputText = a._textEl.value;
        a._ValueChangeTimer = setInterval(function() {
            if (a._LastInputText != a._textEl.value) {
                a._tryQuery();
                a._LastInputText = a._textEl.value;
                if (a._textEl.value == "" && a.value != "") {
                    a.setValue("");
                    a._OnValueChanged()
                }
            }
        }, 10)
    };
    this._textEl.onblur = function() {
        clearInterval(a._ValueChangeTimer);
        if (!a.isShowPopup()) {
            if (a._LastInputText != a._textEl.value) {
                if (a._textEl.value == "" && a.value != "") {
                    a.setValue("");
                    a._OnValueChanged()
                }
            }
        }
    };
    this._buttonEl.style.display = "none";
    this._doInputLayout()
};
mini.extend(mini.AutoComplete, mini.ComboBox, {
    /**
     * @cfg {String} [url=""] 数据加载地址
     * @accessor
     * @member mini.ComboBox
     */
    url : "",
    /**
     * @cfg {Boolean} [allowInput=true] 是否允许输入
     * @accessor
     * @member mini.ComboBox
     */
    allowInput : true,
    /**
     * @cfg {Number} [delay=150] 延迟请求的毫秒数
     * @accessor
     * @member mini.ComboBox
     */
    delay : 150,
    /**
     * @cfg {String} [searchField="key"] 查询字段
     * @accessor
     * @member mini.ComboBox
     */
    searchField : "key",
    /**
     * @cfg {Number} [minChars=0] 触发自动补全的最小字符数
     * @accessor
     * @member mini.ComboBox
     */
    minChars : 0,
    /**
     * @property {Number} [_buttonWidth=0] 按钮的宽度
     * @member mini.ComboBox
     */
    _buttonWidth : 0,
    /**
     * @property {String} [uiCls="mini-autocomplete"] 控件样式类
     * @member mini.ComboBox
     */
    uiCls : "mini-autocomplete",

    setUrl : function(a) {
        this.url = a
    },

    setValue : function(a) {
        if (mini.isNull(a)) {
            a = ""
        }
        if (this.value != a) {
            this.value = a;
            this._valueEl.value = this.value
        }
    },
    setText : function(a) {
        if (mini.isNull(a)) {
            a = ""
        }
        if (this.text != a) {
            this.text = a;
            this._LastInputText = a
        }
        this._textEl.value = this.text
    },
    setMinChars : function(a) {
        this.minChars = a
    },
    getMinChars : function() {
        return this.minChars
    },

    setSearchField : function(a) {
        this.searchField = a
    },

    getSearchField : function() {
        return this.searchField
    },
    /**
     * @property {String} [popupLoadingText="&lt;span class='mini-textboxlist-popup-loading'&gt;Loading...&lt;/span&gt;"] 加载下拉数据时的描述字符串
     * @member mini.ComboBox
     */
    popupLoadingText : "<span class='mini-textboxlist-popup-loading'>Loading...</span>",
    /**
     * @property {String} [popupErrorText="&lt;span class='mini-textboxlist-popup-error'&gt;Error&lt;/span&gt;"] 获取下拉数据发生错误时的错误提示消息
     * @member mini.ComboBox
     */
    popupErrorText : "<span class='mini-textboxlist-popup-error'>Error</span>",
    /**
     * @cfg {String} [popupEmptyText="&lt;span class='mini-textboxlist-popup-noresult'&gt;No Result&lt;/span&gt;"] 下拉数据为空时的描述字符串
     * @accessor
     * @member mini.ComboBox
     */
    popupEmptyText : "<span class='mini-textboxlist-popup-noresult'>No Result</span>",
    showPopup : function(b) {
        var a = this.getPopup();
        var c = this._listbox;
        c.showEmpty = true;
        c.emptyText = this.popupEmptyText;
        if (b == "loading") {
            c.emptyText = this.popupLoadingText;
            this._listbox.setData([])
        } else {
            if (b == "error") {
                c.emptyText = this.popupLoadingText;
                this._listbox.setData([])
            }
        }
        this._listbox.doUpdate();
        mini.AutoComplete.superclass.showPopup.call(this)
    },
    __OnInputKeyDown : function(g) {
        var b = {
            htmlEvent : g
        };
        this.fire("keydown", b);
        if (g.keyCode == 8
                && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (g.keyCode == 9) {
            this.hidePopup();
            return
        }
        if (g.keyCode == 16 || g.keyCode == 17
                || g.keyCode == 18) {
            return
        }
        if (this.isReadOnly()) {
            return
        }
        switch (g.keyCode) {
        case 27:
            if (this.isShowPopup()) {
                g.stopPropagation()
            }
            this.hidePopup();
            break;
        case 13:
            if (this.isShowPopup()) {
                g.preventDefault();
                g.stopPropagation();
                var a = this._listbox.getFocusedIndex();
                if (a != -1) {
                    var c = this._listbox.getAt(a);
                    var f = this._listbox
                            .getValueAndText([ c ]);
                    var d = f[0];
                    this.setText(f[1]);
                    this.setValue(d);
                    this._OnValueChanged();
                    this.hidePopup();
                    this.focus()
                }
            } else {
                this.fire("enter", b)
            }
            break;
        case 37:
            break;
        case 38:
            var a = this._listbox.getFocusedIndex();
            if (a == -1) {
                a = 0;
                if (!this.multiSelect) {
                    var c = this._listbox.findItems(this.value)[0];
                    if (c) {
                        a = this._listbox.indexOf(c)
                    }
                }
            }
            if (this.isShowPopup()) {
                if (!this.multiSelect) {
                    a -= 1;
                    if (a < 0) {
                        a = 0
                    }
                    this._listbox._focusItem(a, true)
                }
            }
            break;
        case 39:
            break;
        case 40:
            var a = this._listbox.getFocusedIndex();
            if (this.isShowPopup()) {
                if (!this.multiSelect) {
                    a += 1;
                    if (a > this._listbox.getCount() - 1) {
                        a = this._listbox.getCount() - 1
                    }
                    this._listbox._focusItem(a, true)
                }
            } else {
                this._tryQuery(this._textEl.value)
            }
            break;
        default:
            this._tryQuery(this._textEl.value);
            break
        }
    },
    /**
     * 弹出下拉选择框，并自动检索填充数据。<br/>
     * function doQuery()
     * @member mini.AutoComplete
     *
     */
    doQuery : function() {
        this._tryQuery()
    },
    _tryQuery : function(a) {
        var b = this;
        if (this._queryTimer) {
            clearTimeout(this._queryTimer);
            this._queryTimer = null
        }
        this._queryTimer = setTimeout(function() {
            var c = b._textEl.value;
            b._doQuery(c)
        }, this.delay);
        this.showPopup("loading")
    },
    _doQuery : function(c) {
        if (this._ajaxer) {
            this._ajaxer.abort()
        }
        var b = this.url;
        var i = "post";
        if (b) {
            if (b.indexOf(".txt") != -1
                    || b.indexOf(".json") != -1) {
                i = "get"
            }
        }
        var h = {};
        h[this.searchField] = c;
        var g = {
            url : b,
            async : true,
            params : h,
            data : h,
            type : this.ajaxType ? this.ajaxType : i,
            cache : false,
            cancel : false
        };
        this.fire("beforeload", g);
        var d = this;
        function a(j, e) {
            d._listbox.setData(j);
            d.showPopup();
            d._listbox._focusItem(0, true);
            d.data = j;
            d.fire("load", {
                data : j,
                result : e
            })
        }
        if (g.cancel) {
            var f = g.result || [];
            a(f, f);
            return
        }
        mini.copyTo(g, {
            success : function(m, n, l) {
                delete g.params;
                var k = {
                    text : m,
                    result : null,
                    sender : d,
                    options : g,
                    xhr : l
                };
                var e = null;
                try {
                    mini_doload(k);
                    e = k.result;
                    if (!e) {
                        e = mini.decode(m)
                    }
                } catch (j) {
                    if (mini_debugger == true) {
                        throw new Error(
                                "autocomplete json is error")
                    }
                }
                if (mini.isArray(e)) {
                    e = {
                        data : e
                    }
                }
                if (d.dataField) {
                    e.data = mini._getMap(d.dataField, e)
                }
                if (!e.data) {
                    e.data = []
                }
                a(e.data, e)
            },
            error : function(e, k, j) {
                d.showPopup("error")
            }
        });
        this._ajaxer = mini.ajax(g)
    },
    getAttrs : function(b) {
        var a = mini.AutoComplete.superclass.getAttrs.call(
                this, b);
        mini._ParseString(b, a, [ "searchField" ]);
        return a
    }
});
mini.regClass(mini.AutoComplete, "autocomplete");