/**
 * 可滚动的表格视图
 * @class
 * @extends mini.FrozenGridView
 */
mini.ScrollGridView = function() {
    mini.ScrollGridView.superclass.constructor.call(this)
};
mini.extend(mini.ScrollGridView, mini.FrozenGridView, {
    virtualScroll : true,
    virtualRows : 25,
    defaultRowHeight : 23,
    _canDeferSyncScroll : function() {
        return this.isFrozen() && !this.isVirtualScroll()
    },
    setVirtualScroll : function(a) {
        this.virtualScroll = a;
        this.doUpdate()
    },
    getVirtualScroll : function(a) {
        return this.virtualScroll
    },
    isFixedRowHeight : function() {
        return this.fixedRowHeight || this.isVirtualScroll()
    },
    isVirtualScroll : function() {
        if (this.virtualScroll) {
            return this.isAutoHeight() == false
                    && this.isGrouping() == false
        }
        return false
    },
    _getScrollView : function() {
        var a = this.getVisibleRows();
        return a
    },
    _getScrollViewCount : function() {
        return this._getScrollView().length
    },
    _getScrollRowHeight : function(a, c) {
        if (c && c._height) {
            var b = parseInt(c._height);
            if (!isNaN(b)) {
                return b
            }
        }
        return this.defaultRowHeight
    },
    _getRangeHeight : function(g, b) {
        var a = 0;
        var e = this._getScrollView();
        for (var c = g; c < b; c++) {
            var f = e[c];
            var d = this._getScrollRowHeight(c, f);
            a += d
        }
        return a
    },
    _getIndexByScrollTop : function(g) {
        var a = 0;
        var f = this._getScrollView();
        var e = this._getScrollViewCount();
        for (var c = 0, b = e; c < b; c++) {
            var j = f[c];
            var d = this._getScrollRowHeight(c, j);
            a += d;
            if (a >= g) {
                return c
            }
        }
        return e
    },
    __getScrollViewRange : function(c, a) {
        var b = this._getScrollView();
        return b.getRange(c, a)
    },
    _getViewRegion : function() {
        var k = this._getScrollView();
        if (this.isVirtualScroll() == false) {
            var o = {
                top : 0,
                bottom : 0,
                rows : k,
                start : 0,
                end : 0
            };
            return o
        }
        var b = this.defaultRowHeight;
        var c = this._getViewNowRegion();
        var e = this.getScrollTop();
        var p = this._vscrollEl.offsetHeight;
        var m = this._getScrollViewCount();
        var d = c.start, h = c.end;
        for (var j = 0, g = m; j < g; j += this.virtualRows) {
            var f = j + this.virtualRows;
            if (j <= d && d < f) {
                d = j
            }
            if (j < h && h <= f) {
                h = f
            }
        }
        if (h > m) {
            h = m
        }
        if (h == 0) {
            h = this.virtualRows
        }
        var n = this._getRangeHeight(0, d);
        var a = this._getRangeHeight(h, this
                ._getScrollViewCount());
        var k = this.__getScrollViewRange(d, h);
        var o = {
            top : n,
            bottom : a,
            rows : k,
            start : d,
            end : h,
            viewStart : d,
            viewEnd : h
        };
        o.viewTop = this._getRangeHeight(0, o.viewStart);
        o.viewBottom = this._getRangeHeight(o.viewEnd, this
                ._getScrollViewCount());
        return o
    },
    _getViewNowRegion : function() {
        var d = this.defaultRowHeight;
        var f = this.getScrollTop();
        var g = this._vscrollEl.offsetHeight;
        var b = this._getIndexByScrollTop(f);
        var a = this._getIndexByScrollTop(f + g + 30);
        var c = this._getScrollViewCount();
        if (a > c) {
            a = c
        }
        var e = {
            start : b,
            end : a
        };
        return e
    },
    _canVirtualUpdate : function() {
        if (!this._viewRegion) {
            return true
        }
        var a = this._getViewNowRegion();
        if (this._viewRegion.start <= a.start
                && a.end <= this._viewRegion.end) {
            return false
        }
        return true
    },
    __OnColumnsChanged : function(b) {
        var a = this;
        this.columns = this._columnModel.columns;
        this._doUpdateFilterRow();
        this._doUpdateSummaryRow();
        if (this.getVisibleRows().length == 0) {
            this.doUpdate()
        } else {
            this.deferUpdate()
        }
        if (this.isVirtualScroll()) {
            this.__OnVScroll()
        }
        this.fire("columnschanged")
    },
    doLayout : function() {
        if (this.canLayout() == false) {
            return
        }
        mini.ScrollGridView.superclass.doLayout.call(this);
        this._layoutScroll()
    },
    _createRowsHTML : function(d, o, g, m, a, l) {
        var c = this.isVirtualScroll();
        if (!c) {
            return mini.ScrollGridView.superclass._createRowsHTML
                    .apply(this, arguments)
        }
        var n = c ? this._getViewRegion() : null;
        var i = [ '<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">' ];
        i.push(this._createTopRowHTML(d));
        if (this.isVirtualScroll()) {
            var b = m == 0 ? "display:none;" : "";
            i
                    .push('<tr class="mini-grid-virtualscroll-top" style="padding:0;border:0;'
                            + b
                            + '"><td colspan="'
                            + d.length
                            + '" style="height:'
                            + m
                            + "px;padding:0;border:0;"
                            + b
                            + '"></td></tr>')
        }
        if (o == 1 && this.isFrozen() == false) {
        } else {
            for (var f = 0, e = g.length; f < e; f++) {
                var h = g[f];
                this._createRowHTML(h, l, d, o, i);
                l++
            }
        }
        if (this.isVirtualScroll()) {
            i
                    .push('<tr class="mini-grid-virtualscroll-bottom" style="padding:0;border:0;"><td colspan="'
                            + d.length
                            + '" style="height:'
                            + a
                            + 'px;padding:0;border:0;"></td></tr>')
        }
        i.push("</table>");
        return i.join("")
    },
    doUpdateRows : function() {
        if (this.isVirtualScroll() == false) {
            mini.ScrollGridView.superclass.doUpdateRows
                    .call(this);
            return
        }
        var j = this._getViewRegion();
        this._viewRegion = j;
        var h = this.getFrozenColumns();
        var g = this.getUnFrozenColumns();
        var i = j.viewStart;
        var b = j.start;
        var c = j.viewEnd;
        if (this._scrollPaging) {
            var e = this.getPageIndex() * this.getPageSize();
            i -= e;
            b -= e;
            c -= e
        }
        var k = new Date();
        var f = this._createRowsHTML(h, 1, j.rows, j.viewTop,
                j.viewBottom, i);
        var d = this._createRowsHTML(g, 2, j.rows, j.viewTop,
                j.viewBottom, i);
        this._rowsLockContentEl.innerHTML = f;
        this._rowsViewContentEl.innerHTML = d;
        var a = this.getScrollTop();
        if (this._rowsViewEl.scrollTop != a) {
            this._rowsViewEl.scrollTop = a
        }
    },
    _create : function() {
        mini.ScrollGridView.superclass._create.call(this);
        this._vscrollEl = mini
                .append(
                        this._rowsEl,
                        '<div class="mini-grid-vscroll"><div class="mini-grid-vscroll-content"></div></div>');
        this._vscrollContentEl = this._vscrollEl.firstChild
    },
    _initEvents : function() {
        mini.ScrollGridView.superclass._initEvents.call(this);
        var a = this;
        mini.on(this._vscrollEl, "scroll", this.__OnVScroll,
                this);
        mini._onScrollDownUp(this._vscrollEl, function(b) {
            a._VScrollMouseDown = true
        }, function(b) {
            a._VScrollMouseDown = false
        })
    },
    _layoutScroll : function() {
        var d = this.isVirtualScroll();
        if (d) {
            var b = this.getScrollHeight();
            var c = b > this._rowsViewEl.offsetHeight;
            if (d && c) {
                this._vscrollEl.style.display = "block";
                this._vscrollContentEl.style.height = b + "px"
            } else {
                this._vscrollEl.style.display = "none"
            }
            if (this._rowsViewEl.scrollWidth > this._rowsViewEl.clientWidth + 1) {
                var a = this.getBodyHeight(true) - 18;
                if (a < 0) {
                    a = 0
                }
                this._vscrollEl.style.height = a + "px"
            } else {
                this._vscrollEl.style.height = "100%"
            }
        } else {
            this._vscrollEl.style.display = "none"
        }
    },
    getScrollHeight : function() {
        var a = this.getVisibleRows();
        return this._getRangeHeight(0, a.length)
    },
    setScrollTop : function(a) {
        if (this.isVirtualScroll()) {
            this._vscrollEl.scrollTop = a
        } else {
            this._rowsViewEl.scrollTop = a
        }
    },
    getScrollTop : function() {
        if (this.isVirtualScroll()) {
            return this._vscrollEl.scrollTop
        } else {
            return this._rowsViewEl.scrollTop
        }
    },
    __OnVScroll : function(b) {
        var c = this.isVirtualScroll();
        if (c) {
            this._scrollTop = this._vscrollEl.scrollTop;
            var a = this;
            setTimeout(function() {
                a._rowsViewEl.scrollTop = a._scrollTop;
                a.__scrollTimer = null
            }, 8);
            if (this._scrollTopTimer) {
                clearTimeout(this._scrollTopTimer)
            }
            this._scrollTopTimer = setTimeout(function() {
                a._scrollTopTimer = null;
                a._tryUpdateScroll();
                a._rowsViewEl.scrollTop = a._scrollTop
            }, 80)
        }
    },
    __OnMouseWheel : function(f) {
        var b = f.wheelDelta ? f : f.originalEvent;
        var a = b.wheelDelta || -b.detail * 24;
        var d = this.getScrollTop() - a;
        var c = this.getScrollTop();
        this.setScrollTop(d);
        if (c != this.getScrollTop() || this.isVirtualScroll()) {
            f.preventDefault()
        }
    },
    _tryUpdateScroll : function() {
        var c = this._canVirtualUpdate();
        if (c) {
            if (this._scrollPaging) {
                var b = this;
                this.reload(null, null, function(d) {
                })
            } else {
                var a = new Date();
                this.doUpdateRows()
            }
        } else {
        }
    }
});
mini.regClass(mini.ScrollGridView, "ScrollGridView");
mini._onScrollDownUp = function(e, d, f) {
    function a(g) {
        if (mini.isFirefox) {
            mini.on(document, "mouseup", b)
        } else {
            mini.on(document, "mousemove", c)
        }
        d(g)
    }
    function c(g) {
        mini.un(document, "mousemove", c);
        f(g)
    }
    function b(g) {
        mini.un(document, "mouseup", b);
        f(g)
    }
    mini.on(e, "mousedown", a)
};