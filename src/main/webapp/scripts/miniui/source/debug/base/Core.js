mini = {
    components : {},
    uids : {},
    ux : {},
    doc : document,
    window : window,
    isReady : false,
    byClass : function(a, b) {
        if (typeof b == "string") {
            b = mini.byId(b)
        }
        return jQuery("." + a, b)[0]
    },
    getComponents : function() {
        var a = [];
        for ( var d in mini.components) {
            var b = mini.components[d];
            if (b.isControl) {
                a.push(b)
            }
        }
        return a
    },
    get : function(b) {
        if (!b) {
            return null
        }
        if (mini.isControl(b)) {
            return b
        }
        if (typeof b == "string") {
            if (b.charAt(0) == "#") {
                b = b.substr(1)
            }
        }
        if (typeof b == "string") {
            return mini.components[b]
        } else {
            var a = mini.uids[b.uid];
            if (a && a.el == b) {
                return a
            }
        }
        return null
    },
    getbyUID : function(a) {
        return mini.uids[a]
    },
    findControls : function(e, d) {
        if (!e) {
            return []
        }
        d = d || mini;
        var a = [];
        var f = mini.uids;
        for ( var c in f) {
            var g = f[c];
            var b = e.call(d, g);
            if (b === true || b === 1) {
                a.push(g);
                if (b === 1) {
                    break
                }
            }
        }
        return a
    },
    getChildControls : function(b) {
        var c = b.el ? b.el : b;
        var a = mini.findControls(function(d) {
            if (!d.el || b == d) {
                return false
            }
            if (mini.isAncestor(c, d.el) && d.within) {
                return true
            }
            return false
        });
        return a
    },
    emptyFn : function() {
    },
    createNameControls : function(h, g) {
        if (!h || !h.el) {
            return
        }
        if (!g) {
            g = "_"
        }
        var f = h.el;
        var b = mini.findControls(function(c) {
            if (!c.el || !c.name) {
                return false
            }
            if (mini.isAncestor(f, c.el)) {
                return true
            }
            return false
        });
        for (var e = 0, a = b.length; e < a; e++) {
            var j = b[e];
            var d = g + j.name;
            if (g === true) {
                d = j.name[0].toUpperCase()
                        + j.name.substring(1, j.name.length)
            }
            h[d] = j
        }
    },
    getsbyName : function(d, a) {
        var b = mini.isControl(a);
        var e = a;
        if (a && b) {
            a = a.el
        }
        a = mini.byId(a);
        a = a || document.body;
        var c = mini.findControls(function(g) {
            if (!g.el) {
                return false
            }
            if (g.name == d && mini.isAncestor(a, g.el)) {
                return true
            }
            return false
        }, this);
        if (b && c.length == 0 && e && e.getbyName) {
            var f = e.getbyName(d);
            if (f) {
                c.push(f)
            }
        }
        return c
    },
    getbyName : function(b, a) {
        return mini.getsbyName(b, a)[0]
    },
    getParams : function(b) {
        if (!b) {
            b = location.href
        }
        b = b.split("?")[1];
        var g = {};
        if (b) {
            var e = b.split("&");
            for (var d = 0, a = e.length; d < a; d++) {
                var f = e[d].split("=");
                try {
                    g[f[0]] = decodeURIComponent(unescape(f[1]))
                } catch (c) {
                }
            }
        }
        return g
    },
    reg : function(a) {
        this.components[a.id] = a;
        this.uids[a.uid] = a
    },
    unreg : function(a) {
        delete mini.components[a.id];
        delete mini.uids[a.uid]
    },
    classes : {},
    uiClasses : {},
    getClass : function(a) {
        if (!a) {
            return null
        }
        return this.classes[a.toLowerCase()]
    },
    getClassByUICls : function(a) {
        return this.uiClasses[a.toLowerCase()]
    },
    idPre : "mini-",
    idIndex : 1,
    newId : function(a) {
        return (a || this.idPre) + this.idIndex++
    },
    copyTo : function(c, b) {
        if (c && b) {
            for ( var a in b) {
                c[a] = b[a]
            }
        }
        return c
    },
    copyIf : function(c, b) {
        if (c && b) {
            for ( var a in b) {
                if (mini.isNull(c[a])) {
                    c[a] = b[a]
                }
            }
        }
        return c
    },
    createDelegate : function(b, a) {
        if (!b) {
            return function() {
            }
        }
        return function() {
            return b.apply(a, arguments)
        }
    },
    isControl : function(a) {
        return !!(a && a.isControl)
    },
    isElement : function(a) {
        return a && a.appendChild
    },
    isDate : function(a) {
        return !!(a && a.getFullYear)
    },
    isArray : function(a) {
        return !!(a && !!a.unshift)
    },
    isNull : function(a) {
        return a === null || a === undefined
    },
    isNumber : function(a) {
        return !isNaN(a) && typeof a == "number"
    },
    isEquals : function(d, c) {
        if (d !== 0 && c !== 0) {
            if ((mini.isNull(d) || d == "") && (mini.isNull(c) || c == "")) {
                return true
            }
        }
        if (d && c && d.getFullYear && c.getFullYear) {
            return d.getTime() === c.getTime()
        }
        if (typeof d == "object" && typeof c == "object") {
            return d === c
        }
        return String(d) === String(c)
    },
    forEach : function(g, f, c) {
        var d = g.clone();
        for (var b = 0, a = d.length; b < a; b++) {
            var e = d[b];
            if (f.call(c, e, b, g) === false) {
                break
            }
        }
    },
    sort : function(c, b, a) {
        a = a || c;
        c.sort(b)
    },
    removeNode : function(a) {
        jQuery(a).remove()
    },
    elWarp : document.createElement("div")
};
if (typeof mini_debugger == "undefined") {
    mini_debugger = true
}
if (typeof mini_useShims == "undefined") {
    mini_useShims = false
}
mini_regClass = function(a, b) {
    b = b.toLowerCase();
    if (!mini.classes[b]) {
        mini.classes[b] = a;
        a.prototype.type = b
    }
    var c = a.prototype.uiCls;
    if (!mini.isNull(c) && !mini.uiClasses[c]) {
        mini.uiClasses[c] = a
    }
};
mini_extend = function(e, b, f) {
    if (typeof b != "function") {
        return this
    }
    var g = e, d = g.prototype, a = b.prototype;
    if (g.superclass == a) {
        return
    }
    g.superclass = a;
    g.superclass.constructor = b;
    for ( var c in a) {
        d[c] = a[c]
    }
    if (f) {
        for ( var c in f) {
            d[c] = f[c]
        }
    }
    return g
};
mini.copyTo(mini, {
    extend : mini_extend,
    regClass : mini_regClass,
    debug : false
});
mini.namespace = function(f) {
    if (typeof f != "string") {
        return
    }
    f = f.split(".");
    var d = window;
    for (var c = 0, a = f.length; c < a; c++) {
        var b = f[c];
        var e = d[b];
        if (!e) {
            e = d[b] = {}
        }
        d = e
    }
};
mini._BindCallbacks = [];
mini._BindEvents = function(b, a) {
    mini._BindCallbacks.push([ b, a ]);
    if (!mini._EventTimer) {
        mini._EventTimer = setTimeout(function() {
            mini._FireBindEvents()
        }, 50)
    }
};
mini._FireBindEvents = function() {
    for (var b = 0, a = mini._BindCallbacks.length; b < a; b++) {
        var c = mini._BindCallbacks[b];
        c[0].call(c[1])
    }
    mini._BindCallbacks = [];
    mini._EventTimer = null
};
mini._getFunctoin = function(f) {
    if (typeof f != "string") {
        return null
    }
    var e = f.split(".");
    var d = null;
    for (var c = 0, a = e.length; c < a; c++) {
        var b = e[c];
        if (!d) {
            d = window[b]
        } else {
            d = d[b]
        }
        if (!d) {
            break
        }
    }
    return d
};
mini._getMap = function(name, obj) {
    if (!name) {
        return null
    }
    var index = name.indexOf(".");
    if (index == -1 && name.indexOf("[") == -1) {
        return obj[name]
    }
    if (index == (name.length - 1)) {
        return obj[name]
    }
    var s = "obj." + name;
    try {
        var v = eval(s)
    } catch (e) {
        return null
    }
    return v
};
mini._setMap = function(a, m, e) {
    if (!e) {
        return
    }
    if (typeof a != "string") {
        return
    }
    var k = a.split(".");
    function g(r, p, o, n) {
        var l = r[p];
        if (!l) {
            l = r[p] = []
        }
        for (var q = 0; q <= o; q++) {
            var s = l[q];
            if (!s) {
                if (n === null || n === undefined) {
                    s = l[q] = {}
                } else {
                    s = l[q] = n
                }
            }
        }
        return r[p][o]
    }
    var c = null;
    for (var f = 0, d = k.length; f <= d - 1; f++) {
        var a = k[f];
        if (f == d - 1) {
            if (a.indexOf("]") == -1) {
                e[a] = m
            } else {
                var b = a.split("[");
                var j = b[0], h = parseInt(b[1]);
                g(e, j, h, "");
                e[j][h] = m
            }
            break
        }
        if (a.indexOf("]") == -1) {
            c = e[a];
            if (f <= d - 2 && c == null) {
                e[a] = c = {}
            }
            e = c
        } else {
            var b = a.split("[");
            var j = b[0], h = parseInt(b[1]);
            e = g(e, j, h)
        }
    }
    return m
};
mini.getAndCreate = function(a) {
    if (!a) {
        return null
    }
    if (typeof a == "string") {
        return mini.components[a]
    }
    if (typeof a == "object") {
        if (mini.isControl(a)) {
            return a
        } else {
            if (mini.isElement(a)) {
                return mini.uids[a.uid]
            } else {
                return mini.create(a)
            }
        }
    }
    return null
};
mini.create = function(a) {
    if (!a) {
        return null
    }
    if (mini.get(a.id) === a) {
        return a
    }
    var b = this.getClass(a.type);
    if (!b) {
        return null
    }
    var c = new b();
    c.set(a);
    return c
};
mini.Component = function() {
    this._events = {};
    this.uid = mini.newId(this._idPre);
    this._id = this.uid;
    if (!this.id) {
        this.id = this.uid
    }
    mini.reg(this)
};
mini.Component.prototype = {
    isControl : true,
    id : null,
    _idPre : "mini-",
    _idSet : false,
    _canFire : true,
    set : function(e) {
        if (typeof e == "string") {
            return this
        }
        var d = this._allowLayout;
        this._allowLayout = false;
        var f = e.renderTo || e.render;
        delete e.renderTo;
        delete e.render;
        for ( var b in e) {
            if (b.toLowerCase().indexOf("on") == 0) {
                if (this["_$" + b]) {
                    continue
                }
                var c = e[b];
                this.on(b.substring(2, b.length).toLowerCase(), c);
                delete e[b]
            }
        }
        for ( var b in e) {
            var a = e[b];
            var h = "set" + b.charAt(0).toUpperCase()
                    + b.substring(1, b.length);
            var g = this[h];
            if (g) {
                g.call(this, a)
            } else {
                this[b] = a
            }
        }
        if (f && this.render) {
            this.render(f)
        }
        this._allowLayout = d;
        if (this.doLayout) {
            this.doLayout()
        }
        return this
    },
    fire : function(d, e) {
        if (this._canFire == false) {
            return
        }
        d = d.toLowerCase();
        var b = this._events[d];
        if (b) {
            if (!e) {
                e = {}
            }
            if (e && e != this) {
                e.source = e.sender = this;
                if (!e.type) {
                    e.type = d
                }
            }
            for (var c = 0, a = b.length; c < a; c++) {
                var f = b[c];
                if (f) {
                    f[0].apply(f[1], [ e ])
                }
            }
        }
    },
    on : function(type, fn, scope) {
        if (typeof fn == "string") {
            var f = mini._getFunctoin(fn);
            if (!f) {
                var id = mini.newId("__str_");
                window[id] = fn;
                eval("fn = function(e){var s = "
                        + id
                        + ";var fn = mini._getFunctoin(s); if(fn) {fn.call(this, e)}else{eval(s);}}")
            } else {
                fn = f
            }
        }
        if (typeof fn != "function" || !type) {
            return false
        }
        type = type.toLowerCase();
        var event = this._events[type];
        if (!event) {
            event = this._events[type] = []
        }
        scope = scope || this;
        if (!this.findListener(type, fn, scope)) {
            event.push([ fn, scope ])
        }
        return this
    },
    un : function(c, b, a) {
        if (typeof b != "function") {
            return false
        }
        c = c.toLowerCase();
        var d = this._events[c];
        if (d) {
            a = a || this;
            var e = this.findListener(c, b, a);
            if (e) {
                d.remove(e)
            }
        }
        return this
    },
    findListener : function(f, e, d) {
        f = f.toLowerCase();
        d = d || this;
        var b = this._events[f];
        if (b) {
            for (var c = 0, a = b.length; c < a; c++) {
                var g = b[c];
                if (g[0] === e && g[1] === d) {
                    return g
                }
            }
        }
    },
    setId : function(a) {
        if (!a) {
            throw new Error("id not null")
        }
        if (this._idSet) {
            throw new Error("id just set only one")
        }
        mini.unreg(this);
        this.id = a;
        if (this.el) {
            this.el.id = a
        }
        if (this._valueEl) {
            this._valueEl.id = a + "$value"
        }
        if (this._textEl) {
            this._textEl.id = a + "$text"
        }
        this._idSet = true;
        mini.reg(this)
    },
    getId : function() {
        return this.id
    },
    destroy : function() {
        mini.unreg(this);
        this.fire("destroy")
    }
};
mini.Control = function() {
    mini.Control.superclass.constructor.call(this);
    this._create();
    this.el.uid = this.uid;
    this._initEvents();
    if (this._clearBorder) {
        this.el.style.borderWidth = "0"
    }
    this.addCls(this.uiCls);
    this.setWidth(this.width);
    this.setHeight(this.height);
    this.el.style.display = this.visible ? this._displayStyle : "none"
};
mini.extend(mini.Control, mini.Component, {
    jsName : null,
    width : "",
    height : "",
    visible : true,
    readOnly : false,
    enabled : true,
    tooltip : "",
    _readOnlyCls : "mini-readonly",
    _disabledCls : "mini-disabled",
    _create : function() {
        this.el = document.createElement("div")
    },
    _initEvents : function() {
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        return false
    },
    name : "",
    setName : function(a) {
        this.name = a
    },
    getName : function() {
        return this.name
    },
    isAutoHeight : function() {
        var a = this.el.style.height;
        return a == "auto" || a == ""
    },
    isAutoWidth : function() {
        var a = this.el.style.width;
        return a == "auto" || a == ""
    },
    isFixedSize : function() {
        var b = this.width;
        var a = this.height;
        if (parseInt(b) + "px" == b && parseInt(a) + "px" == a) {
            return true
        }
        return false
    },
    isRender : function(a) {
        return !!(this.el && this.el.parentNode && this.el.parentNode.tagName)
    },
    render : function(b, a) {
        if (typeof b === "string") {
            if (b == "#body") {
                b = document.body
            } else {
                b = mini.byId(b)
            }
        }
        if (!b) {
            return
        }
        if (!a) {
            a = "append"
        }
        a = a.toLowerCase();
        if (a == "before") {
            jQuery(b).before(this.el)
        } else {
            if (a == "preend") {
                jQuery(b).preend(this.el)
            } else {
                if (a == "after") {
                    jQuery(b).after(this.el)
                } else {
                    b.appendChild(this.el)
                }
            }
        }
        this.el.id = this.id;
        this.doLayout();
        this.fire("render")
    },
    getEl : function() {
        return this.el
    },
    setJsName : function(a) {
        this.jsName = a;
        window[a] = this
    },
    getJsName : function() {
        return this.jsName
    },
    setTooltip : function(a) {
        this.tooltip = a;
        this.el.title = a;
        if (this.tooltipPlacement) {
            jQuery(this.el).attr("data-placement", this.tooltipPlacement)
        }
    },
    getTooltip : function() {
        return this.tooltip
    },
    _sizeChanged : function() {
        this.doLayout()
    },
    setWidth : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.width = a;
        this.el.style.width = a;
        this._sizeChanged()
    },
    getWidth : function(d) {
        var c = this.el;
        var a = d ? jQuery(c).width() : jQuery(c).outerWidth();
        if (d && this._borderEl) {
            var b = mini.getBorders(this._borderEl);
            a = a - b.left - b.right
        }
        return a
    },
    setHeight : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.height = a;
        this.el.style.height = a;
        this._sizeChanged()
    },
    getHeight : function(c) {
        var b = c ? jQuery(this.el).height() : jQuery(this.el).outerHeight();
        if (c && this._borderEl) {
            var a = mini.getBorders(this._borderEl);
            b = b - a.top - a.bottom
        }
        return b
    },
    getBox : function() {
        return mini.getBox(this.el)
    },
    setBorderStyle : function(b) {
        var a = this._borderEl || this.el;
        mini.setStyle(a, b);
        this.doLayout()
    },
    getBorderStyle : function() {
        return this.borderStyle
    },
    _clearBorder : true,
    setStyle : function(a) {
        this.style = a;
        mini.setStyle(this.el, a);
        if (this._clearBorder) {
            this.el.style.borderWidth = "0";
            this.el.style.padding = "0px"
        }
        this.width = this.el.style.width;
        this.height = this.el.style.height;
        this._sizeChanged()
    },
    getStyle : function() {
        return this.style
    },
    setCls : function(a) {
        this.addCls(a)
    },
    getCls : function() {
        return this.cls
    },
    addCls : function(a) {
        mini.addClass(this.el, a)
    },
    removeCls : function(a) {
        mini.removeClass(this.el, a)
    },
    _doReadOnly : function() {
        if (this.readOnly) {
            this.addCls(this._readOnlyCls)
        } else {
            this.removeCls(this._readOnlyCls)
        }
    },
    setReadOnly : function(a) {
        this.readOnly = a;
        this._doReadOnly()
    },
    getReadOnly : function() {
        return this.readOnly
    },
    getParent : function(d) {
        var b = document;
        var a = this.el.parentNode;
        while (a != b && a != null) {
            var c = mini.get(a);
            if (c) {
                if (!mini.isControl(c)) {
                    return null
                }
                if (!d || c.uiCls == d) {
                    return c
                }
            }
            a = a.parentNode
        }
        return null
    },
    isReadOnly : function() {
        if (this.readOnly || !this.enabled) {
            return true
        }
        var a = this.getParent();
        if (a) {
            return a.isReadOnly()
        }
        return false
    },
    setEnabled : function(a) {
        this.enabled = a;
        if (this.enabled) {
            this.removeCls(this._disabledCls)
        } else {
            this.addCls(this._disabledCls)
        }
        this._doReadOnly()
    },
    getEnabled : function() {
        return this.enabled
    },
    enable : function() {
        this.setEnabled(true)
    },
    disable : function() {
        this.setEnabled(false)
    },
    _displayStyle : "",
    setVisible : function(a) {
        this.visible = a;
        if (this.el) {
            this.el.style.display = a ? this._displayStyle : "none";
            this.doLayout()
        }
    },
    getVisible : function() {
        return this.visible
    },
    show : function() {
        this.setVisible(true)
    },
    hide : function() {
        this.setVisible(false)
    },
    isDisplay : function(c) {
        if (mini.WindowVisible == false || !this.el) {
            return false
        }
        var b = document.body;
        var a = this.el;
        while (1) {
            if (a == null || !a.style) {
                return false
            }
            if (a && a.style && a.style.display == "none") {
                if (c) {
                    if (c(a) !== true) {
                        return false
                    }
                } else {
                    return false
                }
            }
            if (a == b) {
                return true
            }
            a = a.parentNode
        }
        return true
    },
    _allowUpdate : true,
    beginUpdate : function() {
        this._allowUpdate = false
    },
    endUpdate : function() {
        this._allowUpdate = true;
        this.doUpdate()
    },
    doUpdate : function() {
    },
    canLayout : function() {
        if (this._allowLayout == false) {
            return false
        }
        return this.isDisplay()
    },
    doLayout : function() {
    },
    layoutChanged : function() {
        if (this.canLayout() == false) {
            return
        }
        this.doLayout()
    },
    _destroyChildren : function(d) {
        if (this.el) {
            var c = mini.getChildControls(this);
            for (var b = 0, a = c.length; b < a; b++) {
                var e = c[b];
                if (e.destroyed !== true) {
                    e.destroy(d)
                }
            }
        }
    },
    destroy : function(a) {
        if (this.destroyed !== true) {
            this._destroyChildren(a)
        }
        if (this.el) {
            mini.clearEvent(this.el);
            if (a !== false) {
                var b = this.el.parentNode;
                if (b) {
                    b.removeChild(this.el)
                }
            }
        }
        this._borderEl = null;
        this.el = null;
        mini.unreg(this);
        this.destroyed = true;
        this.fire("destroy")
    },
    focus : function() {
        try {
            var a = this;
            a.el.focus()
        } catch (b) {
        }
    },
    blur : function() {
        try {
            var a = this;
            a.el.blur()
        } catch (b) {
        }
    },
    allowAnim : true,
    setAllowAnim : function(a) {
        this.allowAnim = a
    },
    getAllowAnim : function() {
        return this.allowAnim
    },
    _getMaskWrapEl : function() {
        return this.el
    },
    mask : function(a) {
        if (typeof a == "string") {
            a = {
                html : a
            }
        }
        a = a || {};
        a.el = this._getMaskWrapEl();
        if (!a.cls) {
            a.cls = this._maskCls
        }
        mini.mask(a)
    },
    unmask : function() {
        mini.unmask(this._getMaskWrapEl());
        this.isLoading = false
    },
    _maskCls : "mini-mask-loading",
    loadingMsg : "Loading...",
    loading : function(a) {
        this.mask(a || this.loadingMsg)
    },
    setLoadingMsg : function(a) {
        this.loadingMsg = a
    },
    getLoadingMsg : function() {
        return this.loadingMsg
    },
    _getContextMenu : function(b) {
        var a = b;
        if (typeof b == "string") {
            a = mini.get(b);
            if (!a) {
                mini.parse(b);
                a = mini.get(b)
            }
        } else {
            if (mini.isArray(b)) {
                a = {
                    type : "menu",
                    items : b
                }
            } else {
                if (!mini.isControl(b)) {
                    a = mini.create(b)
                }
            }
        }
        return a
    },
    __OnHtmlContextMenu : function(b) {
        var a = {
            popupEl : this.el,
            htmlEvent : b,
            cancel : false
        };
        this.contextMenu.fire("BeforeOpen", a);
        if (a.cancel == true) {
            return
        }
        this.contextMenu.fire("opening", a);
        if (a.cancel == true) {
            return
        }
        this.contextMenu.showAtPos(b.pageX, b.pageY);
        this.contextMenu.fire("Open", a);
        return false
    },
    contextMenu : null,
    setContextMenu : function(b) {
        var a = this._getContextMenu(b);
        if (!a) {
            return
        }
        if (this.contextMenu !== a) {
            this.contextMenu = a;
            this.contextMenu.owner = this;
            mini.on(this.el, "contextmenu", this.__OnHtmlContextMenu, this)
        }
    },
    getContextMenu : function() {
        return this.contextMenu
    },
    setDefaultValue : function(a) {
        this.defaultValue = a
    },
    getDefaultValue : function() {
        return this.defaultValue
    },
    setValue : function(a) {
        this.value = a
    },
    getValue : function() {
        return this.value
    },
    ajaxData : null,
    ajaxType : "",
    setAjaxData : function(a) {
        this.ajaxData = a
    },
    getAjaxData : function() {
        return this.ajaxData
    },
    setAjaxType : function(a) {
        this.ajaxType = a
    },
    getAjaxType : function() {
        return this.ajaxType
    },
    _afterApply : function(a) {
    },
    dataField : "",
    setDataField : function(a) {
        this.dataField = a
    },
    getDataField : function() {
        return this.dataField
    },
    tabIndex : 0,
    setTabIndex : function(b) {
        var a = this._textEl || this.el;
        a.tabIndex = b;
        this.tabIndex = b
    },
    getTabIndex : function() {
        return this.tabIndex
    },
    getAttrs : function(el) {
        var attrs = {};
        var cls = el.className;
        if (cls) {
            attrs.cls = cls
        }
        if (el.value) {
            attrs.value = el.value
        }
        mini._ParseString(el, attrs, [ "id", "name", "width", "height",
                "borderStyle", "value", "defaultValue", "tabIndex",
                "contextMenu", "tooltip", "ondestroy", "data-options",
                "ajaxData", "ajaxType", "dataField", "ajaxOptions",
                "data-placement" ]);
        if (attrs["data-placement"]) {
            this.tooltipPlacement = attrs["data-placement"]
        }
        mini._ParseBool(el, attrs, [ "visible", "enabled", "readOnly" ]);
        if (el.readOnly && el.readOnly != "false") {
            attrs.readOnly = true
        }
        var style = el.style.cssText;
        if (style) {
            attrs.style = style
        }
        if (isIE9) {
            var bg = el.style.background;
            if (bg) {
                if (!attrs.style) {
                    attrs.style = ""
                }
                attrs.style += ";background:" + bg
            }
        }
        if (this.style) {
            if (attrs.style) {
                attrs.style = this.style + ";" + attrs.style
            } else {
                attrs.style = this.style
            }
        }
        if (this.borderStyle) {
            if (attrs.borderStyle) {
                attrs.borderStyle = this.borderStyle + ";" + attrs.borderStyle
            } else {
                attrs.borderStyle = this.borderStyle
            }
        }
        if (typeof attrs.ajaxOptions == "string") {
            attrs.ajaxOptions = eval("(" + attrs.ajaxOptions + ")")
        }
        var ts = mini._attrs;
        if (ts) {
            for (var i = 0, l = ts.length; i < l; i++) {
                var t = ts[i];
                var name = t[0];
                var type = t[1];
                if (!type) {
                    type = "string"
                }
                if (type == "string") {
                    mini._ParseString(el, attrs, [ name ])
                } else {
                    if (type == "bool") {
                        mini._ParseBool(el, attrs, [ name ])
                    } else {
                        if (type == "int") {
                            mini._ParseInt(el, attrs, [ name ])
                        }
                    }
                }
            }
        }
        var options = attrs["data-options"];
        if (options) {
            options = eval("(" + options + ")");
            if (options) {
                mini.copyTo(attrs, options)
            }
        }
        return attrs
    }
});
mini._attrs = null;
mini.regHtmlAttr = function(a, b) {
    if (!a) {
        return
    }
    if (!b) {
        b = "string"
    }
    if (!mini._attrs) {
        mini._attrs = []
    }
    mini._attrs.push([ a, b ])
};
__mini_setControls = function(b, f, e) {
    f = f || this._contentEl;
    e = e || this;
    if (!b) {
        b = []
    }
    if (!mini.isArray(b)) {
        b = [ b ]
    }
    for (var d = 0, a = b.length; d < a; d++) {
        var g = b[d];
        if (typeof g == "string") {
            if (g.indexOf("#") == 0) {
                g = mini.byId(g)
            }
        } else {
            if (mini.isElement(g)) {
            } else {
                g = mini.getAndCreate(g);
                g = g.el
            }
        }
        if (!g) {
            continue
        }
        mini.append(f, g)
    }
    mini.parse(f);
    e.doLayout();
    return e
};
mini.Container = function() {
    mini.Container.superclass.constructor.call(this);
    this._contentEl = this.el
};
mini.extend(mini.Container, mini.Control, {
    setControls : __mini_setControls,
    getContentEl : function() {
        return this._contentEl
    },
    getBodyEl : function() {
        return this._contentEl
    },
    within : function(f) {
        if (mini.isAncestor(this.el, f.target)) {
            return true
        }
        var b = mini.getChildControls(this);
        for (var d = 0, a = b.length; d < a; d++) {
            var g = b[d];
            if (g.within(f)) {
                return true
            }
        }
        return false
    }
});
mini.ValidatorBase = function() {
    mini.ValidatorBase.superclass.constructor.call(this)
};
mini.extend(mini.ValidatorBase, mini.Control, {
    required : false,
    requiredErrorText : "This field is required.",
    _requiredCls : "mini-required",
    errorText : "",
    _errorCls : "mini-error",
    _invalidCls : "mini-invalid",
    errorMode : "icon",
    validateOnChanged : true,
    validateOnLeave : true,
    _IsValid : true,
    isEditable : function() {
        if (this.readOnly || !this.allowInput || !this.enabled) {
            return false
        }
        return true
    },
    _tryValidate : function() {
        if (this._tryValidateTimer) {
            clearTimeout(this._tryValidateTimer)
        }
        var a = this;
        this._tryValidateTimer = setTimeout(function() {
            a.validate()
        }, 30)
    },
    validate : function() {
        if (this.enabled == false) {
            this.setIsValid(true);
            return true
        }
        var a = {
            value : this.getValue(),
            errorText : "",
            isValid : true
        };
        if (this.required) {
            if (mini.isNull(a.value) || String(a.value).trim() === "") {
                a.isValid = false;
                a.errorText = this.requiredErrorText
            }
        }
        this.fire("validation", a);
        this.errorText = a.errorText;
        this.setIsValid(a.isValid);
        return this.isValid()
    },
    isValid : function() {
        return this._IsValid
    },
    setIsValid : function(a) {
        this._IsValid = a;
        this.doUpdateValid()
    },
    getIsValid : function() {
        return this._IsValid
    },
    setValidateOnChanged : function(a) {
        this.validateOnChanged = a
    },
    getValidateOnChanged : function(a) {
        return this.validateOnChanged
    },
    setValidateOnLeave : function(a) {
        this.validateOnLeave = a
    },
    getValidateOnLeave : function(a) {
        return this.validateOnLeave
    },
    setErrorMode : function(a) {
        if (!a) {
            a = "none"
        }
        this.errorMode = a.toLowerCase();
        if (this._IsValid == false) {
            this.doUpdateValid()
        }
    },
    getErrorMode : function() {
        return this.errorMode
    },
    setErrorText : function(a) {
        this.errorText = a;
        if (this._IsValid == false) {
            this.doUpdateValid()
        }
    },
    getErrorText : function() {
        return this.errorText
    },
    setRequired : function(a) {
        this.required = a;
        if (this.required) {
            this.addCls(this._requiredCls)
        } else {
            this.removeCls(this._requiredCls)
        }
    },
    getRequired : function() {
        return this.required
    },
    setRequiredErrorText : function(a) {
        this.requiredErrorText = a
    },
    getRequiredErrorText : function() {
        return this.requiredErrorText
    },
    errorIconEl : null,
    getErrorIconEl : function() {
        return this._errorIconEl
    },
    _RemoveErrorIcon : function() {
    },
    doUpdateValid : function() {
        var a = this;
        a.__doUpdateValid()
    },
    errorTooltipPlacement : "right",
    __doUpdateValid : function() {
        if (!this.el) {
            return
        }
        this.removeCls(this._errorCls);
        this.removeCls(this._invalidCls);
        if (this._IsValid == false) {
            switch (this.errorMode) {
            case "icon":
                this.addCls(this._errorCls);
                var a = this.getErrorIconEl();
                if (a) {
                    a.title = this.errorText;
                    jQuery(a)
                            .attr("data-placement", this.errorTooltipPlacement)
                }
                break;
            case "border":
                this.addCls(this._invalidCls);
                this.el.title = this.errorText;
            default:
                this._RemoveErrorIcon();
                break
            }
        } else {
            this._RemoveErrorIcon()
        }
        this.doLayout()
    },
    doValueChanged : function() {
        this._OnValueChanged()
    },
    _OnValueChanged : function() {
        if (this.validateOnChanged) {
            this._tryValidate()
        }
        this.fire("valuechanged", {
            value : this.getValue()
        })
    },
    onValueChanged : function(b, a) {
        this.on("valuechanged", b, a)
    },
    onValidation : function(b, a) {
        this.on("validation", b, a)
    },
    getAttrs : function(b) {
        var a = mini.ValidatorBase.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "onvaluechanged", "onvalidation", "label",
                "labelStyle", "requiredErrorText", "errorMode",
                "errorTooltipPlacement" ]);
        mini._ParseBool(b, a, [ "validateOnChanged", "validateOnLeave",
                "labelField" ]);
        var d = b.getAttribute("required");
        if (!d) {
            d = b.required
        }
        if (!d) {
            var c = b.attributes.required;
            if (c) {
                d = c.value == "null" ? null : "true"
            }
        }
        if (d) {
            a.required = d != "false" ? true : false
        }
        return a
    },
    _labelLayout : function() {
        var b = this._borderEl;
        if (!b) {
            return
        }
        this._labelLayouted = true;
        if (this.labelField) {
            var a = this._labelEl.offsetWidth;
            b.style.marginLeft = a + "px";
            this._doLabelLayout = a === 0
        } else {
            b.style.marginLeft = 0
        }
    },
    _labelFieldCls : "mini-labelfield",
    labelField : false,
    label : "",
    labelStyle : "",
    setLabelField : function(a) {
        if (this.labelField != a) {
            this.labelField = a;
            if (!this._borderEl) {
                return
            }
            if (!this._labelEl) {
                this._labelEl = mini.append(this.el,
                        '<label class="mini-labelfield-label"></label>');
                this._labelEl.innerHTML = this.label;
                mini.setStyle(this._labelEl, this.labelStyle)
            }
            this._labelEl.style.display = a ? "block" : "none";
            if (a) {
                mini.addClass(this.el, this._labelFieldCls)
            } else {
                mini.removeClass(this.el, this._labelFieldCls)
            }
            this._labelLayout()
        }
    },
    getLabelField : function() {
        this.labelField
    },
    setLabel : function(a) {
        if (this.label != a) {
            this.label = a;
            if (this._labelEl) {
                this._labelEl.innerHTML = a
            }
            this._labelLayout()
        }
    },
    getLabel : function() {
        this.label
    },
    setLabelStyle : function(a) {
        if (this.labelStyle != a) {
            this.labelStyle = a;
            if (this._labelEl) {
                mini.setStyle(this._labelEl, a)
            }
            this._labelLayout()
        }
    },
    getLabelStyle : function() {
        this.labelStyle
    }
});
mini.ListControl = function() {
    this.data = [];
    this._selecteds = [];
    mini.ListControl.superclass.constructor.call(this);
    this.doUpdate()
};
mini.ListControl.ajaxType = "get";
mini.extend(mini.ListControl, mini.ValidatorBase, {
    defaultValue : "",
    value : "",
    valueField : "id",
    textField : "text",
    dataField : "",
    delimiter : ",",
    data : null,
    url : "",
    _itemCls : "mini-list-item",
    _itemHoverCls : "mini-list-item-hover",
    _itemSelectedCls : "mini-list-item-selected",
    set : function(d) {
        if (typeof d == "string") {
            return this
        }
        var c = d.value;
        delete d.value;
        var a = d.url;
        delete d.url;
        var b = d.data;
        delete d.data;
        mini.ListControl.superclass.set.call(this, d);
        if (!mini.isNull(b)) {
            this.setData(b)
        }
        if (!mini.isNull(a)) {
            this.setUrl(a)
        }
        if (!mini.isNull(c)) {
            this.setValue(c)
        }
        return this
    },
    uiCls : "mini-list",
    _create : function() {
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "click", this.__OnClick, this);
            mini_onOne(this.el, "dblclick", this.__OnDblClick, this);
            mini_onOne(this.el, "mousedown", this.__OnMouseDown, this);
            mini_onOne(this.el, "mouseup", this.__OnMouseUp, this);
            mini_onOne(this.el, "mousemove", this.__OnMouseMove, this);
            mini_onOne(this.el, "mouseover", this.__OnMouseOver, this);
            mini_onOne(this.el, "mouseout", this.__OnMouseOut, this);
            mini_onOne(this.el, "keydown", this.__OnKeyDown, this);
            mini_onOne(this.el, "keyup", this.__OnKeyUp, this);
            mini_onOne(this.el, "contextmenu", this.__OnContextMenu, this)
        }, this)
    },
    destroy : function(a) {
        if (this.el) {
            this.el.onclick = null;
            this.el.ondblclick = null;
            this.el.onmousedown = null;
            this.el.onmouseup = null;
            this.el.onmousemove = null;
            this.el.onmouseover = null;
            this.el.onmouseout = null;
            this.el.onkeydown = null;
            this.el.onkeyup = null;
            this.el.oncontextmenu = null
        }
        mini.ListControl.superclass.destroy.call(this, a)
    },
    name : "",
    setName : function(a) {
        this.name = a;
        if (this._valueEl) {
            mini.setAttr(this._valueEl, "name", this.name)
        }
    },
    getItemByEvent : function(c) {
        var b = mini.findParent(c.target, this._itemCls);
        if (b) {
            var a = parseInt(mini.getAttr(b, "index"));
            return this.data[a]
        }
    },
    addItemCls : function(c, a) {
        var b = this.getItemEl(c);
        if (b) {
            mini.addClass(b, a)
        }
    },
    removeItemCls : function(c, a) {
        var b = this.getItemEl(c);
        if (b) {
            mini.removeClass(b, a)
        }
    },
    getItemEl : function(b) {
        b = this.getItem(b);
        var a = this.data.indexOf(b);
        var c = this._createItemId(a);
        return document.getElementById(c)
    },
    _focusItem : function(b, a) {
        b = this.getItem(b);
        if (!b) {
            return
        }
        var c = this.getItemEl(b);
        if (a && c) {
            this.scrollIntoView(b)
        }
        if (this._focusedItem == b) {
            if (c) {
                mini.addClass(c, this._itemHoverCls)
            }
            return
        }
        this._blurItem();
        this._focusedItem = b;
        if (c) {
            mini.addClass(c, this._itemHoverCls)
        }
    },
    _blurItem : function() {
        if (!this._focusedItem) {
            return
        }
        var a = this.getItemEl(this._focusedItem);
        if (a) {
            mini.removeClass(a, this._itemHoverCls)
        }
        this._focusedItem = null
    },
    getFocusedItem : function() {
        var a = this._focusedItem;
        return this.indexOf(a) == -1 ? null : a
    },
    getFocusedIndex : function() {
        return this.data.indexOf(this._focusedItem)
    },
    _scrollViewEl : null,
    scrollIntoView : function(c) {
        try {
            var b = this.getItemEl(c);
            var a = this._scrollViewEl || this.el;
            mini.scrollIntoView(b, a, false)
        } catch (d) {
        }
    },
    getItem : function(a) {
        if (typeof a == "object") {
            return a
        }
        if (typeof a == "number") {
            return this.data[a]
        }
        return this.findItems(a)[0]
    },
    getCount : function() {
        return this.data.length
    },
    indexOf : function(a) {
        return this.data.indexOf(a)
    },
    getAt : function(a) {
        return this.data[a]
    },
    updateItem : function(b, a) {
        b = this.getItem(b);
        if (!b) {
            return
        }
        mini.copyTo(b, a);
        this.doUpdate()
    },
    load : function(a) {
        if (typeof a == "string") {
            this.setUrl(a)
        } else {
            this.setData(a)
        }
    },
    loadData : function(a) {
        this.setData(a)
    },
    setData : function(data) {
        if (typeof data == "string") {
            data = eval(data)
        }
        if (!mini.isArray(data)) {
            data = []
        }
        this.data = data;
        this.doUpdate();
        if (this.value != "") {
            this.deselectAll();
            var records = this.findItems(this.value);
            this.selects(records)
        }
    },
    getData : function() {
        return this.data.clone()
    },
    setUrl : function(a) {
        this.url = a;
        this._doLoad({})
    },
    getUrl : function() {
        return this.url
    },
    ajaxData : null,
    _doLoad : function(params) {
        try {
            var url = eval(this.url);
            if (url != undefined) {
                this.url = url
            }
        } catch (e) {
        }
        var url = this.url;
        var ajaxMethod = mini.ListControl.ajaxType;
        if (url) {
            if (url.indexOf(".txt") != -1 || url.indexOf(".json") != -1) {
                ajaxMethod = "get"
            }
        }
        var obj = mini._evalAjaxData(this.ajaxData, this);
        mini.copyTo(params, obj);
        var e = {
            url : this.url,
            async : false,
            type : this.ajaxType ? this.ajaxType : ajaxMethod,
            data : params,
            params : params,
            cache : false,
            cancel : false
        };
        this.fire("beforeload", e);
        if (e.data != e.params && e.params != params) {
            e.data = e.params
        }
        if (e.cancel == true) {
            return
        }
        var sf = me = this;
        var url = e.url;
        mini.copyTo(e, {
            success : function(text, textStatus, xhr) {
                delete e.params;
                var obj = {
                    text : text,
                    result : null,
                    sender : me,
                    options : e,
                    xhr : xhr
                };
                var result = null;
                try {
                    mini_doload(obj);
                    result = obj.result;
                    if (!result) {
                        result = mini.decode(text)
                    }
                } catch (ex) {
                    if (mini_debugger == true) {
                        alert(url + "\njson is error.")
                    }
                }
                if (mini.isArray(result)) {
                    result = {
                        data : result
                    }
                }
                if (sf.dataField) {
                    result.data = mini._getMap(sf.dataField, result)
                }
                if (!result.data) {
                    result.data = []
                }
                var ex = {
                    data : result.data,
                    cancel : false
                };
                sf.fire("preload", ex);
                if (ex.cancel == true) {
                    return
                }
                sf.setData(ex.data);
                sf.fire("load");
                setTimeout(function() {
                    sf.doLayout()
                }, 100)
            },
            error : function(xhr, textStatus, errorThrown) {
                var e = {
                    xhr : xhr,
                    text : xhr.responseText,
                    textStatus : textStatus,
                    errorMsg : xhr.responseText,
                    errorCode : xhr.status
                };
                if (mini_debugger == true) {
                    alert(url + "\n" + e.errorCode + "\n" + e.errorMsg)
                }
                sf.fire("loaderror", e)
            }
        });
        this._ajaxer = mini.ajax(e)
    },
    setValue : function(b) {
        if (mini.isNull(b)) {
            b = ""
        }
        if (this.value !== b) {
            this.deselectAll();
            this.value = b;
            if (this._valueEl) {
                this._valueEl.value = b
            }
            var a = this.findItems(this.value);
            this.selects(a);
            this.setSelected(a[0])
        }
    },
    getValue : function() {
        return this.value
    },
    getFormValue : function() {
        return this.value
    },
    setValueField : function(a) {
        this.valueField = a
    },
    getValueField : function() {
        return this.valueField
    },
    setTextField : function(a) {
        this.textField = a
    },
    getTextField : function() {
        return this.textField
    },
    getItemValue : function(a) {
        return String(mini._getMap(this.valueField, a))
    },
    getItemText : function(b) {
        var a = mini._getMap(this.textField, b);
        return mini.isNull(a) ? "" : String(a)
    },
    getValueAndText : function(d) {
        if (mini.isNull(d)) {
            d = []
        }
        if (!mini.isArray(d)) {
            d = this.findItems(d)
        }
        var c = [];
        var f = [];
        for (var e = 0, b = d.length; e < b; e++) {
            var a = d[e];
            if (a) {
                c.push(this.getItemValue(a));
                f.push(this.getItemText(a))
            }
        }
        return [ c.join(this.delimiter), f.join(this.delimiter) ]
    },
    findItems : function(o) {
        if (mini.isNull(o) || o === "") {
            return []
        }
        if (typeof o == "function") {
            var n = o;
            var h = [];
            var f = this.data;
            for (var d = 0, c = f.length; d < c; d++) {
                var g = f[d];
                if (n(g, d) === true) {
                    h.push(g)
                }
            }
            return h
        }
        var q = String(o).split(this.delimiter);
        var f = this.data;
        var m = {};
        for (var d = 0, c = f.length; d < c; d++) {
            var g = f[d];
            var p = g[this.valueField];
            m[p] = g
        }
        var a = [];
        for (var e = 0, b = q.length; e < b; e++) {
            var p = q[e];
            var g = m[p];
            if (g) {
                a.push(g)
            }
        }
        return a
    },
    removeAll : function() {
        var a = this.getData();
        this.removeItems(a)
    },
    addItems : function(a, b) {
        if (!mini.isArray(a)) {
            return
        }
        if (mini.isNull(b)) {
            b = this.data.length
        }
        this.data.insertRange(b, a);
        this.doUpdate()
    },
    addItem : function(b, a) {
        if (!b) {
            return
        }
        if (this.data.indexOf(b) != -1) {
            return
        }
        if (mini.isNull(a)) {
            a = this.data.length
        }
        this.data.insert(a, b);
        this.doUpdate()
    },
    removeItems : function(a) {
        if (!mini.isArray(a)) {
            return
        }
        this.data.removeRange(a);
        this._checkSelecteds();
        this.doUpdate()
    },
    removeItem : function(b) {
        var a = this.data.indexOf(b);
        if (a != -1) {
            this.data.removeAt(a);
            this._checkSelecteds();
            this.doUpdate()
        }
    },
    moveItem : function(b, a) {
        if (!b || !mini.isNumber(a)) {
            return
        }
        if (a < 0) {
            a = 0
        }
        if (a > this.data.length) {
            a = this.data.length
        }
        this.data.remove(b);
        this.data.insert(a, b);
        this.doUpdate()
    },
    _selected : null,
    _selecteds : [],
    multiSelect : false,
    _checkSelecteds : function() {
        for (var b = this._selecteds.length - 1; b >= 0; b--) {
            var a = this._selecteds[b];
            if (this.data.indexOf(a) == -1) {
                this._selecteds.removeAt(b)
            }
        }
        var c = this.getValueAndText(this._selecteds);
        this.value = c[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
    },
    setMultiSelect : function(a) {
        this.multiSelect = a
    },
    getMultiSelect : function() {
        return this.multiSelect
    },
    isSelected : function(a) {
        if (!a) {
            return false
        }
        return this._selecteds.indexOf(a) != -1
    },
    getSelecteds : function() {
        var a = this._selecteds.clone();
        var b = this;
        mini.sort(a, function(d, c) {
            var f = b.indexOf(d);
            var e = b.indexOf(c);
            if (f > e) {
                return 1
            }
            if (f < e) {
                return -1
            }
            return 0
        });
        return a
    },
    setSelected : function(a) {
        if (a) {
            this._selected = a;
            this.select(a)
        }
    },
    getSelected : function() {
        return this._selected
    },
    select : function(a) {
        a = this.getItem(a);
        if (!a) {
            return
        }
        if (this.isSelected(a)) {
            return
        }
        this.selects([ a ])
    },
    deselect : function(a) {
        a = this.getItem(a);
        if (!a) {
            return
        }
        if (!this.isSelected(a)) {
            return
        }
        this.deselects([ a ])
    },
    selectAll : function() {
        var a = this.data.clone();
        this.selects(a)
    },
    deselectAll : function() {
        this.deselects(this._selecteds)
    },
    clearSelect : function() {
        this.deselectAll()
    },
    selects : function(c) {
        if (!c || c.length == 0) {
            return
        }
        c = c.clone();
        if (this.multiSelect == false && c.length > 1) {
            c.length = 1
        }
        for (var d = 0, b = c.length; d < b; d++) {
            var a = c[d];
            if (!this.isSelected(a)) {
                this._selecteds.push(a)
            }
        }
        var e = this;
        e._doSelects()
    },
    deselects : function(b) {
        if (!b || b.length == 0) {
            return
        }
        b = b.clone();
        for (var c = b.length - 1; c >= 0; c--) {
            var a = b[c];
            if (this.isSelected(a)) {
                this._selecteds.remove(a)
            }
        }
        var d = this;
        d._doSelects()
    },
    _doSelects : function() {
        var g = this.getValueAndText(this._selecteds);
        this.value = g[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
        for (var e = 0, c = this.data.length; e < c; e++) {
            var b = this.data[e];
            var a = this.isSelected(b);
            if (a) {
                this.addItemCls(b, this._itemSelectedCls)
            } else {
                this.removeItemCls(b, this._itemSelectedCls)
            }
            var d = this.data.indexOf(b);
            var h = this._createCheckId(d);
            var f = document.getElementById(h);
            if (f) {
                f.checked = !!a
            }
        }
    },
    _OnSelectionChanged : function(b, a) {
        var c = this.getValueAndText(this._selecteds);
        this.value = c[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
        var d = {
            selecteds : this.getSelecteds(),
            selected : this.getSelected(),
            value : this.getValue()
        };
        this.fire("SelectionChanged", d)
    },
    _createCheckId : function(a) {
        return this.uid + "$ck$" + a
    },
    _createItemId : function(a) {
        return this.uid + "$" + a
    },
    __OnClick : function(a) {
        this._fireEvent(a, "Click")
    },
    __OnDblClick : function(a) {
        this._fireEvent(a, "Dblclick")
    },
    __OnMouseDown : function(a) {
        this._fireEvent(a, "MouseDown")
    },
    __OnMouseUp : function(a) {
        this._fireEvent(a, "MouseUp")
    },
    __OnMouseMove : function(a) {
        this._fireEvent(a, "MouseMove")
    },
    __OnMouseOver : function(a) {
        this._fireEvent(a, "MouseOver")
    },
    __OnMouseOut : function(a) {
        this._fireEvent(a, "MouseOut")
    },
    __OnKeyDown : function(a) {
        this._fireEvent(a, "KeyDown")
    },
    __OnKeyUp : function(a) {
        this._fireEvent(a, "KeyUp")
    },
    __OnContextMenu : function(a) {
        this._fireEvent(a, "ContextMenu")
    },
    _fireEvent : function(f, a) {
        if (!this.enabled) {
            return
        }
        var d = this.getItemByEvent(f);
        if (!d) {
            return
        }
        var c = this["_OnItem" + a];
        if (c) {
            c.call(this, d, f)
        } else {
            var b = {
                item : d,
                htmlEvent : f
            };
            this.fire("item" + a, b)
        }
    },
    _OnItemClick : function(a, c) {
        if (this.isReadOnly() || this.enabled == false || a.enabled === false) {
            c.preventDefault();
            return
        }
        var b = this.getValue();
        if (this.multiSelect) {
            if (this.isSelected(a)) {
                this.deselect(a);
                if (this._selected == a) {
                    this._selected = null
                }
            } else {
                this.select(a);
                this._selected = a
            }
            this._OnSelectionChanged()
        } else {
            if (!this.isSelected(a)) {
                this.deselectAll();
                this.select(a);
                this._selected = a;
                this._OnSelectionChanged()
            }
        }
        if (b != this.getValue()) {
            this._OnValueChanged()
        }
        var c = {
            item : a,
            htmlEvent : c
        };
        this.fire("itemclick", c)
    },
    _blurOnOut : true,
    _OnItemMouseOut : function(a, b) {
        if (!this.enabled) {
            return
        }
        if (this._blurOnOut) {
            this._blurItem()
        }
        var b = {
            item : a,
            htmlEvent : b
        };
        this.fire("itemmouseout", b)
    },
    _OnItemMouseMove : function(a, b) {
        if (!this.enabled || a.enabled === false) {
            return
        }
        this._focusItem(a);
        var b = {
            item : a,
            htmlEvent : b
        };
        this.fire("itemmousemove", b)
    },
    onItemClick : function(b, a) {
        this.on("itemclick", b, a)
    },
    onItemMouseDown : function(b, a) {
        this.on("itemmousedown", b, a)
    },
    onBeforeLoad : function(b, a) {
        this.on("beforeload", b, a)
    },
    onLoad : function(b, a) {
        this.on("load", b, a)
    },
    onLoadError : function(b, a) {
        this.on("loaderror", b, a)
    },
    onPreLoad : function(b, a) {
        this.on("preload", b, a)
    },
    getAttrs : function(b) {
        var h = mini.ListControl.superclass.getAttrs.call(this, b);
        mini._ParseString(b, h, [ "url", "data", "value", "textField",
                "valueField", "onitemclick", "onitemmousemove",
                "onselectionchanged", "onitemdblclick", "onbeforeload",
                "onload", "onloaderror", "ondataload" ]);
        mini._ParseBool(b, h, [ "multiSelect" ]);
        var j = h.valueField || this.valueField;
        var c = h.textField || this.textField;
        if (b.nodeName.toLowerCase() == "select") {
            var e = [];
            for (var f = 0, d = b.length; f < d; f++) {
                var g = b.options[f];
                var a = {};
                a[c] = g.text;
                a[j] = g.value;
                e.push(a)
            }
            if (e.length > 0) {
                h.data = e
            }
        }
        return h
    }
});
mini._Layouts = {};
mini.layout = function(b, a) {
    if (!document.body) {
        return
    }
    function c(h) {
        if (!h) {
            return
        }
        var j = mini.get(h);
        if (j) {
            if (j.doLayout) {
                if (!mini._Layouts[j.uid]) {
                    mini._Layouts[j.uid] = j;
                    if (a !== false || j.isFixedSize() == false) {
                        j.doLayout(false)
                    }
                    delete mini._Layouts[j.uid]
                }
            }
        } else {
            var g = h.childNodes;
            if (g) {
                for (var e = 0, d = g.length; e < d; e++) {
                    var f = g[e];
                    c(f)
                }
            }
        }
    }
    if (!b) {
        b = document.body
    }
    c(b);
    if (b == document.body) {
        mini.layoutIFrames()
    }
};
mini.applyTo = function(b) {
    b = mini.byId(b);
    if (!b) {
        return this
    }
    if (mini.get(b)) {
        throw new Error("not applyTo a mini control")
    }
    var a = this.getAttrs(b);
    delete a._applyTo;
    if (mini.isNull(a.defaultValue) && !mini.isNull(a.value)) {
        a.defaultValue = a.value
    }
    if (mini.isNull(a.defaultText) && !mini.isNull(a.text)) {
        a.defaultText = a.text
    }
    var c = b.parentNode;
    if (c && this.el != b) {
        c.replaceChild(this.el, b)
    }
    this.set(a);
    this._afterApply(b);
    return this
};
mini._doParse = function(b) {
    if (!b) {
        return
    }
    var m = b.nodeName.toLowerCase();
    if (!m) {
        return
    }
    var j = String(b.className);
    if (j) {
        var f = mini.get(b);
        if (!f) {
            var d = j.split(" ");
            for (var g = 0, e = d.length; g < e; g++) {
                var n = d[g];
                var h = mini.getClassByUICls(n);
                if (h) {
                    mini.removeClass(b, n);
                    var k = new h();
                    mini.applyTo.call(k, b);
                    b = k.el;
                    break
                }
            }
        }
    }
    if (m == "select" || mini.hasClass(b, "mini-menu")
            || mini.hasClass(b, "mini-datagrid")
            || mini.hasClass(b, "mini-treegrid")
            || mini.hasClass(b, "mini-tree") || mini.hasClass(b, "mini-button")
            || mini.hasClass(b, "mini-textbox")
            || mini.hasClass(b, "mini-buttonedit")) {
        return
    }
    var a = mini.getChildNodes(b, true);
    for (var g = 0, e = a.length; g < e; g++) {
        var c = a[g];
        if (c.nodeType == 1) {
            if (c.parentNode == b) {
                mini._doParse(c)
            }
        }
    }
};
mini._Removes = [];
mini._firstParse = true;
mini.parse = function(e, j) {
    if (mini._firstParse) {
        mini._firstParse = false;
        var m = document.getElementsByTagName("iframe");
        var c = [];
        for (var h = 0, g = m.length; h < g; h++) {
            var k = m[h];
            c.push(k)
        }
        for (var h = 0, g = c.length; h < g; h++) {
            var k = c[h];
            var a = $(k).attr("src");
            if (!a) {
                continue
            }
            k.loaded = false;
            k._onload = k.onload;
            k._src = a;
            k.onload = function() {
            };
            k.src = ""
        }
        setTimeout(function() {
            for (var o = 0, n = c.length; o < n; o++) {
                var p = c[o];
                if (p._src && $(p).attr("src") == "") {
                    p.loaded = true;
                    p.onload = p._onload;
                    p.src = p._src;
                    p._src = p._onload = null
                }
            }
        }, 20)
    }
    if (typeof e == "string") {
        var b = e;
        e = mini.byId(b);
        if (!e) {
            e = document.body
        }
    }
    if (e && !mini.isElement(e)) {
        e = e.el
    }
    if (!e) {
        e = document.body
    }
    var f = mini.WindowVisible;
    if (isIE) {
        mini.WindowVisible = false
    }
    mini._doParse(e);
    mini.WindowVisible = f;
    if (j !== false) {
        mini.layout(e)
    }
};
mini._ParseString = function(e, c, b) {
    for (var d = 0, a = b.length; d < a; d++) {
        var g = b[d];
        var f = mini.getAttr(e, g);
        if (f) {
            c[g] = f
        }
    }
};
mini._ParseBool = function(e, c, b) {
    for (var d = 0, a = b.length; d < a; d++) {
        var g = b[d];
        var f = mini.getAttr(e, g);
        if (f) {
            c[g] = f == "true" ? true : false
        }
    }
};
mini._ParseInt = function(e, c, b) {
    for (var d = 0, a = b.length; d < a; d++) {
        var g = b[d];
        var f = parseInt(mini.getAttr(e, g));
        if (!isNaN(f)) {
            c[g] = f
        }
    }
};
mini._ParseColumns = function(el) {
    var columns = [];
    var cs = mini.getChildNodes(el);
    for (var i = 0, l = cs.length; i < l; i++) {
        var node = cs[i];
        var jq = jQuery(node);
        var column = {};
        var editor = null, filter = null;
        var subCs = mini.getChildNodes(node);
        if (subCs) {
            for (var ii = 0, li = subCs.length; ii < li; ii++) {
                var subNode = subCs[ii];
                var property = jQuery(subNode).attr("property");
                if (!property) {
                    continue
                }
                property = property.toLowerCase();
                if (property == "columns") {
                    column.columns = mini._ParseColumns(subNode);
                    jQuery(subNode).remove()
                }
                if (property == "editor" || property == "filter") {
                    var className = subNode.className;
                    var classes = className.split(" ");
                    for (var i3 = 0, l3 = classes.length; i3 < l3; i3++) {
                        var cls = classes[i3];
                        var clazz = mini.getClassByUICls(cls);
                        if (clazz) {
                            var ui = new clazz();
                            if (property == "filter") {
                                filter = ui.getAttrs(subNode);
                                filter.type = ui.type
                            } else {
                                editor = ui.getAttrs(subNode);
                                editor.type = ui.type
                            }
                            break
                        }
                    }
                    jQuery(subNode).remove()
                }
            }
        }
        column.header = node.innerHTML;
        mini._ParseString(node, column, [ "name", "header", "field", "editor",
                "filter", "renderer", "width", "type", "renderer",
                "headerAlign", "align", "headerCls", "cellCls", "headerStyle",
                "cellStyle", "displayField", "dateFormat", "listFormat",
                "mapFormat", "trueValue", "falseValue", "dataType", "vtype",
                "currencyUnit", "summaryType", "summaryRenderer",
                "groupSummaryType", "groupSummaryRenderer", "defaultValue",
                "defaultText", "decimalPlaces", "data-options" ]);
        mini._ParseBool(node, column, [ "visible", "readOnly", "allowSort",
                "allowResize", "allowMove", "allowDrag", "autoShowPopup",
                "unique", "autoEscape", "enabled", "hideable" ]);
        if (editor) {
            column.editor = editor
        }
        if (filter) {
            column.filter = filter
        }
        if (column.dataType) {
            column.dataType = column.dataType.toLowerCase()
        }
        if (column.defaultValue === "true") {
            column.defaultValue = true
        }
        if (column.defaultValue === "false") {
            column.defaultValue = false
        }
        columns.push(column);
        var options = column["data-options"];
        if (options) {
            options = eval("(" + options + ")");
            if (options) {
                mini.copyTo(column, options)
            }
        }
    }
    return columns
};
mini._Columns = {};
mini._getColumn = function(b) {
    var a = mini._Columns[b.toLowerCase()];
    if (!a) {
        return {}
    }
    return a()
};
mini.IndexColumn = function(a) {
    return mini.copyTo({
        width : 30,
        cellCls : "",
        align : "center",
        draggable : false,
        allowDrag : true,
        hideable : true,
        init : function(b) {
            b.on("addrow", this.__OnIndexChanged, this);
            b.on("removerow", this.__OnIndexChanged, this);
            b.on("moverow", this.__OnIndexChanged, this);
            if (b.isTree) {
                b.on("addnode", this.__OnIndexChanged, this);
                b.on("removenode", this.__OnIndexChanged, this);
                b.on("movenode", this.__OnIndexChanged, this);
                b.on("loadnode", this.__OnIndexChanged, this);
                this._gridUID = b.uid;
                this._rowIdField = "_id"
            }
        },
        getNumberId : function(b) {
            return this._gridUID + "$number$" + b[this._rowIdField]
        },
        createNumber : function(b, c) {
            if (mini.isNull(b.pageIndex)) {
                return c + 1
            } else {
                return (b.pageIndex * b.pageSize) + c + 1
            }
        },
        renderer : function(d) {
            var b = d.sender;
            if (this.draggable) {
                if (!d.cellStyle) {
                    d.cellStyle = ""
                }
                d.cellStyle += ";cursor:move;"
            }
            var c = '<div id="' + this.getNumberId(d.record) + '">';
            if (mini.isNull(b.getPageIndex)) {
                c += d.rowIndex + 1
            } else {
                c += (b.getPageIndex() * b.getPageSize()) + d.rowIndex + 1
            }
            c += "</div>";
            return c
        },
        __OnIndexChanged : function(j) {
            var h = j.sender;
            var f = h.getDataView();
            for (var g = 0, c = f.length; g < c; g++) {
                var b = f[g];
                var k = this.getNumberId(b);
                var d = document.getElementById(k);
                if (d) {
                    d.innerHTML = this.createNumber(h, g)
                }
            }
        }
    }, a)
};
mini._Columns.indexcolumn = mini.IndexColumn;
mini.CheckColumn = function(a) {
    return mini
            .copyTo(
                    {
                        width : 30,
                        cellCls : "mini-checkcolumn",
                        headerCls : "mini-checkcolumn",
                        hideable : true,
                        _multiRowSelect : true,
                        header : function(c) {
                            var d = this.uid + "checkall";
                            var b = '<input type="checkbox" id="' + d + '" />';
                            if (this.multiSelect == false) {
                                b = ""
                            }
                            return b
                        },
                        getCheckId : function(b, c) {
                            return this._gridUID + "$checkcolumn$"
                                    + b[this._rowIdField] + "$" + c._id
                        },
                        init : function(b) {
                            b.on("selectionchanged", this.__OnSelectionChanged,
                                    this);
                            b.on("HeaderCellClick", this.__OnHeaderCellClick,
                                    this)
                        },
                        renderer : function(g) {
                            var h = this.getCheckId(g.record, g.column);
                            var f = g.sender.isSelected ? g.sender
                                    .isSelected(g.record) : false;
                            var d = "checkbox";
                            var c = g.sender;
                            if (c.getMultiSelect() == false) {
                                d = "radio"
                            }
                            var b = '<input type="'
                                    + d
                                    + '" id="'
                                    + h
                                    + '" '
                                    + (f ? "checked" : "")
                                    + ' hidefocus style="outline:none;" onclick="return false"/>';
                            b += '<div class="mini-grid-radio-mask"></div>';
                            return b
                        },
                        __OnHeaderCellClick : function(f) {
                            var c = f.sender;
                            if (f.column != this) {
                                return
                            }
                            var g = c.uid + "checkall";
                            var b = document.getElementById(g);
                            if (b) {
                                if (c.getMultiSelect()) {
                                    if (b.checked) {
                                        c.deselectAll();
                                        var d = c.getDataView();
                                        c.selects(d)
                                    } else {
                                        c.deselectAll()
                                    }
                                } else {
                                    c.deselectAll();
                                    if (b.checked) {
                                        c.select(0)
                                    }
                                }
                                c.fire("checkall")
                            }
                        },
                        __OnSelectionChanged : function(j) {
                            var b = j.sender;
                            var d = b.toArray();
                            var k = this;
                            for (var g = 0, f = d.length; g < f; g++) {
                                var h = d[g];
                                var m = b.isSelected(h);
                                var c = k.getCheckId(h, k);
                                var n = document.getElementById(c);
                                if (n) {
                                    n.checked = m
                                }
                            }
                            if (!this._timer) {
                                this._timer = setTimeout(function() {
                                    k._doCheckState(b);
                                    k._timer = null
                                }, 10)
                            }
                        },
                        _doCheckState : function(c) {
                            var e = c.uid + "checkall";
                            var b = document.getElementById(e);
                            if (b && c._getSelectAllCheckState) {
                                var d = c._getSelectAllCheckState();
                                if (d == "has") {
                                    b.indeterminate = true;
                                    b.checked = true
                                } else {
                                    b.indeterminate = false;
                                    b.checked = d
                                }
                            }
                        }
                    }, a)
};
mini._Columns.checkcolumn = mini.CheckColumn;
mini.ExpandColumn = function(a) {
    return mini
            .copyTo(
                    {
                        width : 30,
                        headerAlign : "center",
                        align : "center",
                        draggable : false,
                        cellStyle : "padding:0",
                        cellCls : "mini-grid-expandCell",
                        hideable : true,
                        renderer : function(b) {
                            return '<a class="mini-grid-ecIcon" href="javascript:#" onclick="return false"></a>'
                        },
                        init : function(b) {
                            b.on("cellclick", this.__OnCellClick, this)
                        },
                        __OnCellClick : function(d) {
                            var c = d.sender;
                            if (d.column == this && c.isShowRowDetail) {
                                if (mini.findParent(d.htmlEvent.target,
                                        "mini-grid-ecIcon")) {
                                    var b = c.isShowRowDetail(d.record);
                                    if (!b) {
                                        d.cancel = false;
                                        c.fire("beforeshowrowdetail", d);
                                        if (d.cancel === true) {
                                            return
                                        }
                                    } else {
                                        d.cancel = false;
                                        c.fire("beforehiderowdetail", d);
                                        if (d.cancel === true) {
                                            return
                                        }
                                    }
                                    if (c.autoHideRowDetail) {
                                        c.hideAllRowDetail()
                                    }
                                    if (b) {
                                        c.hideRowDetail(d.record)
                                    } else {
                                        c.showRowDetail(d.record)
                                    }
                                }
                            }
                        }
                    }, a)
};
mini._Columns.expandcolumn = mini.ExpandColumn;
mini.CheckBoxColumn = function(a) {
    return mini
            .copyTo(
                    {
                        _type : "checkboxcolumn",
                        header : "",
                        headerAlign : "center",
                        cellCls : "mini-checkcolumn",
                        trueValue : true,
                        falseValue : false,
                        readOnly : false,
                        getCheckId : function(b, c) {
                            return this._gridUID + "$checkbox$"
                                    + b[this._rowIdField] + "$" + c._id
                        },
                        getCheckBoxEl : function(b, c) {
                            return document.getElementById(this
                                    .getCheckId(b, c))
                        },
                        renderer : function(f) {
                            var g = this.getCheckId(f.record, f.column);
                            var b = mini._getMap(f.field, f.record);
                            var d = b == this.trueValue ? true : false;
                            var c = "checkbox";
                            return '<input type="'
                                    + c
                                    + '" id="'
                                    + g
                                    + '" '
                                    + (d ? "checked" : "")
                                    + ' hidefocus style="outline:none;" onclick="return false;"/>'
                        },
                        init : function(e) {
                            this.grid = e;
                            function b(i) {
                                if (e.isReadOnly() || this.readOnly) {
                                    return
                                }
                                i.value = mini._getMap(i.field, i.record);
                                e.fire("cellbeginedit", i);
                                if (i.cancel !== true) {
                                    var g = mini._getMap(i.column.field,
                                            i.record);
                                    var h = g == this.trueValue ? this.falseValue
                                            : this.trueValue;
                                    if (e._OnCellCommitEdit) {
                                        e._OnCellCommitEdit(i.record, i.column,
                                                h);
                                        e._OnCellEndEdit(i.record, i.column)
                                    }
                                }
                            }
                            function d(h) {
                                if (h.column == this) {
                                    var i = this.getCheckId(h.record, h.column);
                                    var g = h.htmlEvent.target;
                                    if (g.id == i) {
                                        if (e.allowCellEdit) {
                                            h.cancel = false;
                                            b.call(this, h)
                                        } else {
                                            if (this.readOnly) {
                                                return
                                            }
                                            h.value = mini._getMap(
                                                    h.column.field, h.record);
                                            e.fire("cellbeginedit", h);
                                            if (h.cancel == true) {
                                                return
                                            }
                                            if (e.isEditingRow
                                                    && e.isEditingRow(h.record)) {
                                                setTimeout(function() {
                                                    g.checked = !g.checked
                                                }, 1)
                                            }
                                        }
                                    }
                                }
                            }
                            e.on("cellclick", d, this);
                            mini.on(this.grid.el, "keydown", function(h) {
                                if (h.keyCode == 32 && e.allowCellEdit) {
                                    var i = e.getCurrentCell();
                                    if (!i) {
                                        return
                                    }
                                    if (i[1] != this) {
                                        return
                                    }
                                    var g = {
                                        record : i[0],
                                        column : i[1]
                                    };
                                    g.field = g.column.field;
                                    b.call(this, g);
                                    h.preventDefault()
                                }
                            }, this);
                            var c = parseInt(this.trueValue), f = parseInt(this.falseValue);
                            if (!isNaN(c)) {
                                this.trueValue = c
                            }
                            if (!isNaN(f)) {
                                this.falseValue = f
                            }
                        }
                    }, a)
};
mini._Columns.checkboxcolumn = mini.CheckBoxColumn;
mini.RadioButtonColumn = function(a) {
    return mini
            .copyTo(
                    {
                        _type : "radiobuttoncolumn",
                        header : "",
                        headerAlign : "center",
                        cellCls : "mini-checkcolumn",
                        trueValue : true,
                        falseValue : false,
                        readOnly : false,
                        getCheckId : function(b, c) {
                            return this._gridUID + "$radio$"
                                    + b[this._rowIdField] + "$" + c._id
                        },
                        getCheckBoxEl : function(b, c) {
                            return document.getElementById(this
                                    .getCheckId(b, c))
                        },
                        renderer : function(g) {
                            var b = g.sender;
                            var d = this.getCheckId(g.record, g.column);
                            var j = mini._getMap(g.field, g.record);
                            var i = j == this.trueValue ? true : false;
                            var h = "radio";
                            var c = b._id + g.column.field;
                            var f = "";
                            var k = '<div style="position:relative;">';
                            k += '<input name="'
                                    + c
                                    + '" type="'
                                    + h
                                    + '" id="'
                                    + d
                                    + '" '
                                    + (i ? "checked" : "")
                                    + ' hidefocus style="outline:none;" onclick="return false;" style="position:relative;z-index:1;"/>';
                            if (!b.allowCellEdit) {
                                if (!b.isEditingRow(g.record)) {
                                    k += '<div class="mini-grid-radio-mask"></div>'
                                }
                            }
                            k += "</div>";
                            return k
                        },
                        init : function(e) {
                            this.grid = e;
                            function b(n) {
                                if (e.isReadOnly() || this.readOnly) {
                                    return
                                }
                                n.value = mini._getMap(n.field, n.record);
                                e.fire("cellbeginedit", n);
                                if (n.cancel !== true) {
                                    var h = mini._getMap(n.column.field,
                                            n.record);
                                    if (h == this.trueValue) {
                                        return
                                    }
                                    var m = h == this.trueValue ? this.falseValue
                                            : this.trueValue;
                                    var k = e.getData();
                                    for (var j = 0, g = k.length; j < g; j++) {
                                        var o = k[j];
                                        if (o == n.record) {
                                            continue
                                        }
                                        var h = mini._getMap(n.column.field, o);
                                        if (h != this.falseValue) {
                                            e.updateRow(o, n.column.field,
                                                    this.falseValue)
                                        }
                                    }
                                    if (e._OnCellCommitEdit) {
                                        e._OnCellCommitEdit(n.record, n.column,
                                                m)
                                    }
                                }
                            }
                            function d(i) {
                                if (i.column == this) {
                                    var j = this.getCheckId(i.record, i.column);
                                    var g = i.htmlEvent.target;
                                    if (g.id == j) {
                                        if (e.allowCellEdit) {
                                            i.cancel = false;
                                            b.call(this, i)
                                        } else {
                                            if (e.isEditingRow
                                                    && e.isEditingRow(i.record)) {
                                                var h = this;
                                                setTimeout(
                                                        function() {
                                                            g.checked = true;
                                                            var p = e.getData();
                                                            for (var n = 0, k = p.length; n < k; n++) {
                                                                var s = p[n];
                                                                if (s == i.record) {
                                                                    continue
                                                                }
                                                                var q = i.column.field;
                                                                var m = mini
                                                                        ._getMap(
                                                                                q,
                                                                                s);
                                                                if (m != h.falseValue) {
                                                                    if (s != i.record) {
                                                                        if (e._dataSource) {
                                                                            mini
                                                                                    ._setMap(
                                                                                            i.column.field,
                                                                                            h.falseValue,
                                                                                            s);
                                                                            e._dataSource
                                                                                    ._setModified(
                                                                                            s,
                                                                                            q,
                                                                                            m)
                                                                        } else {
                                                                            var r = {};
                                                                            mini
                                                                                    ._setMap(
                                                                                            q,
                                                                                            h.falseValue,
                                                                                            r);
                                                                            e
                                                                                    ._doUpdateRow(
                                                                                            s,
                                                                                            r)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }, 1)
                                            }
                                        }
                                    }
                                }
                            }
                            e.on("cellclick", d, this);
                            mini.on(this.grid.el, "keydown", function(h) {
                                if (h.keyCode == 32 && e.allowCellEdit) {
                                    var i = e.getCurrentCell();
                                    if (!i) {
                                        return
                                    }
                                    if (i[1] != this) {
                                        return
                                    }
                                    var g = {
                                        record : i[0],
                                        column : i[1]
                                    };
                                    g.field = g.column.field;
                                    b.call(this, g);
                                    h.preventDefault()
                                }
                            }, this);
                            var c = parseInt(this.trueValue), f = parseInt(this.falseValue);
                            if (!isNaN(c)) {
                                this.trueValue = c
                            }
                            if (!isNaN(f)) {
                                this.falseValue = f
                            }
                        }
                    }, a)
};
mini._Columns.radiobuttoncolumn = mini.RadioButtonColumn;
mini.ComboBoxColumn = function(a) {
    return mini.copyTo({
        renderer : function(p) {
            var q = !mini.isNull(p.value) ? String(p.value) : "";
            var r = q.split(",");
            var t = "id", h = "text";
            var j = {};
            var n = p.column.editor;
            if (n && n.type == "combobox") {
                var d = this.__editor;
                if (!d) {
                    if (mini.isControl(n)) {
                        d = n
                    } else {
                        n = mini.clone(n);
                        d = mini.create(n)
                    }
                    this.__editor = d
                }
                t = d.getValueField();
                h = d.getTextField();
                j = this._valueMaps;
                if (!j) {
                    j = {};
                    var m = d.getData();
                    for (var k = 0, g = m.length; k < g; k++) {
                        var c = m[k];
                        j[c[t]] = c
                    }
                    this._valueMaps = j
                }
            }
            var f = [];
            for (var k = 0, g = r.length; k < g; k++) {
                var b = r[k];
                var c = j[b];
                if (c) {
                    var s = c[h];
                    if (s === null || s === undefined) {
                        s = ""
                    }
                    f.push(s)
                }
            }
            return f.join(",")
        }
    }, a)
};
mini._Columns.comboboxcolumn = mini.ComboBoxColumn;
mini._Resizer = function(a) {
    this.owner = a;
    mini.on(this.owner.el, "mousedown", this.__OnMouseDown, this)
};
mini._Resizer.prototype = {
    __OnMouseDown : function(c) {
        var a = mini.hasClass(c.target, "mini-resizer-trigger");
        if (a && this.owner.allowResize) {
            var b = this._getResizeDrag();
            b.start(c)
        }
    },
    _getResizeDrag : function() {
        if (!this._resizeDragger) {
            this._resizeDragger = new mini.Drag({
                capture : true,
                onStart : mini.createDelegate(this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove, this),
                onStop : mini.createDelegate(this._OnDragStop, this)
            })
        }
        return this._resizeDragger
    },
    _OnDragStart : function(a) {
        this.mask = mini.append(document.body,
                '<div class="mini-resizer-mask mini-fixed"></div>');
        this.proxy = mini.append(document.body,
                '<div class="mini-resizer-proxy"></div>');
        this.proxy.style.cursor = "se-resize";
        this.elBox = mini.getBox(this.owner.el);
        mini.setBox(this.proxy, this.elBox)
    },
    _OnDragMove : function(e) {
        var b = this.owner;
        var d = e.now[0] - e.init[0];
        var f = e.now[1] - e.init[1];
        var a = this.elBox.width + d;
        var c = this.elBox.height + f;
        if (a < b.minWidth) {
            a = b.minWidth
        }
        if (c < b.minHeight) {
            c = b.minHeight
        }
        if (a > b.maxWidth) {
            a = b.maxWidth
        }
        if (c > b.maxHeight) {
            c = b.maxHeight
        }
        mini.setSize(this.proxy, a, c)
    },
    _OnDragStop : function(a, c) {
        if (!this.proxy) {
            return
        }
        var b = mini.getBox(this.proxy);
        jQuery(this.mask).remove();
        jQuery(this.proxy).remove();
        this.proxy = null;
        this.elBox = null;
        if (c) {
            this.owner.setWidth(b.width);
            this.owner.setHeight(b.height);
            this.owner.fire("resize")
        }
    }
};
mini._topWindow = null;
mini._getTopWindow = function(a) {
    if (mini._topWindow) {
        return mini._topWindow
    }
    var c = [];
    function b(e) {
        try {
            e.___try = 1;
            c.push(e)
        } catch (d) {
        }
        if (e.parent && e.parent != e) {
            b(e.parent)
        }
    }
    b(window);
    mini._topWindow = c[c.length - 1];
    return mini._topWindow
};
var __ps = mini.getParams();
if (__ps._winid) {
    try {
        window.Owner = mini._getTopWindow()[__ps._winid]
    } catch (ex) {
    }
}
mini._WindowID = "w" + Math.floor(Math.random() * 10000);
mini._getTopWindow()[mini._WindowID] = window;
mini.__IFrameCreateCount = 1;
mini.createIFrame = function(c, j) {
    var d = "__iframe_onload" + mini.__IFrameCreateCount++;
    window[d] = e;
    if (!c) {
        c = ""
    }
    var i = c.split("#");
    c = i[0];
    var l = "_t=" + Math.floor(Math.random() * 1000000);
    if (c.indexOf("?") == -1) {
        c += "?" + l
    } else {
        c += "&" + l
    }
    if (c && c.indexOf("_winid") == -1) {
        var l = "_winid=" + mini._WindowID;
        if (c.indexOf("?") == -1) {
            c += "?" + l
        } else {
            c += "&" + l
        }
    }
    if (i[1]) {
        c = c + "#" + i[1]
    }
    var k = c.indexOf(".mht") != -1;
    var a = k ? c : "";
    var m = '<iframe src="' + a + '" style="width:100%;height:100%;" onload="'
            + d + '()"  frameborder="0"></iframe>';
    var b = document.createElement("div");
    var g = mini.append(b, m);
    var f = false;
    if (k) {
        f = true
    } else {
        setTimeout(function() {
            if (g) {
                g.src = c;
                f = true
            }
        }, 5)
    }
    var h = true;
    function e() {
        if (f == false) {
            return
        }
        setTimeout(function() {
            if (j) {
                j(g, h)
            }
            h = false
        }, 1)
    }
    g._ondestroy = function() {
        window[d] = mini.emptyFn;
        g.src = "";
        try {
            g.contentWindow.document.write("");
            g.contentWindow.document.close()
        } catch (n) {
        }
        g._ondestroy = null;
        g = null
    };
    return g
};
mini._doOpen = function(c) {
    if (typeof c == "string") {
        c = {
            url : c
        }
    }
    c = mini.copyTo({
        width : 700,
        height : 400,
        allowResize : true,
        allowModal : true,
        closeAction : "destroy",
        title : "",
        titleIcon : "",
        iconCls : "",
        iconStyle : "",
        bodyStyle : "padding: 0",
        url : "",
        showCloseButton : true,
        showFooter : false
    }, c);
    c.closeAction = "destroy";
    var i = c.onload;
    delete c.onload;
    var g = c.ondestroy;
    delete c.ondestroy;
    var b = c.url;
    delete c.url;
    var e = mini.getViewportBox();
    if (c.width && String(c.width).indexOf("%") != -1) {
        var a = parseInt(c.width);
        c.width = parseInt(e.width * (a / 100))
    }
    if (c.height && String(c.height).indexOf("%") != -1) {
        var d = parseInt(c.height);
        c.height = parseInt(e.height * (d / 100))
    }
    var f = new mini.Window();
    f.set(c);
    f.load(b, i, g);
    f.show();
    return f
};
mini.open = function(b) {
    if (!b) {
        return
    }
    var a = b.url;
    if (!a) {
        a = ""
    }
    var f = a.split("#");
    var a = f[0];
    if (a && a.indexOf("_winid") == -1) {
        var c = "_winid=" + mini._WindowID;
        if (a.indexOf("?") == -1) {
            a += "?" + c
        } else {
            a += "&" + c
        }
        if (f[1]) {
            a = a + "#" + f[1]
        }
    }
    b.url = a;
    b.Owner = window;
    var g = [];
    function d(i) {
        try {
            if (i.mini) {
                g.push(i)
            }
            if (i.parent && i.parent != i) {
                d(i.parent)
            }
        } catch (h) {
        }
    }
    d(window);
    var e = g[g.length - 1];
    return e.mini._doOpen(b)
};
mini.openTop = mini.open;
mini._getResult = function(a, b, g, f, e, k) {
    var i = null;
    var h = mini.getText(a, b, function(m, l) {
        i = l;
        if (g) {
            if (g) {
                g(m, l)
            }
        }
    }, f, e);
    var c = {
        text : h,
        result : null,
        sender : {
            type : ""
        },
        options : {
            url : a,
            data : b,
            type : e
        },
        xhr : i
    };
    var j = null;
    try {
        mini_doload(c);
        j = c.result;
        if (!j) {
            j = mini.decode(h)
        }
    } catch (d) {
        if (mini_debugger == true) {
            alert(a + "\njson is error")
        }
    }
    if (!mini.isArray(j) && k) {
        j = mini._getMap(k, j)
    }
    if (mini.isArray(j)) {
        j = {
            data : j
        }
    }
    return j ? j.data : null
};
mini.getData = function(b, g, f, a, c) {
    var e = mini.getText(b, g, f, a, c);
    var d = mini.decode(e);
    return d
};
mini.getText = function(b, f, e, a, c) {
    var d = null;
    mini.ajax({
        url : b,
        data : f,
        async : false,
        type : c ? c : "get",
        cache : false,
        dataType : "text",
        success : function(h, i, g) {
            d = h;
            if (e) {
                e(h, g)
            }
        },
        error : a
    });
    return d
};
if (!window.mini_RootPath) {
    mini_RootPath = "/"
}
mini_CreateJSPath = function(g) {
    var a = document.getElementsByTagName("script");
    var f = "";
    for (var e = 0, b = a.length; e < b; e++) {
        var h = a[e].src;
        if (h.indexOf(g) != -1) {
            var d = h.split(g);
            f = d[0];
            break
        }
    }
    var c = location.href;
    c = c.split("#")[0];
    c = c.split("?")[0];
    var d = c.split("/");
    d.length = d.length - 1;
    c = d.join("/");
    if (f.indexOf("http:") == -1 && f.indexOf("file:") == -1) {
        f = c + "/" + f
    }
    return f
};
if (!window.mini_JSPath) {
    mini_JSPath = mini_CreateJSPath("miniui.js")
}
mini.update = function(a, c) {
    if (typeof a == "string") {
        a = {
            url : a
        }
    }
    if (c) {
        a.el = c
    }
    var b = mini.loadText(a.url);
    mini.innerHTML(a.el, b);
    mini.parse(a.el)
};
mini.createSingle = function(a) {
    if (typeof a == "string") {
        a = mini.getClass(a)
    }
    if (typeof a != "function") {
        return
    }
    var b = a.single;
    if (!b) {
        b = a.single = new a()
    }
    return b
};
mini.createTopSingle = function(b) {
    if (typeof b != "function") {
        return
    }
    var a = b.prototype.type;
    if (top && top != window && top.mini && top.mini.getClass(a)) {
        return top.mini.createSingle(a)
    } else {
        return mini.createSingle(b)
    }
};
mini.sortTypes = {
    string : function(a) {
        return String(a).toUpperCase()
    },
    date : function(a) {
        if (!a) {
            return 0
        }
        if (mini.isDate(a)) {
            return a.getTime()
        }
        return mini.parseDate(String(a))
    },
    "float" : function(a) {
        var b = parseFloat(String(a).replace(/,/g, ""));
        return isNaN(b) ? 0 : b
    },
    "int" : function(a) {
        var b = parseInt(String(a).replace(/,/g, ""), 10);
        return isNaN(b) ? 0 : b
    },
    currency : function(a) {
        var b = parseFloat(String(a).replace(/,/g, ""));
        return isNaN(b) ? 0 : b
    }
};
mini._ValidateVType = function(b, k, d, p) {
    var j = b.split(";");
    for (var c = 0, a = j.length; c < a; c++) {
        var b = j[c].trim();
        var m = b.split(":");
        var n = m[0];
        var g = b.substr(n.length + 1, 1000);
        if (g) {
            g = g.split(",")
        } else {
            g = []
        }
        var h = mini.VTypes[n];
        if (h) {
            var o = h(k, g);
            if (o !== true) {
                d.isValid = false;
                var f = m[0] + "ErrorText";
                d.errorText = p[f] || mini.VTypes[f] || "";
                d.errorText = String.format(d.errorText, g[0], g[1], g[2],
                        g[3], g[4]);
                break
            }
        }
    }
};
mini._getErrorText = function(b, a) {
    if (b && b[a]) {
        return b[a]
    } else {
        return mini.VTypes[a]
    }
};
mini.VTypes = {
    minDateErrorText : "Date can not be less than {0}",
    maxDateErrorText : "Date can not be greater than {0}",
    uniqueErrorText : "This field is unique.",
    requiredErrorText : "This field is required.",
    emailErrorText : "Please enter a valid email address.",
    urlErrorText : "Please enter a valid URL.",
    floatErrorText : "Please enter a valid number.",
    intErrorText : "Please enter only digits",
    dateErrorText : "Please enter a valid date. Date format is {0}",
    maxLengthErrorText : "Please enter no more than {0} characters.",
    minLengthErrorText : "Please enter at least {0} characters.",
    maxErrorText : "Please enter a value less than or equal to {0}.",
    minErrorText : "Please enter a value greater than or equal to {0}.",
    rangeLengthErrorText : "Please enter a value between {0} and {1} characters long.",
    rangeCharErrorText : "Please enter a value between {0} and {1} characters long.",
    rangeErrorText : "Please enter a value between {0} and {1}.",
    required : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return false
        }
        return true
    },
    email : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        if (a
                .search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
            return true
        } else {
            return false
        }
    },
    url : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        function c(f) {
            f = f.toLowerCase().split("?")[0];
            var e = "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var d = new RegExp(e);
            if (d.test(f)) {
                return (true)
            } else {
                return (false)
            }
        }
        return c(a)
    },
    "int" : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        function c(d) {
            if (d < 0) {
                d = -d
            }
            var e = String(d);
            return e.length > 0 && !(/[^0-9]/).test(e)
        }
        return c(a)
    },
    "float" : function(b, c) {
        if (mini.isNull(b) || b === "") {
            return true
        }
        function a(d) {
            if (d < 0) {
                d = -d
            }
            var e = String(d);
            if (e.split(".").length > 2) {
                return false
            }
            return e.length > 0 && !(/[^0-9.]/).test(e)
        }
        return a(b)
    },
    date : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        if (!a) {
            return false
        }
        var e = null;
        var c = b[0];
        if (c) {
            e = mini.parseDate(a, c);
            if (e && e.getFullYear) {
                if (mini.formatDate(e, c) == a) {
                    return true
                }
            }
        } else {
            e = mini.parseDate(a, "yyyy-MM-dd");
            if (!e) {
                e = mini.parseDate(a, "yyyy/MM/dd")
            }
            if (!e) {
                e = mini.parseDate(a, "MM/dd/yyyy")
            }
            if (e && e.getFullYear) {
                return true
            }
        }
        return false
    },
    maxLength : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        var c = parseInt(b);
        if (!a || isNaN(c)) {
            return true
        }
        if (a.length <= c) {
            return true
        } else {
            return false
        }
    },
    minLength : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        var c = parseInt(b);
        if (isNaN(c)) {
            return true
        }
        if (a.length >= c) {
            return true
        } else {
            return false
        }
    },
    rangeLength : function(b, c) {
        if (mini.isNull(b) || b === "") {
            return true
        }
        if (!b) {
            return false
        }
        var d = parseFloat(c[0]), a = parseFloat(c[1]);
        if (isNaN(d) || isNaN(a)) {
            return true
        }
        if (d <= b.length && b.length <= a) {
            return true
        }
        return false
    },
    rangeChar : function(h, e) {
        if (mini.isNull(h) || h === "") {
            return true
        }
        var b = parseFloat(e[0]), f = parseFloat(e[1]);
        if (isNaN(b) || isNaN(f)) {
            return true
        }
        function g(i) {
            var k = new RegExp("^[\u4e00-\u9fa5]+$");
            if (k.test(i)) {
                return true
            }
            return false
        }
        var d = 0;
        var j = String(h).split("");
        for (var c = 0, a = j.length; c < a; c++) {
            if (g(j[c])) {
                d += 2
            } else {
                d += 1
            }
        }
        if (b <= d && d <= f) {
            return true
        }
        return false
    },
    range : function(b, c) {
        if (mini.VTypes["float"](b, c) == false) {
            return false
        }
        if (mini.isNull(b) || b === "") {
            return true
        }
        b = parseFloat(b);
        if (isNaN(b)) {
            return false
        }
        var d = parseFloat(c[0]), a = parseFloat(c[1]);
        if (isNaN(d) || isNaN(a)) {
            return true
        }
        if (d <= b && b <= a) {
            return true
        }
        return false
    },
    min : function(a, b) {
        if (mini.VTypes["float"](a, b) == false) {
            return false
        }
        if (mini.isNull(a) || a === "") {
            return true
        }
        a = parseFloat(a);
        if (isNaN(a)) {
            return false
        }
        var c = parseFloat(b[0]);
        if (isNaN(c)) {
            return true
        }
        if (c <= a) {
            return true
        }
        return false
    },
    max : function(b, c) {
        if (mini.VTypes["float"](b, c) == false) {
            return false
        }
        if (mini.isNull(b) || b === "") {
            return true
        }
        b = parseFloat(b);
        if (isNaN(b)) {
            return false
        }
        var a = parseFloat(c[0]);
        if (isNaN(a)) {
            return true
        }
        if (b <= a) {
            return true
        }
        return false
    }
};
mini.summaryTypes = {
    count : function(a) {
        if (!a) {
            a = []
        }
        return a.length
    },
    max : function(e, f) {
        if (!e) {
            e = []
        }
        var a = null;
        for (var c = 0, b = e.length; c < b; c++) {
            var g = e[c];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            if (a == null || a < d) {
                a = d
            }
        }
        return a
    },
    min : function(e, f) {
        if (!e) {
            e = []
        }
        var c = null;
        for (var b = 0, a = e.length; b < a; b++) {
            var g = e[b];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            if (c == null || c > d) {
                c = d
            }
        }
        return c
    },
    avg : function(f, g) {
        if (!f) {
            f = []
        }
        if (f.length == 0) {
            return 0
        }
        var d = 0;
        for (var c = 0, a = f.length; c < a; c++) {
            var h = f[c];
            var e = parseFloat(h[g]);
            if (e === null || e === undefined || isNaN(e)) {
                continue
            }
            d += e
        }
        var b = d / f.length;
        return b
    },
    sum : function(e, f) {
        if (!e) {
            e = []
        }
        var c = 0;
        for (var b = 0, a = e.length; b < a; b++) {
            var g = e[b];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            c += d
        }
        return c
    }
};
mini.formatCurrency = function(a, c) {
    if (a === null || a === undefined) {
        null == ""
    }
    a = String(a).replace(/\$|\,/g, "");
    if (isNaN(a)) {
        a = "0"
    }
    sign = (a == (a = Math.abs(a)));
    a = Math.floor(a * 100 + 0.50000000001);
    cents = a % 100;
    a = Math.floor(a / 100).toString();
    if (cents < 10) {
        cents = "0" + cents
    }
    for (var b = 0; b < Math.floor((a.length - (1 + b)) / 3); b++) {
        a = a.substring(0, a.length - (4 * b + 3)) + ","
                + a.substring(a.length - (4 * b + 3))
    }
    c = c || "";
    return c + (((sign) ? "" : "-") + a + "." + cents)
};
mini.emptyFn = function() {
};
