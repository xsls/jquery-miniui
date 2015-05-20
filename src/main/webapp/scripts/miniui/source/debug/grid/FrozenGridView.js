mini.FrozenGridView = function() {
    mini.FrozenGridView.superclass.constructor.call(this)
};
mini
        .extend(
                mini.FrozenGridView,
                mini.GridView,
                {
                    isFixedRowHeight : function() {
                        return this.fixedRowHeight
                    },
                    frozenPosition : "left",
                    isRightFrozen : function() {
                        return this.frozenPosition == "right"
                    },
                    _create : function() {
                        mini.FrozenGridView.superclass._create.call(this);
                        var c = this.el;
                        var b = '<div class="mini-grid-columns-lock"></div>';
                        var e = '<div class="mini-grid-rows-lock"><div class="mini-grid-rows-content"></div></div>';
                        this._columnsLockEl = mini.before(this._columnsViewEl,
                                b);
                        this._rowsLockEl = mini.before(this._rowsViewEl, e);
                        this._rowsLockContentEl = this._rowsLockEl.firstChild;
                        var d = '<div class="mini-grid-filterRow-lock"></div>';
                        this._filterLockEl = mini.before(this._filterViewEl, d);
                        var a = '<div class="mini-grid-summaryRow-lock"></div>';
                        this._summaryLockEl = mini.before(this._summaryViewEl,
                                a)
                    },
                    _initEvents : function() {
                        mini.FrozenGridView.superclass._initEvents.call(this);
                        mini.on(this._rowsEl, "mousewheel",
                                this.__OnMouseWheel, this)
                    },
                    _createHeaderText : function(b, a) {
                        var c = b.header;
                        if (typeof c == "function") {
                            c = c.call(this, b)
                        }
                        if (mini.isNull(c) || c === "") {
                            c = "&nbsp;"
                        }
                        if (this.isFrozen() && a == 2) {
                            if (b.viewIndex1) {
                                c = "&nbsp;"
                            }
                        }
                        return c
                    },
                    _createColumnColSpan : function(b, d, a) {
                        if (this.isFrozen()) {
                            var c = b["colspan" + a];
                            if (c) {
                                d[d.length] = 'colspan="' + c + '" '
                            }
                        } else {
                            if (b.colspan) {
                                d[d.length] = 'colspan="' + b.colspan + '" '
                            }
                        }
                    },
                    doUpdateColumns : function() {
                        var d = this._columnsViewEl.scrollLeft;
                        var h = this.isFrozen() ? this.getFrozenColumnsRow()
                                : [];
                        var f = this.isFrozen() ? this.getUnFrozenColumnsRow()
                                : this.getVisibleColumnsRow();
                        var b = this.isFrozen() ? this.getFrozenColumns() : [];
                        var c = this.isFrozen() ? this.getUnFrozenColumns()
                                : this.getVisibleColumns();
                        var g = this._createColumnsHTML(h, 1, b);
                        var e = this._createColumnsHTML(f, 2, c);
                        var i = '<div class="mini-grid-topRightCell"></div>';
                        g += i;
                        e += i;
                        this._columnsLockEl.innerHTML = g;
                        this._columnsViewEl.innerHTML = e;
                        var a = this._columnsLockEl.firstChild;
                        a.style.width = "0px";
                        this._columnsViewEl.scrollLeft = d
                    },
                    doUpdateRows : function() {
                        var d = this.getVisibleRows();
                        var f = this.getFrozenColumns();
                        var e = this.getUnFrozenColumns();
                        if (this.isGrouping()) {
                            var b = this._createGroupingHTML(f, 1);
                            var a = this._createGroupingHTML(e, 2);
                            this._rowsLockContentEl.innerHTML = b;
                            this._rowsViewContentEl.innerHTML = a
                        } else {
                            var b = this._createRowsHTML(f, 1,
                                    this.isFrozen() ? d : []);
                            var a = this._createRowsHTML(e, 2, d);
                            this._rowsLockContentEl.innerHTML = b;
                            this._rowsViewContentEl.innerHTML = a
                        }
                        var c = this._rowsLockContentEl.firstChild;
                        c.style.width = "0px"
                    },
                    _doUpdateFilterRow : function() {
                        if (this._filterLockEl.firstChild) {
                            this._filterLockEl
                                    .removeChild(this._filterLockEl.firstChild)
                        }
                        if (this._filterViewEl.firstChild) {
                            this._filterViewEl
                                    .removeChild(this._filterViewEl.firstChild)
                        }
                        var d = this.getFrozenColumns();
                        var c = this.getUnFrozenColumns();
                        var b = this._createFilterRowHTML(d, 1);
                        var a = this._createFilterRowHTML(c, 2);
                        this._filterLockEl.innerHTML = b;
                        this._filterViewEl.innerHTML = a;
                        this._doRenderFilters()
                    },
                    _doUpdateSummaryRow : function() {
                        var d = this.getFrozenColumns();
                        var c = this.getUnFrozenColumns();
                        var b = this._createSummaryRowHTML(d, 1);
                        var a = this._createSummaryRowHTML(c, 2);
                        this._summaryLockEl.innerHTML = b;
                        this._summaryViewEl.innerHTML = a
                    },
                    _syncRowsHeightTimer : null,
                    _syncRowsHeight : function() {
                        var a = this;
                        function b() {
                            var h = document;
                            var e = a.getDataView();
                            for (var f = 0, c = e.length; f < c; f++) {
                                var n = e[f];
                                var m = a._getRowEl(n, 1);
                                var k = a._getRowEl(n, 2);
                                if (!m || !k) {
                                    continue
                                }
                                m.style.height = k.style.height = "auto";
                                var j = m.offsetHeight;
                                var g = k.offsetHeight;
                                if (j < g) {
                                    j = g
                                }
                                m.style.height = k.style.height = j + "px"
                            }
                            a._syncRowsHeightTimer = null
                        }
                        if (this.isFrozen() && this.isFixedRowHeight() == false) {
                            if (this._syncRowsHeightTimer) {
                                clearTimeout(this._syncRowsHeightTimer)
                            }
                            this._syncRowsHeightTimer = setTimeout(b, 2)
                        }
                    },
                    _syncColumnHeight : function() {
                        var c = this._columnsLockEl, a = this._columnsViewEl;
                        c.style.height = a.style.height = "auto";
                        if (this.isFrozen()) {
                            var d = c.offsetHeight;
                            var b = a.offsetHeight;
                            d = d > b ? d : b;
                            c.style.height = a.style.height = d + "px"
                        }
                        var c = this._summaryLockEl, a = this._summaryViewEl;
                        c.style.height = a.style.height = "auto";
                        if (this.isFrozen()) {
                            var d = c.offsetHeight;
                            var b = a.offsetHeight;
                            d = d > b ? d : b;
                            c.style.height = a.style.height = d + "px"
                        }
                    },
                    _layoutColumns : function() {
                        function e(i) {
                            return i.offsetHeight
                        }
                        function a(u) {
                            var t = [];
                            for (var s = 0, r = u.cells.length; s < r; s++) {
                                var v = u.cells[s];
                                if (v.style.width == "0px") {
                                    continue
                                }
                                t.push(v)
                            }
                            return t
                        }
                        function m(u) {
                            var t = a(u);
                            for (var s = 0, r = t.length; s < r; s++) {
                                var v = t[s];
                                v.style.height = "auto"
                            }
                        }
                        function k() {
                            o.style.height = o.style.height = "auto";
                            for (var s = 0, r = o.rows.length; s < r; s++) {
                                var u = o.rows[s];
                                var t = n.rows[s];
                                m(u);
                                m(t)
                            }
                        }
                        function f(y, z) {
                            var x = 0;
                            var v = a(y);
                            for (var w = 0, t = v.length; w < t; w++) {
                                var s = v[w];
                                var u = parseInt(s.rowSpan) > 1;
                                if (u && z) {
                                    continue
                                }
                                var r = s.offsetHeight;
                                if (r > x) {
                                    x = r
                                }
                            }
                            return x
                        }
                        if (!this.isFrozen()) {
                            return
                        }
                        var o = this._columnsLockEl.firstChild, n = this._columnsViewEl.firstChild;
                        function b(v, y) {
                            var u = f(y, true);
                            var t = a(v);
                            for (var s = 0, r = t.length; s < r; s++) {
                                var x = t[s];
                                var w = parseInt(x.rowSpan) > 1;
                                if (w) {
                                } else {
                                    mini.setHeight(x, u)
                                }
                            }
                        }
                        function j(v, y) {
                            var u = f(y);
                            var t = a(v);
                            for (var s = 0, r = t.length; s < r; s++) {
                                var x = t[s];
                                var w = parseInt(x.rowSpan) > 1;
                                if (w) {
                                    mini.setHeight(x, u)
                                } else {
                                }
                            }
                        }
                        k();
                        for (var d = 0, c = o.rows.length; d < c; d++) {
                            var q = o.rows[d];
                            var p = n.rows[d];
                            var h = f(q), g = f(p);
                            if (h == g) {
                            } else {
                                if (h < g) {
                                    b(q, p);
                                    j(q, p)
                                } else {
                                    if (h > g) {
                                        b(p, q);
                                        j(p, q)
                                    }
                                }
                            }
                        }
                        var h = e(o), g = e(n);
                        if (h < g) {
                            mini.setHeight(o, g)
                        } else {
                            if (h > g) {
                                mini.setHeight(n, h)
                            }
                        }
                    },
                    doLayout : function() {
                        if (this.canLayout() == false) {
                            return
                        }
                        this._doLayoutScroll = false;
                        var c = this.isAutoHeight();
                        var e = this.isFrozen();
                        var a = this.getViewportWidth(true);
                        var b = this.getLockedWidth();
                        var d = a - b;
                        this._doEmptyText();
                        var g = this.isRightFrozen() ? "marginRight"
                                : "marginLeft";
                        var f = this.isRightFrozen() ? "right" : "left";
                        if (e) {
                            this._filterViewEl.style[g] = b + "px";
                            this._summaryViewEl.style[g] = b + "px";
                            this._columnsViewEl.style[g] = b + "px";
                            this._rowsViewEl.style[g] = b + "px";
                            if (mini.isSafari || mini.isChrome || mini.isIE6) {
                                this._filterViewEl.style.width = d + "px";
                                this._summaryViewEl.style.width = d + "px";
                                this._columnsViewEl.style.width = d + "px"
                            } else {
                                this._filterViewEl.style.width = "auto";
                                this._summaryViewEl.style.width = "auto";
                                this._columnsViewEl.style.width = "auto"
                            }
                            if (mini.isSafari || mini.isChrome || mini.isIE6) {
                                this._rowsViewEl.style.width = d + "px"
                            }
                            mini.setWidth(this._filterLockEl, b);
                            mini.setWidth(this._summaryLockEl, b);
                            mini.setWidth(this._columnsLockEl, b);
                            mini.setWidth(this._rowsLockEl, b);
                            this._filterLockEl.style[f] = "0px";
                            this._summaryLockEl.style[f] = "0px";
                            this._columnsLockEl.style[f] = "0px";
                            this._rowsLockEl.style[f] = "0px"
                        } else {
                            this._doClearFrozen()
                        }
                        this._layoutColumns();
                        this._syncColumnHeight();
                        mini.FrozenGridView.superclass.doLayout.call(this);
                        if (e) {
                            if (mini.isChrome || mini.isIE6) {
                                this._layoutColumns();
                                this._syncColumnHeight();
                                mini.FrozenGridView.superclass.doLayout
                                        .call(this)
                            }
                        }
                        if (c) {
                            this._rowsLockEl.style.height = "auto"
                        } else {
                            this._rowsLockEl.style.height = "100%"
                        }
                        this._syncRowsHeight()
                    },
                    _doEmptyText : function() {
                    },
                    _getRowEl : function(c, a) {
                        c = this.getRecord(c);
                        var d = this._createRowId(c, a);
                        var b = document.getElementById(d);
                        return b
                    },
                    _doClearFrozen : function() {
                        var b = this.isRightFrozen() ? "marginRight"
                                : "marginLeft";
                        var a = this.isRightFrozen() ? "right" : "left";
                        this._filterLockEl.style.left = "-10px";
                        this._summaryLockEl.style.left = "-10px";
                        this._columnsLockEl.style.left = "-10px";
                        this._rowsLockEl.style.left = "-10px";
                        this._filterLockEl.style.width = "0px";
                        this._summaryLockEl.style.width = "0px";
                        this._columnsLockEl.style.width = "0px";
                        this._rowsLockEl.style.width = "0px";
                        this._filterViewEl.style.marginLeft = "0px";
                        this._summaryViewEl.style.marginLeft = "0px";
                        this._columnsViewEl.style.marginLeft = "0px";
                        this._rowsViewEl.style.marginLeft = "0px";
                        this._filterViewEl.style.width = "auto";
                        this._summaryViewEl.style.width = "auto";
                        this._columnsViewEl.style.width = "auto";
                        this._rowsViewEl.style.width = "auto";
                        if (mini.isSafari || mini.isChrome || mini.isIE6) {
                            this._filterViewEl.style.width = "100%";
                            this._summaryViewEl.style.width = "100%";
                            this._columnsViewEl.style.width = "100%";
                            this._rowsViewEl.style.width = "100%"
                        }
                    },
                    frozenColumns : function(a, b) {
                        this.frozen(a, b)
                    },
                    unFrozenColumns : function() {
                        this.unFrozen()
                    },
                    frozen : function(a, b) {
                        this._doClearFrozen();
                        this._columnModel.frozen(a, b)
                    },
                    unFrozen : function() {
                        this._doClearFrozen();
                        this._columnModel.unFrozen()
                    },
                    setFrozenStartColumn : function(a) {
                        this._columnModel.setFrozenStartColumn(a)
                    },
                    setFrozenEndColumn : function(a) {
                        return this._columnModel.setFrozenEndColumn(a)
                    },
                    getFrozenStartColumn : function(a) {
                        return this._columnModel._frozenStartColumn
                    },
                    getFrozenEndColumn : function(a) {
                        return this._columnModel._frozenEndColumn
                    },
                    getFrozenColumnsRow : function() {
                        return this._columnModel.getFrozenColumnsRow()
                    },
                    getUnFrozenColumnsRow : function() {
                        return this._columnModel.getUnFrozenColumnsRow()
                    },
                    getLockedWidth : function() {
                        if (!this.isFrozen()) {
                            return 0
                        }
                        var b = this._columnsLockEl.firstChild.firstChild;
                        var a = b ? b.offsetWidth : 0;
                        return a
                    },
                    _canDeferSyncScroll : function() {
                        return this.isFrozen()
                    },
                    _syncScroll : function() {
                        var c = this._rowsViewEl.scrollLeft;
                        this._filterViewEl.scrollLeft = c;
                        this._summaryViewEl.scrollLeft = c;
                        this._columnsViewEl.scrollLeft = c;
                        var a = this;
                        var b = a._rowsViewEl.scrollTop;
                        a._rowsLockEl.scrollTop = b;
                        if (this._canDeferSyncScroll()) {
                            setTimeout(
                                    function() {
                                        a._rowsViewEl.scrollTop = a._rowsLockEl.scrollTop
                                    }, 50)
                        }
                    },
                    __OnMouseWheel : function(c) {
                        var b = this.getScrollTop() - c.wheelDelta;
                        var a = this.getScrollTop();
                        this.setScrollTop(b);
                        if (a != this.getScrollTop()) {
                            c.preventDefault()
                        }
                    }
                });
mini.regClass(mini.FrozenGridView, "FrozenGridView");