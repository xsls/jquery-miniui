/**
 * 布局管理器。
 * 
 *     @example
 *     &lt;div id="layout1" class="mini-layout" style="width:600px;height:400px;"&gt;
 *         &lt;div title="north" region="north" height="80" &gt;
 *             north
 *         &lt;/div&gt;
 *         &lt;div title="south" region="south" showSplit="false" showHeader="true" height="80"  &gt;
 *             south
 *         &lt;/div&gt;
 *         &lt;div title="west" region="west" width="200" &gt;
 *             west
 *         &lt;/div&gt;
 *         &lt;div title="east" region="east"  showCloseButton="true" &gt;
 *             east
 *         &lt;/div&gt;
 *         &lt;div title="center" region="center" &gt;
 *             center
 *         &lt;/div&gt;
 *     &lt;/div&gt;
 * 
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.Layout = function() {
    this.regions = [];
    this.regionMap = {};
    mini.Layout.superclass.constructor.call(this)
};
mini.extend(mini.Layout, mini.Control, {
    regions : [],
    splitSize : 5,
    collapseWidth : 28,
    collapseHeight : 25,
    regionWidth : 150,
    regionHeight : 80,
    regionMinWidth : 50,
    regionMinHeight : 25,
    regionMaxWidth : 2000,
    regionMaxHeight : 2000,
    uiCls : "mini-layout",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-layout";
        this.el.innerHTML = '<div class="mini-layout-border"></div>';
        this._borderEl = this.el.firstChild;
        this.doUpdate()
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini.on(this.el, "click", this.__OnClick, this);
            mini.on(this.el, "mousedown", this.__OnMouseDown,
                    this);
            mini.on(this.el, "mouseover", this.__OnMouseOver,
                    this);
            mini.on(this.el, "mouseout", this.__OnMouseOut,
                    this);
            mini.on(document, "mousedown",
                    this.__OnDocMouseDown, this)
        }, this)
    },
    getRegionEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a._el
    },
    getRegionHeaderEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a._header
    },
    /**
     * 获取region面板对象内容区DOM元素<br/>
     * function getRegionBodyEl(String)
     * @member mini.Layout
     * @param  String
     *
     */
    getRegionBodyEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a._body
    },
    getRegionSplitEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a._split
    },
    getRegionProxyEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a._proxy
    },
    getRegionBox : function(b) {
        var a = this.getRegionEl(b);
        if (a) {
            return mini.getBox(a)
        }
        return null
    },
    /**
     * 获取Regoin对象。<br/>
     * function getRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    getRegion : function(a) {
        if (typeof a == "string") {
            return this.regionMap[a]
        }
        return a
    },
    _getButton : function(f, b) {
        var e = f.buttons;
        for (var d = 0, a = e.length; d < a; d++) {
            var c = e[d];
            if (c.name == b) {
                return c
            }
        }
    },
    _createRegion : function(a) {
        var b = mini.copyTo({
            region : "",
            title : "",
            iconCls : "",
            iconStyle : "",
            showCloseButton : false,
            showCollapseButton : true,
            buttons : [ {
                name : "close",
                cls : "mini-tools-close",
                html : "",
                visible : false
            }, {
                name : "collapse",
                cls : "mini-tools-collapse",
                html : "",
                visible : true
            } ],
            showSplitIcon : false,
            showSplit : true,
            showHeader : true,
            splitSize : this.splitSize,
            collapseSize : this.collapseWidth,
            width : this.regionWidth,
            height : this.regionHeight,
            minWidth : this.regionMinWidth,
            minHeight : this.regionMinHeight,
            maxWidth : this.regionMaxWidth,
            maxHeight : this.regionMaxHeight,
            allowResize : true,
            cls : "",
            style : "",
            headerCls : "",
            headerStyle : "",
            bodyCls : "",
            bodyStyle : "",
            visible : true,
            expanded : true
        }, a);
        return b
    },
    _CreateRegionEl : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return
        }
        mini
                .append(
                        this._borderEl,
                        '<div id="'
                                + a.region
                                + '" class="mini-layout-region"><div class="mini-layout-region-header" style="'
                                + a.headerStyle
                                + '"></div><div class="mini-layout-region-body '
                                + a.bodyCls + '" style="'
                                + a.bodyStyle
                                + '"></div></div>');
        a._el = this._borderEl.lastChild;
        a._header = a._el.firstChild;
        a._body = a._el.lastChild;
        if (a.cls) {
            mini.addClass(a._el, a.cls)
        }
        if (a.style) {
            mini.setStyle(a._el, a.style)
        }
        if (a.headerCls) {
            mini.addClass(a._el.firstChild, a.headerCls)
        }
        mini.addClass(a._el, "mini-layout-region-" + a.region);
        if (a.region != "center") {
            mini
                    .append(
                            this._borderEl,
                            '<div uid="'
                                    + this.uid
                                    + '" id="'
                                    + a.region
                                    + '" class="mini-layout-split"><div class="mini-layout-spliticon"></div></div>');
            a._split = this._borderEl.lastChild;
            mini.addClass(a._split, "mini-layout-split-"
                    + a.region)
        }
        if (a.region != "center") {
            mini.append(this._borderEl, '<div id="' + a.region
                    + '" class="mini-layout-proxy"></div>');
            a._proxy = this._borderEl.lastChild;
            mini.addClass(a._proxy, "mini-layout-proxy-"
                    + a.region)
        }
    },
    setRegionControls : function(c, b) {
        var c = this.getRegion(c);
        if (!c) {
            return
        }
        var a = this.getRegionBodyEl(c);
        __mini_setControls(b, a, this)
    },
    /**
     * 设置Regoin对象数组<br/>
     * function setRegions(Array)
     * @member mini.Layout
     * @param  Array
     *
     */
    setRegions : function(c) {
        if (!mini.isArray(c)) {
            return
        }
        for (var b = 0, a = c.length; b < a; b++) {
            this.addRegion(c[b])
        }
    },
    /**
     * 增加region。<br/>
     * function addRegion(Object, index)
     * @member mini.Layout
     * @param  Object
     * @param  index
     *
     */
    addRegion : function(k, j) {
        var d = k;
        k = this._createRegion(k);
        if (!k.region) {
            k.region = "center"
        }
        k.region = k.region.toLowerCase();
        if (k.region == "center" && d && !d.showHeader) {
            k.showHeader = false
        }
        if (k.region == "north" || k.region == "south") {
            if (!d.collapseSize) {
                k.collapseSize = this.collapseHeight
            }
        }
        this._measureRegion(k);
        if (typeof j != "number") {
            j = this.regions.length
        }
        var a = this.regionMap[k.region];
        if (a) {
            return
        }
        this.regions.insert(j, k);
        this.regionMap[k.region] = k;
        this._CreateRegionEl(k);
        var c = this.getRegionBodyEl(k);
        var h = k.body;
        delete k.body;
        if (h) {
            if (!mini.isArray(h)) {
                h = [ h ]
            }
            for (var g = 0, e = h.length; g < e; g++) {
                mini.append(c, h[g])
            }
        }
        if (k.bodyParent) {
            var b = k.bodyParent;
            while (b.firstChild) {
                var f = b.firstChild;
                c.appendChild(f)
            }
        }
        delete k.bodyParent;
        if (k.controls) {
            this.setRegionControls(k, k.controls);
            delete k.controls
        }
        this.doUpdate()
    },
    /**
     * 删除region面板。<br/>
     * function removeRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    removeRegion : function(a) {
        var a = this.getRegion(a);
        if (!a) {
            return
        }
        this.regions.remove(a);
        delete this.regionMap[a.region];
        jQuery(a._el).remove();
        jQuery(a._split).remove();
        jQuery(a._proxy).remove();
        this.doUpdate()
    },
    moveRegion : function(c, a) {
        var c = this.getRegion(c);
        if (!c) {
            return
        }
        var b = this.regions[a];
        if (!b || b == c) {
            return
        }
        this.regions.remove(c);
        var a = this.region.indexOf(b);
        this.regions.insert(a, c);
        this.doUpdate()
    },
    _measureRegion : function(b) {
        var a = this._getButton(b, "close");
        a.visible = b.showCloseButton;
        var a = this._getButton(b, "collapse");
        a.visible = b.showCollapseButton;
        if (b.width < b.minWidth) {
            b.width = mini.minWidth
        }
        if (b.width > b.maxWidth) {
            b.width = mini.maxWidth
        }
        if (b.height < b.minHeight) {
            b.height = mini.minHeight
        }
        if (b.height > b.maxHeight) {
            b.height = mini.maxHeight
        }
    },
    /**
     * 更新region面板<br/>
     * function updateRegion(String, options)
     * @member mini.Layout
     * @param  String
     * @param  options
     *
     */
    updateRegion : function(b, a) {
        b = this.getRegion(b);
        if (!b) {
            return
        }
        if (a) {
            delete a.region
        }
        mini.copyTo(b, a);
        this._measureRegion(b);
        this.doUpdate()
    },
    /**
     * 展开regoin对象。<br/>
     * function expandRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    expandRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return
        }
        a.expanded = true;
        this.doUpdate()
    },
    /**
     * 收缩regoin对象。<br/>
     * function collapseRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    collapseRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return
        }
        a.expanded = false;
        this.doUpdate()
    },
    toggleRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return
        }
        if (a.expanded) {
            this.collapseRegion(a)
        } else {
            this.expandRegion(a)
        }
    },
    /**
     * 显示regoin对象。<br/>
     * function showRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    showRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return
        }
        a.visible = true;
        this.doUpdate()
    },
    /**
     * 隐藏regoin对象。<br/>
     * function hideRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    hideRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return
        }
        a.visible = false;
        this.doUpdate()
    },
    /**
     * 是否展开region。<br/>
     * function isExpandRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    isExpandRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a.expanded
    },
    /**
     * 是否显示region。<br/>
     * function isVisibleRegion(String)
     * @member mini.Layout
     * @param  String
     *
     */
    isVisibleRegion : function(a) {
        a = this.getRegion(a);
        if (!a) {
            return null
        }
        return a.visible
    },
    _tryToggleRegion : function(b) {
        b = this.getRegion(b);
        var a = {
            region : b,
            cancel : false
        };
        if (b.expanded) {
            this.fire("BeforeCollapse", a);
            if (a.cancel == false) {
                this.collapseRegion(b)
            }
        } else {
            this.fire("BeforeExpand", a);
            if (a.cancel == false) {
                this.expandRegion(b)
            }
        }
    },
    _getProxyElByEvent : function(b) {
        var a = mini.findParent(b.target, "mini-layout-proxy");
        return a
    },
    _getRegionElByEvent : function(b) {
        var a = mini.findParent(b.target, "mini-layout-region");
        return a
    },
    __OnClick : function(f) {
        if (this._inAniming) {
            return
        }
        var a = this._getProxyElByEvent(f);
        if (a) {
            var d = a.id;
            var c = mini.findParent(f.target,
                    "mini-tools-collapse");
            if (c) {
                this._tryToggleRegion(d)
            } else {
                this._VirtualToggle(d)
            }
        }
        var b = this._getRegionElByEvent(f);
        if (b
                && mini.findParent(f.target,
                        "mini-layout-region-header")) {
            var d = b.id;
            var c = mini.findParent(f.target,
                    "mini-tools-collapse");
            if (c) {
                this._tryToggleRegion(d)
            }
            var g = mini.findParent(f.target,
                    "mini-tools-close");
            if (g) {
                this.updateRegion(d, {
                    visible : false
                })
            }
        }
        if (mini.hasClass(f.target, "mini-layout-spliticon")) {
            var d = f.target.parentNode.id;
            this._tryToggleRegion(d)
        }
    },
    _OnButtonClick : function(c, b, a) {
        this.fire("buttonclick", {
            htmlEvent : a,
            region : c,
            button : b,
            index : this.buttons.indexOf(b),
            name : b.name
        })
    },
    _OnButtonMouseDown : function(c, b, a) {
        this.fire("buttonmousedown", {
            htmlEvent : a,
            region : c,
            button : b,
            index : this.buttons.indexOf(b),
            name : b.name
        })
    },
    hoverProxyEl : null,
    __OnMouseOver : function(b) {
        var a = this._getProxyElByEvent(b);
        if (a) {
            mini.addClass(a, "mini-layout-proxy-hover");
            this.hoverProxyEl = a
        }
    },
    __OnMouseOut : function(a) {
        if (this.hoverProxyEl) {
            mini.removeClass(this.hoverProxyEl,
                    "mini-layout-proxy-hover")
        }
        this.hoverProxyEl = null
    },
    onButtonClick : function(b, a) {
        this.on("buttonclick", b, a)
    },
    onButtonMouseDown : function(b, a) {
        this.on("buttonmousedown", b, a)
                    }
                });
mini
        .copyTo(
                mini.Layout.prototype,
                {
                    _createHeader : function(e, c) {
                        var d = '<div class="mini-tools">';
        if (c) {
            d += '<span class="mini-tools-collapse"></span>'
        } else {
            for (var b = e.buttons.length - 1; b >= 0; b--) {
                var a = e.buttons[b];
                d += '<span class="' + a.cls + '" style="';
                d += a.style + ";"
                        + (a.visible ? "" : "display:none;")
                        + '">' + a.html + "</span>"
            }
        }
        d += "</div>";
        d += '<div class="mini-layout-region-icon '
                + e.iconCls
                + '" style="'
                + e.iconStyle
                + ";"
                + ((e.iconStyle || e.iconCls) ? ""
                        : "display:none;") + '"></div>';
        d += '<div class="mini-layout-region-title">' + e.title
                + "</div>";
        return d
    },
    doUpdate : function() {
        for (var d = 0, a = this.regions.length; d < a; d++) {
            var g = this.regions[d];
            var f = g.region;
            var e = g._el, c = g._split, b = g._proxy;
            if (g.cls) {
                mini.addClass(e, g.cls)
            }
            if (g.headerCls) {
                mini.addClass(e.firstChild, g.headerCls)
            }
            g._header.style.display = g.showHeader ? ""
                    : "none";
            g._header.innerHTML = this._createHeader(g);
            if (g._proxy) {
                g._proxy.innerHTML = this
                        ._createHeader(g, true)
            }
            if (c) {
                mini.removeClass(c, "mini-layout-split-nodrag");
                if (g.expanded == false || !g.allowResize) {
                    mini
                            .addClass(c,
                                    "mini-layout-split-nodrag")
                }
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
        var t = mini.getHeight(this.el, true);
        var n = mini.getWidth(this.el, true);
        var m = {
            x : 0,
            y : 0,
            width : n,
            height : t
        };
        mini.setHeight(this._borderEl, t);
        var b = this.regions.clone();
        var z = this.getRegion("center");
        b.remove(z);
        if (z) {
            b.push(z)
        }
        for (var s = 0, q = b.length; s < q; s++) {
            var f = b[s];
            f._Expanded = false;
            mini.removeClass(f._el, "mini-layout-popup");
            var g = f.region;
            var c = f._el, p = f._split, r = f._proxy;
            if (f.visible == false) {
                c.style.display = "none";
                if (g != "center") {
                    p.style.display = r.style.display = "none"
                }
                continue
            }
            c.style.display = "";
            if (g != "center") {
                p.style.display = r.style.display = ""
            }
            var k = m.x, j = m.y, n = m.width, t = m.height;
            var e = f.width, o = f.height;
            if (!f.expanded) {
                if (g == "west" || g == "east") {
                    e = f.collapseSize;
                    mini.setWidth(c, f.width)
                } else {
                    if (g == "north" || g == "south") {
                        o = f.collapseSize;
                        mini.setHeight(c, f.height)
                    }
                }
            }
            switch (g) {
            case "north":
                t = o;
                m.y += o;
                m.height -= o;
                break;
            case "south":
                t = o;
                j = m.y + m.height - o;
                m.height -= o;
                break;
            case "west":
                n = e;
                m.x += e;
                m.width -= e;
                break;
            case "east":
                n = e;
                k = m.x + m.width - e;
                m.width -= e;
                break;
            case "center":
                break;
            default:
                continue
            }
            if (n < 0) {
                n = 0
            }
            if (t < 0) {
                t = 0
            }
            if (g == "west" || g == "east") {
                mini.setHeight(c, t)
            }
            if (g == "north" || g == "south") {
                mini.setWidth(c, n)
            }
            var u = "left:" + k + "px;top:" + j + "px;";
            var v = c;
            if (!f.expanded) {
                v = r;
                c.style.top = "-100px";
                c.style.left = "-1500px"
            } else {
                if (r) {
                    r.style.left = "-1500px";
                    r.style.top = "-100px"
                }
            }
            v.style.left = k + "px";
            v.style.top = j + "px";
            mini.setWidth(v, n);
            mini.setHeight(v, t);
            var A = jQuery(f._el).height();
            var a = f.showHeader ? jQuery(f._header)
                    .outerHeight() : 0;
            mini.setHeight(f._body, A - a);
            if (g == "center") {
                continue
            }
            e = o = f.splitSize;
            var k = m.x, j = m.y, n = m.width, t = m.height;
            switch (g) {
            case "north":
                t = o;
                m.y += o;
                m.height -= o;
                break;
            case "south":
                t = o;
                j = m.y + m.height - o;
                m.height -= o;
                break;
            case "west":
                n = e;
                m.x += e;
                m.width -= e;
                break;
            case "east":
                n = e;
                k = m.x + m.width - e;
                m.width -= e;
                break;
            case "center":
                break
            }
            if (n < 0) {
                n = 0
            }
            if (t < 0) {
                t = 0
            }
            p.style.left = k + "px";
            p.style.top = j + "px";
            mini.setWidth(p, n);
            mini.setHeight(p, t);
            if (f.showSplit && f.expanded
                    && f.allowResize == true) {
                mini.removeClass(p, "mini-layout-split-nodrag")
            } else {
                mini.addClass(p, "mini-layout-split-nodrag")
            }
            p.firstChild.style.display = f.showSplitIcon ? "block"
                    : "none";
            if (f.expanded) {
                mini.removeClass(p.firstChild,
                        "mini-layout-spliticon-collapse")
            } else {
                mini.addClass(p.firstChild,
                        "mini-layout-spliticon-collapse")
            }
        }
        mini.layout(this._borderEl);
        this.fire("layout")
    },
    __OnMouseDown : function(d) {
        if (this._inAniming) {
            return
        }
        if (mini.findParent(d.target, "mini-layout-split")) {
            var a = jQuery(d.target).attr("uid");
            if (a != this.uid) {
                return
            }
            var c = this.getRegion(d.target.id);
            if (c.expanded == false || !c.allowResize
                    || !c.showSplit) {
                return
            }
            this.dragRegion = c;
            var b = this._getDrag();
            b.start(d)
        }
    },
    _getDrag : function() {
        if (!this.drag) {
            this.drag = new mini.Drag({
                capture : true,
                onStart : mini.createDelegate(
                        this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove,
                        this),
                onStop : mini.createDelegate(this._OnDragStop,
                        this)
            })
        }
        return this.drag
    },
    _OnDragStart : function(a) {
        this._maskProxy = mini.append(document.body,
                '<div class="mini-resizer-mask"></div>');
        this._dragProxy = mini.append(document.body,
                '<div class="mini-proxy"></div>');
        this._dragProxy.style.cursor = "n-resize";
        if (this.dragRegion.region == "west"
                || this.dragRegion.region == "east") {
            this._dragProxy.style.cursor = "w-resize"
        }
        this.splitBox = mini.getBox(this.dragRegion._split);
        mini.setBox(this._dragProxy, this.splitBox);
        this.elBox = mini.getBox(this.el, true)
    },
    _OnDragMove : function(s) {
        var z = s.now[0] - s.init[0];
        var l = this.splitBox.x + z;
        var i = s.now[1] - s.init[1];
        var j = this.splitBox.y + i;
        var u = l + this.splitBox.width;
        var g = j + this.splitBox.height;
        var e = this.getRegion("west"), h = this
                .getRegion("east"), q = this.getRegion("north"), n = this
                .getRegion("south"), v = this
                .getRegion("center");
        var w = e && e.visible ? e.width : 0;
        var f = h && h.visible ? h.width : 0;
        var a = q && q.visible ? q.height : 0;
        var k = n && n.visible ? n.height : 0;
        var p = e && e.showSplit ? mini.getWidth(e._split) : 0;
        var m = h && h.showSplit ? mini.getWidth(h._split) : 0;
        var d = q && q.showSplit ? mini.getHeight(q._split) : 0;
        var r = n && n.showSplit ? mini.getHeight(n._split) : 0;
        var c = this.dragRegion, b = c.region;
        if (b == "west") {
            var t = this.elBox.width - f - m - p - v.minWidth;
            if (l - this.elBox.x > t) {
                l = t + this.elBox.x
            }
            if (l - this.elBox.x < c.minWidth) {
                l = c.minWidth + this.elBox.x
            }
            if (l - this.elBox.x > c.maxWidth) {
                l = c.maxWidth + this.elBox.x
            }
            mini.setX(this._dragProxy, l)
        } else {
            if (b == "east") {
                var t = this.elBox.width - w - p - m
                        - v.minWidth;
                if (this.elBox.right
                        - (l + this.splitBox.width) > t) {
                    l = this.elBox.right - t
                            - this.splitBox.width
                }
                if (this.elBox.right
                        - (l + this.splitBox.width) < c.minWidth) {
                    l = this.elBox.right - c.minWidth
                            - this.splitBox.width
                }
                if (this.elBox.right
                        - (l + this.splitBox.width) > c.maxWidth) {
                    l = this.elBox.right - c.maxWidth
                            - this.splitBox.width
                }
                mini.setX(this._dragProxy, l)
            } else {
                if (b == "north") {
                    var o = this.elBox.height - k - r - d
                            - v.minHeight;
                    if (j - this.elBox.y > o) {
                        j = o + this.elBox.y
                    }
                    if (j - this.elBox.y < c.minHeight) {
                        j = c.minHeight + this.elBox.y
                    }
                    if (j - this.elBox.y > c.maxHeight) {
                        j = c.maxHeight + this.elBox.y
                    }
                    mini.setY(this._dragProxy, j)
                } else {
                    if (b == "south") {
                        var o = this.elBox.height - a - d - r
                                - v.minHeight;
                        if (this.elBox.bottom
                                - (j + this.splitBox.height) > o) {
                            j = this.elBox.bottom - o
                                    - this.splitBox.height
                        }
                        if (this.elBox.bottom
                                - (j + this.splitBox.height) < c.minHeight) {
                            j = this.elBox.bottom - c.minHeight
                                    - this.splitBox.height
                        }
                        if (this.elBox.bottom
                                - (j + this.splitBox.height) > c.maxHeight) {
                            j = this.elBox.bottom - c.maxHeight
                                    - this.splitBox.height
                        }
                        mini.setY(this._dragProxy, j)
                    }
                }
            }
        }
    },
    _OnDragStop : function(d) {
        var e = mini.getBox(this._dragProxy);
        var f = this.dragRegion, c = f.region;
        if (c == "west") {
            var b = e.x - this.elBox.x;
            this.updateRegion(f, {
                width : b
            })
        } else {
            if (c == "east") {
                var b = this.elBox.right - e.right;
                this.updateRegion(f, {
                    width : b
                })
            } else {
                if (c == "north") {
                    var a = e.y - this.elBox.y;
                    this.updateRegion(f, {
                        height : a
                    })
                } else {
                    if (c == "south") {
                        var a = this.elBox.bottom - e.bottom;
                        this.updateRegion(f, {
                            height : a
                        })
                    }
                }
            }
        }
        jQuery(this._dragProxy).remove();
        this._dragProxy = null;
        this.elBox = this.handlerBox = null;
        jQuery(this._maskProxy).remove();
        this._maskProxy = null
    },
    _VirtualToggle : function(a) {
        a = this.getRegion(a);
        if (a._Expanded === true) {
            this._VirtualCollapse(a)
        } else {
            this._VirtualExpand(a)
        }
    },
    _VirtualExpand : function(m) {
        if (this._inAniming) {
            return
        }
        this.doLayout();
        var j = m.region, a = m._el;
        m._Expanded = true;
        mini.addClass(a, "mini-layout-popup");
        var e = mini.getBox(m._proxy);
        var g = mini.getBox(m._el);
        var c = {};
        if (j == "east") {
            var n = e.x;
            var l = e.y;
            var f = e.height;
            mini.setHeight(a, f);
            mini.setX(a, n);
            a.style.top = m._proxy.style.top;
            var d = parseInt(a.style.left);
            c = {
                left : d - g.width
            }
        } else {
            if (j == "west") {
                var n = e.right - g.width;
                var l = e.y;
                var f = e.height;
                mini.setHeight(a, f);
                mini.setX(a, n);
                a.style.top = m._proxy.style.top;
                var d = parseInt(a.style.left);
                c = {
                    left : d + g.width
                }
            } else {
                if (j == "north") {
                    var n = e.x;
                    var l = e.bottom - g.height;
                    var o = e.width;
                    mini.setWidth(a, o);
                    mini.setXY(a, n, l);
                    var k = parseInt(a.style.top);
                    c = {
                        top : k + g.height
                    }
                } else {
                    if (j == "south") {
                        var n = e.x;
                        var l = e.y;
                        var o = e.width;
                        mini.setWidth(a, o);
                        mini.setXY(a, n, l);
                        var k = parseInt(a.style.top);
                        c = {
                            top : k - g.height
                        }
                    }
                }
            }
        }
        mini.addClass(m._proxy, "mini-layout-maxZIndex");
        this._inAniming = true;
        var i = this;
        var b = jQuery(a);
        b.animate(c, 250,
                function() {
                    mini.removeClass(m._proxy,
                            "mini-layout-maxZIndex");
                    i._inAniming = false
                })
    },
    _VirtualCollapse : function(h) {
        if (this._inAniming) {
            return
        }
        h._Expanded = false;
        var g = h.region, a = h._el;
        var e = mini.getBox(a);
        var c = {};
        if (g == "east") {
            var d = parseInt(a.style.left);
            c = {
                left : d + e.width
            }
        } else {
            if (g == "west") {
                var d = parseInt(a.style.left);
                c = {
                    left : d - e.width
                }
            } else {
                if (g == "north") {
                    var i = parseInt(a.style.top);
                    c = {
                        top : i - e.height
                    }
                } else {
                    if (g == "south") {
                        var i = parseInt(a.style.top);
                        c = {
                            top : i + e.height
                        }
                    }
                }
            }
        }
        mini.addClass(h._proxy, "mini-layout-maxZIndex");
        this._inAniming = true;
        var f = this;
        var b = jQuery(a);
        b.animate(c, 250,
                function() {
                    mini.removeClass(h._proxy,
                            "mini-layout-maxZIndex");
                    f._inAniming = false;
                    f.doLayout()
                })
    },
    __OnDocMouseDown : function(d) {
        if (this._inAniming) {
            return
        }
        for (var b = 0, a = this.regions.length; b < a; b++) {
            var c = this.regions[b];
            if (!c._Expanded) {
                continue
            }
            if (mini.isAncestor(c._el, d.target)
                    || mini.isAncestor(c._proxy, d.target)
                    || d.target.location) {
            } else {
                this._VirtualCollapse(c)
            }
        }
    },
    getAttrs : function(c) {
        var k = mini.Layout.superclass.getAttrs.call(this, c);
        var d = jQuery(c);
        var j = parseInt(d.attr("splitSize"));
        if (!isNaN(j)) {
            k.splitSize = j
        }
        var g = [];
        var a = mini.getChildNodes(c);
        for (var h = 0, f = a.length; h < f; h++) {
            var e = a[h];
            var b = {};
            g.push(b);
            b.cls = e.className;
            b.style = e.style.cssText;
            mini._ParseString(e, b, [ "region", "title",
                    "iconCls", "iconStyle", "cls", "headerCls",
                    "headerStyle", "bodyCls", "bodyStyle" ]);
            mini._ParseBool(e, b, [ "allowResize", "visible",
                    "showCloseButton", "showCollapseButton",
                    "showSplit", "showHeader", "expanded",
                    "showSplitIcon" ]);
            mini._ParseInt(e, b, [ "splitSize", "collapseSize",
                    "width", "height", "minWidth", "minHeight",
                    "maxWidth", "maxHeight" ]);
            b.bodyParent = e
        }
        k.regions = g;
        return k
    }
});
mini.regClass(mini.Layout, "layout");