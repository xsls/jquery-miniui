mini.OutlookBar = function() {
    this._initGroups();
    mini.OutlookBar.superclass.constructor.call(this)
};
mini
        .extend(
                mini.OutlookBar,
                mini.Control,
                {
                    width : 180,
                    expandOnLoad : true,
                    activeIndex : -1,
                    autoCollapse : false,
                    groupCls : "",
                    groupStyle : "",
                    groupHeaderCls : "",
                    groupHeaderStyle : "",
                    groupBodyCls : "",
                    groupBodyStyle : "",
                    groupHoverCls : "",
                    groupActiveCls : "",
                    allowAnim : true,
                    set : function(c) {
                        if (typeof c == "string") {
                            return this
                        }
                        var b = this._allowLayout;
                        this._allowLayout = false;
                        var a = c.activeIndex;
                        delete c.activeIndex;
                        mini.OutlookBar.superclass.set.call(this, c);
                        if (mini.isNumber(a)) {
                            this.setActiveIndex(a)
                        }
                        this._allowLayout = b;
                        this.doLayout();
                        return this
                    },
                    uiCls : "mini-outlookbar",
                    _create : function() {
                        this.el = document.createElement("div");
                        this.el.className = "mini-outlookbar";
                        this.el.innerHTML = '<div class="mini-outlookbar-border"></div>';
                        this._borderEl = this.el.firstChild
                    },
                    _initEvents : function() {
                        mini._BindEvents(function() {
                            mini.on(this.el, "click", this.__OnClick, this)
                        }, this)
                    },
                    _createGroupId : function(a) {
                        return this.uid + "$" + a._id
                    },
                    _GroupId : 1,
                    _initGroups : function() {
                        this.groups = []
                    },
                    _createGroupEl : function(h) {
                        var b = this._createGroupId(h);
                        var k = '<div id="'
                                + b
                                + '" class="mini-outlookbar-group '
                                + h.cls
                                + '" style="'
                                + h.style
                                + '"><div class="mini-outlookbar-groupHeader '
                                + h.headerCls
                                + '" style="'
                                + h.headerStyle
                                + ';"></div><div class="mini-outlookbar-groupBody '
                                + h.bodyCls + '" style="' + h.bodyStyle
                                + ';"></div></div>';
                        var c = mini.append(this._borderEl, k);
                        var j = c.lastChild;
                        var g = h.body;
                        delete h.body;
                        if (g) {
                            if (!mini.isArray(g)) {
                                g = [ g ]
                            }
                            for (var f = 0, e = g.length; f < e; f++) {
                                var d = g[f];
                                mini.append(j, d)
                            }
                            g.length = 0
                        }
                        if (h.bodyParent) {
                            var a = h.bodyParent;
                            while (a.firstChild) {
                                j.appendChild(a.firstChild)
                            }
                        }
                        delete h.bodyParent;
                        return c
                    },
                    createGroup : function(a) {
                        var b = mini.copyTo({
                            _id : this._GroupId++,
                            name : "",
                            title : "",
                            cls : "",
                            style : "",
                            iconCls : "",
                            iconStyle : "",
                            headerCls : "",
                            headerStyle : "",
                            bodyCls : "",
                            bodyStyle : "",
                            visible : true,
                            enabled : true,
                            showCollapseButton : true,
                            expanded : this.expandOnLoad
                        }, a);
                        return b
                    },
                    setGroups : function(a) {
                        if (!mini.isArray(a)) {
                            return
                        }
                        this.removeAll();
                        for (var c = 0, b = a.length; c < b; c++) {
                            this.addGroup(a[c])
                        }
                    },
                    getGroups : function() {
                        return this.groups
                    },
                    addGroup : function(e, a) {
                        if (typeof e == "string") {
                            e = {
                                title : e
                            }
                        }
                        e = this.createGroup(e);
                        if (typeof a != "number") {
                            a = this.groups.length
                        }
                        this.groups.insert(a, e);
                        var c = this._createGroupEl(e);
                        e._el = c;
                        var a = this.groups.indexOf(e);
                        var d = this.groups[a + 1];
                        if (d) {
                            var b = this.getGroupEl(d);
                            jQuery(b).before(c)
                        }
                        this.doUpdate();
                        return e
                    },
                    updateGroup : function(b, a) {
                        var b = this.getGroup(b);
                        if (!b) {
                            return
                        }
                        mini.copyTo(b, a);
                        this.doUpdate()
                    },
                    removeGroup : function(a) {
                        a = this.getGroup(a);
                        if (!a) {
                            return
                        }
                        var b = this.getGroupEl(a);
                        if (b) {
                            b.parentNode.removeChild(b)
                        }
                        this.groups.remove(a);
                        this.doUpdate()
                    },
                    removeAll : function() {
                        for (var a = this.groups.length - 1; a >= 0; a--) {
                            this.removeGroup(a)
                        }
                    },
                    moveGroup : function(c, a) {
                        c = this.getGroup(c);
                        if (!c) {
                            return
                        }
                        target = this.getGroup(a);
                        var d = this.getGroupEl(c);
                        this.groups.remove(c);
                        if (target) {
                            a = this.groups.indexOf(target);
                            this.groups.insert(a, c);
                            var b = this.getGroupEl(target);
                            jQuery(b).before(d)
                        } else {
                            this.groups.add(c);
                            this._borderEl.appendChild(d)
                        }
                        this.doUpdate()
                    },
                    doUpdate : function() {
                        for (var c = 0, a = this.groups.length; c < a; c++) {
                            var f = this.groups[c];
                            var h = f._el;
                            var g = h.firstChild;
                            var e = h.lastChild;
                            var b = '<div class="mini-outlookbar-icon '
                                    + f.iconCls + '" style="' + f.iconStyle
                                    + ';"></div>';
                            var d = '<div class="mini-tools"><span class="mini-tools-collapse" style="'
                                    + (f.showCollapseButton ? ""
                                            : "display:none;")
                                    + '"></span></div>'
                                    + ((f.iconStyle || f.iconCls) ? b : "")
                                    + '<div class="mini-outlookbar-groupTitle">'
                                    + f.title
                                    + '</div><div style="clear:both;"></div>';
                            g.innerHTML = d;
                            if (f.enabled) {
                                mini.removeClass(h, "mini-disabled")
                            } else {
                                mini.addClass(h, "mini-disabled")
                            }
                            mini.addClass(h, f.cls);
                            mini.setStyle(h, f.style);
                            mini.addClass(e, f.bodyCls);
                            mini.setStyle(e, f.bodyStyle);
                            mini.addClass(g, f.headerCls);
                            mini.setStyle(g, f.headerStyle);
                            mini.removeClass(h, "mini-outlookbar-firstGroup");
                            mini.removeClass(h, "mini-outlookbar-lastGroup");
                            if (c == 0) {
                                mini.addClass(h, "mini-outlookbar-firstGroup")
                            }
                            if (c == a - 1) {
                                mini.addClass(h, "mini-outlookbar-lastGroup")
                            }
                        }
                        this.doLayout()
                    },
                    doLayout : function() {
                        if (!this.canLayout()) {
                            return
                        }
                        if (this._inAniming) {
                            return
                        }
                        this._doLayoutInner();
                        for (var d = 0, a = this.groups.length; d < a; d++) {
                            var k = this.groups[d];
                            var c = k._el;
                            var g = c.lastChild;
                            if (k.expanded) {
                                mini.addClass(c, "mini-outlookbar-expand");
                                mini.removeClass(c, "mini-outlookbar-collapse")
                            } else {
                                mini.removeClass(c, "mini-outlookbar-expand");
                                mini.addClass(c, "mini-outlookbar-collapse")
                            }
                            g.style.height = "auto";
                            g.style.display = k.expanded ? "block" : "none";
                            c.style.display = k.visible ? "" : "none";
                            var h = mini.getWidth(c, true);
                            var f = mini.getPaddings(g);
                            var b = mini.getBorders(g);
                            if (jQuery.boxModel) {
                                h = h - f.left - f.right - b.left - b.right
                            }
                            g.style.width = h + "px"
                        }
                        var j = this.isAutoHeight();
                        var e = this.getActiveGroup();
                        if (!j && this.autoCollapse && e) {
                            var c = this.getGroupEl(this.activeIndex);
                            c.lastChild.style.height = this
                                    ._getFillGroupBodyHeight()
                                    + "px"
                        } else {
                        }
                        mini.layout(this._borderEl)
                    },
                    _doLayoutInner : function() {
                        if (this.isAutoHeight()) {
                            this._borderEl.style.height = "auto"
                        } else {
                            var b = this.getHeight(true);
                            if (!jQuery.boxModel) {
                                var a = mini.getBorders(this._borderEl);
                                b = b + a.top + a.bottom
                            }
                            if (b < 0) {
                                b = 0
                            }
                            this._borderEl.style.height = b + "px"
                        }
                    },
                    _getFillGroupBodyHeight : function() {
                        var g = jQuery(this.el).height();
                        var o = mini.getBorders(this._borderEl);
                        g = g - o.top - o.bottom;
                        var k = this.getActiveGroup();
                        var m = 0;
                        for (var f = 0, b = this.groups.length; f < b; f++) {
                            var q = this.groups[f];
                            var a = this.getGroupEl(q);
                            if (q.visible == false || q == k) {
                                continue
                            }
                            var j = a.lastChild.style.display;
                            a.lastChild.style.display = "none";
                            var n = jQuery(a).outerHeight();
                            a.lastChild.style.display = j;
                            var d = mini.getMargins(a);
                            n = n + d.top + d.bottom;
                            m += n
                        }
                        g = g - m;
                        var e = this.getGroupEl(this.activeIndex);
                        if (!e) {
                            return 0
                        }
                        g = g - jQuery(e.firstChild).outerHeight();
                        if (jQuery.boxModel) {
                            var p = mini.getPaddings(e.lastChild);
                            var c = mini.getBorders(e.lastChild);
                            g = g - p.top - p.bottom - c.top - c.bottom
                        }
                        var p = mini.getPaddings(e);
                        var c = mini.getBorders(e);
                        var d = mini.getMargins(e);
                        g = g - d.top - d.bottom;
                        g = g - p.top - p.bottom - c.top - c.bottom;
                        if (g < 0) {
                            g = 0
                        }
                        return g
                    },
                    getGroup : function(b) {
                        if (typeof b == "object") {
                            return b
                        }
                        if (typeof b == "number") {
                            return this.groups[b]
                        } else {
                            for (var c = 0, a = this.groups.length; c < a; c++) {
                                var d = this.groups[c];
                                if (d.name == b) {
                                    return d
                                }
                            }
                        }
                    },
                    _getGroupById : function(d) {
                        for (var b = 0, a = this.groups.length; b < a; b++) {
                            var c = this.groups[b];
                            if (c._id == d) {
                                return c
                            }
                        }
                    },
                    getGroupEl : function(a) {
                        var b = this.getGroup(a);
                        if (!b) {
                            return null
                        }
                        return b._el
                    },
                    getGroupBodyEl : function(a) {
                        var b = this.getGroupEl(a);
                        if (b) {
                            return b.lastChild
                        }
                        return null
                    },
                    setAutoCollapse : function(a) {
                        this.autoCollapse = a
                    },
                    getAutoCollapse : function() {
                        return this.autoCollapse
                    },
                    setExpandOnLoad : function(a) {
                        this.expandOnLoad = a
                    },
                    getExpandOnLoad : function() {
                        return this.expandOnLoad
                    },
                    setActiveIndex : function(e) {
                        var c = this.activeIndex;
                        var f = this.getGroup(e);
                        var a = this.getGroup(this.activeIndex);
                        var b = f != a;
                        if (f) {
                            this.activeIndex = this.groups.indexOf(f)
                        } else {
                            this.activeIndex = -1
                        }
                        var f = this.getGroup(this.activeIndex);
                        if (f) {
                            var d = this.allowAnim;
                            this.allowAnim = false;
                            this.expandGroup(f);
                            this.allowAnim = d
                        }
                        if (this.activeIndex == -1 && c != -1) {
                            this.collapseGroup(c)
                        }
                    },
                    getActiveIndex : function() {
                        return this.activeIndex
                    },
                    getActiveGroup : function() {
                        return this.getGroup(this.activeIndex)
                    },
                    showGroup : function(a) {
                        a = this.getGroup(a);
                        if (!a || a.visible == true) {
                            return
                        }
                        a.visible = true;
                        this.doUpdate()
                    },
                    hideGroup : function(a) {
                        a = this.getGroup(a);
                        if (!a || a.visible == false) {
                            return
                        }
                        a.visible = false;
                        this.doUpdate()
                    },
                    toggleGroup : function(a) {
                        a = this.getGroup(a);
                        if (!a) {
                            return
                        }
                        if (a.expanded) {
                            this.collapseGroup(a)
                        } else {
                            this.expandGroup(a)
                        }
                    },
                    collapseGroup : function(k) {
                        k = this.getGroup(k);
                        if (!k) {
                            return
                        }
                        var i = k.expanded;
                        var f = 0;
                        if (this.autoCollapse && !this.isAutoHeight()) {
                            f = this._getFillGroupBodyHeight()
                        }
                        var a = false;
                        k.expanded = false;
                        var h = this.groups.indexOf(k);
                        if (h == this.activeIndex) {
                            this.activeIndex = -1;
                            a = true
                        }
                        var b = this.getGroupBodyEl(k);
                        if (this.allowAnim && i) {
                            this._inAniming = true;
                            b.style.display = "block";
                            b.style.height = "auto";
                            if (this.autoCollapse && !this.isAutoHeight()) {
                                b.style.height = f + "px"
                            }
                            var d = {
                                height : "1px"
                            };
                            mini.addClass(b, "mini-outlookbar-overflow");
                            var g = this;
                            var c = jQuery(b);
                            c.animate(d, 180,
                                    function() {
                                        g._inAniming = false;
                                        mini.removeClass(b,
                                                "mini-outlookbar-overflow");
                                        g.doLayout()
                                    })
                        } else {
                            this.doLayout()
                        }
                        var j = {
                            group : k,
                            index : this.groups.indexOf(k),
                            name : k.name
                        };
                        this.fire("Collapse", j);
                        if (a) {
                            this.fire("activechanged")
                        }
                    },
                    expandGroup : function(r) {
                        r = this.getGroup(r);
                        if (!r) {
                            return
                        }
                        var p = r.expanded;
                        r.expanded = true;
                        this.activeIndex = this.groups.indexOf(r);
                        fire = true;
                        if (this.autoCollapse) {
                            for (var j = 0, f = this.groups.length; j < f; j++) {
                                var m = this.groups[j];
                                if (m.expanded && m != r) {
                                    this.collapseGroup(m)
                                }
                            }
                        }
                        var a = this.getGroupBodyEl(r);
                        if (this.allowAnim && p == false) {
                            this._inAniming = true;
                            a.style.display = "block";
                            if (this.autoCollapse && !this.isAutoHeight()) {
                                var o = this._getFillGroupBodyHeight();
                                a.style.height = (o) + "px"
                            } else {
                                a.style.height = "auto"
                            }
                            var k = mini.getHeight(a);
                            a.style.height = "1px";
                            var c = {
                                height : k + "px"
                            };
                            var d = a.style.overflow;
                            a.style.overflow = "hidden";
                            mini.addClass(a, "mini-outlookbar-overflow");
                            var n = this;
                            var b = jQuery(a);
                            b.animate(c, 180,
                                    function() {
                                        a.style.overflow = d;
                                        mini.removeClass(a,
                                                "mini-outlookbar-overflow");
                                        n._inAniming = false;
                                        n.doLayout()
                                    })
                        } else {
                            this.doLayout()
                        }
                        var q = {
                            group : r,
                            index : this.groups.indexOf(r),
                            name : r.name
                        };
                        this.fire("Expand", q);
                        if (fire) {
                            this.fire("activechanged")
                        }
                    },
                    _tryToggleGroup : function(b) {
                        b = this.getGroup(b);
                        if (b.enabled == false) {
                            return
                        }
                        var a = {
                            group : b,
                            groupIndex : this.groups.indexOf(b),
                            groupName : b.name,
                            cancel : false
                        };
                        if (b.expanded) {
                            this.fire("BeforeCollapse", a);
                            if (a.cancel == false) {
                                this.collapseGroup(b)
                            }
                        } else {
                            this.fire("BeforeExpand", a);
                            if (a.cancel == false) {
                                this.expandGroup(b)
                            }
                        }
                    },
                    _getGroupByEvent : function(c) {
                        var b = mini.findParent(c.target,
                                "mini-outlookbar-group");
                        if (!b) {
                            return null
                        }
                        var a = b.id.split("$");
                        var d = a[a.length - 1];
                        return this._getGroupById(d)
                    },
                    __OnClick : function(c) {
                        if (this._inAniming) {
                            return
                        }
                        var b = mini.findParent(c.target,
                                "mini-outlookbar-groupHeader");
                        if (!b) {
                            return
                        }
                        var a = this._getGroupByEvent(c);
                        if (!a) {
                            return
                        }
                        this._tryToggleGroup(a)
                    },
                    parseGroups : function(c) {
                        var a = [];
                        for (var d = 0, b = c.length; d < b; d++) {
                            var e = c[d];
                            var f = {};
                            a.push(f);
                            f.style = e.style.cssText;
                            mini._ParseString(e, f, [ "name", "title", "cls",
                                    "iconCls", "iconStyle", "headerCls",
                                    "headerStyle", "bodyCls", "bodyStyle" ]);
                            mini._ParseBool(e, f, [ "visible", "enabled",
                                    "showCollapseButton", "expanded" ]);
                            f.bodyParent = e
                        }
                        return a
                    },
                    getAttrs : function(c) {
                        var b = mini.OutlookBar.superclass.getAttrs.call(this,
                                c);
                        mini._ParseString(c, b, [ "onactivechanged",
                                "oncollapse", "onexpand" ]);
                        mini._ParseBool(c, b, [ "autoCollapse", "allowAnim",
                                "expandOnLoad" ]);
                        mini._ParseInt(c, b, [ "activeIndex" ]);
                        var a = mini.getChildNodes(c);
                        b.groups = this.parseGroups(a);
                        return b
                    }
                });
mini.regClass(mini.OutlookBar, "outlookbar");


mini.NavBar = function() {
    mini.NavBar.superclass.constructor.call(this)
};
mini.extend(mini.NavBar, mini.OutlookBar, {
    uiCls : "mini-navbar"
});
mini.regClass(mini.NavBar, "navbar");