
mini.regClass(mini.DataSet, "dataset");
if (typeof mini_doload == "undefined") {
    mini_doload = function(a) {
    }
}

mini.DataSource = function() {
    mini.DataSource.superclass.constructor.call(this);
    this._init()
};
mini.extend(mini.DataSource, mini.Component, {
    idField : "id",
    textField : "text",
    _originalIdField : "_id",
    _clearOriginals : true,
    _autoCreateNewID : false,
    _init : function() {
        this.source = [];
        this.dataview = [];
        this.visibleRows = null;
        this._ids = {};
        this._removeds = [];
        if (this._clearOriginals) {
            this._originals = {}
        }
        this._errors = {};
        this._selected = null;
        this._selecteds = [];
        this._idSelecteds = {};
        this.__changeCount = 0
    },
    getSource : function() {
        return this.source
    },
    getList : function() {
        return this.source.clone()
    },
    getDataView : function() {
        return this.dataview.clone()
    },
    getVisibleRows : function() {
        if (!this.visibleRows) {
            this.visibleRows = this.getDataView().clone()
        }
        return this.visibleRows
    },
    setData : function(a) {
        this.loadData(a)
    },
    loadData : function(a) {
        if (!mini.isArray(a)) {
            a = []
        }
        this._init();
        this._doLoadData(a);
        this._dataChanged();
        this.fire("loaddata");
        return true
    },
    _doLoadData : function(f) {
        this.source = f;
        this.dataview = f;
        var e = this.source, d = this._ids;
        for (var c = 0, b = e.length; c < b; c++) {
            var a = e[c];
            a._id = mini.DataSource.RecordId++;
            d[a._id] = a;
            a._uid = a._id
        }
    },
    clearData : function() {
        this._init();
        this._dataChanged();
        this.fire("cleardata")
    },
    clear : function() {
        this.clearData()
    },
    updateRecord : function(a, g, e) {
        if (mini.isNull(a)) {
            return
        }
        var d = mini._getMap, c = mini._setMap;
        this.fire("beforeupdate", {
            record : a
        });
        if (typeof g == "string") {
            var b = d(g, a);
            if (mini.isEquals(b, e)) {
                return false
            }
            this.beginChange();
            c(g, e, a);
            this._setModified(a, g, b);
            this.endChange()
        } else {
            this.beginChange();
            for ( var f in g) {
                var b = d(f, a);
                var e = g[f];
                if (mini.isEquals(b, e)) {
                    continue
                }
                c(f, e, a);
                this._setModified(a, f, b)
            }
            this.endChange()
        }
        this.fire("update", {
            record : a
        })
    },
    deleteRecord : function(a) {
        this._setDeleted(a);
        this._dataChanged();
        this.fire("delete", {
            record : a
        })
    },
    getby_id : function(a) {
        a = typeof a == "object" ? a._id : a;
        return this._ids[a]
    },
    getbyId : function(g) {
        var d = typeof g;
        if (d == "number") {
            return this.getAt(g)
        }
        if (typeof g == "object") {
            if (this.getby_id(g)) {
                return g
            }
            g = g[this.idField]
        }
        var e = this.getList();
        g = String(g);
        for (var c = 0, a = e.length; c < a; c++) {
            var f = e[c];
            var b = !mini.isNull(f[this.idField]) ? String(f[this.idField])
                    : null;
            if (b == g) {
                return f
            }
        }
        return null
    },
    getsByIds : function(f) {
        if (mini.isNull(f)) {
            f = ""
        }
        f = String(f);
        var b = [];
        var d = String(f).split(",");
        for (var c = 0, a = d.length; c < a; c++) {
            var e = this.getbyId(d[c]);
            if (e) {
                b.push(e)
            }
        }
        return b
    },
    getRecord : function(a) {
        return this.getRow(a)
    },
    getRow : function(a) {
        var b = typeof a;
        if (b == "string") {
            return this.getbyId(a)
        } else {
            if (b == "number") {
                return this.getAt(a)
            } else {
                if (b == "object") {
                    return a
                }
            }
        }
    },
    delimiter : ",",
    getValueAndText : function(e, d) {
        if (mini.isNull(e)) {
            e = []
        }
        d = d || this.delimiter;
        if (typeof e == "string" || typeof e == "number") {
            e = this.getsByIds(e)
        } else {
            if (!mini.isArray(e)) {
                e = [ e ]
            }
        }
        var c = [];
        var g = [];
        for (var f = 0, b = e.length; f < b; f++) {
            var a = e[f];
            if (a) {
                c.push(this.getItemValue(a));
                g.push(this.getItemText(a))
            }
        }
        return [ c.join(d), g.join(d) ]
    },
    getItemValue : function(b) {
        if (!b) {
            return ""
        }
        var a = mini._getMap(this.idField, b);
        return mini.isNull(a) ? "" : String(a)
    },
    getItemText : function(b) {
        if (!b) {
            return ""
        }
        var a = mini._getMap(this.textField, b);
        return mini.isNull(a) ? "" : String(a)
    },
    isModified : function(a, c) {
        var b = this._originals[a[this._originalIdField]];
        if (!b) {
            return false
        }
        if (mini.isNull(c)) {
            return false
        }
        return b.hasOwnProperty(c)
    },
    hasRecord : function(a) {
        return !!this.getby_id(a)
    },
    findRecords : function(k, j) {
        var g = typeof k == "function";
        var h = k;
        var m = j || this;
        var d = this.source;
        var b = [];
        for (var e = 0, c = d.length; e < c; e++) {
            var a = d[e];
            if (g) {
                var f = h.call(m, a);
                if (f == true) {
                    b[b.length] = a
                }
                if (f === 1) {
                    break
                }
            } else {
                if (a[k] == j) {
                    b[b.length] = a
                }
            }
        }
        return b
    },
    findRecord : function(c, b) {
        var a = this.findRecords(c, b);
        return a[0]
    },
    each : function(b, a) {
        var c = this.getDataView().clone();
        a = a || this;
        mini.forEach(c, b, a)
    },
    getCount : function() {
        return this.getDataView().length
    },
    setIdField : function(a) {
        this.idField = a
    },
    setTextField : function(a) {
        this.textField = a
    },
    __changeCount : 0,
    beginChange : function() {
        this.__changeCount++
    },
    endChange : function(a) {
        this.__changeCount--;
        if (this.__changeCount < 0) {
            this.__changeCount = 0
        }
        if ((a !== false && this.__changeCount == 0) || a == true) {
            this.__changeCount = 0;
            this._dataChanged()
        }
    },
    _dataChanged : function() {
        this.visibleRows = null;
        if (this.__changeCount == 0) {
            this.fire("datachanged")
        }
    },
    _setAdded : function(a) {
        a._id = mini.DataSource.RecordId++;
        if (this._autoCreateNewID && !a[this.idField]) {
            a[this.idField] = UUID()
        }
        a._uid = a._id;
        a._state = "added";
        this._ids[a._id] = a;
        delete this._originals[a[this._originalIdField]]
    },
    _setModified : function(a, d, b) {
        if (a._state != "added" && a._state != "deleted"
                && a._state != "removed") {
            a._state = "modified";
            var c = this._getOriginal(a);
            if (!c.hasOwnProperty(d)) {
                c[d] = b
            }
        }
    },
    _setDeleted : function(a) {
        if (a._state != "added" && a._state != "deleted"
                && a._state != "removed") {
            a._state = "deleted"
        }
    },
    _setRemoved : function(a) {
        delete this._ids[a._id];
        if (a._state != "added" && a._state != "removed") {
            a._state = "removed";
            delete this._originals[a[this._originalIdField]];
            this._removeds.push(a)
        }
    },
    _getOriginal : function(a) {
        var b = a[this._originalIdField];
        var c = this._originals[b];
        if (!c) {
            c = this._originals[b] = {}
        }
        return c
    },
    _selected : null,
    _selecteds : [],
    _idSelecteds : null,
    multiSelect : false,
    isSelected : function(a) {
        if (!a) {
            return false
        }
        if (typeof a != "string") {
            a = a._id
        }
        return !!this._idSelecteds[a]
    },
    setSelected : function(a) {
        a = this.getby_id(a);
        var b = this.getSelected();
        if (b != a) {
            this._selected = a;
            if (a) {
                this.select(a)
            } else {
                this.deselect(this.getSelected())
            }
            this._OnCurrentChanged(a)
        }
    },
    getSelected : function() {
        if (this.isSelected(this._selected)) {
            return this._selected
        }
        return this._selecteds[0]
    },
    setCurrent : function(a) {
        this.setSelected(a)
    },
    getCurrent : function() {
        return this.getSelected()
    },
    getSelecteds : function() {
        return this._selecteds.clone()
    },
    select : function(a, b) {
        if (mini.isNull(a)) {
            return
        }
        this.selects([ a ], b)
    },
    deselect : function(a, b) {
        if (mini.isNull(a)) {
            return
        }
        this.deselects([ a ], b)
    },
    selectAll : function(a) {
        this.selects(this.getList())
    },
    deselectAll : function(a) {
        this.deselects(this.getList())
    },
    _fireSelect : function(a, b) {
        var c = {
            record : a,
            cancel : false
        };
        this.fire(b, c);
        return !c.cancel
    },
    selects : function(c, e) {
        if (!mini.isArray(c)) {
            return
        }
        c = c.clone();
        if (this.multiSelect == false) {
            this.deselects(this.getSelecteds());
            if (c.length > 0) {
                c.length = 1
            }
            this._selecteds = [];
            this._idSelecteds = {}
        }
        var f = [];
        for (var d = 0, b = c.length; d < b; d++) {
            var a = this.getbyId(c[d]);
            if (!a) {
                continue
            }
            if (!this.isSelected(a)) {
                if (e !== false) {
                    if (!this._fireSelect(a, "beforeselect")) {
                        continue
                    }
                }
                this._selecteds.push(a);
                this._idSelecteds[a._id] = a;
                f.push(a);
                if (e !== false) {
                    this.fire("select", {
                        record : a
                    })
                }
            }
        }
        this._OnSelectionChanged(c, true, f, e)
    },
    deselects : function(c, e) {
        if (!mini.isArray(c)) {
            return
        }
        c = c.clone();
        var g = [];
        for (var d = c.length - 1; d >= 0; d--) {
            var b = this.getbyId(c[d]);
            if (!b) {
                continue
            }
            if (this.isSelected(b)) {
                if (e !== false) {
                    if (!this._fireSelect(b, "beforedeselect")) {
                        continue
                    }
                }
                delete this._idSelecteds[b._id];
                g.push(b)
            }
        }
        this._selecteds = [];
        var a = this._idSelecteds;
        for ( var d in a) {
            var f = a[d];
            if (f._id) {
                this._selecteds.push(f)
            }
        }
        for (var d = c.length - 1; d >= 0; d--) {
            var b = this.getbyId(c[d]);
            if (!b) {
                continue
            }
            if (e !== false) {
                this.fire("deselect", {
                    record : b
                })
            }
        }
        this._OnSelectionChanged(c, false, g, e)
    },
    _OnSelectionChanged : function(b, a, h, d) {
        var g = {
            fireEvent : d,
            records : b,
            select : a,
            selected : this.getSelected(),
            selecteds : this.getSelecteds(),
            _records : h
        };
        this.fire("SelectionChanged", g);
        var f = this._current;
        var c = this.getCurrent();
        if (f != c) {
            this._current = c;
            this._OnCurrentChanged(c)
        }
    },
    _OnCurrentChanged : function(a) {
        if (this._currentTimer) {
            clearTimeout(this._currentTimer)
        }
        var b = this;
        this._currentTimer = setTimeout(function() {
            b._currentTimer = null;
            var c = {
                record : a
            };
            b.fire("CurrentChanged", c)
        }, 30)
    },
    _checkSelecteds : function() {
        for (var b = this._selecteds.length - 1; b >= 0; b--) {
            var a = this._selecteds[b];
            var c = this.getby_id(a._id);
            if (!c) {
                this._selecteds.removeAt(b);
                delete this._idSelecteds[a._id]
            }
        }
        if (this._selected && this.getby_id(this._selected._id) == null) {
            this._selected = null
        }
    },
    setMultiSelect : function(a) {
        if (this.multiSelect != a) {
            this.multiSelect = a;
            if (a == false) {
            }
        }
    },
    getMultiSelect : function() {
        return this.multiSelect
    },
    selectPrev : function() {
        var a = this.getSelected();
        if (!a) {
            a = this.getAt(0)
        } else {
            var b = this.indexOf(a);
            a = this.getAt(b - 1)
        }
        if (a) {
            this.deselectAll();
            this.select(a);
            this.setCurrent(a)
        }
    },
    selectNext : function() {
        var a = this.getSelected();
        if (!a) {
            a = this.getAt(0)
        } else {
            var b = this.indexOf(a);
            a = this.getAt(b + 1)
        }
        if (a) {
            this.deselectAll();
            this.select(a);
            this.setCurrent(a)
        }
    },
    selectFirst : function() {
        var a = this.getAt(0);
        if (a) {
            this.deselectAll();
            this.select(a);
            this.setCurrent(a)
        }
    },
    selectLast : function() {
        var b = this.getVisibleRows();
        var a = this.getAt(b.length - 1);
        if (a) {
            this.deselectAll();
            this.select(a);
            this.setCurrent(a)
        }
    },
    getSelectedsId : function(b) {
        var a = this.getSelecteds();
        var c = this.getValueAndText(a, b);
        return c[0]
    },
    getSelectedsText : function(b) {
        var a = this.getSelecteds();
        var c = this.getValueAndText(a, b);
        return c[1]
    },
    _filterInfo : null,
    _sortInfo : null,
    filter : function(b, a) {
        if (typeof b != "function") {
            return
        }
        a = a || this;
        this._filterInfo = [ b, a ];
        this._doFilter();
        this._doSort();
        this._dataChanged();
        this.fire("filter")
    },
    clearFilter : function() {
        if (!this._filterInfo) {
            return
        }
        this._filterInfo = null;
        this._doFilter();
        this._doSort();
        this._dataChanged();
        this.fire("filter")
    },
    sort : function(c, b, a) {
        if (typeof c != "function") {
            return
        }
        b = b || this;
        this._sortInfo = [ c, b, a ];
        this._doSort();
        this._dataChanged();
        this.fire("sort")
    },
    clearSort : function() {
        this._sortInfo = null;
        this.sortField = this.sortOrder = "";
        this._doFilter();
        this._dataChanged();
        if (this.sortMode == "server") {
            var a = this.getLoadParams();
            a.sortField = "";
            a.sortOrder = "";
            this.load(a)
        } else {
        }
        this.fire("filter")
    },
    _doClientSortField : function(b, d, a) {
        var e = this._getSortFnByField(b, a);
        if (!e) {
            return
        }
        this.sortField = b;
        this.sortOrder = d;
        var c = d == "desc";
        this.sort(e, this, c)
    },
    _getSortFnByField : function(c, d) {
        if (!c) {
            return null
        }
        var b = null;
        var a = mini.sortTypes[d];
        if (!a) {
            a = mini.sortTypes.string
        }
        function e(h, f) {
            var g = mini._getMap(c, h), i = mini._getMap(c, f);
            var k = mini.isNull(g) || g === "";
            var j = mini.isNull(i) || i === "";
            if (k) {
                return -1
            }
            if (j) {
                return 1
            }
            var m = a(g);
            var l = a(i);
            if (m > l) {
                return 1
            } else {
                if (m == l) {
                    return 0
                } else {
                    return -1
                }
            }
        }
        b = e;
        return b
    },
    ajaxOptions : null,
    autoLoad : false,
    url : "",
    pageSize : 10,
    pageIndex : 0,
    totalCount : 0,
    totalPage : 0,
    sortField : "",
    sortOrder : "",
    loadParams : null,
    getLoadParams : function() {
        return this.loadParams || {}
    },
    sortMode : "server",
    pageIndexField : "pageIndex",
    pageSizeField : "pageSize",
    sortFieldField : "sortField",
    sortOrderField : "sortOrder",
    totalField : "total",
    dataField : "data",
    startField : "",
    limitField : "",
    errorField : "error",
    errorMsgField : "errorMsg",
    stackTraceField : "stackTrace",
    load : function(e, d, b, a) {
        if (typeof e == "string") {
            this.setUrl(e);
            return
        }
        if (this._loadTimer) {
            clearTimeout(this._loadTimer)
        }
        this.loadParams = e || {};
        if (!mini.isNumber(this.loadParams.pageIndex)) {
            this.loadParams.pageIndex = 0
        }
        if (this._xhr) {
            this._xhr.abort()
        }
        if (this.ajaxAsync) {
            var c = this;
            this._loadTimer = setTimeout(function() {
                c._doLoadAjax(c.loadParams, d, b, a);
                c._loadTimer = null
            }, 1)
        } else {
            this._doLoadAjax(this.loadParams, d, b, a)
        }
    },
    reload : function(c, b, a) {
        this.load(this.loadParams, c, b, a)
    },
    gotoPage : function(a, b) {
        var c = this.loadParams || {};
        if (mini.isNumber(a)) {
            c.pageIndex = a
        }
        if (mini.isNumber(b)) {
            c.pageSize = b
        }
        this.load(c)
    },
    sortBy : function(a, b) {
        this.sortField = a;
        this.sortOrder = b == "asc" ? "asc" : "desc";
        if (this.sortMode == "server") {
            var c = this.getLoadParams();
            c.sortField = a;
            c.sortOrder = b;
            c.pageIndex = this.pageIndex;
            this.load(c)
        } else {
        }
    },
    setSortField : function(a) {
        this.sortField = a;
        if (this.sortMode == "server") {
            var b = this.getLoadParams();
            b.sortField = a
        }
    },
    setSortOrder : function(a) {
        this.sortOrder = a;
        if (this.sortMode == "server") {
            var b = this.getLoadParams();
            b.sortOrder = a
        }
    },
    checkSelectOnLoad : true,
    selectOnLoad : false,
    ajaxData : null,
    ajaxAsync : true,
    ajaxType : "",
    _doLoadAjax : function(f, n, j, b, k) {
        f = f || {};
        if (mini.isNull(f.pageIndex)) {
            f.pageIndex = this.pageIndex
        }
        if (mini.isNull(f.pageSize)) {
            f.pageSize = this.pageSize
        }
        if (f.sortField) {
            this.sortField = f.sortField
        }
        if (f.sortOrder) {
            this.sortOrder = f.sortOrder
        }
        f.sortField = this.sortField;
        f.sortOrder = this.sortOrder;
        this.loadParams = f;
        var a = this._evalUrl();
        var m = this._evalType(a);
        var h = mini._evalAjaxData(this.ajaxData, this);
        jQuery.extend(true, f, h);
        var i = {
            url : a,
            async : this.ajaxAsync,
            type : m,
            data : f,
            params : f,
            cache : false,
            cancel : false
        };
        jQuery.extend(true, i, this.ajaxOptions);
        this._OnBeforeLoad(i);
        if (i.cancel == true) {
            f.pageIndex = this.getPageIndex();
            f.pageSize = this.getPageSize();
            return
        }
        if (i.data != i.params && i.params != f) {
            i.data = i.params
        }
        if (i.url != a && i.type == m) {
            i.type = this._evalType(i.url)
        }
        var c = {};
        c[this.pageIndexField] = f.pageIndex;
        c[this.pageSizeField] = f.pageSize;
        if (f.sortField) {
            c[this.sortFieldField] = f.sortField
        }
        if (f.sortOrder) {
            c[this.sortOrderField] = f.sortOrder
        }
        if (this.startField && this.limitField) {
            c[this.startField] = f.pageIndex * f.pageSize;
            c[this.limitField] = f.pageSize
        }
        jQuery.extend(true, f, c);
        jQuery.extend(true, i.data, c);
        if (this.sortMode == "client") {
            f[this.sortFieldField] = "";
            f[this.sortOrderField] = ""
        }
        var g = this.getSelected();
        this._selectedValue = g ? g[this.idField] : null;
        if (mini.isNumber(this._selectedValue)) {
            this._selectedValue = String(this._selectedValue)
        }
        var l = this;
        l._resultObject = null;
        var d = i.async;
        mini.copyTo(i, {
            success : function(x, q, y) {
                if (!x || x == "null") {
                    x = "{ tatal: 0, data: [] }"
                }
                delete i.params;
                var s = {
                    text : x,
                    result : null,
                    sender : l,
                    options : i,
                    xhr : y
                };
                var z = null;
                try {
                    mini_doload(s);
                    z = s.result;
                    if (!z) {
                        z = mini.decode(x)
                    }
                } catch (v) {
                    if (mini_debugger == true) {
                        alert(a + "\n json is error.")
                    }
                }
                if (z && !mini.isArray(z)) {
                    z.total = parseInt(mini._getMap(l.totalField, z));
                    z.data = mini._getMap(l.dataField, z)
                } else {
                    if (z == null) {
                        z = {};
                        z.data = [];
                        z.total = 0
                    } else {
                        if (mini.isArray(z)) {
                            var e = {};
                            e.data = z;
                            e.total = z.length;
                            z = e
                        }
                    }
                }
                if (!z.data) {
                    z.data = []
                }
                if (!z.total) {
                    z.total = 0
                }
                l._resultObject = z;
                if (!mini.isArray(z.data)) {
                    z.data = [ z.data ]
                }
                var v = {
                    xhr : y,
                    text : x,
                    textStatus : q,
                    result : z,
                    total : z.total,
                    data : z.data.clone(),
                    pageIndex : f[l.pageIndexField],
                    pageSize : f[l.pageSizeField]
                };
                var w = mini._getMap(l.errorField, z);
                var t = mini._getMap(l.errorMsgField, z);
                var u = mini._getMap(l.stackTraceField, z);
                if (mini.isNumber(w) && w != 0 || w === false) {
                    v.textStatus = "servererror";
                    v.errorCode = w;
                    v.stackTrace = u || "";
                    v.errorMsg = t || "";
                    if (mini_debugger == true) {
                        alert(a + "\n" + v.textStatus + "\n" + v.errorMsg
                                + "\n" + v.stackTrace)
                    }
                    l.fire("loaderror", v);
                    if (j) {
                        j.call(l, v)
                    }
                } else {
                    if (k) {
                        k(v)
                    } else {
                        l.pageIndex = v.pageIndex;
                        l.pageSize = v.pageSize;
                        l.setTotalCount(v.total);
                        l._OnPreLoad(v);
                        l.setData(v.data);
                        if (l._selectedValue && l.checkSelectOnLoad) {
                            var p = l.getbyId(l._selectedValue);
                            if (p) {
                                l.select(p)
                            }
                        }
                        if (l.getSelected() == null && l.selectOnLoad
                                && l.getDataView().length > 0) {
                            l.select(0)
                        }
                        l.fire("load", v);
                        if (n) {
                            if (d) {
                                setTimeout(function() {
                                    n.call(l, v)
                                }, 20)
                            } else {
                                n.call(l, v)
                            }
                        }
                    }
                }
            },
            error : function(p, q, o) {
                if (q == "abort") {
                    return
                }
                var e = {
                    xhr : p,
                    text : p.responseText,
                    textStatus : q
                };
                e.errorMsg = p.responseText;
                e.errorCode = p.status;
                if (mini_debugger == true) {
                    alert(a + "\n" + e.errorCode + "\n" + e.errorMsg)
                }
                l.fire("loaderror", e);
                if (j) {
                    j.call(l, e)
                }
            },
            complete : function(o, p) {
                var e = {
                    xhr : o,
                    text : o.responseText,
                    textStatus : p
                };
                l.fire("loadcomplete", e);
                if (b) {
                    b.call(l, e)
                }
                l._xhr = null
            }
        });
        if (this._xhr) {
        }
        this._xhr = mini.ajax(i)
    },
    _OnBeforeLoad : function(a) {
        this.fire("beforeload", a)
    },
    _OnPreLoad : function(a) {
        this.fire("preload", a)
    },
    _evalUrl : function() {
        var url = this.url;
        if (typeof url == "function") {
            url = url()
        } else {
            try {
                url = eval(url)
            } catch (ex) {
                url = this.url
            }
            if (!url) {
                url = this.url
            }
        }
        return url
    },
    _evalType : function(a) {
        var b = this.ajaxType;
        if (!b) {
            b = "post";
            if (a) {
                if (a.indexOf(".txt") != -1 || a.indexOf(".json") != -1) {
                    b = "get"
                }
            } else {
                b = "get"
            }
        }
        return b
    },
    setSortMode : function(a) {
        this.sortMode = a
    },
    getSortMode : function() {
        return this.sortMode
    },
    setAjaxOptions : function(a) {
        this.ajaxOptions = a
    },
    getAjaxOptions : function() {
        return this.ajaxOptions
    },
    setAutoLoad : function(a) {
        this.autoLoad = a
    },
    getAutoLoad : function() {
        return this.autoLoad
    },
    setUrl : function(a) {
        this.url = a;
        if (this.autoLoad) {
            this.load()
        }
    },
    getUrl : function() {
        return this.url
    },
    setPageIndex : function(a) {
        this.pageIndex = a;
        this.fire("pageinfochanged")
    },
    getPageIndex : function() {
        return this.pageIndex
    },
    setPageSize : function(a) {
        this.pageSize = a;
        this.fire("pageinfochanged")
    },
    getPageSize : function() {
        return this.pageSize
    },
    setTotalCount : function(a) {
        this.totalCount = parseInt(a);
        this.fire("pageinfochanged")
    },
    getTotalCount : function() {
        return this.totalCount
    },
    getTotalPage : function() {
        return this.totalPage
    },
    setCheckSelectOnLoad : function(a) {
        this.checkSelectOnLoad = a
    },
    getCheckSelectOnLoad : function() {
        return this.checkSelectOnLoad
    },
    setSelectOnLoad : function(a) {
        this.selectOnLoad = a
    },
    getSelectOnLoad : function() {
        return this.selectOnLoad
    }
});
mini.DataSource.RecordId = 1;
mini.DataTable = function() {
    mini.DataTable.superclass.constructor.call(this)
};
mini
        .extend(
                mini.DataTable,
                mini.DataSource,
                {
                    _init : function() {
                        mini.DataTable.superclass._init.call(this);
                        this._filterInfo = null;
                        this._sortInfo = null
                    },
                    add : function(a) {
                        return this.insert(this.source.length, a)
                    },
                    addRange : function(a) {
                        this.insertRange(this.source.length, a)
                    },
                    insert : function(d, b) {
                        if (!b) {
                            return null
                        }
                        var g = {
                            index : d,
                            record : b
                        };
                        this.fire("beforeadd", g);
                        if (!mini.isNumber(d)) {
                            var c = this.getRecord(d);
                            if (c) {
                                d = this.indexOf(c)
                            } else {
                                d = this.getDataView().length
                            }
                        }
                        var f = this.dataview[d];
                        if (f) {
                            this.dataview.insert(d, b)
                        } else {
                            this.dataview.add(b)
                        }
                        if (this.dataview != this.source) {
                            if (f) {
                                var a = this.source.indexOf(f);
                                this.source.insert(a, b)
                            } else {
                                this.source.add(b)
                            }
                        }
                        this._setAdded(b);
                        this._dataChanged();
                        this.fire("add", g)
                    },
                    insertRange : function(d, c) {
                        if (!mini.isArray(c)) {
                            return
                        }
                        this.beginChange();
                        c = c.clone();
                        for (var e = 0, b = c.length; e < b; e++) {
                            var a = c[e];
                            this.insert(d + e, a)
                        }
                        this.endChange()
                    },
                    remove : function(a, c) {
                        var b = this.indexOf(a);
                        return this.removeAt(b, c)
                    },
                    removeAt : function(f, d) {
                        var b = this.getAt(f);
                        if (!b) {
                            return null
                        }
                        var g = {
                            record : b
                        };
                        this.fire("beforeremove", g);
                        var c = this.isSelected(b);
                        this.source.removeAt(f);
                        if (this.dataview !== this.source) {
                            this.dataview.removeAt(f)
                        }
                        this._setRemoved(b);
                        this._checkSelecteds();
                        this._dataChanged();
                        this.fire("remove", g);
                        if (c && d) {
                            var a = this.getAt(f);
                            if (!a) {
                                a = this.getAt(f - 1)
                            }
                            this.deselectAll();
                            this.select(a)
                        }
                    },
                    removeRange : function(b, c) {
                        if (!mini.isArray(b)) {
                            return
                        }
                        this.beginChange();
                        b = b.clone();
                        for (var d = 0, a = b.length; d < a; d++) {
                            var e = b[d];
                            this.remove(e, c)
                        }
                        this.endChange()
                    },
                    move : function(g, o) {
                        if (!g || !mini.isNumber(o)) {
                            return
                        }
                        if (o < 0) {
                            return
                        }
                        if (mini.isArray(g)) {
                            this.beginChange();
                            var d = g, b = this.getAt(o);
                            var j = this;
                            mini.sort(d, function(i, e) {
                                return j.indexOf(i) > j.indexOf(e)
                            }, this);
                            for (var f = 0, c = d.length; f < c; f++) {
                                var a = d[f];
                                var h = this.indexOf(b);
                                this.move(a, h)
                            }
                            this.endChange();
                            return
                        }
                        var m = {
                            index : o,
                            record : g
                        };
                        this.fire("beforemove", m);
                        var k = this.dataview[o];
                        this.dataview.remove(g);
                        var n = this.dataview.indexOf(k);
                        if (n != -1) {
                            o = n
                        }
                        if (k) {
                            this.dataview.insert(o, g)
                        } else {
                            this.dataview.add(g)
                        }
                        if (this.dataview != this.source) {
                            this.source.remove(g);
                            var n = this.source.indexOf(k);
                            if (n != -1) {
                                o = n
                            }
                            if (k) {
                                this.source.insert(o, g)
                            } else {
                                this.source.add(g)
                            }
                        }
                        this._dataChanged();
                        this.fire("move", m)
                    },
                    indexOf : function(a) {
                        return this.getVisibleRows().indexOf(a)
                    },
                    getAt : function(a) {
                        return this.getVisibleRows()[a]
                    },
                    getRange : function(g, b) {
                        if (g > b) {
                            var e = g;
                            g = b;
                            b = e
                        }
                        var c = [];
                        for (var d = g, a = b; d <= a; d++) {
                            var f = this.dataview[d];
                            c.push(f)
                        }
                        return c
                    },
                    selectRange : function(c, a) {
                        if (!mini.isNumber(c)) {
                            c = this.indexOf(c)
                        }
                        if (!mini.isNumber(a)) {
                            a = this.indexOf(a)
                        }
                        if (mini.isNull(c) || mini.isNull(a)) {
                            return
                        }
                        var b = this.getRange(c, a);
                        this.selects(b)
                    },
                    toArray : function() {
                        return this.source.clone()
                    },
                    isChanged : function() {
                        return this.getChanges().length > 0
                    },
                    getChanges : function(b, f) {
                        var j = [];
                        if (b == "removed" || b == null) {
                            j.addRange(this._removeds.clone())
                        }
                        for (var d = 0, c = this.source.length; d < c; d++) {
                            var e = this.source[d];
                            if (!e._state) {
                                continue
                            }
                            if (e._state == b || b == null) {
                                j[j.length] = e
                            }
                        }
                        var n = j;
                        if (f) {
                            for (var d = 0, c = n.length; d < c; d++) {
                                var m = n[d];
                                if (m._state == "modified") {
                                    var k = {};
                                    k._state = m._state;
                                    k[this.idField] = m[this.idField];
                                    for ( var h in m) {
                                        var g = this.isModified(m, h);
                                        if (g) {
                                            k[h] = m[h]
                                        }
                                    }
                                    n[d] = k
                                }
                            }
                        }
                        var a = this;
                        mini.sort(j, function(l, i) {
                            var p = a.indexOf(l);
                            var o = a.indexOf(i);
                            if (p > o) {
                                return 1
                            }
                            if (p < o) {
                                return -1
                            }
                            return 0
                        });
                        return j
                    },
                    accept : function() {
                        this.beginChange();
                        for (var c = 0, b = this.source.length; c < b; c++) {
                            var a = this.source[c];
                            this.acceptRecord(a)
                        }
                        this._removeds = [];
                        this._originals = {};
                        this.endChange()
                    },
                    reject : function() {
                        this.beginChange();
                        for (var c = 0, b = this.source.length; c < b; c++) {
                            var a = this.source[c];
                            this.rejectRecord(a)
                        }
                        this._removeds = [];
                        this._originals = {};
                        this.endChange()
                    },
                    acceptRecord : function(a) {
                        if (!a._state) {
                            return
                        }
                        delete this._originals[a[this._originalIdField]];
                        if (a._state == "deleted") {
                            this.remove(a)
                        } else {
                            delete a._state;
                            delete this._originals[a[this._originalIdField]];
                            this._dataChanged()
                        }
                        this.fire("update", {
                            record : a
                        })
                    },
                    rejectRecord : function(a) {
                        if (!a._state) {
                            return
                        }
                        if (a._state == "added") {
                            this.remove(a)
                        } else {
                            if (a._state == "modified" || a._state == "deleted") {
                                var b = this._getOriginal(a);
                                mini.copyTo(a, b);
                                delete a._state;
                                delete this._originals[a[this._originalIdField]];
                                this._dataChanged();
                                this.fire("update", {
                                    record : a
                                })
                            }
                        }
                    },
                    _doFilter : function() {
                        if (!this._filterInfo) {
                            this.dataview = this.source;
                            return
                        }
                        var e = this._filterInfo[0], d = this._filterInfo[1];
                        var b = [];
                        var g = this.source;
                        for (var c = 0, a = g.length; c < a; c++) {
                            var f = g[c];
                            var h = e.call(d, f, c, this);
                            if (h !== false) {
                                b.push(f)
                            }
                        }
                        this.dataview = b
                    },
                    _doSort : function() {
                        if (!this._sortInfo) {
                            return
                        }
                        var d = this._sortInfo[0], c = this._sortInfo[1], a = this._sortInfo[2];
                        var b = this.getDataView().clone();
                        mini.sort(b, d, c);
                        if (a) {
                            b.reverse()
                        }
                        this.dataview = b
                    }
                });
mini.regClass(mini.DataTable, "datatable");
mini.DataTree = function() {
    mini.DataTree.superclass.constructor.call(this)
};
mini
        .extend(
                mini.DataTree,
                mini.DataSource,
                {
                    isTree : true,
                    expandOnLoad : false,
                    idField : "id",
                    parentField : "pid",
                    nodesField : "children",
                    checkedField : "checked",
                    resultAsTree : true,
                    dataField : "",
                    checkModel : "cascade",
                    autoCheckParent : false,
                    onlyLeafCheckable : false,
                    setExpandOnLoad : function(a) {
                        this.expandOnLoad = a
                    },
                    getExpandOnLoad : function() {
                        return this.expandOnLoad
                    },
                    setParentField : function(a) {
                        this.parentField = a
                    },
                    setNodesField : function(b) {
                        if (this.nodesField != b) {
                            var a = this.root[this.nodesField];
                            this.nodesField = b;
                            this._doLoadData(a)
                        }
                    },
                    setResultAsTree : function(a) {
                        this.resultAsTree = a
                    },
                    setCheckRecursive : function(a) {
                        this.checkModel = a ? "cascade" : "multiple"
                    },
                    getCheckRecursive : function() {
                        return this.checkModel == "cascade"
                    },
                    setShowFolderCheckBox : function(a) {
                        this.onlyLeafCheckable = !a
                    },
                    getShowFolderCheckBox : function() {
                        return !this.onlyLeafCheckable
                    },
                    _doExpandOnLoad : function(a) {
                        var d = this.nodesField;
                        var c = this.expandOnLoad;
                        function b(f, k) {
                            for (var g = 0, e = f.length; g < e; g++) {
                                var h = f[g];
                                if (mini.isNull(h.expanded)) {
                                    if (c === true
                                            || (mini.isNumber(c) && k <= c)) {
                                        h.expanded = true
                                    } else {
                                        h.expanded = false
                                    }
                                } else {
                                }
                                var j = h[d];
                                if (j) {
                                    b(j, k + 1)
                                }
                            }
                        }
                        b(a, 0)
                    },
                    _OnBeforeLoad : function(b) {
                        var a = this._loadingNode || this.root;
                        b.node = a;
                        if (this._isNodeLoading()) {
                            b.async = true;
                            b.isRoot = b.node == this.root;
                            if (!b.isRoot) {
                                b.data[this.idField] = this
                                        .getItemValue(b.node)
                            }
                        }
                        this.fire("beforeload", b)
                    },
                    _OnPreLoad : function(a) {
                        if (this.resultAsTree == false) {
                            a.data = mini.arrayToTree(a.data, this.nodesField,
                                    this.idField, this.parentField)
                        }
                        this.fire("preload", a)
                    },
                    _init : function() {
                        mini.DataTree.superclass._init.call(this);
                        this.root = {
                            _id : -1,
                            _level : -1
                        };
                        this.source = this.root[this.nodesField] = [];
                        this.viewNodes = null;
                        this.dataview = null;
                        this.visibleRows = null;
                        this._ids[this.root._id] = this.root
                    },
                    _doLoadData : function(e) {
                        e = e || [];
                        this._doExpandOnLoad(e);
                        this.source = this.root[this.nodesField] = e;
                        this.viewNodes = null;
                        this.dataview = null;
                        this.visibleRows = null;
                        var b = mini.treeToArray(e, this.nodesField);
                        var a = this._ids;
                        a[this.root._id] = this.root;
                        for (var f = 0, d = b.length; f < d; f++) {
                            var c = b[f];
                            c._id = mini.DataSource.RecordId++;
                            a[c._id] = c;
                            c._uid = c._id
                        }
                        var j = this.checkedField;
                        var b = mini.treeToArray(e, this.nodesField, "_id",
                                "_pid", this.root._id);
                        for (var f = 0, d = b.length; f < d; f++) {
                            var c = b[f];
                            var g = this.getParentNode(c);
                            c._pid = g._id;
                            c._level = g._level + 1;
                            delete c._state;
                            c.checked = c[j];
                            if (c.checked) {
                                c.checked = c.checked != "false"
                            }
                            if (this.isLeafNode(c) == false) {
                                var h = c[this.nodesField];
                                if (h && h.length > 0) {
                                }
                            }
                        }
                        this._doUpdateLoadedCheckedNodes()
                    },
                    _setAdded : function(b) {
                        var a = this.getParentNode(b);
                        b._id = mini.DataSource.RecordId++;
                        if (this._autoCreateNewID && !b[this.idField]) {
                            b[this.idField] = UUID()
                        }
                        b._uid = b._id;
                        b._pid = a._id;
                        if (a[this.idField]) {
                            b[this.parentField] = a[this.idField]
                        }
                        b._level = a._level + 1;
                        b._state = "added";
                        this._ids[b._id] = b;
                        delete this._originals[b[this._originalIdField]]
                    },
                    _createNodes : function(b) {
                        var a = b[this.nodesField];
                        if (!a) {
                            a = b[this.nodesField] = []
                        }
                        if (this.viewNodes && !this.viewNodes[b._id]) {
                            this.viewNodes[b._id] = []
                        }
                        return a
                    },
                    addNode : function(b, a) {
                        if (!b) {
                            return
                        }
                        return this.insertNode(b, -1, a)
                    },
                    addNodes : function(c, a, f) {
                        if (!mini.isArray(c)) {
                            return
                        }
                        if (mini.isNull(f)) {
                            f = "add"
                        }
                        for (var d = 0, b = c.length; d < b; d++) {
                            var e = c[d];
                            this.insertNode(e, f, a)
                        }
                    },
                    insertNodes : function(d, e, a) {
                        if (!mini.isNumber(e)) {
                            return
                        }
                        if (!mini.isArray(d)) {
                            return
                        }
                        if (!a) {
                            a = this.root
                        }
                        this.beginChange();
                        var c = this._createNodes(a);
                        if (e < 0 || e > c.length) {
                            e = c.length
                        }
                        d = d.clone();
                        for (var f = 0, b = d.length; f < b; f++) {
                            this.insertNode(d[f], e + f, a)
                        }
                        this.endChange();
                        return d
                    },
                    removeNode : function(c) {
                        var a = this.getParentNode(c);
                        if (!a) {
                            return
                        }
                        var b = this.indexOfNode(c);
                        return this.removeNodeAt(b, a)
                    },
                    removeNodes : function(b) {
                        if (!mini.isArray(b)) {
                            return
                        }
                        this.beginChange();
                        b = b.clone();
                        for (var c = 0, a = b.length; c < a; c++) {
                            this.removeNode(b[c])
                        }
                        this.endChange()
                    },
                    moveNodes : function(b, g, f) {
                        if (!b || b.length == 0 || !g || !f) {
                            return
                        }
                        this.beginChange();
                        var e = this;
                        mini.sort(b, function(i, h) {
                            return e.indexOf(i) > e.indexOf(h)
                        }, this);
                        for (var c = 0, a = b.length; c < a; c++) {
                            var d = b[c];
                            this.moveNode(d, g, f);
                            if (c != 0) {
                                g = d;
                                f = "after"
                            }
                        }
                        this.endChange()
                    },
                    moveNode : function(a, h, b) {
                        if (!a || !h || mini.isNull(b)) {
                            return
                        }
                        if (this.viewNodes) {
                            var d = h;
                            var f = b;
                            if (f == "before") {
                                d = this.getParentNode(h);
                                f = this.indexOfNode(h)
                            } else {
                                if (f == "after") {
                                    d = this.getParentNode(h);
                                    f = this.indexOfNode(h) + 1
                                } else {
                                    if (f == "add" || f == "append") {
                                        if (!d[this.nodesField]) {
                                            d[this.nodesField] = []
                                        }
                                        f = d[this.nodesField].length
                                    } else {
                                        if (!mini.isNumber(f)) {
                                            return
                                        }
                                    }
                                }
                            }
                            if (this.isAncestor(a, d)) {
                                return false
                            }
                            var j = this.getChildNodes(d);
                            if (f < 0 || f > j.length) {
                                f = j.length
                            }
                            var i = {};
                            j.insert(f, i);
                            var k = this.getParentNode(a);
                            var c = this.getChildNodes(k);
                            c.remove(a);
                            f = j.indexOf(i);
                            j[f] = a
                        }
                        var d = h;
                        var f = b;
                        var j = this._createNodes(d);
                        if (f == "before") {
                            d = this.getParentNode(h);
                            j = this._createNodes(d);
                            f = j.indexOf(h)
                        } else {
                            if (f == "after") {
                                d = this.getParentNode(h);
                                j = this._createNodes(d);
                                f = j.indexOf(h) + 1
                            } else {
                                if (f == "add" || f == "append") {
                                    f = j.length
                                } else {
                                    if (!mini.isNumber(f)) {
                                        return
                                    }
                                }
                            }
                        }
                        if (this.isAncestor(a, d)) {
                            return false
                        }
                        if (f < 0 || f > j.length) {
                            f = j.length
                        }
                        var i = {};
                        j.insert(f, i);
                        var k = this.getParentNode(a);
                        k[this.nodesField].remove(a);
                        f = j.indexOf(i);
                        j[f] = a;
                        this._updateParentAndLevel(a, d);
                        this._dataChanged();
                        var g = {
                            parentNode : d,
                            index : f,
                            node : a
                        };
                        this.fire("movenode", g)
                    },
                    insertNode : function(f, d, b) {
                        if (!f) {
                            return
                        }
                        if (!b) {
                            b = this.root;
                            d = "add"
                        }
                        if (!mini.isNumber(d)) {
                            switch (d) {
                            case "before":
                                d = this.indexOfNode(b);
                                b = this.getParentNode(b);
                                this.insertNode(f, d, b);
                                break;
                            case "after":
                                d = this.indexOfNode(b);
                                b = this.getParentNode(b);
                                this.insertNode(f, d + 1, b);
                                break;
                            case "append":
                            case "add":
                                this.addNode(f, b);
                                break;
                            default:
                                break
                            }
                            return
                        }
                        var a = this._createNodes(b);
                        var c = this.getChildNodes(b);
                        if (d < 0) {
                            d = c.length
                        }
                        c.insert(d, f);
                        d = c.indexOf(f);
                        if (this.viewNodes) {
                            var i = c[d - 1];
                            if (i) {
                                var h = a.indexOf(i);
                                a.insert(h + 1, f)
                            } else {
                                a.insert(0, f)
                            }
                        }
                        f._pid = b._id;
                        this._setAdded(f);
                        this.cascadeChild(f, function(k, e, j) {
                            k._pid = j._id;
                            this._setAdded(k)
                        }, this);
                        this._dataChanged();
                        var g = {
                            parentNode : b,
                            index : d,
                            node : f
                        };
                        this.fire("addnode", g);
                        return f
                    },
                    removeNodeAt : function(d, b) {
                        if (!b) {
                            b = this.root
                        }
                        var c = this.getChildNodes(b);
                        var f = c[d];
                        if (!f) {
                            return null
                        }
                        c.removeAt(d);
                        if (this.viewNodes) {
                            var a = b[this.nodesField];
                            a.remove(f)
                        }
                        this._setRemoved(f);
                        this.cascadeChild(f, function(j, e, h) {
                            this._setRemoved(j)
                        }, this);
                        this._checkSelecteds();
                        this._dataChanged();
                        var g = {
                            parentNode : b,
                            index : d,
                            node : f
                        };
                        this.fire("removenode", g);
                        return f
                    },
                    bubbleParent : function(d, c, b) {
                        b = b || this;
                        if (d) {
                            c.call(this, d)
                        }
                        var a = this.getParentNode(d);
                        if (a && a != this.root) {
                            this.bubbleParent(a, c, b)
                        }
                    },
                    cascadeChild : function(g, f, e) {
                        if (!f) {
                            return
                        }
                        if (!g) {
                            g = this.root
                        }
                        var b = g[this.nodesField];
                        if (b) {
                            b = b.clone();
                            for (var d = 0, a = b.length; d < a; d++) {
                                var h = b[d];
                                if (f.call(e || this, h, d, g) === false) {
                                    return
                                }
                                this.cascadeChild(h, f, e)
                            }
                        }
                    },
                    eachChild : function(f, e, d) {
                        if (!e || !f) {
                            return
                        }
                        var b = f[this.nodesField];
                        if (b) {
                            var g = b.clone();
                            for (var c = 0, a = g.length; c < a; c++) {
                                var h = g[c];
                                if (e.call(d || this, h, c, f) === false) {
                                    break
                                }
                            }
                        }
                    },
                    collapse : function(b, a) {
                        b = this.getNode(b);
                        if (!b) {
                            return
                        }
                        this.beginChange();
                        b.expanded = false;
                        if (a) {
                            this.eachChild(b, function(d) {
                                if (d[this.nodesField] != null) {
                                    this.collapse(d, a)
                                }
                            }, this)
                        }
                        this.endChange();
                        var c = {
                            node : b
                        };
                        this.fire("collapse", c)
                    },
                    expand : function(b, a) {
                        b = this.getNode(b);
                        if (!b) {
                            return
                        }
                        this.beginChange();
                        b.expanded = true;
                        if (a) {
                            this.eachChild(b, function(d) {
                                if (d[this.nodesField] != null) {
                                    this.expand(d, a)
                                }
                            }, this)
                        }
                        this.endChange();
                        var c = {
                            node : b
                        };
                        this.fire("expand", c)
                    },
                    toggle : function(a) {
                        if (this.isExpandedNode(a)) {
                            this.collapse(a)
                        } else {
                            this.expand(a)
                        }
                    },
                    expandNode : function(a) {
                        this.expand(a)
                    },
                    collapseNode : function(a) {
                        this.collapse(a)
                    },
                    collapseAll : function() {
                        this.collapse(this.root, true)
                    },
                    expandAll : function() {
                        this.expand(this.root, true)
                    },
                    collapseLevel : function(b, a) {
                        this.beginChange();
                        this.each(function(d) {
                            var c = this.getLevel(d);
                            if (b == c) {
                                this.collapse(d, a)
                            }
                        }, this);
                        this.endChange()
                    },
                    expandLevel : function(b, a) {
                        this.beginChange();
                        this.each(function(d) {
                            var c = this.getLevel(d);
                            if (b == c) {
                                this.expand(d, a)
                            }
                        }, this);
                        this.endChange()
                    },
                    expandPath : function(d) {
                        d = this.getNode(d);
                        if (!d) {
                            return
                        }
                        var b = this.getAncestors(d);
                        for (var c = 0, a = b.length; c < a; c++) {
                            this.expandNode(b[c])
                        }
                    },
                    collapsePath : function(d) {
                        d = this.getNode(d);
                        if (!d) {
                            return
                        }
                        var b = this.getAncestors(d);
                        for (var c = 0, a = b.length; c < a; c++) {
                            this.collapseNode(b[c])
                        }
                    },
                    isAncestor : function(a, e) {
                        if (a == e) {
                            return true
                        }
                        if (!a || !e) {
                            return false
                        }
                        if (a == this.getRootNode()) {
                            return true
                        }
                        var c = this.getAncestors(e);
                        for (var d = 0, b = c.length; d < b; d++) {
                            if (c[d] == a) {
                                return true
                            }
                        }
                        return false
                    },
                    getAncestors : function(c) {
                        var b = [];
                        while (1) {
                            var a = this.getParentNode(c);
                            if (!a || a == this.root) {
                                break
                            }
                            b[b.length] = a;
                            c = a
                        }
                        b.reverse();
                        return b
                    },
                    getNode : function(a) {
                        return this.getRecord(a)
                    },
                    getRootNode : function() {
                        return this.root
                    },
                    getParentNode : function(a) {
                        if (!a) {
                            return null
                        }
                        return this.getby_id(a._pid)
                    },
                    getAllChildNodes : function(a) {
                        return this.getChildNodes(a, true)
                    },
                    getChildNodes : function(b, h, j) {
                        b = this.getNode(b);
                        if (!b) {
                            b = this.getRootNode()
                        }
                        var a = b[this.nodesField];
                        if (this.viewNodes && j !== false) {
                            a = this.viewNodes[b._id]
                        }
                        if (h === true && a) {
                            var g = [];
                            for (var d = 0, c = a.length; d < c; d++) {
                                var f = a[d];
                                g[g.length] = f;
                                var e = this.getChildNodes(f, h, j);
                                if (e && e.length > 0) {
                                    g.addRange(e)
                                }
                            }
                            a = g
                        }
                        return a || []
                    },
                    getChildNodeAt : function(b, c) {
                        var a = this.getChildNodes(c);
                        if (a) {
                            return a[b]
                        }
                        return null
                    },
                    hasChildNodes : function(b) {
                        var a = this.getChildNodes(b);
                        return a.length > 0
                    },
                    getLevel : function(a) {
                        return a._level
                    },
                    _is_true : function(a) {
                        return a === true || a === 1 || a === "Y" || a === "y"
                    },
                    _is_false : function(a) {
                        return a === false || a === 0 || a === "N" || a === "n"
                    },
                    leafField : "isLeaf",
                    isLeafNode : function(a) {
                        return this.isLeaf(a)
                    },
                    isLeaf : function(c) {
                        if (!c) {
                            return false
                        }
                        var b = c[this.leafField];
                        if (!c || this._is_false(b)) {
                            return false
                        }
                        var a = this.getChildNodes(c, false, false);
                        if (a.length > 0) {
                            return false
                        }
                        return true
                    },
                    hasChildren : function(b) {
                        var a = this.getChildNodes(b);
                        return !!(a && a.length > 0)
                    },
                    isFirstNode : function(b) {
                        if (b == this.root) {
                            return true
                        }
                        var a = this.getParentNode(b);
                        if (!a) {
                            return false
                        }
                        return this.getFirstNode(a) == b
                    },
                    isLastNode : function(b) {
                        if (b == this.root) {
                            return true
                        }
                        var a = this.getParentNode(b);
                        if (!a) {
                            return false
                        }
                        return this.getLastNode(a) == b
                    },
                    isCheckedNode : function(a) {
                        return a.checked === true
                    },
                    isExpandedNode : function(a) {
                        return a.expanded == true || a.expanded == 1
                                || mini.isNull(a.expanded)
                    },
                    isEnabledNode : function(a) {
                        return a.enabled !== false
                    },
                    isVisibleNode : function(a) {
                        if (a.visible == false) {
                            return false
                        }
                        var b = this._ids[a._pid];
                        if (!b || b == this.root) {
                            return true
                        }
                        if (b.expanded === false) {
                            return false
                        }
                        return this.isVisibleNode(b)
                    },
                    getNextNode : function(c) {
                        var a = this.getby_id(c._pid);
                        if (!a) {
                            return null
                        }
                        var b = this.indexOfNode(c);
                        return this.getChildNodes(a)[b + 1]
                    },
                    getPrevNode : function(c) {
                        var a = this.getby_id(c._pid);
                        if (!a) {
                            return null
                        }
                        var b = this.indexOfNode(c);
                        return this.getChildNodes(a)[b - 1]
                    },
                    getFirstNode : function(a) {
                        return this.getChildNodes(a)[0]
                    },
                    getLastNode : function(a) {
                        var b = this.getChildNodes(a);
                        return b[b.length - 1]
                    },
                    indexOfNode : function(b) {
                        var a = this.getby_id(b._pid);
                        if (a) {
                            return this.getChildNodes(a).indexOf(b)
                        }
                        return -1
                    },
                    indexOfList : function(a) {
                        return this.getList().indexOf(a)
                    },
                    getAt : function(a) {
                        return this.getVisibleRows()[a]
                    },
                    indexOf : function(a) {
                        return this.getVisibleRows().indexOf(a)
                    },
                    getRange : function(h, b) {
                        if (h > b) {
                            var e = h;
                            h = b;
                            b = e
                        }
                        var f = this.getChildNodes(this.root, true);
                        var c = [];
                        for (var d = h, a = b; d <= a; d++) {
                            var g = f[d];
                            if (g) {
                                c.push(g)
                            }
                        }
                        return c
                    },
                    selectRange : function(d, a) {
                        var c = this.getChildNodes(this.root, true);
                        if (!mini.isNumber(d)) {
                            d = c.indexOf(d)
                        }
                        if (!mini.isNumber(a)) {
                            a = c.indexOf(a)
                        }
                        if (mini.isNull(d) || mini.isNull(a)) {
                            return
                        }
                        var b = this.getRange(d, a);
                        this.selects(b)
                    },
                    findRecords : function(k, j) {
                        var d = this.toArray();
                        var g = typeof k == "function";
                        var h = k;
                        var m = j || this;
                        var b = [];
                        for (var e = 0, c = d.length; e < c; e++) {
                            var a = d[e];
                            if (g) {
                                var f = h.call(m, a);
                                if (f == true) {
                                    b[b.length] = a
                                }
                                if (f === 1) {
                                    break
                                }
                            } else {
                                if (a[k] == j) {
                                    b[b.length] = a
                                }
                            }
                        }
                        return b
                    },
                    _dataChangedCount : 0,
                    _dataChanged : function() {
                        this._dataChangedCount++;
                        this.dataview = null;
                        this.visibleRows = null;
                        if (this.__changeCount == 0) {
                            this.fire("datachanged")
                        }
                    },
                    _createDataView : function() {
                        var a = this.getChildNodes(this.root, true);
                        return a
                    },
                    _createVisibleRows : function() {
                        var e = this.getChildNodes(this.root, true);
                        var b = [];
                        for (var c = 0, a = e.length; c < a; c++) {
                            var d = e[c];
                            if (this.isVisibleNode(d)) {
                                b[b.length] = d
                            }
                        }
                        return b
                    },
                    getList : function() {
                        return mini.treeToList(this.source, this.nodesField)
                    },
                    getDataView : function() {
                        if (!this.dataview) {
                            this.dataview = this._createDataView()
                        }
                        return this.dataview.clone()
                    },
                    getVisibleRows : function() {
                        if (!this.visibleRows) {
                            this.visibleRows = this._createVisibleRows()
                        }
                        return this.visibleRows
                    },
                    _doFilter : function() {
                        if (!this._filterInfo) {
                            this.viewNodes = null;
                            return
                        }
                        var d = this._filterInfo[0], c = this._filterInfo[1];
                        var a = this.viewNodes = {}, e = this.nodesField;
                        function b(k) {
                            var g = k[e];
                            if (!g) {
                                return false
                            }
                            var h = k._id;
                            var o = a[h] = [];
                            for (var n = 0, m = g.length; n < m; n++) {
                                var f = g[n];
                                var j = b(f);
                                var p = d.call(c, f, n, this);
                                if (p === true || j) {
                                    o.push(f)
                                }
                            }
                            return o.length > 0
                        }
                        b(this.root)
                    },
                    _doSort : function() {
                        if (!this._filterInfo && !this._sortInfo) {
                            this.viewNodes = null;
                            return
                        }
                        if (!this._sortInfo) {
                            return
                        }
                        var e = this._sortInfo[0], d = this._sortInfo[1], b = this._sortInfo[2];
                        var g = this.nodesField;
                        if (!this.viewNodes) {
                            var a = this.viewNodes = {};
                            a[this.root._id] = this.root[g].clone();
                            this.cascadeChild(this.root, function(k, j, l) {
                                var h = k[g];
                                if (h) {
                                    a[k._id] = h.clone()
                                }
                            })
                        }
                        var f = this;
                        function c(n) {
                            var j = f.getChildNodes(n);
                            mini.sort(j, e, d);
                            if (b) {
                                j.reverse()
                            }
                            for (var k = 0, h = j.length; k < h; k++) {
                                var m = j[k];
                                c(m)
                            }
                        }
                        c(this.root)
                    },
                    toArray : function() {
                        if (!this._array
                                || this._dataChangedCount != this._dataChangedCount2) {
                            this._dataChangedCount2 = this._dataChangedCount;
                            this._array = this.getChildNodes(this.root, true,
                                    false)
                        }
                        return this._array
                    },
                    toTree : function() {
                        return this.root[this.nodesField]
                    },
                    isChanged : function() {
                        return this.getChanges().length > 0
                    },
                    getChanges : function(a, d) {
                        var g = [];
                        if (a == "removed" || a == null) {
                            g.addRange(this._removeds.clone())
                        }
                        this.cascadeChild(this.root, function(l, m, n) {
                            if (l._state == null || l._state == "") {
                                return
                            }
                            if (l._state == a || a == null) {
                                g[g.length] = l
                            }
                        }, this);
                        var k = g;
                        if (d) {
                            for (var c = 0, b = k.length; c < b; c++) {
                                var j = k[c];
                                if (j._state == "modified") {
                                    var h = {};
                                    h[this.idField] = j[this.idField];
                                    for ( var f in j) {
                                        var e = this.isModified(j, f);
                                        if (e) {
                                            h[f] = j[f]
                                        }
                                    }
                                    k[c] = h
                                }
                            }
                        }
                        return g
                    },
                    accept : function(a) {
                        a = a || this.root;
                        this.beginChange();
                        this.cascadeChild(this.root, function(b) {
                            this.acceptRecord(b)
                        }, this);
                        this._removeds = [];
                        this._originals = {};
                        this.endChange()
                    },
                    reject : function(a) {
                        this.beginChange();
                        this.cascadeChild(this.root, function(b) {
                            this.rejectRecord(b)
                        }, this);
                        this._removeds = [];
                        this._originals = {};
                        this.endChange()
                    },
                    acceptRecord : function(a) {
                        if (!a._state) {
                            return
                        }
                        delete this._originals[a[this._originalIdField]];
                        if (a._state == "deleted") {
                            this.removeNode(a)
                        } else {
                            delete a._state;
                            delete this._originals[a[this._originalIdField]];
                            this._dataChanged();
                            this.fire("update", {
                                record : a
                            })
                        }
                    },
                    rejectRecord : function(a) {
                        if (!a._state) {
                            return
                        }
                        if (a._state == "added") {
                            this.removeNode(a)
                        } else {
                            if (a._state == "modified" || a._state == "deleted") {
                                var b = this._getOriginal(a);
                                mini.copyTo(a, b);
                                delete a._state;
                                delete this._originals[a[this._originalIdField]];
                                this._dataChanged();
                                this.fire("update", {
                                    record : a
                                })
                            }
                        }
                    },
                    upGrade : function(b) {
                        var e = this.getParentNode(b);
                        if (e == this.root || b == this.root) {
                            return false
                        }
                        var c = e[this.nodesField];
                        var g = c.indexOf(b);
                        var h = b[this.nodesField] ? b[this.nodesField].length
                                : 0;
                        for (var f = c.length - 1; f >= g; f--) {
                            var a = c[f];
                            c.removeAt(f);
                            if (a != b) {
                                if (!b[this.nodesField]) {
                                    b[this.nodesField] = []
                                }
                                b[this.nodesField].insert(h, a)
                            }
                        }
                        var d = this.getParentNode(e);
                        var j = d[this.nodesField];
                        var g = j.indexOf(e);
                        j.insert(g + 1, b);
                        this._updateParentAndLevel(b, d);
                        this._doFilter();
                        this._dataChanged()
                    },
                    downGrade : function(e) {
                        if (this.isFirstNode(e)) {
                            return false
                        }
                        var d = this.getParentNode(e);
                        var c = d[this.nodesField];
                        var b = c.indexOf(e);
                        var a = c[b - 1];
                        c.removeAt(b);
                        if (!a[this.nodesField]) {
                            a[this.nodesField] = []
                        }
                        a[this.nodesField].add(e);
                        this._updateParentAndLevel(e, a);
                        this._doFilter();
                        this._dataChanged()
                    },
                    _updateParentAndLevel : function(c, a) {
                        var b = this;
                        c._pid = a._id;
                        c._level = a._level + 1;
                        c[b.parentField] = a[b.idField];
                        this.cascadeChild(c, function(f, d, e) {
                            f._pid = e._id;
                            f._level = e._level + 1;
                            f[b.parentField] = e[b.idField]
                        }, this);
                        this._setModified(c)
                    },
                    setCheckModel : function(a) {
                        this.checkModel = a
                    },
                    getCheckModel : function() {
                        return this.checkModel
                    },
                    setOnlyLeafCheckable : function(a) {
                        this.onlyLeafCheckable = a
                    },
                    getOnlyLeafCheckable : function() {
                        return this.onlyLeafCheckable
                    },
                    setAutoCheckParent : function(a) {
                        this.autoCheckParent = a
                    },
                    getAutoCheckParent : function() {
                        return this.autoCheckParent
                    },
                    _doUpdateLoadedCheckedNodes : function() {
                        var b = this.getAllChildNodes(this.root);
                        for (var c = 0, a = b.length; c < a; c++) {
                            var d = b[c];
                            if (d.checked == true) {
                                if (this.autoCheckParent == false
                                        || !this.hasChildNodes(d)) {
                                    this._doUpdateNodeCheckState(d)
                                }
                            }
                        }
                    },
                    _doUpdateNodeCheckState : function(a) {
                        if (!a) {
                            return
                        }
                        var j = this.isChecked(a);
                        if (this.checkModel == "cascade"
                                || this.autoCheckParent) {
                            this.cascadeChild(a, function(i) {
                                this.doCheckNodes(i, j)
                            }, this);
                            if (!this.autoCheckParent) {
                                var k = this.getAncestors(a);
                                k.reverse();
                                for (var d = 0, b = k.length; d < b; d++) {
                                    var e = k[d];
                                    var n = this.getChildNodes(e);
                                    var o = true;
                                    for (var m = 0, h = n.length; m < h; m++) {
                                        var g = n[m];
                                        if (!this.isCheckedNode(g)) {
                                            o = false
                                        }
                                    }
                                    if (o) {
                                        this.doCheckNodes(e, true)
                                    } else {
                                        this.doCheckNodes(e, false)
                                    }
                                    this.fire("checkchanged", {
                                        nodes : [ e ],
                                        _nodes : [ e ]
                                    })
                                }
                            }
                        }
                        var f = this;
                        function c(p) {
                            var r = f.getChildNodes(p);
                            for (var i = 0, q = r.length; i < q; i++) {
                                var l = r[i];
                                if (f.isCheckedNode(l)) {
                                    return true
                                }
                            }
                            return false
                        }
                        if (this.autoCheckParent) {
                            var k = this.getAncestors(a);
                            k.reverse();
                            for (var d = 0, b = k.length; d < b; d++) {
                                var e = k[d];
                                e.checked = c(e);
                                this.fire("checkchanged", {
                                    nodes : [ e ],
                                    _nodes : [ e ]
                                })
                            }
                        }
                    },
                    doCheckNodes : function(b, f, a) {
                        if (!b) {
                            return
                        }
                        if (typeof b == "string") {
                            b = b.split(",")
                        }
                        if (!mini.isArray(b)) {
                            b = [ b ]
                        }
                        b = b.clone();
                        var g = [];
                        f = f !== false;
                        if (a === true) {
                            if (this.checkModel == "single") {
                                this.uncheckAllNodes()
                            }
                        }
                        for (var c = b.length - 1; c >= 0; c--) {
                            var e = this.getRecord(b[c]);
                            if (!e || (f && e.checked === true)
                                    || (!f && e.checked !== true)) {
                                if (e) {
                                    if (a === true) {
                                        this._doUpdateNodeCheckState(e)
                                    }
                                    if (!f && !this.isLeaf(e)) {
                                        g.push(e)
                                    }
                                }
                                continue
                            }
                            e.checked = f;
                            g.push(e);
                            if (a === true) {
                                this._doUpdateNodeCheckState(e)
                            }
                        }
                        var d = this;
                        setTimeout(function() {
                            d.fire("checkchanged", {
                                nodes : b,
                                _nodes : g,
                                checked : f
                            })
                        }, 1)
                    },
                    checkNode : function(b, a) {
                        this.doCheckNodes([ b ], true, a !== false)
                    },
                    uncheckNode : function(b, a) {
                        this.doCheckNodes([ b ], false, a !== false)
                    },
                    checkNodes : function(b, a) {
                        if (!mini.isArray(b)) {
                            b = []
                        }
                        this.doCheckNodes(b, true, a !== false)
                    },
                    uncheckNodes : function(b, a) {
                        if (!mini.isArray(b)) {
                            b = []
                        }
                        this.doCheckNodes(b, false, a !== false)
                    },
                    checkAllNodes : function() {
                        var a = this.getList();
                        this.doCheckNodes(a, true, false)
                    },
                    uncheckAllNodes : function() {
                        var a = this.getList();
                        this.doCheckNodes(a, false, false)
                    },
                    getCheckedNodes : function(c) {
                        if (c === false) {
                            c = "leaf"
                        }
                        var a = [];
                        var b = {};
                        this.cascadeChild(this.root, function(j) {
                            if (j.checked == true) {
                                var f = this.isLeafNode(j);
                                if (c === true) {
                                    if (!b[j._id]) {
                                        b[j._id] = j;
                                        a.push(j)
                                    }
                                    var e = this.getAncestors(j);
                                    for (var g = 0, d = e.length; g < d; g++) {
                                        var h = e[g];
                                        if (!b[h._id]) {
                                            b[h._id] = h;
                                            a.push(h)
                                        }
                                    }
                                } else {
                                    if (c === "parent") {
                                        if (!f) {
                                            if (!b[j._id]) {
                                                b[j._id] = j;
                                                a.push(j)
                                            }
                                        }
                                    } else {
                                        if (c === "leaf") {
                                            if (f) {
                                                if (!b[j._id]) {
                                                    b[j._id] = j;
                                                    a.push(j)
                                                }
                                            }
                                        } else {
                                            if (!b[j._id]) {
                                                b[j._id] = j;
                                                a.push(j)
                                            }
                                        }
                                    }
                                }
                            }
                        }, this);
                        return a
                    },
                    getCheckedNodesId : function(d, b) {
                        var a = this.getCheckedNodes(d);
                        var c = this.getValueAndText(a, b);
                        return c[0]
                    },
                    getCheckedNodesText : function(d, b) {
                        var a = this.getCheckedNodes(d);
                        var c = this.getValueAndText(a, b);
                        return c[1]
                    },
                    isChecked : function(a) {
                        a = this.getRecord(a);
                        if (!a) {
                            return null
                        }
                        return a.checked === true || a.checked === 1
                    },
                    getCheckState : function(d) {
                        d = this.getRecord(d);
                        if (!d) {
                            return null
                        }
                        if (d.checked === true) {
                            return "checked"
                        }
                        if (!d[this.nodesField]) {
                            return "unchecked"
                        }
                        var c = this.getChildNodes(d, true);
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            if (d.checked === true) {
                                return "indeterminate"
                            }
                        }
                        return "unchecked"
                    },
                    getUnCheckableNodes : function() {
                        var a = [];
                        this.cascadeChild(this.root, function(c) {
                            var b = this.getCheckable(c);
                            if (b == false) {
                                a.push(c)
                            }
                        }, this);
                        return a
                    },
                    setCheckable : function(b, a) {
                        if (!b) {
                            return
                        }
                        if (!mini.isArray(b)) {
                            b = [ b ]
                        }
                        b = b.clone();
                        a = !!a;
                        for (var c = b.length - 1; c >= 0; c--) {
                            var d = this.getRecord(b[c]);
                            if (!d) {
                                continue
                            }
                            d.checkable = checked
                        }
                    },
                    getCheckable : function(a) {
                        a = this.getRecord(a);
                        if (!a) {
                            return false
                        }
                        if (a.checkable === true) {
                            return true
                        }
                        if (a.checkable === false) {
                            return false
                        }
                        return this.isLeafNode(a) ? true
                                : !this.onlyLeafCheckable
                    },
                    showNodeCheckbox : function(b, a) {
                    },
                    reload : function(c, b, a) {
                        this._loadingNode = null;
                        this.load(this.loadParams, c, b, a)
                    },
                    _isNodeLoading : function() {
                        return !!this._loadingNode
                    },
                    loadNode : function(c, a) {
                        this._loadingNode = c;
                        var f = {
                            node : c
                        };
                        this.fire("beforeloadnode", f);
                        var d = new Date();
                        var b = this;
                        b._doLoadAjax(b.loadParams, null, null, null, function(
                                h) {
                            var g = new Date() - d;
                            if (g < 60) {
                                g = 60 - g
                            }
                            setTimeout(function() {
                                h.node = c;
                                b._OnPreLoad(h);
                                h.node = b._loadingNode;
                                b._loadingNode = null;
                                var i = c[b.nodesField];
                                b.removeNodes(i);
                                var e = h.data;
                                if (e && e.length > 0) {
                                    b.addNodes(e, c);
                                    if (a !== false) {
                                        b.expand(c, true)
                                    } else {
                                        b.collapse(c, true)
                                    }
                                } else {
                                    delete c[b.leafField];
                                    b.expand(c, true)
                                }
                                b.fire("loadnode", h);
                                b.fire("load", h)
                            }, g)
                        }, true)
                    }
                });
mini.regClass(mini.DataTree, "datatree");
mini._DataTableApplys = {
    idField : "id",
    textField : "text",
    setAjaxData : function(a) {
        this._dataSource.ajaxData = a
    },
    getby_id : function(a) {
        return this._dataSource.getby_id(a)
    },
    getValueAndText : function(b, a) {
        return this._dataSource.getValueAndText(b, a)
    },
    setIdField : function(a) {
        this._dataSource.setIdField(a);
        this.idField = a
    },
    getIdField : function() {
        return this._dataSource.idField
    },
    setTextField : function(a) {
        this._dataSource.setTextField(a);
        this.textField = a
    },
    getTextField : function() {
        return this._dataSource.textField
    },
    clearData : function() {
        this._dataSource.clearData()
    },
    loadData : function(a) {
        this._dataSource.loadData(a)
    },
    setData : function(a) {
        this._dataSource.loadData(a)
    },
    getData : function() {
        return this._dataSource.getSource().clone()
    },
    getList : function() {
        return this._dataSource.getList()
    },
    getDataView : function() {
        return this._dataSource.getDataView()
    },
    getVisibleRows : function() {
        if (this._useEmptyView) {
            return []
        }
        return this._dataSource.getVisibleRows()
    },
    toArray : function() {
        return this._dataSource.toArray()
    },
    getRecord : function(a) {
        return this._dataSource.getRecord(a)
    },
    getRow : function(a) {
        return this._dataSource.getRow(a)
    },
    getRange : function(b, a) {
        if (mini.isNull(b) || mini.isNull(a)) {
            return
        }
        return this._dataSource.getRange(b, a)
    },
    getAt : function(a) {
        return this._dataSource.getAt(a)
    },
    indexOf : function(a) {
        return this._dataSource.indexOf(a)
    },
    getRowByUID : function(a) {
        return this._dataSource.getby_id(a)
    },
    getRowById : function(a) {
        return this._dataSource.getbyId(a)
    },
    clearRows : function() {
        this._dataSource.clearData()
    },
    updateRow : function(a, c, b) {
        this._dataSource.updateRecord(a, c, b)
    },
    addRow : function(a, b) {
        return this._dataSource.insert(b, a)
    },
    removeRow : function(a, b) {
        return this._dataSource.remove(a, b)
    },
    removeRows : function(a, b) {
        return this._dataSource.removeRange(a, b)
    },
    removeRowAt : function(b, a) {
        return this._dataSource.removeAt(b, a)
    },
    moveRow : function(b, a) {
        this._dataSource.move(b, a)
    },
    addRows : function(a, b) {
        return this._dataSource.insertRange(b, a)
    },
    findRows : function(b, a) {
        return this._dataSource.findRecords(b, a)
    },
    findRow : function(b, a) {
        return this._dataSource.findRecord(b, a)
    },
    multiSelect : false,
    setMultiSelect : function(a) {
        this._dataSource.setMultiSelect(a);
        this.multiSelect = a
    },
    getMultiSelect : function() {
        return this._dataSource.getMultiSelect()
    },
    setCurrent : function(a) {
        this._dataSource.setCurrent(a)
    },
    getCurrent : function() {
        return this._dataSource.getCurrent()
    },
    isSelected : function(a) {
        return this._dataSource.isSelected(a)
    },
    setSelected : function(a) {
        this._dataSource.setSelected(a)
    },
    getSelected : function() {
        return this._dataSource.getSelected()
    },
    getSelecteds : function() {
        return this._dataSource.getSelecteds()
    },
    select : function(a, b) {
        this._dataSource.select(a, b)
    },
    selects : function(a, b) {
        this._dataSource.selects(a, b)
    },
    deselect : function(a, b) {
        this._dataSource.deselect(a, b)
    },
    deselects : function(a, b) {
        this._dataSource.deselects(a, b)
    },
    selectAll : function(a) {
        this._dataSource.selectAll(a)
    },
    deselectAll : function(a) {
        this._dataSource.deselectAll(a)
    },
    clearSelect : function(a) {
        this.deselectAll(a)
    },
    selectPrev : function() {
        this._dataSource.selectPrev()
    },
    selectNext : function() {
        this._dataSource.selectNext()
    },
    selectFirst : function() {
        this._dataSource.selectFirst()
    },
    selectLast : function() {
        this._dataSource.selectLast()
    },
    selectRange : function(b, a) {
        this._dataSource.selectRange(b, a)
    },
    filter : function(b, a) {
        this._dataSource.filter(b, a)
    },
    clearFilter : function() {
        this._dataSource.clearFilter()
    },
    sort : function(b, a) {
        this._dataSource.sort(b, a)
    },
    clearSort : function() {
        this._dataSource.clearSort()
    },
    findItems : function(e, d, f) {
        return this._dataSource.findRecords(f, d, f)
    },
    getResultObject : function() {
        return this._dataSource._resultObject || {}
    },
    isChanged : function() {
        return this._dataSource.isChanged()
    },
    getChanges : function(b, a) {
        return this._dataSource.getChanges(b, a)
    },
    accept : function() {
        this._dataSource.accept()
    },
    reject : function() {
        this._dataSource.reject()
    },
    acceptRecord : function(a) {
        this._dataSource.acceptRecord(a)
    },
    rejectRecord : function(a) {
        this._dataSource.rejectRecord(a)
    }
};
mini._DataTreeApplys = {
    addRow : null,
    removeRow : null,
    removeRows : null,
    removeRowAt : null,
    moveRow : null,
    setExpandOnLoad : function(a) {
        this._dataSource.setExpandOnLoad(a)
    },
    getExpandOnLoad : function() {
        return this._dataSource.getExpandOnLoad()
    },
    isSelectedNode : function(a) {
        a = this.getNode(a);
        return this.getSelectedNode() === a
    },
    selectNode : function(b, a) {
        if (b) {
            this._dataSource.select(b, a)
        } else {
            this._dataSource.deselect(this.getSelectedNode(), a)
        }
    },
    getSelectedNode : function() {
        return this.getSelected()
    },
    getSelectedNodes : function() {
        return this.getSelecteds()
    },
    updateNode : function(a, c, b) {
        this._dataSource.updateRecord(a, c, b)
    },
    addNode : function(b, c, a) {
        return this._dataSource.insertNode(b, c, a)
    },
    removeNodeAt : function(b, a) {
        return this._dataSource.removeNodeAt(b, a);
        this._changed = true
    },
    removeNode : function(a) {
        return this._dataSource.removeNode(a)
    },
    moveNode : function(a, b, c) {
        this._dataSource.moveNode(a, b, c)
    },
    addNodes : function(b, a, c) {
        return this._dataSource.addNodes(b, a, c)
    },
    insertNodes : function(b, c, a) {
        return this._dataSource.insertNodes(c, b, a)
    },
    moveNodes : function(a, c, b) {
        this._dataSource.moveNodes(a, c, b)
    },
    removeNodes : function(a) {
        return this._dataSource.removeNodes(a)
    },
    expandOnLoad : false,
    checkRecursive : true,
    autoCheckParent : false,
    showFolderCheckBox : true,
    idField : "id",
    textField : "text",
    parentField : "pid",
    nodesField : "children",
    checkedField : "checked",
    leafField : "isLeaf",
    resultAsTree : true,
    setShowFolderCheckBox : function(a) {
        this._dataSource.setShowFolderCheckBox(a);
        if (this.doUpdate) {
            this.doUpdate()
        }
        this.showFolderCheckBox = a
    },
    getShowFolderCheckBox : function() {
        return this._dataSource.getShowFolderCheckBox()
    },
    setCheckRecursive : function(a) {
        this._dataSource.setCheckRecursive(a);
        this.checkRecursive = a
    },
    getCheckRecursive : function() {
        return this._dataSource.getCheckRecursive()
    },
    setResultAsTree : function(a) {
        this._dataSource.setResultAsTree(a)
    },
    getResultAsTree : function(a) {
        return this._dataSource.resultAsTree
    },
    setParentField : function(a) {
        this._dataSource.setParentField(a);
        this.parentField = a
    },
    getParentField : function() {
        return this._dataSource.parentField
    },
    setLeafField : function(a) {
        this._dataSource.leafField = a;
        this.leafField = a
    },
    getLeafField : function() {
        return this._dataSource.leafField
    },
    setNodesField : function(a) {
        this._dataSource.setNodesField(a);
        this.nodesField = a
    },
    getNodesField : function() {
        return this._dataSource.nodesField
    },
    setCheckedField : function(a) {
        this._dataSource.checkedField = a;
        this.checkedField = a
    },
    getCheckedField : function() {
        return this.checkedField
    },
    findNodes : function(b, a) {
        return this._dataSource.findRecords(b, a)
    },
    getLevel : function(a) {
        return this._dataSource.getLevel(a)
    },
    isVisibleNode : function(a) {
        return this._dataSource.isVisibleNode(a)
    },
    isEnabledNode : function(a) {
        return this._dataSource.isEnabledNode(a)
    },
    isExpandedNode : function(a) {
        return this._dataSource.isExpandedNode(a)
    },
    isCheckedNode : function(a) {
        return this._dataSource.isCheckedNode(a)
    },
    isLeaf : function(a) {
        return this._dataSource.isLeafNode(a)
    },
    hasChildren : function(a) {
        return this._dataSource.hasChildren(a)
    },
    isAncestor : function(b, a) {
        return this._dataSource.isAncestor(b, a)
    },
    getNode : function(a) {
        return this._dataSource.getRecord(a)
    },
    getRootNode : function() {
        return this._dataSource.getRootNode()
    },
    getParentNode : function(a) {
        return this._dataSource.getParentNode
                .apply(this._dataSource, arguments)
    },
    getAncestors : function(a) {
        return this._dataSource.getAncestors(a)
    },
    getAllChildNodes : function(a) {
        return this._dataSource.getAllChildNodes.apply(this._dataSource,
                arguments)
    },
    getChildNodes : function(b, a) {
        return this._dataSource.getChildNodes
                .apply(this._dataSource, arguments)
    },
    getChildNodeAt : function(a, b) {
        return this._dataSource.getChildNodeAt.apply(this._dataSource,
                arguments)
    },
    indexOfNode : function(a) {
        return this._dataSource.indexOfNode.apply(this._dataSource, arguments)
    },
    hasChildNodes : function(a) {
        return this._dataSource.hasChildNodes
                .apply(this._dataSource, arguments)
    },
    isFirstNode : function(a) {
        return this._dataSource.isFirstNode.apply(this._dataSource, arguments)
    },
    isLastNode : function(a) {
        return this._dataSource.isLastNode.apply(this._dataSource, arguments)
    },
    getNextNode : function(a) {
        return this._dataSource.getNextNode.apply(this._dataSource, arguments)
    },
    getPrevNode : function(a) {
        return this._dataSource.getPrevNode.apply(this._dataSource, arguments)
    },
    getFirstNode : function(a) {
        return this._dataSource.getFirstNode.apply(this._dataSource, arguments)
    },
    getLastNode : function(a) {
        return this._dataSource.getLastNode.apply(this._dataSource, arguments)
    },
    toggleNode : function(a) {
        this._dataSource.toggle(a)
    },
    collapseNode : function(b, a) {
        this._dataSource.collapse(b, a)
    },
    expandNode : function(b, a) {
        this._dataSource.expand(b, a)
    },
    collapseAll : function() {
        this.useAnimation = false;
        this._dataSource.collapseAll();
        this.useAnimation = true
    },
    expandAll : function() {
        this.useAnimation = false;
        this._dataSource.expandAll();
        this.useAnimation = true
    },
    expandLevel : function(a) {
        this.useAnimation = false;
        this._dataSource.expandLevel(a);
        this.useAnimation = true
    },
    collapseLevel : function(a) {
        this.useAnimation = false;
        this._dataSource.collapseLevel(a);
        this.useAnimation = true
    },
    expandPath : function(a) {
        this.useAnimation = false;
        this._dataSource.expandPath(a);
        this.useAnimation = true
    },
    collapsePath : function(a) {
        this.useAnimation = false;
        this._dataSource.collapsePath(a);
        this.useAnimation = true
    },
    loadNode : function(b, a) {
        this._dataSource.loadNode(b, a)
    },
    setCheckModel : function(a) {
        this._dataSource.setCheckModel(a)
    },
    getCheckModel : function() {
        return this._dataSource.getCheckModel()
    },
    setOnlyLeafCheckable : function(a) {
        this._dataSource.setOnlyLeafCheckable(a)
    },
    getOnlyLeafCheckable : function() {
        return this._dataSource.getOnlyLeafCheckable()
    },
    setAutoCheckParent : function(a) {
        this._dataSource.setAutoCheckParent(a)
    },
    getAutoCheckParent : function() {
        return this._dataSource.getAutoCheckParent()
    },
    checkNode : function(b, a) {
        this._dataSource.checkNode(b, a)
    },
    uncheckNode : function(b, a) {
        this._dataSource.uncheckNode(b, a)
    },
    checkNodes : function(b, a) {
        this._dataSource.checkNodes(b, a)
    },
    uncheckNodes : function(b, a) {
        this._dataSource.uncheckNodes(b, a)
    },
    checkAllNodes : function() {
        this._dataSource.checkAllNodes()
    },
    uncheckAllNodes : function() {
        this._dataSource.uncheckAllNodes()
    },
    getCheckedNodes : function() {
        return this._dataSource.getCheckedNodes.apply(this._dataSource,
                arguments)
    },
    getCheckedNodesId : function() {
        return this._dataSource.getCheckedNodesId.apply(this._dataSource,
                arguments)
    },
    getCheckedNodesText : function() {
        return this._dataSource.getCheckedNodesText.apply(this._dataSource,
                arguments)
    },
    getNodesByValue : function(f) {
        if (mini.isNull(f)) {
            f = ""
        }
        f = String(f);
        var b = [];
        var d = String(f).split(",");
        for (var c = 0, a = d.length; c < a; c++) {
            var e = this.getNode(d[c]);
            if (e) {
                b.push(e)
            }
        }
        return b
    },
    isChecked : function(a) {
        return this._dataSource.isChecked.apply(this._dataSource, arguments)
    },
    getCheckState : function(a) {
        return this._dataSource.getCheckState
                .apply(this._dataSource, arguments)
    },
    setCheckable : function(b, a) {
        this._dataSource.setCheckable.apply(this._dataSource, arguments)
    },
    getCheckable : function(a) {
        return this._dataSource.getCheckable.apply(this._dataSource, arguments)
    },
    bubbleParent : function(c, b, a) {
        this._dataSource.bubbleParent.apply(this._dataSource, arguments)
    },
    cascadeChild : function(c, b, a) {
        this._dataSource.cascadeChild.apply(this._dataSource, arguments)
    },
    eachChild : function(c, b, a) {
        this._dataSource.eachChild.apply(this._dataSource, arguments)
    }
};