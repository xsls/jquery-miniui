/**
 * 分隔容器。
 * 
 *     @example
 *     &lt;div class="mini-splitter" style="width:350px;height:200px;"&gt;
 *         &lt;div size="30%" showCollapseButton="true"&gt;
 *             1
 *         &lt;/div&gt;
 *         &lt;div showCollapseButton="true"&gt;
 *             2
 *         &lt;/div&gt;
 *     &lt;/div&gt;
 * 
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.Splitter = function() {
    this._initPanes();
    mini.Splitter.superclass.constructor.call(this)
};
mini.extend(mini.Splitter, mini.Control, {
    width : 300,
    height : 180,
    vertical : false,
    allowResize : true,
    pane1 : null,
    pane2 : null,
    showHandleButton : true,
    handlerStyle : "",
    handlerCls : "",
    handlerSize : 5,
    uiCls : "mini-splitter",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-splitter";
        this.el.innerHTML = '<div class="mini-splitter-border"><div id="1" class="mini-splitter-pane mini-splitter-pane1"></div><div id="2" class="mini-splitter-pane mini-splitter-pane2"></div><div class="mini-splitter-handler"></div></div>';
        this._borderEl = this.el.firstChild;
        this._pane1El = this._borderEl.firstChild;
        this._pane2El = this._borderEl.childNodes[1];
        this._handlerEl = this._borderEl.lastChild
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini.on(this.el, "click", this.__OnClick, this);
            mini.on(this.el, "mousedown", this.__OnMouseDown,
                    this)
        }, this)
    },
    _initPanes : function() {
        this.pane1 = {
            id : "",
            index : 1,
            minSize : 30,
            maxSize : 3000,
            size : "",
            showCollapseButton : false,
            cls : "",
            style : "",
            visible : true,
            expanded : true
        };
        this.pane2 = mini.copyTo({}, this.pane1);
        this.pane2.index = 2
    },
    doUpdate : function() {
        this.doLayout()
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        this._handlerEl.style.cursor = this.allowResize ? ""
                : "default";
        mini.removeClass(this.el, "mini-splitter-vertical");
        if (this.vertical) {
            mini.addClass(this.el, "mini-splitter-vertical")
        }
        mini.removeClass(this._pane1El,
                "mini-splitter-pane1-vertical");
        mini.removeClass(this._pane2El,
                "mini-splitter-pane2-vertical");
        if (this.vertical) {
            mini.addClass(this._pane1El,
                    "mini-splitter-pane1-vertical");
            mini.addClass(this._pane2El,
                    "mini-splitter-pane2-vertical")
        }
        mini.removeClass(this._handlerEl,
                "mini-splitter-handler-vertical");
        if (this.vertical) {
            mini.addClass(this._handlerEl,
                    "mini-splitter-handler-vertical")
        }
        var t = this.getHeight(true);
        var k = this.getWidth(true);
        if (!jQuery.boxModel) {
            var f = mini.getBorders(this._borderEl);
            t = t + f.top + f.bottom;
            k = k + f.left + f.right
        }
        if (k < 0) {
            k = 0
        }
        if (t < 0) {
            t = 0
        }
        this._borderEl.style.width = k + "px";
        this._borderEl.style.height = t + "px";
        var b = this._pane1El, a = this._pane2El;
        var m = jQuery(b), j = jQuery(a);
        b.style.display = a.style.display = this._handlerEl.style.display = "";
        var y = this.handlerSize;
        this.pane1.size = String(this.pane1.size);
        this.pane2.size = String(this.pane2.size);
        var v = parseFloat(this.pane1.size), n = parseFloat(this.pane2.size);
        var r = isNaN(v), g = isNaN(n);
        var x = !isNaN(v) && this.pane1.size.indexOf("%") != -1;
        var l = !isNaN(n) && this.pane2.size.indexOf("%") != -1;
        var e = !r && !x;
        var d = !g && !l;
        var p = this.vertical ? t - this.handlerSize : k
                - this.handlerSize;
        var u = p2Size = 0;
        if (r || g) {
            if (r && g) {
                u = parseInt(p / 2);
                p2Size = p - u
            } else {
                if (e) {
                    u = v;
                    p2Size = p - u
                } else {
                    if (x) {
                        u = parseInt(p * v / 100);
                        p2Size = p - u
                    } else {
                        if (d) {
                            p2Size = n;
                            u = p - p2Size
                        } else {
                            if (l) {
                                p2Size = parseInt(p * n / 100);
                                u = p - p2Size
                            }
                        }
                    }
                }
            }
        } else {
            if (x && d) {
                p2Size = n;
                u = p - p2Size
            } else {
                if (e && l) {
                    u = v;
                    p2Size = p - u
                } else {
                    var c = v + n;
                    u = parseInt(p * v / c);
                    p2Size = p - u
                }
            }
        }
        if (u > this.pane1.maxSize) {
            u = this.pane1.maxSize;
            p2Size = p - u
        }
        if (p2Size > this.pane2.maxSize) {
            p2Size = this.pane2.maxSize;
            u = p - p2Size
        }
        if (u < this.pane1.minSize) {
            u = this.pane1.minSize;
            p2Size = p - u
        }
        if (p2Size < this.pane2.minSize) {
            p2Size = this.pane2.minSize;
            u = p - p2Size
        }
        if (this.pane1.expanded == false) {
            p2Size = p;
            u = 0;
            b.style.display = "none"
        } else {
            if (this.pane2.expanded == false) {
                u = p;
                p2Size = 0;
                a.style.display = "none"
            }
        }
        if (this.pane1.visible == false) {
            p2Size = p + y;
            u = y = 0;
            b.style.display = "none";
            this._handlerEl.style.display = "none"
        } else {
            if (this.pane2.visible == false) {
                u = p + y;
                p2Size = y = 0;
                a.style.display = "none";
                this._handlerEl.style.display = "none"
            }
        }
        if (this.vertical) {
            mini.setWidth(b, k);
            mini.setWidth(a, k);
            mini.setHeight(b, u);
            mini.setHeight(a, p2Size);
            a.style.top = (u + y) + "px";
            this._handlerEl.style.left = "0px";
            this._handlerEl.style.top = u + "px";
            mini.setWidth(this._handlerEl, k);
            mini.setHeight(this._handlerEl, this.handlerSize);
            b.style.left = "0px";
            a.style.left = "0px"
        } else {
            mini.setWidth(b, u);
            mini.setWidth(a, p2Size);
            mini.setHeight(b, t);
            mini.setHeight(a, t);
            a.style.left = (u + y) + "px";
            this._handlerEl.style.top = "0px";
            this._handlerEl.style.left = u + "px";
            mini.setWidth(this._handlerEl, this.handlerSize);
            mini.setHeight(this._handlerEl, t);
            b.style.top = "0px";
            a.style.top = "0px"
        }
        var o = '<div class="mini-splitter-handler-buttons">';
        if (!this.pane1.expanded || !this.pane2.expanded) {
            if (!this.pane1.expanded) {
                if (this.pane1.showCollapseButton) {
                    o += '<a id="1" class="mini-splitter-pane2-button"></a>'
                }
            } else {
                if (this.pane2.showCollapseButton) {
                    o += '<a id="2" class="mini-splitter-pane1-button"></a>'
                }
            }
        } else {
            if (this.pane1.showCollapseButton) {
                o += '<a id="1" class="mini-splitter-pane1-button"></a>'
            }
            if (this.allowResize) {
                if ((!this.pane1.showCollapseButton && !this.pane2.showCollapseButton)) {
                    o += '<span class="mini-splitter-resize-button"></span>'
                }
            }
            if (this.pane2.showCollapseButton) {
                o += '<a id="2" class="mini-splitter-pane2-button"></a>'
            }
        }
        o += "</div>";
        this._handlerEl.innerHTML = o;
        var q = this._handlerEl.firstChild;
        q.style.display = this.showHandleButton ? "" : "none";
        var i = mini.getBox(q);
        if (this.vertical) {
            q.style.marginLeft = -i.width / 2 + "px"
        } else {
            q.style.marginTop = -i.height / 2 + "px"
        }
        if (!this.pane1.visible || !this.pane2.visible
                || !this.pane1.expanded || !this.pane2.expanded) {
            mini.addClass(this._handlerEl,
                    "mini-splitter-nodrag")
        } else {
            mini.removeClass(this._handlerEl,
                    "mini-splitter-nodrag")
        }
        mini.layout(this._borderEl);
        this.fire("layout")
    },
    getPaneBox : function(a) {
        var b = this.getPaneEl(a);
        if (!b) {
            return null
        }
        return mini.getBox(b)
    },
    /**
     * 获取面板对象。<br/>
     * function getPane(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    getPane : function(a) {
        if (a == 1) {
            return this.pane1
        } else {
            if (a == 2) {
                return this.pane2
            }
        }
        return a
    },
    /**
     * 设置面板配置数组。<br/>
     * function setPanes(panes)
     * @member mini.Splitter
     * @param  panes
     *
     */
    setPanes : function(b) {
        if (!mini.isArray(b)) {
            return
        }
        for (var a = 0; a < 2; a++) {
            var c = b[a];
            this.updatePane(a + 1, c)
        }
    },
    setPaneControls : function(a, c) {
        var d = this.getPane(a);
        if (!d) {
            return
        }
        var b = this.getPaneEl(a);
        __mini_setControls(c, b, this)
    },
    /**
     * 获取面板对象DOM元素。<br/>
     * function getPaneEl(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    getPaneEl : function(a) {
        if (a == 1) {
            return this._pane1El
        }
        return this._pane2El
    },
    /**
     * 更新面板对象。<br/>
     * function updatePane(index, options)
     * @member mini.Splitter
     * @param  index
     * @param  options
     *
     */
    updatePane : function(c, b) {
        var h = this.getPane(c);
        if (!h) {
            return
        }
        mini.copyTo(h, b);
        var f = this.getPaneEl(c);
        var e = h.body;
        delete h.body;
        if (e) {
            if (!mini.isArray(e)) {
                e = [ e ]
            }
            for (var d = 0, a = e.length; d < a; d++) {
                mini.append(f, e[d])
            }
        }
        if (h.bodyParent) {
            var g = h.bodyParent;
            while (g.firstChild) {
                f.appendChild(g.firstChild)
            }
        }
        delete h.bodyParent;
        f.id = h.id;
        mini.setStyle(f, h.style);
        mini.addClass(f, h["class"]);
        if (h.cls) {
            mini.addClass(f, h.cls)
        }
        if (h.controls) {
            var c = h == this.pane1 ? 1 : 2;
            this.setPaneControls(c, h.controls);
            delete h.controls
        }
        this.doUpdate()
    },
    setShowHandleButton : function(a) {
        this.showHandleButton = a;
        this.doUpdate()
    },
    getShowHandleButton : function(a) {
        return this.showHandleButton
    },
    /**
     * 
     * function setVertical(vertical)
     * @member mini.Splitter
     * @param {Boolean} vertical
     *
     */
    setVertical : function(a) {
        this.vertical = a;
        this.doUpdate()
    },
    /**
     * 
     * function getVertical()
     * @member mini.Splitter
     * @returns {Boolean}
     *
     */
    getVertical : function() {
        return this.vertical
    },
    /**
     * 展开面板。<br/>
     * function expandPane(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    expandPane : function(a) {
        var c = this.getPane(a);
        if (!c) {
            return
        }
        c.expanded = true;
        this.doUpdate();
        var b = {
            pane : c,
            paneIndex : this.pane1 == c ? 1 : 2
        };
        this.fire("expand", b)
    },
    /**
     * 收缩面板。<br/>
     * function collapsePane(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    collapsePane : function(a) {
        var d = this.getPane(a);
        if (!d) {
            return
        }
        d.expanded = false;
        var b = d == this.pane1 ? this.pane2 : this.pane1;
        if (b.expanded == false) {
            b.expanded = true;
            b.visible = true
        }
        this.doUpdate();
        var c = {
            pane : d,
            paneIndex : this.pane1 == d ? 1 : 2
        };
        this.fire("collapse", c)
    },
    togglePane : function(a) {
        var b = this.getPane(a);
        if (!b) {
            return
        }
        if (b.expanded) {
            this.collapsePane(b)
        } else {
            this.expandPane(b)
        }
    },
    /**
     * 显示面板。<br/>
     * function showPane(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    showPane : function(a) {
        var b = this.getPane(a);
        if (!b) {
            return
        }
        b.visible = true;
        this.doUpdate()
    },
    /**
     * 隐藏面板。<br/>
     * function hidePane(index)
     * @member mini.Splitter
     * @param  index
     *
     */
    hidePane : function(a) {
        var c = this.getPane(a);
        if (!c) {
            return
        }
        c.visible = false;
        var b = c == this.pane1 ? this.pane2 : this.pane1;
        if (b.visible == false) {
            b.expanded = true;
            b.visible = true
        }
        this.doUpdate()
    },
    /**
     * 
     * function setAllowResize(allowResize)
     * @member mini.Splitter
     * @param {Boolean} allowResize
     *
     */
    setAllowResize : function(a) {
        if (this.allowResize != a) {
            this.allowResize = a;
            this.doLayout()
        }
    },
    /**
     * 
     * function getAllowResize()
     * @member mini.Splitter
     * @returns {Boolean}
     *
     */
    getAllowResize : function() {
        return this.allowResize
    },
    /**
     * 
     * function setHandlerSize(handlerSize)
     * @member mini.Splitter
     * @param {Number} handlerSize
     *
     */
    setHandlerSize : function(a) {
        if (this.handlerSize != a) {
            this.handlerSize = a;
            this.doLayout()
        }
    },
    /**
     * 
     * function getHandlerSize()
     * @member mini.Splitter
     * @returns {Number}
     *
     */
    getHandlerSize : function() {
        return this.handlerSize
    },
    __OnClick : function(c) {
        var b = c.target;
        if (!mini.isAncestor(this._handlerEl, b)) {
            return
        }
        var a = parseInt(b.id);
        var d = this.getPane(a);
        var c = {
            pane : d,
            paneIndex : a,
            cancel : false
        };
        if (d.expanded) {
            this.fire("beforecollapse", c)
        } else {
            this.fire("beforeexpand", c)
        }
        if (c.cancel == true) {
            return
        }
        if (b.className == "mini-splitter-pane1-button") {
            this.togglePane(a)
        } else {
            if (b.className == "mini-splitter-pane2-button") {
                this.togglePane(a)
            }
        }
    },
    _OnButtonClick : function(b, a) {
        this.fire("buttonclick", {
            pane : b,
            index : this.pane1 == b ? 1 : 2,
            htmlEvent : a
        })
    },
    onButtonClick : function(b, a) {
        this.on("buttonclick", b, a)
    },
    __OnMouseDown : function(c) {
        var a = c.target;
        if (!this.allowResize) {
            return
        }
        if (!this.pane1.visible || !this.pane2.visible
                || !this.pane1.expanded || !this.pane2.expanded) {
            return
        }
        if (mini.isAncestor(this._handlerEl, a)) {
            if (a.className == "mini-splitter-pane1-button"
                    || a.className == "mini-splitter-pane2-button") {
            } else {
                var b = this._getDrag();
                b.start(c)
            }
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
        this._dragProxy.style.cursor = this.vertical ? "n-resize"
                : "w-resize";
        this.handlerBox = mini.getBox(this._handlerEl);
        this.elBox = mini.getBox(this._borderEl, true);
        mini.setBox(this._dragProxy, this.handlerBox)
    },
    _OnDragMove : function(d) {
        if (!this.handlerBox) {
            return
        }
        if (!this.elBox) {
            this.elBox = mini.getBox(this._borderEl, true)
        }
        var k = this.elBox.width, e = this.elBox.height;
        var c = this.handlerSize;
        var n = this.vertical ? e - this.handlerSize : k
                - this.handlerSize;
        var l = this.pane1.minSize, a = this.pane1.maxSize;
        var g = this.pane2.minSize, m = this.pane2.maxSize;
        if (this.vertical == true) {
            var b = d.now[1] - d.init[1];
            var i = this.handlerBox.y + b;
            if (i - this.elBox.y > a) {
                i = this.elBox.y + a
            }
            if (i + this.handlerBox.height < this.elBox.bottom
                    - m) {
                i = this.elBox.bottom - m
                        - this.handlerBox.height
            }
            if (i - this.elBox.y < l) {
                i = this.elBox.y + l
            }
            if (i + this.handlerBox.height > this.elBox.bottom
                    - g) {
                i = this.elBox.bottom - g
                        - this.handlerBox.height
            }
            mini.setY(this._dragProxy, i)
        } else {
            var f = d.now[0] - d.init[0];
            var j = this.handlerBox.x + f;
            if (j - this.elBox.x > a) {
                j = this.elBox.x + a
            }
            if (j + this.handlerBox.width < this.elBox.right
                    - m) {
                j = this.elBox.right - m
                        - this.handlerBox.width
            }
            if (j - this.elBox.x < l) {
                j = this.elBox.x + l
            }
            if (j + this.handlerBox.width > this.elBox.right
                    - g) {
                j = this.elBox.right - g
                        - this.handlerBox.width
            }
            mini.setX(this._dragProxy, j)
        }
    },
    _OnDragStop : function(g) {
        var m = this.elBox.width, i = this.elBox.height;
        var b = this.handlerSize;
        var q = parseFloat(this.pane1.size), o = parseFloat(this.pane2.size);
        var n = isNaN(q), l = isNaN(o);
        var k = !isNaN(q) && this.pane1.size.indexOf("%") != -1;
        var j = !isNaN(o) && this.pane2.size.indexOf("%") != -1;
        var a = !n && !k;
        var f = !l && !j;
        var p = this.vertical ? i - this.handlerSize : m
                - this.handlerSize;
        var e = mini.getBox(this._dragProxy);
        var d = e.x - this.elBox.x, c = p - d;
        if (this.vertical) {
            d = e.y - this.elBox.y;
            c = p - d
        }
        if (n || l) {
            if (n && l) {
                q = parseFloat(d / p * 100).toFixed(1);
                this.pane1.size = q + "%"
            } else {
                if (a) {
                    q = d;
                    this.pane1.size = q
                } else {
                    if (k) {
                        q = parseFloat(d / p * 100).toFixed(1);
                        this.pane1.size = q + "%"
                    } else {
                        if (f) {
                            o = c;
                            this.pane2.size = o
                        } else {
                            if (j) {
                                o = parseFloat(c / p * 100)
                                        .toFixed(1);
                                this.pane2.size = o + "%"
                            }
                        }
                    }
                }
            }
        } else {
            if (k && f) {
                this.pane2.size = c
            } else {
                if (a && j) {
                    this.pane1.size = d
                } else {
                    this.pane1.size = parseFloat(d / p * 100)
                            .toFixed(1);
                    this.pane2.size = 100 - this.pane1.size
                }
            }
        }
        jQuery(this._dragProxy).remove();
        jQuery(this._maskProxy).remove();
        this._maskProxy = null;
        this._dragProxy = null;
        this.elBox = this.handlerBox = null;
        this.doLayout();
        this.fire("resize")
    },
    getAttrs : function(c) {
        var k = mini.Splitter.superclass.getAttrs.call(this, c);
        mini._ParseString(c, k, [ "onexpand", "oncollapse",
                "onresize" ]);
        mini._ParseBool(c, k, [ "allowResize", "vertical",
                "showHandleButton" ]);
        mini._ParseInt(c, k, [ "handlerSize" ]);
        var j = [];
        var a = mini.getChildNodes(c);
        for (var f = 0, e = 2; f < e; f++) {
            var d = a[f];
            var h = jQuery(d);
            var b = {};
            j.push(b);
            if (!d) {
                continue
            }
            b.style = d.style.cssText;
            mini._ParseString(d, b, [ "cls", "size", "id",
                    "class" ]);
            mini._ParseBool(d, b, [ "visible", "expanded",
                    "showCollapseButton" ]);
            mini._ParseInt(d, b, [ "minSize", "maxSize",
                    "handlerSize" ]);
            b.bodyParent = d
        }
        k.panes = j;
        return k
    }
});
mini.regClass(mini.Splitter, "splitter");