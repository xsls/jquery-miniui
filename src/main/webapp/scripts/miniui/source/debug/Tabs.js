mini.Tabs = function() {
    this._initTabs();
    mini.Tabs.superclass.constructor.call(this)
};
mini
        .extend(
                mini.Tabs,
                mini.Control,
                {
                    activeIndex : -1,
                    tabAlign : "left",
                    tabPosition : "top",
                    showBody : true,
                    showHeader : true,
                    nameField : "name",
                    titleField : "title",
                    urlField : "url",
                    url : "",
                    maskOnLoad : true,
                    plain : true,
                    bodyStyle : "",
                    _tabHoverCls : "mini-tab-hover",
                    _tabActiveCls : "mini-tab-active",
                    set : function(d) {
                        if (typeof d == "string") {
                            return this
                        }
                        var c = this._allowLayout;
                        this._allowLayout = false;
                        var a = d.activeIndex;
                        delete d.activeIndex;
                        var b = d.url;
                        delete d.url;
                        mini.Tabs.superclass.set.call(this, d);
                        if (b) {
                            this.setUrl(b)
                        }
                        if (mini.isNumber(a)) {
                            this.setActiveIndex(a)
                        }
                        this._allowLayout = c;
                        this.doLayout();
                        return this
                    },
                    uiCls : "mini-tabs",
                    _create : function() {
                        this.el = document.createElement("div");
                        this.el.className = "mini-tabs";
                        var b = '<table class="mini-tabs-table" cellspacing="0" cellpadding="0"><tr style="width:100%;"><td></td><td style="text-align:left;vertical-align:top;width:100%;"><div class="mini-tabs-bodys"></div></td><td></td></tr></table>';
                        this.el.innerHTML = b;
                        this._tableEl = this.el.firstChild;
                        var a = this.el.getElementsByTagName("td");
                        this._td1El = a[0];
                        this._td2El = a[1];
                        this._td3El = a[2];
                        this._bodyEl = this._td2El.firstChild;
                        this._borderEl = this._bodyEl;
                        this.doUpdate()
                    },
                    destroy : function(a) {
                        this._tableEl = this._td1El = this._td2El = this._td3El = null;
                        this._bodyEl = this._borderEl = this.headerEl = null;
                        this.tabs = [];
                        mini.Tabs.superclass.destroy.call(this, a)
                    },
                    _doClearElement : function() {
                        mini.removeClass(this._td1El, "mini-tabs-header");
                        mini.removeClass(this._td3El, "mini-tabs-header");
                        this._td1El.innerHTML = "";
                        this._td3El.innerHTML = "";
                        mini.removeChilds(this._td2El, this._bodyEl)
                    },
                    _initEvents : function() {
                        mini._BindEvents(function() {
                            mini.on(this.el, "mousedown", this.__OnMouseDown,
                                    this);
                            mini.on(this.el, "click", this.__OnClick, this);
                            mini.on(this.el, "mouseover", this.__OnMouseOver,
                                    this);
                            mini.on(this.el, "mouseout", this.__OnMouseOut,
                                    this)
                        }, this)
                    },
                    _initTabs : function() {
                        this.tabs = []
                    },
                    _TabID : 1,
                    createTab : function(a) {
                        var b = mini.copyTo({
                            _id : this._TabID++,
                            name : "",
                            title : "",
                            newLine : false,
                            iconCls : "",
                            iconStyle : "",
                            headerCls : "",
                            headerStyle : "",
                            bodyCls : "",
                            bodyStyle : "",
                            visible : true,
                            enabled : true,
                            showCloseButton : false,
                            active : false,
                            url : "",
                            loaded : false,
                            refreshOnClick : false
                        }, a);
                        if (a) {
                            a = mini.copyTo(a, b);
                            b = a
                        }
                        return b
                    },
                    _doLoad : function() {
                        var a = mini._getResult(this.url, null, null, null,
                                null, this.dataField);
                        if (this.dataField && !mini.isArray(a)) {
                            a = mini._getMap(this.dataField, a)
                        }
                        if (!a) {
                            a = []
                        }
                        this.setTabs(a);
                        this.fire("load")
                    },
                    load : function(a) {
                        if (typeof a == "string") {
                            this.setUrl(a)
                        } else {
                            this.setTabs(a)
                        }
                    },
                    setUrl : function(a) {
                        this.url = a;
                        this._doLoad()
                    },
                    getUrl : function() {
                        return this.url
                    },
                    setNameField : function(a) {
                        this.nameField = a
                    },
                    getNameField : function() {
                        return this.nameField
                    },
                    setTitleField : function(a) {
                        this.titleField = a
                    },
                    getTitleField : function() {
                        return this.titleField
                    },
                    setUrlField : function(a) {
                        this.urlField = a
                    },
                    getUrlField : function() {
                        return this.urlField
                    },
                    setButtons : function(b) {
                        this._buttons = mini.byId(b);
                        if (this._buttons) {
                            var a = mini.byClass("mini-tabs-buttons", this.el);
                            if (a) {
                                a.appendChild(this._buttons);
                                mini.parse(a);
                                this.doLayout()
                            }
                        }
                    },
                    setTabControls : function(b, c) {
                        var b = this.getTab(b);
                        if (!b) {
                            return
                        }
                        var a = this.getTabBodyEl(b);
                        __mini_setControls(c, a, this)
                    },
                    setTabs : function(c) {
                        if (!mini.isArray(c)) {
                            return
                        }
                        this.beginUpdate();
                        this.removeAll();
                        for (var b = 0, a = c.length; b < a; b++) {
                            var d = c[b];
                            d.title = mini._getMap(this.titleField, d);
                            d.url = mini._getMap(this.urlField, d);
                            d.name = mini._getMap(this.nameField, d)
                        }
                        for (var b = 0, a = c.length; b < a; b++) {
                            this.addTab(c[b])
                        }
                        this.setActiveIndex(0);
                        this.endUpdate()
                    },
                    getTabs : function() {
                        return this.tabs
                    },
                    removeAll : function(c) {
                        var a = this.getActiveTab();
                        if (mini.isNull(c)) {
                            c = []
                        }
                        if (!mini.isArray(c)) {
                            c = [ c ]
                        }
                        for (var e = c.length - 1; e >= 0; e--) {
                            var d = this.getTab(c[e]);
                            if (!d) {
                                c.removeAt(e)
                            } else {
                                c[e] = d
                            }
                        }
                        var b = this.tabs;
                        for (var e = b.length - 1; e >= 0; e--) {
                            var f = b[e];
                            if (c.indexOf(f) == -1) {
                                this.removeTab(f)
                            }
                        }
                        var g = c[0];
                        if (a != this.getActiveTab()) {
                            if (g) {
                                this.activeTab(g)
                            }
                        }
                    },
                    addTab : function(c, g) {
                        if (typeof c == "string") {
                            c = {
                                title : c
                            }
                        }
                        c = this.createTab(c);
                        if (!c.name) {
                            c.name = ""
                        }
                        if (typeof g != "number") {
                            g = this.tabs.length
                        }
                        this.tabs.insert(g, c);
                        var h = this._createTabBodyId(c);
                        var j = '<div id="' + h + '" class="mini-tabs-body '
                                + c.bodyCls + '" style="' + c.bodyStyle
                                + ';display:none;"></div>';
                        mini.append(this._bodyEl, j);
                        var b = this.getTabBodyEl(c);
                        var f = c.body;
                        delete c.body;
                        if (f) {
                            if (!mini.isArray(f)) {
                                f = [ f ]
                            }
                            for (var e = 0, d = f.length; e < d; e++) {
                                mini.append(b, f[e])
                            }
                        }
                        if (c.bodyParent) {
                            var a = c.bodyParent;
                            while (a.firstChild) {
                                if (a.firstChild.nodeType == 8) {
                                    a.removeChild(a.firstChild)
                                } else {
                                    b.appendChild(a.firstChild)
                                }
                            }
                        }
                        delete c.bodyParent;
                        if (c.controls) {
                            this.setTabControls(c, c.controls);
                            delete c.controls
                        }
                        this.doUpdate();
                        return c
                    },
                    removeTab : function(f) {
                        f = this.getTab(f);
                        if (!f || this.tabs.indexOf(f) == -1) {
                            return
                        }
                        var b = this.getActiveTab();
                        var e = f == b;
                        var a = this._OnTabDestroy(f);
                        this.tabs.remove(f);
                        this._doRemoveIFrame(f);
                        var d = this.getTabBodyEl(f);
                        if (d) {
                            this._bodyEl.removeChild(d)
                        }
                        if (a && e) {
                            for (var c = this.activeIndex; c >= 0; c--) {
                                var f = this.getTab(c);
                                if (f && f.enabled && f.visible) {
                                    this.activeIndex = c;
                                    break
                                }
                            }
                            this.doUpdate();
                            this.setActiveIndex(this.activeIndex);
                            this.fire("activechanged")
                        } else {
                            this.activeIndex = this.tabs.indexOf(b);
                            this.doUpdate()
                        }
                        return f
                    },
                    moveTab : function(c, a) {
                        c = this.getTab(c);
                        if (!c) {
                            return
                        }
                        var b = this.tabs[a];
                        if (b == c) {
                            return
                        }
                        this.tabs.remove(c);
                        var a = this.tabs.indexOf(b);
                        if (a == -1) {
                            this.tabs.add(c)
                        } else {
                            this.tabs.insert(a, c)
                        }
                        this.doUpdate()
                    },
                    updateTab : function(b, a) {
                        b = this.getTab(b);
                        if (!b) {
                            return
                        }
                        mini.copyTo(b, a);
                        this.doUpdate()
                    },
                    _getMaskWrapEl : function() {
                        return this._bodyEl
                    },
                    _doRemoveIFrame : function(h, g) {
                        if (h._iframeEl && h._iframeEl.parentNode) {
                            h._iframeEl.onload = function() {
                            };
                            jQuery(h._iframeEl).unbind("load");
                            h._iframeEl.src = "";
                            try {
                                iframe.contentWindow.document.write("");
                                iframe.contentWindow.document.close()
                            } catch (e) {
                            }
                            if (h._iframeEl._ondestroy) {
                                h._iframeEl._ondestroy()
                            }
                            try {
                                h._iframeEl.parentNode.removeChild(h._iframeEl);
                                h._iframeEl.removeNode(true)
                            } catch (e) {
                            }
                        }
                        h._iframeEl = null;
                        h.loadedUrl = null;
                        if (g === true) {
                            var b = this.getTabBodyEl(h);
                            if (b) {
                                var f = mini.getChildNodes(b, true);
                                for (var c = 0, a = f.length; c < a; c++) {
                                    var j = f[c];
                                    if (j && j.parentNode) {
                                        j.parentNode.removeChild(j)
                                    }
                                }
                            }
                        }
                    },
                    _deferLoadingTime : 180,
                    _cancelLoadTabs : function(e) {
                        var d = this.tabs;
                        for (var c = 0, a = d.length; c < a; c++) {
                            var b = d[c];
                            if (b != e) {
                                if (b._loading && b._iframeEl) {
                                    b._loading = false;
                                    this._doRemoveIFrame(b, true)
                                }
                            }
                        }
                        if (e && e == this.getActiveTab() && e._loading) {
                        } else {
                            this._loading = false;
                            this.unmask()
                        }
                    },
                    _doLoadTab : function(d) {
                        if (!d || d != this.getActiveTab()) {
                            return
                        }
                        var a = this.getTabBodyEl(d);
                        if (!a) {
                            return
                        }
                        this._cancelLoadTabs();
                        this._doRemoveIFrame(d, true);
                        this._loading = true;
                        d._loading = true;
                        this.unmask();
                        if (this.maskOnLoad) {
                            this.loading()
                        }
                        var b = new Date();
                        var e = this;
                        e.isLoading = true;
                        var c = mini
                                .createIFrame(
                                        d.url,
                                        function(i, h) {
                                            try {
                                                d._iframeEl.contentWindow.Owner = window;
                                                d._iframeEl.contentWindow.CloseOwnerWindow = function(
                                                        k) {
                                                    d.removeAction = k;
                                                    var j = true;
                                                    if (d.ondestroy) {
                                                        if (typeof d.ondestroy == "string") {
                                                            d.ondestroy = window[d.ondestroy]
                                                        }
                                                        if (d.ondestroy) {
                                                            j = d.ondestroy
                                                                    .call(this,
                                                                            g)
                                                        }
                                                    }
                                                    if (j === false) {
                                                        return false
                                                    }
                                                    setTimeout(function() {
                                                        e.removeTab(d)
                                                    }, 10)
                                                }
                                            } catch (g) {
                                            }
                                            if (d._loading != true) {
                                                return
                                            }
                                            var f = (b - new Date())
                                                    + e._deferLoadingTime;
                                            d._loading = false;
                                            d.loadedUrl = d.url;
                                            if (f < 0) {
                                                f = 0
                                            }
                                            setTimeout(function() {
                                                e.unmask();
                                                e.doLayout();
                                                e.isLoading = false
                                            }, f);
                                            if (h) {
                                                var g = {
                                                    sender : e,
                                                    tab : d,
                                                    index : e.tabs.indexOf(d),
                                                    name : d.name,
                                                    iframe : d._iframeEl
                                                };
                                                if (d.onload) {
                                                    if (typeof d.onload == "string") {
                                                        d.onload = window[d.onload]
                                                    }
                                                    if (d.onload) {
                                                        d.onload.call(e, g)
                                                    }
                                                }
                                            }
                                            if (e.getActiveTab() == d) {
                                                e.fire("tabload", g)
                                            }
                                        });
                        setTimeout(function() {
                            if (d._iframeEl == c) {
                                a.appendChild(c)
                            }
                        }, 1);
                        d._iframeEl = c
                    },
                    _OnTabDestroy : function(a) {
                        var b = {
                            sender : this,
                            tab : a,
                            index : this.tabs.indexOf(a),
                            name : a.name,
                            iframe : a._iframeEl,
                            autoActive : true
                        };
                        this.fire("tabdestroy", b);
                        return b.autoActive
                    },
                    loadTab : function(a, c, f, e) {
                        if (!a) {
                            return
                        }
                        c = this.getTab(c);
                        if (!c) {
                            c = this.getActiveTab()
                        }
                        if (!c) {
                            return
                        }
                        var b = this.getTabBodyEl(c);
                        if (b) {
                            mini.addClass(b, "mini-tabs-hideOverflow")
                        }
                        c.url = a;
                        delete c.loadedUrl;
                        if (f) {
                            c.onload = f
                        }
                        if (e) {
                            c.ondestroy = e
                        }
                        var d = this;
                        clearTimeout(this._loadTabTimer);
                        this._loadTabTimer = null;
                        this._loadTabTimer = setTimeout(function() {
                            d._doLoadTab(c)
                        }, 1)
                    },
                    reloadTab : function(a) {
                        a = this.getTab(a);
                        if (!a) {
                            a = this.getActiveTab()
                        }
                        if (!a) {
                            return
                        }
                        this.loadTab(a.url, a)
                    },
                    getTabRows : function() {
                        var d = [];
                        var e = [];
                        for (var b = 0, a = this.tabs.length; b < a; b++) {
                            var c = this.tabs[b];
                            if (b != 0 && c.newLine) {
                                d.push(e);
                                e = []
                            }
                            e.push(c)
                        }
                        d.push(e);
                        return d
                    },
                    doUpdate : function() {
                        if (this._allowUpdate === false) {
                            return
                        }
                        if (this._buttons && this._buttons.parentNode) {
                            this._buttons.parentNode.removeChild(this._buttons)
                        }
                        mini.removeClass(this.el, "mini-tabs-position-left");
                        mini.removeClass(this.el, "mini-tabs-position-top");
                        mini.removeClass(this.el, "mini-tabs-position-right");
                        mini.removeClass(this.el, "mini-tabs-position-bottom");
                        if (this.tabPosition == "bottom") {
                            mini.addClass(this.el, "mini-tabs-position-bottom");
                            this._doUpdateBottom()
                        } else {
                            if (this.tabPosition == "right") {
                                mini.addClass(this.el,
                                        "mini-tabs-position-right");
                                this._doUpdateRight()
                            } else {
                                if (this.tabPosition == "left") {
                                    mini.addClass(this.el,
                                            "mini-tabs-position-left");
                                    this._doUpdateLeft()
                                } else {
                                    mini.addClass(this.el,
                                            "mini-tabs-position-top");
                                    this._doUpdateTop()
                                }
                            }
                        }
                        if (this._buttons) {
                            var a = mini.byClass("mini-tabs-buttons", this.el);
                            if (a) {
                                a.appendChild(this._buttons);
                                mini.parse(a)
                            }
                        }
                        this.doLayout();
                        this.setActiveIndex(this.activeIndex, false)
                    },
                    _handleIFrameOverflow : function() {
                        var a = this.getTabBodyEl(this.activeIndex);
                        if (a) {
                            mini.removeClass(a, "mini-tabs-hideOverflow");
                            var b = mini.getChildNodes(a)[0];
                            if (b && b.tagName
                                    && b.tagName.toUpperCase() == "IFRAME") {
                                mini.addClass(a, "mini-tabs-hideOverflow")
                            }
                        }
                    },
                    doLayout : function() {
                        if (!this.canLayout()) {
                            return
                        }
                        this._headerEl.style.display = this.showHeader ? ""
                                : "none";
                        this._handleIFrameOverflow();
                        var C = this.isAutoHeight();
                        G = this.getHeight(true);
                        p = this.getWidth();
                        var q = G;
                        var x = p;
                        if (this.showBody) {
                            this._bodyEl.style.display = ""
                        } else {
                            this._bodyEl.style.display = "none"
                        }
                        if (this.plain) {
                            mini.addClass(this.el, "mini-tabs-plain")
                        } else {
                            mini.removeClass(this.el, "mini-tabs-plain")
                        }
                        if (!C && this.showBody) {
                            var B = jQuery(this._headerEl).outerHeight();
                            var f = jQuery(this._headerEl).outerWidth();
                            if (this.tabPosition == "top") {
                                B = jQuery(this._headerEl.parentNode)
                                        .outerHeight()
                            }
                            if (this.tabPosition == "left"
                                    || this.tabPosition == "right") {
                                p = p - f
                            } else {
                                G = G - B
                            }
                            if (jQuery.boxModel) {
                                var s = mini.getPaddings(this._bodyEl);
                                var z = mini.getBorders(this._bodyEl);
                                G = G - s.top - s.bottom - z.top - z.bottom;
                                p = p - s.left - s.right - z.left - z.right
                            }
                            margin = mini.getMargins(this._bodyEl);
                            G = G - margin.top - margin.bottom;
                            p = p - margin.left - margin.right;
                            if (G < 0) {
                                G = 0
                            }
                            if (p < 0) {
                                p = 0
                            }
                            this._bodyEl.style.width = p + "px";
                            this._bodyEl.style.height = G + "px";
                            if (this.tabPosition == "left"
                                    || this.tabPosition == "right") {
                                var a = this._headerEl
                                        .getElementsByTagName("tr")[0];
                                var D = a.childNodes;
                                var r = D[0].getElementsByTagName("tr");
                                var g = last = all = 0;
                                for (var E = 0, A = r.length; E < A; E++) {
                                    var a = r[E];
                                    var o = jQuery(a).outerHeight();
                                    all += o;
                                    if (E == 0) {
                                        g = o
                                    }
                                    if (E == A - 1) {
                                        last = o
                                    }
                                }
                                switch (this.tabAlign) {
                                case "center":
                                    var t = parseInt((q - (all - g - last)) / 2);
                                    for (var E = 0, A = D.length; E < A; E++) {
                                        D[E].firstChild.style.height = q + "px";
                                        var m = D[E].firstChild;
                                        var r = m.getElementsByTagName("tr");
                                        var J = r[0], I = r[r.length - 1];
                                        J.style.height = t + "px";
                                        I.style.height = t + "px"
                                    }
                                    break;
                                case "right":
                                    for (var E = 0, A = D.length; E < A; E++) {
                                        var m = D[E].firstChild;
                                        var r = m.getElementsByTagName("tr");
                                        var a = r[0];
                                        var u = q - (all - g);
                                        if (u >= 0) {
                                            a.style.height = u + "px"
                                        }
                                    }
                                    break;
                                case "fit":
                                    for (var E = 0, A = D.length; E < A; E++) {
                                        D[E].firstChild.style.height = q + "px"
                                    }
                                    break;
                                default:
                                    for (var E = 0, A = D.length; E < A; E++) {
                                        var m = D[E].firstChild;
                                        var r = m.getElementsByTagName("tr");
                                        var a = r[r.length - 1];
                                        var u = q - (all - last);
                                        if (u >= 0) {
                                            a.style.height = u + "px"
                                        }
                                    }
                                    break
                                }
                            }
                        } else {
                            this._bodyEl.style.width = "auto";
                            this._bodyEl.style.height = "auto"
                        }
                        var e = this.getTabBodyEl(this.activeIndex);
                        if (e) {
                            if (!C && this.showBody) {
                                var G = mini.getHeight(this._bodyEl, true);
                                if (jQuery.boxModel) {
                                    var s = mini.getPaddings(e);
                                    var z = mini.getBorders(e);
                                    G = G - s.top - s.bottom - z.top - z.bottom
                                }
                                e.style.height = G + "px"
                            } else {
                                e.style.height = "auto"
                            }
                        }
                        switch (this.tabPosition) {
                        case "bottom":
                            var c = this._headerEl.childNodes;
                            for (var E = 0, A = c.length; E < A; E++) {
                                var m = c[E];
                                mini.removeClass(m, "mini-tabs-header2");
                                if (A > 1 && E != 0) {
                                    mini.addClass(m, "mini-tabs-header2")
                                }
                            }
                            break;
                        case "left":
                            var D = this._headerEl.firstChild.rows[0].cells;
                            for (var E = 0, A = D.length; E < A; E++) {
                                var k = D[E];
                                mini.removeClass(k, "mini-tabs-header2");
                                if (A > 1 && E == 0) {
                                    mini.addClass(k, "mini-tabs-header2")
                                }
                            }
                            break;
                        case "right":
                            var D = this._headerEl.firstChild.rows[0].cells;
                            for (var E = 0, A = D.length; E < A; E++) {
                                var k = D[E];
                                mini.removeClass(k, "mini-tabs-header2");
                                if (A > 1 && E != 0) {
                                    mini.addClass(k, "mini-tabs-header2")
                                }
                            }
                            break;
                        default:
                            var c = this._headerEl.childNodes;
                            for (var E = 0, A = c.length; E < A; E++) {
                                var m = c[E];
                                mini.removeClass(m, "mini-tabs-header2");
                                if (A > 1 && E == 0) {
                                    mini.addClass(m, "mini-tabs-header2")
                                }
                            }
                            break
                        }
                        mini.removeClass(this.el, "mini-tabs-scroll");
                        var k = mini.byClass("mini-tabs-lastSpace", this.el);
                        var F = mini.byClass("mini-tabs-buttons", this.el);
                        var d = this._headerEl.parentNode;
                        d.style.paddingRight = "0px";
                        if (this._navEl) {
                            this._navEl.style.display = "none"
                        }
                        if (F) {
                            F.style.display = "none"
                        }
                        mini.setWidth(d, x);
                        if (this.tabPosition == "top"
                                && this.tabAlign == "left") {
                            this._headerEl.style.width = "auto";
                            F.style.display = "block";
                            var y = x;
                            var n = this._headerEl.firstChild.offsetWidth
                                    - k.offsetWidth;
                            var H = F.firstChild ? F.offsetWidth : 0;
                            if (n + H > y) {
                                this._navEl.style.display = "block";
                                this._navEl.style.right = H + "px";
                                var v = this._navEl.offsetWidth;
                                var p = y - H - v;
                                mini.setWidth(this._headerEl, p)
                            }
                        }
                        this._scrollToTab(this.activeIndex);
                        this._doScrollButton();
                        mini.layout(this._bodyEl);
                        var j = this;
                        var b = this.getActiveTab();
                        if (b && b.repaint && e) {
                            var p = e.style.width;
                            e.style.width = "0px";
                            setTimeout(function() {
                                e.style.width = p
                            }, 1)
                        }
                        this.fire("layout")
                    },
                    setTabAlign : function(a) {
                        this.tabAlign = a;
                        this.doUpdate()
                    },
                    setTabPosition : function(a) {
                        this.tabPosition = a;
                        this.doUpdate()
                    },
                    getTab : function(b) {
                        if (typeof b == "object") {
                            return b
                        }
                        if (typeof b == "number") {
                            return this.tabs[b]
                        } else {
                            for (var c = 0, a = this.tabs.length; c < a; c++) {
                                var d = this.tabs[c];
                                if (d.name == b) {
                                    return d
                                }
                            }
                        }
                    },
                    getHeaderEl : function() {
                        return this._headerEl
                    },
                    getBodyEl : function() {
                        return this._bodyEl
                    },
                    getTabEl : function(b) {
                        var f = this.getTab(b);
                        if (!f) {
                            return null
                        }
                        var g = this._createTabId(f);
                        var e = this.el.getElementsByTagName("*");
                        for (var c = 0, a = e.length; c < a; c++) {
                            var d = e[c];
                            if (d.id == g) {
                                return d
                            }
                        }
                        return null
                    },
                    getTabBodyEl : function(b) {
                        var f = this.getTab(b);
                        if (!f) {
                            return null
                        }
                        var g = this._createTabBodyId(f);
                        var e = this._bodyEl.childNodes;
                        for (var c = 0, a = e.length; c < a; c++) {
                            var d = e[c];
                            if (d.id == g) {
                                return d
                            }
                        }
                        return null
                    },
                    getTabIFrameEl : function(a) {
                        var b = this.getTab(a);
                        if (!b) {
                            return null
                        }
                        return b._iframeEl
                    },
                    _createTabId : function(a) {
                        return this.uid + "$" + a._id
                    },
                    _createTabBodyId : function(a) {
                        return this.uid + "$body$" + a._id
                    },
                    _doScrollButton : function() {
                        if (this.tabPosition == "top") {
                            mini.removeClass(this._leftButtonEl,
                                    "mini-disabled");
                            mini.removeClass(this._rightButtonEl,
                                    "mini-disabled");
                            if (this._headerEl.scrollLeft == 0) {
                                mini.addClass(this._leftButtonEl,
                                        "mini-disabled")
                            }
                            var c = this.getTabEl(this.tabs.length - 1);
                            if (c) {
                                var a = mini.getBox(c);
                                var b = mini.getBox(this._headerEl);
                                if (a.right <= b.right) {
                                    mini.addClass(this._rightButtonEl,
                                            "mini-disabled")
                                }
                            }
                        }
                    },
                    setActiveIndex : function(o, p) {
                        var d = this.getTab(o);
                        var r = this.getTab(this.activeIndex);
                        var a = d != r;
                        var b = this.getTabBodyEl(this.activeIndex);
                        if (b) {
                            b.style.display = "none"
                        }
                        if (d) {
                            this.activeIndex = this.tabs.indexOf(d)
                        } else {
                            this.activeIndex = -1
                        }
                        var b = this.getTabBodyEl(this.activeIndex);
                        if (b) {
                            b.style.display = ""
                        }
                        var b = this.getTabEl(r);
                        if (b) {
                            mini.removeClass(b, this._tabActiveCls)
                        }
                        var b = this.getTabEl(d);
                        if (b) {
                            mini.addClass(b, this._tabActiveCls)
                        }
                        if (b && a) {
                            if (this.tabPosition == "bottom") {
                                var j = mini.findParent(b, "mini-tabs-header");
                                if (j) {
                                    jQuery(this._headerEl).prepend(j)
                                }
                            } else {
                                if (this.tabPosition == "left") {
                                    var h = mini.findParent(b,
                                            "mini-tabs-header").parentNode;
                                    if (h) {
                                        h.parentNode.appendChild(h)
                                    }
                                } else {
                                    if (this.tabPosition == "right") {
                                        var h = mini.findParent(b,
                                                "mini-tabs-header").parentNode;
                                        if (h) {
                                            jQuery(h.parentNode).prepend(h)
                                        }
                                    } else {
                                        var j = mini.findParent(b,
                                                "mini-tabs-header");
                                        if (j) {
                                            this._headerEl.appendChild(j)
                                        }
                                    }
                                }
                            }
                            var g = this._headerEl.scrollLeft;
                            this.doLayout();
                            var q = this.getTabRows();
                            if (q.length > 1) {
                            } else {
                                this._scrollToTab(this.activeIndex);
                                this._doScrollButton()
                            }
                            for (var k = 0, f = this.tabs.length; k < f; k++) {
                                var c = this.getTabEl(this.tabs[k]);
                                if (c) {
                                    mini.removeClass(c, this._tabHoverCls)
                                }
                            }
                        }
                        var n = this;
                        if (a) {
                            var m = {
                                tab : d,
                                index : this.tabs.indexOf(d),
                                name : d ? d.name : ""
                            };
                            setTimeout(function() {
                                n.fire("ActiveChanged", m)
                            }, 1)
                        }
                        this._cancelLoadTabs(d);
                        if (p !== false) {
                            if (d && d.url && !d.loadedUrl) {
                                var n = this;
                                n.loadTab(d.url, d)
                            }
                        } else {
                        }
                        if (n.canLayout()) {
                            try {
                                mini.layoutIFrames(n.el)
                            } catch (m) {
                            }
                        }
                    },
                    _scrollToTab : function(b) {
                        var f = this._headerEl.scrollLeft;
                        if (this.tabPosition == "top") {
                            this._headerEl.scrollLeft = f;
                            var e = this.getTabEl(b);
                            if (e) {
                                var d = this;
                                var a = mini.getBox(e);
                                var c = mini.getBox(d._headerEl);
                                if (a.x < c.x) {
                                    d._headerEl.scrollLeft -= (c.x - a.x)
                                } else {
                                    if (a.right > c.right) {
                                        d._headerEl.scrollLeft += (a.right - c.right)
                                    }
                                }
                            }
                        }
                    },
                    getActiveIndex : function() {
                        return this.activeIndex
                    },
                    activeTab : function(a) {
                        this.setActiveIndex(a)
                    },
                    getActiveTab : function() {
                        return this.getTab(this.activeIndex)
                    },
                    getActiveIndex : function() {
                        return this.activeIndex
                    },
                    _tryActiveTab : function(b) {
                        b = this.getTab(b);
                        if (!b) {
                            return
                        }
                        var a = this.tabs.indexOf(b);
                        if (this.activeIndex == a) {
                            return
                        }
                        var c = {
                            tab : b,
                            index : a,
                            name : b.name,
                            cancel : false
                        };
                        this.fire("BeforeActiveChanged", c);
                        if (c.cancel == false) {
                            this.activeTab(b)
                        }
                    },
                    setShowHeader : function(a) {
                        if (this.showHeader != a) {
                            this.showHeader = a;
                            this.doLayout()
                        }
                    },
                    getShowHeader : function() {
                        return this.showHeader
                    },
                    setShowBody : function(a) {
                        if (this.showBody != a) {
                            this.showBody = a;
                            this.doLayout()
                        }
                    },
                    getShowBody : function() {
                        return this.showBody
                    },
                    setBodyStyle : function(a) {
                        this.bodyStyle = a;
                        mini.setStyle(this._bodyEl, a);
                        this.doLayout()
                    },
                    getBodyStyle : function() {
                        return this.bodyStyle
                    },
                    setMaskOnLoad : function(a) {
                        this.maskOnLoad = a
                    },
                    getMaskOnLoad : function() {
                        return this.maskOnLoad
                    },
                    setPlain : function(a) {
                        this.plain = a;
                        this.doLayout()
                    },
                    getPlain : function() {
                        return this.plain
                    },
                    getTabByEvent : function(a) {
                        return this._getTabByEvent(a)
                    },
                    _getTabByEvent : function(d) {
                        var c = mini.findParent(d.target, "mini-tab");
                        if (!c) {
                            return null
                        }
                        var b = c.id.split("$");
                        if (b[0] != this.uid) {
                            return null
                        }
                        var a = parseInt(jQuery(c).attr("index"));
                        return this.getTab(a)
                    },
                    __OnClick : function(c) {
                        var a = this._getTabByEvent(c);
                        if (!a) {
                            return
                        }
                        if (a.enabled) {
                            var b = this;
                            setTimeout(
                                    function() {
                                        if (mini.findParent(c.target,
                                                "mini-tab-close")) {
                                            b._OnCloseButtonClick(a, c)
                                        } else {
                                            var d = a.loadedUrl;
                                            b._tryActiveTab(a);
                                            if (a.refreshOnClick && a.url == d) {
                                                b.reloadTab(a)
                                            }
                                        }
                                    }, 10)
                        }
                    },
                    hoverTab : null,
                    __OnMouseOver : function(b) {
                        var a = this._getTabByEvent(b);
                        if (a && a.enabled) {
                            var c = this.getTabEl(a);
                            mini.addClass(c, this._tabHoverCls);
                            this.hoverTab = a
                        }
                    },
                    __OnMouseOut : function(a) {
                        if (this.hoverTab) {
                            var b = this.getTabEl(this.hoverTab);
                            mini.removeClass(b, this._tabHoverCls)
                        }
                        this.hoverTab = null
                    },
                    __OnMouseDown : function(d) {
                        clearInterval(this._scrollTimer);
                        if (this.tabPosition == "top") {
                            var c = this;
                            var b = 0, a = 10;
                            if (d.target == this._leftButtonEl) {
                                this._scrollTimer = setInterval(function() {
                                    c._headerEl.scrollLeft -= a;
                                    b++;
                                    if (b > 5) {
                                        a = 18
                                    }
                                    if (b > 10) {
                                        a = 25
                                    }
                                    c._doScrollButton()
                                }, 25)
                            } else {
                                if (d.target == this._rightButtonEl) {
                                    this._scrollTimer = setInterval(function() {
                                        c._headerEl.scrollLeft += a;
                                        b++;
                                        if (b > 5) {
                                            a = 18
                                        }
                                        if (b > 10) {
                                            a = 25
                                        }
                                        c._doScrollButton()
                                    }, 25)
                                }
                            }
                            mini.on(document, "mouseup", this.__OnDocMouseUp,
                                    this)
                        }
                    },
                    __OnDocMouseUp : function(a) {
                        clearInterval(this._scrollTimer);
                        this._scrollTimer = null;
                        mini.un(document, "mouseup", this.__OnDocMouseUp, this)
                    },
                    _doUpdateTop : function() {
                        var p = this.tabPosition == "top";
                        var v = "";
                        if (p) {
                            v += '<div class="mini-tabs-scrollCt">';
                            v += '<div class="mini-tabs-nav"><a class="mini-tabs-leftButton" href="javascript:void(0)" hideFocus onclick="return false"></a><a class="mini-tabs-rightButton" href="javascript:void(0)" hideFocus onclick="return false"></a></div>';
                            v += '<div class="mini-tabs-buttons"></div>'
                        }
                        v += '<div class="mini-tabs-headers">';
                        var u = this.getTabRows();
                        for (var h = 0, f = u.length; h < f; h++) {
                            var q = u[h];
                            var t = "";
                            v += '<table class="mini-tabs-header" cellspacing="0" cellpadding="0"><tr><td class="mini-tabs-space mini-tabs-firstSpace"><div></div></td>';
                            for (var n = 0, e = q.length; n < e; n++) {
                                var c = q[n];
                                var b = this._createTabId(c);
                                if (!c.visible) {
                                    continue
                                }
                                var o = this.tabs.indexOf(c);
                                var t = c.headerCls || "";
                                if (c.enabled == false) {
                                    t += " mini-disabled"
                                }
                                v += '<td id="' + b + '" index="' + o
                                        + '"  class="mini-tab ' + t
                                        + '" style="' + c.headerStyle + '">';
                                if (c.iconCls || c.iconStyle) {
                                    v += '<span class="mini-tab-icon '
                                            + c.iconCls + '" style="'
                                            + c.iconStyle + '"></span>'
                                }
                                v += '<span class="mini-tab-text">' + c.title
                                        + "</span>";
                                if (c.showCloseButton) {
                                    var a = "";
                                    if (c.enabled) {
                                        a = "onmouseover=\"mini.addClass(this, 'mini-tab-close-hover')\" onmouseout=\"mini.removeClass(this, 'mini-tab-close-hover')\""
                                    }
                                    v += '<span class="mini-tab-close" ' + a
                                            + "></span>"
                                }
                                v += "</td>";
                                if (n != e - 1) {
                                    v += '<td class="mini-tabs-space2"><div></div></td>'
                                }
                            }
                            v += '<td class="mini-tabs-space mini-tabs-lastSpace" ><div></div></td></tr></table>'
                        }
                        if (p) {
                            v += "</div>"
                        }
                        v += "</div>";
                        this._doClearElement();
                        mini.prepend(this._td2El, v);
                        var d = this._td2El;
                        this._headerEl = d.firstChild.lastChild;
                        if (p) {
                            this._navEl = this._headerEl.parentNode.firstChild;
                            this._leftButtonEl = this._navEl.firstChild;
                            this._rightButtonEl = this._navEl.childNodes[1]
                        }
                        switch (this.tabAlign) {
                        case "center":
                            var r = this._headerEl.childNodes;
                            for (var n = 0, e = r.length; n < e; n++) {
                                var g = r[n];
                                var m = g.getElementsByTagName("td");
                                m[0].style.width = "50%";
                                m[m.length - 1].style.width = "50%"
                            }
                            break;
                        case "right":
                            var r = this._headerEl.childNodes;
                            for (var n = 0, e = r.length; n < e; n++) {
                                var g = r[n];
                                var m = g.getElementsByTagName("td");
                                m[0].style.width = "100%"
                            }
                            break;
                        case "fit":
                            break;
                        default:
                            var r = this._headerEl.childNodes;
                            for (var n = 0, e = r.length; n < e; n++) {
                                var g = r[n];
                                var m = g.getElementsByTagName("td");
                                m[m.length - 1].style.width = "100%"
                            }
                            break
                        }
                    },
                    _doUpdateBottom : function() {
                        this._doUpdateTop();
                        var a = this._td2El;
                        mini.append(a, a.firstChild);
                        this._headerEl = a.lastChild
                    },
                    _doUpdateLeft : function() {
                        var p = '<table cellspacing="0" cellpadding="0"><tr>';
                        var o = this.getTabRows();
                        for (var f = 0, e = o.length; f < e; f++) {
                            var m = o[f];
                            var n = "";
                            if (e > 1 && f != e - 1) {
                                n = "mini-tabs-header2"
                            }
                            p += '<td class="'
                                    + n
                                    + '"><table class="mini-tabs-header" cellspacing="0" cellpadding="0">';
                            p += '<tr ><td class="mini-tabs-space mini-tabs-firstSpace" ><div></div></td></tr>';
                            for (var g = 0, d = m.length; g < d; g++) {
                                var c = m[g];
                                var b = this._createTabId(c);
                                if (!c.visible) {
                                    continue
                                }
                                var h = this.tabs.indexOf(c);
                                var n = c.headerCls || "";
                                if (c.enabled == false) {
                                    n += " mini-disabled"
                                }
                                p += '<tr><td id="' + b + '" index="' + h
                                        + '"  class="mini-tab ' + n
                                        + '" style="' + c.headerStyle + '">';
                                if (c.iconCls || c.iconStyle) {
                                    p += '<span class="mini-tab-icon '
                                            + c.iconCls + '" style="'
                                            + c.iconStyle + '"></span>'
                                }
                                p += '<span class="mini-tab-text">' + c.title
                                        + "</span>";
                                if (c.showCloseButton) {
                                    var a = "";
                                    if (c.enabled) {
                                        a = "onmouseover=\"mini.addClass(this, 'mini-tab-close-hover')\" onmouseout=\"mini.removeClass(this, 'mini-tab-close-hover')\""
                                    }
                                    p += '<span class="mini-tab-close" ' + a
                                            + "></span>"
                                }
                                p += "</td></tr>";
                                if (g != d - 1) {
                                    p += '<tr><td class="mini-tabs-space2"><div></div></td></tr>'
                                }
                            }
                            p += '<tr ><td class="mini-tabs-space mini-tabs-lastSpace" ><div></div></td></tr>';
                            p += "</table></td>"
                        }
                        p += "</tr ></table>";
                        this._doClearElement();
                        mini.addClass(this._td1El, "mini-tabs-header");
                        mini.append(this._td1El, p);
                        this._headerEl = this._td1El
                    },
                    _doUpdateRight : function() {
                        this._doUpdateLeft();
                        mini.removeClass(this._td1El, "mini-tabs-header");
                        mini.removeClass(this._td3El, "mini-tabs-header");
                        mini.append(this._td3El, this._td1El.firstChild);
                        this._headerEl = this._td3El
                    },
                    _OnCloseButtonClick : function(d, a) {
                        var f = {
                            tab : d,
                            index : this.tabs.indexOf(d),
                            name : d.name.toLowerCase(),
                            htmlEvent : a,
                            cancel : false
                        };
                        this.fire("beforecloseclick", f);
                        if (f.cancel == true) {
                            return
                        }
                        try {
                            if (d._iframeEl && d._iframeEl.contentWindow) {
                                var b = true;
                                if (d._iframeEl.contentWindow.CloseWindow) {
                                    b = d._iframeEl.contentWindow
                                            .CloseWindow("close")
                                } else {
                                    if (d._iframeEl.contentWindow.CloseOwnerWindow) {
                                        b = d._iframeEl.contentWindow
                                                .CloseOwnerWindow("close")
                                    }
                                }
                                if (b === false) {
                                    f.cancel = true
                                }
                            }
                        } catch (c) {
                        }
                        if (f.cancel == true) {
                            return
                        }
                        d.removeAction = "close";
                        this.removeTab(d);
                        this.fire("closeclick", f)
                    },
                    onBeforeCloseClick : function(b, a) {
                        this.on("beforecloseclick", b, a)
                    },
                    onCloseClick : function(b, a) {
                        this.on("closeclick", b, a)
                    },
                    onActiveChanged : function(b, a) {
                        this.on("activechanged", b, a)
                    },
                    getAttrs : function(el) {
                        var attrs = mini.Tabs.superclass.getAttrs
                                .call(this, el);
                        mini._ParseString(el, attrs, [ "tabAlign",
                                "tabPosition", "bodyStyle", "onactivechanged",
                                "onbeforeactivechanged", "url", "ontabload",
                                "ontabdestroy", "onbeforecloseclick",
                                "oncloseclick", "titleField", "urlField",
                                "nameField", "loadingMsg", "buttons" ]);
                        mini._ParseBool(el, attrs, [ "allowAnim", "showBody",
                                "showHeader", "maskOnLoad", "plain" ]);
                        mini._ParseInt(el, attrs, [ "activeIndex" ]);
                        var tabs = [];
                        var nodes = mini.getChildNodes(el);
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            var node = nodes[i];
                            var o = {};
                            tabs.push(o);
                            o.style = node.style.cssText;
                            mini._ParseString(node, o, [ "name", "title",
                                    "url", "cls", "iconCls", "iconStyle",
                                    "headerCls", "headerStyle", "bodyCls",
                                    "bodyStyle", "onload", "ondestroy",
                                    "data-options" ]);
                            mini._ParseBool(node, o, [ "newLine", "visible",
                                    "enabled", "showCloseButton",
                                    "refreshOnClick" ]);
                            o.bodyParent = node;
                            var options = o["data-options"];
                            if (options) {
                                options = eval("(" + options + ")");
                                if (options) {
                                    mini.copyTo(o, options)
                                }
                            }
                        }
                        attrs.tabs = tabs;
                        return attrs
                    }
                });
mini.regClass(mini.Tabs, "tabs");