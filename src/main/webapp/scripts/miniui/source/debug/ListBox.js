/**
 * 列表控件。
 *     @example
 *     &lt;div id="listbox1" class="mini-listbox" style="width:150px;height:100px;"
 *         textField="text" valueField="id" 
 *         url="../data/countrys.txt"&gt;
 *     &lt;/div&gt;
 * 
 * @class
 * @extends mini.ListControl
 * @constructor
 */
mini.ListBox = function() {
    mini.ListBox.superclass.constructor.call(this)
};
mini.extend(mini.ListBox, mini.ListControl, {
    /**
     * @cfg {Boolean} [formField=true] 是否为表单字段
     * @accessor
     * @member mini.ListBox
     */
    formField : true,
    /**
     * @cfg {Array} [columns=null] 列对象集合
     * @accessor
     * @member mini.ListBox
     */
    columns : null,
    /**
     * @cfg {Number} [columnWidth=80] 列宽，单位为像素
     * @accessor
     * @member mini.ListBox
     */
    columnWidth : 80,
    /**
     * @cfg {Boolean} [showNullItem=false] 显示空项
     * @accessor
     * @member mini.ListBox
     */
    showNullItem : false,
    /**
     * @cfg {String} [nullItemText=""] 空项文本
     * @accessor
     * @member mini.ListBox
     */
    nullItemText : "",
    /**
     * @cfg {Boolean} [showEmpty=false] 显示空项
     * @accessor
     * @member mini.ListBox
     */
    showEmpty : false,
    /**
     * @cfg {String} [emptyText=""] 空文本
     * @accessor
     * @member mini.ListBox
     */
    emptyText : "",
    /**
     * @cfg {Boolean} [showCheckBox=false] 显示多选框
     * @accessor
     * @member mini.ListBox
     */
    showCheckBox : false,
    /**
     * @cfg {Boolean} [showAllCheckBox=true] 显示全选框
     * @accessor
     * @member mini.ListBox
     */
    showAllCheckBox : true,
    /**
     * @cfg {Boolean} [multiSelect=false] 多选
     * @accessor
     * @member mini.ListBox
     */
    multiSelect : false,
    /**
     * @property {String} [_itemCls="mini-listbox-item"] 数据项的样式类
     * @member mini.ListBox
     * @private
     */
    _itemCls : "mini-listbox-item",
    /**
     * @property {String} [_itemHoverCls="mini-listbox-item-hover"] 鼠标悬停项的样式类
     * @member mini.ListBox
     * @private
     */
    _itemHoverCls : "mini-listbox-item-hover",
    /**
     * @property {String} [_itemSelectedCls="mini-listbox-item-selected"] 选中项的样式类
     * @member mini.ListBox
     * @private
     */
    _itemSelectedCls : "mini-listbox-item-selected",
    /**
     * @property {String} [uiCls="mini-listbox"] 控件样式类
     * @member mini.ListBox
     */
    uiCls : "mini-listbox",
    _create : function() {
        var a = this.el = document.createElement("div");
        this.el.className = "mini-listbox";
        this.el.innerHTML = '<div class="mini-listbox-border"><div class="mini-listbox-header"></div><div class="mini-listbox-view"></div><input type="hidden"/></div><div class="mini-errorIcon"></div>';
        this._borderEl = this.el.firstChild;
        this._headerEl = this._borderEl.firstChild;
        this._viewEl = this._borderEl.childNodes[1];
        this._valueEl = this._borderEl.childNodes[2];
        this._errorIconEl = this.el.lastChild;
        this._scrollViewEl = this._viewEl;
        this._viewEl.innerHTML = '<div class="mini-grid-rows-content"></div>'
    },
    _initEvents : function() {
        mini.ListBox.superclass._initEvents.call(this);
        mini._BindEvents(function() {
            mini_onOne(this._viewEl, "scroll", this.__OnScroll,
                    this)
        }, this)
    },
    destroy : function(a) {
        if (this._viewEl) {
            this._viewEl.onscroll = null;
            mini.clearEvent(this._viewEl);
            this._viewEl = null
        }
        this._borderEl = null;
        this._headerEl = null;
        this._viewEl = null;
        this._valueEl = null;
        mini.ListBox.superclass.destroy.call(this, a)
    },
    /**
     * 
     * function setColumns(columns)
     * @member mini.ListBox
     * @param {Array} columns
     *
     */
    setColumns : function(f) {
        if (!mini.isArray(f)) {
            f = []
        }
        this.columns = f;
        for (var c = 0, a = this.columns.length; c < a; c++) {
            var e = this.columns[c];
            if (e.type) {
                if (!mini.isNull(e.header)
                        && typeof e.header !== "function") {
                    if (e.header.trim() == "") {
                        delete e.header
                    }
                }
                var b = mini._getColumn(e.type);
                if (b) {
                    var g = mini.copyTo({}, e);
                    mini.copyTo(e, b);
                    mini.copyTo(e, g)
                }
            }
            var d = parseInt(e.width);
            if (mini.isNumber(d) && String(d) == e.width) {
                e.width = d + "px"
            }
            if (mini.isNull(e.width)) {
                e.width = this.columnWidth + "px"
            }
        }
        this.doUpdate()
    },
    /**
     * 
     * function getColumns()
     * @member mini.ListBox
     * @returns {Array}
     *
     */
    getColumns : function() {
        return this.columns
    },
    doUpdate : function() {
        if (this._allowUpdate === false) {
            return
        }
        var m = this.columns && this.columns.length > 0;
        if (m) {
            mini.addClass(this.el, "mini-listbox-showColumns")
        } else {
            mini.removeClass(this.el,
                    "mini-listbox-showColumns")
        }
        this._headerEl.style.display = m ? "" : "none";
        var a = [];
        if (m) {
            a[a.length] = '<table class="mini-listbox-headerInner" cellspacing="0" cellpadding="0"><tr>';
            var A = this.uid + "$ck$all";
            a[a.length] = '<td class="mini-listbox-checkbox"><input type="checkbox" id="'
                    + A + '"></td>';
            for (var u = 0, t = this.columns.length; u < t; u++) {
                var d = this.columns[u];
                var v = d.header;
                if (mini.isNull(v)) {
                    v = "&nbsp;"
                }
                var p = d.width;
                if (mini.isNumber(p)) {
                    p = p + "px"
                }
                a[a.length] = '<td class="';
                if (d.headerCls) {
                    a[a.length] = d.headerCls
                }
                a[a.length] = '" style="';
                if (d.headerStyle) {
                    a[a.length] = d.headerStyle + ";"
                }
                if (p) {
                    a[a.length] = "width:" + p + ";"
                }
                if (d.headerAlign) {
                    a[a.length] = "text-align:" + d.headerAlign
                            + ";"
                }
                a[a.length] = '">';
                a[a.length] = v;
                a[a.length] = "</td>"
            }
            a[a.length] = "</tr></table>"
        }
        this._headerEl.innerHTML = a.join("");
        var a = [];
        var C = this.data;
        a[a.length] = '<table class="mini-listbox-items" cellspacing="0" cellpadding="0">';
        if (this.showEmpty && C.length == 0) {
            a[a.length] = '<tr><td colspan="20">'
                    + this.emptyText + "</td></tr>"
        } else {
            this._doNullItem();
            for (var x = 0, s = C.length; x < s; x++) {
                var z = C[x];
                var g = -1;
                var r = " ";
                var f = -1;
                var B = " ";
                a[a.length] = '<tr id="';
                a[a.length] = this._createItemId(x);
                a[a.length] = '" index="';
                a[a.length] = x;
                a[a.length] = '" class="mini-listbox-item ';
                if (z.enabled === false) {
                    a[a.length] = " mini-disabled "
                }
                g = a.length;
                a[a.length] = r;
                a[a.length] = '" style="';
                f = a.length;
                a[a.length] = B;
                a[a.length] = '">';
                var q = this._createCheckId(x);
                var o = this.name;
                var c = this.getItemValue(z);
                var b = "";
                if (z.enabled === false) {
                    b = "disabled"
                }
                a[a.length] = '<td class="mini-listbox-checkbox"><input '
                        + b
                        + ' id="'
                        + q
                        + '" type="checkbox" ></td>';
                if (m) {
                    for (var u = 0, t = this.columns.length; u < t; u++) {
                        var d = this.columns[u];
                        var y = this._OnDrawCell(z, x, d);
                        var p = d.width;
                        if (typeof p == "number") {
                            p = p + "px"
                        }
                        a[a.length] = '<td class="';
                        if (y.cellCls) {
                            a[a.length] = y.cellCls
                        }
                        a[a.length] = '" style="';
                        if (y.cellStyle) {
                            a[a.length] = y.cellStyle + ";"
                        }
                        if (p) {
                            a[a.length] = "width:" + p + ";"
                        }
                        if (d.align) {
                            a[a.length] = "text-align:"
                                    + d.align + ";"
                        }
                        a[a.length] = '">';
                        a[a.length] = y.cellHtml;
                        a[a.length] = "</td>";
                        if (y.rowCls) {
                            r = y.rowCls
                        }
                        if (y.rowStyle) {
                            B = y.rowStyle
                        }
                    }
                } else {
                    var y = this._OnDrawCell(z, x, null);
                    a[a.length] = '<td class="';
                    if (y.cellCls) {
                        a[a.length] = y.cellCls
                    }
                    a[a.length] = '" style="';
                    if (y.cellStyle) {
                        a[a.length] = y.cellStyle
                    }
                    a[a.length] = '">';
                    a[a.length] = y.cellHtml;
                    a[a.length] = "</td>";
                    if (y.rowCls) {
                        r = y.rowCls
                    }
                    if (y.rowStyle) {
                        B = y.rowStyle
                    }
                }
                a[g] = r;
                a[f] = B;
                a[a.length] = "</tr>"
            }
        }
        a[a.length] = "</table>";
        var n = a.join("");
        this._viewEl.firstChild.innerHTML = n;
        this._doSelects();
        this.doLayout()
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        if (this.columns && this.columns.length > 0) {
            mini.addClass(this.el, "mini-listbox-showcolumns")
        } else {
            mini.removeClass(this.el,
                    "mini-listbox-showcolumns")
        }
        if (this.showCheckBox) {
            mini.removeClass(this.el,
                    "mini-listbox-hideCheckBox")
        } else {
            mini.addClass(this.el, "mini-listbox-hideCheckBox")
        }
        var a = this.uid + "$ck$all";
        var j = document.getElementById(a);
        if (j) {
            j.style.display = this.showAllCheckBox ? ""
                    : "none"
        }
        var g = this.isAutoHeight();
        h = this.getHeight(true);
        e = mini.getWidth(this._borderEl, true);
        var i = e;
        var f = this._viewEl;
        f.style.width = e + "px";
        if (!g) {
            var b = mini.getHeight(this._headerEl);
            h = h - b;
            f.style.height = h + "px"
        } else {
            f.style.height = "auto"
        }
        if (isIE) {
            var d = this._headerEl.firstChild, c = this._viewEl.firstChild.firstChild;
            if (this._viewEl.offsetHeight >= this._viewEl.scrollHeight) {
                c.style.width = "100%";
                if (d) {
                    d.style.width = "100%"
                }
            } else {
                var e = parseInt(c.parentNode.offsetWidth)
                        + "px";
                if (d) {
                    d.style.width = e
                }
            }
        }
        if (this._viewEl.offsetHeight < this._viewEl.scrollHeight) {
            this._headerEl.style.width = (i - 17) + "px"
        } else {
            this._headerEl.style.width = "100%"
        }
    },
    /**
     * 
     * function setShowCheckBox(showCheckBox)
     * @member mini.ListBox
     * @param {Boolean} showCheckBox
     *
     */
    setShowCheckBox : function(a) {
        this.showCheckBox = a;
        this.doLayout()
    },
    /**
     * 
     * function getShowCheckBox()
     * @member mini.ListBox
     * @returns {Boolean}
     *
     */
    getShowCheckBox : function() {
        return this.showCheckBox
    },
    /**
     * 
     * function setShowAllCheckBox(showAllCheckBox)
     * @member mini.ListBox
     * @param {Boolean} showAllCheckBox
     *
     */
    setShowAllCheckBox : function(a) {
        this.showAllCheckBox = a;
        this.doLayout()
    },
    /**
     * 
     * function getShowAllCheckBox()
     * @member mini.ListBox
     * @returns {Boolean}
     *
     */
    getShowAllCheckBox : function() {
        return this.showAllCheckBox
    },
    /**
     * 
     * function setShowNullItem(showNullItem)
     * @member mini.ListBox
     * @param {Boolean} showNullItem
     *
     */
    setShowNullItem : function(a) {
        if (this.showNullItem != a) {
            this.showNullItem = a;
            this._doNullItem();
            this.doUpdate()
        }
    },
    /**
     * 
     * function getShowNullItem()
     * @member mini.ListBox
     * @returns {Boolean}
     *
     */
    getShowNullItem : function() {
        return this.showNullItem
    },
    /**
     * 
     * function setNullItemText(nullItemText)
     * @member mini.ListBox
     * @param {String} nullItemText
     *
     */
    setNullItemText : function(a) {
        if (this.nullItemText != a) {
            this.nullItemText = a;
            this._doNullItem();
            this.doUpdate()
        }
    },
    /**
     * 
     * function getNullItemText()
     * @member mini.ListBox
     * @returns {String}
     *
     */
    getNullItemText : function() {
        return this.nullItemText
    },
    _doNullItem : function() {
        for (var b = 0, a = this.data.length; b < a; b++) {
            var c = this.data[b];
            if (c.__NullItem) {
                this.data.removeAt(b);
                break
            }
        }
        if (this.showNullItem) {
            var c = {
                __NullItem : true
            };
            c[this.textField] = "";
            c[this.valueField] = "";
            this.data.insert(0, c)
        }
    },
    _OnDrawCell : function(a, b, c) {
        var f = c ? mini._getMap(c.field, a) : this
                .getItemText(a);
        var g = {
            sender : this,
            index : b,
            rowIndex : b,
            record : a,
            item : a,
            column : c,
            field : c ? c.field : null,
            value : f,
            cellHtml : f,
            rowCls : null,
            cellCls : c ? (c.cellCls || "") : "",
            rowStyle : null,
            cellStyle : c ? (c.cellStyle || "") : ""
        };
        var i = this.columns && this.columns.length > 0;
        if (!i) {
            if (b == 0 && this.showNullItem) {
                g.cellHtml = this.nullItemText
            }
        }
        if (g.autoEscape == true) {
            g.cellHtml = mini.htmlEncode(g.cellHtml)
        }
        if (c) {
            if (c.dateFormat) {
                if (mini.isDate(g.value)) {
                    g.cellHtml = mini.formatDate(f,
                            c.dateFormat)
                } else {
                    g.cellHtml = f
                }
            }
            var d = c.renderer;
            if (d) {
                fn = typeof d == "function" ? d : window[d];
                if (fn) {
                    g.cellHtml = fn.call(c, g)
                }
            }
        }
        this.fire("drawcell", g);
        if (g.cellHtml === null || g.cellHtml === undefined
                || g.cellHtml === "") {
            g.cellHtml = "&nbsp;"
        }
        return g
    },
    __OnScroll : function(a) {
        this._headerEl.scrollLeft = this._viewEl.scrollLeft
    },
    __OnClick : function(f) {
        var d = this.uid + "$ck$all";
        if (f.target.id == d) {
            var a = document.getElementById(d);
            if (a) {
                var b = a.checked;
                var c = this.getValue();
                if (b) {
                    this.selectAll()
                } else {
                    this.deselectAll()
                }
                this._OnSelectionChanged();
                if (c != this.getValue()) {
                    this._OnValueChanged();
                    this.fire("itemclick", {
                        htmlEvent : f
                    })
                }
            }
            return
        }
        this._fireEvent(f, "Click")
    },
    getAttrs : function(e) {
        var b = mini.ListBox.superclass.getAttrs.call(this, e);
        mini._ParseString(e, b,
                [ "nullItemText", "ondrawcell" ]);
        mini._ParseBool(e, b, [ "showCheckBox",
                "showAllCheckBox", "showNullItem" ]);
        if (e.nodeName.toLowerCase() != "select") {
            var d = mini.getChildNodes(e);
            for (var c = 0, a = d.length; c < a; c++) {
                var f = d[c];
                var g = jQuery(f).attr("property");
                if (!g) {
                    continue
                }
                g = g.toLowerCase();
                if (g == "columns") {
                    b.columns = mini._ParseColumns(f)
                } else {
                    if (g == "data") {
                        b.data = f.innerHTML
                    }
                }
            }
        }
        return b
    }
});
mini.regClass(mini.ListBox, "listbox");