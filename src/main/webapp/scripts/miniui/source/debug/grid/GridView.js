mini.GridView = function() {
    this._createTime = new Date();
    this._createColumnModel();
    this._bindColumnModel();
    this.data = [];
    this._createSource();
    this._bindSource();
    this._initData();
    mini.GridView.superclass.constructor.call(this);
    this._doUpdateFilterRow();
    this._doUpdateSummaryRow();
    this.doUpdate()
};
mini
        .extend(
                mini.GridView,
                mini.Panel,
                {
                    _displayStyle : "block",
                    _rowIdField : "_id",
                    width : "100%",
                    showColumns : true,
                    showFilterRow : false,
                    showSummaryRow : false,
                    showPager : false,
                    allowCellWrap : false,
                    allowHeaderWrap : false,
                    showModified : true,
                    showNewRow : true,
                    showEmptyText : false,
                    emptyText : "No data returned.",
                    showHGridLines : true,
                    showVGridLines : true,
                    allowAlternating : false,
                    _alternatingCls : "mini-grid-row-alt",
                    _rowCls : "mini-grid-row",
                    _cellCls : "mini-grid-cell",
                    _headerCellCls : "mini-grid-headerCell",
                    _rowSelectedCls : "mini-grid-row-selected",
                    _rowHoverCls : "mini-grid-row-hover",
                    _cellSelectedCls : "mini-grid-cell-selected",
                    defaultRowHeight : 21,
                    fixedRowHeight : false,
                    isFixedRowHeight : function() {
                        return this.fixedRowHeight
                    },
                    fitColumns : true,
                    isFitColumns : function() {
                        return this.fitColumns
                    },
                    uiCls : "mini-gridview",
                    _create : function() {
                        mini.GridView.superclass._create.call(this);
                        var f = this.el;
                        mini.addClass(f, "mini-grid");
                        mini.addClass(this._borderEl, "mini-grid-border");
                        mini.addClass(this._viewportEl, "mini-grid-viewport");
                        var a = '<div class="mini-grid-pager"></div>';
                        var e = '<div class="mini-grid-filterRow"><div class="mini-grid-filterRow-view"></div><div class="mini-grid-scrollHeaderCell"></div></div>';
                        var b = '<div class="mini-grid-summaryRow"><div class="mini-grid-summaryRow-view"></div><div class="mini-grid-scrollHeaderCell"></div></div>';
                        var c = '<div class="mini-grid-columns"><div class="mini-grid-columns-view"></div><div class="mini-grid-scrollHeaderCell"></div></div>';
                        this._columnsEl = mini.after(this._toolbarEl, c);
                        this._filterEl = mini.after(this._columnsEl, e);
                        this._rowsEl = this._bodyEl;
                        mini.addClass(this._rowsEl, "mini-grid-rows");
                        this._summaryEl = mini.after(this._rowsEl, b);
                        this._bottomPagerEl = mini.after(this._summaryEl, a);
                        this._columnsViewEl = this._columnsEl.childNodes[0];
                        this._topRightCellEl = this._columnsEl.childNodes[1];
                        this._rowsViewEl = mini
                                .append(
                                        this._rowsEl,
                                        '<div class="mini-grid-rows-view"><div class="mini-grid-rows-content"></div></div>');
                        this._rowsViewContentEl = this._rowsViewEl.firstChild;
                        this._filterViewEl = this._filterEl.childNodes[0];
                        this._summaryViewEl = this._summaryEl.childNodes[0];
                        var d = '<a href="#" class="mini-grid-focus" style="position:absolute;left:0px;top:0px;width:0px;height:0px;outline:none;" hideFocus onclick="return false" ></a>';
                        this._focusEl = mini.append(this._borderEl, d)
                    },
                    destroy : function(c) {
                        if (this._dataSource) {
                            this._dataSource.destroy();
                            this._dataSource = null
                        }
                        if (this._columnModel) {
                            this._columnModel.destroy();
                            this._columnModel = null
                        }
                        if (this._pagers) {
                            var d = this._pagers.clone();
                            for (var b = 0, a = d.length; b < a; b++) {
                                d[b].destroy(c)
                            }
                            this._pagers = null
                        }
                        if (this._viewportEl) {
                            mini.clearEvent(this._viewportEl)
                        }
                        if (this._rowsViewEl) {
                            mini.clearEvent(this._rowsViewEl)
                        }
                        this._columnsEl = this._rowsEl = this._filterEl = this._summaryEl = this._bottomPagerEl = null;
                        this._columnsViewEl = this._topRightCellEl = this._rowsViewEl = this._rowsViewContentEl = null;
                        this._filterViewEl = this._summaryViewEl = this._focusEl = null;
                        this._viewportEl = null;
                        mini.GridView.superclass.destroy.call(this, c)
                    },
                    _initEvents : function() {
                        mini.GridView.superclass._initEvents.call(this);
                        mini.on(this._rowsViewEl, "scroll",
                                this.__OnRowViewScroll, this)
                    },
                    _sizeChanged : function() {
                        mini.GridView.superclass._sizeChanged.call(this)
                    },
                    _setBodyWidth : false,
                    doLayout : function() {
                        var f = this;
                        if (!this.canLayout()) {
                            return
                        }
                        mini.GridView.superclass.doLayout.call(this);
                        this._stopLayout();
                        var c = this.isAutoHeight();
                        var h = this._columnsViewEl.firstChild;
                        var b = this._rowsViewContentEl.firstChild;
                        var g = this._filterViewEl.firstChild;
                        var a = this._summaryViewEl.firstChild;
                        function e(i) {
                            if (this.isFitColumns()) {
                                b.style.width = "100%";
                                if (mini.isSafari || mini.isChrome
                                        || mini.isIE6) {
                                    i.style.width = b.offsetWidth + "px"
                                } else {
                                    if (this._rowsViewEl.scrollHeight > this._rowsViewEl.clientHeight + 1) {
                                        i.style.width = "100%";
                                        i.parentNode.style.width = "auto";
                                        i.parentNode.style.paddingRight = "17px";
                                        if (mini.isIE8) {
                                            mini.removeClass(this._rowsViewEl,
                                                    "mini-grid-hidden-y")
                                        }
                                    } else {
                                        i.style.width = "100%";
                                        i.parentNode.style.width = "auto";
                                        i.parentNode.style.paddingRight = "0px";
                                        if (mini.isIE8) {
                                            mini.addClass(this._rowsViewEl,
                                                    "mini-grid-hidden-y")
                                        }
                                    }
                                }
                            } else {
                                b.style.width = "0px";
                                i.style.width = "0px";
                                if (mini.isSafari || mini.isChrome
                                        || mini.isIE6) {
                                } else {
                                    i.parentNode.style.width = "100%";
                                    i.parentNode.style.paddingRight = "0px"
                                }
                            }
                        }
                        e.call(this, h);
                        e.call(this, g);
                        e.call(this, a);
                        this._syncScroll();
                        var d = this;
                        setTimeout(function() {
                            mini.layout(d._filterEl);
                            mini.layout(d._summaryEl)
                        }, 10);
                        if (mini.isIE10) {
                            setTimeout(function() {
                                if (d.isFitColumns()) {
                                    h.style.width = "auto";
                                    h.offsetWidth;
                                    h.style.width = "100%"
                                } else {
                                    h.style.width = "0px"
                                }
                            }, 0);
                            mini.repaint(b)
                        }
                    },
                    setBody : function() {
                    },
                    _createTopRowHTML : function(c) {
                        var f = "";
                        if (mini.isIE) {
                            if (mini.isIE6 || mini.isIE7 || !mini.boxModel) {
                                f += '<tr style="display:none;height:0px;">'
                            } else {
                                f += '<tr style="height:0px;">'
                            }
                        } else {
                            f += '<tr style="height:0px;">'
                        }
                        for (var b = 0, a = c.length; b < a; b++) {
                            var e = c[b];
                            var d = e.width;
                            var g = e._id;
                            f += '<td id="'
                                    + g
                                    + '" style="padding:0;border:0;margin:0;height:0px;';
                            if (e.width) {
                                f += "width:" + e.width
                            }
                            f += '" ></td>'
                        }
                        f += '<td style="width:0px;"></td>';
                        f += "</tr>";
                        return f
                    },
                    _createColumnsHTML : function(u, s, r) {
                        var r = r ? r : this.getVisibleColumns();
                        var q = [ '<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">' ];
                        q.push(this._createTopRowHTML(r));
                        var p = this.getSortField();
                        var c = this.getSortOrder();
                        for (var m = 0, g = u.length; m < g; m++) {
                            var f = u[m];
                            q[q.length] = "<tr>";
                            for (var n = 0, e = f.length; n < e; n++) {
                                var d = f[n];
                                var o = this._createHeaderText(d, s);
                                var a = this._createHeaderCellId(d, s);
                                var h = "";
                                if (p && p == d.field) {
                                    h = c == "asc" ? "mini-grid-asc"
                                            : "mini-grid-desc"
                                }
                                var t = "";
                                if (this.allowHeaderWrap == false) {
                                    t = " mini-grid-headerCell-nowrap "
                                }
                                q[q.length] = '<td id="';
                                q[q.length] = a;
                                q[q.length] = '" class="mini-grid-headerCell '
                                        + h + " " + (d.headerCls || "") + " ";
                                var b = !(d.columns && d.columns.length > 0);
                                if (b) {
                                    q[q.length] = " mini-grid-bottomCell "
                                }
                                if (n == e - 1) {
                                    q[q.length] = " mini-grid-rightCell "
                                }
                                q[q.length] = '" style="';
                                if (d.headerStyle) {
                                    q[q.length] = d.headerStyle + ";"
                                }
                                if (d.headerAlign) {
                                    q[q.length] = "text-align:" + d.headerAlign
                                            + ";"
                                }
                                q[q.length] = '" ';
                                if (d.rowspan) {
                                    q[q.length] = 'rowspan="' + d.rowspan
                                            + '" '
                                }
                                this._createColumnColSpan(d, q, s);
                                q[q.length] = '><div class="mini-grid-headerCell-outer"><div class="mini-grid-headerCell-inner '
                                        + t + '">';
                                q[q.length] = o;
                                if (h) {
                                    q[q.length] = '<span class="mini-grid-sortIcon"></span>'
                                }
                                q[q.length] = '</div><div id="'
                                        + d._id
                                        + '" class="mini-grid-column-splitter"></div>';
                                q[q.length] = "</div></td>"
                            }
                            if (this.isFrozen() && s == 1) {
                                q[q.length] = '<td class="mini-grid-headerCell" style="width:0;"><div class="mini-grid-headerCell-inner" style="';
                                q[q.length] = '">0</div></td>'
                            }
                            q[q.length] = "</tr>"
                        }
                        q.push("</table>");
                        return q.join("")
                    },
                    _createHeaderText : function(b, a) {
                        var c = b.header;
                        if (typeof c == "function") {
                            c = c.call(this, b)
                        }
                        if (mini.isNull(c) || c === "") {
                            c = "&nbsp;"
                        }
                        return c
                    },
                    _createColumnColSpan : function(b, c, a) {
                        if (b.colspan) {
                            c[c.length] = 'colspan="' + b.colspan + '" '
                        }
                    },
                    doUpdateColumns : function() {
                        var d = this._columnsViewEl.scrollLeft;
                        var c = this.getVisibleColumnsRow();
                        var a = this._createColumnsHTML(c, 2);
                        var b = '<div class="mini-grid-topRightCell"></div>';
                        a += b;
                        this._columnsViewEl.innerHTML = a;
                        this._columnsViewEl.scrollLeft = d
                    },
                    doUpdate : function() {
                        if (this.canUpdate() == false) {
                            return
                        }
                        var c = this;
                        var e = this._isCreating();
                        var b = new Date();
                        this._doUpdateSummaryRow();
                        var a = this;
                        var d = this.getScrollLeft();
                        function f() {
                            if (!a.el) {
                                return
                            }
                            a.doUpdateColumns();
                            a.doUpdateRows();
                            a.doLayout();
                            a._doUpdateTimer = null
                        }
                        a.doUpdateColumns();
                        if (e) {
                            this._useEmptyView = true
                        }
                        if (this._rowsViewContentEl
                                && this._rowsViewContentEl.firstChild) {
                            this._rowsViewContentEl
                                    .removeChild(this._rowsViewContentEl.firstChild)
                        }
                        if (this._rowsLockContentEl
                                && this._rowsLockContentEl.firstChild) {
                            this._rowsLockContentEl
                                    .removeChild(this._rowsLockContentEl.firstChild)
                        }
                        a.doUpdateRows();
                        if (d > 0 && a.isVirtualScroll()) {
                            a.setScrollLeft(d)
                        }
                        if (e) {
                            this._useEmptyView = false
                        }
                        a.doLayout();
                        if (e && !this._doUpdateTimer) {
                            this._doUpdateTimer = setTimeout(f, 15)
                        }
                        this.unmask();
                        if (c._fireUpdateTimer) {
                            clearTimeout(c._fireUpdateTimer);
                            c._fireUpdateTimer = null
                        }
                        c._fireUpdateTimer = setTimeout(function() {
                            c._fireUpdateTimer = null;
                            c.fire("update")
                        }, 100)
                    },
                    _isCreating : function() {
                        return (new Date() - this._createTime) < 1000
                    },
                    deferUpdate : function(b) {
                        if (!b) {
                            b = 5
                        }
                        if (this._updateTimer || this._doUpdateTimer) {
                            return
                        }
                        var a = this;
                        this._updateTimer = setTimeout(function() {
                            a._updateTimer = null;
                            a.doUpdate()
                        }, b)
                    },
                    _pushUpdateCallback : function(c, b, a) {
                        var d = 0;
                        if (this._doUpdateTimer || this._updateTimer) {
                            d = 20
                        }
                        if (d == 0) {
                            c.apply(b, a)
                        } else {
                            setTimeout(function() {
                                c.apply(b, a)
                            }, d)
                        }
                    },
                    _updateCount : 0,
                    beginUpdate : function() {
                        this._updateCount++
                    },
                    endUpdate : function(a) {
                        this._updateCount--;
                        if (this._updateCount == 0 || a === true) {
                            this._updateCount = 0;
                            this.doUpdate()
                        }
                    },
                    canUpdate : function() {
                        return this._updateCount == 0
                    },
                    setDefaultRowHeight : function(a) {
                        this.defaultRowHeight = a
                    },
                    getDefaultRowHeight : function() {
                        return this.defaultRowHeight
                    },
                    _getRowHeight : function(a) {
                        var b = this.defaultRowHeight;
                        if (a._height) {
                            b = parseInt(a._height);
                            if (isNaN(parseInt(a._height))) {
                                b = rowHeight
                            }
                        }
                        b -= 4;
                        b -= 1;
                        return b
                    },
                    _createGroupingHTML : function(g, s) {
                        var f = this.getGroupingView();
                        var b = this._showGroupSummary;
                        var n = this.isFrozen();
                        var q = 0;
                        var o = this;
                        function m(v, w) {
                            p
                                    .push('<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">');
                            if (g.length > 0) {
                                p.push(o._createTopRowHTML(g));
                                for (var u = 0, e = v.length; u < e; u++) {
                                    var x = v[u];
                                    o._createRowHTML(x, q++, g, s, p)
                                }
                            }
                            if (b) {
                            }
                            p.push("</table>")
                        }
                        var p = [ '<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">' ];
                        p.push(this._createTopRowHTML(g));
                        for (var i = 0, h = f.length; i < h; i++) {
                            if (s == 1 && !this.isFrozen()) {
                                continue
                            }
                            var r = f[i];
                            var d = this._createRowGroupId(r, s);
                            var c = this._createRowGroupRowsId(r, s);
                            var l = this._OnDrawGroup(r);
                            var t = r.expanded ? ""
                                    : " mini-grid-group-collapse ";
                            p[p.length] = '<tr id="';
                            p[p.length] = d;
                            p[p.length] = '" class="mini-grid-groupRow';
                            p[p.length] = t;
                            p[p.length] = '"><td class="mini-grid-groupCell" colspan="';
                            p[p.length] = g.length;
                            p[p.length] = '"><div class="mini-grid-groupHeader">';
                            if (!n || (n && s == 1)) {
                                p[p.length] = '<div class="mini-grid-group-ecicon"></div>';
                                p[p.length] = '<div class="mini-grid-groupTitle">'
                                        + l.cellHtml + "</div>"
                            } else {
                                p[p.length] = "&nbsp;"
                            }
                            p[p.length] = "</div></td></tr>";
                            var a = r.expanded ? "" : "display:none";
                            p[p.length] = '<tr class="mini-grid-groupRows-tr" style="';
                            p[p.length] = '"><td class="mini-grid-groupRows-td" colspan="';
                            p[p.length] = g.length;
                            p[p.length] = '"><div id="';
                            p[p.length] = c;
                            p[p.length] = '" class="mini-grid-groupRows" style="';
                            p[p.length] = a;
                            p[p.length] = '">';
                            m(r.rows, r);
                            p[p.length] = "</div></td></tr>"
                        }
                        p.push("</table>");
                        return p.join("")
                    },
                    _isFastCreating : function() {
                        var a = this.getVisibleRows();
                        if (a.length > 50) {
                            return this._isCreating()
                                    || this.getScrollTop() < 50 * this._defaultRowHeight
                        }
                        return false
                    },
                    isShowRowDetail : function(a) {
                        return false
                    },
                    isCellValid : function(a, b) {
                        return true
                    },
                    _createRowHTML : function(g, q, d, o, a) {
                        var n = !a;
                        if (!a) {
                            a = []
                        }
                        var f = "";
                        var v = this.isFixedRowHeight();
                        if (v) {
                            f = this._getRowHeight(g)
                        }
                        var k = -1;
                        var t = " ";
                        var j = -1;
                        var y = " ";
                        a[a.length] = '<tr class="mini-grid-row ';
                        if (g._state == "added" && this.showNewRow) {
                            a[a.length] = "mini-grid-newRow "
                        }
                        if (this.isShowRowDetail(g)) {
                            a[a.length] = "mini-grid-expandRow "
                        }
                        if (this.allowAlternating && q % 2 == 1) {
                            a[a.length] = this._alternatingCls;
                            a[a.length] = " "
                        }
                        var p = this._dataSource.isSelected(g);
                        if (p) {
                            a[a.length] = this._rowSelectedCls;
                            a[a.length] = " "
                        }
                        k = a.length;
                        a[a.length] = t;
                        a[a.length] = '" style="';
                        j = a.length;
                        a[a.length] = y;
                        if (g.visible === false) {
                            a[a.length] = ";display:none;"
                        }
                        a[a.length] = '" id="';
                        a[a.length] = this._createRowId(g, o);
                        a[a.length] = '">';
                        var A = this._currentCell;
                        for (var w = 0, u = d.length; w < u; w++) {
                            var h = d[w];
                            var z = this._createCellId(g, h);
                            var c = "";
                            var x = this._OnDrawCell(g, h, q, h._index);
                            if (x.cellHtml === null || x.cellHtml === undefined
                                    || x.cellHtml === "") {
                                x.cellHtml = "&nbsp;"
                            }
                            a[a.length] = "<td ";
                            if (x.rowSpan) {
                                a[a.length] = 'rowspan="' + x.rowSpan + '"'
                            }
                            if (x.colSpan) {
                                a[a.length] = 'colspan="' + x.colSpan + '"'
                            }
                            a[a.length] = ' id="';
                            a[a.length] = z;
                            a[a.length] = '" class="mini-grid-cell ';
                            if (!this.isCellValid(g, h)) {
                                a[a.length] = " mini-grid-cell-error "
                            }
                            if (w == u - 1) {
                                a[a.length] = " mini-grid-rightCell "
                            }
                            if (x.cellCls) {
                                a[a.length] = " " + x.cellCls + " "
                            }
                            if (c) {
                                a[a.length] = c
                            }
                            if (A && A[0] == g && A[1] == h) {
                                a[a.length] = " ";
                                a[a.length] = this._cellSelectedCls
                            }
                            a[a.length] = '" style="';
                            if (x.showHGridLines == false) {
                                a[a.length] = "border-bottom:0;"
                            }
                            if (x.showVGridLines == false) {
                                a[a.length] = "border-right:0;"
                            }
                            if (!x.visible) {
                                a[a.length] = "display:none;"
                            }
                            if (h.align) {
                                a[a.length] = "text-align:";
                                a[a.length] = h.align;
                                a[a.length] = ";"
                            }
                            if (x.cellStyle) {
                                a[a.length] = x.cellStyle
                            }
                            a[a.length] = '">';
                            a[a.length] = '<div class="mini-grid-cell-inner ';
                            if (!x.allowCellWrap) {
                                a[a.length] = " mini-grid-cell-nowrap "
                            }
                            if (x.cellInnerCls) {
                                a[a.length] = x.cellInnerCls
                            }
                            var b = h.field ? this._dataSource.isModified(g,
                                    h.field) : false;
                            if (b && this.showModified) {
                                a[a.length] = " mini-grid-cell-dirty"
                            }
                            a[a.length] = '" style="';
                            if (v) {
                                a[a.length] = "height:";
                                a[a.length] = f;
                                a[a.length] = "px;";
                                a[a.length] = "line-height:";
                                a[a.length] = f;
                                a[a.length] = "px;"
                            }
                            if (x.cellInnerStyle) {
                                a[a.length] = x.cellInnerStyle
                            }
                            a[a.length] = '">';
                            a[a.length] = x.cellHtml;
                            a[a.length] = "</div>";
                            a[a.length] = "</td>";
                            if (x.rowCls) {
                                t = x.rowCls
                            }
                            if (x.rowStyle) {
                                y = x.rowStyle
                            }
                        }
                        if (this.isFrozen() && o == 1) {
                            a[a.length] = '<td class="mini-grid-cell" style="width:0;';
                            if (this.showHGridLines == false) {
                                a[a.length] = "border-bottom:0;"
                            }
                            a[a.length] = '"><div class="mini-grid-cell-inner" style="';
                            if (v) {
                                a[a.length] = "height:";
                                a[a.length] = f;
                                a[a.length] = "px;"
                            }
                            a[a.length] = '">0</div></td>'
                        }
                        a[k] = t;
                        a[j] = y;
                        a[a.length] = "</tr>";
                        if (n) {
                            var r = a.join("");
                            var m = /(<script(.*)<\/script(\s*)>)/i;
                            r = r.replace(m, "");
                            return r
                        }
                    },
                    _createRowsHTML : function(b, o, e, l) {
                        e = e || this.getVisibleRows();
                        var i = [ '<table class="mini-grid-table mini-grid-rowstable" cellspacing="0" cellpadding="0" border="0">' ];
                        i.push(this._createTopRowHTML(b));
                        var m = this.uid + "$emptytext" + o;
                        if (o == 2) {
                            var a = (this.showEmptyText && e.length == 0) ? ""
                                    : "display:none;";
                            i
                                    .push('<tr id="'
                                            + m
                                            + '" style="'
                                            + a
                                            + '"><td class="mini-grid-emptyText" colspan="'
                                            + b.length + '">' + this.emptyText
                                            + "</td></tr>")
                        }
                        var n = 0;
                        if (e.length > 0) {
                            var g = e[0];
                            n = this.getVisibleRows().indexOf(g)
                        }
                        for (var d = 0, c = e.length; d < c; d++) {
                            var h = n + d;
                            var f = e[d];
                            this._createRowHTML(f, h, b, o, i)
                        }
                        if (l) {
                            i.push(l)
                        }
                        i.push("</table>");
                        return i.join("")
                    },
                    doUpdateRows : function() {
                        var c = this.getVisibleRows();
                        var b = this.getVisibleColumns();
                        if (this.isGrouping()) {
                            var a = this._createGroupingHTML(b, 2);
                            this._rowsViewContentEl.innerHTML = a
                        } else {
                            var a = this._createRowsHTML(b, 2, c);
                            this._rowsViewContentEl.innerHTML = a
                        }
                    },
                    _createFilterRowHTML : function(d, b) {
                        var h = [ '<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">' ];
                        h.push(this._createTopRowHTML(d));
                        h[h.length] = "<tr>";
                        for (var c = 0, a = d.length; c < a; c++) {
                            var f = d[c];
                            var g = this._createFilterCellId(f);
                            h[h.length] = '<td id="';
                            h[h.length] = g;
                            h[h.length] = '" class="mini-grid-filterCell" style="';
                            h[h.length] = '">&nbsp;</td>'
                        }
                        h[h.length] = '</tr></table><div class="mini-grid-scrollHeaderCell"></div>';
                        var e = h.join("");
                        return e
                    },
                    _doRenderFilters : function() {
                        var d = this.getVisibleColumns();
                        for (var c = 0, a = d.length; c < a; c++) {
                            var e = d[c];
                            if (e.filter) {
                                var b = this.getFilterCellEl(e);
                                if (b) {
                                    b.innerHTML = "";
                                    e.filter.render(b)
                                }
                            }
                        }
                    },
                    _doUpdateFilterRow : function() {
                        if (this._filterViewEl.firstChild) {
                            this._filterViewEl
                                    .removeChild(this._filterViewEl.firstChild)
                        }
                        var c = this.isFrozen();
                        var b = this.getVisibleColumns();
                        var a = this._createFilterRowHTML(b, 2);
                        this._filterViewEl.innerHTML = a;
                        this._doRenderFilters()
                    },
                    _createSummaryRowHTML : function(d, k) {
                        var b = this.getDataView();
                        var j = [ '<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">' ];
                        j.push(this._createTopRowHTML(d));
                        j[j.length] = "<tr>";
                        for (var g = 0, f = d.length; g < f; g++) {
                            var c = d[g];
                            var a = this._createSummaryCellId(c);
                            var h = this._OnDrawSummaryCell(b, c);
                            j[j.length] = '<td id="';
                            j[j.length] = a;
                            j[j.length] = '" class="mini-grid-summaryCell '
                                    + h.cellCls + '" style="' + h.cellStyle
                                    + ";";
                            j[j.length] = '">';
                            j[j.length] = h.cellHtml;
                            j[j.length] = "</td>"
                        }
                        j[j.length] = '</tr></table><div class="mini-grid-scrollHeaderCell"></div>';
                        var m = j.join("");
                        return m
                    },
                    _doUpdateSummaryRow : function() {
                        var b = this.getVisibleColumns();
                        var a = this._createSummaryRowHTML(b, 2);
                        this._summaryViewEl.innerHTML = a
                    },
                    _doSortByField : function(b, c) {
                        if (!b) {
                            return null
                        }
                        var a = this._columnModel._getDataTypeByField(b);
                        this._dataSource._doClientSortField(b, c, a)
                    },
                    _expandGroupOnLoad : true,
                    _GroupID : 1,
                    _groupField : "",
                    _groupDir : "",
                    groupBy : function(b, a) {
                        if (!b) {
                            return
                        }
                        this._groupField = b;
                        if (typeof a == "string") {
                            a = a.toLowerCase()
                        }
                        this._groupDir = a;
                        this._createGroupingView();
                        this.deferUpdate()
                    },
                    clearGroup : function() {
                        this._groupField = "";
                        this._groupDir = "";
                        this._groupDataView = null;
                        this.deferUpdate()
                    },
                    setGroupField : function(a) {
                        this.groupBy(a)
                    },
                    setGroupDir : function(a) {
                        this._groupDir = field;
                        this.groupBy(this._groupField, a)
                    },
                    isGrouping : function() {
                        return this._groupField != ""
                    },
                    getGroupingView : function() {
                        return this._groupDataView
                    },
                    _createGroupingView : function() {
                        if (this.isGrouping() == false) {
                            return
                        }
                        this._groupDataView = null;
                        var j = this._groupField, d = this._groupDir;
                        this._doSortByField(j, d);
                        var f = this.getVisibleRows();
                        var c = [];
                        var h = {};
                        for (var g = 0, e = f.length; g < e; g++) {
                            var b = f[g];
                            var m = b[j];
                            var a = mini.isDate(m) ? m.getTime() : m;
                            var k = h[a];
                            if (!k) {
                                k = h[a] = {};
                                k.field = j, k.dir = d;
                                k.value = m;
                                k.rows = [];
                                c.push(k);
                                k.id = "g" + this._GroupID++;
                                k.expanded = this._expandGroupOnLoad
                            }
                            k.rows.push(b)
                        }
                        this._groupDataView = c
                    },
                    _OnDrawGroup : function(b) {
                        var a = {
                            group : b,
                            rows : b.rows,
                            field : b.field,
                            dir : b.dir,
                            value : b.value,
                            cellHtml : b.field + " (" + b.rows.length
                                    + " Items)"
                        };
                        this.fire("drawgroup", a);
                        return a
                    },
                    getRowGroup : function(b) {
                        var a = typeof b;
                        if (a == "number") {
                            return this.getGroupingView()[b]
                        }
                        if (a == "string") {
                            return this._getRowGroupById(b)
                        }
                        return b
                    },
                    _getRowGroupByEvent : function(c) {
                        var a = mini.findParent(c.target, "mini-grid-groupRow");
                        if (a) {
                            var b = a.id.split("$");
                            if (b[0] != this._id) {
                                return null
                            }
                            var d = b[b.length - 1];
                            return this._getRowGroupById(d)
                        }
                        return null
                    },
                    _getRowGroupById : function(e) {
                        var a = this.getGroupingView();
                        for (var c = 0, b = a.length; c < b; c++) {
                            var d = a[c];
                            if (d.id == e) {
                                return d
                            }
                        }
                        return null
                    },
                    _createRowGroupId : function(b, a) {
                        return this._id + "$group" + a + "$" + b.id
                    },
                    _createRowGroupRowsId : function(b, a) {
                        return this._id + "$grouprows" + a + "$" + b.id
                    },
                    _createRowId : function(b, a) {
                        var c = this._id + "$row" + a + "$" + b._id;
                        return c
                    },
                    _createHeaderCellId : function(b, a) {
                        var c = this._id + "$headerCell" + a + "$" + b._id;
                        return c
                    },
                    _createCellId : function(b, a) {
                        var c = b._id + "$cell$" + a._id;
                        return c
                    },
                    _createFilterCellId : function(a) {
                        return this._id + "$filter$" + a._id
                    },
                    _createSummaryCellId : function(a) {
                        return this._id + "$summary$" + a._id
                    },
                    getFilterCellEl : function(a) {
                        a = this.getColumn(a);
                        if (!a) {
                            return null
                        }
                        return document.getElementById(this
                                ._createFilterCellId(a))
                    },
                    getSummaryCellEl : function(a) {
                        a = this.getColumn(a);
                        if (!a) {
                            return null
                        }
                        return document.getElementById(this
                                ._createSummaryCellId(a))
                    },
                    _doVisibleEls : function() {
                        mini.GridView.superclass._doVisibleEls.call(this);
                        this._columnsEl.style.display = this.showColumns ? "block"
                                : "none";
                        this._filterEl.style.display = this.showFilterRow ? "block"
                                : "none";
                        this._summaryEl.style.display = this.showSummaryRow ? "block"
                                : "none";
                        this._bottomPagerEl.style.display = this.showPager ? "block"
                                : "none"
                    },
                    setShowColumns : function(a) {
                        this.showColumns = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    setShowFilterRow : function(a) {
                        this.showFilterRow = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    setShowSummaryRow : function(a) {
                        this.showSummaryRow = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    setShowPager : function(a) {
                        this.showPager = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    setFitColumns : function(a) {
                        this.fitColumns = a;
                        mini.removeClass(this.el, "mini-grid-fixwidth");
                        if (this.fitColumns == false) {
                            mini.addClass(this.el, "mini-grid-fixwidth")
                        }
                        this.deferLayout()
                    },
                    getBodyHeight : function(b) {
                        var a = mini.GridView.superclass.getBodyHeight.call(
                                this, b);
                        a = a - this.getColumnsHeight()
                                - this.getFilterHeight()
                                - this.getSummaryHeight()
                                - this.getPagerHeight();
                        return a
                    },
                    getColumnsHeight : function() {
                        if (!this.showColumns) {
                            return 0
                        }
                        var a = mini.getHeight(this._columnsEl);
                        return a
                    },
                    getFilterHeight : function() {
                        return this.showFilterRow ? mini
                                .getHeight(this._filterEl) : 0
                    },
                    getSummaryHeight : function() {
                        return this.showSummaryRow ? mini
                                .getHeight(this._summaryEl) : 0
                    },
                    getPagerHeight : function() {
                        return this.showPager ? mini
                                .getHeight(this._bottomPagerEl) : 0
                    },
                    getGridViewBox : function(c) {
                        var b = mini.getBox(this._columnsEl);
                        var a = mini.getBox(this._bodyEl);
                        b.height = a.bottom - b.top;
                        b.bottom = b.top + b.height;
                        return b
                    },
                    getSortField : function(a) {
                        return this._dataSource.sortField
                    },
                    getSortOrder : function(a) {
                        return this._dataSource.sortOrder
                    },
                    _createSource : function() {
                        this._dataSource = new mini.DataTable()
                    },
                    _bindSource : function() {
                        var a = this._dataSource;
                        a.on("loaddata", this.__OnSourceLoadData, this);
                        a.on("cleardata", this.__OnSourceClearData, this)
                    },
                    __OnSourceLoadData : function(a) {
                        this._initData();
                        this.doUpdate()
                    },
                    __OnSourceClearData : function(a) {
                        this._initData();
                        this.doUpdate()
                    },
                    _initData : function() {
                    },
                    isFrozen : function() {
                        var b = this._columnModel._frozenStartColumn, a = this._columnModel._frozenEndColumn;
                        return this._columnModel.isFrozen()
                    },
                    _createColumnModel : function() {
                        this._columnModel = new mini.ColumnModel(this)
                    },
                    _bindColumnModel : function() {
                        this._columnModel.on("columnschanged",
                                this.__OnColumnsChanged, this)
                    },
                    __OnColumnsChanged : function(a) {
                        this.columns = this._columnModel.columns;
                        this._doUpdateFilterRow();
                        this._doUpdateSummaryRow();
                        this.doUpdate();
                        this.fire("columnschanged")
                    },
                    setColumns : function(a) {
                        this._columnModel.setColumns(a);
                        this.columns = this._columnModel.columns
                    },
                    getColumns : function() {
                        return this._columnModel.getColumns()
                    },
                    getBottomColumns : function() {
                        return this._columnModel.getBottomColumns()
                    },
                    getVisibleColumnsRow : function() {
                        var a = this._columnModel.getVisibleColumnsRow()
                                .clone();
                        return a
                    },
                    getVisibleColumns : function() {
                        var a = this._columnModel.getVisibleColumns().clone();
                        return a
                    },
                    getFrozenColumns : function() {
                        var a = this._columnModel.getFrozenColumns().clone();
                        return a
                    },
                    getUnFrozenColumns : function() {
                        var a = this._columnModel.getUnFrozenColumns().clone();
                        return a
                    },
                    getColumn : function(a) {
                        return this._columnModel.getColumn(a)
                    },
                    updateColumn : function(b, a) {
                        this._columnModel.updateColumn(b, a)
                    },
                    showColumns : function(c) {
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = this.getColumn(c[b]);
                            if (!d) {
                                continue
                            }
                            d.visible = true
                        }
                        this._columnModel._columnsChanged()
                    },
                    hideColumns : function(c) {
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = this.getColumn(c[b]);
                            if (!d) {
                                continue
                            }
                            d.visible = false
                        }
                        this._columnModel._columnsChanged()
                    },
                    showColumn : function(a) {
                        this.updateColumn(a, {
                            visible : true
                        })
                    },
                    hideColumn : function(a) {
                        this.updateColumn(a, {
                            visible : false
                        })
                    },
                    moveColumn : function(b, a, c) {
                        this._columnModel.moveColumn(b, a, c)
                    },
                    removeColumn : function(b) {
                        b = this.getColumn(b);
                        if (!b) {
                            return
                        }
                        var a = this.getParentColumn(b);
                        if (b && a) {
                            a.columns.remove(b);
                            this._columnModel._columnsChanged()
                        }
                        return b
                    },
                    setDefaultColumnWidth : function(a) {
                        this._columnModel._defaultColumnWidth = a
                    },
                    getDefaultColumnWidth : function() {
                        return this._columnModel._defaultColumnWidth
                    },
                    setColumnWidth : function(b, a) {
                        this.updateColumn(b, {
                            width : a
                        })
                    },
                    getColumnWidth : function(a) {
                        var b = this.getColumnBox(a);
                        return b.width
                    },
                    getParentColumn : function(a) {
                        return this._columnModel.getParentColumn(a)
                    },
                    getMaxColumnLevel : function() {
                        return this._columnModel._getMaxColumnLevel()
                    },
                    _isCellVisible : function(b, a) {
                        return true
                    },
                    _createDrawCellEvent : function(b, d, h, c) {
                        var f = mini._getMap(d.field, b);
                        var g = {
                            sender : this,
                            rowIndex : h,
                            columnIndex : c,
                            record : b,
                            row : b,
                            column : d,
                            field : d.field,
                            value : f,
                            cellHtml : f,
                            rowCls : "",
                            rowStyle : null,
                            cellCls : d.cellCls || "",
                            cellStyle : d.cellStyle || "",
                            allowCellWrap : this.allowCellWrap,
                            showHGridLines : this.showHGridLines,
                            showVGridLines : this.showVGridLines,
                            cellInnerCls : "",
                            cellInnnerStyle : "",
                            autoEscape : d.autoEscape
                        };
                        g.visible = this._isCellVisible(h, c);
                        if (g.visible == true && this._mergedCellMaps) {
                            var a = this._mergedCellMaps[h + ":" + c];
                            if (a) {
                                g.rowSpan = a.rowSpan;
                                g.colSpan = a.colSpan
                            }
                        }
                        return g
                    },
                    _OnDrawCell : function(a, d, i, c) {
                        var h = this._createDrawCellEvent(a, d, i, c);
                        var g = h.value;
                        if (d.dateFormat) {
                            if (mini.isDate(h.value)) {
                                h.cellHtml = mini.formatDate(g, d.dateFormat)
                            } else {
                                h.cellHtml = g
                            }
                        }
                        if (d.dataType == "float") {
                            var g = parseFloat(h.value);
                            if (!isNaN(g)) {
                                decimalPlaces = parseInt(d.decimalPlaces);
                                if (isNaN(decimalPlaces)) {
                                    decimalPlaces = 2
                                }
                                h.cellHtml = g.toFixed(decimalPlaces)
                            }
                        }
                        if (d.dataType == "currency") {
                            h.cellHtml = mini.formatCurrency(h.value,
                                    d.currencyUnit)
                        }
                        if (d.displayField) {
                            h.cellHtml = mini._getMap(d.displayField, a)
                        }
                        if (h.autoEscape == true) {
                            h.cellHtml = mini.htmlEncode(h.cellHtml)
                        }
                        var f = d.renderer;
                        if (f) {
                            var b = typeof f == "function" ? f : mini
                                    ._getFunctoin(f);
                            if (b) {
                                h.cellHtml = b.call(d, h)
                            }
                        }
                        this.fire("drawcell", h);
                        if (h.cellHtml && !!h.cellHtml.unshift
                                && h.cellHtml.length == 0) {
                            h.cellHtml = "&nbsp;"
                        }
                        if (h.cellHtml === null || h.cellHtml === undefined
                                || h.cellHtml === "") {
                            h.cellHtml = "&nbsp;"
                        }
                        return h
                    },
                    _OnDrawSummaryCell : function(a, c) {
                        var g = {
                            result : this.getResultObject(),
                            sender : this,
                            data : a,
                            column : c,
                            field : c.field,
                            value : "",
                            cellHtml : "",
                            cellCls : c.cellCls || "",
                            cellStyle : c.cellStyle || "",
                            allowCellWrap : this.allowCellWrap
                        };
                        if (c.summaryType) {
                            var b = mini.summaryTypes[c.summaryType];
                            if (b) {
                                g.value = b(a, c.field)
                            }
                        }
                        var f = g.value;
                        g.cellHtml = g.value;
                        if (g.value && parseInt(g.value) != g.value
                                && g.value.toFixed) {
                            decimalPlaces = parseInt(c.decimalPlaces);
                            if (isNaN(decimalPlaces)) {
                                decimalPlaces = 2
                            }
                            g.cellHtml = parseFloat(g.value
                                    .toFixed(decimalPlaces))
                        }
                        if (c.dateFormat) {
                            if (mini.isDate(g.value)) {
                                g.cellHtml = mini.formatDate(f, c.dateFormat)
                            } else {
                                g.cellHtml = f
                            }
                        }
                        if (c.dataType == "currency") {
                            g.cellHtml = mini.formatCurrency(g.cellHtml,
                                    c.currencyUnit)
                        }
                        var d = c.summaryRenderer;
                        if (d) {
                            b = typeof d == "function" ? d : window[d];
                            if (b) {
                                g.cellHtml = b.call(c, g)
                            }
                        }
                        c.summaryValue = g.value;
                        this.fire("drawsummarycell", g);
                        if (g.cellHtml === null || g.cellHtml === undefined
                                || g.cellHtml === "") {
                            g.cellHtml = "&nbsp;"
                        }
                        return g
                    },
                    getScrollTop : function() {
                        return this._rowsViewEl.scrollTop
                    },
                    setScrollTop : function(a) {
                        this._rowsViewEl.scrollTop = a
                    },
                    getScrollLeft : function() {
                        return this._rowsViewEl.scrollLeft
                    },
                    setScrollLeft : function(a) {
                        this._rowsViewEl.scrollLeft = a
                    },
                    _syncScroll : function() {
                        var a = this._rowsViewEl.scrollLeft;
                        this._filterViewEl.scrollLeft = a;
                        this._summaryViewEl.scrollLeft = a;
                        this._columnsViewEl.scrollLeft = a
                    },
                    __OnRowViewScroll : function(a) {
                        this._syncScroll()
                    },
                    _pagers : [],
                    _createPagers : function() {
                        this._pagers = [];
                        var a = new mini.Pager();
                        this._setBottomPager(a)
                    },
                    _setBottomPager : function(a) {
                        a = mini.create(a);
                        if (!a) {
                            return
                        }
                        if (this._bottomPager) {
                            this.unbindPager(this._bottomPager);
                            this._bottomPagerEl
                                    .removeChild(this._bottomPager.el)
                        }
                        this._bottomPager = a;
                        a.render(this._bottomPagerEl);
                        this.bindPager(a)
                    },
                    bindPager : function(a) {
                        this._pagers.add(a)
                    },
                    unbindPager : function(a) {
                        this._pagers.remove(a)
                    },
                    setShowEmptyText : function(a) {
                        this.showEmptyText = a;
                        if (this.data.length == 0) {
                            this.deferUpdate()
                        }
                    },
                    getShowEmptyText : function() {
                        return this.showEmptyText
                    },
                    setEmptyText : function(a) {
                        this.emptyText = a
                    },
                    getEmptyText : function() {
                        return this.emptyText
                    },
                    setShowModified : function(a) {
                        this.showModified = a
                    },
                    getShowModified : function() {
                        return this.showModified
                    },
                    setShowNewRow : function(a) {
                        this.showNewRow = a
                    },
                    getShowNewRow : function() {
                        return this.showNewRow
                    },
                    setAllowCellWrap : function(a) {
                        this.allowCellWrap = a
                    },
                    getAllowCellWrap : function() {
                        return this.allowCellWrap
                    },
                    setAllowHeaderWrap : function(a) {
                        this.allowHeaderWrap = a
                    },
                    getAllowHeaderWrap : function() {
                        return this.allowHeaderWrap
                    },
                    setShowHGridLines : function(a) {
                        if (this.showHGridLines != a) {
                            this.showHGridLines = a;
                            this.deferUpdate()
                        }
                    },
                    getShowHGridLines : function() {
                        return this.showHGridLines
                    },
                    setShowVGridLines : function(a) {
                        if (this.showVGridLines != a) {
                            this.showVGridLines = a;
                            this.deferUpdate()
                        }
                    },
                    getShowVGridLines : function() {
                        return this.showVGridLines
                    }
                });
mini.copyTo(mini.GridView.prototype, mini._DataTableApplys);
mini.regClass(mini.GridView, "gridview");