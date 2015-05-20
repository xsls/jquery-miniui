mini.Popup = function() {
    mini.Popup.superclass.constructor.call(this);
    this.setVisible(false);
    this.setAllowDrag(this.allowDrag);
    this.setAllowResize(this.allowResize)
};
mini.extend(mini.Popup, mini.Container, {
    _clearBorder : false,
    uiCls : "mini-popup",
    _create : function() {
        var a = this.el = document.createElement("div");
        this.el.className = "mini-popup";
        this._contentEl = this.el
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "mouseover", this.__OnMouseOver, this)
        }, this)
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        mini.Popup.superclass.doLayout.call(this);
        this._doShadow();
        var d = this.el.childNodes;
        if (d) {
            for (var b = 0, a = d.length; b < a; b++) {
                var c = d[b];
                mini.layout(c)
            }
        }
    },
    destroy : function(a) {
        if (this.el) {
            this.el.onmouseover = null
        }
        mini.un(document, "mousedown", this.__OnBodyMouseDown, this);
        mini.un(window, "resize", this.__OnWindowResize, this);
        if (this._modalEl) {
            jQuery(this._modalEl).remove();
            this._modalEl = null
        }
        if (this.shadowEl) {
            jQuery(this.shadowEl).remove();
            this.shadowEl = null
        }
        if (this._shim) {
            jQuery(this._shim).remove();
            this._shim = null
        }
        mini.Popup.superclass.destroy.call(this, a)
    },
    setWidth : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.width = a;
        if (a.indexOf("px") != -1) {
            mini.setWidth(this.el, a)
        } else {
            this.el.style.width = a
        }
        this._sizeChanged()
    },
    setHeight : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.height = a;
        if (a.indexOf("px") != -1) {
            mini.setHeight(this.el, a)
        } else {
            this.el.style.height = a
        }
        this._sizeChanged()
    },
    setBody : function(c) {
        if (!c) {
            return
        }
        if (!mini.isArray(c)) {
            c = [ c ]
        }
        for (var b = 0, a = c.length; b < a; b++) {
            mini.append(this._contentEl, c[b])
        }
    },
    getAttrs : function(c) {
        var a = mini.Popup.superclass.getAttrs.call(this, c);
        mini._ParseString(c, a, [ "popupEl", "popupCls", "showAction",
                "hideAction", "xAlign", "yAlign", "modalStyle", "onbeforeopen",
                "open", "onbeforeclose", "onclose" ]);
        mini._ParseBool(c, a, [ "showModal", "showShadow", "allowDrag",
                "allowResize" ]);
        mini._ParseInt(c, a, [ "showDelay", "hideDelay", "xOffset", "yOffset",
                "minWidth", "minHeight", "maxWidth", "maxHeight" ]);
        var b = mini.getChildNodes(c, true);
        a.body = b;
        return a
    }
});
mini.regClass(mini.Popup, "popup");
mini.Popup_prototype = {
    isPopup : false,
    popupEl : null,
    popupCls : "",
    showAction : "mouseover",
    hideAction : "outerclick",
    showDelay : 300,
    hideDelay : 500,
    xAlign : "left",
    yAlign : "below",
    xOffset : 0,
    yOffset : 0,
    minWidth : 50,
    minHeight : 25,
    maxWidth : 2000,
    maxHeight : 2000,
    showModal : false,
    showShadow : true,
    modalStyle : "opacity:0.2",
    _dragCls : "mini-popup-drag",
    _resizeCls : "mini-popup-resize",
    allowDrag : false,
    allowResize : false,
    _unbindPopupEl : function() {
        if (!this.popupEl) {
            return
        }
        mini.un(this.popupEl, "click", this.__OnLeftClick, this);
        mini.un(this.popupEl, "contextmenu", this.__OnRightClick, this);
        mini.un(this.popupEl, "mouseover", this.__OnMouseOver, this)
    },
    _bindPopupEl : function() {
        if (!this.popupEl) {
            return
        }
        mini.on(this.popupEl, "click", this.__OnLeftClick, this);
        mini.on(this.popupEl, "contextmenu", this.__OnRightClick, this);
        mini.on(this.popupEl, "mouseover", this.__OnMouseOver, this)
    },
    doShow : function(c) {
        var b = {
            popupEl : this.popupEl,
            htmlEvent : c,
            cancel : false
        };
        this.fire("BeforeOpen", b);
        if (b.cancel == true) {
            return
        }
        this.fire("opening", b);
        if (b.cancel == true) {
            return
        }
        if (!this.popupEl) {
            this.show()
        } else {
            var a = {};
            if (c) {
                a.xy = [ c.pageX, c.pageY ]
            }
            this.showAtEl(this.popupEl, a)
        }
    },
    doHide : function(b) {
        var a = {
            popupEl : this.popupEl,
            htmlEvent : b,
            cancel : false
        };
        this.fire("BeforeClose", a);
        if (a.cancel == true) {
            return
        }
        this.close()
    },
    show : function(b, a) {
        this.showAtPos(b, a)
    },
    showAtPos : function(a, d) {
        this.render(document.body);
        if (!a) {
            a = "center"
        }
        if (!d) {
            d = "middle"
        }
        this.el.style.position = "absolute";
        this.el.style.left = "-2000px";
        this.el.style.top = "-2000px";
        this.el.style.display = "";
        this._measureSize();
        var b = mini.getViewportBox();
        var c = mini.getBox(this.el);
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
            d = b.bottom - c.height - 20
        }
        this._Show(a, d)
    },
    _doModal : function() {
        jQuery(this._modalEl).remove();
        if (!this.showModal) {
            return
        }
        if (this.visible == false) {
            return
        }
        var b = document.documentElement;
        var c = parseInt(Math.max(document.body.scrollWidth, b ? b.scrollWidth
                : 0));
        var f = parseInt(Math.max(document.body.scrollHeight,
                b ? b.scrollHeight : 0));
        var d = mini.getViewportBox();
        var a = d.height;
        if (a < f) {
            a = f
        }
        var e = d.width;
        if (e < c) {
            e = c
        }
        this._modalEl = mini.append(document.body,
                '<div class="mini-modal"></div>');
        this._modalEl.style.height = a + "px";
        this._modalEl.style.width = e + "px";
        this._modalEl.style.zIndex = mini.getStyle(this.el, "zIndex") - 1;
        mini.setStyle(this._modalEl, this.modalStyle)
    },
    _doShim : function() {
        if (!mini.isIE || !mini_useShims) {
            return
        }
        if (!this._shimEl) {
            var b = "<iframe frameborder='0' style='position: absolute; z-index: -1; width: 0; height: 0; top: 0;left:0;scrolling:no;'></iframe>";
            this._shimEl = mini.append(document.body, b)
        }
        function a() {
            this._shimEl.style.display = "";
            var f = mini.getBox(this.el);
            var e = this._shimEl.style;
            e.width = f.width + "px";
            e.height = f.height + "px";
            e.left = f.x + "px";
            e.top = f.y + "px";
            var d = mini.getStyle(this.el, "zIndex");
            if (!isNaN(d)) {
                this._shimEl.style.zIndex = d - 3
            }
        }
        this._shimEl.style.display = "none";
        if (this._doShimTimer) {
            clearTimeout(this._doShimTimer);
            this._doShimTimer = null
        }
        var c = this;
        this._doShimTimer = setTimeout(function() {
            c._doShimTimer = null;
            a.call(c)
        }, 20)
    },
    _doShadow : function() {
        if (!this.shadowEl) {
            this.shadowEl = mini.append(document.body,
                    '<div class="mini-shadow"></div>')
        }
        this.shadowEl.style.display = this.showShadow ? "" : "none";
        if (this.showShadow) {
            function b() {
                this.shadowEl.style.display = "";
                var e = mini.getBox(this.el);
                var d = this.shadowEl.style;
                d.width = e.width + "px";
                d.height = e.height + "px";
                d.left = e.x + "px";
                d.top = e.y + "px";
                var c = mini.getStyle(this.el, "zIndex");
                if (!isNaN(c)) {
                    this.shadowEl.style.zIndex = c - 2
                }
            }
            this.shadowEl.style.display = "none";
            if (this._doShadowTimer) {
                clearTimeout(this._doShadowTimer);
                this._doShadowTimer = null
            }
            var a = this;
            this._doShadowTimer = setTimeout(function() {
                a._doShadowTimer = null;
                b.call(a)
            }, 20)
        }
    },
    _measureSize : function() {
        this.el.style.display = "";
        var a = mini.getBox(this.el);
        if (a.width > this.maxWidth) {
            mini.setWidth(this.el, this.maxWidth);
            a = mini.getBox(this.el)
        }
        if (a.height > this.maxHeight) {
            mini.setHeight(this.el, this.maxHeight);
            a = mini.getBox(this.el)
        }
        if (a.width < this.minWidth) {
            mini.setWidth(this.el, this.minWidth);
            a = mini.getBox(this.el)
        }
        if (a.height < this.minHeight) {
            mini.setHeight(this.el, this.minHeight);
            a = mini.getBox(this.el)
        }
    },
    _getWindowOffset : function(a) {
        return [ 0, 0 ]
    },
    showAtEl : function(b, r) {
        b = mini.byId(b);
        if (!b) {
            return
        }
        if (!this.isRender() || this.el.parentNode != document.body) {
            this.render(document.body)
        }
        var i = {
            atEl : b,
            popupEl : this.el,
            xAlign : this.xAlign,
            yAlign : this.yAlign,
            xOffset : this.xOffset,
            yOffset : this.yOffset,
            popupCls : this.popupCls
        };
        mini.copyTo(i, r);
        mini.addClass(b, i.popupCls);
        b.popupCls = i.popupCls;
        this._popupEl = b;
        this.el.style.position = "absolute";
        this.el.style.left = "-2000px";
        this.el.style.top = "-2000px";
        this.el.style.display = "";
        this.doLayout();
        this._measureSize();
        var j = mini.getViewportBox();
        var f = mini.getBox(this.el);
        var e = mini.getBox(b);
        var q = i.xy;
        var g = i.xAlign, p = i.yAlign;
        var m = j.width / 2 - f.width / 2, l = 0;
        if (q) {
            m = q[0];
            l = q[1]
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
        var n = this._getWindowOffset(r);
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
            if (i.outYAlign == "below") {
                if (l + f.height > j.bottom) {
                    var k = e.y - j.y;
                    var a = j.bottom - e.bottom;
                    if (k > a) {
                        l = e.y + e.height - f.height
                    }
                }
            }
            if (i.outXAlign == "outleft") {
                if (m + f.width > j.right) {
                    var d = e.x - j.x;
                    var o = j.right - e.right;
                    if (d > o) {
                        m = e.x - f.width
                    }
                }
            }
            if (i.outXAlign == "right") {
                if (m + f.width > j.right) {
                    m = e.right - f.width
                }
            }
            this._Show(m + n[0], l + n[1])
        } else {
            this.showAtPos(m + i.xOffset + n[0], l + i.yOffset + n[1])
        }
    },
    _Show : function(a, c) {
        this.el.style.display = "";
        this.el.style.zIndex = mini.getMaxZIndex();
        mini.setX(this.el, a);
        mini.setY(this.el, c);
        this.setVisible(true);
        if (this.hideAction == "mouseout") {
            mini.on(document, "mousemove", this.__OnBodyMouseMove, this)
        }
        var b = this;
        this._doShadow();
        this._doModal();
        this._doShim();
        mini.layoutIFrames(this.el);
        this.isPopup = true;
        mini.on(document, "mousedown", this.__OnBodyMouseDown, this);
        mini.on(window, "resize", this.__OnWindowResize, this);
        this.fire("Open")
    },
    open : function() {
        this.show()
    },
    close : function() {
        this.hide()
    },
    hide : function() {
        if (!this.el) {
            return
        }
        if (this.popupEl) {
            mini.removeClass(this.popupEl, this.popupEl.popupCls)
        }
        if (this._popupEl) {
            mini.removeClass(this._popupEl, this._popupEl.popupCls)
        }
        this._popupEl = null;
        jQuery(this._modalEl).remove();
        if (this.shadowEl) {
            this.shadowEl.style.display = "none"
        }
        if (this._shimEl) {
            this._shimEl.style.display = "none"
        }
        mini.un(document, "mousemove", this.__OnBodyMouseMove, this);
        mini.un(document, "mousedown", this.__OnBodyMouseDown, this);
        mini.un(window, "resize", this.__OnWindowResize, this);
        this.setVisible(false);
        this.isPopup = false;
        this.fire("Close")
    },
    setPopupEl : function(a) {
        a = mini.byId(a);
        if (!a) {
            return
        }
        this._unbindPopupEl();
        this.popupEl = a;
        this._bindPopupEl()
    },
    setPopupCls : function(a) {
        this.popupCls = a
    },
    setShowAction : function(a) {
        this.showAction = a
    },
    setHideAction : function(a) {
        this.hideAction = a
    },
    setShowDelay : function(a) {
        this.showDelay = a
    },
    setHideDelay : function(a) {
        this.hideDelay = a
    },
    setXAlign : function(a) {
        this.xAlign = a
    },
    setYAlign : function(a) {
        this.yAlign = a
    },
    setxOffset : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            a = 0
        }
        this.xOffset = a
    },
    setyOffset : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            a = 0
        }
        this.yOffset = a
    },
    setShowModal : function(a) {
        this.showModal = a
    },
    setShowShadow : function(a) {
        this.showShadow = a
    },
    setMinWidth : function(a) {
        if (isNaN(a)) {
            return
        }
        this.minWidth = a
    },
    setMinHeight : function(a) {
        if (isNaN(a)) {
            return
        }
        this.minHeight = a
    },
    setMaxWidth : function(a) {
        if (isNaN(a)) {
            return
        }
        this.maxWidth = a
    },
    setMaxHeight : function(a) {
        if (isNaN(a)) {
            return
        }
        this.maxHeight = a
    },
    setAllowDrag : function(a) {
        this.allowDrag = a;
        mini.removeClass(this.el, this._dragCls);
        if (a) {
            mini.addClass(this.el, this._dragCls)
        }
    },
    setAllowResize : function(a) {
        this.allowResize = a;
        mini.removeClass(this.el, this._resizeCls);
        if (a) {
            mini.addClass(this.el, this._resizeCls)
        }
    },
    __OnLeftClick : function(b) {
        if (this._inAniming) {
            return
        }
        if (this.showAction != "leftclick") {
            return
        }
        var a = jQuery(this.popupEl).attr("allowPopup");
        if (String(a) == "false") {
            return
        }
        this.doShow(b)
    },
    __OnRightClick : function(b) {
        if (this._inAniming) {
            return
        }
        if (this.showAction != "rightclick") {
            return
        }
        var a = jQuery(this.popupEl).attr("allowPopup");
        if (String(a) == "false") {
            return
        }
        b.preventDefault();
        this.doShow(b)
    },
    __OnMouseOver : function(c) {
        if (this._inAniming) {
            return
        }
        if (this.showAction != "mouseover") {
            return
        }
        var a = jQuery(this.popupEl).attr("allowPopup");
        if (String(a) == "false") {
            return
        }
        clearTimeout(this._hideTimer);
        this._hideTimer = null;
        if (this.isPopup) {
            return
        }
        var b = this;
        this._showTimer = setTimeout(function() {
            b.doShow(c)
        }, this.showDelay)
    },
    __OnBodyMouseMove : function(a) {
        if (this.hideAction != "mouseout") {
            return
        }
        this._tryHide(a)
    },
    __OnBodyMouseDown : function(a) {
        if (this.hideAction != "outerclick") {
            return
        }
        if (!this.isPopup) {
            return
        }
        if (this.within(a)
                || (this.popupEl && mini.isAncestor(this.popupEl, a.target))) {
        } else {
            this.doHide(a)
        }
    },
    _tryHide : function(b) {
        if (mini.isAncestor(this.el, b.target)
                || (this.popupEl && mini.isAncestor(this.popupEl, b.target))) {
        } else {
            clearTimeout(this._showTimer);
            this._showTimer = null;
            if (this._hideTimer) {
                return
            }
            var a = this;
            this._hideTimer = setTimeout(function() {
                a.doHide(b)
            }, this.hideDelay)
        }
    },
    __OnWindowResize : function(a) {
        if (this.isDisplay() && !mini.isIE6) {
            this._doModal()
        }
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
};
mini.copyTo(mini.Popup.prototype, mini.Popup_prototype);