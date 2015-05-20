mini.CheckBoxList = function() {
    mini.CheckBoxList.superclass.constructor.call(this)
};
mini
        .extend(
                mini.CheckBoxList,
                mini.ListControl,
                {
                    formField : true,
                    _labelFieldCls : "mini-labelfield-checkboxlist",
                    multiSelect : true,
                    repeatItems : 0,
                    repeatLayout : "none",
                    repeatDirection : "horizontal",
                    _itemCls : "mini-checkboxlist-item",
                    _itemHoverCls : "mini-checkboxlist-item-hover",
                    _itemSelectedCls : "mini-checkboxlist-item-selected",
                    _tableCls : "mini-checkboxlist-table",
                    _tdCls : "mini-checkboxlist-td",
                    _checkType : "checkbox",
                    uiCls : "mini-checkboxlist",
                    _create : function() {
                        var a = this.el = document.createElement("div");
                        this.el.className = this.uiCls;
                        this.el.innerHTML = '<table cellpadding="0" border="0" cellspacing="0" style="display:table;"><tr><td><div class="mini-list-inner"></div><div class="mini-errorIcon"></div><input type="hidden" /></td></tr></table>';
                        this.cellEl = a.getElementsByTagName("td")[0];
                        this._innerEl = this.cellEl.firstChild;
                        this._valueEl = this.cellEl.lastChild;
                        this._errorIconEl = this.cellEl.childNodes[1];
                        this._borderEl = this.el.firstChild
                    },
                    _getRepeatTable : function() {
                        var f = [];
                        if (this.repeatItems > 0) {
                            if (this.repeatDirection == "horizontal") {
                                var g = [];
                                for (var d = 0, b = this.data.length; d < b; d++) {
                                    var e = this.data[d];
                                    if (g.length == this.repeatItems) {
                                        f.push(g);
                                        g = []
                                    }
                                    g.push(e)
                                }
                                f.push(g)
                            } else {
                                var a = this.repeatItems > this.data.length ? this.data.length
                                        : this.repeatItems;
                                for (var d = 0, b = a; d < b; d++) {
                                    f.push([])
                                }
                                for (var d = 0, b = this.data.length; d < b; d++) {
                                    var e = this.data[d];
                                    var c = d % this.repeatItems;
                                    f[c].push(e)
                                }
                            }
                        } else {
                            f = [ this.data.clone() ]
                        }
                        return f
                    },
                    doUpdate : function() {
                        var d = this.data;
                        var m = "";
                        for (var e = 0, a = d.length; e < a; e++) {
                            var f = d[e];
                            f._i = e
                        }
                        if (this.repeatLayout == "flow") {
                            var g = this._getRepeatTable();
                            for (var e = 0, a = g.length; e < a; e++) {
                                var h = g[e];
                                for (var c = 0, b = h.length; c < b; c++) {
                                    var f = h[c];
                                    m += this._createItemHtml(f, f._i)
                                }
                                if (e != a - 1) {
                                    m += "<br/>"
                                }
                            }
                        } else {
                            if (this.repeatLayout == "table") {
                                var g = this._getRepeatTable();
                                m += '<table class="' + this._tableCls
                                        + '" cellpadding="0" cellspacing="1">';
                                for (var e = 0, a = g.length; e < a; e++) {
                                    var h = g[e];
                                    m += "<tr>";
                                    for (var c = 0, b = h.length; c < b; c++) {
                                        var f = h[c];
                                        m += '<td class="' + this._tdCls + '">';
                                        m += this._createItemHtml(f, f._i);
                                        m += "</td>"
                                    }
                                    m += "</tr>"
                                }
                                m += "</table>"
                            } else {
                                for (var e = 0, a = d.length; e < a; e++) {
                                    var f = d[e];
                                    m += this._createItemHtml(f, e)
                                }
                            }
                        }
                        this._innerEl.innerHTML = m;
                        for (var e = 0, a = d.length; e < a; e++) {
                            var f = d[e];
                            delete f._i
                        }
                    },
                    _createItemHtml : function(i, d) {
                        var f = this._OnDrawItem(i, d);
                        var a = this._createItemId(d);
                        var g = this._createCheckId(d);
                        var b = this.getItemValue(i);
                        var c = "";
                        var j = '<div id="' + a + '" index="' + d + '" class="'
                                + this._itemCls + " ";
                        if (i.enabled === false) {
                            j += " mini-disabled ";
                            c = "disabled"
                        }
                        var h = 'onclick="return false"';
                        h = 'onmousedown="this._checked = this.checked;" onclick="this.checked = this._checked"';
                        j += f.itemCls + '" style="' + f.itemStyle
                                + '"><input ' + h + " " + c + ' value="' + b
                                + '" id="' + g + '" type="' + this._checkType
                                + '" /><label for="' + g
                                + '" onclick="return false;">';
                        j += f.itemHtml + "</label></div>";
                        return j
                    },
                    _OnDrawItem : function(b, a) {
                        var c = this.getItemText(b);
                        var d = {
                            index : a,
                            item : b,
                            itemHtml : c,
                            itemCls : "",
                            itemStyle : ""
                        };
                        this.fire("drawitem", d);
                        if (d.itemHtml === null || d.itemHtml === undefined) {
                            d.itemHtml = ""
                        }
                        return d
                    },
                    setRepeatItems : function(a) {
                        a = parseInt(a);
                        if (isNaN(a)) {
                            a = 0
                        }
                        if (this.repeatItems != a) {
                            this.repeatItems = a;
                            this.doUpdate()
                        }
                    },
                    getRepeatItems : function() {
                        return this.repeatItems
                    },
                    setRepeatLayout : function(a) {
                        if (a != "flow" && a != "table") {
                            a = "none"
                        }
                        if (this.repeatLayout != a) {
                            this.repeatLayout = a;
                            this.doUpdate()
                        }
                    },
                    getRepeatLayout : function() {
                        return this.repeatLayout
                    },
                    setRepeatDirection : function(a) {
                        if (a != "vertical") {
                            a = "horizontal"
                        }
                        if (this.repeatDirection != a) {
                            this.repeatDirection = a;
                            this.doUpdate()
                        }
                    },
                    getRepeatDirection : function() {
                        return this.repeatDirection
                    },
                    getAttrs : function(d) {
                        var b = mini.CheckBoxList.superclass.getAttrs.call(
                                this, d);
                        var f = jQuery(d);
                        mini._ParseString(d, b, [ "ondrawitem" ]);
                        var e = parseInt(f.attr("repeatItems"));
                        if (!isNaN(e)) {
                            b.repeatItems = e
                        }
                        var a = f.attr("repeatLayout");
                        if (a) {
                            b.repeatLayout = a
                        }
                        var c = f.attr("repeatDirection");
                        if (c) {
                            b.repeatDirection = c
                        }
                        return b
                    }
                });
mini.regClass(mini.CheckBoxList, "checkboxlist");