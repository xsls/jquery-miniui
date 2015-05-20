mini.DataGrid = function(a) {
    mini.DataGrid.superclass.constructor.call(this, a);
    this._Events = new mini._Grid_Events(this);
    this._Select = new mini._Grid_Select(this);
    this._DragDrop = new mini._Grid_DragDrop(this);
    this._RowGroup = new mini._Grid_RowGroup(this);
    this._Splitter = new mini._Grid_ColumnSplitter(this);
    this._ColumnMove = new mini._Grid_ColumnMove(this);
    this._Sorter = new mini._Grid_Sorter(this);
    this._CellToolTip = new mini._Grid_CellToolTip(this);
    this._ColumnsMenu = new mini._Grid_ColumnsMenu(this);
    this._createPagers()
};
mini
        .extend(
                mini.DataGrid,
                mini.ScrollGridView,
                {
                    uiCls : "mini-datagrid",
                    selectOnLoad : false,
                    showHeader : false,
                    showPager : true,
                    onlyCheckSelection : false,
                    _$onlyCheckSelection : true,
                    allowUnselect : false,
                    allowRowSelect : true,
                    allowCellSelect : false,
                    allowCellEdit : false,
                    cellEditAction : "cellclick",
                    allowCellValid : false,
                    allowResizeColumn : true,
                    allowSortColumn : true,
                    allowMoveColumn : true,
                    showColumnsMenu : false,
                    virtualScroll : false,
                    enableHotTrack : true,
                    allowHotTrackOut : true,
                    showLoading : true,
                    columnMinWidth : 8,
                    set : function(e) {
                        if (typeof e == "string") {
                            return this
                        }
                        var d = e.value;
                        delete e.value;
                        var a = e.url;
                        delete e.url;
                        var c = e.data;
                        delete e.data;
                        var b = e.columns;
                        delete e.columns;
                        var f = e.defaultColumnWidth;
                        delete e.defaultColumnWidth;
                        if (f) {
                            this.setDefaultColumnWidth(f)
                        }
                        if (!mini.isNull(b)) {
                            this.setColumns(b)
                        }
                        mini.DataGrid.superclass.set.call(this, e);
                        if (!mini.isNull(c)) {
                            this.setData(c)
                        }
                        if (!mini.isNull(a)) {
                            this.setUrl(a)
                        }
                        if (!mini.isNull(d)) {
                            this.setValue(d)
                        }
                        return this
                    },
                    doUpdate : function() {
                        this._destroyEditors();
                        mini.DataGrid.superclass.doUpdate
                                .apply(this, arguments)
                    },
                    _destroyEditors : function() {
                        var b = mini.getChildControls(this);
                        var d = [];
                        for (var c = 0, a = b.length; c < a; c++) {
                            var e = b[c];
                            if (e.el && mini.findParent(e.el, this._rowCls)) {
                                d.push(e);
                                e.destroy()
                            }
                        }
                    },
                    _OnDrawCell : function() {
                        var a = mini.DataGrid.superclass._OnDrawCell.apply(
                                this, arguments);
                        return a
                    },
                    _bindSource : function() {
                        var a = this._dataSource;
                        a.on("beforeload", this.__OnSourceBeforeLoad, this);
                        a.on("preload", this.__OnSourcePreLoad, this);
                        a.on("load", this.__OnSourceLoadSuccess, this);
                        a.on("loaderror", this.__OnSourceLoadError, this);
                        a.on("loaddata", this.__OnSourceLoadData, this);
                        a.on("cleardata", this.__OnSourceClearData, this);
                        a.on("sort", this.__OnSourceSort, this);
                        a.on("filter", this.__OnSourceFilter, this);
                        a.on("pageinfochanged", this.__OnPageInfoChanged, this);
                        a.on("selectionchanged", this.__OnSelectionChanged,
                                this);
                        a.on("currentchanged", function(b) {
                            this.fire("currentchanged", b)
                        }, this);
                        a.on("add", this.__OnSourceAdd, this);
                        a.on("update", this.__OnSourceUpdate, this);
                        a.on("remove", this.__OnSourceRemove, this);
                        a.on("move", this.__OnSourceMove, this);
                        a.on("beforeadd", function(b) {
                            this.fire("beforeaddrow", b)
                        }, this);
                        a.on("beforeupdate", function(b) {
                            this.fire("beforeupdaterow", b)
                        }, this);
                        a.on("beforeremove", function(b) {
                            this.fire("beforeremoverow", b)
                        }, this);
                        a.on("beforemove", function(b) {
                            this.fire("beforemoverow", b)
                        }, this);
                        a.on("beforeselect", function(b) {
                            this.fire("beforeselect", b)
                        }, this);
                        a.on("beforedeselect", function(b) {
                            this.fire("beforedeselect", b)
                        }, this);
                        a.on("select", function(b) {
                            this.fire("select", b)
                        }, this);
                        a.on("deselect", function(b) {
                            this.fire("deselect", b)
                        }, this)
                    },
                    _getMaskWrapEl : function() {
                        return this.el
                    },
                    _initData : function() {
                        this.data = this._dataSource.getSource();
                        this.pageIndex = this.getPageIndex();
                        this.pageSize = this.getPageSize();
                        this.totalCount = this.getTotalCount();
                        this.totalPage = this.getTotalPage();
                        this.sortField = this.getSortField();
                        this.sortOrder = this.getSortOrder();
                        this.url = this.getUrl();
                        this._mergedCellMaps = {};
                        this._mergedCells = {};
                        this._cellErrors = [];
                        this._cellMapErrors = {};
                        if (this.isGrouping()) {
                            this.groupBy(this._groupField, this._groupDir);
                            if (this.collapseGroupOnLoad) {
                                this.collapseGroups()
                            }
                        }
                    },
                    __OnSourceBeforeLoad : function(a) {
                        this.fire("beforeload", a);
                        if (a.cancel == true) {
                            return
                        }
                        if (this.showLoading) {
                            this.loading()
                        }
                    },
                    __OnSourcePreLoad : function(a) {
                        this.fire("preload", a)
                    },
                    __OnSourceLoadSuccess : function(a) {
                        this.fire("load", a);
                        this.unmask()
                    },
                    __OnSourceLoadError : function(a) {
                        this.fire("loaderror", a);
                        this.unmask()
                    },
                    __OnSourceSort : function(a) {
                        this.deferUpdate();
                        this.fire("sort", a)
                    },
                    __OnSourceFilter : function(a) {
                        this.deferUpdate();
                        this.fire("filter", a)
                    },
                    __OnSourceAdd : function(a) {
                        this._doAddRowEl(a.record);
                        this._doUpdateSummaryRow();
                        this.fire("addrow", a)
                    },
                    __OnSourceUpdate : function(a) {
                        this._doUpdateRowEl(a.record);
                        this._doUpdateSummaryRow();
                        this.fire("updaterow", a)
                    },
                    __OnSourceRemove : function(a) {
                        this._doRemoveRowEl(a.record);
                        this._doUpdateSummaryRow();
                        this.fire("removerow", a);
                        if (this.isVirtualScroll()) {
                            this.deferUpdate()
                        }
                    },
                    __OnSourceMove : function(a) {
                        this._doMoveRowEl(a.record, a.index);
                        this._doUpdateSummaryRow();
                        this.fire("moverow", a)
                    },
                    __OnSelectionChanged : function(c) {
                        if (c.fireEvent !== false) {
                            if (c.select) {
                                this.fire("rowselect", c)
                            } else {
                                this.fire("rowdeselect", c)
                            }
                        }
                        var b = this;
                        if (this._selectionTimer) {
                            clearTimeout(this._selectionTimer);
                            this._selectionTimer = null
                        }
                        this._selectionTimer = setTimeout(function() {
                            b._selectionTimer = null;
                            if (c.fireEvent !== false) {
                                b.fire("SelectionChanged", c)
                            }
                        }, 1);
                        var a = new Date();
                        this._doRowSelect(c._records, c.select)
                    },
                    __OnPageInfoChanged : function(a) {
                        this._updatePagesInfo()
                    },
                    _updatePagesInfo : function() {
                        var a = this.getPageIndex();
                        var e = this.getPageSize();
                        var d = this.getTotalCount();
                        var h = this.getTotalPage();
                        var f = this._pagers;
                        for (var g = 0, c = f.length; g < c; g++) {
                            var b = f[g];
                            b.update(a, e, d);
                            this._dataSource.totalPage = b.totalPage
                        }
                    },
                    setPagerButtons : function(a) {
                        this._bottomPager.setButtons(a)
                    },
                    setPager : function(b) {
                        if (typeof b == "string") {
                            var a = mini.byId(b);
                            if (!a) {
                                return
                            }
                            mini.parse(b);
                            b = mini.get(b)
                        }
                        if (b) {
                            this.bindPager(b)
                        }
                    },
                    bindPager : function(a) {
                        if (!a) {
                            return
                        }
                        this.unbindPager(a);
                        this._pagers.add(a);
                        a.on("beforepagechanged", this.__OnPageChanged, this)
                    },
                    unbindPager : function(a) {
                        if (!a) {
                            return
                        }
                        this._pagers.remove(a);
                        a.un("pagechanged", this.__OnPageChanged, this)
                    },
                    __OnPageChanged : function(a) {
                        a.cancel = true;
                        this.gotoPage(a.pageIndex, a.pageSize)
                    },
                    _canUpdateRowEl : true,
                    _doUpdateRowEl : function(d) {
                        var f = this.getFrozenColumns();
                        var c = this.getUnFrozenColumns();
                        var e = this.indexOf(d);
                        var b = this._createRowHTML(d, e, c, 2);
                        var a = this._getRowEl(d, 2);
                        if (!a) {
                            return
                        }
                        jQuery(a).before(b);
                        if (a) {
                            a.parentNode.removeChild(a)
                        }
                        if (this.isFrozen()) {
                            var b = this._createRowHTML(d, e, f, 1);
                            var a = this._getRowEl(d, 1);
                            jQuery(a).before(b);
                            a.parentNode.removeChild(a)
                        }
                        this.deferLayout()
                    },
                    _doAddRowEl : function(i) {
                        var d = this.getFrozenColumns();
                        var c = this.getUnFrozenColumns();
                        var g = this._rowsLockContentEl.firstChild;
                        var e = this._rowsViewContentEl.firstChild;
                        var f = this.indexOf(i);
                        var h = this.getAt(f + 1);
                        function b(o, l, m, k) {
                            var n = this._createRowHTML(o, f, m, l);
                            if (h) {
                                var j = this._getRowEl(h, l);
                                jQuery(j).before(n)
                            } else {
                                mini.append(k, n)
                            }
                        }
                        b.call(this, i, 2, c, e);
                        if (this.isFrozen()) {
                            b.call(this, i, 1, d, g)
                        }
                        this.deferLayout();
                        var a = jQuery(".mini-grid-emptyText", this._bodyEl)[0];
                        if (a) {
                            a.style.display = "none";
                            a.parentNode.style.display = "none"
                        }
                    },
                    _doRemoveRowEl : function(e) {
                        var a = this._getRowEl(e, 1);
                        var d = this._getRowEl(e, 2);
                        if (a) {
                            a.parentNode.removeChild(a)
                        }
                        if (d) {
                            d.parentNode.removeChild(d)
                        }
                        if (!d) {
                            return
                        }
                        var c = this._getRowDetailEl(e, 1);
                        var f = this._getRowDetailEl(e, 2);
                        if (c) {
                            c.parentNode.removeChild(c)
                        }
                        if (f) {
                            f.parentNode.removeChild(f)
                        }
                        this.deferLayout();
                        if (this.showEmptyText
                                && this.getVisibleRows().length == 0) {
                            var b = jQuery(".mini-grid-emptyText", this._bodyEl)[0];
                            if (b) {
                                b.style.display = "";
                                b.parentNode.style.display = ""
                            }
                        }
                    },
                    _doMoveRowEl : function(b, a) {
                        this._doRemoveRowEl(b);
                        this._doAddRowEl(b)
                    },
                    _getRowGroupEl : function(c, a) {
                        if (a == 1 && !this.isFrozen()) {
                            return null
                        }
                        var d = this._createRowGroupId(c, a);
                        var b = mini.byId(d, this.el);
                        return b
                    },
                    _getRowGroupRowsEl : function(c, a) {
                        if (a == 1 && !this.isFrozen()) {
                            return null
                        }
                        var d = this._createRowGroupRowsId(c, a);
                        var b = mini.byId(d, this.el);
                        return b
                    },
                    _getRowEl : function(c, a) {
                        if (a == 1 && !this.isFrozen()) {
                            return null
                        }
                        c = this.getRecord(c);
                        var d = this._createRowId(c, a);
                        var b = mini.byId(d, this.el);
                        return b
                    },
                    _getHeaderCellEl : function(c, a) {
                        if (a == 1 && !this.isFrozen()) {
                            return null
                        }
                        c = this.getColumn(c);
                        var d = this._createHeaderCellId(c, a);
                        var b = mini.byId(d, this.el);
                        return b
                    },
                    _getCellEl : function(c, b) {
                        c = this.getRecord(c);
                        b = this.getColumn(b);
                        if (!c || !b) {
                            return null
                        }
                        var d = this._createCellId(c, b);
                        var a = mini.byId(d, this.el);
                        return a
                    },
                    getRecordByEvent : function(a) {
                        return this._getRecordByEvent(a)
                    },
                    _getRecordByEvent : function(d) {
                        var b = mini.findParent(d.target, this._rowCls);
                        if (!b) {
                            return null
                        }
                        var c = b.id.split("$");
                        var a = c[c.length - 1];
                        return this._getRowByID(a)
                    },
                    getColumnByEvent : function(a) {
                        if (!a) {
                            return null
                        }
                        return this._getColumnByEvent(a)
                    },
                    _getColumnByEvent : function(c) {
                        var a = mini.findParent(c.target, this._cellCls);
                        if (!a) {
                            a = mini.findParent(c.target, this._headerCellCls)
                        }
                        if (a) {
                            var b = a.id.split("$");
                            var d = b[b.length - 1];
                            return this._getColumnById(d)
                        }
                        return null
                    },
                    _getCellByEvent : function(c) {
                        var a = this._getRecordByEvent(c);
                        var b = this._getColumnByEvent(c);
                        return [ a, b ]
                    },
                    _getRowByID : function(a) {
                        return this._dataSource.getby_id(a)
                    },
                    _getColumnById : function(a) {
                        return this._columnModel._getColumnById(a)
                    },
                    addRowCls : function(d, a) {
                        var c = this._getRowEl(d, 1);
                        var b = this._getRowEl(d, 2);
                        if (c) {
                            mini.addClass(c, a)
                        }
                        if (b) {
                            mini.addClass(b, a)
                        }
                    },
                    removeRowCls : function(d, a) {
                        var c = this._getRowEl(d, 1);
                        var b = this._getRowEl(d, 2);
                        if (c) {
                            mini.removeClass(c, a)
                        }
                        if (b) {
                            mini.removeClass(b, a)
                        }
                    },
                    getCellBox : function(c, b) {
                        c = this.getRow(c);
                        b = this.getColumn(b);
                        if (!c || !b) {
                            return null
                        }
                        var a = this._getCellEl(c, b);
                        if (!a) {
                            return null
                        }
                        return mini.getBox(a)
                    },
                    getColumnBox : function(b) {
                        var d = this._createHeaderCellId(b, 2);
                        var a = document.getElementById(d);
                        if (!a) {
                            d = this._createHeaderCellId(b, 1);
                            a = document.getElementById(d)
                        }
                        if (a) {
                            var c = mini.getBox(a);
                            c.x -= 1;
                            c.left = c.x;
                            c.right = c.x + c.width;
                            return c
                        }
                    },
                    getRowBox : function(e) {
                        var b = this._getRowEl(e, 1);
                        var d = this._getRowEl(e, 2);
                        if (!d) {
                            return null
                        }
                        var c = mini.getBox(d);
                        if (b) {
                            var a = mini.getBox(b);
                            c.x = c.left = a.left;
                            c.width = c.right - c.x
                        }
                        return c
                    },
                    _doRowSelect : function(f, a) {
                        var e = new Date();
                        for (var d = 0, c = f.length; d < c; d++) {
                            var b = f[d];
                            if (a) {
                                this.addRowCls(b, this._rowSelectedCls)
                            } else {
                                this.removeRowCls(b, this._rowSelectedCls)
                            }
                        }
                    },
                    _tryFocus : function(c) {
                        try {
                            var b = c.target.tagName.toLowerCase();
                            if (b == "input" || b == "textarea"
                                    || b == "select") {
                                return
                            }
                            if (mini.hasClass(c.target,
                                    "mini-placeholder-label")) {
                                return
                            }
                            if (mini.findParent(c.target,
                                    "mini-grid-rows-content")) {
                                mini.setXY(this._focusEl, c.pageX, c.pageY);
                                this.focus()
                            }
                        } catch (a) {
                        }
                    },
                    focus : function() {
                        try {
                            var f = this;
                            var a = this.getCurrentCell();
                            if (a) {
                                var d = this.getCellBox(a[0], a[1]);
                                mini.setX(this._focusEl, d.x)
                            }
                            var h = this.getCurrent();
                            if (h) {
                                var c = this._getRowEl(h, 2);
                                if (c) {
                                    var b = mini.getBox(c);
                                    mini.setY(f._focusEl, b.top);
                                    if (mini.isIE || mini.isIE11) {
                                        f._focusEl.focus()
                                    } else {
                                        f.el.focus()
                                    }
                                }
                            } else {
                                if (mini.isIE || mini.isIE11) {
                                    f._focusEl.focus()
                                } else {
                                    f.el.focus()
                                }
                            }
                        } catch (g) {
                        }
                    },
                    focusRow : function(a) {
                        if (this._focusRow == a) {
                            return
                        }
                        if (this._focusRow) {
                            this
                                    .removeRowCls(this._focusRow,
                                            this._rowHoverCls)
                        }
                        this._focusRow = a;
                        if (a) {
                            this.addRowCls(a, this._rowHoverCls)
                        }
                    },
                    scrollIntoView : function(i, d) {
                        i = this.getRow(i);
                        if (!i) {
                            return
                        }
                        try {
                            if (d) {
                                if (this._columnModel.isFrozenColumn(d)) {
                                    d = null
                                }
                            }
                            if (d) {
                                var a = this._getCellEl(i, d);
                                mini.scrollIntoView(a, this._rowsViewEl, true)
                            } else {
                                if (this.isVirtualScroll()) {
                                    var g = this._getViewRegion();
                                    var c = this.indexOf(i);
                                    if (g.start <= c && c <= g.end) {
                                    } else {
                                        var h = this._getRangeHeight(0, c);
                                        this.setScrollTop(h)
                                    }
                                } else {
                                    var b = this._getRowEl(i, 2);
                                    mini.scrollIntoView(b, this._rowsViewEl,
                                            false)
                                }
                            }
                        } catch (f) {
                        }
                    },
                    setShowLoading : function(a) {
                        this.showLoading = a
                    },
                    getShowLoading : function() {
                        return this.showLoading
                    },
                    setEnableHotTrack : function(a) {
                        this.enableHotTrack = a
                    },
                    getEnableHotTrack : function() {
                        return this.enableHotTrack
                    },
                    setAllowHotTrackOut : function(a) {
                        this.allowHotTrackOut = a
                    },
                    getAllowHotTrackOut : function() {
                        return this.allowHotTrackOut
                    },
                    setOnlyCheckSelection : function(a) {
                        this.onlyCheckSelection = a
                    },
                    getOnlyCheckSelection : function() {
                        return this.onlyCheckSelection
                    },
                    setAllowUnselect : function(a) {
                        this.allowUnselect = a
                    },
                    getAllowUnselect : function() {
                        return this.allowUnselect
                    },
                    setAllowRowSelect : function(a) {
                        this.allowRowSelect = a
                    },
                    getAllowRowSelect : function() {
                        return this.allowRowSelect
                    },
                    setAllowCellSelect : function(a) {
                        this.allowCellSelect = a
                    },
                    getAllowCellSelect : function() {
                        return this.allowCellSelect
                    },
                    setAllowCellEdit : function(a) {
                        this.allowCellEdit = a
                    },
                    getAllowCellEdit : function() {
                        return this.allowCellEdit
                    },
                    setCellEditAction : function(a) {
                        this.cellEditAction = a
                    },
                    getCellEditAction : function() {
                        return this.cellEditAction
                    },
                    setAllowCellValid : function(a) {
                        this.allowCellValid = a
                    },
                    getAllowCellValid : function() {
                        return this.allowCellValid
                    },
                    setAllowResizeColumn : function(a) {
                        this.allowResizeColumn = a;
                        mini.removeClass(this.el, "mini-grid-resizeColumns-no");
                        if (!a) {
                            mini
                                    .addClass(this.el,
                                            "mini-grid-resizeColumns-no")
                        }
                    },
                    getAllowResizeColumn : function() {
                        return this.allowResizeColumn
                    },
                    setAllowSortColumn : function(a) {
                        this.allowSortColumn = a
                    },
                    getAllowSortColumn : function() {
                        return this.allowSortColumn
                    },
                    setAllowMoveColumn : function(a) {
                        this.allowMoveColumn = a
                    },
                    getAllowMoveColumn : function() {
                        return this.allowMoveColumn
                    },
                    setShowColumnsMenu : function(a) {
                        this.showColumnsMenu = a
                    },
                    getShowColumnsMenu : function() {
                        return this.showColumnsMenu
                    },
                    setEditNextRowCell : function(a) {
                        this.editNextRowCell = a
                    },
                    getEditNextRowCell : function() {
                        return this.editNextRowCell
                    },
                    setEditNextOnEnterKey : function(a) {
                        this.editNextOnEnterKey = a
                    },
                    getEditNextOnEnterKey : function() {
                        return this.editNextOnEnterKey
                    },
                    setEditOnTabKey : function(a) {
                        this.editOnTabKey = a
                    },
                    getEditOnTabKey : function() {
                        return this.editOnTabKey
                    },
                    setCreateOnEnter : function(a) {
                        this.createOnEnter = a
                    },
                    getCreateOnEnter : function() {
                        return this.createOnEnter
                    },
                    _currentCell : null,
                    _doCurrentCell : function(a) {
                        if (this._currentCell) {
                            var b = this._currentCell[0], d = this._currentCell[1];
                            var c = this._getCellEl(b, d);
                            if (c) {
                                if (a) {
                                    mini.addClass(c, this._cellSelectedCls)
                                } else {
                                    mini.removeClass(c, this._cellSelectedCls)
                                }
                            }
                        }
                    },
                    setCurrentCell : function(a) {
                        if (this._currentCell != a) {
                            this._doCurrentCell(false);
                            this._currentCell = a;
                            if (a) {
                                var d = this.getRow(a[0]);
                                var b = this.getColumn(a[1]);
                                if (d && b) {
                                    this._currentCell = [ d, b ]
                                } else {
                                    this._currentCell = null
                                }
                            }
                            this._doCurrentCell(true);
                            if (a) {
                                var c = this._getAnchorCell(a[0], a[1]);
                                if (!c) {
                                    if (this.isFrozen()) {
                                        this.scrollIntoView(a[0])
                                    } else {
                                        this.scrollIntoView(a[0], a[1])
                                    }
                                }
                            }
                            this.fire("currentcellchanged")
                        }
                    },
                    getCurrentCell : function() {
                        var a = this._currentCell;
                        if (a) {
                            if (this.indexOf(a[0]) == -1) {
                                this._currentCell = null;
                                a = null
                            }
                        }
                        return a
                    },
                    _editingCell : null,
                    isEditingCell : function(a) {
                        return this._editingCell
                                && this._editingCell[0] == a[0]
                                && this._editingCell[1] == a[1]
                    },
                    beginEditCell : function(c, a) {
                        function b(g, f) {
                            g = this.getRow(g);
                            f = this.getColumn(f);
                            var d = [ g, f ];
                            if (g && f) {
                                this.setCurrentCell(d)
                            }
                            var d = this.getCurrentCell();
                            if (this._editingCell && d) {
                                if (this._editingCell[0] == d[0]
                                        && this._editingCell[1] == d[1]) {
                                    return
                                }
                            }
                            if (this._editingCell) {
                                this.commitEdit()
                            }
                            if (d) {
                                var g = d[0], f = d[1];
                                var e = this._OnCellBeginEdit(g, f, this
                                        .getCellEditor(f));
                                if (e !== false) {
                                    this.scrollIntoView(g, f);
                                    this._editingCell = d;
                                    this._OnCellShowingEdit(g, f)
                                }
                            }
                        }
                        this._pushUpdateCallback(b, this, [ c, a ])
                    },
                    cancelEdit : function() {
                        if (this.allowCellEdit) {
                            if (this._editingCell) {
                                this._OnCellEndEdit()
                            }
                        } else {
                            if (this.isEditing()) {
                                this._allowLayout = false;
                                var c = this.getDataView();
                                for (var b = 0, a = c.length; b < a; b++) {
                                    var d = c[b];
                                    if (d._editing == true) {
                                        this.cancelEditRow(b)
                                    }
                                }
                                this._allowLayout = true;
                                this.doLayout()
                            }
                        }
                    },
                    commitEdit : function() {
                        if (this.allowCellEdit) {
                            if (this._editingCell) {
                                this._OnCellCommitEdit(this._editingCell[0],
                                        this._editingCell[1]);
                                this._OnCellEndEdit()
                            }
                        } else {
                            if (this.isEditing()) {
                                this._allowLayout = false;
                                var c = this.getDataView();
                                for (var b = 0, a = c.length; b < a; b++) {
                                    var d = c[b];
                                    if (d._editing == true) {
                                        this.commitEditRow(b)
                                    }
                                }
                                this._allowLayout = true;
                                this.doLayout()
                            }
                        }
                    },
                    getCellEditor : function(b, c) {
                        b = this.getColumn(b);
                        if (!b) {
                            return
                        }
                        if (this.allowCellEdit) {
                            var a = b.__editor;
                            if (!a) {
                                a = mini.getAndCreate(b.editor)
                            }
                            if (a && a != b.editor) {
                                b.editor = a
                            }
                            return a
                        } else {
                            c = this.getRow(c);
                            b = this.getColumn(b);
                            if (!c) {
                                c = this.getEditingRow()
                            }
                            if (!c || !b) {
                                return null
                            }
                            var d = this.uid + "$" + c._uid + "$" + b._id
                                    + "$editor";
                            return mini.get(d)
                        }
                    },
                    _OnCellBeginEdit : function(b, d, c) {
                        var f = mini._getMap(d.field, b);
                        var h = {
                            sender : this,
                            rowIndex : this.indexOf(b),
                            row : b,
                            record : b,
                            column : d,
                            field : d.field,
                            editor : c,
                            value : f,
                            cancel : false
                        };
                        this.fire("cellbeginedit", h);
                        if (!mini.isNull(d.defaultValue)
                                && (mini.isNull(h.value) || h.value === "")) {
                            var a = d.defaultValue;
                            var g = mini.clone({
                                d : a
                            });
                            h.value = g.d
                        }
                        var c = h.editor;
                        f = h.value;
                        if (h.cancel) {
                            return false
                        }
                        if (!c) {
                            return false
                        }
                        if (mini.isNull(f)) {
                            f = ""
                        }
                        if (c.setValue) {
                            c.setValue(f)
                        }
                        c.ownerRowID = b._uid;
                        if (d.displayField && c.setText) {
                            var i = mini._getMap(d.displayField, b);
                            if (!mini.isNull(d.defaultText)
                                    && (mini.isNull(i) || i === "")) {
                                var g = mini.clone({
                                    d : d.defaultText
                                });
                                i = g.d
                            }
                            c.setText(i)
                        }
                        if (this.allowCellEdit) {
                            this._editingControl = h.editor
                        }
                        return true
                    },
                    _OnCellCommitEdit : function(f, d, j, g) {
                        var h = {
                            sender : this,
                            rowIndex : this.indexOf(f),
                            record : f,
                            row : f,
                            column : d,
                            field : d.field,
                            editor : g ? g : this.getCellEditor(d),
                            value : mini.isNull(j) ? "" : j,
                            text : "",
                            cancel : false
                        };
                        if (h.editor && h.editor.getValue) {
                            try {
                                h.editor.blur()
                            } catch (i) {
                            }
                            h.value = h.editor.getValue()
                        }
                        if (h.editor && h.editor.getText) {
                            h.text = h.editor.getText()
                        }
                        var a = mini._getMap(d.field, f), b = h.value;
                        h.oldValue = a;
                        if (mini.isEquals(a, b)) {
                            return h
                        }
                        this.fire("cellcommitedit", h);
                        if (h.cancel == false) {
                            if (this.allowCellEdit) {
                                var c = {};
                                c[d.field] = h.value;
                                if (d.displayField) {
                                    c[d.displayField] = h.text
                                }
                                this.updateRow(f, c)
                            }
                        }
                        return h
                    },
                    _OnCellEndEdit : function(a, f) {
                        if (!this._editingCell && !a) {
                            return
                        }
                        if (!a) {
                            a = this._editingCell[0]
                        }
                        if (!f) {
                            f = this._editingCell[1]
                        }
                        var g = {
                            sender : this,
                            rowIndex : this.indexOf(a),
                            record : a,
                            row : a,
                            column : f,
                            field : f.field,
                            editor : this._editingControl,
                            value : a[f.field]
                        };
                        this.fire("cellendedit", g);
                        if (this.allowCellEdit && g.editor) {
                            var d = g.editor;
                            if (d && d.setIsValid) {
                                d.setIsValid(true)
                            }
                            if (this._editWrap) {
                                this._editWrap.style.display = "none"
                            }
                            var h = this._editWrap.childNodes;
                            for (var b = h.length - 1; b >= 0; b--) {
                                var c = h[b];
                                this._editWrap.removeChild(c)
                            }
                            if (d && d.hidePopup) {
                                d.hidePopup()
                            }
                            if (d && d.setValue) {
                                d.setValue("")
                            }
                            this._editingControl = null;
                            this._editingCell = null;
                            if (this.allowCellValid) {
                                this.validateCell(a, f)
                            }
                        }
                    },
                    _OnCellShowingEdit : function(d, b) {
                        if (!this._editingControl) {
                            return false
                        }
                        var i = this.getCellBox(d, b);
                        var c = document.body.scrollWidth;
                        if (i.right > c) {
                            i.width = c - i.left;
                            if (i.width < 10) {
                                i.width = 10
                            }
                            i.right = i.left + i.width
                        }
                        var g = {
                            sender : this,
                            rowIndex : this.indexOf(d),
                            record : d,
                            row : d,
                            column : b,
                            field : b.field,
                            cellBox : i,
                            editor : this._editingControl
                        };
                        this.fire("cellshowingedit", g);
                        var f = g.editor;
                        if (f && f.setIsValid) {
                            f.setIsValid(true)
                        }
                        var h = this._getEditWrap(i);
                        this._editWrap.style.zIndex = mini.getMaxZIndex();
                        if (f.render) {
                            f.render(this._editWrap);
                            setTimeout(function() {
                                f.focus();
                                if (f.selectText) {
                                    f.selectText()
                                }
                            }, 50);
                            if (f.setVisible) {
                                f.setVisible(true)
                            }
                        } else {
                            if (f.el) {
                                this._editWrap.appendChild(f.el);
                                setTimeout(function() {
                                    try {
                                        f.el.focus()
                                    } catch (k) {
                                    }
                                }, 50)
                            }
                        }
                        if (f.setWidth) {
                            var a = i.width;
                            if (a < 20) {
                                a = 20
                            }
                            f.setWidth(a)
                        }
                        if (f.setHeight && f.type == "textarea") {
                            var j = i.height - 1;
                            if (f.minHeight && j < f.minHeight) {
                                j = f.minHeight
                            }
                            f.setHeight(j)
                        }
                        if (f.setWidth) {
                            var a = i.width - 1;
                            if (f.minWidth && a < f.minWidth) {
                                a = f.minWidth
                            }
                            f.setWidth(a)
                        }
                        mini.on(document, "mousedown", this.__OnBodyMouseDown,
                                this);
                        if (b.autoShowPopup && f.showPopup) {
                            f.showPopup()
                        }
                    },
                    __OnBodyMouseDown : function(f) {
                        if (this._editingControl) {
                            var a = this._getCellByEvent(f);
                            if (this._editingCell && a) {
                                if (this._editingCell[0] == a.record
                                        && this._editingCell[1] == a.column) {
                                    return false
                                }
                            }
                            var b = false;
                            if (this._editingControl.within) {
                                b = this._editingControl.within(f)
                            } else {
                                b = mini.isAncestor(this._editWrap, f.target)
                            }
                            if (b == false) {
                                var d = this;
                                if (mini.isAncestor(this._bodyEl, f.target) == false) {
                                    setTimeout(function() {
                                        d.commitEdit()
                                    }, 1)
                                } else {
                                    var c = d._editingCell;
                                    setTimeout(function() {
                                        var e = d._editingCell;
                                        if (c == e) {
                                            d.commitEdit()
                                        }
                                    }, 70)
                                }
                                mini.un(document, "mousedown",
                                        this.__OnBodyMouseDown, this)
                            }
                        }
                    },
                    _getEditWrap : function(b) {
                        if (!this._editWrap) {
                            this._editWrap = mini
                                    .append(document.body,
                                            '<div class="mini-grid-editwrap" style="position:absolute;"></div>');
                            mini.on(this._editWrap, "keydown",
                                    this.___OnEditControlKeyDown, this)
                        }
                        this._editWrap.style.zIndex = 1000000000;
                        this._editWrap.style.display = "block";
                        mini.setXY(this._editWrap, b.x, b.y);
                        mini.setWidth(this._editWrap, b.width);
                        var a = document.body.scrollWidth;
                        if (b.x > a) {
                            mini.setX(this._editWrap, -1000)
                        }
                        return this._editWrap
                    },
                    ___OnEditControlKeyDown : function(c) {
                        var b = this._editingControl;
                        if (c.keyCode == 13 && b && b.type == "textarea") {
                            return
                        }
                        if (c.keyCode == 13) {
                            var a = this._editingCell;
                            if (a && a[1] && a[1].enterCommit === false) {
                                return
                            }
                            this.commitEdit();
                            this.focus();
                            if (this.editNextOnEnterKey) {
                                this.fire("celleditenter", {
                                    record : a[0]
                                });
                                this._beginEditNextCell(c.shiftKey == false)
                            } else {
                            }
                        } else {
                            if (c.keyCode == 27) {
                                this.cancelEdit();
                                this.focus()
                            } else {
                                if (c.keyCode == 9) {
                                    this.commitEdit();
                                    if (this.editOnTabKey) {
                                        c.preventDefault();
                                        this.commitEdit();
                                        this._beginEditNextCell(
                                                c.shiftKey == false, true)
                                    } else {
                                    }
                                }
                            }
                        }
                    },
                    editNextRowCell : false,
                    editNextOnEnterKey : false,
                    editOnTabKey : true,
                    createOnEnter : false,
                    _beginEditNextCell : function(g, c) {
                        var a = this;
                        var m = this.getCurrentCell();
                        if (!m) {
                            return
                        }
                        this.focus();
                        var f = a.getVisibleColumns();
                        var e = m ? m[1] : null, h = m ? m[0] : null;
                        function d(n) {
                            return a.getVisibleRows()[n]
                        }
                        function l(n) {
                            return a.getVisibleRows().indexOf(n)
                        }
                        function b() {
                            return a.getVisibleRows().length
                        }
                        var j = f.indexOf(e);
                        var k = l(h);
                        var i = b();
                        if (g === false) {
                            j -= 1;
                            e = f[j];
                            if (!e) {
                                e = f[f.length - 1];
                                h = d(k - 1);
                                if (!h) {
                                    return
                                }
                            }
                        } else {
                            if (this.editNextRowCell && !c) {
                                if (k + 1 < i) {
                                    h = d(k + 1)
                                }
                            } else {
                                j += 1;
                                e = f[j];
                                if (!e) {
                                    e = f[0];
                                    h = a.getAt(k + 1);
                                    if (!h) {
                                        if (this.createOnEnter) {
                                            h = {};
                                            this.addRow(h)
                                        } else {
                                            return
                                        }
                                    }
                                }
                            }
                        }
                        var m = [ h, e ];
                        a.setCurrentCell(m);
                        if (!a.onlyCheckSelection) {
                            if (a.getCurrent() != h) {
                                a.deselectAll();
                                a.setCurrent(h)
                            }
                        }
                        a.scrollIntoView(h, e);
                        a.beginEditCell()
                    },
                    getEditorOwnerRow : function(b) {
                        var a = b.ownerRowID;
                        return this.getRowByUID(a)
                    },
                    beginEditRow : function(row) {
                        if (this.allowCellEdit) {
                            return
                        }
                        function beginEdit(row) {
                            var sss = new Date();
                            row = this.getRow(row);
                            if (!row) {
                                return
                            }
                            var rowEl = this._getRowEl(row, 2);
                            if (!rowEl) {
                                return
                            }
                            row._editing = true;
                            this._doUpdateRowEl(row);
                            var rowEl = this._getRowEl(row, 2);
                            mini.addClass(rowEl, "mini-grid-rowEdit");
                            var columns = this.getVisibleColumns();
                            for (var i = 0, l = columns.length; i < l; i++) {
                                var column = columns[i];
                                var value = row[column.field];
                                var cellEl = this._getCellEl(row, column);
                                if (!cellEl) {
                                    continue
                                }
                                if (typeof column.editor == "string") {
                                    column.editor = eval("(" + column.editor
                                            + ")")
                                }
                                var editorConfig = mini.copyTo({},
                                        column.editor);
                                editorConfig.id = this.uid + "$" + row._uid
                                        + "$" + column._id + "$editor";
                                var editor = mini.create(editorConfig);
                                if (this._OnCellBeginEdit(row, column, editor)) {
                                    if (editor) {
                                        mini.addClass(cellEl,
                                                "mini-grid-cellEdit");
                                        cellEl.innerHTML = "";
                                        cellEl.appendChild(editor.el);
                                        mini.addClass(editor.el,
                                                "mini-grid-editor")
                                    }
                                }
                            }
                            this.doLayout()
                        }
                        this._pushUpdateCallback(beginEdit, this, [ row ])
                    },
                    cancelEditRow : function(k) {
                        if (this.allowCellEdit) {
                            return
                        }
                        k = this.getRow(k);
                        if (!k || !k._editing) {
                            return
                        }
                        delete k._editing;
                        var f = this._getRowEl(k);
                        var e = this.getVisibleColumns();
                        for (var h = 0, g = e.length; h < g; h++) {
                            var d = e[h];
                            var a = this._createCellId(k, e[h]);
                            var b = document.getElementById(a);
                            var c = b.firstChild;
                            var j = mini.get(c);
                            if (!j) {
                                continue
                            }
                            j.destroy()
                        }
                        this._doUpdateRowEl(k);
                        this.doLayout()
                    },
                    commitEditRow : function(b) {
                        if (this.allowCellEdit) {
                            return
                        }
                        b = this.getRow(b);
                        if (!b || !b._editing) {
                            return
                        }
                        var a = this.getEditRowData(b, false, false);
                        this._canUpdateRowEl = false;
                        this.updateRow(b, a);
                        this._canUpdateRowEl = true;
                        this.cancelEditRow(b)
                    },
                    isEditing : function() {
                        var c = this.getDataView();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            if (d._editing == true) {
                                return true
                            }
                        }
                        return false
                    },
                    isEditingRow : function(a) {
                        a = this.getRow(a);
                        if (!a) {
                            return false
                        }
                        return !!a._editing
                    },
                    isNewRow : function(a) {
                        return a._state == "added"
                    },
                    getEditingRows : function() {
                        var d = [];
                        var c = this.getDataView();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var e = c[b];
                            if (e._editing == true) {
                                d.push(e)
                            }
                        }
                        return d
                    },
                    getEditingRow : function() {
                        var a = this.getEditingRows();
                        return a[0]
                    },
                    getEditData : function(c) {
                        var e = [];
                        var e = this.getDataView();
                        for (var b = 0, a = e.length; b < a; b++) {
                            var f = e[b];
                            if (f._editing == true) {
                                var d = this.getEditRowData(b, c);
                                d._index = b;
                                e.push(d)
                            }
                        }
                        return e
                    },
                    getEditRowData : function(h, b, s) {
                        h = this.getRow(h);
                        if (!h || !h._editing) {
                            return null
                        }
                        var g = this.getIdField();
                        var r = this.getParentField ? this.getParentField()
                                : null;
                        var j = {};
                        var a = this.getVisibleColumns();
                        for (var t = 0, q = a.length; t < q; t++) {
                            var c = a[t];
                            var v = this._createCellId(h, a[t]);
                            var m = document.getElementById(v);
                            var u = null;
                            if (c.type == "checkboxcolumn"
                                    || c.type == "radiobuttoncolumn") {
                                var k = c.getCheckBoxEl(h, c);
                                var p = k.checked ? c.trueValue : c.falseValue;
                                u = this._OnCellCommitEdit(h, c, p)
                            } else {
                                var f = m.firstChild;
                                var d = mini.get(f);
                                if (!d) {
                                    continue
                                }
                                u = this._OnCellCommitEdit(h, c, null, d)
                            }
                            if (s !== false) {
                                mini._setMap(c.field, u.value, j);
                                if (c.displayField) {
                                    mini._setMap(c.displayField, u.text, j)
                                }
                            } else {
                                j[c.field] = u.value;
                                if (c.displayField) {
                                    j[c.displayField] = u.text
                                }
                            }
                        }
                        j[g] = h[g];
                        if (r) {
                            j[r] = h[r]
                        }
                        if (b) {
                            var n = mini.copyTo({}, h);
                            j = mini.copyTo(n, j)
                        }
                        return j
                    },
                    collapseGroups : function() {
                        if (!this.isGrouping()) {
                            return
                        }
                        this._allowLayout = false;
                        var a = this.getGroupingView();
                        for (var c = 0, b = a.length; c < b; c++) {
                            var d = a[c];
                            this.collapseRowGroup(d)
                        }
                        this._allowLayout = true;
                        this.doLayout()
                    },
                    expandGroups : function() {
                        if (!this.isGrouping()) {
                            return
                        }
                        this._allowLayout = false;
                        var a = this.getGroupingView();
                        for (var c = 0, b = a.length; c < b; c++) {
                            var d = a[c];
                            this.expandRowGroup(d)
                        }
                        this._allowLayout = true;
                        this.doLayout()
                    },
                    toggleRowGroup : function(a) {
                        if (a.expanded) {
                            this.collapseRowGroup(a)
                        } else {
                            this.expandRowGroup(a)
                        }
                    },
                    collapseRowGroup : function(d) {
                        d = this.getRowGroup(d);
                        if (!d) {
                            return
                        }
                        d.expanded = false;
                        var b = this._getRowGroupEl(d, 1);
                        var c = this._getRowGroupRowsEl(d, 1);
                        var a = this._getRowGroupEl(d, 2);
                        var e = this._getRowGroupRowsEl(d, 2);
                        if (c) {
                            c.style.display = "none"
                        }
                        if (e) {
                            e.style.display = "none"
                        }
                        if (b) {
                            mini.addClass(b, "mini-grid-group-collapse")
                        }
                        if (a) {
                            mini.addClass(a, "mini-grid-group-collapse")
                        }
                        this.doLayout()
                    },
                    expandRowGroup : function(d) {
                        d = this.getRowGroup(d);
                        if (!d) {
                            return
                        }
                        d.expanded = true;
                        var b = this._getRowGroupEl(d, 1);
                        var c = this._getRowGroupRowsEl(d, 1);
                        var a = this._getRowGroupEl(d, 2);
                        var e = this._getRowGroupRowsEl(d, 2);
                        if (c) {
                            c.style.display = ""
                        }
                        if (e) {
                            e.style.display = ""
                        }
                        if (b) {
                            mini.removeClass(b, "mini-grid-group-collapse")
                        }
                        if (a) {
                            mini.removeClass(a, "mini-grid-group-collapse")
                        }
                        this.doLayout()
                    },
                    showAllRowDetail : function() {
                        this._allowLayout = false;
                        var c = this.getDataView();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            this.showRowDetail(d)
                        }
                        this._allowLayout = true;
                        this.doLayout()
                    },
                    hideAllRowDetail : function() {
                        this._allowLayout = false;
                        var c = this.getDataView();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            this.hideRowDetail(d)
                        }
                        this._allowLayout = true;
                        this.doLayout()
                    },
                    isShowRowDetail : function(a) {
                        a = this.getRow(a);
                        if (!a) {
                            return false
                        }
                        return !!a._showDetail
                    },
                    toggleRowDetail : function(a) {
                        a = this.getRow(a);
                        if (!a) {
                            return
                        }
                        if (grid.isShowRowDetail(a)) {
                            grid.hideRowDetail(a)
                        } else {
                            grid.showRowDetail(a)
                        }
                    },
                    showRowDetail : function(d) {
                        d = this.getRow(d);
                        if (!d || d._showDetail == true) {
                            return
                        }
                        d._showDetail = true;
                        var b = this._getRowDetailEl(d, 1, true);
                        var e = this._getRowDetailEl(d, 2, true);
                        if (b) {
                            b.style.display = ""
                        }
                        if (e) {
                            e.style.display = ""
                        }
                        var a = this._getRowEl(d, 1);
                        var c = this._getRowEl(d, 2);
                        if (a) {
                            mini.addClass(a, "mini-grid-expandRow")
                        }
                        if (c) {
                            mini.addClass(c, "mini-grid-expandRow")
                        }
                        this.fire("showrowdetail", {
                            record : d
                        });
                        this.doLayout()
                    },
                    hideRowDetail : function(d) {
                        d = this.getRow(d);
                        if (!d || d._showDetail !== true) {
                            return
                        }
                        d._showDetail = false;
                        var b = this._getRowDetailEl(d, 1);
                        var e = this._getRowDetailEl(d, 2);
                        if (b) {
                            b.style.display = "none"
                        }
                        if (e) {
                            e.style.display = "none"
                        }
                        var a = this._getRowEl(d, 1);
                        var c = this._getRowEl(d, 2);
                        if (a) {
                            mini.removeClass(a, "mini-grid-expandRow")
                        }
                        if (c) {
                            mini.removeClass(c, "mini-grid-expandRow")
                        }
                        this.fire("hiderowdetail", {
                            record : d
                        });
                        this.doLayout()
                    },
                    _getRowDetailEl : function(d, a, c) {
                        d = this.getRow(d);
                        if (!d) {
                            return null
                        }
                        var e = this._createRowDetailId(d, a);
                        var b = document.getElementById(e);
                        if (!b && c === true) {
                            b = this._createRowDetail(d, a)
                        }
                        return b
                    },
                    _createRowDetail : function(e, a) {
                        var h = this.getFrozenColumns();
                        var d = this.getUnFrozenColumns();
                        var g = h.length;
                        if (a == 2) {
                            g = d.length
                        }
                        var c = this._getRowEl(e, a);
                        if (!c) {
                            return null
                        }
                        var f = this._createRowDetailId(e, a);
                        var b = '<tr id="'
                                + f
                                + '" class="mini-grid-detailRow"><td class="mini-grid-detailCell" colspan="'
                                + g + '"></td></tr>';
                        jQuery(c).after(b);
                        return document.getElementById(f)
                    },
                    _createRowDetailId : function(b, a) {
                        return this._id + "$detail" + a + "$" + b._id
                    },
                    getRowDetailCellEl : function(c, a) {
                        if (!a) {
                            a = 2
                        }
                        var b = this._getRowDetailEl(c, a);
                        if (b) {
                            return b.cells[0]
                        }
                    },
                    autoHideRowDetail : true,
                    setAutoHideRowDetail : function(a) {
                        this.autoHideRowDetail = a
                    },
                    getAutoHideRowDetail : function() {
                        return this.autoHideRowDetail
                    },
                    mergeColumns : function(d) {
                        if (d && mini.isArray(d) == false) {
                            d = [ d ]
                        }
                        var a = this;
                        var b = a.getVisibleColumns();
                        if (!d) {
                            d = b
                        }
                        var f = a.getDataView();
                        f.push({});
                        var h = [];
                        for (var g = 0, e = d.length; g < e; g++) {
                            var c = d[g];
                            c = a.getColumn(c);
                            if (!c) {
                                continue
                            }
                            var k = j(c);
                            h.addRange(k)
                        }
                        function j(m) {
                            if (!m.field) {
                                return
                            }
                            var v = [];
                            var r = -1, q = 1, p = b.indexOf(m);
                            var u = null;
                            for (var o = 0, n = f.length; o < n; o++) {
                                var w = f[o];
                                var s = mini._getMap(m.field, w);
                                if (r == -1 || !mini.isEquals(s, u)) {
                                    if (q > 1) {
                                        var t = {
                                            rowIndex : r,
                                            columnIndex : p,
                                            rowSpan : q,
                                            colSpan : 1
                                        };
                                        v.push(t)
                                    }
                                    r = o;
                                    q = 1;
                                    u = s
                                } else {
                                    q++
                                }
                            }
                            return v
                        }
                        a.mergeCells(h)
                    },
                    mergeCells : function(c) {
                        if (!mini.isArray(c)) {
                            return
                        }
                        this._mergedCells = c;
                        var e = this._mergedCellMaps = {};
                        function f(r, p, q, o, s) {
                            for (var n = r, g = r + q; n < g; n++) {
                                for (var m = p, h = p + o; m < h; m++) {
                                    if (n == r && m == p) {
                                        e[n + ":" + m] = s
                                    } else {
                                        e[n + ":" + m] = true
                                    }
                                }
                            }
                        }
                        var c = this._mergedCells;
                        if (c) {
                            for (var d = 0, b = c.length; d < b; d++) {
                                var a = c[d];
                                if (!a.rowSpan) {
                                    a.rowSpan = 1
                                }
                                if (!a.colSpan) {
                                    a.colSpan = 1
                                }
                                f(a.rowIndex, a.columnIndex, a.rowSpan,
                                        a.colSpan, a)
                            }
                        }
                        this.deferUpdate()
                    },
                    margeCells : function(a) {
                        this.mergeCells(a)
                    },
                    _isCellVisible : function(c, b) {
                        if (!this._mergedCellMaps) {
                            return true
                        }
                        var a = this._mergedCellMaps[c + ":" + b];
                        return !(a === true)
                    },
                    _getAnchorCell : function(c, b) {
                        if (!this._mergedCellMaps) {
                            return null
                        }
                        var d = this.indexOf(c), a = this.getBottomColumns()
                                .indexOf(b);
                        return this._mergedCellMaps[d + ":" + a]
                    },
                    _getCellEls : function(n, h, m, g) {
                        var p = [];
                        if (!mini.isNumber(n)) {
                            return []
                        }
                        if (!mini.isNumber(h)) {
                            return []
                        }
                        var b = this.getVisibleColumns();
                        var e = this.getDataView();
                        for (var f = n, a = n + m; f < a; f++) {
                            for (var d = h, c = h + g; d < c; d++) {
                                var o = this._getCellEl(f, d);
                                if (o) {
                                    p.push(o)
                                }
                            }
                        }
                        return p
                    },
                    _getDragData : function() {
                        var b = this.getSelecteds().clone();
                        var a = this;
                        mini.sort(b, function(d, c) {
                            var f = a.indexOf(d);
                            var e = a.indexOf(c);
                            if (f > e) {
                                return 1
                            }
                            if (f < e) {
                                return -1
                            }
                            return 0
                        }, this);
                        return b
                    },
                    _getDragText : function(a) {
                        return "Records " + a.length
                    },
                    allowDrag : false,
                    allowDrop : false,
                    allowLeafDropIn : false,
                    setAllowLeafDropIn : function(a) {
                        this.allowLeafDropIn = a
                    },
                    getAllowLeafDropIn : function() {
                        return this.allowLeafDropIn
                    },
                    setAllowDrag : function(a) {
                        this.allowDrag = a
                    },
                    getAllowDrag : function() {
                        return this.allowDrag
                    },
                    setAllowDrop : function(a) {
                        this.allowDrop = a
                    },
                    getAllowDrop : function() {
                        return this.allowDrop
                    },
                    isAllowDrag : function(b, a) {
                        if (this.isReadOnly() || this.enabled == false) {
                            return false
                        }
                        if (!this.allowDrag || !a.allowDrag) {
                            return false
                        }
                        if (b.allowDrag === false) {
                            return false
                        }
                        return true
                    },
                    _OnDragStart : function(b, a) {
                        var c = {
                            node : b,
                            nodes : this._getDragData(),
                            column : a,
                            cancel : false
                        };
                        c.record = c.node;
                        c.records = c.nodes;
                        c.dragText = this._getDragText(c.nodes);
                        this.fire("dragstart", c);
                        return c
                    },
                    _OnGiveFeedback : function(c, b, a, f) {
                        var d = {};
                        d.from = f;
                        d.effect = c;
                        d.nodes = b;
                        d.node = d.nodes[0];
                        d.targetNode = a;
                        d.dragNodes = b;
                        d.dragNode = d.dragNodes[0];
                        d.dropNode = d.targetNode;
                        d.dragAction = d.action;
                        this.fire("givefeedback", d);
                        return d
                    },
                    _OnDragDrop : function(c, b, a) {
                        c = c.clone();
                        var d = {
                            dragNodes : c,
                            targetNode : b,
                            action : a,
                            cancel : false
                        };
                        d.dragNode = d.dragNodes[0];
                        d.dropNode = d.targetNode;
                        d.dragAction = d.action;
                        this.fire("beforedrop", d);
                        this.fire("dragdrop", d);
                        return d
                    },
                    moveUp : function(b) {
                        if (!mini.isArray(b)) {
                            return
                        }
                        var f = this;
                        b = b.sort(function(h, g) {
                            var j = f.indexOf(h);
                            var i = f.indexOf(g);
                            if (j > i) {
                                return 1
                            }
                            return -1
                        });
                        for (var d = 0, a = b.length; d < a; d++) {
                            var e = b[d];
                            var c = this.indexOf(e);
                            this.moveRow(e, c - 1)
                        }
                    },
                    moveDown : function(b) {
                        if (!mini.isArray(b)) {
                            return
                        }
                        var f = this;
                        b = b.sort(function(h, g) {
                            var j = f.indexOf(h);
                            var i = f.indexOf(g);
                            if (j > i) {
                                return 1
                            }
                            return -1
                        });
                        b.reverse();
                        for (var d = 0, a = b.length; d < a; d++) {
                            var e = b[d];
                            var c = this.indexOf(e);
                            this.moveRow(e, c + 2)
                        }
                    },
                    pageSize : 20,
                    pageIndex : 0,
                    totalCount : 0,
                    totalPage : 0,
                    sortField : "",
                    sortOrder : "",
                    url : "",
                    setAjaxAsync : function(a) {
                        this._dataSource.ajaxAsync = a;
                        this.ajaxAsync = a
                    },
                    getAjaxAsync : function() {
                        return this._dataSource.ajaxAsync
                    },
                    setAjaxMethod : function(a) {
                        this._dataSource.ajaxMethod = a;
                        this.ajaxMethod = a
                    },
                    getAjaxMethod : function() {
                        return this._dataSource.ajaxMethod
                    },
                    setAjaxType : function(a) {
                        this._dataSource.ajaxType = a;
                        this.ajaxType = a
                    },
                    getAjaxType : function() {
                        return this._dataSource.ajaxType
                    },
                    setAjaxOptions : function(a) {
                        this._dataSource.setAjaxOptions(a)
                    },
                    getAjaxOptions : function() {
                        return this._dataSource.getAjaxOptions()
                    },
                    setAutoLoad : function(a) {
                        this._dataSource.setAutoLoad(a)
                    },
                    getAutoLoad : function() {
                        return this._dataSource.getAutoLoad()
                    },
                    setUrl : function(a) {
                        this._dataSource.setUrl(a);
                        this.url = a
                    },
                    getUrl : function() {
                        return this._dataSource.getUrl()
                    },
                    load : function(d, c, b, a) {
                        this._dataSource.load(d, c, b, a)
                    },
                    reload : function(c, b, a) {
                        this.accept();
                        this._dataSource.reload(c, b, a)
                    },
                    gotoPage : function(a, b) {
                        this._dataSource.gotoPage(a, b)
                    },
                    sortBy : function(b, c) {
                        if (!b) {
                            return null
                        }
                        if (this._dataSource.sortMode == "server") {
                            this._dataSource.sortBy(b, c)
                        } else {
                            var a = this._columnModel._getDataTypeByField(b);
                            this._dataSource._doClientSortField(b, c, a)
                        }
                    },
                    setCheckSelectOnLoad : function(a) {
                        this._dataSource.setCheckSelectOnLoad(a);
                        this.checkSelectOnLoad = a
                    },
                    getCheckSelectOnLoad : function() {
                        return this._dataSource.getCheckSelectOnLoad()
                    },
                    setSelectOnLoad : function(a) {
                        this._dataSource.setSelectOnLoad(a);
                        this.selectOnLoad = a
                    },
                    getSelectOnLoad : function() {
                        return this._dataSource.getSelectOnLoad()
                    },
                    setSortMode : function(a) {
                        this._dataSource.setSortMode(a);
                        this.sortMode = a
                    },
                    getSortMode : function() {
                        return this._dataSource.getSortMode()
                    },
                    setPageIndex : function(a) {
                        this._dataSource.setPageIndex(a);
                        this.pageIndex = a
                    },
                    getPageIndex : function() {
                        return this._dataSource.getPageIndex()
                    },
                    setPageSize : function(a) {
                        this._dataSource.setPageSize(a);
                        this._virtualRows = a;
                        this.pageSize = a
                    },
                    getPageSize : function() {
                        return this._dataSource.getPageSize()
                    },
                    setTotalCount : function(a) {
                        this._dataSource.setTotalCount(a);
                        this.totalCount = a
                    },
                    getTotalCount : function() {
                        return this._dataSource.getTotalCount()
                    },
                    getTotalPage : function() {
                        return this._dataSource.getTotalPage()
                    },
                    setSortField : function(a) {
                        this._dataSource.setSortField(a);
                        this.sortField = a
                    },
                    getSortField : function() {
                        return this._dataSource.sortField
                    },
                    setSortOrder : function(a) {
                        this._dataSource.setSortOrder(a);
                        this.sortOrder = a
                    },
                    getSortOrder : function() {
                        return this._dataSource.sortOrder
                    },
                    setPageIndexField : function(a) {
                        this._dataSource.pageIndexField = a;
                        this.pageIndexField = a
                    },
                    getPageIndexField : function() {
                        return this._dataSource.pageIndexField
                    },
                    setPageSizeField : function(a) {
                        this._dataSource.pageSizeField = a;
                        this.pageSizeField = a
                    },
                    getPageSizeField : function() {
                        return this._dataSource.pageSizeField
                    },
                    setStartField : function(a) {
                        this._dataSource.startField = a;
                        this.startField = a
                    },
                    getStartField : function() {
                        return this._dataSource.startField
                    },
                    setLimitField : function(a) {
                        this._dataSource.limitField = a;
                        this.limitField = a
                    },
                    getLimitField : function() {
                        return this._dataSource.limitField
                    },
                    setSortFieldField : function(a) {
                        this._dataSource.sortFieldField = a;
                        this.sortFieldField = a
                    },
                    getSortFieldField : function() {
                        return this._dataSource.sortFieldField
                    },
                    setSortOrderField : function(a) {
                        this._dataSource.sortOrderField = a;
                        this.sortOrderField = a
                    },
                    getSortOrderField : function() {
                        return this._dataSource.sortOrderField
                    },
                    setTotalField : function(a) {
                        this._dataSource.totalField = a;
                        this.totalField = a
                    },
                    getTotalField : function() {
                        return this._dataSource.totalField
                    },
                    setDataField : function(a) {
                        this._dataSource.dataField = a;
                        this.dataField = a
                    },
                    getDataField : function() {
                        return this._dataSource.dataField
                    },
                    setErrorField : function(a) {
                        this._dataSource.errorField = a;
                        this.errorField = a
                    },
                    getErrorField : function() {
                        return this._dataSource.errorField
                    },
                    setErrorMsgField : function(a) {
                        this._dataSource.errorMsgField = a;
                        this.errorMsgField = a
                    },
                    getErrorMsgField : function() {
                        return this._dataSource.errorMsgField
                    },
                    setStackTraceField : function(a) {
                        this._dataSource.stackTraceField = a;
                        this.stackTraceField = a
                    },
                    getStackTraceField : function() {
                        return this._dataSource.stackTraceField
                    },
                    setShowReloadButton : function(a) {
                        this._bottomPager.setShowReloadButton(a)
                    },
                    getShowReloadButton : function() {
                        return this._bottomPager.getShowReloadButton()
                    },
                    setShowPageInfo : function(a) {
                        this._bottomPager.setShowPageInfo(a)
                    },
                    getShowPageInfo : function() {
                        return this._bottomPager.getShowPageInfo()
                    },
                    setSizeList : function(a) {
                        if (!mini.isArray(a)) {
                            return
                        }
                        this._bottomPager.setSizeList(a)
                    },
                    getSizeList : function() {
                        return this._bottomPager.getSizeList()
                    },
                    setShowPageSize : function(a) {
                        this._bottomPager.setShowPageSize(a)
                    },
                    getShowPageSize : function() {
                        return this._bottomPager.getShowPageSize()
                    },
                    setShowPageIndex : function(a) {
                        this.showPageIndex = a;
                        this._bottomPager.setShowPageIndex(a)
                    },
                    getShowPageIndex : function() {
                        return this._bottomPager.getShowPageIndex()
                    },
                    setShowTotalCount : function(a) {
                        this._bottomPager.setShowTotalCount(a)
                    },
                    getShowTotalCount : function() {
                        return this._bottomPager.getShowTotalCount()
                    },
                    setPagerStyle : function(a) {
                        this.pagerStyle = a;
                        mini.setStyle(this._bottomPager.el, a)
                    },
                    setPagerCls : function(a) {
                        this.pagerCls = a;
                        mini.addClass(this._bottomPager.el, a)
                    },
                    _beforeOpenContentMenu : function(c, b) {
                        var a = mini.isAncestor(this._bodyEl,
                                b.htmlEvent.target);
                        if (a) {
                            c.fire("BeforeOpen", b)
                        } else {
                            b.cancel = true
                        }
                    },
                    __OnHtmlContextMenu : function(b) {
                        var a = {
                            popupEl : this.el,
                            htmlEvent : b,
                            cancel : false
                        };
                        if (mini.isAncestor(this._columnsEl, b.target)) {
                            if (this.headerContextMenu) {
                                this.headerContextMenu.fire("BeforeOpen", a);
                                if (a.cancel == true) {
                                    return
                                }
                                this.headerContextMenu.fire("opening", a);
                                if (a.cancel == true) {
                                    return
                                }
                                this.headerContextMenu.showAtPos(b.pageX,
                                        b.pageY);
                                this.headerContextMenu.fire("Open", a)
                            }
                        } else {
                            var c = mini.findParent(b.target,
                                    "mini-grid-detailRow");
                            if (c && mini.isAncestor(this.el, c)) {
                                return
                            }
                            if (this.contextMenu) {
                                this
                                        ._beforeOpenContentMenu(
                                                this.contextMenu, a);
                                if (a.cancel == true) {
                                    return
                                }
                                this.contextMenu.fire("opening", a);
                                if (a.cancel == true) {
                                    return
                                }
                                this.contextMenu.showAtPos(b.pageX, b.pageY);
                                this.contextMenu.fire("Open", a)
                            }
                        }
                        return false
                    },
                    headerContextMenu : null,
                    setHeaderContextMenu : function(b) {
                        var a = this._getContextMenu(b);
                        if (!a) {
                            return
                        }
                        if (this.headerContextMenu !== a) {
                            this.headerContextMenu = a;
                            this.headerContextMenu.owner = this;
                            mini.on(this.el, "contextmenu",
                                    this.__OnHtmlContextMenu, this)
                        }
                    },
                    getHeaderContextMenu : function() {
                        return this.headerContextMenu
                    },
                    _get_originals : function() {
                        return this._dataSource._originals
                    },
                    _set_originals : function(a) {
                        this._dataSource._originals = a
                    },
                    _set_clearOriginals : function(a) {
                        this._dataSource._clearOriginals = a
                    },
                    _set_originalIdField : function(a) {
                        this._dataSource._originalIdField = a
                    },
                    _set_autoCreateNewID : function(a) {
                        this._dataSource._autoCreateNewID = a
                    },
                    getAttrs : function(el) {
                        var attrs = mini.DataGrid.superclass.getAttrs.call(
                                this, el);
                        var cs = mini.getChildNodes(el);
                        for (var i = 0, l = cs.length; i < l; i++) {
                            var node = cs[i];
                            var property = jQuery(node).attr("property");
                            if (!property) {
                                continue
                            }
                            property = property.toLowerCase();
                            if (property == "columns") {
                                attrs.columns = mini._ParseColumns(node);
                                mini.removeNode(node)
                            } else {
                                if (property == "data") {
                                    attrs.data = node.innerHTML;
                                    mini.removeNode(node)
                                }
                            }
                        }
                        mini._ParseString(el, attrs, [ "oncelleditenter",
                                "onselect", "ondeselect", "onbeforeselect",
                                "onbeforedeselect", "url", "sizeList",
                                "bodyCls", "bodyStyle", "footerCls",
                                "footerStyle", "pagerCls", "pagerStyle",
                                "onheadercellclick", "onheadercellmousedown",
                                "onheadercellcontextmenu", "onrowdblclick",
                                "onrowclick", "onrowmousedown",
                                "onrowcontextmenu", "onrowmouseenter",
                                "onrowmouseleave", "oncellclick",
                                "oncellmousedown", "oncellcontextmenu",
                                "oncelldblclick", "onbeforeload", "onpreload",
                                "onloaderror", "onload", "onupdate",
                                "ondrawcell", "oncellbeginedit",
                                "onselectionchanged", "ondrawgroup",
                                "onbeforeshowrowdetail",
                                "onbeforehiderowdetail", "onshowrowdetail",
                                "onhiderowdetail", "idField", "valueField",
                                "pager", "oncellcommitedit", "oncellendedit",
                                "headerContextMenu", "loadingMsg", "emptyText",
                                "cellEditAction", "sortMode",
                                "oncellvalidation", "onsort",
                                "ondrawsummarycell", "ondrawgroupsummarycell",
                                "onresize", "oncolumnschanged", "ajaxMethod",
                                "ajaxOptions", "onaddrow", "onupdaterow",
                                "onremoverow", "onmoverow", "onbeforeaddrow",
                                "onbeforeupdaterow", "onbeforeremoverow",
                                "onbeforemoverow", "pageIndexField",
                                "pageSizeField", "sortFieldField",
                                "sortOrderField", "startField", "limitField",
                                "totalField", "dataField", "sortField",
                                "sortOrder", "stackTraceField", "errorField",
                                "errorMsgField", "pagerButtons" ]);
                        mini._ParseBool(el, attrs, [ "showColumns",
                                "showFilterRow", "showSummaryRow", "showPager",
                                "showFooter", "showHGridLines",
                                "showVGridLines", "allowSortColumn",
                                "allowMoveColumn", "allowResizeColumn",
                                "fitColumns", "showLoading", "multiSelect",
                                "allowAlternating", "resultAsData",
                                "allowRowSelect", "allowUnselect",
                                "onlyCheckSelection", "allowHotTrackOut",
                                "enableHotTrack", "showPageIndex",
                                "showPageSize", "showTotalCount",
                                "checkSelectOnLoad", "allowResize", "autoLoad",
                                "autoHideRowDetail", "allowCellSelect",
                                "allowCellEdit", "allowCellWrap",
                                "allowHeaderWrap", "selectOnLoad",
                                "virtualScroll", "collapseGroupOnLoad",
                                "showGroupSummary", "showEmptyText",
                                "allowCellValid", "showModified",
                                "showColumnsMenu", "showPageInfo",
                                "showReloadButton", "showNewRow",
                                "editNextOnEnterKey", "createOnEnter",
                                "ajaxAsync", "allowDrag", "allowDrop",
                                "allowLeafDropIn", "editNextRowCell" ]);
                        mini._ParseInt(el, attrs, [ "frozenStartColumn",
                                "frozenEndColumn", "pageIndex", "pageSize",
                                "defaultRowHeight", "defaultColumnWidth" ]);
                        if (typeof attrs.ajaxOptions == "string") {
                            attrs.ajaxOptions = eval("(" + attrs.ajaxOptions
                                    + ")")
                        }
                        if (typeof attrs.sizeList == "string") {
                            attrs.sizeList = eval("(" + attrs.sizeList + ")")
                        }
                        if (!attrs.idField && attrs.valueField) {
                            attrs.idField = attrs.valueField
                        }
                        if (attrs.pagerButtons) {
                            attrs.pagerButtons = mini.byId(attrs.pagerButtons)
                        }
                        return attrs
                    }
                });
mini.regClass(mini.DataGrid, "datagrid");
mini_DataGrid_CellValidator_Prototype = {
    getCellErrors : function() {
        var h = this._cellErrors.clone();
        var e = this.getDataView();
        for (var c = 0, a = h.length; c < a; c++) {
            var b = h[c];
            var f = b.record;
            var d = b.column;
            if (e.indexOf(f) == -1) {
                var g = f[this._rowIdField] + "$" + d._id;
                delete this._cellMapErrors[g];
                this._cellErrors.remove(b)
            }
        }
        return this._cellErrors
    },
    getCellError : function(b, a) {
        b = this.getNode ? this.getNode(b) : this.getRow(b);
        a = this.getColumn(a);
        if (!b || !a) {
            return
        }
        var c = b[this._rowIdField] + "$" + a._id;
        return this._cellMapErrors ? this._cellMapErrors[c] : null
    },
    isValid : function() {
        return this.getCellErrors().length == 0
    },
    isCellValid : function(a, b) {
        if (!this._cellMapErrors) {
            return true
        }
        var c = a[this._rowIdField] + "$" + b._id;
        return !this._cellMapErrors[c]
    },
    validate : function(c) {
        c = c || this.getDataView();
        if (!mini.isArray(c)) {
            c = []
        }
        for (var b = 0, a = c.length; b < a; b++) {
            var d = c[b];
            this.validateRow(d)
        }
    },
    validateRow : function(e) {
        var c = this.getBottomColumns();
        for (var b = 0, a = c.length; b < a; b++) {
            var d = c[b];
            this.validateCell(e, d)
        }
    },
    validateCell : function(p, d) {
        p = this.getNode ? this.getNode(p) : this.getRow(p);
        d = this.getColumn(d);
        if (!p || !d || d.visible == false) {
            return
        }
        var m = mini._getMap(d.field, p);
        var h = {
            record : p,
            row : p,
            node : p,
            column : d,
            field : d.field,
            value : m,
            isValid : true,
            errorText : ""
        };
        if (d.vtype) {
            mini._ValidateVType(d.vtype, h.value, h, d)
        }
        if (h.isValid == true && d.unique && d.field) {
            var j = {};
            var f = this.data, k = d.field;
            for (var g = 0, c = f.length; g < c; g++) {
                var a = f[g];
                var n = a[k];
                if (mini.isNull(n) || n === "") {
                } else {
                    var b = j[n];
                    if (b && a == p) {
                        h.isValid = false;
                        h.errorText = mini._getErrorText(d, "uniqueErrorText");
                        this.setCellIsValid(b, d, h.isValid, h.errorText);
                        break
                    }
                    j[n] = a
                }
            }
        }
        this.fire("cellvalidation", h);
        this.setCellIsValid(p, d, h.isValid, h.errorText)
    },
    setIsValid : function(d) {
        if (d) {
            var e = this._cellErrors.clone();
            for (var c = 0, a = e.length; c < a; c++) {
                var b = e[c];
                this.setCellIsValid(b.record, b.column, true)
            }
        }
    },
    _removeRowError : function(f) {
        var d = this.getColumns();
        for (var c = 0, a = d.length; c < a; c++) {
            var e = d[c];
            var g = f[this._rowIdField] + "$" + e._id;
            var b = this._cellMapErrors[g];
            if (b) {
                delete this._cellMapErrors[g];
                this._cellErrors.remove(b)
            }
        }
    },
    setCellIsValid : function(f, d, e, a) {
        f = this.getRow(f);
        d = this.getColumn(d);
        if (!f || !d) {
            return
        }
        var g = f[this._rowIdField] + "$" + d._id;
        var b = this._getCellEl(f, d);
        var c = this._cellMapErrors[g];
        delete this._cellMapErrors[g];
        this._cellErrors.remove(c);
        if (e === true) {
            if (b && c) {
                mini.removeClass(b, "mini-grid-cell-error")
            }
        } else {
            c = {
                record : f,
                column : d,
                isValid : e,
                errorText : a
            };
            this._cellMapErrors[g] = c;
            this._cellErrors.add(c);
            if (b) {
                mini.addClass(b, "mini-grid-cell-error")
            }
        }
    }
};
mini.copyTo(mini.DataGrid.prototype, mini_DataGrid_CellValidator_Prototype);