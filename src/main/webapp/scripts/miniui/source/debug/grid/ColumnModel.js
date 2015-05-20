mini.ColumnModel = function(a) {
    this.owner = a;
    mini.ColumnModel.superclass.constructor.call(this);
    this._init()
};
mini.ColumnModel_ColumnID = 1;
mini
        .extend(
                mini.ColumnModel,
                mini.Component,
                {
                    _defaultColumnWidth : 100,
                    _init : function() {
                        this.columns = [];
                        this._columnsRow = [];
                        this._visibleColumnsRow = [];
                        this._bottomColumns = [];
                        this._visibleColumns = [];
                        this._idColumns = {};
                        this._nameColumns = {};
                        this._fieldColumns = {}
                    },
                    getColumns : function() {
                        return this.columns
                    },
                    getAllColumns : function() {
                        var a = [];
                        for ( var c in this._idColumns) {
                            var b = this._idColumns[c];
                            a.push(b)
                        }
                        return a
                    },
                    getColumnsRow : function() {
                        return this._columnsRow
                    },
                    getVisibleColumnsRow : function() {
                        return this._visibleColumnsRow
                    },
                    getBottomColumns : function() {
                        return this._bottomColumns
                    },
                    getVisibleColumns : function() {
                        return this._visibleColumns
                    },
                    _getBottomColumnsByColumn : function(f) {
                        f = this.getColumn(f);
                        var d = this._bottomColumns;
                        var e = [];
                        for (var b = 0, a = d.length; b < a; b++) {
                            var g = d[b];
                            if (this.isAncestorColumn(f, g)) {
                                e.push(g)
                            }
                        }
                        return e
                    },
                    _getVisibleColumnsByColumn : function(f) {
                        f = this.getColumn(f);
                        var d = this._visibleColumns;
                        var e = [];
                        for (var b = 0, a = d.length; b < a; b++) {
                            var g = d[b];
                            if (this.isAncestorColumn(f, g)) {
                                e.push(g)
                            }
                        }
                        return e
                    },
                    setColumns : function(a) {
                        if (!mini.isArray(a)) {
                            a = []
                        }
                        this._init();
                        this.columns = a;
                        this._columnsChanged()
                    },
                    _columnsChanged : function() {
                        this._updateColumnsView();
                        this.fire("columnschanged")
                    },
                    _updateColumnsView : function() {
                        this._maxColumnLevel = 0;
                        var level = 0;
                        function init(column, index, parentColumn) {
                            if (column.type) {
                                if (!mini.isNull(column.header)
                                        && typeof column.header !== "function") {
                                    if (column.header.trim() == "") {
                                        delete column.header
                                    }
                                }
                                var col = mini._getColumn(column.type);
                                if (col) {
                                    var _column = mini.copyTo({}, column);
                                    mini.copyTo(column, col);
                                    mini.copyTo(column, _column)
                                }
                            }
                            if (!column._id) {
                                column._id = mini.ColumnModel_ColumnID++
                            }
                            column._pid = parentColumn == this ? -1
                                    : parentColumn._id;
                            this._idColumns[column._id] = column;
                            if (column.name) {
                                this._nameColumns[column.name] = column
                            }
                            column._level = level;
                            level += 1;
                            this.eachColumns(column, init, this);
                            level -= 1;
                            if (column._level > this._maxColumnLevel) {
                                this._maxColumnLevel = column._level
                            }
                            var width = parseInt(column.width);
                            if (mini.isNumber(width)
                                    && String(width) == column.width) {
                                column.width = width + "px"
                            }
                            if (mini.isNull(column.width)) {
                                column.width = this._defaultColumnWidth + "px"
                            }
                            column.visible = column.visible !== false;
                            column.allowResize = column.allowResize !== false;
                            column.allowMove = column.allowMove !== false;
                            column.allowSort = column.allowSort === true;
                            column.allowDrag = !!column.allowDrag;
                            column.readOnly = !!column.readOnly;
                            column.autoEscape = !!column.autoEscape;
                            column.enabled = column.enabled !== false;
                            column.vtype = column.vtype || "";
                            if (typeof column.filter == "string") {
                                column.filter = eval("(" + column.filter + ")")
                            }
                            if (column.filter && !column.filter.el) {
                                column.filter = mini.create(column.filter)
                            }
                            if (typeof column.init == "function"
                                    && column.inited != true) {
                                column.init(this.owner)
                            }
                            column.inited = true;
                            column._gridUID = this.owner.uid;
                            column._rowIdField = this.owner._rowIdField
                        }
                        this.eachColumns(this, init, this);
                        this._createColumnsRow();
                        var index = 0;
                        var view = this._visibleColumns = [];
                        var bottoms = this._bottomColumns = [];
                        this.cascadeColumns(this, function(column) {
                            if (!column.columns || column.columns.length == 0) {
                                bottoms.push(column);
                                if (this.isVisibleColumn(column)) {
                                    view.push(column);
                                    column._index = index++
                                }
                            }
                        }, this);
                        this._fieldColumns = {};
                        var columns = this.getAllColumns();
                        for (var i = 0, l = columns.length; i < l; i++) {
                            var column = columns[i];
                            if (column.field
                                    && !this._fieldColumns[column.field]) {
                                this._fieldColumns[column.field] = column
                            }
                        }
                        this._createFrozenColSpan()
                    },
                    _frozenStartColumn : -1,
                    _frozenEndColumn : -1,
                    isFrozen : function() {
                        return this._frozenStartColumn >= 0
                                && this._frozenEndColumn >= this._frozenStartColumn
                    },
                    isFrozenColumn : function(b) {
                        if (!this.isFrozen()) {
                            return false
                        }
                        b = this.getColumn(b);
                        if (!b) {
                            return false
                        }
                        var a = this.getVisibleColumns().indexOf(b);
                        return this._frozenStartColumn <= a
                                && a <= this._frozenEndColumn
                    },
                    frozen : function(b, c) {
                        b = this.getColumn(b);
                        c = this.getColumn(c);
                        var a = this.getVisibleColumns();
                        this._frozenStartColumn = a.indexOf(b);
                        this._frozenEndColumn = a.indexOf(c);
                        if (b && c) {
                            this._columnsChanged()
                        }
                    },
                    unFrozen : function() {
                        this._frozenStartColumn = -1;
                        this._frozenEndColumn = -1;
                        this._columnsChanged()
                    },
                    setFrozenStartColumn : function(a) {
                        this.frozen(a, this._frozenEndColumn)
                    },
                    setFrozenEndColumn : function(a) {
                        this.frozen(this._frozenStartColumn, a)
                    },
                    getFrozenColumns : function() {
                        var c = [], d = this.isFrozen();
                        for (var b = 0, a = this._visibleColumns.length; b < a; b++) {
                            if (d && this._frozenStartColumn <= b
                                    && b <= this._frozenEndColumn) {
                                c.push(this._visibleColumns[b])
                            }
                        }
                        return c
                    },
                    getUnFrozenColumns : function() {
                        var c = [], d = this.isFrozen();
                        for (var b = 0, a = this._visibleColumns.length; b < a; b++) {
                            if ((d && b > this._frozenEndColumn) || !d) {
                                c.push(this._visibleColumns[b])
                            }
                        }
                        return c
                    },
                    getFrozenColumnsRow : function() {
                        return this.isFrozen() ? this._columnsRow1 : []
                    },
                    getUnFrozenColumnsRow : function() {
                        return this.isFrozen() ? this._columnsRow2 : this
                                .getVisibleColumnsRow()
                    },
                    _createFrozenColSpan : function() {
                        var s = this;
                        var u = this.getVisibleColumns();
                        var a = this._frozenStartColumn, h = this._frozenEndColumn;
                        function t(z, w) {
                            var y = s.isBottomColumn(z) ? [ z ] : s
                                    ._getVisibleColumnsByColumn(z);
                            for (var x = 0, j = y.length; x < j; x++) {
                                var A = y[x];
                                var k = u.indexOf(A);
                                if (w == 0 && k < a) {
                                    return true
                                }
                                if (w == 1 && a <= k && k <= h) {
                                    return true
                                }
                                if (w == 2 && k > h) {
                                    return true
                                }
                            }
                            return false
                        }
                        function b(x, w) {
                            var j = mini.treeToList(x.columns, "columns");
                            var z = 0;
                            for (var y = 0, k = j.length; y < k; y++) {
                                var A = j[y];
                                if (s.isVisibleColumn(A) == false
                                        || t(A, w) == false) {
                                    continue
                                }
                                if (!A.columns || A.columns.length == 0) {
                                    z += 1
                                }
                            }
                            return z
                        }
                        var o = mini.treeToList(this.columns, "columns");
                        for (var n = 0, f = o.length; n < f; n++) {
                            var e = o[n];
                            delete e.colspan0;
                            delete e.colspan1;
                            delete e.colspan2;
                            delete e.viewIndex0;
                            delete e.viewIndex1;
                            delete e.viewIndex2;
                            if (this.isFrozen()) {
                                if (e.columns && e.columns.length > 0) {
                                    e.colspan1 = b(e, 1);
                                    e.colspan2 = b(e, 2);
                                    e.colspan0 = b(e, 0)
                                } else {
                                    e.colspan1 = 1;
                                    e.colspan2 = 1;
                                    e.colspan0 = 1
                                }
                                if (t(e, 0)) {
                                    e["viewIndex" + 0] = true
                                }
                                if (t(e, 1)) {
                                    e["viewIndex" + 1] = true
                                }
                                if (t(e, 2)) {
                                    e["viewIndex" + 2] = true
                                }
                            }
                        }
                        var v = this._getMaxColumnLevel();
                        this._columnsRow1 = [];
                        this._columnsRow2 = [];
                        for (var n = 0, f = this._visibleColumnsRow.length; n < f; n++) {
                            var d = this._visibleColumnsRow[n];
                            var r = [];
                            var p = [];
                            this._columnsRow1.push(r);
                            this._columnsRow2.push(p);
                            for (var m = 0, g = d.length; m < g; m++) {
                                var q = d[m];
                                if (q.viewIndex1) {
                                    r.push(q)
                                }
                                if (q.viewIndex2) {
                                    p.push(q)
                                }
                            }
                        }
                    },
                    _createColumnsRow : function() {
                        var m = this._getMaxColumnLevel();
                        var k = [];
                        var a = [];
                        for (var e = 0, d = m; e <= d; e++) {
                            k.push([]);
                            a.push([])
                        }
                        var h = this;
                        function b(p) {
                            var n = mini.treeToList(p.columns, "columns");
                            var r = 0;
                            for (var q = 0, o = n.length; q < o; q++) {
                                var s = n[q];
                                if (h.isVisibleColumn(s) == false) {
                                    continue
                                }
                                if (!s.columns || s.columns.length == 0) {
                                    r += 1
                                }
                            }
                            return r
                        }
                        var g = mini.treeToList(this.columns, "columns");
                        for (var e = 0, d = g.length; e < d; e++) {
                            var c = g[e];
                            var j = k[c._level];
                            var f = a[c._level];
                            delete c.rowspan;
                            delete c.colspan;
                            if (c.columns && c.columns.length > 0) {
                                c.colspan = b(c)
                            }
                            if ((!c.columns || c.columns.length == 0)
                                    && c._level < m) {
                                c.rowspan = m - c._level + 1
                            }
                            j.push(c);
                            if (this.isVisibleColumn(c)) {
                                f.push(c)
                            }
                        }
                        this._columnsRow = k;
                        this._visibleColumnsRow = a
                    },
                    _getMaxColumnLevel : function() {
                        return this._maxColumnLevel
                    },
                    cascadeColumns : function(g, f, e) {
                        if (!f) {
                            return
                        }
                        var b = g.columns;
                        if (b) {
                            b = b.clone();
                            for (var d = 0, a = b.length; d < a; d++) {
                                var h = b[d];
                                if (f.call(e || this, h, d, g) === false) {
                                    return
                                }
                                this.cascadeColumns(h, f, e)
                            }
                        }
                    },
                    eachColumns : function(f, e, d) {
                        var c = f.columns;
                        if (c) {
                            var g = c.clone();
                            for (var b = 0, a = g.length; b < a; b++) {
                                var h = g[b];
                                if (e.call(d, h, b, f) === false) {
                                    break
                                }
                            }
                        }
                    },
                    getColumn : function(a) {
                        var b = typeof a;
                        if (b == "number") {
                            return this._bottomColumns[a]
                        } else {
                            if (b == "object") {
                                return a
                            } else {
                                return this._nameColumns[a]
                            }
                        }
                    },
                    getColumnByField : function(a) {
                        if (!a) {
                            return null
                        }
                        return this._fieldColumns[a]
                    },
                    _getColumnById : function(a) {
                        return this._idColumns[a]
                    },
                    _getDataTypeByField : function(e) {
                        var f = "string";
                        var c = this.getBottomColumns();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            if (d.field == e) {
                                if (d.dataType) {
                                    f = d.dataType.toLowerCase()
                                }
                                break
                            }
                        }
                        return f
                    },
                    getParentColumn : function(b) {
                        b = this.getColumn(b);
                        var a = b._pid;
                        if (a == -1) {
                            return this
                        }
                        return this._idColumns[a]
                    },
                    getAncestorColumns : function(c) {
                        var b = [ c ];
                        while (1) {
                            var a = this.getParentColumn(c);
                            if (!a || a == this) {
                                break
                            }
                            b[b.length] = a;
                            c = a
                        }
                        b.reverse();
                        return b
                    },
                    isAncestorColumn : function(a, e) {
                        if (a == e) {
                            return true
                        }
                        if (!a || !e) {
                            return false
                        }
                        var c = this.getAncestorColumns(e);
                        for (var d = 0, b = c.length; d < b; d++) {
                            if (c[d] == a) {
                                return true
                            }
                        }
                        return false
                    },
                    isVisibleColumn : function(f) {
                        f = this.getColumn(f);
                        if (f.visible == false) {
                            return false
                        }
                        var e = this.getAncestorColumns(f);
                        for (var d = 0, a = e.length; d < a; d++) {
                            if (e[d].visible == false) {
                                return false
                            }
                        }
                        var b = f.columns;
                        if (b) {
                            var c = true;
                            for (var d = 0, a = b.length; d < a; d++) {
                                var g = b[d];
                                if (this.isVisibleColumn(g)) {
                                    c = false;
                                    break
                                }
                            }
                            if (c) {
                                return false
                            }
                        }
                        return true
                    },
                    isBottomColumn : function(a) {
                        a = this.getColumn(a);
                        return !(a.columns && a.columns.length > 0)
                    },
                    updateColumn : function(b, a) {
                        b = this.getColumn(b);
                        if (!b) {
                            return
                        }
                        mini.copyTo(b, a);
                        this._columnsChanged()
                    },
                    moveColumn : function(d, c, e) {
                        d = this.getColumn(d);
                        c = this.getColumn(c);
                        if (!d || !c || !e || d == c) {
                            return
                        }
                        if (this.isAncestorColumn(d, c)) {
                            return
                        }
                        var a = this.getParentColumn(d);
                        if (a) {
                            a.columns.remove(d)
                        }
                        var f = c;
                        var b = e;
                        if (b == "before") {
                            f = this.getParentColumn(c);
                            b = f.columns.indexOf(c)
                        } else {
                            if (b == "after") {
                                f = this.getParentColumn(c);
                                b = f.columns.indexOf(c) + 1
                            } else {
                                if (b == "add" || b == "append") {
                                    if (!f.columns) {
                                        f.columns = []
                                    }
                                    b = f.columns.length
                                } else {
                                    if (!mini.isNumber(b)) {
                                        return
                                    }
                                }
                            }
                        }
                        f.columns.insert(b, d);
                        this._columnsChanged()
                    },
                    addColumn : function(a) {
                        if (!a) {
                            return
                        }
                        delete a._id;
                        this._columnsChanged()
                    },
                    removeColumn : function() {
                        this._columnsChanged()
                    }
                });