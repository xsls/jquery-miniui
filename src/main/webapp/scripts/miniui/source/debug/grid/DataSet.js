

mini.DataSet = function() {
    this._sources = {};
    this._data = {};
    this._links = [];
    this._originals = {};
    mini.DataSet.superclass.constructor.call(this)
};
mini.extend(mini.DataSet, mini.Component, {
    add : function(a, b) {
        if (!a || !b) {
            return
        }
        this._sources[a] = b;
        this._data[a] = [];
        b._set_autoCreateNewID(true);
        b._set_originalIdField(b.getIdField());
        b._set_clearOriginals(false);
        b.on("addrow", this.__OnRowChanged, this);
        b.on("updaterow", this.__OnRowChanged, this);
        b.on("deleterow", this.__OnRowChanged, this);
        b.on("removerow", this.__OnRowChanged, this);
        b.on("preload", this.__OnDataPreLoad, this);
        b.on("selectionchanged", this.__OnDataSelectionChanged, this)
    },
    addLink : function(b, a, d) {
        if (!b || !a || !d) {
            return
        }
        if (!this._sources[b] || !this._sources[a]) {
            return
        }
        var c = {
            parentName : b,
            childName : a,
            parentField : d
        };
        this._links.push(c)
    },
    clearData : function() {
        this._data = {};
        this._originals = {};
        for ( var a in this._sources) {
            this._data = []
        }
    },
    getData : function() {
        return this._data
    },
    _getNameByListControl : function(b) {
        for ( var a in this._sources) {
            var d = this._sources[a];
            if (d == b) {
                return a
            }
        }
    },
    _getRecord : function(d, b, c) {
        var f = this._data[d];
        if (!f) {
            return false
        }
        for (var e = 0, a = f.length; e < a; e++) {
            var g = f[e];
            if (g[c] == b[c]) {
                return g
            }
        }
        return null
    },
    __OnRowChanged : function(i) {
        var f = i.type;
        var b = i.record;
        var d = this._getNameByListControl(i.sender);
        var c = this._getRecord(d, b, i.sender.getIdField());
        var g = this._data[d];
        if (c) {
            var g = this._data[d];
            g.remove(c)
        }
        if (f == "removerow" && b._state == "added") {
        } else {
            g.push(b)
        }
        this._originals[d] = i.sender._get_originals();
        if (b._state == "added") {
            var a = this._getParentSource(i.sender);
            if (a) {
                var h = a.getSelected();
                if (h) {
                    b._parentId = h[a.getIdField()]
                } else {
                    g.remove(b)
                }
            }
        }
    },
    __OnDataPreLoad : function(m) {
        var b = m.sender;
        var c = this._getNameByListControl(b);
        var d = m.sender.getIdField();
        var s = this._data[c];
        var p = {};
        for (var h = 0, g = s.length; h < g; h++) {
            var r = s[h];
            p[r[d]] = r
        }
        var j = this._originals[c];
        if (j) {
            b._set_originals(j)
        }
        var a = m.data || [];
        for (var h = 0, g = a.length; h < g; h++) {
            var r = a[h];
            var f = p[r[d]];
            if (f) {
                delete f._uid;
                mini.copyTo(r, f)
            }
        }
        var o = this._getParentSource(b);
        if (b.getPageIndex && b.getPageIndex() == 0) {
            var n = [];
            for (var h = 0, g = s.length; h < g; h++) {
                var r = s[h];
                if (r._state == "added") {
                    if (o) {
                        var k = o.getSelected();
                        if (k && k[o.getIdField()] == r._parentId) {
                            n.push(r)
                        }
                    } else {
                        n.push(r)
                    }
                }
            }
            n.reverse();
            a.insertRange(0, n)
        }
        var q = [];
        for (var h = a.length - 1; h >= 0; h--) {
            var r = a[h];
            var f = p[r[d]];
            if (f && f._state == "removed") {
                a.removeAt(h);
                q.push(f)
            }
        }
    },
    _getParentSource : function(e) {
        var b = this._getNameByListControl(e);
        for (var c = 0, a = this._links.length; c < a; c++) {
            var d = this._links[c];
            if (d.childName == b) {
                return this._sources[d.parentName]
            }
        }
    },
    _getLinks : function(f) {
        var c = this._getNameByListControl(f);
        var b = [];
        for (var d = 0, a = this._links.length; d < a; d++) {
            var e = this._links[d];
            if (e.parentName == c) {
                b.push(e)
            }
        }
        return b
    },
    __OnDataSelectionChanged : function(g) {
        var b = g.sender;
        var f = b.getSelected();
        var k = this._getLinks(b);
        for (var d = 0, c = k.length; d < c; d++) {
            var j = k[d];
            var a = this._sources[j.childName];
            if (f) {
                var h = {};
                h[j.parentField] = f[b.getIdField()];
                a.load(h)
            } else {
                a.loadData([])
            }
        }
    }
});