mini.Window = function() {
    mini.Window.superclass.constructor.call(this);
    this.addCls("mini-window");
    this.setVisible(false);
    this.setAllowDrag(this.allowDrag);
    this.setAllowResize(this.allowResize)
};
mini
        .extend(
                mini.Window,
                mini.Panel,
                {
                    x : 0,
                    y : 0,
                    state : "restore",
                    _dragCls : "mini-window-drag",
                    _resizeCls : "mini-window-resize",
                    allowDrag : true,
                    showCloseButton : true,
                    showMaxButton : false,
                    showMinButton : false,
                    showCollapseButton : false,
                    showModal : true,
                    minWidth : 150,
                    minHeight : 80,
                    maxWidth : 2000,
                    maxHeight : 2000,
                    uiCls : "mini-window",
                    _create : function() {
                        mini.Window.superclass._create.call(this);
                        if (mini.isIE && mini_useShims) {
                            var a = "<iframe frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
                            mini.append(this.el, a)
                        }
                    },
                    _initButtons : function() {
                        this.buttons = [];
                        var d = this.createButton({
                            name : "collapse",
                            cls : "mini-tools-collapse",
                            visible : this.showCollapseButton
                        });
                        this.buttons.push(d);
                        var b = this.createButton({
                            name : "min",
                            cls : "mini-tools-min",
                            visible : this.showMinButton
                        });
                        this.buttons.push(b);
                        var a = this.createButton({
                            name : "max",
                            cls : "mini-tools-max",
                            visible : this.showMaxButton
                        });
                        this.buttons.push(a);
                        var c = this.createButton({
                            name : "close",
                            cls : "mini-tools-close",
                            visible : this.showCloseButton
                        });
                        this.buttons.push(c)
                    },
                    _initEvents : function() {
                        mini.Window.superclass._initEvents.call(this);
                        mini._BindEvents(function() {
                            mini.on(this.el, "mouseover", this.__OnMouseOver,
                                    this);
                            mini.on(window, "resize", this.__OnWindowResize,
                                    this);
                            mini.on(this.el, "mousedown",
                                    this.__OnWindowMouseDown, this)
                        }, this)
                    },
                    doLayout : function() {
                        if (!this.canLayout()) {
                            return
                        }
                        if (this.state == "max") {
                            var a = this.getParentBox();
                            this.el.style.left = "0px";
                            this.el.style.top = "0px";
                            mini.setSize(this.el, a.width, a.height)
                        }
                        mini.Window.superclass.doLayout.call(this);
                        if (this.allowDrag) {
                            mini.addClass(this.el, this._dragCls)
                        }
                        if (this.state == "max") {
                            this._resizeGridEl.style.display = "none";
                            mini.removeClass(this.el, this._dragCls)
                        }
                        this._doModal()
                    },
                    _doModal : function() {
                        if (!this.el) {
                            if (this._modalEl) {
                                mini.removeNode(this._modalEl)
                            }
                            return
                        }
                        var a = this.showModal && this.isDisplay()
                                && this.visible;
                        if (!this._modalEl && this.showModal == false) {
                            if (this._modalEl) {
                                mini.removeNode(this._modalEl)
                            }
                            return
                        }
                        if (!this._modalEl) {
                            var c = "__modal" + this._id;
                            var b = "<iframe frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
                            this._modalEl = mini
                                    .append(
                                            document.body,
                                            '<div id="'
                                                    + c
                                                    + '" class="mini-modal" style="display:none">'
                                                    + b + "</div>")
                        }
                        if (a) {
                            this._modalEl.style.display = "block";
                            this._modalEl.style.zIndex = mini.getStyle(this.el,
                                    "zIndex") - 1
                        } else {
                            this._modalEl.style.display = "none"
                        }
                    },
                    getParentBox : function() {
                        var a = mini.getViewportBox();
                        var b = this._containerEl || document.body;
                        if (b != document.body) {
                            a = mini.getBox(b)
                        }
                        return a
                    },
                    setShowModal : function(a) {
                        this.showModal = a
                    },
                    getShowModal : function() {
                        return this.showModal
                    },
                    setMinWidth : function(a) {
                        if (isNaN(a)) {
                            return
                        }
                        this.minWidth = a
                    },
                    getMinWidth : function() {
                        return this.minWidth
                    },
                    setMinHeight : function(a) {
                        if (isNaN(a)) {
                            return
                        }
                        this.minHeight = a
                    },
                    getMinHeight : function() {
                        return this.minHeight
                    },
                    setMaxWidth : function(a) {
                        if (isNaN(a)) {
                            return
                        }
                        this.maxWidth = a
                    },
                    getMaxWidth : function() {
                        return this.maxWidth
                    },
                    setMaxHeight : function(a) {
                        if (isNaN(a)) {
                            return
                        }
                        this.maxHeight = a
                    },
                    getMaxHeight : function() {
                        return this.maxHeight
                    },
                    setAllowDrag : function(a) {
                        this.allowDrag = a;
                        mini.removeClass(this.el, this._dragCls);
                        if (a) {
                            mini.addClass(this.el, this._dragCls)
                        }
                    },
                    getAllowDrag : function() {
                        return this.allowDrag
                    },
                    setShowMaxButton : function(b) {
                        this.showMaxButton = b;
                        var a = this.getButton("max");
                        if (!a) {
                            return
                        }
                        a.visible = b;
                        this._doTools()
                    },
                    getShowMaxButton : function() {
                        return this.showMaxButton
                    },
                    setShowMinButton : function(b) {
                        this.showMinButton = b;
                        var a = this.getButton("min");
                        if (!a) {
                            return
                        }
                        a.visible = b;
                        this._doTools()
                    },
                    getShowMinButton : function() {
                        return this.showMinButton
                    },
                    max : function() {
                        this.state = "max";
                        this.show();
                        var a = this.getButton("max");
                        if (a) {
                            a.cls = "mini-tools-restore";
                            this._doTools()
                        }
                    },
                    restore : function() {
                        this.state = "restore";
                        this.show(this.x, this.y);
                        var a = this.getButton("max");
                        if (a) {
                            a.cls = "mini-tools-max";
                            this._doTools()
                        }
                    },
                    showInBody : true,
                    setShowInBody : function(a) {
                        this.showInBody = a
                    },
                    getShowInBody : function() {
                        return this.showInBody
                    },
                    containerEl : null,
                    showAtPos : function(a, c, b) {
                        this.show(a, c, b)
                    },
                    show : function(a, g, b) {
                        this._allowLayout = false;
                        var d = this._containerEl || document.body;
                        if (!this.isRender()
                                || (this.el.parentNode != d && this.showInBody)) {
                            this.render(d)
                        }
                        this.el.style.zIndex = mini.getMaxZIndex();
                        this._doShow(a, g);
                        this._allowLayout = true;
                        this.setVisible(true);
                        if (this.state != "max") {
                            var c = this.getBox();
                            this.x = c.x;
                            this.y = c.y
                        }
                        try {
                            this.el.focus()
                        } catch (f) {
                        }
                    },
                    hide : function() {
                        this.setVisible(false);
                        this._doModal()
                    },
                    getWidth : function() {
                        this._headerEl.style.width = "50px";
                        var a = mini.getWidth(this.el);
                        this._headerEl.style.width = "auto";
                        return a
                    },
                    getBox : function() {
                        this._headerEl.style.width = "50px";
                        this.el.style.display = "";
                        var a = mini.getWidth(this.el);
                        this._headerEl.style.width = "auto";
                        var b = mini.getBox(this.el);
                        b.width = a;
                        b.right = b.x + a;
                        return b
                    },
                    _measureSize : function() {
                        this.el.style.display = "";
                        var a = this.getBox();
                        if (a.width > this.maxWidth) {
                            mini.setWidth(this.el, this.maxWidth);
                            a = this.getBox()
                        }
                        if (a.height > this.maxHeight) {
                            mini.setHeight(this.el, this.maxHeight);
                            a = this.getBox()
                        }
                        if (a.width < this.minWidth) {
                            mini.setWidth(this.el, this.minWidth);
                            a = this.getBox()
                        }
                        if (a.height < this.minHeight) {
                            mini.setHeight(this.el, this.minHeight);
                            a = this.getBox()
                        }
                    },
                    _doShow : function(a, d) {
                        var b = this.getParentBox();
                        if (this.state == "max") {
                            if (!this._width) {
                                var c = this.getBox();
                                this._width = c.width;
                                if (this.expanded) {
                                    this._height = c.height
                                }
                                this.x = c.x;
                                this.y = c.y
                            }
                        } else {
                            if (mini.isNull(a)) {
                                a = "center"
                            }
                            if (mini.isNull(d)) {
                                d = "middle"
                            }
                            this.el.style.position = "absolute";
                            this.el.style.left = "-2000px";
                            this.el.style.top = "-2000px";
                            this.el.style.display = "";
                            if (this._width) {
                                this.setWidth(this._width);
                                this.setHeight(this._height);
                                delete this._width;
                                delete this._height
                            } else {
                            }
                            this._measureSize();
                            var c = this.getBox();
                            if (a == "left") {
                                a = 0
                            }
                            if (a == "center") {
                                a = b.width / 2 - c.width / 2
                            }
                            if (a == "right") {
                                a = b.width - c.width
                            }
                            if (d == "top") {
                                d = 0
                            }
                            if (d == "middle") {
                                d = b.y + b.height / 2 - c.height / 2
                            }
                            if (d == "bottom") {
                                d = b.height - c.height
                            }
                            if (a + c.width > b.right) {
                                a = b.right - c.width
                            }
                            if (d + c.height > b.bottom) {
                                d = b.bottom - c.height
                            }
                            if (a < 0) {
                                a = 0
                            }
                            if (d < 0) {
                                d = 0
                            }
                            this.el.style.display = "";
                            mini.setX(this.el, a);
                            mini.setY(this.el, d)
                        }
                        this.doLayout()
                    },
                    _OnButtonClick : function(b, a) {
                        var c = mini.Window.superclass._OnButtonClick.call(
                                this, b, a);
                        if (c.cancel == true) {
                            return c
                        }
                        if (c.name == "max") {
                            if (this.state == "max") {
                                this.restore()
                            } else {
                                this.max()
                            }
                        }
                        return c
                    },
                    __OnWindowResize : function(a) {
                        if (this.state == "max") {
                            this.doLayout()
                        }
                        if (!mini.isIE6) {
                            this._doModal()
                        }
                    },
                    enableDragProxy : true,
                    setEnableDragProxy : function(a) {
                        this.enableDragProxy = a
                    },
                    getEnableDragProxy : function(a) {
                        return this.enableDragProxy
                    },
                    __OnWindowMouseDown : function(f) {
                        var d = this;
                        if (f.button != mini.MouseButton.Left) {
                            return
                        }
                        if (this.state != "max" && this.allowDrag
                                && mini.isAncestor(this._headerEl, f.target)
                                && !mini.findParent(f.target, "mini-tools")) {
                            var d = this;
                            if (this.el) {
                                this.el.style.zIndex = mini.getMaxZIndex()
                            }
                            var c = this.getBox();
                            var b = new mini.Drag(
                                    {
                                        capture : false,
                                        onStart : function() {
                                            d._maskProxy = mini
                                                    .append(document.body,
                                                            '<div class="mini-resizer-mask" style=""></div>');
                                            if (d.enableDragProxy) {
                                                d._dragProxy = mini
                                                        .append(document.body,
                                                                '<div class="mini-drag-proxy"></div>');
                                                d.el.style.display = "none"
                                            } else {
                                                d._dragProxy = d.el
                                            }
                                        },
                                        onMove : function(k) {
                                            var e = k.now[0] - k.init[0], l = k.now[1]
                                                    - k.init[1];
                                            e = c.x + e;
                                            l = c.y + l;
                                            var j = d.getParentBox();
                                            var i = e + c.width;
                                            var g = l + c.height;
                                            if (i > j.width) {
                                                e = j.width - c.width
                                            }
                                            if (e < 0) {
                                                e = 0
                                            }
                                            if (l < 0) {
                                                l = 0
                                            }
                                            d.x = e;
                                            d.y = l;
                                            var h = {
                                                x : e,
                                                y : l,
                                                width : c.width,
                                                height : c.height
                                            };
                                            mini.setBox(d._dragProxy, h);
                                            this.moved = true
                                        },
                                        onStop : function() {
                                            if (d.el) {
                                                d.el.style.display = "block";
                                                if (this.moved) {
                                                    var e = mini
                                                            .getBox(d._dragProxy);
                                                    mini.setBox(d.el, e)
                                                }
                                            }
                                            jQuery(d._maskProxy).remove();
                                            d._maskProxy = null;
                                            if (d.enableDragProxy) {
                                                jQuery(d._dragProxy).remove()
                                            }
                                            d._dragProxy = null
                                        }
                                    });
                            b.start(f);
                            var a = mini.append(document.body,
                                    '<div class="mini-resizer-mask"></div>');
                            setTimeout(function() {
                                mini.removeNode(a)
                            }, 300)
                        }
                    },
                    destroy : function(a) {
                        mini.un(window, "resize", this.__OnWindowResize, this);
                        if (this._modalEl) {
                            jQuery(this._modalEl).remove();
                            this._modalEl = null
                        }
                        if (this.shadowEl) {
                            jQuery(this.shadowEl).remove();
                            this.shadowEl = null
                        }
                        var b = "__modal" + this._id;
                        jQuery("[id='" + b + "']").remove();
                        mini.Window.superclass.destroy.call(this, a)
                    },
                    getAttrs : function(b) {
                        var a = mini.Window.superclass.getAttrs.call(this, b);
                        mini._ParseString(b, a, [ "modalStyle" ]);
                        mini._ParseBool(b, a, [ "showModal", "showShadow",
                                "allowDrag", "allowResize", "showMaxButton",
                                "showMinButton", "showInBody",
                                "enableDragProxy" ]);
                        mini._ParseInt(b, a, [ "minWidth", "minHeight",
                                "maxWidth", "maxHeight" ]);
                        return a
                    },
                    showAtEl : function(b, q) {
                        b = mini.byId(b);
                        if (!b) {
                            return
                        }
                        if (!this.isRender()
                                || this.el.parentNode != document.body) {
                            this.render(document.body)
                        }
                        var i = {
                            xAlign : this.xAlign,
                            yAlign : this.yAlign,
                            xOffset : 0,
                            yOffset : 0,
                            popupCls : this.popupCls
                        };
                        mini.copyTo(i, q);
                        this._popupEl = b;
                        this.el.style.position = "absolute";
                        this.el.style.left = "-2000px";
                        this.el.style.top = "-2000px";
                        this.el.style.display = "";
                        this.doLayout();
                        this._measureSize();
                        var j = mini.getViewportBox();
                        var f = this.getBox();
                        var e = mini.getBox(b);
                        var p = i.xy;
                        var g = i.xAlign, o = i.yAlign;
                        var m = j.width / 2 - f.width / 2, l = 0;
                        if (p) {
                            m = p[0];
                            l = p[1]
                        }
                        switch (i.xAlign) {
                        case "outleft":
                            m = e.x - f.width;
                            break;
                        case "left":
                            m = e.x;
                            break;
                        case "center":
                            m = e.x + e.width / 2 - f.width / 2;
                            break;
                        case "right":
                            m = e.right - f.width;
                            break;
                        case "outright":
                            m = e.right;
                            break;
                        default:
                            break
                        }
                        switch (i.yAlign) {
                        case "above":
                            l = e.y - f.height;
                            break;
                        case "top":
                            l = e.y;
                            break;
                        case "middle":
                            l = e.y + e.height / 2 - f.height / 2;
                            break;
                        case "bottom":
                            l = e.bottom - f.height;
                            break;
                        case "below":
                            l = e.bottom;
                            break;
                        default:
                            break
                        }
                        m = parseInt(m);
                        l = parseInt(l);
                        if (i.outYAlign || i.outXAlign) {
                            if (i.outYAlign == "above") {
                                if (l + f.height > j.bottom) {
                                    var k = e.y - j.y;
                                    var a = j.bottom - e.bottom;
                                    if (k > a) {
                                        l = e.y - f.height
                                    }
                                }
                            }
                            if (i.outXAlign == "outleft") {
                                if (m + f.width > j.right) {
                                    var d = e.x - j.x;
                                    var n = j.right - e.right;
                                    if (d > n) {
                                        m = e.x - f.width
                                    }
                                }
                            }
                            if (i.outXAlign == "right") {
                                if (m + f.width > j.right) {
                                    m = e.right - f.width
                                }
                            }
                            this._Show(m, l)
                        } else {
                            this.showAtPos(m + i.xOffset, l + i.yOffset)
                        }
                    }
                });
mini.regClass(mini.Window, "window");

mini.MessageBox = {
        alertTitle : "提醒",
        confirmTitle : "确认",
        prompTitle : "输入",
        prompMessage : "请输入内容：",
        buttonText : {
            ok : "确定",
            cancel : "取消",
            yes : "是",
            no : "否"
        },
        show : function(e) {
            e = mini.copyTo({
                width : "auto",
                height : "auto",
                showModal : true,
                timeout : 0,
                minWidth : 150,
                maxWidth : 800,
                minHeight : 50,
                maxHeight : 350,
                showHeader : true,
                title : "",
                titleIcon : "",
                iconCls : "",
                iconStyle : "",
                message : "",
                html : "",
                spaceStyle : "margin-right:15px",
                showCloseButton : true,
                buttons : null,
                buttonWidth : 58,
                callback : null
            }, e);
            e.message = String(e.message);
            var f = e.callback;
            var m = new mini.Window();
            m.setBodyStyle("overflow:hidden");
            m.setShowModal(e.showModal);
            m.setTitle(e.title || "");
            m.setIconCls(e.titleIcon);
            m.setShowHeader(e.showHeader);
            m.setShowCloseButton(e.showCloseButton);
            var d = m.uid + "$table", b = m.uid + "$content";
            var v = '<div class="' + e.iconCls + '" style="' + e.iconStyle
                    + '"></div>';
            var o = '<table class="mini-messagebox-table" id="' + d
                    + '" style="" cellspacing="0" cellpadding="0"><tr><td>' + v
                    + '</td><td id="' + b
                    + '" class="mini-messagebox-content-text">' + (e.message || "")
                    + "</td></tr></table>";
            var c = '<div class="mini-messagebox-content"></div><div class="mini-messagebox-buttons"></div>';
            m._bodyEl.innerHTML = c;
            var g = m._bodyEl.firstChild;
            if (e.html) {
                if (typeof e.html == "string") {
                    g.innerHTML = e.html
                } else {
                    if (mini.isElement(e.html)) {
                        g.appendChild(e.html)
                    }
                }
            } else {
                g.innerHTML = o
            }
            m._Buttons = [];
            var w = m._bodyEl.lastChild;
            if (e.buttons && e.buttons.length > 0) {
                for (var t = 0, r = e.buttons.length; t < r; t++) {
                    var a = e.buttons[t];
                    var n = mini.MessageBox.buttonText[a];
                    if (!n) {
                        n = a
                    }
                    var j = new mini.Button();
                    j.setText(n);
                    j.setWidth(e.buttonWidth);
                    j.render(w);
                    j.action = a;
                    j.on("click", function(l) {
                        var i = l.sender;
                        if (f) {
                            if (f(i.action) === false) {
                                return
                            }
                        }
                        mini.MessageBox.hide(m)
                    });
                    if (t != r - 1) {
                        j.setStyle(e.spaceStyle)
                    }
                    m._Buttons.push(j)
                }
            } else {
                w.style.display = "none"
            }
            m.setMinWidth(e.minWidth);
            m.setMinHeight(e.minHeight);
            m.setMaxWidth(e.maxWidth);
            m.setMaxHeight(e.maxHeight);
            m.setWidth(e.width);
            m.setHeight(e.height);
            m.show(e.x, e.y, {
                animType : e.animType
            });
            var q = m.getWidth();
            m.setWidth(q);
            var p = m.getHeight();
            m.setHeight(p);
            var k = document.getElementById(d);
            if (k) {
                k.style.width = "100%"
            }
            var h = document.getElementById(b);
            if (h) {
                h.style.width = "100%"
            }
            var u = m._Buttons[0];
            if (u) {
                u.focus()
            } else {
                m.focus()
            }
            m.on("beforebuttonclick", function(i) {
                if (f) {
                    f("close")
                }
                i.cancel = true;
                mini.MessageBox.hide(m)
            });
            mini.on(m.el, "keydown", function(i) {
            });
            if (e.timeout) {
                setTimeout(function() {
                    mini.MessageBox.hide(m.uid)
                }, e.timeout)
            }
            return m.uid
        },
        hide : function(e) {
            if (!e) {
                return
            }
            var d = typeof e == "object" ? e : mini.getbyUID(e);
            if (!d) {
                return
            }
            for (var c = 0, a = d._Buttons.length; c < a; c++) {
                var b = d._Buttons[c];
                b.destroy()
            }
            d._Buttons = null;
            d.destroy()
        },
        alert : function(a, b, c) {
            return mini.MessageBox.show({
                minWidth : 250,
                title : b || mini.MessageBox.alertTitle,
                buttons : [ "ok" ],
                message : a,
                iconCls : "mini-messagebox-warning",
                callback : c
            })
        },
        confirm : function(a, b, c) {
            return mini.MessageBox.show({
                minWidth : 250,
                title : b || mini.MessageBox.confirmTitle,
                buttons : [ "ok", "cancel" ],
                message : a,
                iconCls : "mini-messagebox-question",
                callback : c
            })
        },
        prompt : function(d, f, h, e) {
            var g = "prompt$" + new Date().getTime();
            var c = d || mini.MessageBox.promptMessage;
            if (e) {
                c = c
                        + '<br/><textarea id="'
                        + g
                        + '" style="width:200px;height:60px;margin-top:3px;"></textarea>'
            } else {
                c = c + '<br/><input id="' + g
                        + '" type="text" style="width:200px;margin-top:3px;"/>'
            }
            var b = mini.MessageBox.show({
                title : f || mini.MessageBox.promptTitle,
                buttons : [ "ok", "cancel" ],
                width : 250,
                html : '<div style="padding:5px;padding-left:10px;">' + c
                        + "</div>",
                callback : function(j) {
                    var i = document.getElementById(g);
                    if (h) {
                        return h(j, i.value)
                    }
                }
            });
            var a = document.getElementById(g);
            a.focus();
            return b
        },
        loading : function(a, b) {
            return mini.MessageBox.show({
                minHeight : 50,
                title : b,
                showCloseButton : false,
                message : a,
                iconCls : "mini-messagebox-waiting"
            })
        },
        showTips : function(b) {
            var d = jQuery;
            b = d.extend({
                content : "",
                state : "",
                x : "center",
                y : "top",
                offset : [ 10, 10 ],
                fixed : true,
                timeout : 2000
            }, b);
            var a = "mini-tips-" + b.state;
            var c = '<div class="mini-tips ' + a + '">' + b.content + "</div>";
            var e = d(c).appendTo(document.body);
            b.el = e[0];
            b.timeoutHandler = function() {
                e.slideUp();
                setTimeout(function() {
                    e.remove()
                }, 2000)
            };
            mini.showAt(b);
            e.hide().slideDown()
        }
    };
    mini.alert = mini.MessageBox.alert;
    mini.confirm = mini.MessageBox.confirm;
    mini.prompt = mini.MessageBox.prompt;
    mini.loading = mini.MessageBox.loading;
    mini.showMessageBox = mini.MessageBox.show;
    mini.hideMessageBox = mini.MessageBox.hide;
    mini.showTips = mini.MessageBox.showTips;